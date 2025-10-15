export class ZonasService {
  /**
   * @param {{ zonasRepository: import('../repo/zonasRepository').ZonasRepository }} deps
   */
  constructor({ zonasRepository }) {
    this.repo = zonasRepository
  }

  /**
   * @returns {Promise<import('../model/zoneModel').Zone[]>}
   */
  async getAll() {
    return this.repo.list()
  }

  /**
   * @param {string} zoneId
   * @returns {Promise<import('../model/zoneModel').Zone | null>}
   */
  async getById(zoneId) {
    return this.repo.findById(zoneId)
  }

  /**
   * @param {string} caseStudyId
   * @returns {Promise<import('../model/zoneModel').Zone[]>}
   */
  async getForCaseStudy(caseStudyId) {
    return this.repo.listByCaseStudy(caseStudyId)
  }
}
