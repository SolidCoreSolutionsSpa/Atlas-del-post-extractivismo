import { describe, expect, it } from 'vitest'

import { inMemoryElementsRepository } from '../repo/elementsRepository'
import { RecommendationsService } from '../services/recommendationsService'

describe('RecommendationsService', () => {
  const service = new RecommendationsService({
    elementsRepository: inMemoryElementsRepository,
  })

  it('returns elements that share at least one tag', async () => {
    const { recommendations } = await service.getRecommendations({
      elementId: 'jilguero',
    })

    expect(recommendations.length).toBeGreaterThan(0)
    recommendations.forEach((item) => {
      expect(item.sharedTagIds.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('honours limit and exclude parameters', async () => {
    const { recommendations } = await service.getRecommendations({
      elementId: 'jilguero',
      limit: 1,
      exclude: ['jote'],
    })

    expect(recommendations).toHaveLength(1)
    expect(recommendations[0].element.id).not.toBe('jote')
  })

  it('uses seed to provide deterministic ordering', async () => {
    const firstRun = await service.getRecommendations({
      elementId: 'jilguero',
      seed: 42,
    })
    const secondRun = await service.getRecommendations({
      elementId: 'jilguero',
      seed: 42,
    })

    expect(
      firstRun.recommendations.map((item) => item.element.id),
    ).toEqual(secondRun.recommendations.map((item) => item.element.id))
  })
})
