import { createContext, useContext, useMemo } from 'react'
import { useAtlasData } from './AtlasDataContext'

// Import repository classes
import { InMemoryElementsRepository } from '../../elementos/repo/elementsRepository'
import { InMemoryZonasRepository } from '../../zonas/repo/zonasRepository'
import { InMemoryEscenasRepository } from '../../escenas/repo/escenasRepository'
import { CaseStudiesRepository } from '../../casosDeEstudio/repo/caseStudiesRepository'

// Import models and helpers
import {
  createAffectationType,
  createElement,
  createElementTag,
  createTag,
} from '../../elementos/model/elementModel'
import { createZone } from '../../zonas/model/zoneModel'
import { createScene } from '../../escenas/model/sceneModel'
import { ZoneDTO } from '../../zonas/model/ZoneDTO'
import { SceneDTO } from '../../escenas/model/SceneDTO'
import {
  mapCaseStudyFields,
  mapPosition,
  mapDecorationFields,
} from '../../casosDeEstudio/mappers/fieldMappers'
import { createCaseStudy } from '../../casosDeEstudio/model/caseStudyModel'

const AtlasRepositoriesContext = createContext(null)

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'sin-clasificar'
}

// Transform functions for elements repository
function buildElementsData(atlasData) {
  if (!atlasData?.caseOfStudies) return { elements: [], tags: [], affectationTypes: [], elementTags: [] }

  // Extract all elements
  const allElements = []
  atlasData.caseOfStudies.forEach((caseStudy) => {
    if (caseStudy.zones && Array.isArray(caseStudy.zones)) {
      caseStudy.zones.forEach((zone) => {
        if (zone.scenes && Array.isArray(zone.scenes)) {
          zone.scenes.forEach((scene) => {
            if (scene.elements && Array.isArray(scene.elements)) {
              scene.elements.forEach((element) => {
                allElements.push({
                  ...element,
                  sceneId: scene.slug,
                })
              })
            }
          })
        }
      })
    }
  })

  // Build affectation types
  const affectationTypes = (atlasData.affectationTypes || []).map((type) =>
    createAffectationType({
      id: type.slug,
      name: type.name,
      description: type.description,
    }),
  )

  // Build tags
  const tagMap = new Map()
  allElements.forEach((item) => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tagName) => {
        const tagSlug = slugify(tagName)
        if (!tagMap.has(tagSlug)) {
          tagMap.set(
            tagSlug,
            createTag({
              id: tagSlug,
              label: tagName,
            }),
          )
        }
      })
    }
  })
  const tags = Array.from(tagMap.values())

  // Build elements
  const elements = allElements.map((item) =>
    createElement({
      id: item.slug,
      sceneId: item.sceneId,
      name: item.title,
      subtitle: item.subtitle || null,
      image: item.image_path,
      detailImagePath: item.detail_image_path ?? null,
      body: item.description,
      source: item.source,
      affectationTypeId: item.affectation_type_id || 'anthropic',
    }),
  )

  // Build element tags
  const elementTags = allElements.flatMap((item) => {
    if (!item.tags || !Array.isArray(item.tags)) {
      return []
    }
    return item.tags.map((tagName) =>
      createElementTag({
        elementId: item.slug,
        tagId: slugify(tagName),
      }),
    )
  })

  return { elements, tags, affectationTypes, elementTags }
}

// Transform functions for zones repository
function buildZonesData(atlasData) {
  if (!atlasData?.caseOfStudies) return []

  const zones = []
  atlasData.caseOfStudies.forEach((caseStudy) => {
    if (caseStudy.zones && Array.isArray(caseStudy.zones)) {
      caseStudy.zones.forEach((zone) => {
        const zoneDTO = ZoneDTO.fromNewAtlasContent(zone)
        const zoneEntity = zoneDTO.toEntity(caseStudy.slug)
        const createdZone = createZone({
          id: zoneEntity.id,
          caseStudyId: zoneEntity.caseStudyId,
          name: zoneEntity.name,
          description: zoneEntity.description,
          summary: zoneEntity.summary,
          sceneIds: zoneEntity.sceneIds,
          map: zoneEntity.map,
        })
        zones.push(createdZone)
      })
    }
  })

  return zones
}

// Transform functions for scenes repository
function buildScenesData(atlasData) {
  if (!atlasData?.caseOfStudies) return []

  const scenes = []
  atlasData.caseOfStudies.forEach((caseStudy) => {
    if (caseStudy.zones && Array.isArray(caseStudy.zones)) {
      caseStudy.zones.forEach((zone) => {
        if (zone.scenes && Array.isArray(zone.scenes)) {
          zone.scenes.forEach((scene) => {
            const sceneDTO = SceneDTO.fromNewAtlasContent(scene)
          const sceneEntity = sceneDTO.toEntity(zone.slug)
          const createdScene = createScene({
            id: sceneEntity.id,
            zoneId: sceneEntity.zoneId,
            name: sceneEntity.name,
            summary: sceneEntity.summary,
            map: sceneEntity.map,
          })
            scenes.push(createdScene)
          })
        }
      })
    }
  })

  return scenes
}

