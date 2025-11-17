import { useEffect, useState, useCallback } from 'react'

/**
 * Hook para manejar el modo de pantalla completa
 * Utiliza la Fullscreen API del navegador para ocultar el HUD y aprovechar toda la pantalla
 *
 * @returns {Object} Estado y controles de pantalla completa
 * @property {boolean} isFullscreen - Si actualmente está en modo pantalla completa
 * @property {Function} toggleFullscreen - Función para alternar el modo pantalla completa
 * @property {Function} enterFullscreen - Función para entrar en pantalla completa
 * @property {Function} exitFullscreen - Función para salir de pantalla completa
 * @property {boolean} isSupported - Si el navegador soporta la API de pantalla completa
 *
 * @example
 * const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen()
 *
 * if (isSupported) {
 *   <button onClick={toggleFullscreen}>
 *     {isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
 *   </button>
 * }
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Verificar si el navegador soporta la API de pantalla completa
  const isSupported =
    typeof document !== 'undefined' &&
    (document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled)

  // Obtener el elemento actualmente en pantalla completa (compatible con diferentes navegadores)
  const getFullscreenElement = useCallback(() => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )
  }, [])

  // Actualizar el estado cuando cambia el modo pantalla completa
  useEffect(() => {
    if (!isSupported) return

    const handleFullscreenChange = () => {
      setIsFullscreen(!!getFullscreenElement())
    }

    // Agregar listeners para diferentes navegadores
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [isSupported, getFullscreenElement])

  // Entrar en modo pantalla completa
  const enterFullscreen = useCallback(async () => {
    if (!isSupported) {
      console.warn('El navegador no soporta la API de pantalla completa')
      return
    }

    try {
      const element = document.documentElement

      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen()
      }
    } catch (error) {
      console.error('Error al entrar en modo pantalla completa:', error)
    }
  }, [isSupported])

  // Salir del modo pantalla completa
  const exitFullscreen = useCallback(async () => {
    if (!isSupported || !getFullscreenElement()) return

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen()
      }
    } catch (error) {
      console.error('Error al salir del modo pantalla completa:', error)
    }
  }, [isSupported, getFullscreenElement])

  // Alternar entre entrar y salir de pantalla completa
  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen()
    } else {
      await enterFullscreen()
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen])

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    isSupported,
  }
}
