import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

import { usePrefersReducedMotion } from '../design/hooks/usePrefersReducedMotion'
import { TransitionProvider, usePageTransition } from '../hooks/useZoomNavigation.jsx'
import { useOrientation } from '../hooks/useOrientation'
import { OrientationModal } from '../ui/OrientationModal'
import { Navbar } from '../ui/Navbar'
import { Loader } from '../ui/Loader'

const navPlaceholders = [
  { label: 'Sobre el proyecto', path: '/sobre-el-proyecto' },
  { label: 'Colabora al atlas', path: '/colabora' },
  { label: 'Glosario', path: '/glosario' },
]

const lightNavbarPaths = new Set([
  '/',
  '/sobre-el-proyecto',
  '/colabora',
  '/glosario',
])

const scrollablePaths = new Set([
  '/sobre-el-proyecto',
  '/colabora',
  '/glosario',
])

const autoHideNavPaths = scrollablePaths

export function RootLayout({ children }) {
  usePrefersReducedMotion()
  const { isPortrait, isLandscape, isMobile } = useOrientation()
  const location = useLocation()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isNavHidden, setIsNavHidden] = useState(false)

  // Detectar cambios en el estado de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const isLightNavbar = lightNavbarPaths.has(location.pathname)
  const isScrollablePage = scrollablePaths.has(location.pathname)
  const shouldAutoHideNav = autoHideNavPaths.has(location.pathname)
  const logoSrc = isLightNavbar ? '/img/LOGONEGRO.png' : '/img/LOGOBLANCO.png'

  // Reset nav visibility when changing to pages without auto-hide
  useEffect(() => {
    if (!shouldAutoHideNav) {
      setIsNavHidden(false)
    }
  }, [shouldAutoHideNav])

  // Mostrar modal si es móvil Y (está en portrait O está en landscape sin fullscreen)
  const shouldShowOrientationModal = isMobile && (isPortrait || (isLandscape && !isFullscreen))

  return (
    <div
      className="min-h-screen text-token-body"
      style={{
        // Imagen de fondo global que siempre está cargada
        backgroundImage: 'url(/img/fondo.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar
        logoSrc={logoSrc}
        navItems={navPlaceholders}
        isLightNav={isLightNavbar}
        className={`transition-all duration-300 ${
          isNavHidden ? '-translate-y-16 opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <TransitionProvider>
        <RootLayoutContent
          isScrollablePage={isScrollablePage}
          shouldAutoHideNav={shouldAutoHideNav}
          onNavVisibilityChange={setIsNavHidden}
        >
          {children}
        </RootLayoutContent>
      </TransitionProvider>

      {/* Modal de orientación para dispositivos móviles */}
      <OrientationModal
        isOpen={shouldShowOrientationModal}
        isPortrait={isPortrait}
        isLandscape={isLandscape}
      />
    </div>
  )
}

function RootLayoutContent({
  children,
  isScrollablePage,
  shouldAutoHideNav,
  onNavVisibilityChange,
}) {
  const transition = usePageTransition()
  const mainRef = useRef(null)

  // Auto-hide navbar on scroll for selected pages
  useEffect(() => {
    const node = mainRef.current
    if (!shouldAutoHideNav || !node) {
      onNavVisibilityChange?.(false)
      return undefined
    }

    const handleScroll = () => {
      const isAtTop = node.scrollTop <= 0
      onNavVisibilityChange?.(!isAtTop)
    }

    handleScroll()
    node.addEventListener('scroll', handleScroll)
    return () => node.removeEventListener('scroll', handleScroll)
  }, [shouldAutoHideNav, onNavVisibilityChange])

  return (
    <>
      {/* Loader que se muestra durante las transiciones */}
      <Loader isLoading={transition.isNavigating} />

      <main
        ref={mainRef}
        className={`min-h-screen ${
          isScrollablePage ? 'h-screen overflow-y-auto' : 'overflow-hidden'
        }`}
      >
        <OutletFallback>{children}</OutletFallback>
      </main>
    </>
  )
}

function OutletFallback({ children }) {
  if (children) {
    return children
  }

  return <Outlet />
}
