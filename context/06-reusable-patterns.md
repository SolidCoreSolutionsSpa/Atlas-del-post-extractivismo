# Patrones de Código Reutilizable - Atlas del Post-extractivismo

> Este documento documenta los **3 patrones principales** para crear código reutilizable en este proyecto, con ejemplos reales y casos de uso concretos.

## 📌 Los 3 Pilares de la Reutilización

```
┌─────────────────────────────────────────────────────┐
│  CÓDIGO REUTILIZABLE EN ATLAS DEL POST-EXTRACTIVISMO │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1️⃣  COMPOUND COMPONENTS                           │
│      Componentes que colaboran compartiendo estado │
│      Ej: <InteractiveMap> + <MapMarker>            │
│                                                     │
│  2️⃣  CUSTOM HOOKS                                  │
│      Lógica compleja extraída → reutilizable       │
│      Ej: useParallax(), useZoomNavigation()        │
│                                                     │
│  3️⃣  RENDER PROPS / CHILDREN AS FUNCTION          │
│      Flexibilidad total en contenido renderizado   │
│      Ej: <SceneRenderer>{(scene) => ...}</...>    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 1️⃣ COMPOUND COMPONENTS

### ¿Qué son?

Componentes que **trabajan en conjunto** compartiendo estado y contexto. El padre no es una "caja negra" con cientos de props, sino que permite que componentes hijo colaboren.

### ¿Por qué?

- **Flexibilidad**: El consumidor decide el orden y número de hijos
- **API clara**: Props solo en el nivel necesario
- **Escalable**: Agregar nuevos hijos no requiere cambiar el padre

### Ejemplo del Proyecto: `<InteractiveMap>`

**ANTES (Monolítico - No Reutilizable):**
```javascript
// ❌ Difícil de usar, prop drilling masivo, no flexible
<CompleteMap
  backgroundImage={img}
  markers={[{id, left, top, label}]}
  decorations={[{id, image, left, top}]}
  onMarkerClick={(id) => {}}
  parallaxIntensity={20}
  showLabels={true}
  filterCategories={[]}
  // ... 15 props más
/>
```

**AHORA (Compound Components - Reutilizable):**
```javascript
// ✅ Claro, flexible, fácil de extender
<InteractiveMap backgroundImage={img} parallaxIntensity={20}>
  {/* Los hijos deciden qué renderizar */}
  <MapMarker id="zona-1" position={{left: 50, top: 30}} label="Puerto Punta" />
  <MapMarker id="zona-2" position={{left: 70, top: 50}} label="Tranque Mauro" />

  <MapDecoration image={deco1} position={{left: 20, top: 40}} />
  <MapDecoration image={deco2} position={{left: 80, top: 20}} />

  <MapFilter categories={['biotic', 'anthropic']} />
</InteractiveMap>
```

### Cómo Funciona

**1. El Padre Crea Contexto:**
```javascript
// src/shared/design/components/InteractiveMap/InteractiveMap.jsx

import { createContext, useContext, useState } from 'react'
import { MapParallaxContext } from './MapParallaxContext'

// Contexto que comparten padre + hijos
export const InteractiveMapContext = createContext()

export function InteractiveMap({
  backgroundImage,
  parallaxIntensity = 20,
  children
}) {
  const [selectedMarker, setSelectedMarker] = useState(null)
  const { parallaxX, parallaxY } = useMotionValue(0, 0) // Parallax compartido

  return (
    <InteractiveMapContext.Provider value={{
      selectedMarker,
      setSelectedMarker,
      parallaxX,
      parallaxY,
      parallaxIntensity
    }}>
      <div className="relative w-full h-screen overflow-hidden">
        <BackgroundLayer image={backgroundImage} />

        <div className="relative z-10">
          {children} {/* Los hijos tienen acceso al contexto */}
        </div>
      </div>
    </InteractiveMapContext.Provider>
  )
}
```

**2. Los Hijos Consumen el Contexto:**
```javascript
// src/shared/design/components/InteractiveMap/MapMarker.jsx

import { useContext } from 'react'
import { InteractiveMapContext } from './InteractiveMap'

