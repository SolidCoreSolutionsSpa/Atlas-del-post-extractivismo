import { Link, NavLink } from 'react-router-dom'

const DEFAULT_NAV_ITEMS = [
  { label: 'Sobre el proyecto', path: '/sobre-el-proyecto' },
  { label: 'Colabora al atlas', path: '/colabora' },
  { label: 'Glosario', path: '/glosario' },
]

/**
 * Navbar component with responsive design
 * Scales appropriately across all screen sizes
 *
 * @param {Object} props
 * @param {string} props.logoSrc - Source URL for the logo image
 * @param {Array} props.navItems - Navigation items with label property
 * @param {boolean} props.isLightNav - Whether the navbar should render with dark text/logo
 * @param {string} props.className - Additional CSS classes
 */
export function Navbar({
  logoSrc,
  navItems = DEFAULT_NAV_ITEMS,
  isLightNav = false,
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
          <NavLink
            key={item.label}
            to={item.path ?? '#'}
            className={isLightNav ? '' : '!text-white'}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
