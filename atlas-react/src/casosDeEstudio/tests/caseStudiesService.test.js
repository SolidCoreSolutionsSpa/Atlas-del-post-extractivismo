import { describe, expect, it } from 'vitest'

import { CaseStudiesService } from '../services/caseStudiesService'
import { InMemoryCaseStudiesRepository } from '../repo/caseStudiesRepository'

describe('CaseStudiesService', () => {
  const service = new CaseStudiesService({
    caseStudiesRepository: new InMemoryCaseStudiesRepository(),
  })

  it('returns seeded case studies', async () => {
    const data = await service.getAll()
    expect(data.length).toBeGreaterThan(0)
  })

  it('finds a case study by id', async () => {
    const data = await service.getById('provincia-choapa')
    expect(data?.id).toBe('provincia-choapa')
  })
})
