/**
 * @typedef {Object} Element
 * @property {string} id
 * @property {string} sceneId
 * @property {string} name
 * @property {string} subtitle
 * @property {string} image
 * @property {string|null} detailImagePath
 * @property {string} body
 * @property {string} source
 * @property {string} affectationTypeId
*/

/**
 * @typedef {Object} AffectationType
 * @property {string} id
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} ElementTag
 * @property {string} elementId
 * @property {string} tagId
 */

/**
 * @param {Partial<Element>} payload
 * @returns {Element}
 */
export function createElement(payload = {}) {
  return {
    id: payload.id ?? crypto.randomUUID(),
    sceneId: payload.sceneId ?? 'unknown',
    name: payload.name ?? 'Elemento sin nombre',
    subtitle: payload.subtitle ?? '',
    image: payload.image ?? '',
    detailImagePath: payload.detailImagePath ?? null,
    body: payload.body ?? 'Descripcion pendiente de migracion.',
    source: payload.source ?? '',
    affectationTypeId: payload.affectationTypeId ?? 'tipo-desconocido',
  }
}

/**
 * @param {Partial<AffectationType>} payload
 * @returns {AffectationType}
 */
export function createAffectationType(payload = {}) {
  return {
    id: payload.id ?? crypto.randomUUID(),
    name: payload.name ?? 'Tipo sin nombre',
    description: payload.description ?? 'Descripcion pendiente de migracion.',
  }
}

/**
 * @param {Partial<Tag>} payload
 * @returns {Tag}
 */
export function createTag(payload = {}) {
  return {
    id: payload.id ?? crypto.randomUUID(),
    label: payload.label ?? 'tag',
  }
}

/**
 * @param {Partial<ElementTag>} payload
 * @returns {ElementTag}
 */
export function createElementTag(payload = {}) {
  return {
    elementId: payload.elementId ?? '',
    tagId: payload.tagId ?? '',
  }
}
