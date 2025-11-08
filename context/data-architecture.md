# Arquitectura de Datos Reutilizable - Atlas del Post-extractivismo

> Arquitectura de datos **desacoplada, escalable y reutilizable**. Los componentes no saben de dónde vienen los datos, solo trabajan con ellos.

---

## 🏗️ Arquitectura en Capas

```
┌──────────────────────────────────────────────────────┐
│  COMPONENTES React (UI)                              │
│  - No conocen API, BD, CSV                          │
│  - Solo reciben props y callbacks                    │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│  CUSTOM HOOKS (useElements, useCaseStudy, etc)       │
│  - Convierten datos en estado React                 │
│  - Manejo de loading, error, cache                  │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│  SERVICES (Lógica de Negocio)                        │
│  - Transformaciones de datos                        │
│  - Validaciones                                     │
│  - Lógica de filtrado                               │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│  REPOSITORIES (Patrón Repository)                    │
│  - Abstracción de fuente de datos                   │
│  - Intercambiables (CSV ↔ API ↔ BD)                │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│  DATA SOURCES (Concreto)                             │
│  - CSV files                                        │
│  - JSON files                                       │
│  - REST API                                         │
│  - GraphQL                                          │
│  - Base de Datos                                    │
└──────────────────────────────────────────────────────┘
```

**Principio**: Cada capa solo habla con la capa de abajo. Los componentes NUNCA llaman directamente a API o BD.

---

## 📋 PATRÓN REPOSITORY

### ¿Qué es?

El patrón Repository **abstrae la fuente de datos**. El código que usa datos no sabe (ni le importa) si vienen de CSV, API, BD, o donde sea.

### ¿Por qué?

- **Desacoplamiento**: Cambiar de CSV a API sin tocar componentes
- **Testabilidad**: Mock del repository en tests
- **Escalabilidad**: Múltiples fuentes simultáneamente
- **Reutilización**: El mismo código sirve para diferentes orígenes

### Estructura

```
src/casosDeEstudio/
├── repo/
│   └── CaseStudiesRepository.js    ← Interface/clase base
├── repo/impl/
│   ├── CaseStudiesInMemoryRepo.js  ← Implementación con JSON
│   ├── CaseStudiesApiRepo.js       ← Implementación con API
│   └── CaseStudiesDbRepo.js        ← Implementación con BD
├── services/
│   └── CaseStudiesService.js       ← Usa repository
├── hooks/
│   └── useCaseStudies.js           ← Hook que usa service
└── ui/
    └── CaseStudiesListPage.jsx     ← Componente que usa hook
```

### Ejemplo 1: Repository para Casos de Estudio

**Interfaz del Repository** (El contrato):
```javascript
// src/casosDeEstudio/repo/CaseStudiesRepository.js

/**
 * Interface que todas las implementaciones deben cumplir
 * Define QUÉ métodos tiene, no CÓMO los implementa
 */
export class CaseStudiesRepository {
  // Obtener todos los casos
  async getAll() {
    throw new Error('Not implemented')
  }

  // Obtener un caso por ID
  async getById(id) {
    throw new Error('Not implemented')
  }

  // Obtener zonas de un caso
  async getZonesByCaseId(caseId) {
    throw new Error('Not implemented')
  }

  // Búsqueda
  async search(query) {
    throw new Error('Not implemented')
  }

  // Filtrado
  async filter(criteria) {
    throw new Error('Not implemented')
  }
}
```

