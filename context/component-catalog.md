# Catálogo de Componentes Reutilizables - Atlas del Post-extractivismo

> Inventario completo de componentes disponibles. Antes de crear uno nuevo, busca aquí. **Máxima reutilización = menos código duplicado**.

---

## 📍 Ubicación de Componentes

```
src/
├── shared/design/components/        ← Componentes reutilizables (design system)
│   ├── InteractiveMap/              ← Mapas interactivos
│   ├── Breadcrumbs/                 ← Navegación
│   ├── TagChip/                     ← Etiquetas
│   └── ...más componentes
├── casosDeEstudio/ui/               ← Específicos de casos de estudio
├── zonas/ui/                        ← Específicos de zonas
├── escenas/ui/                      ← Específicos de escenas
└── elementos/ui/                    ← Específicos de elementos
```

**Regla**: Si un componente se usa en 2+ módulos → va a `shared/design/components/`

---

## 🎨 COMPONENTES DE DISEÑO REUTILIZABLES

### 1. **InteractiveMap** ⭐

**Ubicación**: `src/shared/design/components/InteractiveMap/`

**Propósito**: Mapa interactivo con parallax, hotspots y decoraciones. Base para todas las vistas de mapa.

**Props**:
```javascript
<InteractiveMap
  backgroundImage={string}        // URL de imagen de fondo
  parallaxIntensity={number}      // 0-50, default 20
  onMouseMove={function}          // Opcional, para tracking custom
  children={ReactNode}            // Hijos: MapMarker, MapDecoration, etc
/>
```

**Componentes Hijo Disponibles**:
- `<MapMarker />` - Punto interactivo en el mapa
- `<MapDecoration />` - Imagen estática con parallax
- `<MapFilter />` - Sistema de filtros (Biótico/Antrópico/Físico)
- `<MapLabel />` - Etiqueta flotante

**Ejemplo de Uso**:
```javascript
<InteractiveMap backgroundImage={mapImg} parallaxIntensity={25}>
  <MapMarker
    id="zona-1"
    position={{ left: 50, top: 30 }}
    label="Puerto Punta Chungo"
    onClick={() => navigate('/zonas/1')}
  />
  <MapDecoration
    image={decorImg}
    position={{ left: 20, top: 40 }}
    parallaxFactor={0.3}
  />
</InteractiveMap>
```

**Casos de Uso**:
- ✅ Página de caso de estudio detalle
- ✅ Página de zona detalle
- ✅ Página de escena detalle

**Props del Contexto Compartido**:
```javascript
{
  selectedMarker: string | null,      // ID del marker seleccionado
  setSelectedMarker: (id) => void,    // Actualizar selección
  parallaxX: MotionValue,             // Posición parallax X
  parallaxY: MotionValue,             // Posición parallax Y
  parallaxIntensity: number           // Intensidad del efecto
}
```

---

### 2. **MapMarker**

**Ubicación**: `src/shared/design/components/InteractiveMap/MapMarker.jsx`

**Propósito**: Punto interactivo dentro de un `<InteractiveMap>`. Usa contexto del mapa para parallax y selección.

**Props**:
```javascript
<MapMarker
  id={string}                     // ID único (requerido)
  position={{ left: number, top: number }}  // Posición en %
  label={string}                  // Texto a mostrar
  icon={string}                   // URL de ícono (opcional)
  category={string}               // 'biotic' | 'anthropic' | 'physical'
  onClick={function}              // Handler del click
  animated={boolean}              // Default true
/>
```

**Ejemplo**:
```javascript
<MapMarker
  id="jilguero-1"
  position={{ left: 47.5, top: 34.5 }}
  label="Jilguero"
  category="biotic"
  icon={jilgueroIcon}
  onClick={(id) => navigate(`/elemento/${id}`)}
/>
```

---

### 3. **MapDecoration**

**Ubicación**: `src/shared/design/components/InteractiveMap/MapDecoration.jsx`

**Propósito**: Imagen estática con parallax suave. Decoraciones del mapa sin interacción.

