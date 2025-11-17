import React from 'react'
import { NavigationArrow } from './NavigationArrow'

/**
 * Navigation arrows container component for navigating between elements in the same scene
 * Uses the reusable NavigationArrow component
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

  return (
    <>
      {/* Left/Previous Arrow - pegada al borde izquierdo */}
      <NavigationArrow
        direction="previous"
        targetElement={previousElement}
        className={className}
      />

      {/* Right/Next Arrow - pegada al borde derecho */}
      <NavigationArrow
        direction="next"
        targetElement={nextElement}
        className={className}
      />
    </>
  )
}
