// Position: numeric → percentage string
export function mapPosition (positionLeft, positionTop) {
  return {
    left: `${positionLeft || 0}%`,
    top: `${positionTop || 0}%`
  }
}

// Case Study fields
export function mapCaseStudyFields (raw) {
  return {
    id: raw.id,
    title: raw.title,
    summary: raw.summary,
    image_path: raw.image_path, // Keep underscore for now (used by query layer)
    position_left: raw.position_left,
    position_top: raw.position_top,
    color: raw.color,
    is_published: raw.is_published,
  }
}

// Decoration fields
export function mapDecorationFields (raw, sceneAffectationType) {
  return {
    id: raw.id,
    image: raw.image_path,
    position: mapPosition(raw.position_left, raw.position_top),
    widthVw: raw.widthVw || 9, // Default 9vw if not specified
    alt: raw.alt || '',
    type: sceneAffectationType || null,
    tooltip: raw.tooltip || ''
  }
}

// Zone fields
export function mapZoneFields (raw) {
  return {
    id: raw.id,
    title: raw.title,
    image: raw.image_path, // ← Transform here
    position: mapPosition(raw.position_left, raw.position_top)
    // decorations removed - now handled at scene level
  }
}

// Scene fields
export function mapSceneFields (raw) {
  return {
    id: raw.id,
    title: raw.title,
    image: raw.image_path, // ← Transform
    position: mapPosition(raw.position_left, raw.position_top),
  }
}

// Element fields
export function mapElementFields (raw) {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    source: raw.source,
    image: raw.image_path, // ← Transform
    position: mapPosition(raw.position_left, raw.position_top),
    affectationType: raw.affectation_type?.name || null,
    tags: raw.keywords?.map(kw => kw.name) || [] // Extract names
  }
}
