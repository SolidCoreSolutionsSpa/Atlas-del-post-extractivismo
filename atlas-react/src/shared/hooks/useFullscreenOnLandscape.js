import { useEffect, useRef } from 'react'
import { useOrientation } from './useOrientation'

/**
 * Hook para activar fullscreen automáticamente en dispositivos móviles
 * cuando se rotan a modo landscape (horizontal).
 *
 * Esto mejora la experiencia en móviles al ocultar las barras del navegador
 * y maximizar el espacio disponible para la aplicación.
 *
 * @example
 * function App() {
 *   useFullscreenOnLandscape()
 *   return <div>...</div>
 * }
 */
export function useFullscreenOnLandscape() {
  const { isLandscape, isMobile } = useOrientation()
  const previousLandscapeRef = useRef(false)
  const userExitedFullscreenRef = useRef(false)

  useEffect(() => {
    // Solo ejecutar en el navegador
    if (typeof document === 'undefined') return

    // Si el usuario salió manualmente del fullscreen, respetar su decisión
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        userExitedFullscreenRef.current = true
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    // Solo ejecutar en el navegador
    if (typeof document === 'undefined') return

    const shouldBeFullscreen = isMobile && isLandscape
    const wasLandscape = previousLandscapeRef.current
    const isCurrentlyFullscreen = !!document.fullscreenElement

    // Actualizar referencia
    previousLandscapeRef.current = isLandscape

    // Caso 1: Cambió a landscape en móvil -> Activar fullscreen
    if (shouldBeFullscreen && !wasLandscape && !userExitedFullscreenRef.current) {
      // Solo intentar fullscreen si no está ya en fullscreen
      if (!isCurrentlyFullscreen && document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            console.log('Fullscreen activado en modo landscape')
          })
          .catch((err) => {
            console.warn('No se pudo activar fullscreen:', err.message)
          })
      }
    }

    // Caso 2: Cambió a portrait desde landscape -> Salir de fullscreen
    if (!shouldBeFullscreen && wasLandscape && isCurrentlyFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('No se pudo salir de fullscreen:', err.message)
        })
      }
      // Reset flag para permitir fullscreen de nuevo si vuelve a rotar
      userExitedFullscreenRef.current = false
    }
  }, [isLandscape, isMobile])
}
