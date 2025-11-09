import { Link, Outlet, useLocation } from 'react-router-dom'

import { usePrefersReducedMotion } from '../design/hooks/usePrefersReducedMotion'
import { TransitionProvider } from '../hooks/useZoomNavigation.jsx'
import { useTheme } from '../hooks/useTheme'
import { useOrientation } from '../hooks/useOrientation'
import { OrientationModal } from '../ui/OrientationModal'

const navPlaceholders = [
  { label: 'Sobre el proyecto' },
  { label: 'Colabora al atlas' },
  { label: 'Glosario' },
]

export function RootLayout({ children }) {
  usePrefersReducedMotion()
  const { theme } = useTheme()
  const { isPortrait, isMobile } = useOrientation()
  const location = useLocation()

  const isLandingPage = location.pathname === '/'
  const logoSrc = isLandingPage ? '/img/LOGONEGRO.png' : '/img/LOGOBLANCO.png'
  const shouldShowOrientationModal = isMobile && isPortrait

  return (
    <div className="min-h-screen bg-[#f9fafc] text-token-body">
      <nav id="navbar">
        <div className="nav-left">
          <Link to="/">
            <img src={logoSrc} alt="Atlas del Post-Extractivismo" className="h-8" />
          </Link>
        </div>
        <div className="nav-right ml-auto flex items-center gap-[30px]">
          {navPlaceholders.map((item) => (
            <a key={item.label} href="#">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <TransitionProvider>
        <main className="min-h-screen">
          <OutletFallback>{children}</OutletFallback>
        </main>
      </TransitionProvider>

      {/* Modal de orientación para dispositivos móviles */}
      <OrientationModal isOpen={shouldShowOrientationModal} />
    </div>
  )
}

function OutletFallback({ children }) {
  if (children) {
    return children
  }

  return <Outlet />
}
