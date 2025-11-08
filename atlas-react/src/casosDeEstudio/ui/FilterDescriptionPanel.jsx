import { motion, AnimatePresence } from 'framer-motion'

const panelVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.15,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
}

export function FilterDescriptionPanel({ activeFilter, filterDescriptions }) {
  if (!activeFilter || !filterDescriptions[activeFilter]) {
    return null
  }

  const { title, text } = filterDescriptions[activeFilter]

  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none fixed bottom-8 left-8 max-w-sm rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-md"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h3 className="text-lg font-semibold text-token-primary">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-token-body">
          {text}
        </p>
      </motion.div>
    </AnimatePresence>
  )
}
