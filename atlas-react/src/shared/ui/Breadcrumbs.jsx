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
        'inline-flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-1 rounded-full bg-white/85 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-token-muted shadow-md backdrop-blur-sm leading-none sm:flex-nowrap sm:gap-1.5 sm:px-4 sm:py-2 sm:text-[0.7rem] sm:tracking-[0.22em] md:px-4 md:py-2.5 md:text-[0.75rem] lg:gap-2 lg:px-5 lg:py-3 lg:text-xs lg:tracking-[0.28em]',
        className,
      )}
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
        <span className="text-token-primary">{label}</span>
        {!isLast ? <span className="text-token-muted">/</span> : null}
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
        className="cursor-pointer transition hover:text-token-primary-strong"
      >
        {label}
      </a>
      {!isLast ? <span className="text-token-muted">/</span> : null}
    </>
  )
}
