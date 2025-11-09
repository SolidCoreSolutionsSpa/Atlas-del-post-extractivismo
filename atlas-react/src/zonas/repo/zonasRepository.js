import { atlasContent } from '../../shared/data/newAtlasContent'
import { createZone } from '../model/zoneModel'

export class ZonasRepository {
  /**
   * @returns {Promise<import('../model/zoneModel').Zone[]>}
   */
  async list() {
    throw new Error('ZonasRepository.list() no implementado')
  }

  /**
   * @param {string} zoneId
   * @returns {Promise<import('../model/zoneModel').Zone | null>}
   */
  async findById(zoneId) {
    throw new Error('ZonasRepository.findById() no implementado')
  }

  /**
   * @param {string} caseStudyId
   * @returns {Promise<import('../model/zoneModel').Zone[]>}
   */
  async listByCaseStudy(caseStudyId) {
    throw new Error('ZonasRepository.listByCaseStudy() no implementado')
  }
}

// Extraer todas las zonas de todos los casos de estudio en newAtlasContent
const seedZones = atlasContent.caseOfStudies.flatMap((caseStudy) =>
  (caseStudy.zones || []).map((zone) =>
    createZone({
      id: zone.id,
      caseStudyId: caseStudy.id,
      name: zone.title,
      description: `Vista detallada de ${zone.title}`,
      sceneIds: (zone.escene || []).map((scene) => scene.id),
      map: {
        image: zone.image_path,
        hotspots: (zone.escene || []).map((scene) => ({
          id: scene.id,
          left: `${scene.position_left}%`,
          top: `${scene.position_top}%`,
          label: scene.title,
          sceneId: scene.id,
          category: scene.escene_type?.name || 'anthropic',
          pulsate: true,
        })),
      },
      decorations: (zone.decorations || []).map((decoration) => ({
        id: decoration.id,
        image: decoration.image_path,
        tooltip: decoration.tooltip,
        position: {
          left: `${decoration.position_left}%`,
          top: `${decoration.position_top}%`,
        },
        type: decoration.type,
      })),
    }),
  ),
)

export class InMemoryZonasRepository extends ZonasRepository {
  constructor(initial = seedZones) {
    super()
    this.collection = initial
  }

  async list() {
    return [...this.collection]
  }

  async findById(zoneId) {
    return this.collection.find((zone) => zone.id === zoneId) ?? null
  }

  async listByCaseStudy(caseStudyId) {
    return this.collection.filter((zone) => zone.caseStudyId === caseStudyId)
  }
}

export const inMemoryZonasRepository = new InMemoryZonasRepository()
