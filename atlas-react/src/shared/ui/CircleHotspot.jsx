import React from 'react'
import { motion, useTransform } from 'framer-motion'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useMapContext } from './InteractiveMap'

/**
 * CircleHotspot Component
 *
 * Hotspot circular con borde punteado para mapas interactivos.
 * Utilizado para marcar zonas clickeables en mapas de provincias.
 *
 * Réplica del sistema de puntos circulares en provinciachoapa.html
 *
 * ⚠️ IMPORTANTE: Debe usarse DENTRO de un <InteractiveMap> para funcionar
 * correctamente. Usa el contexto del mapa para parallax automático.
 *
 * @component
 * @param {string} left - Posición horizontal (porcentaje o px)
 * @param {string} top - Posición vertical (porcentaje o px)
 * @param {string} label - Etiqueta del hotspot
 * @param {boolean} [active=true] - Si el hotspot está activo (visible)
 * @param {Function} [onSelect] - Callback al hacer click
 * @param {number} [parallaxFactor=0] - Factor de parallax (0 = sin parallax, 0.3 = suave)
 * @param {string} [className] - Clases CSS adicionales
 * @example
 * <InteractiveMap imageSrc="...">
 *   <CircleHotspot
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

export function CircleHotspot({
  left,
  top,
  label,
  active = true,
  onSelect,
  parallaxFactor = 0,
  className,
}) {
  // Usar contexto del mapa para posicionamiento y parallax
  const { translateX, translateY } = useParallaxTransforms(parallaxFactor)
  const { left: leftResuelto, top: topResuelto } = useMapCoordinates(left, top)

  return (
    <motion.button
      type="button"
      onClick={(event) => {
        if (onSelect && active) {
          event.preventDefault()
          event.stopPropagation()
          onSelect(event)
        }
      }}
      style={{
        left: leftResuelto,
        top: topResuelto,
        translateX,
        translateY,
      }}
      className={clsx(
        'absolute flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-dashed border-white/80 transition-opacity duration-300',
        active ? 'cursor-pointer' : 'cursor-not-allowed',
        className,
      )}
      aria-label={label}
      disabled={!active}
      initial={false}
      animate={{ opacity: active ? 1 : 0.3 }}
      whileHover={active ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <span className="pointer-events-none rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-token-primary shadow">
        {label}
      </span>
    </motion.button>
  )
}
