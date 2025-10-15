export async function fetchCaseStudies(options = {}) {
  const response = await fetch('/api/case-studies', options)

  if (!response.ok) {
    throw new Error('Error al cargar casos de estudio')
  }

  return response.json()
}

export async function fetchCaseStudyById(caseStudyId, options = {}) {
  const response = await fetch(`/api/case-studies/${caseStudyId}`, options)

  if (!response.ok) {
    throw new Error('Error al cargar el caso de estudio')
  }

  return response.json()
}
