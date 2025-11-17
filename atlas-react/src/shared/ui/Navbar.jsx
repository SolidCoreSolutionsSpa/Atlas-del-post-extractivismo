import React from 'react'
import { Link } from 'react-router-dom'

import { useFullscreen } from '../hooks/useFullscreen'

const DEFAULT_NAV_ITEMS = [
  { label: 'Sobre el proyecto' },
  { label: 'Colabora al atlas' },
  { label: 'Glosario' },
]

/**
 * Navbar component with responsive design
 * Scales appropriately across all screen sizes
 *
 * @param {Object} props
 * @param {string} props.logoSrc - Source URL for the logo image
 * @param {Array} props.navItems - Navigation items with label property
 * @param {boolean} props.isLandingPage - Whether this is the landing page (affects text color)
 * @param {string} props.className - Additional CSS classes
 */
export function Navbar({
  logoSrc,
  navItems = DEFAULT_NAV_ITEMS,
  isLandingPage = false,
  className = '',
}) {
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen()

  return (
    <nav id="navbar" className={className}>
      <div className="nav-left">
        <Link to="/">
          <img
            src={logoSrc}
            alt="Atlas del Post-Extractivismo"
            className="navbar-logo"
          />
        </Link>
      </div>
      <div className="nav-right ml-auto flex items-center navbar-links gap-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={isLandingPage ? '' : '!text-white'}
          >
            {item.label}
          </a>
        ))}

        {/* Botón de pantalla completa */}
        {isSupported && (
          <button
            onClick={toggleFullscreen}
            className={`fullscreen-button p-2 rounded-lg transition-all hover:bg-black/10 ${
              isLandingPage ? 'text-black' : 'text-white'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? (
              // Ícono de salir de pantalla completa
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              // Ícono de entrar en pantalla completa
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </nav>
  )
}
