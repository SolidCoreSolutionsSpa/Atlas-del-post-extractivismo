import React from 'react'
import { ZonasListPage } from '../ui/ZonasListPage'
import { ZonaDetailPage } from '../ui/ZonaDetailPage'

export const zonasRoutes = [
  {
    path: '/zonas',
    element: <ZonasListPage />,
  },
  {
    path: '/zonas/:zoneId',
    element: <ZonaDetailPage />,
  },
]
