import { atlasContent as rawAtlasContent } from '@/shared/data/newAtlasContent'
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
    id: zone.id,
    name: zone.title,
    position: mapPosition(zone.position_left, zone.position_top)
  }))

  const allDecorations = (caseStudy.zones || [])
    .flatMap(zone => zone.decorations || [])
    .map(mapDecorationFields)

  return {
    image: caseStudy.image_path,
    zones,
    decorations: allDecorations,
    filterDescriptions: caseStudy.filterDescriptions
  }
}

function transformCaseStudies () {
  return rawAtlasContent.caseOfStudies.map(raw => {
    const mapped = mapCaseStudyFields(raw)
    const detailMap = buildDetailMap(raw)
    const globalMap = {
      image: mapped.image_path,
      points: [{
        id: `punto-${mapped.id}`,
        ...mapPosition(mapped.position_left, mapped.position_top),
        label: mapped.title,
        zoneId: null
      }]
    }

    return createCaseStudy({
      ...mapped,
      location: mapped.title,
      zoneIds: raw.zones?.map(z => z.id) || [],
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
        caseId: caseStudy.id,
        mapImage: rawZone.image_path,
        name: rawZone.title,
        sceneIds: rawZone.escene?.map(s => s.id) || []
      })
    }
  }
  return zones
}

function transformScenes () {
  const scenes = []
  for (const caseStudy of rawAtlasContent.caseOfStudies) {
    for (const zone of caseStudy.zones || []) {
      for (const rawScene of zone.escene || []) {
        scenes.push({
          ...mapSceneFields(rawScene),
          zoneId: zone.id,
          mapImage: rawScene.image_path,
          name: rawScene.title,
          elementIds: rawScene.elements?.map(e => e.id) || []
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
      for (const scene of zone.escene || []) {
        for (const rawElement of scene.elements || []) {
          elements.push({
            ...mapElementFields(rawElement),
            sceneId: scene.id,
            subtitle: rawElement.title,
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