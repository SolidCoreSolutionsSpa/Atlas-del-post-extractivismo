import { CaseOfStudyRepository } from '../repo/CaseOfStudyRepository'

/**
 * LandingPageViewModel
 * Controlador/ViewModel para el LandingPage
 * Maneja la lógica de negocio y coordina entre el repositorio y la vista
 */
export class LandingPageViewModel {
  constructor() {
    this.repository = new CaseOfStudyRepository()
  }

  /**
   * Obtiene todos los casos de estudio para mostrar en el mapa
   * @returns {Array<{entity: CaseOfStudyEntity, navigateTo: string|null, variant: string}>}
   */
  getCasesOfStudy() {
    return this.repository.getAllCasesOfStudy()
  }

  /**
   * Obtiene un caso de estudio específico por ID
   * @param {string} id - ID del caso de estudio
   * @returns {{entity: CaseOfStudyEntity, navigateTo: string|null, variant: string}|null}
   */
  getCaseOfStudyById(id) {
    return this.repository.getCaseOfStudyById(id)
  }

  /**
   * Formatea los datos del caso de estudio para ser consumidos por RadarPoint
   * @param {CaseOfStudyEntity} entity - Entidad del caso de estudio
   * @param {string|null} navigateTo - Ruta de navegación
   * @param {string} variant - Variante de estilo del punto
   * @returns {Object} Configuración formateada para RadarPoint
   */
  formatCaseForRadarPoint(entity, navigateTo, variant) {
    return {
      id: entity.id,
      name: entity.title,
      description: entity.summary,
      backgroundImage: entity.image_path,
      color: entity.color,
      variant: variant,
      position: {
        left: `${entity.position_left}%`,
        top: `${entity.position_top}%`,
      },
      navigateTo: navigateTo,
    }
  }

  /**
   * Obtiene todas las configuraciones de territorios para el mapa
   * Formatea los datos en el formato esperado por el LandingPage
   * @returns {Object} Configuración de territorios mapeada por ID
   */
  getTerritoriesConfig() {
    const cases = this.getCasesOfStudy()
    const config = {}

    cases.forEach(({ entity, navigateTo, variant }) => {
      config[entity.id] = this.formatCaseForRadarPoint(entity, navigateTo, variant)
    })

    return config
  }
}