export function MapMarker({ id, position, label, icon, onClick }) {
  const {
    selectedMarker,
    setSelectedMarker,
    parallaxX,
    parallaxY,
    parallaxIntensity
  } = useContext(InteractiveMapContext)

  const isSelected = selectedMarker === id

  // El marker usa parallax del contexto
  const markerParallaxX = useTransform(parallaxX, x => x * 0.5 * parallaxIntensity)

  return (
    <motion.button
      className={`absolute cursor-pointer transition-all ${
        isSelected ? 'scale-125' : 'hover:scale-110'
      }`}
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        x: markerParallaxX,
        y: markerParallaxY
      }}
      onClick={() => {
        setSelectedMarker(id)
        onClick?.(id)
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Contenido del marker */}
      <div className="relative">
        <PulseRing />
        {icon && <img src={icon} alt={label} />}
      </div>

      {isSelected && (
        <motion.div
          className="absolute bg-white shadow-lg rounded-lg p-2 mt-2 whitespace-nowrap"
          layoutId="markerLabel"
        >
          {label}
        </motion.div>
      )}
    </motion.button>
  )
}
```

**3. Otro Hijo También Usa El Contexto:**
```javascript
// src/shared/design/components/InteractiveMap/MapDecoration.jsx

import { useContext } from 'react'
import { InteractiveMapContext } from './InteractiveMap'

export function MapDecoration({ image, position, parallaxFactor = 0.3 }) {
  const { parallaxX, parallaxY } = useContext(InteractiveMapContext)

  // Decoraciones tienen parallax más suave
  const decorParallaxX = useTransform(parallaxX, x => x * parallaxFactor)
  const decorParallaxY = useTransform(parallaxY, y => y * parallaxFactor)

  return (
    <motion.img
      src={image}
      alt="Map decoration"
      className="absolute pointer-events-none"
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        x: decorParallaxX,
        y: decorParallaxY
      }}
    />
  )
}
```

### Uso Real en el Proyecto

```javascript
// En CaseStudyDetailPage.jsx
export function CaseStudyDetailPage() {
  const { caseId } = useParams()
  const caseStudy = useCaseStudy(caseId)

  return (
    <InteractiveMap
      backgroundImage={caseStudy.detailMap.image}
      parallaxIntensity={20}
    >
      {/* Renderizar todos los hotspots como MapMarker */}
      {caseStudy.detailMap.hotspots.map(hotspot => (
        <MapMarker
          key={hotspot.id}
          id={hotspot.id}
          position={{ left: hotspot.left, top: hotspot.top }}
          label={hotspot.label}
          icon={hotspot.icon}
          onClick={() => navigate(`/zonas/${hotspot.zoneId}`)}
        />
      ))}

      {/* Decoraciones */}
      {caseStudy.detailMap.decorations.map(deco => (
        <MapDecoration
          key={deco.id}
          image={deco.image}
          position={{ left: deco.left, top: deco.top }}
          parallaxFactor={deco.parallaxFactor || 0.3}
        />
      ))}

      {/* Sistema de filtros */}
      <MapFilter
        categories={['biotic', 'anthropic', 'physical']}
        onFilter={(selected) => {}}
      />
    </InteractiveMap>
  )
}
```

### Ventajas de Este Patrón

✅ **Flexible**: Usuario decide qué hijos renderizar y en qué orden
✅ **Reutilizable**: MapMarker se usa en cualquier InteractiveMap
✅ **Escalable**: Agregar MapFilter, MapLabel, etc. sin tocar InteractiveMap
✅ **Testeable**: Cada componente es independiente
✅ **Compositivo**: Puedes anidar maps si quieres

### Cuándo Usar Compound Components

- API compleja con muchas partes relacionadas
- Necesitas flexibilidad en el renderizado
- Los mismos hijos se usan en múltiples padres
- Quieres evitar prop drilling excesivo

---

## 2️⃣ CUSTOM HOOKS

### ¿Qué son?

Funciones JavaScript que **encapsulan lógica reutilizable**. La lógica se extrae del componente y se puede usar en múltiples componentes.

### ¿Por qué?

- **DRY (Don't Repeat Yourself)**: Escribe una vez, usa en todo el proyecto
- **Testeable**: Testa la lógica sin componentes
- **Mantenible**: Cambios en un solo lugar
- **Reutilizable**: Múltiples componentes pueden tener la misma lógica

### Ejemplo 1: `useParallax` - Parallax en Cualquier Componente

**Problema Original:**
```javascript
// ❌ Lógica de parallax duplicada en cada componente

