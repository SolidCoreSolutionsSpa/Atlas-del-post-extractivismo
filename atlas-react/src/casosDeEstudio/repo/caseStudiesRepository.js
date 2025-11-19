import { atlasContent as rawAtlasContent } from '../../shared/data/newAtlasContent.js'
import {
  mapCaseStudyFields,
  mapZoneFields,
  mapSceneFields,
  mapElementFields,
  mapDecorationFields,
  mapPosition
} from '../mappers/fieldMappers'
import { createCaseStudy } from '../model/caseStudyModel'

// --- Data Transformation and Query Layer (Integrated into Repository) ---

function buildDetailMap (caseStudy) {
  const zones = (caseStudy.zones || []).map(zone => ({
    id: zone.slug,
    name: zone.title,
    position: mapPosition(zone.position_left, zone.position_top)
  }))

  // Extract decorations from scenes instead of zones
  const allDecorations = (caseStudy.zones || [])
    .flatMap(zone =>
      (zone.scenes || [])
        .filter(scene => scene.decoration_image_path) // Only scenes with decoration
        .map(scene => ({
          ...mapDecorationFields(scene),
          zoneId: zone.slug // Keep zone association for hover functionality
        }))
    )

  return {
    image: caseStudy.image_path,
    zones,
    decorations: allDecorations,
  }
}

function transformCaseStudies () {
  return rawAtlasContent.caseOfStudies.map(raw => {
    const mapped = mapCaseStudyFields(raw)
    const detailMap = buildDetailMap(raw)
    const globalMap = {
      image: mapped.image_path,
      points: [{
        id: `punto-${mapped.slug}`,
        ...mapPosition(mapped.position_left, mapped.position_top),
        label: mapped.title,
        zoneId: null
      }]
    }

    return createCaseStudy({
      ...mapped,
      id: mapped.slug,
      location: mapped.title,
      zoneIds: raw.zones?.map(z => z.slug) || [],
      globalMap,
      detailMap
    })
  })
}

function transformZones () {
  const zones = []
  for (const caseStudy of rawAtlasContent.caseOfStudies) {
    for (const rawZone of caseStudy.zones || []) {
      zones.push({
        ...mapZoneFields(rawZone),
        id: rawZone.slug,
        caseId: caseStudy.slug,
        mapImage: rawZone.image_path,
        name: rawZone.title,
        sceneIds: rawZone.scenes?.map(s => s.slug) || []
      })
    }
  }
  return zones
}

function transformScenes () {
  const scenes = []
  for (const caseStudy of rawAtlasContent.caseOfStudies) {
    for (const zone of caseStudy.zones || []) {
      for (const rawScene of zone.scenes || []) {
        scenes.push({
          ...mapSceneFields(rawScene),
          id: rawScene.slug,
          zoneId: zone.slug,
          mapImage: rawScene.image_path,
          name: rawScene.title,
          elementIds: rawScene.elements?.map(e => e.slug) || []
        })
      }
    }
  }
  return scenes
}

function transformElements () {
  const elements = []
  for (const caseStudy of rawAtlasContent.caseOfStudies) {
    for (const zone of caseStudy.zones || []) {
      for (const scene of zone.scenes || []) {
        for (const rawElement of scene.elements || []) {
          elements.push({
            ...mapElementFields(rawElement),
            id: rawElement.slug,
            sceneId: scene.slug,
            body: rawElement.description
          })
        }
      }
    }
  }
  return elements
}

// --- Exported Data Collections ---

export const caseStudies = transformCaseStudies()
export const zones = transformZones()
export const scenes = transformScenes()
export const elements = transformElements()

// --- Repository Class Implementation ---

export class CaseStudiesRepository {
  async list () {
    return Promise.resolve(caseStudies)
  }

  async findById (caseStudyId) {
    const result = caseStudies.find((item) => item.id === caseStudyId) ?? null
    return Promise.resolve(result)
  }
}

export const inMemoryCaseStudiesRepository = new CaseStudiesRepository()