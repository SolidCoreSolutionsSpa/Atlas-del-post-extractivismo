import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'

/**
 * Navigation arrows component for navigating between elements in the same scene
 *
 * @param {Object} props
 * @param {string} props.currentElementId - ID of the current element
 * @param {Array} props.sceneElements - Array of all elements in the current scene
 * @param {string} props.className - Additional CSS classes (optional)
 */
export function NavigationArrows({
  currentElementId,
  sceneElements = [],
  className = '',
}) {
  const zoomNavigate = useZoomNavigation()

  if (!sceneElements || sceneElements.length <= 1) {
    return null
  }

  const currentIndex = sceneElements.findIndex(
    (element) => element.id === currentElementId,
  )

  if (currentIndex === -1) {
    return null
  }

  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < sceneElements.length - 1

  const previousElement = hasPrevious ? sceneElements[currentIndex - 1] : null
  const nextElement = hasNext ? sceneElements[currentIndex + 1] : null

  const handleNavigate = (elementId, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
    zoomNavigate(`/elementos/${elementId}`, { origin })
  }

  return (
    <>
      {/* Left Arrow - pegada al borde izquierdo */}
      <button
        type="button"
        onClick={(event) => previousElement && handleNavigate(previousElement.id, event)}
        disabled={!hasPrevious}
        className="navigation-arrow navigation-arrow-left"
        aria-label={hasPrevious ? `Ir a ${previousElement?.name}` : 'No hay elemento anterior'}
        title={hasPrevious ? previousElement?.name : 'No hay elemento anterior'}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="navigation-arrow-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Right Arrow - pegada al borde derecho */}
      <button
        type="button"
        onClick={(event) => nextElement && handleNavigate(nextElement.id, event)}
        disabled={!hasNext}
        className="navigation-arrow navigation-arrow-right"
        aria-label={hasNext ? `Ir a ${nextElement?.name}` : 'No hay elemento siguiente'}
        title={hasNext ? nextElement?.name : 'No hay elemento siguiente'}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="navigation-arrow-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </>
  )
}
