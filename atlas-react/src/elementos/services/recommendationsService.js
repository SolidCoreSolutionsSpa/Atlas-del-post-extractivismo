export class RecommendationsService {
  /**
   * @param {{ elementsRepository: import('../repo/elementsRepository').ElementsRepository }} deps
   */
  constructor({ elementsRepository }) {
    this.repo = elementsRepository
  }

  /**
   * @param {string} elementId
   * @returns {Promise<{ element: import('../model/elementModel').Element, tags: import('../model/elementModel').Tag[], affectationType: import('../model/elementModel').AffectationType | null } | null>}
   */
  async getElementWithTags(elementId) {
    return this.repo.getElementWithTags(elementId)
  }

  /**
   * Estrategia >= 1 tag compartido con soporte para limit, exclude y seed.
   * @param {{ elementId: string, limit?: number, exclude?: string[], cursor?: string | null, seed?: number }} params
   * @returns {Promise<{ base: Awaited<ReturnType<RecommendationsService['getElementWithTags']>>, recommendations: Array<{ element: import('../model/elementModel').Element, tags: import('../model/elementModel').Tag[], sharedTagIds: string[] }>, nextCursor: string | null }>}
   */
  async getRecommendations({
    elementId,
    limit = 5,
    exclude = [],
    cursor = null,
    seed,
  }) {
    const base = await this.getElementWithTags(elementId)
    if (!base) {
      return { base: null, recommendations: [], nextCursor: null }
    }

    const excludeIds = Array.from(new Set([elementId, ...exclude]))

    const { items, nextCursor } = await this.repo.findElementsWithSharedTags({
      tagIds: base.tags.map((tag) => tag.id),
      excludeIds,
      limit,
      cursor,
    })

    const recommendations = seed
      ? seededShuffle(items, seed).slice(0, limit)
      : items

    return { base, recommendations, nextCursor }
  }
}

function seededShuffle(list, seed) {
  const rng = mulberry32(seed)
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function mulberry32(seed) {
  let t = seed
  return function random() {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
