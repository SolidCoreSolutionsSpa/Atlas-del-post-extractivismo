import clsx from 'clsx'

/**
 * ShapeBackground Component
 *
 * Renderiza diferentes formas geométricas como fondo para iconos.
 * Útil para diferenciar visualmente categorías de afectación.
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
  // Clases base compartidas por todas las formas
  const baseClasses = clsx(
    'pointer-events-auto flex h-10 w-10 items-center justify-center bg-white/80 backdrop-blur transition hover:scale-110',
    iconPadding,
    pulsate && active && 'animate-[pulse-soft_2s_ease-in-out_infinite]',
    className,
  )

  // Renderizar según la forma seleccionada
  switch (shape) {
    case 'square':
      return (
        <div className={clsx(baseClasses, 'rounded-[4px]')}>
          {children}
        </div>
      )

    case 'diamond':
      // Rombo: cuadrado rotado 45 grados y estirado verticalmente
      return (
        <div className="relative h-10 w-10">
          <div
            className={clsx(
              baseClasses,
              'absolute left-1/2 top-1/2 h-[28px] w-[20px] -translate-x-1/2 -translate-y-1/2 rounded-[2px]',
            )}
            style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ transform: 'rotate(-45deg)' }}
            >
              {children}
            </div>
          </div>
        </div>
      )

    case 'triangle':
      // Triángulo equilátero usando clip-path
      return (
        <div className="relative h-10 w-10">
          <div
            className={clsx(baseClasses, 'rounded-none')}
            style={{
              clipPath: 'polygon(50% 10%, 90% 85%, 10% 85%)',
            }}
          >
            <div className="mt-1">{children}</div>
          </div>
        </div>
      )

    case 'circle':
    default:
      return (
        <div className={clsx(baseClasses, 'rounded-full')}>
          {children}
        </div>
      )
  }
}
