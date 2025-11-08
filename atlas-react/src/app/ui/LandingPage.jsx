import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { atlasContent } from '../../shared/data/atlasContent'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { RadarPoint } from '../../shared/ui/RadarPoint'

const hero = atlasContent.hero
const PARALLAX_FACTOR = 20

// Configuración de territorios para el hover system
const territoriesConfig = {
  choapa: {
    id: 'choapa-btn',
    name: 'PROVINCIA DE CHOAPA, COQUIMBO, CHILE',
    description:
      'La minería en el norte de Chile enfrenta una crisis hídrica que ha llevado una nueva era de plantas desalinizadoras que extraen agua del océano Pacífico. Aunque la desalinización ofrece una propuesta "verde", mira como su sostenimiento puede generar controversias socio-ecológicas.',
    backgroundImage: '/img/mapa-global-de-cobre-T.jpg',
    color: '#d57a00',
    variant: 'default',
    position: { left: '29.5%', top: '68%' },
    navigateTo: '/casos-de-estudio/provincia-choapa',
  },
  congo: {
    id: 'congo-btn',
    name: 'KOLWEZI – CONGO',
    description:
      'En las últimas dos décadas, Kolwezi, ciudad minera de la República Democrática del Congo, enfrenta tensiones entre la minería, la degradación ambiental y la rápida urbanización que reconfigura los paisajes como rastros extractivos, minas expuestas, escombreras y sitios abandonados.',
    backgroundImage: '/img/mapa-global-de-cobalto-T.jpg',
    color: '#443ad4ff',
    variant: 'blue',
    position: { left: '29.5%', top: '44.7%' },
    navigateTo: null, // Próximamente
  },
  indonesia: {
    id: 'indonesia-btn',
    name: 'SUMATERA UTARA – INDONESIA',
    description:
      'Una de las regiones de aceite de palma más productivas del mundo ha configurado un paisaje de extracción agroindustrial, donde los ciclos de siembra y resiembra desplazan comunidades, reordenan los ecosistemas y consolidan un régimen de monocultivo.',
    backgroundImage: '/img/mapa-global-de-aceite-T.jpg',
    color: '#e4db66ff',
    variant: 'yellow',
    position: { left: '35.7%', top: '45%' },
    navigateTo: null, // Próximamente
  },
  charleroi: {
    id: 'charleroi-btn',
    name: 'CHARLEROI – BÉLGICA (PRÓXIMAMENTE)',
    description:
      'El carbón en la década de los 90 era líder mundial en Bélgica. Hoy en día, Charleroi es un territorio post-extractivista en transición, donde el patrimonio industrial se cruza con la reconversión económica y social.',
    backgroundImage: '/img/mapa-global-de-carbon-T.jpg',
    color: '#1a1a1a',
    variant: 'black',
    position: { left: '27.5%', top: '36%' },
    navigateTo: null, // Próximamente
  },
}

export function LandingPage() {
  const zoomNavigate = useZoomNavigation()
  const [isAnimating, setIsAnimating] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Estado del sistema de hover
  const [hoveredTerritory, setHoveredTerritory] = useState(null)
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState(
    hero.image || '/img/GLOBAL HOME AZUL NEGRO-100.jpg',
  )
  const [isFading, setIsFading] = useState(false)

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
      const img = new Image()
      img.src = territory.backgroundImage
    })
  }, [])

  // Parallax
  useEffect(() => {
    function handleMouseMove(event) {
      const { innerWidth, innerHeight } = window
      const offsetX = 0.5 - event.clientX / innerWidth
      const offsetY = 0.5 - event.clientY / innerHeight
      setOffset({ x: offsetX * PARALLAX_FACTOR, y: offsetY * PARALLAX_FACTOR })
    }

    function handleMouseLeave() {
      setOffset({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Sistema de crossfade de imágenes
  const handleTerritoryHover = (territoryKey) => {
    if (!territoryKey) {
      // Mouse leave - volver a imagen original
      setHoveredTerritory(null)
      swapImage(hero.image || '/img/GLOBAL HOME AZUL NEGRO-100.jpg')
      return
    }

    const territory = territoriesConfig[territoryKey]
    setHoveredTerritory(territoryKey)
    swapImage(territory.backgroundImage)
  }

  const swapImage = (nextSrc) => {
    if (currentBackgroundImage === nextSrc || isFading) return

    setIsFading(true)

    // Esperar a que termine el fade-out antes de cambiar la imagen
    setTimeout(() => {
      setCurrentBackgroundImage(nextSrc)
      // Pequeño delay para el fade-in
      requestAnimationFrame(() => {
        setIsFading(false)
      })
    }, 300) // Duración del fade-out
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

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="contenedor">
        {/* Contenido posicionado arriba-derecha como en el HTML original */}
        <motion.div
          id="contenido"
          style={{
            position: 'absolute',
            top: '47%',
            left: '75%',
            transform: 'translate(-50%, -50%)',
            width: '30%',
            textAlign: 'left',
            zIndex: 50,
          }}
        >
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
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '0.15em',
                textAlign: 'center',
                marginTop: '2rem',
              }}
            >
              {currentInstruction}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <div className="mapa-wrapper">
          {/* Imagen de fondo con crossfade */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentBackgroundImage}
              src={currentBackgroundImage}
              alt="Mapa global"
              className="imagen-mapa"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              loading="lazy"
            />
          </AnimatePresence>

          {/* Overlay con puntos radar */}
          <div className="overlay-puntos">
            {Object.entries(territoriesConfig).map(([key, territory]) => (
              <div
                key={territory.id}
                onMouseEnter={() => handleTerritoryHover(key)}
                onMouseLeave={() => handleTerritoryHover(null)}
                onFocus={() => handleTerritoryHover(key)}
                onBlur={() => handleTerritoryHover(null)}
              >
                <RadarPoint
                  left={territory.position.left}
                  top={territory.position.top}
                  label={territory.name}
                  variant={territory.variant}
                  state={getPointState(key)}
                  isHovered={hoveredTerritory === key}
                  onClick={(event) => handleTerritoryClick(key, event)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
