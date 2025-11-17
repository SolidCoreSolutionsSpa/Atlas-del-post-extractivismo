import React from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

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
 * @param {'horizontal' | 'vertical'} [orientation='horizontal'] - Orientación del panel
 * @param {boolean} [showDescriptionCard=false] - Si true, muestra tarjeta con descripción; si false, muestra solo tooltip
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
 *   orientation="horizontal"
 *   showDescriptionCard={true}
 * />
 */
export function FilterPanel({
  filterDescriptions,
  activeFilter,
  onFilterChange,
  orientation = 'horizontal',
  showDescriptionCard = false,
  filterIcons = {
    biotic: '/img/icono_biotico_negro.svg',
    anthropic: '/img/icono_antropico_negro.svg',
    physical: '/img/icono_fisico_negro.svg',
  },
}) {
  const containerClasses = clsx(
    'pointer-events-auto absolute flex rounded-[15px] bg-white/25 shadow-[0_4px_10px_rgba(0,0,0,0.1)]',
    orientation === 'horizontal'
      ? 'filter-panel-horizontal-responsive flex-row items-center'
      : 'filter-panel-vertical-responsive top-1/2 -translate-y-1/2 flex-col items-center'
  )

  const activeFilterInfo = activeFilter ? filterDescriptions[activeFilter] : null

  return (
    <>
      <div className={containerClasses}>
        {Object.entries(filterDescriptions).map(([category, info]) => (
          <button
            key={category}
            type="button"
            onMouseEnter={() => onFilterChange(category)}
            onFocus={() => onFilterChange(category)}
            onMouseLeave={() => onFilterChange(null)}
            onBlur={() => onFilterChange(null)}
            className={clsx(
              'filter-button-responsive rounded-lg border-2 border-transparent bg-transparent transition-all duration-500',
              activeFilter === category
                ? 'bg-white/60'
                : 'hover:bg-white/60',
            )}
            aria-label={info.title}
            title={!showDescriptionCard ? info.title : undefined}
          >
            <img
              src={filterIcons[category]}
              alt=""
              className="filter-icon-responsive"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Tarjeta de descripción (solo si showDescriptionCard es true) */}
      {showDescriptionCard && (
        <AnimatePresence>
          {activeFilterInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="filter-description-card-responsive pointer-events-none absolute z-[300] rounded-[10px] bg-white/90 font-sans leading-relaxed shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
            >
              <strong className="filter-description-title-responsive block font-bold text-black">
                {activeFilterInfo.title}
              </strong>
              <p className="filter-description-text-responsive text-black">
                {activeFilterInfo.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}
