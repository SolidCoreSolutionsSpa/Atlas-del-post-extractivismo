import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hook para manejar transiciones suaves (crossfade) entre imágenes
 *
 * @param {string} initialImage - URL de la imagen inicial
 * @param {number} fadeDuration - Duración del fade en milisegundos (default: 300)
 * @returns {Object} { currentImage, isFading, swapImage }
 *
 * @example
 * const { currentImage, isFading, swapImage } = useImageCrossfade('/img/default.jpg', 300)
 *
 * // Cambiar imagen
 * swapImage('/img/nueva-imagen.jpg')
 */
export function useImageCrossfade(initialImage, fadeDuration = 300) {
  const [currentImage, setCurrentImage] = useState(initialImage)
  const [isFading, setIsFading] = useState(false)
  const fadeTimeoutRef = useRef(null)

  const swapImage = useCallback(
    (newSrc) => {
      // Si es la misma imagen, no hacer nada
      if (newSrc === currentImage) return

      // Cancelar timeout anterior si existe (para permitir interrumpir fades)
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }

      setIsFading(true)

      // Fade out, cambiar src, fade in
      fadeTimeoutRef.current = setTimeout(() => {
        setCurrentImage(newSrc)
        requestAnimationFrame(() => {
          setIsFading(false)
          fadeTimeoutRef.current = null
        })
      }, fadeDuration)
    },
    [currentImage, fadeDuration],
  )

  // Cleanup: cancelar timeout si el componente se desmonta
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [])

  return { currentImage, isFading, swapImage }
}
