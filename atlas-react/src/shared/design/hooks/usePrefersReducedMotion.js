import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(QUERY)

    if (!mediaQuery) {
      return undefined
    }

    const handleChange = (event) => {
      const reduced = event.matches
      document.body.dataset.motion = reduced ? 'reduced' : 'full'
      setPrefersReducedMotion(reduced)
    }

    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}
