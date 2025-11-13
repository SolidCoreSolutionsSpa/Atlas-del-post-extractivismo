import { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'

/**
 * SmartTooltip Component
 *
 * Un tooltip inteligente que detecta automáticamente cuando se sale del viewport
 * y ajusta su posición para mantenerse visible.
 *
 * - Posición por defecto: abajo del ícono, centrado horizontalmente
 * - Si se sale por la derecha: el texto termina justo antes del borde derecho del viewport
 * - Si se sale por la izquierda: el texto empieza justo después del borde izquierdo del viewport
 * - Si se sale por abajo: se mueve arriba con la misma distancia
 *
 * @component
 * @param {string} text - Texto a mostrar en el tooltip
 * @param {boolean} isVisible - Si el tooltip debe mostrarse
 * @param {string} [className] - Clases adicionales para personalizar el estilo
 */
export function SmartTooltip({ text, isVisible, className }) {
  const tooltipRef = useRef(null)
  const containerRef = useRef(null)
  const [style, setStyle] = useState({})

  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !containerRef.current) return

    // Pequeño delay para asegurar que el DOM está renderizado
    const timeoutId = setTimeout(() => {
      if (!tooltipRef.current || !containerRef.current) return

      const tooltip = tooltipRef.current
      const container = containerRef.current
      const tooltipRect = tooltip.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const padding = 8
      const gap = 8 // Distancia entre el ícono y el tooltip

      // Posición por defecto: centrado horizontalmente, abajo del ícono
      let transformX = '-50%'
      let additionalTranslateX = 0

      // Calcular posición del tooltip centrado
      const centerX = containerRect.left + containerRect.width / 2
      const tooltipLeft = centerX - tooltipRect.width / 2
      const tooltipRight = centerX + tooltipRect.width / 2

      // Verificar overflow horizontal
      const overflowsRight = tooltipRight > viewportWidth - padding
      const overflowsLeft = tooltipLeft < padding

      // Ajustar posición horizontal si hay overflow
      if (overflowsRight) {
        // El tooltip debe terminar antes del borde derecho del viewport
        // Calcular cuánto necesitamos mover a la izquierda
        const overflow = tooltipRight - (viewportWidth - padding)
        additionalTranslateX = -overflow
      } else if (overflowsLeft) {
        // El tooltip debe empezar después del borde izquierdo del viewport
        // Calcular cuánto necesitamos mover a la derecha
        const overflow = padding - tooltipLeft
        additionalTranslateX = overflow
      }

      // Verificar overflow vertical
      const defaultTop = containerRect.bottom + gap
      const defaultBottom = defaultTop + tooltipRect.height
      const overflowsBottom = defaultBottom > viewportHeight - padding

      // Ajustar posición vertical si hay overflow
      if (overflowsBottom) {
        // Mover el tooltip arriba del ícono
        setStyle({
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          marginBottom: `${gap}px`,
          transform: `translate(calc(-50% + ${additionalTranslateX}px), 0)`,
        })
        return
      }

      setStyle({
        position: 'absolute',
        top: '100%',
        left: '50%',
        marginTop: `${gap}px`,
        transform: `translate(calc(-50% + ${additionalTranslateX}px), 0)`,
      })
    }, 10)

    return () => clearTimeout(timeoutId)
  }, [isVisible, text])

  return (
    <span ref={containerRef} className="absolute inset-0">
      <span
        ref={tooltipRef}
        className={clsx(
          'pointer-events-none whitespace-nowrap bg-black/80 px-4 py-1.5 text-xs font-normal text-white shadow transition-opacity',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          borderRadius: '50px',
          ...style,
        }}
      >
        {text}
      </span>
    </span>
  )
}
