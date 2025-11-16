/**
 * Responsive info button component
 * Displays a circular button with an info icon that scales based on viewport height
 *
 * @param {Object} props
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.ariaLabel - Accessibility label for screen readers
 * @param {string} props.title - Tooltip text on hover
 * @param {string} props.className - Additional CSS classes (optional)
 *
 * @example
 * <InfoButton
 *   onClick={() => setIsModalOpen(true)}
 *   ariaLabel="Ver descripción de la escena"
 *   title="Ver descripción"
 * />
 */
export function InfoButton({
  onClick,
  ariaLabel = 'Ver información',
  title = 'Ver información',
  className = '',
}) {
  return (
    <button
      onClick={onClick}
      className={`info-button-responsive absolute flex items-center justify-center rounded-full bg-[rgba(20,20,40,0.3)] text-white shadow-lg backdrop-blur-sm transition hover:bg-[rgba(20,20,40,0.5)] hover:scale-110 hover:shadow-xl ${className}`}
      aria-label={ariaLabel}
      title={title}
    >
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  )
}
