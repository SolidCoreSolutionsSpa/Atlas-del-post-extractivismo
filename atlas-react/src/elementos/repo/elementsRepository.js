import { atlasContent as newAtlasContent } from '../../shared/data/newAtlasContent'
import {
  createAffectationType,
  createElement,
  createElementTag,
  createTag,
} from '../model/elementModel'

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'sin-clasificar'
}

// Extraer todos los elementos de la estructura jerárquica de newAtlasContent
const allElements = []
newAtlasContent.caseOfStudies.forEach((caseStudy) => {
  if (caseStudy.zones && Array.isArray(caseStudy.zones)) {
    caseStudy.zones.forEach((zone) => {
      if (zone.escenes && Array.isArray(zone.escenes)) {
        zone.escenes.forEach((scene) => {
          if (scene.elements && Array.isArray(scene.elements)) {
            scene.elements.forEach((element) => {
              allElements.push({
                ...element,
                sceneId: scene.id,
              })
            })
          }
        })
      }
    })
  }
})

const affectationTypeMap = new Map()
const tagMap = new Map()

allElements.forEach((item) => {
  const affectationName = item.affectation_type?.name || 'Sin clasificar'
  const typeSlug = slugify(affectationName)
  if (!affectationTypeMap.has(typeSlug)) {
    affectationTypeMap.set(
      typeSlug,
      createAffectationType({
        id: typeSlug,
        name: affectationName,
        description: '',
      }),
    )
  }

  if (item.keywords && Array.isArray(item.keywords)) {
    item.keywords.forEach((keyword) => {
      const tagLabel = keyword.name
      const tagSlug = slugify(tagLabel)
      if (!tagMap.has(tagSlug)) {
        tagMap.set(
          tagSlug,
          createTag({
            id: tagSlug,
            label: tagLabel,
          }),
        )
      }
    })
  }
})

const seedAffectationTypes = Array.from(affectationTypeMap.values())
const seedTags = Array.from(tagMap.values())

const seedElements = allElements.map((item) =>
  createElement({
    id: item.id,
    sceneId: item.sceneId,
    name: item.title,
    subtitle: item.title,
    image: item.image_path,
    detailImagePath: item.detail_image_path ?? null,
    body: item.description,
    source: item.source,
    affectationTypeId: slugify(item.affectation_type?.name || 'Sin clasificar'),
  }),
)

const seedElementTags = allElements.flatMap((item) => {
  if (!item.keywords || !Array.isArray(item.keywords)) {
    return []
  }
  return item.keywords.map((keyword) =>
    createElementTag({
      elementId: item.id,
      tagId: slugify(keyword.name),
    }),
  )
})

export class ElementsRepository {
  /**
   * @param {{
   *   limit?: number,
   *   cursor?: string | null
   * }} params
   * @returns {Promise<{ items: import('../model/elementModel').Element[], nextCursor: string | null }>}
   */
  async listPaginated(params = {}) {
    throw new Error('ElementsRepository.listPaginated() no implementado')
  }

  /**
   * @param {string} elementId
   * @returns {Promise<import('../model/elementModel').Element | null>}
   */
  async findById(elementId) {
    throw new Error('ElementsRepository.findById() no implementado')
  }

  /**
   * @param {string} elementId
   * @returns {Promise<{ element: import('../model/elementModel').Element, tags: import('../model/elementModel').Tag[], affectationType: import('../model/elementModel').AffectationType | null } | null>}
   */
  async getElementWithTags(elementId) {
    throw new Error('ElementsRepository.getElementWithTags() no implementado')
  }

  /**
   * @param {{
   *   tagIds: string[],
   *   excludeIds?: string[],
   *   limit?: number,
   *   cursor?: string | null
   * }} params
   * @returns {Promise<{ items: Array<{ element: import('../model/elementModel').Element, tags: import('../model/elementModel').Tag[], sharedTagIds: string[] }>, nextCursor: string | null }>}
   */
  async findElementsWithSharedTags(params) {
    throw new Error('ElementsRepository.findElementsWithSharedTags() no implementado')
  }

