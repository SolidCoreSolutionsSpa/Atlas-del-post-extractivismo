import { useEffect, useState } from 'react'

export function useCaseStudiesState({ caseStudiesService }) {
  const [status, setStatus] = useState('idle')
  const [caseStudies, setCaseStudies] = useState([])

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      try {
        const data = await caseStudiesService.getAll()
        if (isMounted) {
          setCaseStudies(data)
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
  }, [caseStudiesService])

  return { status, caseStudies }
}
