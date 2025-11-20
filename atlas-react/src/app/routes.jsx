import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'

import { usePageTransition } from '../shared/hooks/useZoomNavigation.jsx'
import { usePrefersReducedMotion } from '../shared/design/hooks/usePrefersReducedMotion'
import { casosDeEstudioRoutes } from '../casosDeEstudio/routes/casosDeEstudioRoutes.jsx'
import { zonasRoutes } from '../zonas/routes/zonasRoutes.jsx'
import { escenasRoutes } from '../escenas/routes/escenasRoutes.jsx'
import { elementosRoutes } from '../elementos/routes/elementosRoutes.jsx'
import { LandingPage } from './ui/LandingPage'
import { AboutPage } from './ui/AboutPage.jsx'
import { ColaboratePage } from './ui/ColaboratePage.jsx'
import { GlosaryPage } from './ui/GlosaryPage.jsx'

const routeDefinitions = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/sobre-el-proyecto',
    element: <AboutPage />,
  },
  {
    path: '/colabora',
    element: <ColaboratePage />,
  },
  {
    path: '/glosario',
    element: <GlosaryPage />,
  },
  ...casosDeEstudioRoutes,
  ...zonasRoutes,
  ...escenasRoutes,
  ...elementosRoutes,
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

const DEFAULT_CUSTOM = {
  direction: 'forward',
  intensityX: 0,
  intensityY: 0,
  offsetX: 0,
  offsetY: 0,
  transformOrigin: '50% 50%',
}

function createPageVariants(prefersReducedMotion) {
  const centerTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.72, ease: [0.22, 0.61, 0.36, 1] }

  return {
    enter: (custom = DEFAULT_CUSTOM) => {
      const isForward = custom.direction !== 'backward'
      return {
        opacity: isForward ? 0 : 0.75,
        scale: isForward ? 0.45 : 1.35,
        x: 0,
        y: 0,
        rotateX: isForward ? 10 : -6,
        filter: 'blur(24px)',
      }
    },
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: centerTransition,
    },
    exit: (custom = DEFAULT_CUSTOM) => {
      const isForward = custom.direction !== 'backward'
      const exitTransition = prefersReducedMotion
        ? { duration: 0 }
        : {
          duration: isForward ? 0.65 : 0.58,
          ease: isForward ? [0.65, 0, 0.35, 1] : [0.17, 0.84, 0.44, 1],
        }

      return {
        opacity: 0,
        scale: isForward ? 1.55 : 0.65,
        x: 0,
        y: 0,
        rotateX: isForward ? -14 : 12,
        filter: 'blur(30px)',
        transition: exitTransition,
      }
    },
  }
}

function createTrailVariants(prefersReducedMotion) {
  const exitTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }

  return {
    enter: () => ({
      opacity: 0,
      scale: 0.9,
      x: 0,
      y: 0,
    }),
    center: {
      opacity: 0,
      scale: 1,
      x: 0,
      y: 0,
    },
    exit: (custom = DEFAULT_CUSTOM) => ({
      opacity: 0.28,
      scale: 1.55,
      x: custom.offsetX ?? 0,
      y: custom.offsetY ?? 0,
      transition: exitTransition,
    }),
  }
}

export function AppRoutes() {
  const location = useLocation()
  const transition = usePageTransition()
  const prefersReducedMotion = usePrefersReducedMotion()
  const element = useRoutes(routeDefinitions, location)

  const custom = useMemo(() => {
    if (!transition) {
      return DEFAULT_CUSTOM
    }

    const { direction, origin } = transition
    return {
      direction,
      intensityX: origin?.intensityX ?? 0,
      intensityY: origin?.intensityY ?? 0,
      offsetX: origin?.offsetX ?? 0,
      offsetY: origin?.offsetY ?? 0,
      transformOrigin: origin?.transformOrigin ?? '50% 50%',
    }
  }, [transition])

  const pageVariants = useMemo(
    () => createPageVariants(prefersReducedMotion),
    [prefersReducedMotion],
  )
  const trailVariants = useMemo(
    () => createTrailVariants(prefersReducedMotion),
    [prefersReducedMotion],
  )

  if (!element) {
    return null
  }

  const motionKey = `${location.pathname}${location.search}`

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={motionKey}
        custom={custom}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        style={{
          transformOrigin: '50% 50%',
          transformStyle: 'preserve-3d',
          perspective: 1600,
        }}
        className="relative min-h-screen will-change-transform"
      >
        {element}
        <motion.div
          key={`${motionKey}-trail`}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          custom={custom}
          variants={trailVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), rgba(255,255,255,0) 55%),
              linear-gradient(140deg, rgba(255,255,255,0.2), rgba(255,255,255,0))
            `,
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
