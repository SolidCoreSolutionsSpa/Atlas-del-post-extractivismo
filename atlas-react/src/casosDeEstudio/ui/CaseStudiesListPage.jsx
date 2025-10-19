import { useMemo } from 'react'
import { motion } from 'framer-motion'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { InteractiveMap, MapMarker } from '../../shared/ui/InteractiveMap'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'
import { atlasContent } from '../../shared/data/atlasContent'
import { useCaseStudiesState } from '../hooks/useCaseStudiesState'
import { CaseStudiesService } from '../services/caseStudiesService'
import { inMemoryCaseStudiesRepository } from '../repo/caseStudiesRepository'

export function CaseStudiesListPage() {
  const service = useMemo(
    () =>
      new CaseStudiesService({
        caseStudiesRepository: inMemoryCaseStudiesRepository,
      }),
    [],
  )
  const { status, caseStudies } = useCaseStudiesState({
    caseStudiesService: service,
  })
  const zoomNavigate = useZoomNavigation()

  const isLoading = status === 'loading'
  const fallbackImage = atlasContent.caseStudies[0]?.globalMap.image ?? null
  const mapImage = caseStudies[0]?.globalMap.image ?? fallbackImage ?? null

  return (
    <motion.section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f5f7fb] px-6 py-0"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <InteractiveMap
        imageSrc={mapImage}
        imageAlt="Mapa global de casos de estudio"
        intensity={18}
        frame={false}
        className="min-h-[24rem] h-screen max-h-screen w-full"
        imageClassName="h-full max-h-full min-h-full w-auto min-w-[120%]"
      >
        {isLoading
          ? null
          : caseStudies.map((caseStudy) =>
              caseStudy.globalMap.points.map((point) => (
                <MapMarker
                  key={`${caseStudy.id}-${point.id}`}
                  left={point.left}
                  top={point.top}
                  label={point.label}
                  pulsate
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect()
                    const origin = {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    }
                    zoomNavigate(`/casos-de-estudio/${caseStudy.id}`, {
                      origin,
                    })
                  }}
                />
              )),
            )}
      </InteractiveMap>

      <Breadcrumbs
        className="absolute left-10 top-24 sm:top-28"
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Casos de extractivismo, escala global' },
        ]}
      />
    </motion.section>
  )
}
