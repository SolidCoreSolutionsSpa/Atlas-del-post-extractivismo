/**
 * @typedef {Object} CaseStudy
 * @property {string} id
 * @property {string} title
 * @property {string} location
 * @property {string} summary
 * @property {string} color
 * @property {string} variant
 * @property {string|null} navigateTo
 * @property {string[]} zoneIds
 * @property {{
 *    image: string,
 *    points: Array<{ id: string, left: string, top: string, label: string, zoneId: string | null }>
 * }} globalMap
 * @property {{
 *    image: string,
 *    zones: Array<{ id: string, name: string, position: { left: string, top: string }}>,
 *    decorations: Array<{ id: string, image: string, widthVw: number, alt: string, left: string, top: string, category: string | null }>,
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
    color: payload.color ?? '#000000',
    variant: payload.variant ?? 'default',
    navigateTo: payload.navigateTo ?? null,
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
