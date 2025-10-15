import { useZoomNavigation } from '../hooks/useZoomNavigation'

export function Breadcrumbs({ items, className }) {
  const zoomNavigate = useZoomNavigation()

  if (!items?.length) {
    return null
  }

  return (
    <nav
      className={[
        'inline-flex flex-wrap items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-xs font-medium uppercase tracking-[0.3em] text-token-muted shadow-lg backdrop-blur',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
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
