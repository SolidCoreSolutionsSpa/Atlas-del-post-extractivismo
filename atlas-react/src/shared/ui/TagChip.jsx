import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const baseStyles =
  'inline-flex items-center gap-1 rounded-full border border-token-divider bg-token-surface px-3 py-1 text-xs font-medium text-token-primary'

export function TagChip({ label, icon, className, active = false }) {
  return (
    <motion.span
      className={clsx(
        baseStyles,
        active && 'border-token-primary text-token-primary-strong',
        className,
      )}
      layout
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{label}</span>
    </motion.span>
  )
}
