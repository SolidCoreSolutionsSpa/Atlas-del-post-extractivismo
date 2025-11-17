import React from 'react'
import { useZoomNavigation } from '../../shared/hooks/useZoomNavigation.jsx'

/**
 * Individual navigation arrow component - Reusable
 *
 * @param {Object} props
 * @param {'previous' | 'next'} props.direction - Direction of navigation (previous = left, next = right)
 * @param {Object} props.targetElement - Target element to navigate to (must have id and name properties)
 * @param {Function} props.onClick - Optional custom click handler
 * @param {string} props.className - Additional CSS classes (optional)
 * @param {boolean} props.disabled - Whether the arrow is disabled
 *
 * @example
 * // Previous/Left arrow
 * <NavigationArrow
 *   direction="previous"
 *   targetElement={previousElement}
 * />
 *
 * @example
 * // Next/Right arrow
 * <NavigationArrow
 *   direction="next"
 *   targetElement={nextElement}
 * />
 */
export function NavigationArrow({
  direction = 'next',
  targetElement = null,
  onClick = null,
  className = '',
  disabled = false,
}) {
  const zoomNavigate = useZoomNavigation()

  const isDisabled = disabled || !targetElement

  const handleClick = (event) => {
    if (isDisabled || !targetElement) return

    if (onClick) {
      onClick(event, targetElement)
    } else {
      // Default navigation behavior
      const rect = event.currentTarget.getBoundingClientRect()
      const origin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
      zoomNavigate(`/elementos/${targetElement.id}`, { origin })
    }
  }

  const isPrevious = direction === 'previous'
  const arrowClass = isPrevious ? 'navigation-arrow-left' : 'navigation-arrow-right'
  const arrowPath = isPrevious ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'
  const ariaLabel = isDisabled
    ? `No hay elemento ${isPrevious ? 'anterior' : 'siguiente'}`
    : `Ir a ${targetElement?.name}`

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`navigation-arrow ${arrowClass} ${className}`}
      aria-label={ariaLabel}
      title={isDisabled ? ariaLabel : targetElement?.name}
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
          d={arrowPath}
        />
      </svg>
    </button>
  )
}
