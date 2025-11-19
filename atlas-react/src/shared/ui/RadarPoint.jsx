import { motion } from 'framer-motion'
import { useMemo } from 'react'
import clsx from 'clsx'
import { usePrefersReducedMotion } from '../design/hooks/usePrefersReducedMotion'

/**
 * RadarPoint - Punto radar animado con anillos pulsantes concéntricos
 *
 * Replica exactamente el comportamiento del CSS original (.radar-point)
 * con 3 anillos que pulsan desde el centro hacia afuera con delays escalonados
 *
 * @param {Object} props
 * @param {string} props.left - Posición left (%, px)
 * @param {string} props.top - Posición top (%, px)
 * @param {string} props.label - Texto accesible (aria-label)
 * @param {Function} props.onClick - Callback al hacer clic
 * @param {Function} props.onMouseEnter - Callback al entrar con el mouse
 * @param {Function} props.onMouseLeave - Callback al salir con el mouse
 * @param {Function} props.onFocus - Callback al recibir focus
 * @param {Function} props.onBlur - Callback al perder focus
 * @param {Object} props.parallaxOffset - Offset de parallax { x, y }
 * @param {string} props.color - Color hex del punto (ej: '#d57a00')
 * @param {string} props.state - Estado visual: 'visible' | 'hidden' | 'soft'
 * @param {boolean} props.isHovered - Si está en hover (acelera animación)
 */
export function RadarPoint({
  left,
  top,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  parallaxOffset = { x: 0, y: 0 },
  color = '#d57a00',
  state = 'visible',
  isHovered = false,
}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Configuración de animación para cada anillo
  // IMPORTANTE: No animamos borderWidth porque causa problemas en producción
  // El borde se define con clase CSS y solo animamos scale y opacity
  const ringAnimation = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        scale: 1,
        opacity: 0.4,
      }
    }

    return {
      scale: [0.1, 1, 1],
      opacity: [0.9, 0.3, 0],
    }
  }, [prefersReducedMotion])

  const ringTransition = useMemo(() => {
    const duration = isHovered ? 1.8 : 2.4
    return {
      duration,
      ease: 'easeOut',
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0.3,
    }
  }, [isHovered])

  // Animación del core en hover
  const coreScale = isHovered ? 1.15 : 1

  // Opacidad en hover - los puntos se vuelven semi-transparentes
  const hoverOpacity = isHovered ? 0.5 : 1

  // Estados de visibilidad
  const containerOpacity =
    state === 'hidden' ? 0 : state === 'soft' ? 0.4 : 1
  const pointerEvents = state === 'hidden' ? 'none' : 'auto'

  return (
    <motion.div
      className="absolute"
      style={{
        left,
        top,
        width: '9vw',
        minWidth: '80px',
        aspectRatio: '1',
        transform: `translate(calc(-50% + ${parallaxOffset.x}px), calc(-50% + ${parallaxOffset.y}px))`,
        pointerEvents: 'none',
        zIndex: 80,
      }}
      initial={false}
      animate={{
        opacity: containerOpacity * hoverOpacity,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Contenedor de anillos - no clickeable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Anillo 1 - delay 0s */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            transform: 'scale(0.1)',
            opacity: 0.9,
            animation: prefersReducedMotion
              ? 'none'
              : 'pulseRing 2.4s ease-out infinite',
            animationDelay: '0s',
            animationFillMode: 'both',
          }}
        />

        {/* Anillo 2 - delay 0.6s */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            transform: 'scale(0.1)',
            opacity: 0.9,
            animation: prefersReducedMotion
              ? 'none'
              : 'pulseRing 2.4s ease-out infinite',
            animationDelay: '0.6s',
            animationFillMode: 'both',
          }}
        />

        {/* Anillo 3 - delay 1.2s */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            transform: 'scale(0.1)',
            opacity: 0.9,
            animation: prefersReducedMotion
              ? 'none'
              : 'pulseRing 2.4s ease-out infinite',
            animationDelay: '1.2s',
            animationFillMode: 'both',
          }}
        />

        {/* Definición de la animación CSS */}
        <style>{`
          @keyframes pulseRing {
            0% {
              transform: scale(0.1);
              opacity: 0.9;
            }
            70% {
              opacity: 0.3;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* Botón clickeable - solo el núcleo */}
      <motion.button
        type="button"
        onClick={(event) => {
          if (onClick && state !== 'hidden') {
            event.preventDefault()
            event.stopPropagation()
            onClick(event)
          }
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label={label}
        className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
        style={{
          width: '2vw',
          minWidth: '20px',
          aspectRatio: '1',
          cursor: state === 'hidden' ? 'default' : 'pointer',
          pointerEvents: state === 'hidden' ? 'none' : 'auto',
        }}
        initial={false}
      >
        {/* Núcleo central */}
        <motion.span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '0.9vw',
            minWidth: '10px',
            aspectRatio: '1',
            backgroundColor: color,
            boxShadow: `0 0 0 2px #fff inset, 0 0 0 1px ${color}`,
          }}
          initial={false}
          animate={{ scale: coreScale }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        />

        {/* Tooltip al hover */}
        <span
          className={clsx(
            'pointer-events-none absolute -bottom-16 left-1/2 w-max -translate-x-1/2 rounded-full bg-black/85 px-4 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200',
            'group-hover:opacity-100',
          )}
          style={{
            maxWidth: '200px',
          }}
        >
          {label}
        </span>
      </motion.button>
    </motion.div>
  )
}
