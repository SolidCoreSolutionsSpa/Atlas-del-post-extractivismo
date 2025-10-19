import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { atlasContent } from '../../shared/data/atlasContent'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'

const hero = atlasContent.hero
const PARALLAX_FACTOR = 20

export function LandingPage() {
  const zoomNavigate = useZoomNavigation()
  const [isAnimating, setIsAnimating] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

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

  const handleEnter = (event) => {
    if (isAnimating) {
      return
    }
    setIsAnimating(true)
    const rect = event.currentTarget.getBoundingClientRect()
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    zoomNavigate('/casos-de-estudio', { origin })
    window.setTimeout(() => {
      setIsAnimating(false)
    }, 750)
  }

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="contenedor">
        <motion.div id="contenido">
          <h1>{hero.title.toUpperCase()}</h1>
          <h2>{hero.subtitle}</h2>
          <p>{hero.description}</p>
          <button id="ingresarBtn" type="button" onClick={handleEnter}>
            INGRESAR
          </button>
        </motion.div>
        <div className="mapa-wrapper">
          <motion.img
            src={hero.image || '/img/paisajehome.webp'}
            alt="Paisaje de bienvenida"
            className="imagen-mapa"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px)`,
            }}
            loading="lazy"
          />
        </div>
      </div>
    </motion.section>
  )
}
