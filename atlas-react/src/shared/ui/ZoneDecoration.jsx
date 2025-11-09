import { motion, useTransform } from 'framer-motion'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useMapContext } from './InteractiveMap'

/**
 * ZoneDecoration Component
 *
 * Decoración visual que aparece sobre el mapa interactivo, mostrando
 * imágenes relacionadas con zonas específicas. Se activa mediante filtros
 * y tiene efecto parallax suave.
 *
 * Basado en el sistema de decoraciones de provinciachoapa.html
 * (elementos .paisaje-parallax con grupos y tipos)
 *
 * ⚠️ IMPORTANTE: Debe usarse DENTRO de un <InteractiveMap> para funcionar
 * correctamente. Usa el contexto del mapa para parallax automático.
 *
 * @component
 * @param {string} image - URL de la imagen de la decoración
 * @param {string} tooltip - Texto del tooltip que aparece en hover
 * @param {object} position - Posición {left, top} en porcentaje o px
 * @param {string} type - Tipo de afectación: 'biotic', 'anthropic', 'physical'
 * @param {boolean} visible - Si la decoración está visible (controlado por filtros)
 * @param {number} [parallaxFactor=0.15] - Factor de parallax (0 = sin parallax, 0.3 = suave)
 * @param {number} [widthVw=9] - Ancho en viewport width (ej: 9 = 9vw)
 * @param {string} [className] - Clases CSS adicionales
 *
 * @example
 * <InteractiveMap imageSrc="...">
 *   <ZoneDecoration
 *     image="/img/caimanes.webp"
 *     tooltip="Arraigo y terrateniencia"
 *     position={{ left: '61%', top: '58%' }}
 *     type="anthropic"
 *     visible={activeFilter === 'anthropic' || activeFilter === null}
 *     parallaxFactor={0.15}
 *     widthVw={10}
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

export function ZoneDecoration({
  image,
  tooltip,
  position,
  type,
  visible = false,
  parallaxFactor = 0.15,
  widthVw = 9, // Tamaño por defecto en viewport width (más grande que el original 6vw)
  className,
}) {
  // Usar contexto del mapa para posicionamiento y parallax
  const { translateX, translateY } = useParallaxTransforms(parallaxFactor)
  const { left: leftResuelto, top: topResuelto } = useMapCoordinates(
    position.left,
    position.top
  )

  return (
    <motion.div
      style={{
        left: leftResuelto,
        top: topResuelto,
        translateX,
        translateY,
        pointerEvents: 'none', // Always none to not interfere with hotspot hovers
      }}
      className={clsx(
        'group absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300',
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      aria-hidden={!visible}
    >
      <img
        src={image}
        alt={tooltip || ''}
        className="pointer-events-none rounded-3xl shadow-lg"
        style={{
          width: `${widthVw}vw`,
          minWidth: '100px', // Mínimo para pantallas muy pequeñas
          height: 'auto',
        }}
        loading="lazy"
      />
      {tooltip && (
        <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-4 py-1.5 text-xs font-normal text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
          {tooltip}
        </span>
      )}
    </motion.div>
  )
}