**Props**:
```javascript
<MapDecoration
  image={string}                  // URL de imagen
  position={{ left: number, top: number }}  // Posición en %
  parallaxFactor={number}         // 0-1, default 0.3 (más suave que markers)
  alt={string}                    // Texto alternativo
/>
```

**Ejemplo**:
```javascript
<MapDecoration
  image={landscapeImg}
  position={{ left: 80, top: 10 }}
  parallaxFactor={0.2}
  alt="Landscape element"
/>
```

---

### 4. **Breadcrumbs** ⭐

**Ubicación**: `src/shared/design/components/Breadcrumbs/`

**Propósito**: Navegación jerárquica. Muestra ruta actual y permite volver.

**Props**:
```javascript
<Breadcrumbs
  items={[
    { label: 'Casos de Estudio', path: '/casos-de-estudio' },
    { label: 'Provincia de Choapa', path: '/casos-de-estudio/1' },
    { label: 'Puerto Punta Chungo', isActive: true }
  ]}
  onNavigate={(path) => navigate(path)}
  showZoomTransition={boolean}    // Default true
/>
```

**Ejemplo**:
```javascript
<Breadcrumbs
  items={[
    { label: 'Atlas', path: '/' },
    { label: 'Choapa', path: '/casos/1' },
    { label: 'Puerto Punta', path: '/casos/1/zonas/1' },
    { label: 'Perturbación Aérea', isActive: true }
  ]}
/>
```

---

### 5. **TagChip** ⭐

**Ubicación**: `src/shared/design/components/TagChip/`

**Propósito**: Etiqueta reutilizable. Para mostrar categorías, palabras clave, filtros.

**Props**:
```javascript
<TagChip
  label={string}                  // Texto a mostrar
  variant={'default'|'primary'|'outline'}  // Estilo
  size={'sm'|'md'|'lg'}           // Tamaño
  icon={ReactNode}                // Ícono opcional
  onClose={function}              // Si es removible
  isSelected={boolean}            // Para filtros
  onClick={function}              // Callback del click
/>
```

**Ejemplos**:
```javascript
// Simple
<TagChip label="Fauna" variant="primary" />

// Con icono
<TagChip label="Eucalipto" icon={<LeafIcon />} />

// En filtro
<TagChip
  label="Biótico"
  isSelected={filters.includes('biotic')}
  onClick={() => toggleFilter('biotic')}
/>

// Removible
<TagChip
  label="Jilguero"
  onClose={() => removeTag('jilguero')}
/>
```

**Casos de Uso**:
- ✅ Sistema de filtros
- ✅ Palabras clave de elementos
- ✅ Categorías en cards
- ✅ Tags de búsqueda

---

### 6. **ElementCard**

**Ubicación**: `src/shared/design/components/ElementCard/`

**Propósito**: Card reutilizable para mostrar un elemento (fauna/flora/infraestructura).

**Props**:
```javascript
<ElementCard
  element={{
    id: string,
    name: string,
    subtitle: string,
    image: string,
    affectationType: string,
    tags: string[]
  }}
  onClick={function}              // Al hacer click
  showTags={boolean}              // Default true
  size={'sm'|'md'|'lg'}           // Tamaño del card
  variant={'compact'|'detailed'}  // Qué información mostrar
/>
```

**Ejemplo**:
```javascript
<ElementCard
  element={jilguero}
  onClick={() => navigate(`/elemento/${jilguero.id}`)}
  size="md"
  variant="detailed"
/>
```

---

### 7. **LoadingSpinner**

**Ubicación**: `src/shared/design/components/LoadingSpinner/`

**Propósito**: Indicador de carga reutilizable.

**Props**:
```javascript
<LoadingSpinner
  size={'sm'|'md'|'lg'}           // Default 'md'
  color={'primary'|'secondary'}   // Color
  text={string}                   // Texto opcional
/>
```

**Ejemplo**:
```javascript
{loading && <LoadingSpinner size="lg" text="Cargando..." />}
```

---

### 8. **Modal**

**Ubicación**: `src/shared/design/components/Modal/`

**Propósito**: Modal reutilizable para cualquier contenido.

**Props**:
```javascript
<Modal
  isOpen={boolean}
  onClose={function}
  title={string}                  // Opcional
  size={'sm'|'md'|'lg'|'xl'}      // Default 'md'
  closeButton={boolean}           // Default true
  children={ReactNode}
/>
```

