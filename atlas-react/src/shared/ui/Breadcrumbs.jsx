import clsx from 'clsx'

import { useZoomNavigation } from '../hooks/useZoomNavigation.jsx'

export function Breadcrumbs({ items, className }) {
  const zoomNavigate = useZoomNavigation()

  if (!items?.length) {
    return null
  }

  return (
    <nav
      className={clsx(
        'breadcrumb-nav inline-flex items-center rounded-xl bg-white/20 shadow-[0_2px_6px_rgba(0,0,0,0.1)] backdrop-blur-sm dark:bg-[rgba(20,20,40,0.3)] dark:text-white',
        'font-normal',
        className,
      )}
      style={{
        fontFamily: 'Inter, sans-serif',
        // Fluid scaling: scales proportionally from 320px to 1024px viewport width
        // Minimal padding to keep breadcrumb compact and close to navbar
        fontSize: 'clamp(0.28rem, 0.88vw, 0.9rem)',
        paddingLeft: 'clamp(0.234rem, 1.17vw, 0.75rem)',
        paddingRight: 'clamp(0.234rem, 1.17vw, 0.75rem)',
        // Reduced vertical padding to minimize container height
        paddingTop: 'clamp(0.125rem, 0.4vw, 0.375rem)',
        paddingBottom: 'clamp(0.125rem, 0.4vw, 0.375rem)',
        gap: 'clamp(0.117rem, 0.585vw, 0.375rem)',
        // Removed marginTop - positioning is now controlled by breadcrumb-responsive-top class
      }}
    >
      {items.map((item, index) => (
        <BreadcrumbItem
          key={item.label}
          {...item}
          isLast={index === items.length - 1}
          zoomNavigate={zoomNavigate}
        />
      ))}
    </nav>
  )
}

function BreadcrumbItem({ label, to, isLast, zoomNavigate }) {
  if (!to) {
    return (
      <>
        <span className="text-[#222] dark:text-white dark:font-medium">{label}</span>
        {!isLast ? <span className="text-[#6f6f6f] dark:text-[#e9e9e9]">&gt;</span> : null}
      </>
    )
  }

  const handleClick = (event) => {
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
    zoomNavigate(to, { origin, animation: 'animar-zoom-out' })
  }

  return (
    <>
      <a
        href={to}
        onClick={handleClick}
        className="cursor-pointer text-[#6f6f6f] no-underline hover:underline dark:text-[#e9e9e9]"
      >
        {label}
      </a>
      {!isLast ? <span className="text-[#6f6f6f] dark:text-[#e9e9e9]">&gt;</span> : null}
    </>
  )
}
