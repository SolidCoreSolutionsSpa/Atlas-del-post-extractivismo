import { motion } from 'framer-motion'
import clsx from 'clsx'

const baseStyles =
  'inline-flex items-center gap-1 rounded-full border border-white/30 bg-white px-2 py-0.5 text-xs font-medium text-black'

export function AffectationBadge({ label, className }) {
  return (
    <motion.span
      className={clsx(baseStyles, className)}
      layout
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <span>{label}</span>
    </motion.span>
  )
}
