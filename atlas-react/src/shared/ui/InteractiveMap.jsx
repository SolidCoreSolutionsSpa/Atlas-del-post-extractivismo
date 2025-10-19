import clsx from 'clsx'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

const MapParallaxContext = createContext(null)

function useParallaxTransforms(factor = 1) {
  const context = useContext(MapParallaxContext)
  if (!context) {
    throw new Error('Map components must be rendered inside <InteractiveMap>')
  }

  const translateX = useTransform(context.x, (value) => value * factor)
  const translateY = useTransform(context.y, (value) => value * factor)

  return { translateX, translateY }
}

export function InteractiveMap({
  imageSrc,
  imageAlt,
  intensity = 20,
  className,
  children,
}) {
  const containerRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 120, damping: 16 })
  const springY = useSpring(y, { stiffness: 120, damping: 16 })
  const translateXPx = useTransform(springX, (value) => `${value}px`)
  const translateYPx = useTransform(springY, (value) => `${value}px`)

  const handlePointerMove = useCallback(
    (event) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetX = (event.clientX - rect.left) / rect.width - 0.5
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5

      x.set(-offsetX * intensity)
      y.set(-offsetY * intensity)
    },
    [intensity, x, y],
  )

  const handlePointerLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  const contextValue = useMemo(
    () => ({ x: springX, y: springY }),
    [springX, springY],
  )

  const hasImage = typeof imageSrc === 'string' && imageSrc.length > 0

  return (
    <MapParallaxContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        className={clsx(
          'relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem]',
          className,
        )}
      >
        {hasImage ? (
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="pointer-events-none max-h-full w-full object-contain object-center"
            style={{
              translateX: translateXPx,
              translateY: translateYPx,
            }}
            loading="lazy"
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#eef3fa] via-[#dbe3ef] to-[#cbd6e7]" />
        )}
        <div className="absolute inset-0">
          {children}
        </div>
      </div>
    </MapParallaxContext.Provider>
  )
}

export function MapMarker({
  left,
  top,
  label,
  onClick,
  tone = 'danger',
  factor = 0.4,
  pulsate = false,
  children,
}) {
  const { translateX, translateY } = useParallaxTransforms(factor)

  const baseColor =
    tone === 'danger'
      ? 'bg-red-500 hover:bg-red-600'
      : tone === 'primary'
        ? 'bg-sky-500 hover:bg-sky-600'
        : 'bg-neutral-500 hover:bg-neutral-600'

  return (
    <motion.button
      type="button"
      onClick={(event) => {
        if (onClick) {
          event.preventDefault()
          event.stopPropagation()
          onClick(event)
        }
      }}
      style={{
        left,
        top,
        translateX,
        translateY,
      }}
      className={clsx(
        'group absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-2 border-white shadow-lg outline-none transition focus-visible:ring-2 focus-visible:ring-token-primary',
      )}
    >
      <span
        className={clsx(
          'pointer-events-auto block h-full w-full rounded-full transition',
          baseColor,
          pulsate && 'animate-[pulse-soft_2.5s_ease-in-out_infinite]',
        )}
      />
      <span className="pointer-events-none absolute -bottom-10 left-1/2 w-max -translate-x-1/2 rounded-full bg-black/85 px-3 py-1 text-xs font-medium text-white opacity-0 shadow group-hover:opacity-100">
        {label}
      </span>
      {children}
    </motion.button>
  )
}

export function MapIconHotspot({
  left,
  top,
  label,
  iconSrc,
  iconAlt,
  onClick,
  factor = 0.3,
  pulsate = true,
}) {
  const { translateX, translateY } = useParallaxTransforms(factor)

  return (
    <motion.button
      type="button"
      onClick={(event) => {
        if (onClick) {
          event.preventDefault()
          event.stopPropagation()
          onClick(event)
        }
      }}
      style={{
        left,
        top,
        translateX,
        translateY,
      }}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-2"
    >
      <motion.img
        src={iconSrc}
        alt={iconAlt}
        className={clsx(
          'pointer-events-auto h-10 w-10 rounded-full bg-white/80 p-2 backdrop-blur transition hover:scale-110',
          pulsate && 'animate-[pulse-soft_2s_ease-in-out_infinite]',
        )}
        loading="lazy"
      />
      <span className="pointer-events-none rounded-full bg-black/85 px-3 py-1 text-xs font-medium text-white opacity-0 shadow group-hover:opacity-100">
        {label}
      </span>
    </motion.button>
  )
}

export function MapDecoration({
  left,
  top,
  imageSrc,
  imageAlt,
  factor = 0.2,
  widthClass = 'w-28',
  className,
}) {
  const { translateX, translateY } = useParallaxTransforms(factor)

  return (
    <motion.div
      style={{
        left,
        top,
        translateX,
        translateY,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className={clsx(
          'pointer-events-none rounded-3xl border border-white/70 shadow-lg backdrop-blur',
          widthClass,
          className,
        )}
        loading="lazy"
      />
    </motion.div>
  )
}
