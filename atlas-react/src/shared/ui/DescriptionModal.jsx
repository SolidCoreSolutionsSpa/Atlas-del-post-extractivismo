import React from 'react'
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
          <div className="modal-wrapper-responsive fixed inset-0 z-[9999] flex items-center justify-center" style={{ pointerEvents: 'none' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="modal-content-responsive relative w-full rounded-2xl bg-white/85 shadow-2xl backdrop-blur-sm"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón de cerrar */}
              <button
                onClick={onClose}
                className="modal-close-button-responsive absolute flex items-center justify-center rounded-full bg-gray-200 text-gray-700 transition hover:bg-gray-300"
                aria-label="Cerrar modal"
              >
                <svg
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
                className="modal-title-responsive font-bold text-black pr-8"
                style={{ fontFamily: '"Baskervville", serif' }}
              >
                {title}
              </h2>

              {/* Descripción */}
              <p className="modal-description-responsive text-gray-700">
                {description}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
