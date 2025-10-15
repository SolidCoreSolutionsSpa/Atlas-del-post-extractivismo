import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const buttonIntents = {
  primary:
    'bg-token-primary text-white shadow-sm hover:bg-token-primary-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-token-primary-strong',
  secondary:
    'bg-token-surface text-token-primary border border-token-divider hover:border-token-primary hover:text-token-primary-strong',
  ghost:
    'bg-transparent text-token-primary hover:bg-token-muted/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-token-primary',
}

export const Button = forwardRef(function Button(
  { as, intent = 'primary', className, motionProps, ...rest },
  ref,
) {
  const Component = as ? motion(as) : motion.button

  return (
    <Component
      ref={ref}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:text-base',
        buttonIntents[intent],
        className,
      )}
      {...motionProps}
      {...rest}
    />
  )
})
