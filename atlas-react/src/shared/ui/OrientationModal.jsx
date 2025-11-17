import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

/**
 * Modal que bloquea la interfaz cuando un dispositivo móvil
 * está en orientación vertical (portrait)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal debe mostrarse
 *
 * @example
 * <OrientationModal isOpen={isMobile && isPortrait} />
 */
export function OrientationModal({ isOpen }) {
  const [isFullscreenRequested, setIsFullscreenRequested] = useState(false)

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

            {/* Título */}
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Rota tu dispositivo
            </h2>

            {/* Descripción */}
            <p className="mb-6 text-gray-600">
              Esta aplicación está diseñada para verse en modo horizontal. Por
              favor, rota tu dispositivo para continuar explorando el Atlas del
              (Post) Extractivismo.
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
                Ahora rota tu dispositivo para ver en pantalla completa
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
