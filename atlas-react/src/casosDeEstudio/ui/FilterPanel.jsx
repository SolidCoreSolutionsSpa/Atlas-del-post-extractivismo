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
    <div className="pointer-events-auto absolute bottom-16 left-16 flex items-center gap-4 rounded-[2rem] bg-white/90 px-6 py-4 shadow-xl backdrop-blur">
      {Object.entries(filterDescriptions).map(([category, info]) => (
        <button
          key={category}
          type="button"
          onMouseEnter={() => onFilterChange(category)}
          onFocus={() => onFilterChange(category)}
          onMouseLeave={() => onFilterChange(null)}
          onBlur={() => onFilterChange(null)}
          className={clsx(
            'flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] transition',
            activeFilter === category
              ? 'text-token-primary'
              : 'text-token-muted hover:text-token-primary',
          )}
          aria-label={info.title}
          title={info.text}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-token-divider bg-white shadow">
            <img
              src={filterIcons[category]}
              alt=""
              className="h-6 w-6"
              loading="lazy"
            />
          </span>
          {info.title.split(' ')[1]}
        </button>
      ))}
    </div>
  )
}
