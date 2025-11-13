import { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'

/**
 * SmartTooltip Component
 *
 * Un tooltip inteligente que detecta automáticamente cuando se sale del viewport
 * y ajusta su posición para mantenerse visible.
 *
 * - Posición por defecto: abajo del ícono, centrado horizontalmente
 * - Si se sale por la derecha: se alinea a la derecha (termina en el centro del ícono)
 * - Si se sale por la izquierda: se alinea a la izquierda (empieza en el centro del ícono)
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
      const gap = 8 // Distancia entre el ícono y el tooltip (equivalente a mt-2)

      // Centro del contenedor (ícono)
      const centerX = containerRect.left + containerRect.width / 2
      const centerY = containerRect.top + containerRect.height / 2

      let transformX = '-50%' // Por defecto, centrado
      let transformY = '0'
      let top = '100%' // Por defecto, abajo del ícono
      let left = '50%' // Por defecto, centrado horizontalmente
      let marginTop = gap

      // Calcular posición por defecto (abajo, centrado)
      const defaultLeft = centerX - tooltipRect.width / 2
      const defaultRight = centerX + tooltipRect.width / 2
      const defaultTop = containerRect.bottom + gap
      const defaultBottom = defaultTop + tooltipRect.height

      // Verificar overflow horizontal
      const overflowsRight = defaultRight > viewportWidth - padding
      const overflowsLeft = defaultLeft < padding

      // Verificar overflow vertical
      const overflowsBottom = defaultBottom > viewportHeight - padding

      // Ajustar posición horizontal si hay overflow
      if (overflowsRight) {
        // El tooltip debe terminar en el centro del ícono (alineado a la derecha)
        left = '50%' // Centro del ícono
        transformX = '-100%' // El tooltip se extiende completamente a la izquierda del centro
      } else if (overflowsLeft) {
        // El tooltip debe empezar en el centro del ícono (alineado a la izquierda)
        left = '50%' // Centro del ícono
        transformX = '0%' // El tooltip se extiende completamente a la derecha del centro
      }

      // Ajustar posición vertical si hay overflow
      if (overflowsBottom) {
        // Mover el tooltip arriba del ícono
        setStyle({
          position: 'absolute',
          bottom: '100%',
          left,
          marginBottom: `${gap}px`,
          transform: `translate(${transformX}, ${transformY})`,
        })
        return
      }

      setStyle({
        position: 'absolute',
        top,
        left,
        marginTop: `${marginTop}px`,
        transform: `translate(${transformX}, ${transformY})`,
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
