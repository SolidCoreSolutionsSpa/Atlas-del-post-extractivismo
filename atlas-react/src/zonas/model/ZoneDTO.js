import { ZoneEntity } from './ZoneEntity'

/**
 * ZoneDTO - lightweight mapper for raw zone data
 */
export class ZoneDTO {
  /**
   * @param {Object} data - Raw zone payload coming from atlas data
   */
  constructor(data) {
    this.id = data.id
    this.slug = data.slug
    this.title = data.title
    this.summary = data.summary ?? ''
    this.image_path = data.image_path
    this.position_left = data.position_left
    this.position_top = data.position_top
    this.scenes = data.scenes || []
  }

  /**
   * Converts the DTO to a ZoneEntity
   * @param {string} caseStudySlug - Identifier of the parent case study
   * @returns {ZoneEntity}
   */
  toEntity(caseStudySlug) {
    const hotspots = this.scenes.map((scene) => ({
      id: scene.slug,
      left: `${scene.position_left}%`,
      top: `${scene.position_top}%`,
      label: scene.title,
      sceneId: scene.slug,
      category: scene.affectation_type_id || 'anthropic',
      pulsate: true,
    }))

    return new ZoneEntity(
      this.slug,
      caseStudySlug,
      this.title,
      '', // full description pending migration
      this.summary,
      this.scenes.map((scene) => scene.slug),
      {
        image: this.image_path,
        hotspots,
      },
    )
  }

  static fromNewAtlasContent(data) {
    return new ZoneDTO(data)
  }
}
