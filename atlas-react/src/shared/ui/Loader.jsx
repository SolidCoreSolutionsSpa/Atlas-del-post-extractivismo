import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../design/hooks/usePrefersReducedMotion'

/**
 * Loader para transiciones entre páginas
 * @param {boolean} isLoading - Estado de carga (controlado externamente)
 */
export function Loader({ isLoading }) {
  const [fadeOut, setFadeOut] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!isLoading) {
      // Cuando isLoading cambia a false, iniciar fade out
      setFadeOut(true)
      const timer = setTimeout(() => {
        setFadeOut(false)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      // Cuando isLoading es true, asegurar que no estamos en fade out
      setFadeOut(false)
    }
  }, [isLoading])

  // Animación de pulsación para el isotipo
  const pulseAnimation = prefersReducedMotion
    ? {}
    : {
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
      }

  const pulseTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }

  return (
    <AnimatePresence>
      {(isLoading || fadeOut) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            backgroundImage: 'url(/img/fondo.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay oscuro opcional para mejorar el contraste */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Isotipo con animación de pulsación */}
          <motion.div
            animate={pulseAnimation}
            transition={pulseTransition}
            className="relative z-10"
          >
            <img
              src="/img/ISOTIPO-blanco.png"
              alt="Cargando..."
              className="w-32 h-32 object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
