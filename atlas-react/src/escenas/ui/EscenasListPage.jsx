import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { SectionHeader } from '../../shared/design/components/SectionHeader'
import { Button } from '../../shared/design/components/Button'
import { usePageLoaded } from '../../shared/hooks/useZoomNavigation.jsx'
import { useEscenasState } from '../hooks/useEscenasState'
import { EscenasService } from '../services/escenasService'
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

export function EscenasListPage() {
  const { escenasRepository, isLoading: repositoriesLoading } = useRepositories()

  const service = useMemo(
    () =>
      escenasRepository
        ? new EscenasService({
            escenasRepository,
          })
        : null,
    [escenasRepository],
  )

  const { status, escenas } = useEscenasState({ escenasService: service })
  const isLoading = repositoriesLoading || status === 'loading'

  // Notificar cuando la página terminó de cargar
  usePageLoaded([escenas, status])

  return (
    <motion.section
      className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SectionHeader
        eyebrow="Feature Slice"
        title="Escenas"
        description="Placeholder para escenas vinculadas a zonas, tipos y elementos."
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
            Cargando escenas...
          </motion.li>
        ) : null}

        {escenas.map((scene) => (
          <motion.li
            key={scene.id}
            className="flex h-full flex-col justify-between rounded-2xl border border-token-divider bg-token-surface p-5 shadow-sm"
            variants={cardVariants}
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-token-primary">
                {scene.title}
              </h2>
              <p className="text-xs uppercase tracking-wide text-token-muted">
                Zona: {scene.zoneId} �- Tipo: {scene.sceneTypeId}
              </p>
              <p className="text-sm text-token-muted">{scene.description}</p>
            </div>
            <Button
              as={Link}
              to={`/escenas/${scene.id}`}
              intent="secondary"
              className="mt-4 w-fit"
              motionProps={{
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
              }}
            >
              Ver escena
            </Button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  )
}
