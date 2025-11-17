import React from 'react'
import { CaseStudiesListPage } from '../ui/CaseStudiesListPage'
import { CaseStudyDetailPage } from '../ui/CaseStudyDetailPage'

export const casosDeEstudioRoutes = [
  {
    path: '/casos-de-estudio',
    element: <CaseStudiesListPage />,
  },
  {
    path: '/casos-de-estudio/:caseStudyId',
    element: <CaseStudyDetailPage />,
  },
]
