import { Link } from 'react-router-dom'

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
      <div className="nav-right ml-auto flex items-center navbar-links">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={isLandingPage ? '' : '!text-white'}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