**Implementación 1: In-Memory (JSON duro)**
```javascript
// src/casosDeEstudio/repo/impl/CaseStudiesInMemoryRepo.js

import { CaseStudiesRepository } from '../CaseStudiesRepository'
import { CASES_DATA } from '@/shared/data/atlasContent'

/**
 * Almacena datos en memoria (JSON duro)
 * Perfecto para desarrollo sin API
 */
export class CaseStudiesInMemoryRepository extends CaseStudiesRepository {
  async getAll() {
    // Simular delay de red
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(CASES_DATA)
      }, 300)
    })
  }

  async getById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const caseStudy = CASES_DATA.find(c => c.id === id)
        resolve(caseStudy || null)
      }, 300)
    })
  }

  async getZonesByCaseId(caseId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const caseStudy = CASES_DATA.find(c => c.id === caseId)
        resolve(caseStudy?.zones || [])
      }, 300)
    })
  }

  async search(query) {
    return new Promise(resolve => {
      const results = CASES_DATA.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
      resolve(results)
    })
  }

  async filter(criteria) {
    return new Promise(resolve => {
      let results = CASES_DATA

      if (criteria.region) {
        results = results.filter(c => c.region === criteria.region)
      }

      if (criteria.hasZones) {
        results = results.filter(c => c.zones?.length > 0)
      }

      resolve(results)
    })
  }
}
```

**Implementación 2: API REST**
```javascript
// src/casosDeEstudio/repo/impl/CaseStudiesApiRepository.js

import { CaseStudiesRepository } from '../CaseStudiesRepository'

/**
 * Obtiene datos de una API REST
 * Mismo interface, diferente origen de datos
 */
export class CaseStudiesApiRepository extends CaseStudiesRepository {
  constructor(baseUrl = 'https://api.atlas.com') {
    super()
    this.baseUrl = baseUrl
  }

  async getAll() {
    const response = await fetch(`${this.baseUrl}/cases`)
    if (!response.ok) throw new Error('Failed to fetch cases')
    return response.json()
  }

  async getById(id) {
    const response = await fetch(`${this.baseUrl}/cases/${id}`)
    if (!response.ok) throw new Error(`Case ${id} not found`)
    return response.json()
  }

  async getZonesByCaseId(caseId) {
    const response = await fetch(`${this.baseUrl}/cases/${caseId}/zones`)
    if (!response.ok) throw new Error(`Zones for case ${caseId} not found`)
    return response.json()
  }

  async search(query) {
    const response = await fetch(
      `${this.baseUrl}/cases/search?q=${encodeURIComponent(query)}`
    )
    if (!response.ok) throw new Error('Search failed')
    return response.json()
  }

  async filter(criteria) {
    const params = new URLSearchParams(criteria)
    const response = await fetch(`${this.baseUrl}/cases/filter?${params}`)
    if (!response.ok) throw new Error('Filter failed')
    return response.json()
  }
}
```

**Implementación 3: Base de Datos (cuando esté lista)**
```javascript
// src/casosDeEstudio/repo/impl/CaseStudiesDbRepository.js

import { CaseStudiesRepository } from '../CaseStudiesRepository'

/**
 * Obtiene datos de una base de datos vía API de backend
 * Mismo interface, datos normalizados en BD
 */
export class CaseStudiesDbRepository extends CaseStudiesRepository {
  constructor(apiClient) {
    super()
    this.api = apiClient
  }

  async getAll() {
    return this.api.get('/cases')
  }

  async getById(id) {
    return this.api.get(`/cases/${id}`)
  }

  async getZonesByCaseId(caseId) {
    return this.api.get(`/cases/${caseId}/zones`)
  }

  async search(query) {
    return this.api.post('/cases/search', { query })
  }

  async filter(criteria) {
    return this.api.post('/cases/filter', criteria)
  }
}
```

### Usar el Repository Correcto

**Factory Pattern para elegir implementación:**
```javascript
// src/shared/data/repositoryFactory.js

import { CaseStudiesInMemoryRepository } from '@/casosDeEstudio/repo/impl/CaseStudiesInMemoryRepo'
import { CaseStudiesApiRepository } from '@/casosDeEstudio/repo/impl/CaseStudiesApiRepository'
import { CaseStudiesDbRepository } from '@/casosDeEstudio/repo/impl/CaseStudiesDbRepository'

/**
 * Factory que devuelve la implementación correcta según config
 * Cambiar aquí para usar API, BD, o in-memory
 */
export function getCaseStudiesRepository() {
  const dataSource = import.meta.env.VITE_DATA_SOURCE || 'memory'

  switch (dataSource) {
    case 'api':
      return new CaseStudiesApiRepository()

    case 'database':
      return new CaseStudiesDbRepository(apiClient)

    case 'memory':
    default:
      return new CaseStudiesInMemoryRepository()
  }
}

// En .env.development
// VITE_DATA_SOURCE=memory

// En .env.production
// VITE_DATA_SOURCE=database
```

