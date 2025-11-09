import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import {
  InteractiveMap,
  MapIconHotspot,
} from '../../shared/ui/InteractiveMap'
import { ZoneDecoration } from '../../shared/ui/ZoneDecoration'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { caseStudies, scenes } from '../../casosDeEstudio/repo/caseStudiesRepository'
import { ZonasService } from '../services/zonasService'
import { inMemoryZonasRepository } from '../repo/zonasRepository'

const iconByCategory = {
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
  const [hoveredHotspotId, setHoveredHotspotId] = useState(null)

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

  // Validar que la zona tenga imagen configurada
  if (!zone.map.image) {
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
            Mapa de zona no disponible
          </h2>
          <p className="mt-2 text-sm text-token-muted">
            Esta zona ({zone.name}) aún no tiene un mapa configurado.
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
            Volver al caso de estudio
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
      {/* Mapa interactivo con blur background como en CaseStudyDetailPage */}
      <InteractiveMap
        imageSrc={zone.map.image}
        imageAlt={`Mapa de ${zone.name}`}
        intensity={18}
        className="h-screen"
        objectFit="contain"
        blurredBackground={true}
        blurAmount={20}
        frame={false}
      >
        {/* Hotspots de escenas */}
        {zone.map.hotspots.map((hotspot) => (
          <MapIconHotspot
            key={hotspot.id}
            left={hotspot.left}
            top={hotspot.top}
            label={hotspot.label}
            iconSrc={iconByCategory[hotspot.category] ?? iconByCategory.anthropic}
            iconAlt={hotspot.category ?? 'Hotspot'}
            pulsate={hotspot.pulsate}
            factor={0.2}
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
        ))}

        {/* Decoraciones de la zona - siempre visibles */}
        {zone.decorations?.map((decoration) => (
          <ZoneDecoration
            key={decoration.id}
            image={decoration.image}
            tooltip={decoration.tooltip}
            position={decoration.position}
            type={decoration.type}
            visible={true}
            parallaxFactor={0.15}
          />
        ))}
      </InteractiveMap>

      {/* Breadcrumbs en posición absoluta */}
      <Breadcrumbs
        className="absolute left-4 top-16 sm:left-10 sm:top-20 lg:top-24"
        items={breadcrumbItems}
      />

      {/* Título y descripción de la zona */}
      <div className="pointer-events-none absolute top-28 right-12 flex max-w-sm flex-col items-end gap-3 text-right">
        <h1
          className="text-3xl font-semibold text-token-primary sm:text-4xl"
          style={{ fontFamily: '"Baskervville", serif' }}
        >
          {zone.name}
        </h1>
        {zone.description && (
          <p className="text-base leading-relaxed text-token-body/80">
            {zone.description}
          </p>
        )}
      </div>
    </motion.section>
  )
}
