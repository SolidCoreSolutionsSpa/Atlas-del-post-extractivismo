import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import {
  InteractiveMap,
  MapIconHotspot,
} from '../../shared/ui/InteractiveMap'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { useTheme } from '../../shared/hooks/useTheme'
import { zones, caseStudies, elements } from '../../casosDeEstudio/repo/caseStudiesRepository'
import { EscenasService } from '../services/escenasService'
import { inMemoryEscenasRepository } from '../repo/escenasRepository'
import { FilterPanel } from '../../casosDeEstudio/ui/FilterPanel'
import { DescriptionModal } from '../../shared/ui/DescriptionModal'

const iconByCategory = {
  biotic: '/img/icono_biotico_negro.svg',
  anthropic: '/img/icono_antropico_negro.svg',
  physical: '/img/icono_fisico_negro.svg',
}

const paddingByCategory = {
  biotic: 'p-1',
  anthropic: 'p-1.5',
  physical: 'p-1.5',
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

const zoneIndex = new Map(zones.map((zone) => [zone.id, zone]))
const caseIndex = new Map(
  caseStudies.map((caseStudy) => [caseStudy.id, caseStudy]),
)
const elementIndex = new Map(
  elements.map((element) => [element.id, element]),
)

export function EscenaDetailPage() {
  const { sceneId } = useParams()
  const zoomNavigate = useZoomNavigation()
  const { setTheme } = useTheme()
  const service = useMemo(
    () =>
      new EscenasService({
        escenasRepository: inMemoryEscenasRepository,
      }),
    [],
  )

  const [scene, setScene] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeFilter, setActiveFilter] = useState(null)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function load() {
      setStatus('loading')
      const data = await service.getById(sceneId)
      if (isMounted) {
        setScene(data)
        setStatus(data ? 'ready' : 'empty')
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [sceneId, service])

  // Apply theme based on scene data
  useEffect(() => {
    if (scene && scene.theme === 'night') {
      setTheme('night')
    } else if (scene) {
      setTheme('light')
    }

    // Cleanup: reset to light theme when unmounting
    return () => {
      setTheme('light')
    }
  }, [scene, setTheme])

  const zone = scene ? zoneIndex.get(scene.zoneId) : null
  const caseStudy = zone ? caseIndex.get(zone.caseId) : null

  const breadcrumbItems = [
    { label: 'Inicio', to: '/' },
  ]
  if (caseStudy) {
    breadcrumbItems.push({
      label: caseStudy.title,
      to: `/casos-de-estudio/${caseStudy.id}`,
    })
  }
  if (zone) {
    breadcrumbItems.push({ label: zone.name, to: `/zonas/${zone.id}` })
  }
  breadcrumbItems.push({ label: scene ? scene.name : 'Escena' })

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

  if (!scene) {
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
            Escena no encontrada
          </h2>
          <p className="mt-2 text-sm text-token-muted">
            Regresa a la zona para seleccionar otra escena disponible.
          </p>
          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const origin = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              }
              zoomNavigate(zone ? `/zonas/${zone.id}` : '/casos-de-estudio', {
                origin,
              })
            }}
            className="mt-6 inline-flex items-center rounded-full bg-token-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-token-primary-strong"
          >
            Volver a la zona
          </button>
        </div>
      </motion.section>
    )
  }

  const sceneElements = Array.from(elementIndex.values()).filter((element) => element.sceneId === scene.id)

  return (
    <motion.section
      className={clsx('relative min-h-screen overflow-hidden bg-[#050b1d] text-white')}
      initial="hidden"
      animate="visible"
      variants={detailVariants}
    >
      <InteractiveMap
        imageSrc={scene.map.image}
        imageAlt={`Mapa de la escena ${scene.name}`}
        intensity={20}
        className="h-screen"
      >
        {scene.map.hotspots.map((hotspot) => {
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
                if (!hotspot.elementId) return
                const rect = event.currentTarget.getBoundingClientRect()
                const origin = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                }
                zoomNavigate(`/elementos/${hotspot.elementId}`, { origin })
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

      <button
        onClick={() => setIsDescriptionModalOpen(true)}
        className="absolute top-20 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(20,20,40,0.3)] text-white shadow-lg backdrop-blur-sm transition hover:bg-[rgba(20,20,40,0.5)] hover:scale-110 hover:shadow-xl sm:right-6 lg:right-8"
        aria-label="Ver descripción de la escena"
        title="Ver descripción"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {sceneElements.length > 0 && (
        <div className="pointer-events-auto absolute bottom-16 right-12 flex max-w-sm flex-col items-end gap-3 rounded-[2rem] bg-white/90 p-6 text-token-body shadow-xl backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-token-muted">
            Elementos vinculados
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {sceneElements.map((element) => (
              <button
                key={element.id}
                type="button"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  const origin = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                  }
                  zoomNavigate(`/elementos/${element.id}`, { origin })
                }}
                className="rounded-full border border-token-divider px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-token-muted transition hover:border-token-primary hover:text-token-primary"
              >
                {element.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <DescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        title={scene.name}
        description="Explora los elementos vinculados a esta escena para comprender las afectaciones sobre fauna e infraestructura en el territorio."
      />
    </motion.section>
  )
}
