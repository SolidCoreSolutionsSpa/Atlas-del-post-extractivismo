import clsx from 'clsx'

/**
 * RotatingHotspot Component
 *
 * Círculo punteado giratorio para mapas interactivos.
 * Replica el comportamiento del HTML original con animación de rotación en sentido horario.
 *
 * @component
 * @param {string} left - Posición horizontal (porcentaje o px)
 * @param {string} top - Posición vertical (porcentaje o px)
 * @param {string} label - Etiqueta del hotspot (aparece en tooltip al hover)
 * @param {boolean} [active=true] - Si el hotspot está activo (visible)
 * @param {Function} [onSelect] - Callback al hacer click
 * @param {string} [className] - Clases CSS adicionales
 *
 * @example
 * <RotatingHotspot
 *   left="50%"
 *   top="85%"
 *   label="Puerto Punta Chungo"
 *   active={!activeFilter || activeFilter === 'anthropic'}
 *   onSelect={(e) => navigateToZone(zoneId, e)}
 * />
 */
export function RotatingHotspot({
  left,
  top,
  label,
  active = true,
  onSelect,
  className,
}) {
  return (
    <div
      className="group absolute"
      style={{ left, top }}
    >
      <button
        type="button"
        onClick={onSelect}
        className={clsx(
          'relative -translate-x-1/2 -translate-y-1/2 transform rounded-full',
          'transition-transform duration-200 hover:scale-110',
          className,
        )}
        style={{
          width: '7vw',
          height: '7vw',
          opacity: active ? 1 : 0.3,
          pointerEvents: 'auto',
          backgroundColor: 'transparent',
          border: 'none',
        }}
      >
        {/* Círculo punteado giratorio en sentido horario */}
        <div
          className="absolute inset-0 rounded-full border-[3px] border-dashed border-white animate-rotate-clockwise"
        />

        {/* Tooltip que aparece en hover */}
        <span className="pointer-events-none absolute bottom-full left-1/2 mb-4 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3 py-1.5 text-xs font-normal tracking-wider text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {label}
        </span>
      </button>
    </div>
  )
}
