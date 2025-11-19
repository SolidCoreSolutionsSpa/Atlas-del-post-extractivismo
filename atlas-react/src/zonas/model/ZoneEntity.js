/**
 * ZoneEntity - Domain entity for zones
 * Mirrors the structure defined in zoneModel.js
 */
export class ZoneEntity {
  /**
   * @param {string} id - Unique identifier of the zone
   * @param {string} caseStudyId - Case study slug/ID
   * @param {string} name - Zone name
   * @param {string} description - Long description of the zone
   * @param {string} summary - Short summary of the zone
   * @param {string[]} sceneIds - Scene identifiers that belong to this zone
   * @param {Object} map - Map configuration
   * @param {string} map.image - Map background image
   * @param {Array} map.hotspots - Interactive hotspots on the map
   */
  constructor(id, caseStudyId, name, description, summary, sceneIds, map) {
    this.id = id
    this.caseStudyId = caseStudyId
    this.name = name
    this.description = description
    this.summary = summary
    this.sceneIds = sceneIds
    this.map = map
  }
}
