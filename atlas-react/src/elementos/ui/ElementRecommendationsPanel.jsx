import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { SectionHeader } from '../../shared/design/components/SectionHeader'
import { Button } from '../../shared/design/components/Button'
import { TagChip } from '../../shared/ui/TagChip'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation'
import { inMemoryElementsRepository } from '../repo/elementsRepository'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 160, damping: 18 },
  },
}

export function ElementRecommendationsPanel() {
  const [elements, setElements] = useState([])
  const zoomNavigate = useZoomNavigation()

  useEffect(() => {
    let isMounted = true

    async function load() {
      const { items } = await inMemoryElementsRepository.listPaginated({
        limit: 6,
      })

      const enriched = await Promise.all(
        items.map((item) =>
          inMemoryElementsRepository.getElementWithTags(item.id),
        ),
      )

      if (isMounted) {
        setElements(enriched.filter(Boolean))
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <motion.section
      className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12"
      initial="hidden"
      animate="visible"
      variants={listVariants}
    >
      <SectionHeader
        eyebrow="Elementos"
        title="Listado de elementos"
        description="Selecciona un elemento para revisar su detalle y obtener recomendaciones basadas en tags compartidos."
      />

      <motion.ul
        role="list"
        className="grid gap-4 sm:grid-cols-2"
        variants={listVariants}
      >
        {elements.map((entry) => (
          <motion.li
            key={entry.element.id}
            variants={cardVariants}
            className="flex h-full flex-col justify-between rounded-2xl border border-token-divider bg-token-surface p-5 shadow-sm"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-token-primary">
                {entry.element.name}
              </h2>
              {entry.element.subtitle ? (
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-token-muted">
                  {entry.element.subtitle}
                </p>
              ) : null}
              <p className="text-xs uppercase tracking-wide text-token-muted">
                {entry.affectationType?.name ?? 'Afectacion por definir'}
              </p>
              <p className="text-sm text-token-muted">
                {entry.element.body}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <TagChip key={tag.id} label={tag.label} />
                ))}
              </div>
            </div>
            <Button
              as="button"
              intent="secondary"
              className="mt-4 w-fit"
              motionProps={{
                whileHover: { scale: 1.03 },
                whileTap: { scale: 0.97 },
              }}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                const origin = {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                }
                zoomNavigate(`/elementos/${entry.element.id}`, { origin })
              }}
            >
              Ver detalle
            </Button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  )
}
