import { describe, expect, it } from 'vitest'

import { ZonasService } from '../services/zonasService'
import { InMemoryZonasRepository } from '../repo/zonasRepository'

describe('ZonasService', () => {
  const service = new ZonasService({
    zonasRepository: new InMemoryZonasRepository(),
  })

  it('lists zones for a case study', async () => {
    const result = await service.getForCaseStudy('provincia-choapa')
    expect(result).toHaveLength(1)
  })

  it('returns null for unknown id', async () => {
    const result = await service.getById('unknown')
    expect(result).toBeNull()
  })
})
