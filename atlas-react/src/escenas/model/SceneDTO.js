import { SceneEntity } from './SceneEntity'

/**
 * SceneDTO - Data Transfer Object para escenas
 * Representa la estructura de datos recibida desde newAtlasContent
 * y proporciona métodos para convertir a la entidad de dominio
 */
export class SceneDTO {
  /**
   * @param {Object} data - Datos crudos de la escena desde newAtlasContent
   */
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.image_path = data.image_path
    this.position_left = data.position_left
    this.position_top = data.position_top
    this.elements = data.elements || []
  }

  /**
   * Convierte el DTO a una entidad de dominio (SceneEntity)
   * @param {string} zoneId - ID de la zona a la que pertenece la escena
   * @returns {SceneEntity} Entidad de escena
   */
  toEntity(zoneId) {
    // Mapear elementos a hotspots
    const hotspots = this.elements.map((element) => ({
      id: element.id,
      left: `${element.position_left}%`,
      top: `${element.position_top}%`,
      label: element.title,
      elementId: element.id,
      category: element.affectation_type?.name?.includes('biotica') ? 'biotic' :
                element.affectation_type?.name?.includes('antropica') ? 'anthropic' :
                'physical',
      pulsate: true,
    }))

    return new SceneEntity(
      this.id,
      zoneId,
      this.title,
      {
        image: this.image_path,
        hotspots: hotspots,
      }
    )
  }

  /**
   * Crea un DTO desde los datos crudos de newAtlasContent
   * @param {Object} data - Datos crudos de la escena
   * @returns {SceneDTO} Instancia de SceneDTO
   */
  static fromNewAtlasContent(data) {
    return new SceneDTO(data)
  }
}