---

## 💼 SERVICES LAYER

### ¿Qué es?

Services contiene **lógica de negocio reutilizable**. Transformaciones, validaciones, filtrados que se usan en múltiples componentes.

### Estructura

```
src/casosDeEstudio/services/
├── CaseStudiesService.js        ← Lógica de casos
├── ZonesService.js              ← Lógica de zonas
└── ElementsService.js           ← Lógica de elementos
```

### Ejemplo: CaseStudiesService

```javascript
// src/casosDeEstudio/services/CaseStudiesService.js

/**
 * Service que contiene lógica de negocio reutilizable
 * Usa el repository internamente
 */
export class CaseStudiesService {
  constructor(caseStudiesRepository) {
    this.repository = caseStudiesRepository
  }

  // Obtener todos con transformaciones
  async getAllWithStats() {
    const cases = await this.repository.getAll()

    return cases.map(caseStudy => ({
      ...caseStudy,
      // Agregar stats calculados
      totalZones: caseStudy.zones?.length || 0,
      totalElements: this.countElements(caseStudy),
      completion: this.calculateCompletion(caseStudy)
    }))
  }

  // Obtener caso con todos sus datos relacionados
  async getCaseWithRelations(caseId) {
    const caseStudy = await this.repository.getById(caseId)
    if (!caseStudy) return null

    const zones = await this.repository.getZonesByCaseId(caseId)

    return {
      ...caseStudy,
      zones: zones.map(zone => ({
        ...zone,
        elementCount: zone.scenes?.reduce((sum, s) => sum + s.elements?.length, 0) || 0
      }))
    }
  }

  // Búsqueda avanzada
  async advancedSearch(query, filters = {}) {
    const searchResults = await this.repository.search(query)

    return searchResults
      .filter(c => {
        if (filters.region && c.region !== filters.region) return false
        if (filters.minElements && this.countElements(c) < filters.minElements) return false
        return true
      })
      .map(c => ({
        ...c,
        relevance: this.calculateRelevance(c, query)
      }))
      .sort((a, b) => b.relevance - a.relevance)
  }

  // Métodos helper (lógica reutilizable)
  countElements(caseStudy) {
    return caseStudy.zones?.reduce(
      (sum, z) => sum + (z.scenes?.reduce((s, sc) => s + (sc.elements?.length || 0), 0) || 0),
      0
    ) || 0
  }

  calculateCompletion(caseStudy) {
    const total = this.countElements(caseStudy)
    const withDescription = caseStudy.zones?.reduce(
      (sum, z) => sum + (z.scenes?.reduce((s, sc) => s + sc.elements?.filter(e => e.description).length || 0, 0) || 0),
      0
    ) || 0

    return total > 0 ? (withDescription / total) * 100 : 0
  }

  calculateRelevance(caseStudy, query) {
    let score = 0
    const lowerQuery = query.toLowerCase()

    if (caseStudy.name?.toLowerCase().includes(lowerQuery)) score += 10
    if (caseStudy.location?.toLowerCase().includes(lowerQuery)) score += 5

    return score
  }
}
```

### Factory de Services

```javascript
// src/shared/services/serviceFactory.js

import { CaseStudiesService } from '@/casosDeEstudio/services/CaseStudiesService'
import { getCaseStudiesRepository } from '@/shared/data/repositoryFactory'

/**
 * Factory que crea services con repositories inyectados
 */
export function createCaseStudiesService() {
  const repository = getCaseStudiesRepository()
  return new CaseStudiesService(repository)
}

// Instancia única (singleton)
export const caseStudiesService = createCaseStudiesService()
```

---

## 🪝 CUSTOM HOOKS

### ¿Qué es?

Hooks que **convierten datos en estado React**. Manejan loading, errores, caché. Los componentes usan estos hooks, no el service directamente.

### Estructura

