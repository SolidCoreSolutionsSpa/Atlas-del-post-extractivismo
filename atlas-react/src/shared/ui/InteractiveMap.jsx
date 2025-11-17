import clsx from 'clsx'
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

import { usePrefersReducedMotion } from '../design/hooks/usePrefersReducedMotion'
import { SmartTooltip } from './SmartTooltip'
import { ShapeBackground } from './ShapeBackground'

export const MapParallaxContext = createContext(null)

export function useMapContext() {
  const context = useContext(MapParallaxContext)
  if (!context) throw new Error('Map components must be rendered inside <InteractiveMap>')
  return context
}

function useParallaxTransforms(factor = 0) {
  const { motionX, motionY } = useMapContext()
  const translateX = useTransform(motionX, (value) => value * factor)
  const translateY = useTransform(motionY, (value) => value * factor)
  return { translateX, translateY }
}

function useMapLayout() {
  const { layout } = useMapContext()
  return layout
}

function useMapCoordinates(left, top) {
  const layout = useMapLayout()
  return useMemo(() => {
    if (!layout || layout.width <= 0 || layout.height <= 0) return { left, top }
    return {
      left: resolveCoordinate(left, layout.width),
      top: resolveCoordinate(top, layout.height),
    }
  }, [layout, left, top])
}

function resolveCoordinate(value, tamaño) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const limpio = value.trim()
    const num = Number.parseFloat(limpio)
    if (Number.isFinite(num)) return limpio.endsWith('%') ? (num / 100) * tamaño : num
  }
  return 0
}

