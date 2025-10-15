import { useMemo } from 'react'
import { motion } from 'framer-motion'

import { Breadcrumbs } from '../../shared/ui/Breadcrumbs'
import { InteractiveMap, MapMarker } from '../../shared/ui/InteractiveMap'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation'
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

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-[#f5f7fb]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <InteractiveMap
        imageSrc={caseStudies[0]?.globalMap.image ?? ''}
        imageAlt="Mapa global de casos de estudio"
        intensity={18}
        className="h-[calc(100vh-2rem)]"
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
        className="absolute left-10 top-28"
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Casos de extractivismo, escala global' },
        ]}
      />

      <div className="pointer-events-none absolute bottom-16 left-1/2 w-full max-w-xl -translate-x-1/2 text-center">
        <h1
          className="text-3xl font-semibold text-token-primary sm:text-4xl"
          style={{ fontFamily: '"Baskervville", serif' }}
        >
          Casos de estudio
        </h1>
        <p className="mt-4 text-base leading-relaxed text-token-body/80">
          Explora el mapa global y selecciona los puntos iluminados para entrar a cada territorio.
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-token-muted">
          Haz clic en un punto para continuar
        </p>
      </div>
    </motion.section>
  )
}
