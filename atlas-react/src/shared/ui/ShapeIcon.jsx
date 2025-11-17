import { ShapeBackground } from './ShapeBackground'

/**
 * ShapeIcon Component
 *
 * Componente reutilizable que combina ShapeBackground con un icono (imagen).
 * Útil para renderizar iconos con diferentes formas geométricas de fondo.
 *
 * @param {Object} props
 * @param {'circle' | 'square' | 'diamond' | 'triangle'} props.shape - Forma del fondo
 * @param {string} props.iconSrc - Ruta de la imagen del icono
 * @param {string} props.iconAlt - Texto alternativo para la imagen
 * @param {string} [props.iconPadding] - Padding para el icono
 * @param {boolean} [props.pulsate] - Si debe tener animación de pulso
 * @param {boolean} [props.active] - Si está activo (afecta la animación)
 * @param {string} [props.backgroundColor] - Color de fondo personalizado
 * @param {string} [props.className] - Clases adicionales para el contenedor
 */
export function ShapeIcon({
  shape = 'circle',
  iconSrc,
  iconAlt,
  iconPadding = 'p-1.5',
  pulsate = false,
  active = true,
  backgroundColor,
  className = '',
}) {
  return (
    <ShapeBackground
      shape={shape}
      iconPadding={iconPadding}
      pulsate={pulsate}
      active={active}
      backgroundColor={backgroundColor}
      className={className}
    >
      <img
        src={iconSrc}
        alt={iconAlt}
        className="h-[95%] w-[95%] object-contain"
        loading="lazy"
      />
    </ShapeBackground>
  )
}
