import { ZonasService } from '../services/zonasService'
import { inMemoryZonasRepository } from '../repo/zonasRepository'

/**
 * PuertoPuntaChungoViewModel
 * Maneja la lógica de negocio para la vista de Puerto Punta Chungo
 * Utiliza el Repository a través del Service para obtener y transformar datos
 */
export class PuertoPuntaChungoViewModel {
  constructor() {
    this.service = new ZonasService({
      zonasRepository: inMemoryZonasRepository,
    })
  }

  /**
   * Obtiene los datos de la zona Puerto Punta Chungo
   * @returns {Promise<import('../model/zoneModel').Zone | null>}
   */
  async getPuertoPuntaChungoData() {
    return this.service.getById('puerto-punta-chungo')
  }

  /**
   * Obtiene todas las zonas para un caso de estudio
   * @param {string} caseStudyId - ID del caso de estudio
   * @returns {Promise<import('../model/zoneModel').Zone[]>}
   */
  async getZonesForCaseStudy(caseStudyId) {
    return this.service.getForCaseStudy(caseStudyId)
  }

  /**
   * Verifica si Puerto Punta Chungo existe en los datos
   * @returns {Promise<boolean>}
   */
  async isPuertoPuntaChungoAvailable() {
    const zone = await this.getPuertoPuntaChungoData()
    return zone !== null
  }
}

// Exportar instancia singleton para uso en componentes
export const puertoPuntaChungoViewModel = new PuertoPuntaChungoViewModel()
