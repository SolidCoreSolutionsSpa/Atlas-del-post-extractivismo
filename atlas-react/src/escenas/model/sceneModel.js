/**
 * @typedef {Object} Scene
 * @property {string} id
 * @property {string} zoneId
 * @property {string} name
 * @property {string} summary
 * @property {{
 *    image: string,
 *    hotspots: Array<{ id: string, left: string, top: string, label: string, elementId: string | null, category: string | null, pulsate?: boolean }>
 * }} map
 */

/**
 * @param {Partial<Scene>} payload
 * @returns {Scene}
 */
export function createScene(payload = {}) {
  return {
    id: payload.id ?? crypto.randomUUID(),
    zoneId: payload.zoneId ?? 'unknown',
    name: payload.name ?? 'Escena sin titulo',
    summary: payload.summary ?? '',
    map: payload.map ?? { image: '', hotspots: [] },
  }
}
