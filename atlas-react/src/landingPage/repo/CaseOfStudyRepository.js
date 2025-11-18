import { atlasContent } from '../../shared/data/newAtlasContent'
import { CaseOfStudyDTO } from '../model/CaseOfStudyDTO'

/**
 * CaseOfStudyRepository
 * Capa de acceso a datos para casos de estudio
 * Actualmente obtiene datos de atlasContent (simulando base de datos)
 * En el futuro, esto se reemplazará con llamadas reales a la API/DB
 */
export class CaseOfStudyRepository {
  /**
   * Obtiene todos los casos de estudio
   * @returns {Array<{entity: CaseOfStudyEntity, navigateTo: string|null}>}
   */
  getAllCasesOfStudy() {
    // Obtener casos de estudio desde la fuente de datos (simulando DB)
    const casesData = atlasContent.caseOfStudies || []

    // Convertir datos crudos a DTOs y luego a Entities
    return casesData.map((caseData) => {
      const dto = CaseOfStudyDTO.fromAtlasContent(caseData)

      // Retornamos tanto la Entity como navigateTo
      // navigateTo se deriva del ID y is_published, no es parte del modelo de dominio
      // pero es necesario para la navegación en la vista
      return {
        entity: dto.toEntity(),
        navigateTo: dto.getNavigateTo(),
      }
    })
  }

  /**
   * Obtiene un caso de estudio por ID
   * @param {string} id - ID del caso de estudio
   * @returns {{entity: CaseOfStudyEntity, navigateTo: string|null}|null}
   */
  getCaseOfStudyById(id) {
    const casesData = atlasContent.caseOfStudies || []
    const caseData = casesData.find((c) => c.id === id)

    if (!caseData) return null

    const dto = CaseOfStudyDTO.fromAtlasContent(caseData)

    return {
      entity: dto.toEntity(),
      navigateTo: dto.getNavigateTo(),
    }
  }
}
