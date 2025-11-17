import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * Modal que bloquea la interfaz cuando un dispositivo móvil
 * está en orientación vertical (portrait) o cuando está en landscape
 * pero no ha activado fullscreen
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal debe mostrarse
 * @param {boolean} props.isPortrait - Si está en modo portrait
 * @param {boolean} props.isLandscape - Si está en modo landscape
 *
 * @example
 * <OrientationModal isOpen={shouldShow} isPortrait={isPortrait} isLandscape={isLandscape} />
 */
export function OrientationModal({ isOpen, isPortrait, isLandscape }) {
  const [isFullscreenRequested, setIsFullscreenRequested] = useState(false)

  // Escuchar cambios en el estado de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Si el usuario salió de fullscreen, resetear el estado
      if (!document.fullscreenElement) {
        setIsFullscreenRequested(false)
      } else {
        // Si está en fullscreen, marcar como solicitado
        setIsFullscreenRequested(true)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleFullscreenClick = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
        setIsFullscreenRequested(true)
      }
    } catch (err) {
      console.warn('No se pudo activar fullscreen:', err.message)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
          style={{ pointerEvents: 'auto' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mx-4 max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
          >
            {/* Icono de rotación animado */}
            <motion.div
              animate={{ rotate: [0, 90, 90, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mb-6 flex justify-center"
            >
              <svg
                className="h-24 w-24 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </motion.div>

            {/* Título dinámico según orientación */}
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              {isPortrait ? 'Rota tu dispositivo' : 'Activa pantalla completa'}
            </h2>

            {/* Descripción dinámica */}
            <p className="mb-6 text-gray-600">
              {isPortrait ? (
                <>
                  Esta aplicación está diseñada para verse en modo horizontal. Por
                  favor, rota tu dispositivo para continuar explorando el Atlas del
                  (Post) Extractivismo.
                </>
              ) : (
                <>
                  Para una mejor experiencia y ver toda la interfaz sin las barras
                  del navegador, activa la pantalla completa.
                </>
              )}
            </p>

            {/* Botón de Fullscreen */}
            {!isFullscreenRequested && (
              <button
                onClick={handleFullscreenClick}
                className="w-full rounded-lg bg-gray-900 px-6 py-3 text-white font-medium transition-colors hover:bg-gray-800 active:bg-gray-700"
              >
                Activar pantalla completa
              </button>
            )}

            {isFullscreenRequested && (
              <p className="text-sm text-gray-500">
                {isPortrait
                  ? 'Ahora rota tu dispositivo para ver en pantalla completa'
                  : '¡Perfecto! Ya estás en pantalla completa'}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