function BackgroundImage() {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100 - 50
    const y = (e.clientY / window.innerHeight) * 100 - 50
    setMouseX(x * 0.3)
    setMouseY(y * 0.3)
  }

  return (
    <div onMouseMove={handleMouseMove}>
      <img style={{ transform: `translate(${mouseX}px, ${mouseY}px)` }} />
    </div>
  )
}

function DecorativeElement() {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100 - 50
    const y = (e.clientY / window.innerHeight) * 100 - 50
    setMouseX(x * 0.2) // Mismo código, mismo bug si hay
    setMouseY(y * 0.2)
  }

  return (
    <div onMouseMove={handleMouseMove}>
      <svg style={{ transform: `translate(${mouseX}px, ${mouseY}px)` }} />
    </div>
  )
}
```

**Solución: Custom Hook**
```javascript
// ✅ src/shared/hooks/useParallax.js

import { useState, useCallback } from 'react'
import { useMotionValue, useTransform, useSpring } from 'framer-motion'

/**
 * Hook que proporciona valores de parallax basados en movimiento del mouse
 * @param {number} intensity - Intensidad del efecto parallax (ej: 20 para 20px)
 * @param {number} stiffness - Rigidez de la spring animation (default: 120)
 * @param {number} damping - Amortiguamiento de spring (default: 16)
 * @returns {Object} - { parallaxX, parallaxY, handleMouseMove }
 */
export function useParallax(intensity = 20, stiffness = 120, damping = 16) {
  const parallaxX = useMotionValue(0)
  const parallaxY = useMotionValue(0)

  // Spring para suavizar movimiento
  const smoothX = useSpring(parallaxX, { stiffness, damping })
  const smoothY = useSpring(parallaxY, { stiffness, damping })

  // Transformar a píxeles reales
  const pixelX = useTransform(smoothX, x => x * intensity)
  const pixelY = useTransform(smoothY, y => y * intensity)

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) - 0.5
    const y = (e.clientY / window.innerHeight) - 0.5

    parallaxX.set(x)
    parallaxY.set(y)
  }, [parallaxX, parallaxY])

  return {
    parallaxX: pixelX,
    parallaxY: pixelY,
    handleMouseMove
  }
}
```

**Uso en Múltiples Componentes:**
```javascript
// ✅ Componente 1: Background Image
function CaseStudyBackground() {
  const { parallaxX, parallaxY, handleMouseMove } = useParallax(25)

  return (
    <div onMouseMove={handleMouseMove} className="relative">
      <motion.img
        src={backgroundImg}
        style={{ x: parallaxX, y: parallaxY }}
      />
    </div>
  )
}

// ✅ Componente 2: Decorative Element (mismo hook, diferente intensidad)
function LandingDecoration() {
  const { parallaxX, parallaxY, handleMouseMove } = useParallax(15)

  return (
    <div onMouseMove={handleMouseMove}>
      <motion.svg
        style={{ x: parallaxX, y: parallaxY }}
      />
    </div>
  )
}

// ✅ Componente 3: Custom
function CustomParallaxElement() {
  const { parallaxX, parallaxY, handleMouseMove } = useParallax(8)

  return (
    <div onMouseMove={handleMouseMove}>
      <motion.div
        style={{
          x: parallaxX,
          y: parallaxY,
          rotateZ: useTransform(parallaxX, x => x * 0.1)
        }}
      />
    </div>
  )
}
```

### Ejemplo 2: `useZoomNavigation` - Transiciones Interactivas

```javascript
// ✅ src/shared/hooks/useZoomNavigation.js

import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'

/**
 * Hook que gestiona transiciones con zoom y navegación
 * Calcula la posición y tamaño de zoom basado en dónde se hizo click
 */
