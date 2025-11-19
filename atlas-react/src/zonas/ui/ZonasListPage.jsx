import { useMemo } from 'react'
import { motion } from 'framer-motion'

import { SectionHeader } from '../../shared/design/components/SectionHeader'
import { Button } from '../../shared/design/components/Button'
import { useZoomNavigation, usePageLoaded } from '../../shared/hooks/useZoomNavigation.jsx'
import { useZonasState } from '../hooks/useZonasState'
import { ZonasService } from '../services/zonasService'
import { useRepositories } from '../../shared/data/AtlasRepositoriesContext'

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 140, damping: 18, staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 160, damping: 18 },
  },
}

export function ZonasListPage() {
  const { zonasRepository, isLoading: repositoriesLoading } = useRepositories()

  const service = useMemo(
    () =>
      zonasRepository
        ? new ZonasService({
            zonasRepository,
          })
        : null,
    [zonasRepository],
  )

  const zoomNavigate = useZoomNavigation()
  const { status, zonas } = useZonasState({ zonasService: service })
  const isLoading = repositoriesLoading || status === 'loading'

  // Notificar cuando la página terminó de cargar
  usePageLoaded([zonas, status])

  return (
    <motion.section
      className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SectionHeader
        eyebrow="Feature Slice"
        title="Zonas"
        description="Scaffolding listo para vincular zonas con casos de estudio y escenas asociadas."
      />

      <motion.ul
        role="list"
        className="grid gap-4 sm:grid-cols-2"
        variants={containerVariants}
      >
        {isLoading ? (
          <motion.li
            className="rounded-2xl border border-dashed border-token-divider p-6 text-sm text-token-muted"
            variants={cardVariants}
          >
            Cargando zonas...
          </motion.li>
        ) : null}

        {zonas.map((zone) => (
          <motion.li
            key={zone.id}
            className="flex h-full flex-col justify-between rounded-2xl border border-token-divider bg-token-surface p-5 shadow-sm"
            variants={cardVariants}
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-token-primary">
                {zone.name}
              </h2>
              <p className="text-xs uppercase tracking-wide text-token-muted">
                Caso de estudio: {zone.caseStudyId}
              </p>
              <p className="text-sm text-token-muted">{zone.description}</p>
            </div>
            <Button
              as="button"
              intent="secondary"
              className="mt-4 w-fit"
              motionProps={{
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
              }}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                const origin = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                }
                zoomNavigate(`/zonas/${zone.id}`, { origin })
              }}
            >
              Ver zona
            </Button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  )
}
