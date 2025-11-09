import { atlasContent as newAtlasContent } from '../../shared/data/newAtlasContent'
import { createZone } from '../model/zoneModel'
import { ZoneDTO } from '../model/ZoneDTO'

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

// Zonas desde newAtlasContent usando DTOs
const seedZones = []
newAtlasContent.caseOfStudies.forEach((caseStudy) => {
  if (caseStudy.zones && Array.isArray(caseStudy.zones)) {
    caseStudy.zones.forEach((zone) => {
      const zoneDTO = ZoneDTO.fromNewAtlasContent(zone)
      const zoneEntity = zoneDTO.toEntity(caseStudy.id)
      // Convertir entity a formato del createZone
      const createdZone = createZone({
        id: zoneEntity.id,
        caseStudyId: zoneEntity.caseStudyId,
        name: zoneEntity.name,
        description: zoneEntity.description,
        sceneIds: zoneEntity.sceneIds,
        map: zoneEntity.map,
      })
      console.log('🔧 DEBUG zonasRepository - zone created:', createdZone.id, 'image:', createdZone.map.image)
      seedZones.push(createdZone)
    })
  }
})

console.log('🔧 DEBUG zonasRepository - Total zones:', seedZones.length)

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