export function useZoomNavigation() {
  const navigate = useNavigate()
  const [zoomOrigin, setZoomOrigin] = useState(null)
  const containerRef = useRef(null)

  const handleElementClick = (elementId, event) => {
    // Obtener posición del click relativa al contenedor
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top
    const percentX = (clickX / rect.width) * 100
    const percentY = (clickY / rect.height) * 100

    // Guardar origen para animar desde ahí
    setZoomOrigin({
      x: percentX,
      y: percentY,
      scale: event.target.getBoundingClientRect().width / rect.width
    })

    // Esperar animación y luego navegar
    setTimeout(() => {
      navigate(`/elemento/${elementId}`)
    }, 300)
  }

  return {
    containerRef,
    handleElementClick,
    zoomOrigin,
    clearZoomOrigin: () => setZoomOrigin(null)
  }
}
```

**Uso:**
```javascript
function ElementGrid() {
  const { containerRef, handleElementClick, zoomOrigin } = useZoomNavigation()
  const elements = useElements()

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-4">
      {elements.map(element => (
        <motion.div
          key={element.id}
          layoutId={`element-${element.id}`}
          onClick={(e) => handleElementClick(element.id, e)}
          initial={{
            opacity: 0.8,
            scale: 1,
          }}
          whileHover={{
            scale: 1.05,
            cursor: 'pointer'
          }}
          whileTap={{
            scale: 0.95
          }}
        >
          <img src={element.image} alt={element.name} />
          <h3>{element.name}</h3>
        </motion.div>
      ))}
    </div>
  )
}
```

### Ejemplo 3: `useFilter` - Sistema de Filtros Reutilizable

```javascript
// ✅ src/shared/hooks/useFilter.js

import { useState, useCallback, useMemo } from 'react'

/**
 * Hook para gestionar filtros dinámicos
 * @param {Array} items - Items a filtrar
 * @param {Object} config - { field: 'category', options: ['biotic', 'anthropic'] }
 */