export function InteractiveMap({
  imageSrc,
  imageAlt,
  intensity = 20,
  className,
  frame = false,
  contentPosition = 'center',
  overfill = 1.28,
  objectFit = 'contain',
  blurredBackground = true,
  blurAmount = 20,
  backdropGradient = 'linear-gradient(180deg, rgba(236, 242, 250, 0.95), rgba(236, 242, 250, 0.85))',
  backdropBlur = 28,
  children,
}) {
  const contenedorRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Parallax
  const motionX = useMotionValue(0)
  const motionY = useMotionValue(0)

  // Natural image dimensions and computed layout
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 })
  const [layout, setLayout] = useState(null)

  // Springs - disable animation if user prefers reduced motion
  const springConfig = prefersReducedMotion
    ? { stiffness: 500, damping: 50 }
    : { stiffness: 120, damping: 16 }
  const springX = useSpring(motionX, springConfig)
  const springY = useSpring(motionY, springConfig)
  const translateXPx = useTransform(springX, (value) => `${value}px`)
  const translateYPx = useTransform(springY, (value) => `${value}px`)
  const backdropTranslateX = useTransform(springX, (value) => value * 0.25)
  const backdropTranslateY = useTransform(springY, (value) => value * 0.25)

  const manejarPointerMove = useCallback(
    (evento) => {
      // Skip parallax if user prefers reduced motion
      if (prefersReducedMotion) return

      const rect = contenedorRef.current?.getBoundingClientRect()
      if (!rect) return
      const offsetRelX = (evento.clientX - rect.left) / rect.width - 0.5
      const offsetRelY = (evento.clientY - rect.top) / rect.height - 0.5
      motionX.set(-offsetRelX * intensity)
      motionY.set(-offsetRelY * intensity)
    },
    [intensity, motionX, motionY, prefersReducedMotion],
  )

  const manejarPointerLeave = useCallback(() => {
    motionX.set(0)
    motionY.set(0)
  }, [motionX, motionY])

  const applyLayout = useCallback(
    (size = naturalSize) => {
      const container = contenedorRef.current
      if (!container || !size.width || !size.height) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      // Usar Math.max para 'cover' (llena toda la pantalla, puede recortar)
      // Usar Math.min para 'contain' (muestra toda la imagen, puede dejar espacios)
      const scaleFunc = objectFit === 'cover' ? Math.max : Math.min
      const scale = scaleFunc(
        (containerWidth * overfill) / size.width,
        (containerHeight * overfill) / size.height,
      )

      const visibleWidth = size.width * scale
      const visibleHeight = size.height * scale

      setLayout({
        offsetX: (containerWidth - visibleWidth) / 2,
        offsetY: (containerHeight - visibleHeight) / 2,
        width: visibleWidth,
        height: visibleHeight,
        containerWidth,
        containerHeight,
      })
    },
    [naturalSize, overfill, objectFit],
  )

  useLayoutEffect(() => {
    const scheduleUpdate = () => requestAnimationFrame(() => applyLayout())
    scheduleUpdate()

    const ResizeObserverImpl = typeof window !== 'undefined' ? window.ResizeObserver : undefined
    const observador =
      ResizeObserverImpl && contenedorRef.current
        ? new ResizeObserverImpl(scheduleUpdate)
        : null

    observador?.observe(contenedorRef.current)
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      observador?.disconnect()
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [applyLayout])

  const valueContexto = useMemo(
    () => ({ motionX: springX, motionY: springY, layout }),
    [springX, springY, layout],
  )

  const hayImagen = typeof imageSrc === 'string' && imageSrc.length > 0
  const shouldRenderBackdrop = hayImagen && !blurredBackground

  const clasesPosicion =
    contentPosition === 'top-left'
      ? 'items-start justify-start'
      : contentPosition === 'top-center'
        ? 'items-start justify-center'
        : 'items-center justify-center'

  return (
    <MapParallaxContext.Provider value={valueContexto}>
      <div
        ref={contenedorRef}
        onPointerMove={manejarPointerMove}
        onPointerLeave={manejarPointerLeave}
        className={clsx(
          'relative flex h-full w-full isolate',
          clasesPosicion,
          frame ? 'overflow-hidden rounded-[2.5rem]' : 'overflow-visible',
          !hayImagen && 'bg-[#f9fafc]',
          className,
        )}
      >
        {/* Backdrop original con parallax (modo clásico) */}
        {shouldRenderBackdrop && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 w-[200vw] -translate-x-1/2 transform-gpu"
              style={{
                translateX: backdropTranslateX,
                translateY: backdropTranslateY,
                height: '200vh',
                backgroundImage: backdropGradient,
                backgroundSize: 'cover',
              }}
            />
            <motion.img
              src={imageSrc}
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
              style={{
                translateX: backdropTranslateX,
                translateY: backdropTranslateY,
                width: '200vw',
                height: '200vh',
                filter: `blur(${backdropBlur}px) saturate(1.25) brightness(1.05)`,
                opacity: 0.9,
              }}
            />
          </div>
        )}

        {/* Imagen de fondo con blur fija (nuevo modo) */}
        {blurredBackground && hayImagen && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <img
              src={imageSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              style={{
                filter: `blur(${blurAmount}px)`,
              }}
            />
          </div>
        )}

        {/* Fondo sólido cuando no hay imagen */}
        {!hayImagen && (
          <div className="pointer-events-none absolute inset-0 bg-[#f9fafc]" />
        )}

        {/* FRAME: coincide EXACTO con la imagen visible y SE MUEVE junto a ella */}
        {hayImagen && layout && (
          <motion.div
            className="absolute"
            style={{
              left: `${layout.offsetX}px`,
              top: `${layout.offsetY}px`,
              width: `${layout.width}px`,
              height: `${layout.height}px`,
              translateX: translateXPx,
              translateY: translateYPx,
            }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              onLoad={(e) => {
                const nextSize = {
                  width: e.currentTarget.naturalWidth,
                  height: e.currentTarget.naturalHeight,
                }
                setNaturalSize(nextSize)
                requestAnimationFrame(() => applyLayout(nextSize))
              }}
              onError={(e) => {
                console.error('❌ InteractiveMap - Image failed to load:', imageSrc, e)
              }}
              className="pointer-events-none h-full w-full object-contain object-center"
              loading="lazy"
            />
            {/* Los hijos (marcadores) quedan posicionados RELATIVOS a este marco */}
            {children}
          </motion.div>
        )}

        {/* Carga inicial: montamos la imagen oculta para obtener naturalSize y disparar layout una sola vez */}
        {hayImagen && !layout && (
          <img
            src={imageSrc}
            alt={imageAlt}
            onLoad={(e) => {
              const nextSize = {
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              }
              setNaturalSize(nextSize)
              requestAnimationFrame(() => applyLayout(nextSize))
            }}
            onError={(e) => {
              console.error('❌ InteractiveMap - Initial hidden image failed to load:', imageSrc, e)
            }}
            className="invisible h-0 w-0"
            aria-hidden
          />
        )}
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
  factor = 0, // por defecto ANCLADO al marco/imagen
  pulsate = false,
  children,
}) {
  const { translateX, translateY } = useParallaxTransforms(factor)
  const { left: leftResuelto, top: topResuelto } = useMapCoordinates(left, top)
  const [isHovered, setIsHovered] = useState(false)

  const colorBase =
    tone === 'danger'
      ? 'bg-red-500 hover:bg-red-600'
      : tone === 'primary'
        ? 'bg-sky-500 hover:bg-sky-600'
        : 'bg-neutral-500 hover:bg-neutral-600'

  return (
    <motion.button
      type="button"
      onClick={(evento) => {
        if (onClick) {
          evento.preventDefault()
          evento.stopPropagation()
          onClick(evento)
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        left: leftResuelto,
        top: topResuelto,
        translateX,
        translateY,
      }}
      className={clsx(
        'group absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-2 border-white shadow-lg outline-none transition focus-visible:ring-2 focus-visible:ring-token-primary',
      )}
    >
      <div className="relative h-full w-full">
        <span
          className={clsx(
            'pointer-events-auto block h-full w-full rounded-full transition',
            colorBase,
            pulsate && 'animate-[pulse-soft_2.5s_ease-in-out_infinite]',
          )}
        />
        <SmartTooltip text={label} isVisible={isHovered} />
      </div>
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
  factor = 0.2, // por defecto leve "flotado" sobre el marco
  pulsate = true,
  active = true,
  iconPadding = 'p-1.5', // padding personalizable por ícono
  backgroundShape = 'circle', // forma del fondo: 'circle', 'square', 'diamond', 'triangle'
  backgroundColor, // color de fondo personalizado para el ShapeBackground
}) {
  const { translateX, translateY } = useParallaxTransforms(factor)
  const { left: leftResuelto, top: topResuelto } = useMapCoordinates(left, top)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={(evento) => {
        if (onClick) {
          evento.preventDefault()
          evento.stopPropagation()
          onClick(evento)
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        left: leftResuelto,
        top: topResuelto,
        translateX,
        translateY,
      }}
      className="group absolute -translate-x-1/2 -translate-y-1/2 transform"
      animate={{
        opacity: active ? 1 : 0.3,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      <div className="relative">
        <ShapeBackground
          shape={backgroundShape}
          iconPadding={iconPadding}
          pulsate={pulsate}
          active={active}
          backgroundColor={backgroundColor}
        >
          <img
            src={iconSrc}
            alt={iconAlt}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </ShapeBackground>
        <SmartTooltip text={label} isVisible={isHovered} />
      </div>
    </motion.button>
  )
}

export function MapDecoration({
  left,
  top,
  imageSrc,
  imageAlt,
  factor = 0.1,
  widthClass = 'w-28',
  className,
}) {
  const { translateX, translateY } = useParallaxTransforms(factor)
  const { left: leftResuelto, top: topResuelto } = useMapCoordinates(left, top)

  return (
    <motion.div
      style={{ left: leftResuelto, top: topResuelto, translateX, translateY }}
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










