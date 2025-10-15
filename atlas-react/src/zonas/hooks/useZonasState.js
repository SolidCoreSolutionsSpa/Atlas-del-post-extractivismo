import { useEffect, useState } from 'react'

export function useZonasState({ zonasService, caseStudyId }) {
  const [status, setStatus] = useState('idle')
  const [zonas, setZonas] = useState([])

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      try {
        const data = caseStudyId
          ? await zonasService.getForCaseStudy(caseStudyId)
          : await zonasService.getAll()

        if (isMounted) {
          setZonas(data)
          setStatus('ready')
        }
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setStatus('error')
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [zonasService, caseStudyId])

  return { status, zonas }
}
