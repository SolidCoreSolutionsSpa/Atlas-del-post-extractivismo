import { atlasContent as newAtlasContent } from '../../shared/data/newAtlasContent'
import { createScene } from '../model/sceneModel'
import { SceneDTO } from '../model/SceneDTO'

export class EscenasRepository {
  /**
   * @returns {Promise<import('../model/sceneModel').Scene[]>}
   */
  async list() {
    throw new Error('EscenasRepository.list() no implementado')
  }

  /**
   * @param {string} sceneId
   * @returns {Promise<import('../model/sceneModel').Scene | null>}
   */
  async findById(sceneId) {
    throw new Error('EscenasRepository.findById() no implementado')
  }

  /**
   * @param {string} zoneId
   * @returns {Promise<import('../model/sceneModel').Scene[]>}
   */
  async listByZone(zoneId) {
    throw new Error('EscenasRepository.listByZone() no implementado')
  }

}

// Escenas desde newAtlasContent usando DTOs
const seedScenes = []
newAtlasContent.caseOfStudies.forEach((caseStudy) => {
  if (caseStudy.zones && Array.isArray(caseStudy.zones)) {
    caseStudy.zones.forEach((zone) => {
      if (zone.escenes && Array.isArray(zone.escenes)) {
        zone.escenes.forEach((escene) => {
          const sceneDTO = SceneDTO.fromNewAtlasContent(escene)
          const sceneEntity = sceneDTO.toEntity(zone.id)
          // Convertir entity a formato del createScene
          const createdScene = createScene({
            id: sceneEntity.id,
            zoneId: sceneEntity.zoneId,
            name: sceneEntity.name,
            theme: sceneEntity.theme,
            map: sceneEntity.map,
          })
          seedScenes.push(createdScene)
        })
      }
    })
  }
})

export class InMemoryEscenasRepository extends EscenasRepository {
  constructor({ scenes = seedScenes } = {}) {
    super()
    this.scenes = scenes
  }

  async list() {
    return [...this.scenes]
  }

  async findById(sceneId) {
    return this.scenes.find((scene) => scene.id === sceneId) ?? null
  }

  async listByZone(zoneId) {
    return this.scenes.filter((scene) => scene.zoneId === zoneId)
  }
}

export const inMemoryEscenasRepository = new InMemoryEscenasRepository()
