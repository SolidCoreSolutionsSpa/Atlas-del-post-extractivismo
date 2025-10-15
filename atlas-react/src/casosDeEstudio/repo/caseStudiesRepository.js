import { atlasContent } from '../../shared/data/atlasContent'
import { createCaseStudy } from '../model/caseStudyModel'

export class CaseStudiesRepository {
  /**
   * @returns {Promise<import('../model/caseStudyModel').CaseStudy[]>}
   */
  async list() {
    throw new Error('CaseStudiesRepository.list() no implementado')
  }

  /**
   * @param {string} caseStudyId
   * @returns {Promise<import('../model/caseStudyModel').CaseStudy | null>}
   */
  async findById(caseStudyId) {
    throw new Error('CaseStudiesRepository.findById() no implementado')
  }
}

const seedCaseStudies = atlasContent.caseStudies.map((item) =>
  createCaseStudy({
    id: item.id,
    title: item.name,
    location: item.location,
    summary: item.summary,
    zoneIds: atlasContent.zones
      .filter((zone) => zone.caseId === item.id)
      .map((zone) => zone.id),
    globalMap: item.globalMap,
    detailMap: item.detailMap,
  }),
)

export class InMemoryCaseStudiesRepository extends CaseStudiesRepository {
  constructor(initial = seedCaseStudies) {
    super()
    this.collection = initial
  }

  async list() {
    return [...this.collection]
  }

  async findById(caseStudyId) {
    return this.collection.find((item) => item.id === caseStudyId) ?? null
  }
}

export const inMemoryCaseStudiesRepository =
  new InMemoryCaseStudiesRepository()
