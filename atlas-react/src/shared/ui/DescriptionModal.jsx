import { motion, AnimatePresence } from 'framer-motion'

/**
 * Modal que muestra la descripción de un caso de estudio
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal debe mostrarse
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string} props.title - Título del caso de estudio
 * @param {string} props.description - Descripción a mostrar
 *
 * @example
 * <DescriptionModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Provincia de Choapa"
 *   description="Descripción de la provincia..."
 * />
 */
export function DescriptionModal({ isOpen, onClose, title, description }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay de fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            style={{ pointerEvents: 'auto' }}
          />

          {/* Contenido del modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ pointerEvents: 'none' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative max-w-lg w-full rounded-2xl bg-white p-8 shadow-2xl"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón de cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-gray-800"
                aria-label="Cerrar modal"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Título */}
              <h2
                className="mb-6 text-2xl font-semibold text-gray-900 pr-8"
                style={{ fontFamily: '"Baskervville", serif' }}
              >
                {title}
              </h2>

              {/* Descripción */}
              <p className="text-base leading-relaxed text-gray-700">
                {description}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
