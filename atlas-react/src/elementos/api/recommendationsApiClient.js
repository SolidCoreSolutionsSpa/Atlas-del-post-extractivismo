/**
 * Contrato del endpoint que atendera el Worker `/api/elements/:id/recommendations`.
 * @param {string} elementId
 * @param {{ limit?: number, cursor?: string | null, exclude?: string[], init?: RequestInit }} params
 */
export async function fetchElementRecommendations(
  elementId,
  { limit, cursor, exclude = [], init } = {},
) {
  const searchParams = new URLSearchParams()
  if (typeof limit === 'number') {
    searchParams.set('limit', String(limit))
  }
  if (cursor) {
    searchParams.set('cursor', cursor)
  }
  if (exclude.length > 0) {
    searchParams.set('exclude', exclude.join(','))
  }

  const query = searchParams.toString()
  const response = await fetch(
    `/api/elements/${elementId}/recommendations${query ? `?${query}` : ''}`,
    init,
  )

  if (!response.ok) {
    throw new Error('Error al cargar recomendaciones')
  }

  return response.json()
}
