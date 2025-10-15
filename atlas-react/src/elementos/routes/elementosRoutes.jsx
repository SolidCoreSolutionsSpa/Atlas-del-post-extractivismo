import { ElementDetailPage } from '../ui/ElementDetailPage'
import { ElementRecommendationsPanel } from '../ui/ElementRecommendationsPanel'

export const elementosRoutes = [
  {
    path: '/elementos',
    element: <ElementRecommendationsPanel />,
  },
  {
    path: '/elementos/:elementId',
    element: <ElementDetailPage />,
  },
]