// Transform functions for case studies repository
function buildDetailMap(caseStudy) {
  const zones = (caseStudy.zones || []).map((zone) => ({
    id: zone.slug,
    name: zone.title,
    position: mapPosition(zone.position_left, zone.position_top),
  }))

  const allDecorations = (caseStudy.zones || []).flatMap((zone) =>
    (zone.scenes || [])
      .filter((scene) => scene.decoration_image_path)
      .map((scene) => ({
        ...mapDecorationFields(scene),
        zoneId: zone.slug,
      })),
  )

  return {
    image: caseStudy.image_path,
    zones,
    decorations: allDecorations,
  }
}

function buildCaseStudiesData(atlasData) {
  if (!atlasData?.caseOfStudies) return { caseStudies: [], zones: [], scenes: [], elements: [] }

  const caseStudies = atlasData.caseOfStudies.map((raw) => {
    const mapped = mapCaseStudyFields(raw)
    const detailMap = buildDetailMap(raw)
    const globalMap = {
      image: mapped.image_path,
      points: [
        {
          id: `punto-${mapped.slug}`,
          ...mapPosition(mapped.position_left, mapped.position_top),
          label: mapped.title,
          zoneId: null,
        },
      ],
    }

    return createCaseStudy({
      ...mapped,
      id: mapped.slug,
      location: mapped.title,
      zoneIds: raw.zones?.map((z) => z.slug) || [],
      globalMap,
      detailMap,
    })
  })

  // Also build zones, scenes, elements for caseStudiesRepository exports
  const zones = []
  const scenes = []
  const elements = []

  for (const caseStudy of atlasData.caseOfStudies) {
    for (const rawZone of caseStudy.zones || []) {
      zones.push({
        id: rawZone.slug,
        caseId: caseStudy.slug,
        mapImage: rawZone.image_path,
        name: rawZone.title,
        summary: rawZone.summary ?? '',
        position: mapPosition(rawZone.position_left, rawZone.position_top),
        sceneIds: rawZone.scenes?.map((s) => s.slug) || [],
      })

      for (const rawScene of rawZone.scenes || []) {
        scenes.push({
          id: rawScene.slug,
          zoneId: rawZone.slug,
          mapImage: rawScene.image_path,
          name: rawScene.title,
           summary: rawScene.summary ?? '',
          position: mapPosition(rawScene.position_left, rawScene.position_top),
          elementIds: rawScene.elements?.map((e) => e.slug) || [],
        })

        for (const rawElement of rawScene.elements || []) {
          elements.push({
            id: rawElement.slug,
            sceneId: rawScene.slug,
            body: rawElement.description,
          })
        }
      }
    }
  }

  return { caseStudies, zones, scenes, elements }
}

export function AtlasRepositoriesProvider({ children }) {
  const { atlasData, isLoading, error } = useAtlasData()

  const repositories = useMemo(() => {
    if (!atlasData) return null

    // Build data for each repository
    const elementsData = buildElementsData(atlasData)
    const zonesData = buildZonesData(atlasData)
    const scenesData = buildScenesData(atlasData)
    const caseStudiesData = buildCaseStudiesData(atlasData)

    // Create repository instances
    const elementsRepository = new InMemoryElementsRepository({
      elements: elementsData.elements,
      tags: elementsData.tags,
      affectationTypes: elementsData.affectationTypes,
      elementTags: elementsData.elementTags,
    })

    const zonasRepository = new InMemoryZonasRepository(zonesData)
    const escenasRepository = new InMemoryEscenasRepository({ scenes: scenesData })

    // For caseStudiesRepository, we need to create a class that uses the built data
    const caseStudiesRepository = {
      list: async () => caseStudiesData.caseStudies,
      findById: async (id) => caseStudiesData.caseStudies.find((item) => item.id === id) ?? null,
    }

    return {
      elementsRepository,
      zonasRepository,
      escenasRepository,
      caseStudiesRepository,
      // Also expose the raw collections for components that need them
      caseStudies: caseStudiesData.caseStudies,
      zones: caseStudiesData.zones,
      scenes: caseStudiesData.scenes,
      elements: caseStudiesData.elements,
    }
  }, [atlasData])

  const value = {
    ...repositories,
    isLoading,
    error,
  }

  return (
    <AtlasRepositoriesContext.Provider value={value}>
      {children}
    </AtlasRepositoriesContext.Provider>
  )
}

export function useRepositories() {
  const context = useContext(AtlasRepositoriesContext)

  if (context === null) {
    throw new Error('useRepositories must be used within an AtlasRepositoriesProvider')
  }

  return context
}