  /**
   * @param {string} sceneId
   * @returns {Promise<import('../model/elementModel').Element[]>}
   */
  async findBySceneId(sceneId) {
    throw new Error('ElementsRepository.findBySceneId() no implementado')
  }
}

class InMemoryElementsRepository extends ElementsRepository {
  constructor({
    elements = seedElements,
    tags = seedTags,
    affectationTypes = seedAffectationTypes,
    elementTags = seedElementTags,
  } = {}) {
    super()
    this.elements = elements
    this.tags = tags
    this.affectationTypes = affectationTypes
    this.elementTags = elementTags

    this.elementIndex = new Map(elements.map((el) => [el.id, el]))
    this.tagIndex = new Map(tags.map((tag) => [tag.id, tag]))
    this.affectationIndex = new Map(
      affectationTypes.map((type) => [type.id, type]),
    )

    this.elementTagMap = new Map()
    this.tagToElement = new Map()
    for (const link of elementTags) {
      const list = this.elementTagMap.get(link.elementId) ?? new Set()
      list.add(link.tagId)
      this.elementTagMap.set(link.elementId, list)

      const elementList = this.tagToElement.get(link.tagId) ?? new Set()
      elementList.add(link.elementId)
      this.tagToElement.set(link.tagId, elementList)
    }
  }

  async listPaginated({ limit = 10, cursor = null } = {}) {
    const startIndex = cursor
      ? this.elements.findIndex((element) => element.id === cursor) + 1
      : 0

    const slice = this.elements.slice(startIndex, startIndex + limit)
    const nextCursor =
      slice.length === limit ? slice[slice.length - 1].id : null

    return { items: slice, nextCursor }
  }

  async findById(elementId) {
    return this.elementIndex.get(elementId) ?? null
  }

  async getElementWithTags(elementId) {
    const element = await this.findById(elementId)
    if (!element) {
      return null
    }

    const tags = this.getTagsForElement(elementId)
    const affectationType = this.affectationIndex.get(
      element.affectationTypeId,
    )

    return {
      element,
      tags,
      affectationType: affectationType ?? null,
    }
  }

  async findElementsWithSharedTags({
    tagIds,
    excludeIds = [],
    limit = 5,
    cursor = null,
  }) {
    const excludeSet = new Set(excludeIds)
    const accumulator = new Map()

    for (const tagId of tagIds) {
      const elementIds = this.tagToElement.get(tagId)
      if (!elementIds) {
        continue
      }

      for (const elementId of elementIds) {
        if (excludeSet.has(elementId)) {
          continue
        }
        const element = this.elementIndex.get(elementId)
        if (!element) {
          continue
        }

        const entry =
          accumulator.get(elementId) ??
          {
            element,
            sharedTagIds: new Set(),
          }

        entry.sharedTagIds.add(tagId)
        accumulator.set(elementId, entry)
      }
    }

    const sorted = Array.from(accumulator.values())
      .map((entry) => ({
        element: entry.element,
        sharedTagIds: Array.from(entry.sharedTagIds),
        tags: this.getTagsForElement(entry.element.id),
      }))
      .sort((a, b) => {
        const diff = b.sharedTagIds.length - a.sharedTagIds.length
        if (diff !== 0) {
          return diff
        }
        return a.element.name.localeCompare(b.element.name)
      })

    const startIndex = cursor
      ? sorted.findIndex((entry) => entry.element.id === cursor) + 1
      : 0

    const slice = sorted.slice(startIndex, startIndex + limit)
    const nextCursor =
      slice.length === limit ? slice[slice.length - 1].element.id : null

    return { items: slice, nextCursor }
  }

  getTagsForElement(elementId) {
    const tagIds = this.elementTagMap.get(elementId)
    if (!tagIds) {
      return []
    }

    return Array.from(tagIds)
      .map((id) => this.tagIndex.get(id))
      .filter(Boolean)
  }

  async findBySceneId(sceneId) {
    return this.elements.filter((element) => element.sceneId === sceneId)
  }
}

export const inMemoryElementsRepository = new InMemoryElementsRepository()
