import { EscenasListPage } from '../ui/EscenasListPage'
import { EscenaDetailPage } from '../ui/EscenaDetailPage'

export const escenasRoutes = [
  {
    path: '/escenas',
    element: <EscenasListPage />,
  },
  {
    path: '/escenas/:sceneId',
    element: <EscenaDetailPage />,
  },
]