```
src/casosDeEstudio/hooks/
├── useCaseStudies.js            ← Obtener todos
├── useCaseStudy.js              ← Obtener uno
├── useSearchCases.js            ← Búsqueda
└── useCaseStats.js              ← Estadísticas
```

### Ejemplo: useCaseStudies Hook

```javascript
// src/casosDeEstudio/hooks/useCaseStudies.js

import { useState, useEffect, useCallback } from 'react'
import { caseStudiesService } from '@/shared/services/serviceFactory'

/**
 * Hook reutilizable para obtener casos de estudio
 * Maneja loading, error, caché automáticamente
 */
export function useCaseStudies(options = {}) {
  const {
    withStats = false,
    withRelations = false,
    cache = true
  } = options

  const [cases, setCases] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadCases() {
      try {
        setLoading(true)
        setError(null)

        const data = withStats
          ? await caseStudiesService.getAllWithStats()
          : await caseStudiesService.getAll()

        if (isMounted) {
          setCases(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCases()

    return () => {
      isMounted = false
    }
  }, [withStats])

  return {
    cases,
    loading,
    error,
    isLoading: loading,
    isEmpty: !loading && cases?.length === 0,
    isError: error !== null
  }
}
```

### Ejemplo: useCaseStudy Hook (Obtener Uno)

```javascript
// src/casosDeEstudio/hooks/useCaseStudy.js

import { useState, useEffect } from 'react'
import { caseStudiesService } from '@/shared/services/serviceFactory'

/**
 * Hook para obtener un caso específico
 * Reutilizable en cualquier componente que necesite un caso
 */
export function useCaseStudy(caseId, options = {}) {
  const { withRelations = false } = options

  const [caseStudy, setCaseStudy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!caseId) return

    let isMounted = true

    async function loadCase() {
      try {
        setLoading(true)
        setError(null)

        const data = withRelations
          ? await caseStudiesService.getCaseWithRelations(caseId)
          : await caseStudiesService.getById(caseId)

        if (isMounted) {
          setCaseStudy(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCase()

    return () => {
      isMounted = false
    }
  }, [caseId, withRelations])

  return {
    caseStudy,
    loading,
    error,
    isLoading: loading,
    isLoaded: !loading && caseStudy !== null,
    isError: error !== null
  }
}
```

### Usar Hooks en Componentes

```javascript
// ✅ BIEN - Componente solo recibe datos vía hooks

export function CaseStudiesListPage() {
  const { cases, loading, error } = useCaseStudies({ withStats: true })

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!cases?.length) return <EmptyState />

  return (
    <div className="grid gap-4">
      {cases.map(caseStudy => (
        <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
      ))}
    </div>
  )
}

// En CaseStudyDetailPage

export function CaseStudyDetailPage() {
  const { caseId } = useParams()
  const { caseStudy, loading } = useCaseStudy(caseId, { withRelations: true })

  if (loading) return <LoadingSpinner />

  return (
    <InteractiveMap backgroundImage={caseStudy.detailMap.image}>
      {caseStudy.zones.map(zone => (
        <MapMarker
          key={zone.id}
          id={zone.id}
          position={{ left: zone.mapX, top: zone.mapY }}
          label={zone.name}
          onClick={() => navigate(`/zonas/${zone.id}`)}
        />
      ))}
    </InteractiveMap>
  )
}
```

---

## 🔄 Flujo Completo de Datos

```
Componente
    ↓
useCaseStudy(caseId)  ← Hook
    ↓
CaseStudiesService    ← Lógica de negocio
    ↓
CaseStudiesRepository ← Interface
    ↓
CaseStudiesInMemoryRepository / ApiRepository / DbRepository
    ↓
Datos (JSON / API / BD)
```

**Cambio de fuente de datos**: Solo cambiar factory, todo lo demás sigue igual ✅

---

## 🗂️ Estructura de Datos Actual (En-Memory)

