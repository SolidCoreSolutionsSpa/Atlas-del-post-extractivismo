import { cloneElement } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLocation, useRoutes } from 'react-router-dom'

import { casosDeEstudioRoutes } from '../casosDeEstudio/routes/casosDeEstudioRoutes.jsx'
import { zonasRoutes } from '../zonas/routes/zonasRoutes.jsx'
import { escenasRoutes } from '../escenas/routes/escenasRoutes.jsx'
import { elementosRoutes } from '../elementos/routes/elementosRoutes.jsx'
import { LandingPage } from './ui/LandingPage'

const routeDefinitions = [
  {
    path: '/',
    element: <LandingPage />,
  },
  ...casosDeEstudioRoutes,
  ...zonasRoutes,
  ...escenasRoutes,
  ...elementosRoutes,
  {
    path: '*',
    element: <LandingPage />,
  },
]

export function AppRoutes() {
  const location = useLocation()
  const element = useRoutes(routeDefinitions, location)

  if (!element) {
    return null
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {cloneElement(element, {
        key: location.pathname,
      })}
    </AnimatePresence>
  )
}
