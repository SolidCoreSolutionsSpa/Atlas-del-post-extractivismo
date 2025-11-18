import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../design/hooks/usePrefersReducedMotion'
import { usePreloadImages } from '../hooks/usePreloadImage'

export function Loader({ onLoadComplete }) {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Precargar imágenes críticas
  const { isLoaded: imagesLoaded } = usePreloadImages([
    '/img/fondo.jpg',
    '/img/ISOTIPO-blanco.png',
  ])

  useEffect(() => {
    // Solo proceder cuando las imágenes críticas estén cargadas
    if (!imagesLoaded) {
      return
    }

    // Función para verificar si todos los recursos están cargados
    const checkResourcesLoaded = () => {
      // Verificar si el documento está completamente cargado
      if (document.readyState === 'complete') {
        return true
      }
      return false
    }

    // Función que se ejecuta cuando todo está listo
    const handleLoadComplete = () => {
      // Esperar un poco más para asegurar que todo esté renderizado
      setTimeout(() => {
        setFadeOut(true)

        // Después del fade out, notificar que se completó la carga
        setTimeout(() => {
          setIsLoading(false)
          if (onLoadComplete) {
            onLoadComplete()
          }
        }, 800) // Duración del fade out
      }, 500) // Pequeña pausa antes de empezar el fade out
    }

    // Si ya está cargado, ejecutar inmediatamente
    if (checkResourcesLoaded()) {
      handleLoadComplete()
    } else {
      // Esperar al evento load
      window.addEventListener('load', handleLoadComplete)

      // Timeout de seguridad: si tarda más de 5 segundos, mostrar de todas formas
      const timeoutId = setTimeout(handleLoadComplete, 5000)

      return () => {
        window.removeEventListener('load', handleLoadComplete)
        clearTimeout(timeoutId)
      }
    }
  }, [onLoadComplete, imagesLoaded])

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
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
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
