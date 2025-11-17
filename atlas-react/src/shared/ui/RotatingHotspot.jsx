import React from 'react'
import clsx from 'clsx'
import { motion, useTransform } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useMapContext } from './InteractiveMap'
import { SmartTooltip } from './SmartTooltip'

/**
 * RotatingHotspot Component
 *
 * Círculo punteado giratorio para mapas interactivos.
 * Replica el comportamiento del HTML original con animación de rotación en sentido horario.
 *
 * ⚠️ IMPORTANTE: Debe usarse DENTRO de un <InteractiveMap> para funcionar
 * correctamente. Usa el contexto del mapa para posicionamiento responsivo.
 *
 * @component
 * @param {string} left - Posición horizontal (porcentaje o px)
 * @param {string} top - Posición vertical (porcentaje o px)
 * @param {string} label - Etiqueta del hotspot (aparece en tooltip al hover)
 * @param {boolean} [active=true] - Si el hotspot está activo (visible)
 * @param {Function} [onSelect] - Callback al hacer click
 * @param {number} [parallaxFactor=0] - Factor de parallax (0 = sin parallax, 0.3 = suave)
 * @param {string} [className] - Clases CSS adicionales
 *
 * @example
 * <InteractiveMap imageSrc="...">
 *   <RotatingHotspot
 *     left="50%"
 *     top="85%"
 *     label="Puerto Punta Chungo"
 *     active={!activeFilter || activeFilter === 'anthropic'}
 *     parallaxFactor={0.15}
 *     onSelect={(e) => navigateToZone(zoneId, e)}
 *   />
 * </InteractiveMap>
 */

function resolveCoordinate(value, tamaño) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const limpio = value.trim()
    const num = Number.parseFloat(limpio)
    if (Number.isFinite(num)) return limpio.endsWith('%') ? (num / 100) * tamaño : num
  }
  return 0
}

function useMapCoordinates(left, top) {
  const { layout } = useMapContext()
  return useMemo(() => {
    if (!layout || layout.width <= 0 || layout.height <= 0) return { left, top }
    return {
      left: resolveCoordinate(left, layout.width),
      top: resolveCoordinate(top, layout.height),
    }
  }, [layout, left, top])
}

function useParallaxTransforms(factor = 0) {
  const { motionX, motionY } = useMapContext()
  const translateX = useTransform(motionX, (value) => value * factor)
  const translateY = useTransform(motionY, (value) => value * factor)
  return { translateX, translateY }
}

export function RotatingHotspot({
  left,
  top,
  label,
  active = true,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  parallaxFactor = 0,
  className,
}) {
  // Usar contexto del mapa para posicionamiento y parallax
  const { translateX, translateY } = useParallaxTransforms(parallaxFactor)
  const { left: leftResuelto, top: topResuelto } = useMapCoordinates(left, top)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = (e) => {
    setIsHovered(true)
    if (onMouseEnter) onMouseEnter(e)
  }

  const handleMouseLeave = (e) => {
    setIsHovered(false)
    if (onMouseLeave) onMouseLeave(e)
  }

  return (
    <motion.div
      className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: leftResuelto,
        top: topResuelto,
        translateX,
        translateY,
        // Mismo tamaño que el círculo interno para hover preciso
        width: '7vw',
        minWidth: '60px',
        height: '7vw',
        minHeight: '60px',
        pointerEvents: 'auto',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={(event) => {
          if (onSelect && active) {
            event.preventDefault()
            event.stopPropagation()
            onSelect(event)
          }
        }}
        aria-label={label}
        disabled={!active}
        className={clsx(
          'absolute inset-0 rounded-full',
          'transition-transform duration-200 hover:scale-110',
          active ? 'cursor-pointer' : 'cursor-not-allowed',
          className,
        )}
        style={{
          opacity: active ? 1 : 0.3,
          backgroundColor: 'transparent',
          border: 'none',
        }}
      >
        <div className="relative h-full w-full">
          {/* Círculo punteado giratorio en sentido horario */}
          <div
            className="absolute inset-0 rounded-full border-[3px] border-dashed border-white animate-rotate-clockwise"
          />

          {/* Tooltip inteligente que evita salirse de la pantalla */}
          <SmartTooltip text={label} isVisible={isHovered} />
        </div>
      </button>
    </motion.div>
  )
}
