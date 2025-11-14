import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import {
  InteractiveMap,
  MapIconHotspot,
} from '../../shared/ui/InteractiveMap'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { caseStudies, scenes } from '../../casosDeEstudio/repo/caseStudiesRepository'
import { ZonasService } from '../services/zonasService'
import { inMemoryZonasRepository } from '../repo/zonasRepository'
import { FilterPanel } from '../../casosDeEstudio/ui/FilterPanel'

const iconByCategory = {
  biotic: '/img/icono_biotico_negro.svg',
  anthropic: '/img/icono_antropico_negro.svg',
  physical: '/img/icono_fisico_negro.svg',
}

const paddingByCategory = {
  biotic: 'p-2', // Con más margen para consistencia
  anthropic: 'p-1.5', // Tamaño medio
  physical: 'p-3', // Más margen para mayor separación visual
}

const shapeByCategory = {
  biotic: 'diamond',
  anthropic: 'square',
  physical: 'triangle',
}

const filterDescriptions = {
  biotic: {
    title: 'Paisajes bioticos',
    text: 'Transformaciones que impactan seres vivos del ecosistema como flora, fauna, microorganismos o comunidades mas que humanas.',
  },
  anthropic: {
    title: 'Paisajes antropicos',
    text: 'Consecuencias generadas por la intervencion humana en el territorio, ya sea por accion directa o indirecta.',
  },
  physical: {
    title: 'Paisajes fisicos',
    text: 'Transformaciones del suelo y relieve originadas por la accion extractiva sobre el territorio.',
  },
}

const detailVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 140, damping: 18 },
  },
}

const caseIndex = new Map(
  caseStudies.map((caseStudy) => [caseStudy.id, caseStudy]),
)
const sceneIndex = new Map(
  scenes.map((scene) => [scene.id, scene]),
)

export function ZonaDetailPage() {
  const { zoneId } = useParams()
  const zoomNavigate = useZoomNavigation()
  const service = useMemo(
    () =>
      new ZonasService({
        zonasRepository: inMemoryZonasRepository,
      }),
    [],
  )

  const [zone, setZone] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeFilter, setActiveFilter] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      setStatus('loading')
      const data = await service.getById(zoneId)
      if (isMounted) {
        setZone(data)
        setStatus(data ? 'ready' : 'empty')
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [zoneId, service])

  const caseStudy = zone ? caseIndex.get(zone.caseStudyId) : null

  const breadcrumbItems = [
    { label: 'Inicio', to: '/' },
  ]
  if (caseStudy) {
    breadcrumbItems.push({
      label: caseStudy.title,
      to: `/casos-de-estudio/${caseStudy.id}`,
    })
  }
  breadcrumbItems.push({ label: zone ? zone.name : 'Zona' })

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

  if (!zone) {
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
            Zona no encontrada
          </h2>
          <p className="mt-2 text-sm text-token-muted">
            Regresa al caso de estudio para seleccionar una zona disponible.
          </p>
          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const origin = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              }
              zoomNavigate(
                caseStudy ? `/casos-de-estudio/${caseStudy.id}` : '/casos-de-estudio',
                { origin },
              )
            }}
            className="mt-6 inline-flex items-center rounded-full bg-token-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-token-primary-strong"
          >
            Volver al caso
          </button>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={detailVariants}
    >
      <InteractiveMap
        imageSrc={zone.map.image}
        imageAlt={`Mapa de ${zone.name}`}
        intensity={18}
        className="h-screen"
        objectFit="contain"
        blurredBackground={true}
        blurAmount={20}
        frame={false}
        overfill={1.28}
      >
        {zone.map.hotspots.map((hotspot) => {
          const isActive = !activeFilter || hotspot.category === activeFilter
          return (
            <MapIconHotspot
              key={hotspot.id}
              left={hotspot.left}
              top={hotspot.top}
              label={hotspot.label}
              iconSrc={iconByCategory[hotspot.category] ?? iconByCategory.anthropic}
              iconAlt={hotspot.category ?? 'Hotspot'}
              iconPadding={paddingByCategory[hotspot.category] ?? 'p-1.5'}
              backgroundShape={shapeByCategory[hotspot.category] ?? 'circle'}
              pulsate={hotspot.pulsate}
              active={isActive}
              onClick={(event) => {
                if (!hotspot.sceneId) return
                const rect = event.currentTarget.getBoundingClientRect()
                const origin = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                }
                zoomNavigate(`/escenas/${hotspot.sceneId}`, { origin })
              }}
            />
          )
        })}
      </InteractiveMap>

      <FilterPanel
        filterDescriptions={filterDescriptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        orientation="vertical"
      />

      <Breadcrumbs
        className="absolute left-4 top-16 sm:left-10 sm:top-20 lg:top-24"
        items={breadcrumbItems}
      />
    </motion.section>
  )
}
