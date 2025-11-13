import { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'

/**
 * SmartTooltip Component
 *
 * Un tooltip inteligente que detecta automáticamente cuando se sale del viewport
 * y ajusta su posición para mantenerse visible.
 *
 * @component
 * @param {string} text - Texto a mostrar en el tooltip
 * @param {boolean} isVisible - Si el tooltip debe mostrarse
 * @param {string} [className] - Clases adicionales para personalizar el estilo
 */
export function SmartTooltip({ text, isVisible, className }) {
  const tooltipRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [alignment, setAlignment] = useState('bottom-center')

  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return

    const tooltip = tooltipRef.current
    const rect = tooltip.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Padding desde los bordes del viewport
    const padding = 8

    let newAlignment = 'bottom-center'
    let adjustX = 0
    let adjustY = 0

    // Detectar overflow en el eje Y (arriba/abajo)
    const overflowsBottom = rect.bottom > viewportHeight - padding
    const overflowsTop = rect.top < padding

    // Detectar overflow en el eje X (izquierda/derecha)
    const overflowsRight = rect.right > viewportWidth - padding
    const overflowsLeft = rect.left < padding

    // Ajustar posición vertical
    if (overflowsBottom && !overflowsTop) {
      // Mover hacia arriba
      newAlignment = 'top-center'
    } else if (overflowsTop && !overflowsBottom) {
      // Mover hacia abajo
      newAlignment = 'bottom-center'
    }

    // Ajustar posición horizontal
    if (overflowsRight && !overflowsLeft) {
      // Mover hacia la izquierda
      adjustX = -(rect.right - viewportWidth + padding)
      newAlignment = newAlignment.replace('center', 'right')
    } else if (overflowsLeft && !overflowsRight) {
      // Mover hacia la derecha
      adjustX = padding - rect.left
      newAlignment = newAlignment.replace('center', 'left')
    }

    // Casos especiales: esquinas
    if (overflowsBottom && overflowsRight) {
      newAlignment = 'top-right'
    } else if (overflowsBottom && overflowsLeft) {
      newAlignment = 'top-left'
    } else if (overflowsTop && overflowsRight) {
      newAlignment = 'bottom-right'
    } else if (overflowsTop && overflowsLeft) {
      newAlignment = 'bottom-left'
    }

    setAlignment(newAlignment)
    setPosition({ x: adjustX, y: adjustY })
  }, [isVisible])

  const positionClasses = clsx({
    // Posición vertical por defecto (abajo)
    'top-full mt-2': alignment.startsWith('bottom'),
    // Posición vertical alternativa (arriba)
    'bottom-full mb-2': alignment.startsWith('top'),
    // Alineación horizontal
    'left-1/2 -translate-x-1/2': alignment.includes('center'),
    'left-0': alignment.includes('left'),
    'right-0': alignment.includes('right'),
  })

  return (
    <span
      ref={tooltipRef}
      className={clsx(
        'pointer-events-none absolute whitespace-nowrap bg-black/80 px-4 py-1.5 text-xs font-normal text-white shadow transition-opacity',
        positionClasses,
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        borderRadius: '50px',
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {text}
    </span>
  )
}