```javascript
// src/shared/data/atlasContent.js

export const ATLAS_DATA = {
  caseStudies: [
    {
      id: 'choapa-1',
      name: 'Provincia de Choapa',
      location: 'Coquimbo, Chile',
      description: '...',
      globalMap: {
        image: '/img/maps/global-choapa.jpg',
        points: [
          {
            id: 'zone-puerto-punta',
            left: 50,
            top: 35,
            label: 'Puerto Punta Chungo',
            zoneId: 'puerto-punta-1'
          }
        ]
      },
      detailMap: {
        image: '/img/maps/choapa-detail.jpg',
        hotspots: [
          {
            id: 'puerto-punta',
            left: 50,
            top: 35,
            label: 'Puerto Punta Chungo',
            category: 'extraction-zone',
            zoneId: 'puerto-punta-1'
          }
        ],
        decorations: []
      },
      zones: [
        {
          id: 'puerto-punta-1',
          name: 'Puerto Punta Chungo',
          description: '...',
          mapImage: '/img/zones/puerto-punta.jpg',
          mapX: 50,
          mapY: 35,
          scenes: [
            {
              id: 'perturbacion-aerea-1',
              name: 'Perturbación Aérea',
              theme: 'anthropic',
              mapImage: '/img/scenes/perturbacion-aerea.jpg',
              elements: [
                {
                  id: 'jilguero-1',
                  name: 'Jilguero',
                  subtitle: 'Carduelis barbatus',
                  category: 'biotic',
                  affectationType: 'hábitat',
                  image: '/img/elements/jilguero.jpg',
                  description: '...',
                  source: 'Scholar article...',
                  tags: ['ave', 'fauna', 'amenazada']
                }
                // ... más elementos
              ]
            }
            // ... más escenas
          ]
        }
        // ... más zonas
      ]
    }
    // ... más casos
  ]
}
```

---

## 🚀 Migración: CSV → Base de Datos

### Paso 1: Crear Nueva Implementación de Repository

```javascript
// src/casosDeEstudio/repo/impl/CaseStudiesDbRepository.js
// Esperar que API de backend esté lista
```

### Paso 2: Cambiar Factory

```javascript
// src/shared/data/repositoryFactory.js
export function getCaseStudiesRepository() {
  const dataSource = process.env.REACT_APP_DATA_SOURCE || 'memory'

  if (dataSource === 'database') {
    return new CaseStudiesDbRepository(apiClient)
  }
  // ...
}
```

### Paso 3: Listo ✅

**Todos los componentes y hooks siguen funcionando igual.** Solo cambió la fuente de datos.

---

## 🎯 Ventajas de Esta Arquitectura

| Ventaja | Cómo Funciona |
|---------|---------------|
| **Desacoplamiento** | Componentes → Hooks → Services → Repository → Data |
| **Escalabilidad** | Agregar nuevos services sin tocar componentes |
| **Testabilidad** | Mock cada capa independientemente |
| **Reutilización** | Mismo service en múltiples componentes |
| **Cambios Fáciles** | Cambiar fuente de datos en un solo lugar |
| **Mantenibilidad** | Código organizado por responsabilidades |

---

## 📝 Checklist: Agregar Nuevo Recurso de Datos

Cuando necesites datos de un nuevo recurso (ej: comentarios, guía, etc):

- [ ] Crear `CommentsRepository` en `repo/`
- [ ] Crear `CommentsInMemoryRepository` en `repo/impl/`
- [ ] Crear `CommentsService` en `services/`
- [ ] Crear `useComments()` y `useComment()` hooks
- [ ] Usar los hooks en componentes
- [ ] Documentar en este archivo

---

## NUEVOS SERVICIOS DOCUMENTADOS

### 5. **ZonasService**

**Ubicación**: `src/zonas/services/zonasService.js`

**Métodos**:
```javascript
service.getAll()                    // Todas las zonas
service.getById(zoneId)            // Zona específica
service.getForCaseStudy(caseId)    // Zonas de un caso
```

---

### 6. **EscenasService**

**Ubicación**: `src/escenas/services/escenasService.js`

**Métodos**:
```javascript
service.getAll()                   // Todas las escenas
service.getById(sceneId)           // Escena específica
service.getByZone(zoneId)          // Escenas de una zona
```

