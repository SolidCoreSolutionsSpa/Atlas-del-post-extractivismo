import { ZoneEntity } from './ZoneEntity'

/**
 * ZoneDTO - Data Transfer Object para zonas
 * Representa la estructura de datos recibida desde newAtlasContent
 * y proporciona métodos para convertir a la entidad de dominio
 */
export class ZoneDTO {
  /**
   * @param {Object} data - Datos crudos de la zona desde newAtlasContent
   */
  constructor(data) {
    this.id = data.id
    this.slug = data.slug
    this.title = data.title
    this.image_path = data.image_path
    this.position_left = data.position_left
    this.position_top = data.position_top
    this.scenes = data.scenes || []
    // decorations removed - now each scene has its own decoration field
  }

  /**
   * Convierte el DTO a una entidad de dominio (ZoneEntity)
   * @param {string} caseStudySlug - Slug del caso de estudio al que pertenece la zona
   * @returns {ZoneEntity} Entidad de zona
   */
  toEntity(caseStudySlug) {
    // Mapear escenas a hotspots
    const hotspots = this.scenes.map((scene) => ({
      id: scene.slug,
      left: `${scene.position_left}%`,
      top: `${scene.position_top}%`,
      label: scene.title,
      sceneId: scene.slug,
      category: scene.affectation_type_id || 'anthropic',
      pulsate: true,
    }))

    const entity = new ZoneEntity(
      this.slug,
      caseStudySlug,
      this.title,
      '', // description - puede agregarse después
      this.scenes.map(e => e.slug), // sceneIds
      {
        image: this.image_path,
        hotspots: hotspots,
      }
    )
    return entity
  }

  /**
   * Crea un DTO desde los datos crudos de newAtlasContent
   * @param {Object} data - Datos crudos de la zona
   * @returns {ZoneDTO} Instancia de ZoneDTO
   */
  static fromNewAtlasContent(data) {
    return new ZoneDTO(data)
  }
}
