export async function fetchEscenas(options = {}) {
  const response = await fetch('/api/escenas', options)

  if (!response.ok) {
    throw new Error('Error al cargar escenas')
  }

  return response.json()
}

export async function fetchEscenasByZone(zoneId, options = {}) {
  const response = await fetch(`/api/zonas/${zoneId}/escenas`, options)

  if (!response.ok) {
    throw new Error('Error al cargar escenas de la zona')
  }

  return response.json()
}

export async function fetchSceneTypes(options = {}) {
  const response = await fetch('/api/escenas/tipos', options)

  if (!response.ok) {
    throw new Error('Error al cargar catalogo de tipos de escena')
  }

  return response.json()
}
