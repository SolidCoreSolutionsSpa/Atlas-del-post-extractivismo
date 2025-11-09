/**
 * ZoneEntity - Entidad de dominio para zonas
 * Representa la estructura de datos que se usará en toda la aplicación
 * Alineada con el modelo Zone existente en zoneModel.js
 */
export class ZoneEntity {
  /**
   * @param {string} id - Identificador único de la zona
   * @param {string} caseStudyId - ID del caso de estudio al que pertenece
   * @param {string} name - Nombre de la zona
   * @param {string} description - Descripción de la zona
   * @param {string[]} sceneIds - IDs de las escenas en esta zona
   * @param {Object} map - Configuración del mapa
   * @param {string} map.image - Ruta de la imagen del mapa
   * @param {Array} map.hotspots - Puntos interactivos en el mapa
   */
  constructor(
    id,
    caseStudyId,
    name,
    description,
    sceneIds,
    map
  ) {
    this.id = id
    this.caseStudyId = caseStudyId
    this.name = name
    this.description = description
    this.sceneIds = sceneIds
    this.map = map
  }
}