**Ejemplo**:
```javascript
<Modal
  isOpen={showDetails}
  onClose={() => setShowDetails(false)}
  title="Detalles del Elemento"
  size="lg"
>
  <ElementDetailContent element={element} />
</Modal>
```

---

## 🎛️ COMPONENTES ESPECÍFICOS POR MÓDULO

### Módulo: Casos de Estudio

#### **CaseStudiesListPage**
- Muestra lista de todos los casos de estudio
- Usa: `DataList` (render props), `TagChip`, `Breadcrumbs`

#### **CaseStudyDetailPage**
- Vista detallada de un caso
- Usa: `InteractiveMap`, `MapMarker`, `MapDecoration`, `Breadcrumbs`

---

### Módulo: Zonas

#### **ZonasListPage**
- Grid de zonas de un caso
- Usa: `ElementCard` (adaptado para zonas), `Breadcrumbs`

#### **ZonaDetailPage**
- Detalle de una zona
- Usa: `InteractiveMap`, `MapMarker`, `Breadcrumbs`, `MapFilter`

---

### Módulo: Escenas

#### **EscenasListPage**
- Grid de escenas de una zona
- Usa: `ElementCard` (adaptado), `Breadcrumbs`

#### **EscenaDetailPage**
- Detalle de una escena
- Usa: `InteractiveMap`, `MapMarker`, `Breadcrumbs`, `TagChip`

---

### Módulo: Elementos

#### **ElementDetailPage**
- Página completa de un elemento
- Muestra: Imagen, descripción, fuente, tags, relaciones

---

## 🔄 PATRONES DE REUTILIZACIÓN

### Patrón 1: Componente Base + Variantes

**Aplicar a**:
```javascript
// ❌ No hacer esto
<ElementCardCompact element={el} />
<ElementCardDetailed element={el} />
<ElementCardThumbnail element={el} />

// ✅ Hacer esto
<ElementCard element={el} variant="compact" />
<ElementCard element={el} variant="detailed" />
<ElementCard element={el} variant="thumbnail" />
```

---

### Patrón 2: Composición en lugar de Props

**Aplicar a**:
```javascript
// ❌ No hacer
<ComplexMap
  showFilter={true}
  showLabels={true}
  onFilterChange={fn}
  filterOptions={[]}
  // ... 10 props más
/>

// ✅ Hacer
<InteractiveMap>
  <MapMarker {...} />
  <MapFilter options={[]} onChange={fn} />
  <MapLabel {...} />
</InteractiveMap>
```

---

## 📊 Tabla Rápida de Componentes

| Componente | Ubicación | Reutilizable | Casos de Uso |
|-----------|-----------|--------------|-------------|
| **InteractiveMap** | `shared/design/` | ⭐⭐⭐ | Todos los mapas del proyecto |
| **MapMarker** | `shared/design/` | ⭐⭐⭐ | Puntos en mapas |
| **MapDecoration** | `shared/design/` | ⭐⭐ | Decoraciones de mapas |
| **Breadcrumbs** | `shared/design/` | ⭐⭐⭐ | Navegación en todas las páginas |
| **TagChip** | `shared/design/` | ⭐⭐⭐ | Filtros, etiquetas, palabras clave |
| **ElementCard** | `shared/design/` | ⭐⭐⭐ | Cards de elementos, zonas, escenas |
| **LoadingSpinner** | `shared/design/` | ⭐⭐⭐ | Estados de carga |
| **Modal** | `shared/design/` | ⭐⭐⭐ | Diálogos y modales |

---

## ✅ Checklist: Antes de Crear Componente Nuevo

Antes de crear un nuevo componente, responde:

- [ ] ¿Existe en esta lista?
- [ ] ¿Se puede hacer componiendo componentes existentes?
- [ ] ¿Se va a usar en 2+ módulos?
  - SI → Va a `shared/design/components/`
  - NO → Va en el módulo específico
- [ ] ¿Es reutilizable o muy específico?
- [ ] ¿Ya existe un hook que haga algo similar?
- [ ] ¿Necesita estar documentado aquí?

