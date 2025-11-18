import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { usePrefersReducedMotion } from '../design/hooks/usePrefersReducedMotion'
import { TransitionProvider } from '../hooks/useZoomNavigation.jsx'
import { useTheme } from '../hooks/useTheme'
import { useOrientation } from '../hooks/useOrientation'
import { OrientationModal } from '../ui/OrientationModal'
import { Navbar } from '../ui/Navbar'

const navPlaceholders = [
  { label: 'Sobre el proyecto' },
  { label: 'Colabora al atlas' },
  { label: 'Glosario' },
]

export function RootLayout({ children, isAppReady = true }) {
  usePrefersReducedMotion()
  const { theme } = useTheme()
  const { isPortrait, isLandscape, isMobile } = useOrientation()
  const location = useLocation()
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const isLandingPage = location.pathname === '/'
  const logoSrc = isLandingPage ? '/img/LOGONEGRO.png' : '/img/LOGOBLANCO.png'

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
        isLandingPage={isLandingPage}
      />

      <TransitionProvider>
        <main className="min-h-screen">
          <OutletFallback isAppReady={isAppReady}>{children}</OutletFallback>
        </main>
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

function OutletFallback({ children, isAppReady }) {
  if (children) {
    return children
  }

  return <Outlet />
}
