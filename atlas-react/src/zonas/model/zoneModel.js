/**
 * @typedef {Object} Zone
 * @property {string} id
 * @property {string} caseStudyId
 * @property {string} name
 * @property {string} description
 * @property {string} summary
 * @property {string[]} sceneIds
 * @property {{
 *    image: string,
 *    hotspots: Array<{ id: string, left: string, top: string, label: string, sceneId: string | null, category: string | null, pulsate?: boolean }>
 * }} map
 */

/**
 * @param {Partial<Zone>} payload
 * @returns {Zone}
 */
export function createZone(payload = {}) {
  return {
    id: payload.id ?? crypto.randomUUID(),
    caseStudyId: payload.caseStudyId ?? 'unknown',
    name: payload.name ?? 'Zona sin nombre',
    description: payload.description ?? 'Descripcion pendiente de migracion.',
    summary: payload.summary ?? '',
    sceneIds: payload.sceneIds ?? [],
    map: payload.map ?? { image: '', hotspots: [] },
  }
}
