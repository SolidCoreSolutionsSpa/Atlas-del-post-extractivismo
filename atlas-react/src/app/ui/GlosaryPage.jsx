import { useEffect, useMemo, useState } from 'react'

import { useAtlasData } from '../../shared/data/AtlasDataContext'

const serifHeadingClass = 'font-["Baskervville",serif]'
const PAGE_SIZE = 36
const GRID_COLUMNS = 6

function buildElements(caseOfStudies = []) {
  const items = []

  caseOfStudies.forEach((cs) => {
    cs.zones?.forEach((zone) => {
      zone.scenes?.forEach((scene) => {
        scene.elements?.forEach((el) => {
          items.push({
            id: el.slug,
            name: el.title,
            caseStudySlug: cs.slug,
            caseStudyTitle: cs.title,
            affectationTypeId: el.affectation_type_id || 'anthropic',
            image: el.detail_image_path || el.image_path || '',
          })
        })
      })
    })
  })

  return items
}

export function GlosaryPage() {
  const { caseOfStudies = [], affectationTypes = [] } = useAtlasData()
  const [caseStudyFilter, setCaseStudyFilter] = useState('all')
  const [affectationFilter, setAffectationFilter] = useState('all')
  const [page, setPage] = useState(0)

  const allElements = useMemo(() => buildElements(caseOfStudies), [caseOfStudies])

  const filteredElements = useMemo(() => {
    let list = allElements

    if (caseStudyFilter !== 'all') {
      list = list.filter((item) => item.caseStudySlug === caseStudyFilter)
    }

    if (affectationFilter !== 'all') {
      list = list.filter((item) => item.affectationTypeId === affectationFilter)
    }

    return list
  }, [allElements, caseStudyFilter, affectationFilter])

  const totalPages = Math.max(1, Math.ceil(filteredElements.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const start = currentPage * PAGE_SIZE
  const visibleElements = filteredElements.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    console.log('[GlosaryPage] elementos', {
      total: allElements.length,
      filtrados: filteredElements.length,
      paginaActual: currentPage + 1,
      totalPaginas: totalPages,
      caso: caseStudyFilter,
      afectacion: affectationFilter,
      visibles: visibleElements.map((el) => el.id),
    })
  }, [
    allElements.length,
    filteredElements.length,
    visibleElements,
    currentPage,
    totalPages,
    caseStudyFilter,
    affectationFilter,
  ])

  const emptySlots = Math.max(0, PAGE_SIZE - visibleElements.length)

  const caseStudyOptions = useMemo(
    () => [
      { value: 'all', label: 'Selecciona caso de estudio' },
      ...caseOfStudies.map((cs) => ({ value: cs.slug, label: cs.title })),
    ],
    [caseOfStudies],
  )

  const affectationOptions = useMemo(
    () => [
      { value: 'all', label: 'Selecciona tipo de afectación' },
      ...affectationTypes.map((type) => ({
        value: type.slug,
        label: type.name,
      })),
    ],
    [affectationTypes],
  )

  const handlePrev = () => setPage((prev) => Math.max(0, prev - 1))
  const handleNext = () => setPage((prev) => Math.min(totalPages - 1, prev + 1))

  // Reset page when filters change
  const resetOnFilterChange = () => setPage(0)

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-36 lg:px-12">
        <header className="space-y-6">
          <p className="uppercase tracking-[0.55em] text-xs text-slate-400">
            Inventario de afectaciones
          </p>
          <h1
            className={`text-3xl leading-tight text-slate-900 sm:text-4xl ${serifHeadingClass}`}
          >
            Explora elementos por caso y afectación
          </h1>
          <div className="flex flex-wrap gap-4">
            <Select
              options={caseStudyOptions}
              value={caseStudyFilter}
              onChange={(value) => {
                setCaseStudyFilter(value)
                resetOnFilterChange()
              }}
            />
            <Select
              options={affectationOptions}
              value={affectationFilter}
              onChange={(value) => {
                setAffectationFilter(value)
                resetOnFilterChange()
              }}
            />
          </div>
        </header>

        <div className="mt-12">
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
            }}
          >
            {visibleElements.map((item) => (
              <figure
                key={item.id}
                className="relative aspect-square overflow-hidden rounded-xl transition shadow-sm"
                style={{
                  backgroundImage: 'url(/img/fondo.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="relative z-10 h-full w-full object-contain opacity-100 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                  loading="lazy"
                />
              </figure>
            ))}
            {Array.from({ length: emptySlots }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="aspect-square rounded-xl border border-dashed border-slate-100 bg-white/50"
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Página {currentPage + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-600 disabled:opacity-40"
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-600 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function Select({ options, value, onChange }) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-slate-200 bg-white px-4 py-2 pr-10 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
        ▾
      </span>
    </div>
  )
}
