export class CaseStudiesService {
  /**
   * @param {{ caseStudiesRepository: import('../repo/caseStudiesRepository').CaseStudiesRepository }} deps
   */
  constructor({ caseStudiesRepository }) {
    this.repo = caseStudiesRepository
  }

  /**
   * @returns {Promise<import('../model/caseStudyModel').CaseStudy[]>}
   */
  async getAll() {
    return this.repo.list()
  }

  /**
   * @param {string} caseStudyId
   * @returns {Promise<import('../model/caseStudyModel').CaseStudy | null>}
   */
  async getById(caseStudyId) {
    return this.repo.findById(caseStudyId)
  }
}
