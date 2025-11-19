import { CaseOfStudyEntity } from './CaseOfStudyEntity'

/**
 * CaseOfStudyDTO - Data Transfer Object
 * Representa la estructura de datos recibida desde la fuente de datos (atlasContent)
 * y proporciona métodos para convertir a la entidad de dominio
 */
export class CaseOfStudyDTO {
  /**
   * @param {Object} data - Datos crudos del caso de estudio desde atlasContent
   */
  constructor(data) {
    this.id = data.id
    this.slug = data.slug
    this.title = data.title
    this.summary = data.summary
    this.image_path = data.image_path
    this.detail_image_path = data.detail_image_path || null
    this.position_top = data.position_top
    this.position_left = data.position_left
    this.color = data.color
    this.is_published = data.is_published
    this.zones = data.zones
  }

  /**
   * Deriva la ruta de navegación basándose en el slug y el estado de publicación
   * @returns {string|null} Ruta de navegación o null si no está publicado
   */
  getNavigateTo() {
    return this.is_published !== false
      ? `/casos-de-estudio/${this.slug}`
      : null
  }

  /**
   * Convierte el DTO a una entidad de dominio (CaseOfStudyEntity)
   * @returns {CaseOfStudyEntity} Entidad de caso de estudio
   */
  toEntity() {
    return new CaseOfStudyEntity(
      this.id,
      this.title,
      this.summary,
      this.image_path,
      this.detail_image_path,
      this.position_top,
      this.position_left,
      this.color, // button_color se mapea desde color
    )
  }

  /**
   * Crea un DTO desde los datos crudos de atlasContent
   * @param {Object} data - Datos crudos del caso de estudio
   * @returns {CaseOfStudyDTO} Instancia de CaseOfStudyDTO
   */
  static fromAtlasContent(data) {
    return new CaseOfStudyDTO(data)
  }
}
