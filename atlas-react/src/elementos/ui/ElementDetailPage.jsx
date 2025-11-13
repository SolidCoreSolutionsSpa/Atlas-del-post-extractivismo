import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { InteractiveMap } from '../../shared/ui/InteractiveMap'
import { TagChip } from '../../shared/ui/TagChip'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { useTheme } from '../../shared/hooks/useTheme'
import { zones, caseStudies, scenes } from '../../casosDeEstudio/repo/caseStudiesRepository'
import { inMemoryElementsRepository } from '../repo/elementsRepository'
import { useElementRecommendations } from '../hooks/useElementRecommendations'

const panelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 180, damping: 20 },
  },
}

const sceneIndex = new Map(
  scenes.map((scene) => [scene.id, scene]),
)
const zoneIndex = new Map(zones.map((zone) => [zone.id, zone]))
const caseIndex = new Map(
  caseStudies.map((caseStudy) => [caseStudy.id, caseStudy]),
)

export function ElementDetailPage() {
  const { elementId } = useParams()
  const zoomNavigate = useZoomNavigation()
  const { setTheme } = useTheme()
  const seed = useMemo(
    () => (elementId ? hashString(elementId) : undefined),
    [elementId],
  )
  const { status, base, recommendations } = useElementRecommendations({
    elementId,
    elementsRepository: inMemoryElementsRepository,
    options: {
      limit: 4,
      seed,
    },
  })

  const element = base?.element ?? null
  const tags = base?.tags ?? []
  const affectationType = base?.affectationType ?? null

  const scene = element ? sceneIndex.get(element.sceneId) : null
  const zone = scene ? zoneIndex.get(scene.zoneId) : null
  const caseStudy = zone ? caseIndex.get(zone.caseId) : null

  // Apply theme based on element data (always night theme for immersive experience)
  useMemo(() => {
    if (element) {
      setTheme('night')
    }
    return () => {
      setTheme('light')
    }
  }, [element, setTheme])

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
    breadcrumbItems.push({
      label: zone.name,
      to: `/zonas/${zone.id}`,
    })
  }
  if (scene) {
    breadcrumbItems.push({
      label: scene.name,
      to: `/escenas/${scene.id}`,
    })
  }
  breadcrumbItems.push({ label: element ? element.name : 'Elemento' })

  if (status === 'loading') {
    return (
      <motion.section
        className="relative min-h-screen"
        initial="hidden"
        animate="visible"
        variants={panelVariants}
      >
        <Breadcrumbs
          className="absolute left-4 top-16 sm:left-10 sm:top-20 lg:top-24"
          items={breadcrumbItems}
        />
        <div className="absolute inset-0 bg-token-divider" />
      </motion.section>
    )
  }

  if (!element) {
    return (
      <motion.section
        className="mx-auto flex w-[92%] max-w-4xl flex-col gap-6 pb-16"
        initial="hidden"
        animate="visible"
        variants={panelVariants}
      >
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-20 rounded-3xl border border-token-divider bg-token-surface p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-token-primary">
            Elemento no encontrado
          </h2>
          <p className="mt-2 text-sm text-token-muted">
            Regresa a la escena para seleccionar otro elemento disponible.
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
                scene ? `/escenas/${scene.id}` : '/casos-de-estudio',
                { origin },
              )
            }}
            className="mt-6 inline-flex items-center rounded-full bg-token-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-token-primary-strong"
          >
            Volver a la escena
          </button>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      className={clsx('relative min-h-screen overflow-hidden bg-[#050b1d] text-white')}
      initial="hidden"
      animate="visible"
      variants={panelVariants}
    >
      <InteractiveMap
        imageSrc={element.image}
        imageAlt={element.name}
        intensity={20}
        className="h-screen"
      />

      <Breadcrumbs
        className="absolute left-4 top-16 sm:left-10 sm:top-20 lg:top-24"
        items={breadcrumbItems}
      />

      {/* Ficha flotante con información del elemento */}
      <div className="pointer-events-auto absolute bottom-8 left-8 right-8 sm:bottom-12 sm:left-12 sm:right-auto sm:max-w-xl">
        <div className="rounded-[2rem] bg-white/95 p-8 shadow-2xl backdrop-blur">
          {/* Categoría superior */}
          <div className="mb-3 inline-block rounded-full bg-token-primary/10 px-4 py-1.5">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-token-primary">
              {affectationType?.name ?? 'Elemento'}
            </p>
          </div>

          {/* Título del elemento */}
          <h1 className="text-3xl font-semibold text-token-primary sm:text-4xl" style={{ fontFamily: '"Baskervville", serif' }}>
            {element.name}
          </h1>

          {/* Subtítulo si existe */}
          {element.subtitle && (
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-token-muted">
              {element.subtitle}
            </p>
          )}

          {/* Descripción */}
          <p className="mt-4 text-base leading-relaxed text-token-body">
            {element.body}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-5">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagChip key={tag.id} label={tag.label} active />
                ))}
              </div>
            </div>
          )}

          {/* Fuente */}
          <div className="mt-5 border-t border-token-divider pt-4">
            <p className="text-xs text-token-muted">
              {element.source}
            </p>
          </div>

          {/* Botón volver */}
          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const origin = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              }
              zoomNavigate(scene ? `/escenas/${scene.id}` : '/casos-de-estudio', {
                origin,
              })
            }}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full border-2 border-token-divider px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-token-muted transition hover:border-token-primary hover:text-token-primary"
          >
            Volver a la escena
          </button>
        </div>
      </div>

      {/* Panel de recomendaciones - Solo si hay recomendaciones */}
      {recommendations.length > 0 && (
        <div className="pointer-events-auto absolute top-28 right-8 hidden max-w-sm lg:block">
          <div className="rounded-[2rem] bg-white/90 p-6 shadow-xl backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-token-muted">
              Elementos relacionados
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {recommendations.slice(0, 3).map((item) => (
                <li key={item.element.id}>
                  <button
                    type="button"
                    onClick={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect()
                      const origin = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                      }
                      zoomNavigate(`/elementos/${item.element.id}`, { origin })
                    }}
                    className="w-full rounded-xl border border-token-divider bg-white p-3 text-left transition hover:border-token-primary hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-token-primary">
                      {item.element.name}
                    </p>
                    <p className="mt-1 text-xs text-token-muted">
                      {item.sharedTagIds.length} tag{item.sharedTagIds.length !== 1 ? 's' : ''} compartido{item.sharedTagIds.length !== 1 ? 's' : ''}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.section>
  )
}

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
