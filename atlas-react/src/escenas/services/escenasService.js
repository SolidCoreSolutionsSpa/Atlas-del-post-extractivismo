export class EscenasService {
  /**
   * @param {{ escenasRepository: import('../repo/escenasRepository').EscenasRepository }} deps
   */
  constructor({ escenasRepository }) {
    this.repo = escenasRepository
  }

  /**
   * @returns {Promise<import('../model/sceneModel').Scene[]>}
   */
  async getAll() {
    return this.repo.list()
  }

  /**
   * @param {string} sceneId
   * @returns {Promise<import('../model/sceneModel').Scene | null>}
   */
  async getById(sceneId) {
    return this.repo.findById(sceneId)
  }

  /**
   * @param {string} zoneId
   * @returns {Promise<import('../model/sceneModel').Scene[]>}
   */
  async getByZone(zoneId) {
    return this.repo.listByZone(zoneId)
  }

}