---

### 7. **RecommendationsService**

**Ubicación**: `src/elementos/services/recommendationsService.js`

**Métodos**:
```javascript
service.getElementWithTags(elementId)
// Retorna: { element, tags, affectationType }

service.getRecommendations({
  elementId,
  limit: 10,
  exclude: [],
  cursor: null,
  seed: Math.random()
})
// Retorna: { base, recommendations, nextCursor }
```

**Algoritmo de Recomendaciones**:
1. Extrae todos los tags del elemento base
2. Busca elementos con >= 1 tag coincidente
3. Ordena por número de tags compartidos (descendente)
4. Aplica shuffle opcional con seed (para reproducibilidad)
5. Pagina resultados con cursor

**Ejemplo de Uso**:
```javascript
const recommendations = await recommendationsService.getRecommendations({
  elementId: 'jilguero-1',
  limit: 5,
  exclude: ['jilguero-1'],
  seed: 12345  // Misma seed = mismo orden
})

// Resultado:
{
  base: { id: 'jilguero-1', name: 'Jilguero', tags: ['ave', 'fauna'] },
  recommendations: [
    { id: 'jote-1', name: 'Jote', sharedTags: 2 },
    { id: 'diuca-1', name: 'Diuca', sharedTags: 1 },
    // ... más elementos
  ],
  nextCursor: 'cursor-for-page-2'
}
```

---

## NUEVOS REPOSITORIOS DOCUMENTADOS

### 5. **ZonasRepository**

**Ubicación**: `src/zonas/repo/zonasRepository.js`

**Interfaz**:
```javascript
class ZonasRepository {
  async list()                         // Todas las zonas
  async findById(zoneId)              // Zona por ID
  async listByCaseStudy(caseStudyId)  // Zonas de un caso
}
```

**Implementación In-Memory**:
```javascript
class InMemoryZonasRepository extends ZonasRepository {
  // Lee de: atlasContent.zones
  // Estructura: { id, caseStudyId, name, description, sceneIds, map, ... }
}
```

---

### 6. **EscenasRepository**

**Ubicación**: `src/escenas/repo/escenasRepository.js`

**Interfaz**:
```javascript
class EscenasRepository {
  async list()                      // Todas las escenas
  async findById(sceneId)           // Escena por ID
  async listByZone(zoneId)          // Escenas de una zona
}
```

**Implementación In-Memory**:
```javascript
class InMemoryEscenasRepository extends EscenasRepository {
  // Lee de: atlasContent.scenes
  // Estructura: { id, zoneId, name, theme, map, hotspots, ... }
}
```

---

### 7. **ElementsRepository** (Avanzado)

**Ubicación**: `src/elementos/repo/elementsRepository.js`

**Interfaz**:
```javascript
class ElementsRepository {
  // Paginación
  async listPaginated({ limit, cursor })

  // Búsqueda
  async findById(elementId)
  async getElementWithTags(elementId)

  // Recomendaciones (tag-based)
  async findElementsWithSharedTags({
    tagIds,        // IDs de tags a buscar
    excludeIds,    // IDs a excluir
    limit,
    cursor
  })
}
```

**Implementación In-Memory** (Avanzada):
```javascript
class InMemoryElementsRepository extends ElementsRepository {
  // Estructura de datos:
  - elements: Array
  - tags: Array
  - affectationTypes: Array
  - elementTags: Array<{ elementId, tagId }>

  // Índices para búsqueda rápida:
  - tagIndex: Map<tagId, elementIds>
  - elementIndex: Map<elementId, element>

  // Método findElementsWithSharedTags():
  1. Para cada tagId, obtener elementos
  2. Contar tags compartidos por elemento
  3. Ordenar por cantidad (descendente)
  4. Filtrar excluidos
  5. Paginar con cursor
}
```

**Características**:
- Tag indexing (búsqueda O(1))
- Cursor-based pagination
- Efficient filtering
- Excludes duplicates

