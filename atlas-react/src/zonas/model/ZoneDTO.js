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
    this.title = data.title
    this.image_path = data.image_path
    this.position_left = data.position_left
    this.position_top = data.position_top
    this.escenes = data.escenes || []
    // decorations removed - now each scene has its own decoration field
  }

  /**
   * Convierte el DTO a una entidad de dominio (ZoneEntity)
   * @param {string} caseStudyId - ID del caso de estudio al que pertenece la zona
   * @returns {ZoneEntity} Entidad de zona
   */
  toEntity(caseStudyId) {
    // Mapear escenas a hotspots
    const hotspots = this.escenes.map((escene) => ({
      id: escene.id,
      left: `${escene.position_left}%`,
      top: `${escene.position_top}%`,
      label: escene.title,
      sceneId: escene.id,
      category: escene.escene_type?.name || 'anthropic',
      pulsate: true,
    }))

    const entity = new ZoneEntity(
      this.id,
      caseStudyId,
      this.title,
      '', // description - puede agregarse después
      this.escenes.map(e => e.id), // sceneIds
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
