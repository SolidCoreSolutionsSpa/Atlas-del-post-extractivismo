import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const TRANSITION_DURATION = 600

function setTransformOrigin({ x, y }) {
  const originX = Number.isFinite(x) ? x : window.innerWidth / 2
  const originY = Number.isFinite(y) ? y : window.innerHeight / 2
  document.body.style.transformOrigin = `${originX}px ${originY}px`
}

function startZoomAnimation(className) {
  document.body.classList.remove('zoom-dirigido', 'animar-zoom-out')
  document.body.classList.add(className)
}

function clearZoomAnimation() {
  document.body.classList.remove('zoom-dirigido', 'animar-zoom-out')
  document.body.style.transformOrigin = ''
}

export function useZoomNavigation() {
  const navigate = useNavigate()

  return useCallback(
    (to, { origin, animation = 'zoom-dirigido', navigateOptions } = {}) => {
      setTransformOrigin(
        origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      )
      startZoomAnimation(animation)

      window.setTimeout(() => {
        navigate(to, navigateOptions)
        window.setTimeout(() => {
          clearZoomAnimation()
        }, 50)
      }, TRANSITION_DURATION)
    },
    [navigate],
  )
}

export function useZoomOut() {
  return useCallback(({ origin } = {}) => {
    setTransformOrigin(
      origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    )
    startZoomAnimation('animar-zoom-out')
    window.setTimeout(clearZoomAnimation, TRANSITION_DURATION)
  }, [])
}
