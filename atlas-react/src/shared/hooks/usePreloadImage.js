import { useEffect, useState } from 'react'

/**
 * Hook para precargar una imagen y mantenerla en memoria
 * @param {string} src - URL de la imagen a precargar
 * @returns {boolean} - true si la imagen está cargada, false en caso contrario
 */
export function usePreloadImage(src) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!src) {
      setIsLoaded(false)
      return
    }

    const img = new Image()

    const handleLoad = () => {
      setIsLoaded(true)
    }

    const handleError = () => {
      console.warn(`Failed to preload image: ${src}`)
      setIsLoaded(false)
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)

    img.src = src

    // Si la imagen ya está en caché, puede que el evento load ya se haya disparado
    if (img.complete) {
      handleLoad()
    }

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src])

  return isLoaded
}

/**
 * Hook para precargar múltiples imágenes
 * @param {string[]} sources - Array de URLs de imágenes a precargar
 * @returns {{ isLoaded: boolean, progress: number }} - Estado de carga y progreso
 */
export function usePreloadImages(sources) {
  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!sources || sources.length === 0) {
      setIsLoaded(true)
      return
    }

    let mounted = true
    let completed = 0

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image()

        const handleComplete = () => {
          if (mounted) {
            completed++
            setLoadedCount(completed)

            if (completed === sources.length) {
              setIsLoaded(true)
            }
          }
          resolve()
        }

        img.addEventListener('load', handleComplete)
        img.addEventListener('error', handleComplete)

        img.src = src

        // Si la imagen ya está en caché
        if (img.complete) {
          handleComplete()
        }
      })
    }

    Promise.all(sources.map(loadImage))

    return () => {
      mounted = false
    }
  }, [sources])

  const progress = sources && sources.length > 0 ? loadedCount / sources.length : 0

  return { isLoaded, progress }
}
