import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { InteractiveMap } from '../../shared/ui/InteractiveMap'
import { useZoomNavigation, usePageLoaded } from '../../shared/hooks/useZoomNavigation.jsx'
import { zones, caseStudies, scenes } from '../../casosDeEstudio/repo/caseStudiesRepository'
import { inMemoryElementsRepository } from '../repo/elementsRepository'
import { useElementRecommendations } from '../hooks/useElementRecommendations'
import { NavigationArrows } from './NavigationArrows'
import './ElementDetailPage.css'
import './NavigationArrows.css'

const panelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 180, damping: 20 },
  },
}

// Responsive TagChip that matches description text size
function ResponsiveTagChip({ label }) {
  return (
    <motion.span
      className="inline-flex items-center gap-1 rounded-full border border-token-primary bg-token-surface font-medium text-token-primary-strong"
      style={{
        fontSize: 'clamp(14px, 0.97vw, 17px)', // Same as description text
        padding: 'clamp(0.15rem, 0.3vh, 0.25rem) clamp(0.4rem, 0.6vw, 0.75rem)',
        lineHeight: '1.1',
      }}
      layout
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <span>{label}</span>
    </motion.span>
  )
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
  const [sceneElements, setSceneElements] = useState([])

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

  // Obtener elementos de la escena actual
  useEffect(() => {
    async function loadSceneElements() {
      if (element?.sceneId) {
        const elements = await inMemoryElementsRepository.findBySceneId(
          element.sceneId,
        )
        setSceneElements(elements)
      } else {
        setSceneElements([])
      }
    }
    loadSceneElements()
  }, [element?.sceneId])

  // Notificar cuando la página terminó de cargar
  usePageLoaded([element, status])

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
          className="absolute left-4 sm:left-10 breadcrumb-responsive-top"
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
      className={clsx('relative min-h-screen overflow-hidden text-white')}
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
        className="absolute left-4 sm:left-10 breadcrumb-responsive-top"
        items={breadcrumbItems}
      />

      {/* Flechas de navegación entre elementos de la escena - pegadas a los bordes */}
      <NavigationArrows
        currentElementId={elementId}
        sceneElements={sceneElements}
      />

      {/* Contenedor de fichas flotantes a la derecha */}
      <div
        className="element-detail-cards pointer-events-auto absolute flex flex-col"
        style={{
          top: '50%', // Punto de anclaje al centro vertical
          right: '5vw',
          transform: 'translateY(-50%)', // Centra el contenedor desde su punto de anclaje
          maxHeight: 'calc(100vh - 13rem)', // Navbar (~6rem) + 10% + margen inferior = espacio reservado
        }}
      >
        {/* Ficha flotante con información del elemento */}
        <div className="element-card-main bg-black/50 shadow-2xl backdrop-blur">
          {/* Categoría superior */}
          <p
            className="element-category font-bold uppercase text-white/70"
            style={{ letterSpacing: '0.15em' }}
          >
            {affectationType?.name ?? 'Elemento'}
          </p>

          {/* Título del elemento */}
          <h1 className="font-bold leading-tight text-white">
            {element.name}
          </h1>

          {/* Descripción */}
          <p className="leading-relaxed text-white/90">
            {element.body}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="element-tags">
              <div className="flex flex-wrap">
                {tags.map((tag) => (
                  <ResponsiveTagChip
                    key={tag.id}
                    label={tag.label}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fuente */}
          <div className="border-t border-white/20">
            <p className="element-source leading-relaxed text-white/60">
              {element.source}
            </p>
          </div>
        </div>

        {/* Panel de recomendaciones - Solo imágenes debajo de la tarjeta principal */}
        {recommendations.length > 0 && (
          <div className="element-recommendations bg-black/50 shadow-xl backdrop-blur">
            <h2
              className="element-recommendation-title font-semibold uppercase text-white/70"
              style={{ letterSpacing: '0.2em' }}
            >
              Elementos relacionados
            </h2>

            {/* Grid de imágenes - máximo 5, centradas si hay menos */}
            <div className="flex justify-center">
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
                      // Navegar al escenario del elemento con highlight
                      zoomNavigate(`/escenas/${item.element.sceneId}?highlight=${item.element.id}`, { origin })
                    }}
                    className="element-recommendation-image aspect-square overflow-hidden border-2 border-white/20 bg-white/10 transition hover:border-white/60 hover:scale-105"
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
