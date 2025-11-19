/**
 * SceneEntity - Domain entity for scenes
 * Mirrors the structure defined in sceneModel.js
 */
export class SceneEntity {
  /**
   * @param {string} id - Scene unique ID
   * @param {string} zoneId - Parent zone ID/slug
   * @param {string} name - Scene name
   * @param {string} summary - Scene summary/description
   * @param {Object} map - Map configuration
   * @param {string} map.image - Background image path
   * @param {Array} map.hotspots - Interactive hotspots inside the map
   */
  constructor(id, zoneId, name, summary, map) {
    this.id = id
    this.zoneId = zoneId
    this.name = name
    this.summary = summary
    this.map = map
  }
}
