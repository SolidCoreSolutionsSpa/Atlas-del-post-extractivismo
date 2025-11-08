import { useEffect, useState } from 'react'

/**
 * Hook para aplicar efecto parallax basado en la posición del mouse
 *
 * @param {Object} config - Configuración del parallax
 * @param {number} config.intensity - Intensidad del parallax para la imagen de fondo (default: 20)
 * @param {number|null} config.pointIntensity - Intensidad para puntos (default: intensity / 2)
 * @param {boolean} config.enabled - Si el parallax está habilitado (default: true)
 * @returns {Object} { offset, pointOffset }
 *
 * @example
 * const { offset, pointOffset } = useParallax({
 *   intensity: 20,
 *   pointIntensity: 10,
 *   enabled: !prefersReducedMotion
 * })
 *
 * // Usar offset en transform
 * transform: `translate(${offset.x}px, ${offset.y}px)`
 */
export function useParallax({
  intensity = 20,
  pointIntensity = null,
  enabled = true,
} = {}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [pointOffset, setPointOffset] = useState({ x: 0, y: 0 })

  const actualPointIntensity = pointIntensity ?? intensity / 2

  useEffect(() => {
    if (!enabled) {
      return
    }

    function handleMouseMove(event) {
      const { innerWidth, innerHeight } = window
      const offsetX = 0.5 - event.clientX / innerWidth
      const offsetY = 0.5 - event.clientY / innerHeight

      // Parallax para la imagen de fondo
      setOffset({
        x: offsetX * intensity,
        y: offsetY * intensity,
      })

      // Parallax para los puntos (con menor intensidad)
      setPointOffset({
        x: offsetX * actualPointIntensity,
        y: offsetY * actualPointIntensity,
      })
    }

    function handleMouseLeave() {
      setOffset({ x: 0, y: 0 })
      setPointOffset({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled, intensity, actualPointIntensity])

  return { offset, pointOffset }
}
