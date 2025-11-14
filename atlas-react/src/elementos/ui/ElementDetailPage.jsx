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
      limit: 5,
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

      {/* Contenedor de fichas flotantes a la derecha */}
      <div
        className="element-detail-cards pointer-events-auto absolute flex flex-col"
        style={{
          // Fluid responsive scaling based on 1440p reference
          // Formula: min((px_at_1440p / 1440) * 100vw, max_px)
          // Scales linearly with viewport, capped at 1440px values
          width: 'min(27.78vw, 25rem)', // 400px at 1440p
          bottom: '5vh',
          right: '5vw',
          gap: 'min(1.11vw, 1rem)', // 16px (gap-4) at 1440p
        }}
      >
        {/* Ficha flotante con información del elemento */}
        <div
          className="element-card-main rounded-xl bg-black/50 shadow-2xl backdrop-blur"
          style={{
            padding: 'min(2.22vw, 2rem)', // 32px (p-8) at 1440p
            borderRadius: 'min(0.83vw, 0.75rem)', // 12px (rounded-xl) at 1440p
          }}
        >
          {/* Categoría superior */}
          <p
            className="element-category font-bold uppercase text-white/70"
            style={{
              fontSize: 'min(0.97vw, 0.875rem)', // 14px (text-sm) at 1440p
              marginBottom: 'min(0.56vw, 0.5rem)', // 8px (mb-2) at 1440p
              letterSpacing: '0.15em',
            }}
          >
            {affectationType?.name ?? 'Elemento'}
          </p>

          {/* Título del elemento */}
          <h1
            className="font-bold leading-tight text-white"
            style={{
              fontSize: 'min(1.44vw, 1.3rem)', // 20.8px at 1440p
            }}
          >
            {element.name}
          </h1>

          {/* Subtítulo si existe */}
          {element.subtitle && (
            <p
              className="element-subtitle italic text-white/80"
              style={{
                marginTop: 'min(0.28vw, 0.25rem)', // 4px (mt-1) at 1440p
                fontSize: 'min(1.22vw, 1.1rem)', // 17.6px at 1440p
              }}
            >
              {element.subtitle}
            </p>
          )}

          {/* Descripción */}
          <p
            className="leading-relaxed text-white/90"
            style={{
              marginTop: 'min(1.11vw, 1rem)', // 16px (mt-4) at 1440p
              fontSize: 'min(0.97vw, 0.875rem)', // 14px (text-sm) at 1440p
            }}
          >
            {element.body}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div
              className="element-tags"
              style={{
                marginTop: 'min(1.11vw, 1rem)', // 16px (mt-4) at 1440p
              }}
            >
              <div
                className="flex flex-wrap"
                style={{
                  gap: 'min(0.56vw, 0.5rem)', // 8px (gap-2) at 1440p
                }}
              >
                {tags.map((tag) => (
                  <TagChip key={tag.id} label={tag.label} active />
                ))}
              </div>
            </div>
          )}

          {/* Fuente */}
          <div
            className="border-t border-white/20"
            style={{
              marginTop: 'min(1.11vw, 1rem)', // 16px (mt-4) at 1440p
              paddingTop: 'min(0.83vw, 0.75rem)', // 12px (pt-3) at 1440p
            }}
          >
            <p
              className="element-source leading-relaxed text-white/60"
              style={{
                fontSize: 'min(0.83vw, 0.75rem)', // 12px (text-xs) at 1440p
              }}
            >
              {element.source}
            </p>
          </div>
        </div>

        {/* Panel de recomendaciones - Solo imágenes debajo de la tarjeta principal */}
        {recommendations.length > 0 && (
          <div
            className="element-recommendations rounded-xl bg-black/50 shadow-xl backdrop-blur"
            style={{
              padding: 'min(1.11vw, 1rem)', // 16px (p-4) at 1440p
              borderRadius: 'min(0.83vw, 0.75rem)', // 12px (rounded-xl) at 1440p
            }}
          >
            <h2
              className="element-recommendation-title font-semibold uppercase text-white/70"
              style={{
                marginBottom: 'min(0.83vw, 0.75rem)', // 12px (mb-3) at 1440p
                fontSize: 'min(0.83vw, 0.75rem)', // 12px (text-xs) at 1440p
                letterSpacing: '0.2em',
              }}
            >
              Elementos relacionados
            </h2>

            {/* Grid de imágenes - máximo 5, centradas si hay menos */}
            <div
              className="flex justify-center"
              style={{
                gap: 'min(0.56vw, 0.5rem)', // 8px (gap-2) at 1440p
              }}
            >
              {recommendations.slice(0, 5).map((item) => {
                // Solo mostrar si tiene imagen
                if (!item.element.detailImagePath) return null

                return (
                  <button
                    key={item.element.id}
                    type="button"
                    onClick={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect()
                      const origin = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                      }
                      zoomNavigate(`/elementos/${item.element.id}`, { origin })
                    }}
                    className="element-recommendation-image aspect-square overflow-hidden border-2 border-white/20 bg-white/10 transition hover:border-white/60 hover:scale-105"
                    style={{
                      width: 'min(4.17vw, 3.75rem)', // 60px at 1440p
                      borderRadius: 'min(0.56vw, 0.5rem)', // 8px (rounded-lg) at 1440p
                    }}
                    title={item.element.name}
                  >
                    <img
                      src={item.element.detailImagePath}
                      alt={item.element.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}
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
