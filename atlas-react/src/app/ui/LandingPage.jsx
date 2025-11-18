import { useEffect, useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { atlasContent } from '../../shared/data/newAtlasContent'
import { useZoomNavigation, usePageLoaded } from '../../shared/hooks/useZoomNavigation.jsx'
import { useImageCrossfade } from '../../shared/hooks/useImageCrossfade'
import { useParallax } from '../../shared/hooks/useParallax'
import { RadarPoint } from '../../shared/ui/RadarPoint'
import { usePrefersReducedMotion } from '../../shared/design/hooks/usePrefersReducedMotion'
import { LandingPageViewModel } from '../../landingPage/viewModel/LandingPageViewModel'

const hero = atlasContent.hero
const PARALLAX_FACTOR = 20

export function LandingPage() {
  const zoomNavigate = useZoomNavigation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isAnimating, setIsAnimating] = useState(false)

  // ViewModel para obtener casos de estudio siguiendo patrón MVVM
  const viewModel = useMemo(() => new LandingPageViewModel(), [])
  const territoriesConfig = useMemo(() => viewModel.getTerritoriesConfig(), [viewModel])

  // Notificar cuando la página terminó de cargar
  usePageLoaded([territoriesConfig])

  // Hook de crossfade de imágenes
  const { currentImage, isFading, swapImage } = useImageCrossfade(
    hero.image_path || '/img/GLOBAL HOME AZUL NEGRO-100.jpg',
  )

  // Hook de parallax
  const { offset, pointOffset } = useParallax({
    intensity: PARALLAX_FACTOR,
    enabled: !prefersReducedMotion,
  })

  // Estado del sistema de hover
  const [hoveredTerritory, setHoveredTerritory] = useState(null)

  // Texto e instrucción
  const defaultDescription = hero.description
  const defaultInstruction = 'SELECCIONA UN PUNTO DEL MAPA PARA COMENZAR'

  const currentDescription = hoveredTerritory
    ? territoriesConfig[hoveredTerritory].description
    : defaultDescription

  const currentInstruction = hoveredTerritory
    ? territoriesConfig[hoveredTerritory].name
    : defaultInstruction

  const currentInstructionColor = hoveredTerritory
    ? territoriesConfig[hoveredTerritory].color
    : '#555'

  // Precarga de imágenes al montar el componente
  useEffect(() => {
    Object.values(territoriesConfig).forEach((territory) => {
      // Precargar imagen de hover
      if (territory.backgroundImage) {
        const img = new Image()
        img.src = territory.backgroundImage
      }
      // Precargar imagen de la página de detalle para transición fluida
      if (territory.detailImagePath) {
        const img = new Image()
        img.src = territory.detailImagePath
      }
    })
  }, [territoriesConfig])

  // Sistema de crossfade de imágenes
  const handleTerritoryHover = (territoryKey) => {
    if (!territoryKey) {
      // Mouse leave - volver a imagen original
      setHoveredTerritory(null)
      const originalImage = hero.image_path || '/img/GLOBAL HOME AZUL NEGRO-100.jpg'
      swapImage(originalImage)
      return
    }

    const territory = territoriesConfig[territoryKey]
    setHoveredTerritory(territoryKey)

    // Solo cambiar imagen si el territorio tiene backgroundImage definido
    if (territory.backgroundImage) {
      swapImage(territory.backgroundImage)
    }
  }

  // Click handler para navegación
  const handleTerritoryClick = (territoryKey, event) => {
    if (isAnimating) return

    const territory = territoriesConfig[territoryKey]
    if (!territory.navigateTo) {
      // No hay ruta configurada (próximamente)
      return
    }

    setIsAnimating(true)

    const rect = event.currentTarget.getBoundingClientRect()
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    zoomNavigate(territory.navigateTo, { origin })

    setTimeout(() => {
      setIsAnimating(false)
    }, 750)
  }

  // Estados de puntos: cada punto puede estar visible, soft, o hidden
  const getPointState = (territoryKey) => {
    if (!hoveredTerritory) return 'visible'
    return hoveredTerritory === territoryKey ? 'visible' : 'soft'
  }
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <div className="contenedor">
        {/* Contenido a la derecha */}
        <motion.div id="contenido">
          <h1>{hero.title.toUpperCase()}</h1>
          <h2>{hero.subtitle}</h2>

          {/* Descripción con transición */}
          <AnimatePresence mode="wait">
            <motion.p
              key={hoveredTerritory || 'default'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentDescription}
            </motion.p>
          </AnimatePresence>

          {/* Instrucción con transición */}
          <AnimatePresence mode="wait">
            <motion.p
              className="instruccion"
              key={`instruction-${hoveredTerritory || 'default'}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                color: currentInstructionColor,
              }}
            >
              {currentInstruction}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <div className="mapa-wrapper">
          <div className="mapa-container">
            {/* Imagen de fondo con crossfade */}
            <motion.img
              src={currentImage}
              alt="Mapa global"
              className="imagen-mapa"
              animate={{
                opacity: isFading ? 0 : 1,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
              }}
              transition={{ opacity: { duration: 0.3 }, transform: { duration: 0 } }}
              loading="lazy"
            />

            {/* Overlay con puntos radar */}
            <div className="overlay-puntos">
              {Object.entries(territoriesConfig).map(([key, territory]) => (
                <RadarPoint
                  key={territory.id}
                  left={territory.position.left}
                  top={territory.position.top}
                  label={territory.name}
                  variant={territory.variant}
                  state={getPointState(key)}
                  isHovered={hoveredTerritory === key}
                  parallaxOffset={pointOffset}
                  onClick={(event) => handleTerritoryClick(key, event)}
                  onMouseEnter={() => handleTerritoryHover(key)}
                  onMouseLeave={() => handleTerritoryHover(null)}
                  onFocus={() => handleTerritoryHover(key)}
                  onBlur={() => handleTerritoryHover(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
