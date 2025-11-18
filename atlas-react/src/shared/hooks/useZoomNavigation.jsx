import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

const TransitionContext = createContext(null)

function createOrigin(position) {
  if (typeof window === 'undefined') {
    return {
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      intensityX: 0,
      intensityY: 0,
      transformOrigin: '50% 50%',
    }
  }

  const width = window.innerWidth || 1
  const height = window.innerHeight || 1

  const x = Number.isFinite(position?.x) ? position.x : width / 2
  const y = Number.isFinite(position?.y) ? position.y : height / 2

  const clampedX = Math.max(0, Math.min(width, x))
  const clampedY = Math.max(0, Math.min(height, y))

  const offsetX = clampedX - width / 2
  const offsetY = clampedY - height / 2

  return {
    x: clampedX,
    y: clampedY,
    offsetX,
    offsetY,
    intensityX: offsetX / width,
    intensityY: offsetY / height,
    transformOrigin: `${clampedX}px ${clampedY}px`,
  }
}

function createDefaultTransition() {
  return {
    id: 0,
    direction: 'forward',
    origin: createOrigin(),
    isNavigating: false,
  }
}

function useTransitionController() {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error(
      'useZoomNavigation must be used within a TransitionProvider context',
    )
  }
  return context
}

export function TransitionProvider({ children }) {
  const [transitionState, setTransitionState] = useState(
    createDefaultTransition,
  )

  const setTransition = useCallback((payload = {}) => {
    setTransitionState({
      id: Date.now(),
      direction: payload.direction ?? 'forward',
      origin: payload.origin ?? createOrigin(),
      isNavigating: payload.isNavigating ?? false,
    })
  }, [])

  const value = useMemo(
    () => ({
      transition: transitionState,
      setTransition,
    }),
    [transitionState, setTransition],
  )

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  const { transition } = useTransitionController()
  return transition
}

export function useZoomNavigation() {
  const navigate = useNavigate()
  const { setTransition } = useTransitionController()

  return useCallback(
    (
      to,
      { origin, direction, animation, navigateOptions } = {},
    ) => {
      const resolvedDirection =
        direction ??
        (animation === 'animar-zoom-out' ? 'backward' : 'forward')

      // Activar el estado de navegación/loading
      setTransition({
        direction: resolvedDirection,
        origin: createOrigin(origin),
        isNavigating: true,
      })

      navigate(to, navigateOptions)
    },
    [navigate, setTransition],
  )
}

export function useZoomOut() {
  const { setTransition } = useTransitionController()
  return useCallback(
    ({ origin } = {}) => {
      setTransition({
        direction: 'backward',
        origin: createOrigin(origin),
      })
    },
    [setTransition],
  )
}

/**
 * Hook para notificar cuando una página terminó de cargar
 * Las páginas deben llamar a este hook para indicar que están listas
 */
export function usePageLoaded(dependencies = []) {
  const { setTransition } = useTransitionController()
  const { transition } = useTransitionController()

  useEffect(() => {
    // Solo proceder si estamos en estado de navegación
    if (!transition.isNavigating) {
      return
    }

    // Pequeño delay para asegurar que el DOM esté renderizado
    const timer = setTimeout(() => {
      setTransition({
        ...transition,
        isNavigating: false,
      })
    }, 100)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTransition, ...dependencies])
}
