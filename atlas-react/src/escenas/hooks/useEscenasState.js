import { useEffect, useState } from 'react'

export function useEscenasState({ escenasService, zoneId }) {
  const [status, setStatus] = useState('idle')
  const [escenas, setEscenas] = useState([])

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      try {
        const data = zoneId
          ? await escenasService.getByZone(zoneId)
          : await escenasService.getAll()

        if (isMounted) {
          setEscenas(data)
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
  }, [escenasService, zoneId])

  return { status, escenas }
}
