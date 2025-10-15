/**
 * @typedef {Object} CaseStudy
 * @property {string} id
 * @property {string} title
 * @property {string} location
 * @property {string} summary
 * @property {string[]} zoneIds
 * @property {{
 *    image: string,
 *    points: Array<{ id: string, left: string, top: string, label: string, zoneId: string | null }>
 * }} globalMap
 * @property {{
 *    image: string,
 *    hotspots: Array<{ id: string, left: string, top: string, label: string, zoneId: string | null, category: string | null }>,
 *    decorations: Array<{ id: string, image: string, alt: string, left: string, top: string, category: string | null }>,
 *    filterDescriptions: Record<string, { title: string, text: string }>
 * }} detailMap
 */

/**
 * @param {Partial<CaseStudy>} payload
 * @returns {CaseStudy}
 */
export function createCaseStudy(payload = {}) {
  return {
    id: payload.id ?? crypto.randomUUID(),
    title: payload.title ?? 'Caso de estudio sin titulo',
    location: payload.location ?? '',
    summary: payload.summary ?? 'Resumen pendiente de migracion.',
    zoneIds: payload.zoneIds ?? [],
    globalMap: payload.globalMap ?? { image: '', points: [] },
    detailMap: payload.detailMap ?? {
      image: '',
      hotspots: [],
      decorations: [],
      filterDescriptions: {},
    },
  }
}
