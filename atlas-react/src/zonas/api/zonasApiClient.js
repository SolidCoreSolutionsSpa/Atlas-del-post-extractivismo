export async function fetchZonas(options = {}) {
  const response = await fetch('/api/zonas', options)

  if (!response.ok) {
    throw new Error('Error al cargar zonas')
  }

  return response.json()
}

export async function fetchZonasByCaseStudy(caseStudyId, options = {}) {
  const response = await fetch(`/api/case-studies/${caseStudyId}/zonas`, options)

  if (!response.ok) {
    throw new Error('Error al cargar zonas del caso de estudio')
  }

  return response.json()
}
