import { useEffect, useState } from 'react'

export function ViewportDebug() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [mediaQueries, setMediaQueries] = useState({
    mq320: false,
    mq375: false,
    mq425: false,
  })

  useEffect(() => {
    // Actualizar dimensiones del viewport
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Detectar si las media queries están matcheando
    const mq320 = window.matchMedia('(orientation: landscape) and (max-height: 320px)')
    const mq375 = window.matchMedia(
      '(orientation: landscape) and (min-height: 321px) and (max-height: 375px)',
    )
    const mq425 = window.matchMedia(
      '(orientation: landscape) and (min-height: 376px) and (max-height: 425px)',
    )

    const updateMediaQueries = () => {
      setMediaQueries({
        mq320: mq320.matches,
        mq375: mq375.matches,
        mq425: mq425.matches,
      })

      // Console log para debugging adicional
      console.log('📱 VIEWPORT DEBUG:', {
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        mediaQueries: {
          '320px': mq320.matches,
          '375px': mq375.matches,
          '425px': mq425.matches,
        }
      })
    }

    // Inicializar
    updateViewport()
    updateMediaQueries()

    // Escuchar cambios
    window.addEventListener('resize', updateViewport)
    window.addEventListener('resize', updateMediaQueries)
    mq320.addEventListener('change', updateMediaQueries)
    mq375.addEventListener('change', updateMediaQueries)
    mq425.addEventListener('change', updateMediaQueries)

    return () => {
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('resize', updateMediaQueries)
      mq320.removeEventListener('change', updateMediaQueries)
      mq375.removeEventListener('change', updateMediaQueries)
      mq425.removeEventListener('change', updateMediaQueries)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: '#00ff00',
        padding: '12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '11px',
        zIndex: 9999,
        lineHeight: '1.6',
        minWidth: '220px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffff00' }}>
        🐛 VIEWPORT DEBUG
      </div>
      <div>
        <strong>Width:</strong> {viewport.width}px
      </div>
      <div>
        <strong>Height:</strong> {viewport.height}px
      </div>
      <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
        <strong>Media Queries:</strong>
      </div>
      <div style={{ color: mediaQueries.mq320 ? '#00ff00' : '#ff0000' }}>
        320px: {mediaQueries.mq320 ? '✓ ACTIVA' : '✗ inactiva'}
      </div>
      <div style={{ color: mediaQueries.mq375 ? '#00ff00' : '#ff0000' }}>
        375px: {mediaQueries.mq375 ? '✓ ACTIVA' : '✗ inactiva'}
      </div>
      <div style={{ color: mediaQueries.mq425 ? '#00ff00' : '#ff0000' }}>
        425px: {mediaQueries.mq425 ? '✓ ACTIVA' : '✗ inactiva'}
      </div>
    </div>
  )
}