**Ejemplo**:
```javascript
const { items, nextCursor } = await elementsRepository.findElementsWithSharedTags({
  tagIds: ['ave', 'fauna'],
  excludeIds: ['jilguero-1'],
  limit: 5,
  cursor: null
})

// Retorna elementos ordenados por tags compartidos
```

---

## NUEVOS HOOKS DOCUMENTADOS

### 10. **useCaseStudiesState()**

**Ubicación**: `src/casosDeEstudio/hooks/useCaseStudiesState.js`

**Parámetros**:
```javascript
const { status, caseStudies } = useCaseStudiesState({
  caseStudiesService
})
```

**Estados posibles**:
- 'idle': Inicial
- 'loading': Cargando
- 'ready': Datos cargados
- 'error': Error al cargar

---

### 11. **useZonasState()**

**Ubicación**: `src/zonas/hooks/useZonasState.js`

**Parámetros**:
```javascript
const { status, zonas } = useZonasState({
  zonasService,
  caseStudyId: 'provincia-choapa'  // Opcional
})
```

**Filtra automáticamente por caseStudyId si se proporciona**

---

### 12. **useEscenasState()**

**Ubicación**: `src/escenas/hooks/useEscenasState.js`

**Parámetros**:
```javascript
const { status, escenas } = useEscenasState({
  escenasService,
  zoneId: 'puerto-punta-chungo'  // Opcional
})
```

---

## PATRONES APLICADOS EN EL CÓDIGO

### Patrón 1: Repository + Service + Hook

```
En cada módulo (casosDeEstudio, zonas, escenas, elementos):

1. Repository (abstracción de datos)
   ↓
2. Service (lógica de negocio)
   ↓
3. Hook (estado React)
   ↓
4. Component (UI)
```

### Patrón 2: Tag-Based Recommendations

```
Recomendaciones basadas en tags compartidos:

1. Usuario ve: Jilguero (tags: ['ave', 'fauna'])
2. Sistema busca: Otros elementos con 'ave' o 'fauna'
3. Ordena por: # tags compartidos (desc)
4. Pagina con: Cursor para siguiente página
5. Reproduce: Mismo seed = mismo orden
```

### Patrón 3: Zoom Navigation

```
Flujo de navegación con zoom:

1. User clicks RadarPoint en LandingPage
2. useZoomNavigation() calcula origin (click position)
3. Animación zoom-in desde origin
4. Navega a CaseStudiesListPage
5. Entrada animada desde point of origin
6. useZoomOut() en botón back
7. Zoom-out hacia origin anterior
```

---

## EXTENSIONES FUTURAS

### Agregar Nueva Fuente de Datos

Ejemplo: Cambiar de In-Memory a API

```javascript
// 1. Crear nueva implementación de repository
class ApiCaseStudiesRepository extends CaseStudiesRepository {
  async list() {
    return fetch('/api/cases').then(r => r.json())
  }
  // ...
}

// 2. Cambiar en factory
export function getCaseStudiesRepository() {
  if (env === 'production') {
    return new ApiCaseStudiesRepository('https://api.atlas.com')
  }
  return new InMemoryCaseStudiesRepository()
}

// 3. Listo. Services, Hooks, Components siguen igual.
```

---

## CHECKLIST: AGREGAR NUEVO MÓDULO

Si necesitas agregar otro módulo (ej: "comentarios"):

- [ ] Crear carpeta `src/comentarios/`
- [ ] Crear `repo/comentariosRepository.js` (interfaz + InMemory)
- [ ] Crear `services/comentariosService.js`
- [ ] Crear `hooks/useComentariosState.js`
- [ ] Crear `model/comentarioModel.js`
- [ ] Crear `api/comentariosApiClient.js` (vacío por ahora)
- [ ] Crear `ui/ComentariosListPage.jsx`
- [ ] Crear `routes/comentariosRoutes.jsx`
- [ ] Agregar datos a `shared/data/atlasContent.js`
- [ ] Agregar ruta en `app/routes.jsx`
- [ ] Documentar en `context/component-catalog.md`
- [ ] Documentar en `context/data-architecture.md`

---

*Última actualización: 2025-11-08*
*Arquitectura completamente documentada con nuevos servicios y repositorios*
