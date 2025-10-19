import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { TagChip } from '../../shared/ui/TagChip'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { atlasContent } from '../../shared/data/atlasContent'
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
  atlasContent.scenes.map((scene) => [scene.id, scene]),
)
const zoneIndex = new Map(atlasContent.zones.map((zone) => [zone.id, zone]))
const caseIndex = new Map(
  atlasContent.caseStudies.map((caseStudy) => [caseStudy.id, caseStudy]),
)

export function ElementDetailPage() {
  const { elementId } = useParams()
  const zoomNavigate = useZoomNavigation()
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

  const breadcrumbItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Casos de extractivismo, escala global', to: '/casos-de-estudio' },
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
        className="mx-auto flex w-[92%] max-w-5xl flex-col gap-6 pb-16"
        initial="hidden"
        animate="visible"
        variants={panelVariants}
      >
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-16 h-[420px] animate-pulse rounded-[2.5rem] bg-token-divider" />
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
      className="mx-auto flex w-[92%] max-w-5xl flex-col gap-10 pb-16"
      initial="hidden"
      animate="visible"
      variants={panelVariants}
    >
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-[2.5rem] border border-token-divider shadow-xl">
            <img
              src={element.image}
              alt={element.name}
              className="h-72 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="rounded-3xl border border-token-divider bg-token-surface p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-token-muted">
              Elemento
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-token-primary sm:text-4xl">
              {element.name}
            </h1>
            {element.subtitle ? (
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-token-muted">
                {element.subtitle}
              </p>
            ) : null}
            <p className="mt-4 text-base leading-relaxed text-token-body/80 sm:text-lg">
              {element.body}
            </p>
            <div className="mt-4 space-y-3 text-sm text-token-body">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-token-muted">
                  Tipo de afectacion
                </p>
                <p className="mt-1 text-token-primary">
                  {affectationType?.name ?? 'Por definir'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-token-muted">
                  Fuente
                </p>
                <p className="mt-1 text-token-body/70">{element.source}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-token-divider bg-token-surface p-6 shadow-sm">
            <h2 className="text-base font-semibold text-token-primary">
              Tags del elemento
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagChip key={tag.id} label={tag.label} active />
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-token-divider bg-token-surface p-6 shadow-sm">
            <h2 className="text-base font-semibold text-token-primary">
              Recomendaciones preliminares
            </h2>
            <p className="mt-1 text-sm text-token-muted">
              Basadas en la estrategia de coincidencia por tags (>= 1 tag en
              comun). Este contrato consumira `/api/elements/:id/recommendations`
              desde Pages Functions y D1.
            </p>
            {recommendations.length === 0 ? (
              <p className="mt-4 text-sm text-token-muted">
                No hay elementos con tags en comun en este mock. Integra datos reales
                para habilitar recomendaciones.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {recommendations.map((item) => (
                  <li
                    key={item.element.id}
                    className="flex flex-col gap-2 rounded-xl border border-token-divider bg-token-background/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
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
                        className="text-sm font-semibold text-token-primary underline-offset-4 transition hover:underline"
                      >
                        {item.element.name}
                      </button>
                      <span className="text-xs uppercase tracking-[0.3em] text-token-muted">
                        Tags compartidos: {item.sharedTagIds.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <TagChip
                          key={`${item.element.id}-${tag.id}`}
                          label={tag.label}
                          active={item.sharedTagIds.includes(tag.id)}
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

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
            className="inline-flex items-center justify-center rounded-full border border-token-divider px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-token-muted transition hover:border-token-primary hover:text-token-primary"
          >
            Volver a la escena
          </button>
        </div>
      </div>
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
