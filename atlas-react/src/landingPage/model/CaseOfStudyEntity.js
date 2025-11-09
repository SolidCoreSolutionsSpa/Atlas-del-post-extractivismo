/**
 * CaseOfStudyEntity - Entidad de dominio para casos de estudio
 * Representa la estructura de datos que se usará en toda la aplicación
 * y se alinea con el esquema futuro de la base de datos
 */
export class CaseOfStudyEntity {
  /**
   * @param {string} id - Identificador único del caso de estudio
   * @param {string} title - Título del caso de estudio
   * @param {string} summary - Resumen/descripción del caso
   * @param {string} image_path - Ruta de la imagen de detalle (vista al hacer click)
   * @param {string|null} detail_image_path - Ruta de la imagen que se muestra al hacer hover en el mapa
   * @param {number} position_top - Posición vertical en el mapa (porcentaje)
   * @param {number} position_left - Posición horizontal en el mapa (porcentaje)
   * @param {string} button_color - Color del botón/punto en el mapa
   */
  constructor(
    id,
    title,
    summary,
    image_path,
    detail_image_path,
    position_top,
    position_left,
    button_color,
  ) {
    this.id = id
    this.title = title
    this.summary = summary
    this.image_path = image_path
    this.detail_image_path = detail_image_path
    this.position_top = position_top
    this.position_left = position_left
    this.button_color = button_color
  }
}
