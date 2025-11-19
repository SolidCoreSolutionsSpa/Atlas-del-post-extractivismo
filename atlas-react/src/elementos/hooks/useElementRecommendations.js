import { useEffect, useMemo, useState } from 'react'

import { RecommendationsService } from '../services/recommendationsService'

/**
 * Hook de estado local para recomendaciones de elementos.
 * @param {{
 *   elementId?: string,
 *   elementsRepository: import('../repo/elementsRepository').ElementsRepository,
 *   options?: {
 *     limit?: number,
 *     exclude?: string[],
 *     cursor?: string | null,
 *     seed?: number
 *   }
 * }}
 */
export function useElementRecommendations({
  elementId,
  elementsRepository,
  options = {},
}) {
  const [status, setStatus] = useState('idle')
  const [base, setBase] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [cursor, setCursor] = useState(null)

  const service = useMemo(() => {
    if (!elementsRepository) return null
    return new RecommendationsService({
      elementsRepository,
    })
  }, [elementsRepository])

  const optionsKey = useMemo(() => JSON.stringify(options), [options])

  useEffect(() => {
    let isMounted = true

    async function load() {
      if (!elementId || !service) {
        setBase(null)
        setRecommendations([])
        setCursor(null)
        setStatus('idle')
        return
      }

      setStatus('loading')
      const result = await service.getRecommendations({
        elementId,
        ...options,
      })

      if (isMounted) {
        setBase(result.base)
        setRecommendations(result.recommendations)
        setCursor(result.nextCursor)
        setStatus('ready')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [elementId, optionsKey, service])

  return { service, status, base, recommendations, cursor }
}
