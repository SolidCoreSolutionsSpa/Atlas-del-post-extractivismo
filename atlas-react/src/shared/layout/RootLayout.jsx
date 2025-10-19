import { Link, Outlet } from 'react-router-dom'

import { usePrefersReducedMotion } from '../design/hooks/usePrefersReducedMotion'
import { TransitionProvider } from '../hooks/useZoomNavigation.jsx'

const navPlaceholders = [
  { label: 'Sobre el proyecto' },
  { label: 'Colabora al atlas' },
  { label: 'Glosario' },
]

export function RootLayout({ children }) {
  usePrefersReducedMotion()

  return (
    <div className="min-h-screen bg-white text-token-body">
      <nav id="navbar">
        <div className="nav-left">
          <Link to="/">LOGO</Link>
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
    </div>
  )
}

function OutletFallback({ children }) {
  if (children) {
    return children
  }

  return <Outlet />
}
