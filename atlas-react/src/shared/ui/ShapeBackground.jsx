import clsx from 'clsx'

/**
 * ShapeBackground Component
 *
 * Renderiza diferentes formas geométricas como fondo para iconos.
 * Útil para diferenciar visualmente categorías de afectación.
 * Todas las formas usan un cuadrado base con clip-path para crear la ilusión de diferentes figuras.
 *
 * @param {Object} props
 * @param {'circle' | 'square' | 'diamond' | 'triangle'} props.shape - Forma del fondo
 * @param {string} [props.className] - Clases adicionales para el contenedor
 * @param {React.ReactNode} props.children - Contenido a mostrar dentro de la forma
 * @param {string} [props.iconPadding] - Padding para el ícono
 * @param {boolean} [props.pulsate] - Si debe tener animación de pulso
 * @param {boolean} [props.active] - Si está activo (afecta la animación)
 */
export function ShapeBackground({
  shape = 'circle',
  className = '',
  children,
  iconPadding = 'p-1.5',
  pulsate = false,
  active = true,
}) {
  // Tamaño responsivo - diferentes tamaños según la forma
  // Usa clases CSS responsivas definidas en legacy.css que escalan con viewport
  const sizeClass =
    shape === 'triangle'
      ? 'map-icon-triangle-responsive'
      : shape === 'diamond'
      ? 'map-icon-diamond-responsive'
      : 'map-icon-base-responsive'

  // Clases base compartidas por todas las formas
  const baseClasses = clsx(
    'pointer-events-auto flex items-center justify-center bg-white/80 backdrop-blur transition hover:scale-110',
    sizeClass,
    iconPadding,
    pulsate && active && 'animate-[pulse-soft_2s_ease-in-out_infinite]',
    className,
  )

  // Definir clip-path según la forma
  let clipPathStyle = {}

  switch (shape) {
    case 'square':
      // Cuadrado con bordes ligeramente redondeados
      clipPathStyle = {}
      break

    case 'diamond':
      // Rombo/diamante: cortamos las 4 esquinas para formar un diamante
      clipPathStyle = {
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      }
      break

    case 'triangle':
      // Triángulo equilátero apuntando hacia arriba
      clipPathStyle = {
        clipPath: 'polygon(50% 10%, 90% 85%, 10% 85%)',
      }
      break

    case 'circle':
    default:
      // Círculo usando border-radius
      clipPathStyle = {}
      break
  }

  const shapeClass = shape === 'circle'
    ? 'rounded-full'
    : shape === 'square'
    ? 'rounded-[4px]'
    : 'rounded-none'

  return (
    <div
      className={clsx(baseClasses, shapeClass)}
      style={clipPathStyle}
    >
      {children}
    </div>
  )
}
