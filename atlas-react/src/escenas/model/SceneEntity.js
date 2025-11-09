/**
 * SceneEntity - Entidad de dominio para escenas
 * Representa la estructura de datos que se usará en toda la aplicación
 * Alineada con el modelo Scene existente en sceneModel.js
 */
export class SceneEntity {
  /**
   * @param {string} id - Identificador único de la escena
   * @param {string} zoneId - ID de la zona a la que pertenece
   * @param {string} name - Nombre de la escena
   * @param {string} theme - Tema visual ('day' o 'night')
   * @param {Object} map - Configuración del mapa
   * @param {string} map.image - Ruta de la imagen del mapa
   * @param {Array} map.hotspots - Puntos interactivos en el mapa
   */
  constructor(
    id,
    zoneId,
    name,
    theme,
    map
  ) {
    this.id = id
    this.zoneId = zoneId
    this.name = name
    this.theme = theme
    this.map = map
  }
}
