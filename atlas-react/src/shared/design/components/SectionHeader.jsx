import React from 'react'
export function SectionHeader({ eyebrow, title, description }) {
  return (
    <header className="flex flex-col gap-2">
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-wide text-token-muted">
          {eyebrow}
        </span>
      ) : null}
      <h1 className="text-3xl font-semibold text-token-primary sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-prose text-base text-token-body sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  )
}
