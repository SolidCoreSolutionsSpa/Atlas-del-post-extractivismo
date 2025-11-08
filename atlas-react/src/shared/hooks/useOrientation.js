import { useEffect, useState } from 'react'

/**
 * Hook para detectar la orientación del dispositivo y sus dimensiones
 *
 * @returns {Object} Información sobre la orientación y dimensiones
 * @property {string} orientation - 'landscape' | 'portrait'
 * @property {boolean} isPortrait - Si está en modo vertical
 * @property {boolean} isLandscape - Si está en modo horizontal
 * @property {boolean} isMobile - Si es un dispositivo móvil (< 768px)
 * @property {Object} dimensions - { width, height }
 *
 * @example
 * const { isPortrait, isMobile } = useOrientation()
 *
 * if (isMobile && isPortrait) {
 *   // Mostrar modal de orientación
 * }
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState(() => {
    if (typeof window === 'undefined') return 'landscape'
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  })

  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }))

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      const height = window.innerHeight

      setDimensions({ width, height })
      setOrientation(width > height ? 'landscape' : 'portrait')
    }

    // Listener para resize
    window.addEventListener('resize', handleResize)

    // Listener para cambio de orientación (mobile)
    // Algunos navegadores móviles disparan este evento específicamente
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleResize)
      }
    }
  }, [])

  const isPortrait = orientation === 'portrait'
  const isLandscape = orientation === 'landscape'
  const isMobile = dimensions.width < 768 // Tailwind 'md' breakpoint

  return {
    orientation,
    isPortrait,
    isLandscape,
    isMobile,
    dimensions,
  }
}