---

## 🔧 Cómo Agregar Componente a Este Catálogo

Cuando crees un componente nuevo reutilizable:

1. Colócalo en `src/shared/design/components/{NombreComponente}/`
2. Crea archivo `{NombreComponente}.jsx`
3. Exporta desde `src/shared/design/components/index.js`
4. **Actualiza este catálogo** con:
   - Ubicación
   - Props disponibles
   - Ejemplo de uso
   - Casos de uso

**Recuerda**: Un componente sin documentación es un componente que nadie va a reutilizar. 📚

---

## 🆕 NUEVOS COMPONENTES (Actualizado)

### 9. **RadarPoint**

**Ubicación**: `src/shared/ui/RadarPoint.jsx`

**Propósito**: Punto interactivo animado con anillos pulsantes. Usado en landing page y mapas interactivos.

**Props**:
```javascript
<RadarPoint
  left={number}                           // Posición X en %
  top={number}                            // Posición Y en %
  label={string}                          // Texto del punto
  onClick={function}                      // Handler click
  variant={'default'|'blue'|'yellow'|'black'}  // Color
  state={'visible'|'hidden'|'soft'}       // Visibilidad
  isHovered={boolean}                     // Estado hover
/>
```

**Características**:
- 3 anillos concéntricos pulsantes
- Animación acelerada en hover
- Soporte para movimiento reducido
- Accesibilidad integrada

**Ejemplo**:
```javascript
<RadarPoint
  left="50%"
  top="35%"
  label="Provincia de Choapa"
  variant="blue"
  state="visible"
  onClick={() => navigate('/casos/1')}
  isHovered={hoveredId === 'choapa'}
/>
```

---

### 10. **MapMarker**

**Ubicación**: `src/shared/ui/InteractiveMap.jsx` - Componente hijo

**Propósito**: Hotspot clickeable dentro de InteractiveMap con parallax.

**Props**:
```javascript
<MapMarker
  id={string}
  left={number}               // % de posición
  top={number}
  label={string}
  icon={string}               // URL ícono
  onClick={function}
/>
```

---

### 11. **MapIconHotspot**

**Ubicación**: `src/shared/ui/InteractiveMap.jsx` - Componente hijo

**Propósito**: Hotspot con ícono para categorías (biotic, anthropic).

**Props**:
```javascript
<MapIconHotspot
  id={string}
  left={number}
  top={number}
  icon={string}               // Ícono SVG o imagen
  category={'biotic'|'anthropic'|'physical'}
  label={string}
  onClick={function}
/>
```

---

### 12. **MapDecoration**

**Ubicación**: `src/shared/ui/InteractiveMap.jsx` - Componente hijo

**Propósito**: Imagen estática con parallax suave (decoración).

**Props**:
```javascript
<MapDecoration
  image={string}
  left={number}
  top={number}
  parallaxFactor={number}     // 0-1, default 0.3
/>
```

---

## 🎣 NUEVOS HOOKS (Actualizado)

### 4. **useTheme()**

**Ubicación**: `src/shared/hooks/useTheme.jsx`

**Propósito**: Gestionar tema (light/night) de la aplicación.

**Uso**:
```javascript
const { theme, setTheme } = useTheme()

// Cambiar a tema nocturno
setTheme('night')
```

**Proveedor**:
```javascript
<ThemeProvider>
  <App />
</ThemeProvider>
```

**Features**:
- Aplica clase 'theme-night' a body
- Persistencia de tema
- Global

---

### 5. **usePageTransition()**

**Ubicación**: `src/shared/hooks/useZoomNavigation.jsx`

**Propósito**: Obtener configuración de animación para transiciones entre páginas.

**Uso**:
```javascript
const transition = usePageTransition()
// Devuelve: { direction, intensity, origin, ... }
```

---

### 6. **useZoomNavigation()**

**Ubicación**: `src/shared/hooks/useZoomNavigation.jsx`

**Propósito**: Navegar con animación de zoom desde punto de click.

**Uso**:
```javascript
const zoomNavigate = useZoomNavigation()

// En onClick:
zoomNavigate('/zonas/1', { origin: { x, y } })
```

