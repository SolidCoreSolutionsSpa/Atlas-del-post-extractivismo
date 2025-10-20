import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import {
  InteractiveMap,
  MapDecoration,
} from '../../shared/ui/InteractiveMap'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { atlasContent } from '../../shared/data/atlasContent'
import { CaseStudiesService } from '../services/caseStudiesService'
import { inMemoryCaseStudiesRepository } from '../repo/caseStudiesRepository'

const filterIcons = {
  biotic: '/img/icono_biotico.svg',
  anthropic: '/img/icono_antropico.svg',
  physical: '/img/icono_fisico.svg',
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

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-white"
      initial="hidden"
      animate="visible"
      variants={detailVariants}
    >
      <InteractiveMap
        imageSrc={detailMap.image}
        imageAlt={`Mapa de ${caseStudy.title}`}
        intensity={24}
        className="h-[calc(100vh-2rem)]"
      >
        {detailMap.decorations.map((item) => (
          <MapDecoration
            key={item.id}
            left={item.left}
            top={item.top}
            imageSrc={item.image}
            imageAlt={item.alt}
            factor={0.25}
            widthClass="w-28 lg:w-40"
            className={clsx(
              'shadow-xl',
              activeFilter && activeFilter !== item.category
                ? 'opacity-30'
                : 'opacity-95',
            )}
          />
        ))}
        {detailMap.hotspots.map((spot) => (
          <CircleHotspot
            key={spot.id}
            left={spot.left}
            top={spot.top}
            label={spot.label}
            active={activeFilter ? activeFilter === spot.category : true}
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
      </InteractiveMap>

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

      <div className="pointer-events-auto absolute bottom-16 left-16 flex items-center gap-4 rounded-[2rem] bg-white/90 px-6 py-4 shadow-xl backdrop-blur">
        {Object.entries(detailMap.filterDescriptions).map(([category, info]) => (
          <button
            key={category}
            type="button"
            onMouseEnter={() => setActiveFilter(category)}
            onFocus={() => setActiveFilter(category)}
            onMouseLeave={() => setActiveFilter(null)}
            onBlur={() => setActiveFilter(null)}
            className={clsx(
              'flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] transition',
              activeFilter === category
                ? 'text-token-primary'
                : 'text-token-muted hover:text-token-primary',
            )}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-token-divider bg-white shadow">
              <img src={filterIcons[category]} alt="" className="h-6 w-6" loading="lazy" />
            </span>
            {info.title.split(' ')[1]}
          </button>
        ))}
      </div>
    </motion.section>
  )
}

function CircleHotspot({ left, top, label, active, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={(event) => { if (onSelect) { event.preventDefault(); event.stopPropagation(); onSelect(event); } }}
      style={{ left, top }}
      className={clsx(
        'absolute flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-dashed border-white/80 transition',
        active ? 'opacity-100' : 'opacity-30',
      )}
    >
      <span className="pointer-events-none rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-token-primary shadow">
        {label}
      </span>
    </motion.button>
  )
}
