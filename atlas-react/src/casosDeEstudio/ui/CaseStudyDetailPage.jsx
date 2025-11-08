import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import {
  InteractiveMap,
  MapDecoration,
} from '../../shared/ui/InteractiveMap'
import { CircleHotspot } from '../../shared/ui/CircleHotspot'
import { RotatingHotspot } from '../../shared/ui/RotatingHotspot'
import { FilterPanel } from './FilterPanel'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { atlasContent } from '../../shared/data/atlasContent'
import { CaseStudiesService } from '../services/caseStudiesService'
import { inMemoryCaseStudiesRepository } from '../repo/caseStudiesRepository'

// Parallax factors differentiated by category
function getParallaxFactor(category) {
  switch (category) {
    case 'biotic':
      return 0.15 // Ligero
    case 'anthropic':
      return 0.25 // Medio
    case 'physical':
      return 0.35 // Más notorio
    default:
      return 0.2
  }
}

// Custom sizes for specific decorations
function getSizeClass(decorationId) {
  const sizes = {
    'paisaje-islahuevo': 'w-32 lg:w-48',
    'paisaje-conchali': 'w-28 lg:w-40',
    'paisaje-glaciares': 'w-36 lg:w-52',
    'paisaje-salmuera': 'w-28 lg:w-40',
    'paisaje-perturbacion': 'w-32 lg:w-44',
    'paisaje-caimanes': 'w-30 lg:w-42',
    'paisaje-quebrada': 'w-28 lg:w-40',
  }
  return sizes[decorationId] || 'w-28 lg:w-40'
}

const detailVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 140, damping: 18 },
  },
}

const zoneIndex = new Map(atlasContent.zones.map((zone) => [zone.id, zone]))

export function CaseStudyDetailPage() {
  const { caseStudyId } = useParams()
  const zoomNavigate = useZoomNavigation()
  const service = useMemo(
    () =>
      new CaseStudiesService({
        caseStudiesRepository: inMemoryCaseStudiesRepository,
      }),
    [],
  )

  const [caseStudy, setCaseStudy] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeFilter, setActiveFilter] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      setStatus('loading')
      const data = await service.getById(caseStudyId)
      if (isMounted) {
        setCaseStudy(data)
        setStatus(data ? 'ready' : 'empty')
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [caseStudyId, service])

  const breadcrumbItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Casos de extractivismo, escala global', to: '/casos-de-estudio' },
    { label: caseStudy ? caseStudy.title : 'Provincia' },
  ]

  if (status === 'loading') {
    return (
      <motion.section
        className="relative min-h-screen"
        initial="hidden"
        animate="visible"
        variants={detailVariants}
      >
        <Breadcrumbs
          className="absolute left-4 top-16 sm:left-10 sm:top-20 lg:top-24"
          items={breadcrumbItems}
        />
        <div className="absolute inset-0 bg-token-divider" />
      </motion.section>
    )
  }

  if (!caseStudy) {
    return (
      <motion.section
        className="mx-auto flex w-[92%] max-w-4xl flex-col gap-6 pb-16"
        initial="hidden"
        animate="visible"
        variants={detailVariants}
      >
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-20 rounded-3xl border border-token-divider bg-token-surface p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-token-primary">
            Caso de estudio no encontrado
          </h2>
          <p className="mt-2 text-sm text-token-muted">
            Verifica el enlace o regresa al mapa global para seleccionar un punto disponible.
          </p>
          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const origin = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              }
              zoomNavigate('/casos-de-estudio', { origin })
            }}
            className="mt-6 inline-flex items-center rounded-full bg-token-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-token-primary-strong"
          >
            Volver al mapa global
          </button>
        </div>
      </motion.section>
    )
  }

  const { detailMap } = caseStudy

  if (!detailMap) {
    return (
      <motion.section
        className="mx-auto flex w-[92%] max-w-4xl flex-col gap-6 pb-16"
        initial="hidden"
        animate="visible"
        variants={detailVariants}
      >
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-20 rounded-3xl border border-token-divider bg-token-surface p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-token-primary">
            Mapa detallado no disponible
          </h2>
          <p className="mt-2 text-sm text-token-muted">
            Este caso de estudio aún no tiene un mapa detallado configurado.
          </p>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-white"
      initial="hidden"
      animate="visible"
      variants={detailVariants}
    >
      {/* Mapa con hotspots giratorios */}
      <div className="relative h-screen w-full overflow-hidden">
        <img
          src={detailMap.image}
          className="absolute inset-0 h-full w-full object-cover"
          alt={`Mapa de ${caseStudy.title}`}
        />
        <div className="absolute inset-0">
          {detailMap.hotspots.map((spot) => (
            <RotatingHotspot
              key={spot.id}
              left={spot.left}
              top={spot.top}
              label={spot.label}
              active={!activeFilter || activeFilter === spot.category}
              onSelect={(event) => {
                if (!spot.zoneId) return
                const rect = event.currentTarget.getBoundingClientRect()
                const origin = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                }
                zoomNavigate(`/zonas/${spot.zoneId}`, { origin })
              }}
            />
          ))}
        </div>
      </div>

      <Breadcrumbs
        className="absolute left-4 top-16 sm:left-10 sm:top-20 lg:top-24"
        items={breadcrumbItems}
      />

      <div className="pointer-events-none absolute top-28 right-12 flex max-w-sm flex-col items-end gap-3 text-right">
        <h1
          className="text-3xl font-semibold text-token-primary sm:text-4xl"
          style={{ fontFamily: '"Baskervville", serif' }}
        >
          {caseStudy.title}
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-token-muted">
          {caseStudy.location}
        </p>
        <p className="text-base leading-relaxed text-token-body/80">
          {caseStudy.summary}
        </p>
      </div>

      <FilterPanel
        filterDescriptions={detailMap.filterDescriptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    </motion.section>
  )
}