---

### 7. **useZoomOut()**

**Ubicación**: `src/shared/hooks/useZoomNavigation.jsx`

**Propósito**: Navegar hacia atrás con efecto de zoom out.

**Uso**:
```javascript
const zoomOut = useZoomOut()
zoomOut()  // Vuelve a página anterior con animación
```

---

### 8. **usePrefersReducedMotion()**

**Ubicación**: `src/shared/design/hooks/usePrefersReducedMotion.js`

**Propósito**: Detectar preferencia del usuario por movimiento reducido.

**Uso**:
```javascript
const prefersReducedMotion = usePrefersReducedMotion()

if (prefersReducedMotion) {
  // No animar
} else {
  // Animar normalmente
}
```

---

### 9. **useElementRecommendations()**

**Ubicación**: `src/elementos/hooks/useElementRecommendations.js`

**Propósito**: Obtener elemento y recomendaciones basadas en tags.

**Parámetros**:
```javascript
const {
  service,
  status,
  base,              // Elemento base
  recommendations,   // Array de recomendaciones
  cursor             // Para paginación
} = useElementRecommendations(elementId, {
  elementsRepository,
  limit: 10,
  exclude: [],
  seed: Math.random()
})
```

**Features**:
- Tag-based recommendations
- Cursor pagination
- Seeded shuffle (reproducible)

---

## 💼 SERVICIOS (Actualizado)

### 4. **RecommendationsService**

**Ubicación**: `src/elementos/services/recommendationsService.js`

**Métodos**:
```javascript
service.getElementWithTags(elementId)
// → { element, tags, affectationType }

service.getRecommendations({
  elementId,
  limit: 10,
  exclude: [],
  cursor: null,
  seed: Math.random()
})
// → { base, recommendations, nextCursor }
```

**Algoritmo**:
1. Extrae tags del elemento base
2. Encuentra elementos con >= 1 tag coincidente
3. Ordena por cantidad de tags compartidos
4. Shuffle opcional (seeded para reproducibilidad)
5. Pagina resultados

---

## 🗂️ TABLA RÁPIDA ACTUALIZADA

| Componente | Ubicación | Reutilizable | Casos de Uso |
|-----------|-----------|--------------|-------------|
| **InteractiveMap** | `shared/ui/` | ⭐⭐⭐ | Todos los mapas |
| **RadarPoint** | `shared/ui/` | ⭐⭐⭐ | Landing, puntos interactivos |
| **MapMarker** | `shared/ui/` | ⭐⭐⭐ | Hotspots en mapas |
| **MapIconHotspot** | `shared/ui/` | ⭐⭐⭐ | Hotspots categorizados |
| **MapDecoration** | `shared/ui/` | ⭐⭐ | Decoraciones con parallax |
| **Breadcrumbs** | `shared/ui/` | ⭐⭐⭐ | Navegación jerárquica |
| **TagChip** | `shared/ui/` | ⭐⭐⭐ | Tags, etiquetas, palabras clave |
| **Button** | `shared/design/` | ⭐⭐⭐ | Botones en todo el proyecto |
| **SectionHeader** | `shared/design/` | ⭐⭐⭐ | Headers de secciones |

---

## 🎯 FLUJO DE DATOS COMPLETO

```
LandingPage
  ├─ RadarPoint (click)
  └─→ CaseStudiesListPage
      ├─ InteractiveMap
      ├─ MapMarker (click)
      └─→ CaseStudyDetailPage
          ├─ InteractiveMap con decoraciones
          ├─ MapIconHotspot (click)
          └─→ ZonasListPage
              ├─ Zone Cards
              └─→ ZonaDetailPage
                  ├─ InteractiveMap
                  ├─ MapIconHotspot (click)
                  └─→ EscenasListPage
                      ├─ Scene Cards
                      └─→ EscenaDetailPage
                          ├─ InteractiveMap
                          ├─ MapIconHotspot (click)
                          └─→ ElementDetailPage
                              ├─ Element Info
                              └─ ElementRecommendationsPanel
```

---

*Última actualización: 2025-11-08*
*Catálogo actualizado con nuevos componentes, hooks y servicios*
