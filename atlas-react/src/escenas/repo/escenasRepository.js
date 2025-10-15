import { atlasContent } from '../../shared/data/atlasContent'
import { createScene } from '../model/sceneModel'

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

const seedScenes = atlasContent.scenes.map((scene) =>
  createScene({
    id: scene.id,
    zoneId: scene.zoneId,
    name: scene.name,
    theme: scene.theme,
    map: {
      image: scene.mapImage,
      hotspots: scene.hotspots,
    },
  }),
)

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
