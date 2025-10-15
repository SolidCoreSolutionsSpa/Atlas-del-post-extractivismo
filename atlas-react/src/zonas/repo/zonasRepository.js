import { atlasContent } from '../../shared/data/atlasContent'
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

const seedZones = atlasContent.zones.map((zone) =>
  createZone({
    id: zone.id,
    caseStudyId: zone.caseId,
    name: zone.name,
    description: zone.description,
    sceneIds: atlasContent.scenes
      .filter((scene) => scene.zoneId === zone.id)
      .map((scene) => scene.id),
    map: {
      image: zone.mapImage,
      hotspots: zone.hotspots,
    },
  }),
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