export function useFilter(items = [], config = {}) {
  const [selectedFilters, setSelectedFilters] = useState({})

  const toggleFilter = useCallback((filterKey, value) => {
    setSelectedFilters(prev => {
      const current = prev[filterKey] || []
      const isSelected = current.includes(value)

      return {
        ...prev,
        [filterKey]: isSelected
          ? current.filter(v => v !== value)
          : [...current, value]
      }
    })
  }, [])

  // Items filtrados basado en criterios
  const filteredItems = useMemo(() => {
    if (Object.keys(selectedFilters).length === 0) return items

    return items.filter(item => {
      return Object.entries(selectedFilters).every(([key, values]) => {
        if (values.length === 0) return true
        return values.includes(item[key])
      })
    })
  }, [items, selectedFilters])

  const clearFilters = useCallback(() => setSelectedFilters({}), [])

  return {
    selectedFilters,
    toggleFilter,
    filteredItems,
    clearFilters,
    hasActiveFilters: Object.keys(selectedFilters).length > 0
  }
}
```

**Uso Múltiple en el Proyecto:**
```javascript
// En Scene Detail - Filtrar elementos por tipo de afectación
function SceneDetail() {
  const scene = useScene()
  const {
    filteredItems: filteredElements,
    toggleFilter,
    selectedFilters
  } = useFilter(scene.elements, { field: 'affectationType' })

  return (
    <>
      <div className="flex gap-2 mb-4">
        {['hábitat', 'reproducción', 'alimentación'].map(type => (
          <button
            key={type}
            onClick={() => toggleFilter('affectationType', type)}
            className={`px-4 py-2 rounded ${
              selectedFilters.affectationType?.includes(type)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredElements.map(element => (
          <ElementCard key={element.id} element={element} />
        ))}
      </div>
    </>
  )
}

// En Zone List - Filtrar por categoría
function ZoneElementGrid() {
  const zone = useZone()
  const {
    filteredItems: filteredElements,
    toggleFilter,
    selectedFilters
  } = useFilter(zone.allElements, { field: 'category' })

  return (
    // Mismo patrón de uso con diferentes datos
    <>
      <FilterButtons
        options={['biotic', 'anthropic']}
        onChange={toggleFilter}
        selected={selectedFilters}
      />
      <ElementGrid elements={filteredElements} />
    </>
  )
}
```

### Patrón Común de Hooks Reutilizables

```javascript
/**
 * Patrón genérico para custom hooks reutilizables:
 *
 * 1. Estado - Los datos que necesita el hook
 * 2. Lógica - Funciones que manipulan el estado
 * 3. Retorno - Exposición clara de lo que ofrece
 */

export function useMyFeature(initialValue, options = {}) {
  // 1️⃣ ESTADO
  const [state, setState] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 2️⃣ LÓGICA
  const handleAction = useCallback(async (value) => {
    setLoading(true)
    try {
      const result = await someAsyncOperation(value)
      setState(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setState(initialValue)
    setError(null)
  }, [initialValue])

  // 3️⃣ RETORNO CLARO
  return {
    // Estado
    state,
    loading,
    error,

    // Acciones
    handleAction,
    reset,

    // Helpers
    isSuccess: state !== null && !error,
    isEmpty: state === initialValue
  }
}
```

### Cuándo Crear un Custom Hook

Crea un hook cuando:
- ✅ La lógica se repite en 2+ componentes
- ✅ La lógica es compleja y merece su propio archivo
- ✅ Quieres testear la lógica independientemente
- ✅ La lógica depende de otros hooks (useState, useEffect, etc.)

NO crees hook cuando:
- ❌ La lógica es trivial (3-4 líneas)
- ❌ Se usa en solo UN componente
- ❌ Es mejor un componente compound
- ❌ La lógica es específica del DOM (usa component en su lugar)

---

## 3️⃣ RENDER PROPS / CHILDREN AS FUNCTION

### ¿Qué es?

Un patrón donde un componente **acepta una función como prop** que decide qué renderizar. La función recibe datos del componente padre.

### ¿Por qué?

- **Control máximo**: El consumidor decide exactamente qué renderizar
- **Reutilizable**: El mismo componente puede renderizar cosas completamente diferentes
- **Composición**: Combinable con hooks y compound components

### Ejemplo 1: Scene Renderer

**Patrón Render Props:**
```javascript
// ✅ src/escenas/ui/SceneRenderer.jsx

export function SceneRenderer({ sceneId, children }) {
  const scene = useScene(sceneId)
  const { parallaxX, parallaxY, handleMouseMove } = useParallax(20)

  if (loading) return <LoadingSpinner />

  // children es una función que recibe scene y parallax
  return (
    <div onMouseMove={handleMouseMove}>
      {children({
        scene,
        parallaxX,
        parallaxY,
        isLoading: loading
      })}
    </div>
  )
}
```

**Uso - Renderizado Customizado:**
```javascript
// ✅ En la página de detalle de escena

export function SceneDetailPage() {
  const { sceneId } = useParams()

  return (
    <SceneRenderer sceneId={sceneId}>
      {({ scene, parallaxX, parallaxY }) => (
        <div className="relative w-full h-screen">
          {/* El consumidor decide exactamente qué renderizar */}
          <motion.div
            style={{
              backgroundImage: `url(${scene.mapImage})`,
              x: parallaxX,
              y: parallaxY
            }}
            className="absolute inset-0 bg-cover"
          />

          <div className="relative z-10">
            <h1>{scene.name}</h1>

            <div className="grid grid-cols-3 gap-4">
              {scene.hotspots.map(hotspot => (
                <SceneElement
                  key={hotspot.id}
                  hotspot={hotspot}
                  onClick={() => navigate(`/elemento/${hotspot.elementId}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </SceneRenderer>
  )
}
```

**Otro Consumidor - Renderizado Diferente:**
```javascript
// ✅ En un modal de preview

export function ScenePreviewModal({ sceneId }) {
  return (
    <SceneRenderer sceneId={sceneId}>
      {({ scene }) => (
        <div className="modal-content">
          <h2>{scene.name}</h2>
          <p>{scene.description}</p>
          <img src={scene.thumbnail} alt={scene.name} />
        </div>
      )}
    </SceneRenderer>
  )
}
```

### Ejemplo 2: Data List Component

```javascript
// ✅ src/shared/design/components/DataList.jsx

/**
 * Componente lista reutilizable con render props
 * Soporta paginación, sorting, filtrado
 * Pero el renderizado es controlado por el consumidor
 */
export function DataList({
  data,
  renderItem,
  itemKey = 'id',
  columns = 1,
  loading = false
}) {
  const [sortBy, setSortBy] = useState(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const sortedData = useMemo(() => {
    if (!sortBy) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      return aVal > bVal ? 1 : -1
    })
  }, [data, sortBy])

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return sortedData.slice(start, start + itemsPerPage)
  }, [sortedData, page])

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setSortBy(null)}>Sin orden</button>
        <button onClick={() => setSortBy('name')}>Por nombre</button>
      </div>

      <div className={`grid grid-cols-${columns} gap-4`}>
        {paginatedData.map(item => (
          <div key={item[itemKey]}>
            {/* AQUÍ está el poder - renderItem decide qué dibujar */}
            {renderItem(item)}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</button>
        <span> Página {page} </span>
        <button onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
    </div>
  )
}
```

**Uso 1 - Mostrar cards de elementos:**
```javascript
function ElementsListPage() {
  const elements = useElements()

  return (
    <DataList
      data={elements}
      columns={3}
      renderItem={(element) => (
        <div className="border rounded p-4">
          <img src={element.image} alt={element.name} />
          <h3>{element.name}</h3>
          <p className="text-sm text-gray-600">{element.subtitle}</p>
        </div>
      )}
    />
  )
}
```

**Uso 2 - Mostrar tabla de datos:**
```javascript
function ElementsTablePage() {
  const elements = useElements()

  return (
    <DataList
      data={elements}
      columns={1}
      renderItem={(element) => (
        <div className="flex justify-between items-center border-b py-2">
          <span className="font-bold">{element.name}</span>
          <span className="text-sm">{element.affectationType}</span>
          <button onClick={() => navigate(`/elemento/${element.id}`)}>
            Ver detalles
          </button>
        </div>
      )}
    />
  )
}
```

**Uso 3 - Timeline de elementos:**
```javascript
function TimelineView() {
  const elements = useElements()

  return (
    <DataList
      data={elements}
      renderItem={(element) => (
        <div className="relative pl-8 pb-8 border-l-2">
          <div className="absolute left-0 top-0 w-4 h-4 bg-blue-500 rounded-full -translate-x-2"></div>
          <h4>{element.name}</h4>
          <p>{element.description}</p>
        </div>
      )}
    />
  )
}
```

---

## 🎯 Comparativa de los 3 Patrones

| Patrón | Cuándo Usar | Ventaja | Desventaja |
|--------|-----------|---------|-----------|
| **Compound Components** | Componentes con partes relacionadas | Flexible, clara API | Más código de setup |
| **Custom Hooks** | Lógica repetida en múltiples componentes | Reutilizable, testeable | Requiere React hooks knowledge |
| **Render Props** | Máxima flexibilidad de renderizado | Control total del consumidor | Callback hell si se abusa |

---

## 🔄 Combinando los 3 Patrones

Los patrones **no son excluyentes**, se pueden combinar:

```javascript
// ✅ Usar los 3 patrones juntos

// 1. Custom Hook para lógica
const { parallaxX, parallaxY, handleMouseMove } = useParallax(20)

// 2. Compound Component para estructura
<InteractiveMap onMouseMove={handleMouseMove}>
  {/* 3. Render Props para flexibilidad */}
  <MapZoneSection>
    {(zone) => (
      <div>
        <h2>{zone.name}</h2>
        {zone.elements.map(el => (
          <ElementCard key={el.id} element={el} />
        ))}
      </div>
    )}
  </MapZoneSection>
</InteractiveMap>
```

---

## 📚 Resumen de Patrones

```
┌────────────────────────────────────────────────────────┐
│            ÁRBOL DE DECISIONES                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ¿La lógica se repite en múltiples componentes?        │
│  ├─ SÍ → Custom Hook ⭐ useParallax, useFilter        │
│  └─ NO → Componente                                   │
│                                                        │
│  ¿El componente tiene múltiples partes relacionadas?   │
│  ├─ SÍ → Compound Component ⭐ InteractiveMap+Marker  │
│  └─ NO → Componente simple                            │
│                                                        │
│  ¿El consumidor necesita control del renderizado?      │
│  ├─ SÍ → Render Props ⭐ DataList, SceneRenderer      │
│  └─ NO → Props normales                               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

*Última actualización: 2025-11-08*
*Patrones aplicados en Atlas del Post-extractivismo*
