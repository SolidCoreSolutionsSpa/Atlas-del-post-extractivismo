import clsx from 'clsx'

/**
 * FilterPanel Component
 *
 * Panel de filtros para categorizar elementos del mapa por tipo de afectación.
 * Permite filtrar entre: Biótico, Antrópico, Físico
 *
 * Reutilizable para cualquier provincia/caso de estudio que tenga elementos categorizados.
 *
 * @component
 * @param {Record<string, {title: string, text: string}>} filterDescriptions - Descripciones de filtros
 * @param {string | null} activeFilter - Filtro actualmente activo
 * @param {Function} onFilterChange - Callback cuando cambia el filtro
 * @param {object} [filterIcons] - Iconos SVG para cada categoría
 * @example
 * const filterDescriptions = {
 *   biotic: {
 *     title: 'Paisajes Bióticos',
 *     text: 'Transformaciones que impactan seres vivos...'
 *   },
 *   anthropic: {
 *     title: 'Paisajes Antropicos',
 *     text: 'Consecuencias generadas por la intervención humana...'
 *   },
 *   physical: {
 *     title: 'Paisajes Físicos',
 *     text: 'Transformaciones del suelo y relieve...'
 *   }
 * };
 *
 * <FilterPanel
 *   filterDescriptions={filterDescriptions}
 *   activeFilter={activeFilter}
 *   onFilterChange={setActiveFilter}
 * />
 */
export function FilterPanel({
  filterDescriptions,
  activeFilter,
  onFilterChange,
  filterIcons = {
    biotic: '/img/icono_biotico_negro.svg',
    anthropic: '/img/icono_antropico_negro.svg',
    physical: '/img/icono_fisico_negro.svg',
  },
}) {
  return (
    <div className="pointer-events-auto absolute bottom-16 left-16 flex items-center gap-3 rounded-[15px] bg-white/25 px-2.5 py-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      {Object.entries(filterDescriptions).map(([category, info]) => (
        <button
          key={category}
          type="button"
          onMouseEnter={() => onFilterChange(category)}
          onFocus={() => onFilterChange(category)}
          onMouseLeave={() => onFilterChange(null)}
          onBlur={() => onFilterChange(null)}
          className={clsx(
            'rounded-lg border-2 border-transparent bg-transparent p-1.5 transition-all duration-500',
            activeFilter === category
              ? 'bg-white/60'
              : 'hover:bg-white/60',
          )}
          aria-label={info.title}
          title={info.text}
        >
          <img
            src={filterIcons[category]}
            alt=""
            className="h-10 w-10"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  )
}
