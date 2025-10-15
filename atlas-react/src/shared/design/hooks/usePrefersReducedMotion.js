import { useEffect } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion() {
  useEffect(() => {
    const mediaQuery = window.matchMedia?.(QUERY)

    if (!mediaQuery) {
      return undefined
    }

    const handleChange = (event) => {
      document.body.dataset.motion = event.matches ? 'reduced' : 'full'
    }

    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])
}
