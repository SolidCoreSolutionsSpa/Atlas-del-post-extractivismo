# Guía de Integración con Base de Datos

> Documento que explica cómo la estructura de datos actual está preparada para migrar de datos en memoria a una base de datos real.

---

## 📋 Estado Actual: In-Memory Repository Pattern

### Arquitectura Actual (Escalable)

```
Componentes (React UI)
        ↓
   Custom Hooks (useCaseStudiesState, useZonasState)
        ↓
   Services (CaseStudiesService, ZonasService)
        ↓
   Repositories (inMemoryCaseStudiesRepository)
        ↓
   Data (atlasContent.js)
```

### Ventaja: **Fácil cambiar el Repositorio sin tocar Componentes**

---

## 🔄 Mapeo: Estructura Actual ↔ new-db.md

### Tabla `CasoDeEstudio` (Database)
```sql
Table CasoDeEstudio {
  id bigint [pk, increment]
  titulo string
  zonas Zona
  created_at timestamp
  updated_at timestamp
}
```

**Equivalente en `atlasContent.js`**:
```javascript
{
  id: 'provincia-choapa',              // ← id (string en memoria, bigint en BD)
  name: 'Provincia de Choapa',         // ← titulo
  title: 'Provincia de Choapa',        // Alias de 'name'
  location: 'Provincia de Choapa...',
  summary: 'Provincia minera...',
  // Relación zonas:
  // zones: [ { id: 'puerto-punta-chungo', ... }, ... ]  // Obtenidas separadamente
}
```

### Tabla `Zona` (Database)
```sql
Table Zona {
  id bigint [pk, increment]
  titulo string
  escenas Escena
  created_at timestamp
  updated_at timestamp
}
```

**Equivalente en `atlasContent.js`**:
```javascript
{
  id: 'puerto-punta-chungo',          // ← id
  caseId: 'provincia-choapa',         // ← Relación con CasoDeEstudio
  name: 'Puerto Punta Chungo',        // ← titulo
  title: 'Puerto Punta Chungo',       // Alias
  description: 'Infraestructura portuaria...',
  // Relación escenas:
  // scenes: [ { id: 'perturbacion-aerea', ... }, ... ]  // Obtenidas separadamente
}
```

### Tabla `Escena` (Database)
```sql
Table Escena {
  id bigint [pk, increment]
  titulo string
  tipoDeEscena TipoDeEscena
  elementos Elemento
  created_at timestamp
  updated_at timestamp
}
```

**Equivalente en `atlasContent.js`**:
```javascript
{
  id: 'perturbacion-aerea',           // ← id
  zoneId: 'puerto-punta-chungo',      // ← Relación con Zona
  name: 'Perturbación aérea',         // ← titulo
  title: 'Perturbación aérea',        // Alias
  theme: 'night',                     // Metadata adicional
  // Relación elementos:
  // elements: [ { id: 'jilguero', ... }, ... ]  // Obtenidas separadamente
}
```

### Tabla `Elemento` (Database)
```sql
Table Elemento {
  id bigint [pk, increment]
  titulo string
  tipoDeAfectacion TipoDeAfectacion
  descripcion string
  keywords Tags
  fuente string
  created_at timestamp
  updated_at timestamp
}
```

**Equivalente en `atlasContent.js`**:
```javascript
{
  id: 'jilguero',                     // ← id
  sceneId: 'perturbacion-aerea',      // ← Relación con Escena
  name: 'Ave abundante en zona',      // Equivalent a 'titulo'
  subtitle: 'Jilguero (Sicalis luteola)',
  affectationType: 'Afectación Biótica',  // ← tipoDeAfectacion (relación)
  image: '/img/jilguero-100.jpg',
  body: 'El jilguero destaca...',     // ← descripcion (parcial)
  source: 'Fuente: Minera Los Pelambres...', // ← fuente
  tags: ['fauna', 'aves', 'biotico']  // ← keywords
}
```

### Tabla `TipoDeAfectacion` (Database)
```sql
Table TipoDeAfectacion {
  id bigint [pk, increment]
  nombre string
  created_at timestamp
  updated_at timestamp
}
```

**Equivalente Actual**:
```javascript
// Actualmente hardcodeado como strings: 'biotic', 'anthropic', 'physical'
// En BD serán registros independientes

const affectationTypes = [
  { id: 1, nombre: 'Biotic' },
  { id: 2, nombre: 'Anthropic' },
  { id: 3, nombre: 'Physical' }
]
```

### Tabla `Tags` (Database)
```sql
Table Tags {
  id bigint [pk, increment]
  nombre string
  created_at timestamp
  updated_at timestamp
}
```

**Equivalente Actual**:
```javascript
// Actualmente inline en elemento.tags: ['fauna', 'aves', 'biotico']
// En BD serán registros independientes

const tags = [
  { id: 1, nombre: 'fauna' },
  { id: 2, nombre: 'aves' },
  { id: 3, nombre: 'biotico' }
]
// Y elemento tendrá: keywords: [1, 2, 3]  (IDs)
```

---

## 🚀 Plan de Migración: In-Memory → API/Database

### Fase 1: Crear Repositorio API (Sin Cambiar Nada)

**Crear nuevo archivo**:
```bash
touch atlas-react/src/casosDeEstudio/repo/apiCaseStudiesRepository.js
```

**Estructura**:
```javascript
// apiCaseStudiesRepository.js
export const apiCaseStudiesRepository = {
  async getById(id) {
    const response = await fetch(`/api/casos-de-estudio/${id}`)
    const data = await response.json()
    // Transformar datos de BD a formato interno
    return transformDatabaseToCaseStudy(data)
  },

  async getAll() {
    const response = await fetch(`/api/casos-de-estudio`)
    const data = await response.json()
    return data.map(transformDatabaseToCaseStudy)
  }
}
```

### Fase 2: Cambiar Repositorio en el Servicio

**Archivo**: `atlas-react/src/casosDeEstudio/services/caseStudiesService.js`

**Cambio Mínimo**:
```javascript
// Antes:
import { inMemoryCaseStudiesRepository } from '../repo/caseStudiesRepository'

// Después:
import { apiCaseStudiesRepository } from '../repo/apiCaseStudiesRepository'

export const caseStudiesService = new CaseStudiesService({
  caseStudiesRepository: apiCaseStudiesRepository  // ← SOLO CAMBIO AQUÍ
})
```

### Fase 3: Los Componentes No Cambian

```javascript
// CaseStudyDetailPage.jsx - EXACTAMENTE IGUAL
export function CaseStudyDetailPage() {
  const service = useMemo(
    () => new CaseStudiesService({
      caseStudiesRepository: apiCaseStudiesRepository  // ← Cambio invisible
    }),
    []
  )

  const [caseStudy, setCaseStudy] = useState(null)

  useEffect(() => {
    const data = await service.getById(caseStudyId)  // ← Igual para componente
    setCaseStudy(data)
  }, [])

  return <div>{caseStudy.title}</div>
}
```

---

## 📐 Transformación de Datos (Adapter Pattern)

### Función de Transformación

```javascript
/**
 * Transforma datos de BD a formato interno de la aplicación
 * @param {Object} dbData - Datos brutos de la API/BD
 * @returns {Object} - Formato compatible con componentes React
 */
function transformDatabaseToCaseStudy(dbData) {
  return {
    // IDs: BD usa bigint, convertir a string si es necesario
    id: String(dbData.id),

    // Mapeo directo
    name: dbData.titulo,
    title: dbData.titulo,
    location: dbData.location || '', // Campo adicional
    summary: dbData.summary || '',   // Campo adicional

    // Relaciones: Traídas por endpoints separados
    zones: dbData.zonas?.map(transformDatabaseToZone) || [],

    // Metadata para UI
    globalMap: buildGlobalMap(dbData),
    detailMap: buildDetailMap(dbData),

    // Timestamps
    createdAt: new Date(dbData.created_at),
    updatedAt: new Date(dbData.updated_at),
  }
}
```

---

## 🔐 Endpoints API Esperados (Backend)

### Casos de Estudio
```
GET    /api/casos-de-estudio                  // Lista todos
GET    /api/casos-de-estudio/{id}             // Obtiene caso específico
GET    /api/casos-de-estudio/{id}/zonas       // Obtiene zonas del caso
```

### Zonas
```
GET    /api/zonas                             // Lista todas
GET    /api/zonas/{id}                        // Obtiene zona específica
GET    /api/zonas/{id}/escenas                // Obtiene escenas de zona
```

### Escenas
```
GET    /api/escenas                           // Lista todas
GET    /api/escenas/{id}                      // Obtiene escena específica
GET    /api/escenas/{id}/elementos            // Obtiene elementos de escena
```

### Elementos
```
GET    /api/elementos                         // Lista todos
GET    /api/elementos/{id}                    // Obtiene elemento específico
GET    /api/elementos?tags={tagIds}           // Busca por tags
```

---

## ✅ Checklist: Preparación para BD

- [x] Estructura de datos sigue patrón Repository (agnóstico de source)
- [x] Services no conocen sobre fuente de datos
- [x] Componentes usan Services, no repositorios directamente
- [x] Datos en memoria están estructurados en 4 niveles jerárquicos
- [x] IDs son strings (fácil convertir de bigint a string)
- [x] Relaciones están claramente definidas
- [x] Campos adicionales (location, summary, theme) separables
- [x] Categorías (biotic, anthropic, physical) pueden ser enums o relaciones
- [x] Tags están listos para normalización en BD

---

## 🎯 Próximos Pasos (Sin Hacer Ahora)

1. **Backend**:
   - Implementar endpoints API con estructura especificada
   - Mapear campos de BD a estructura esperada
   - Implementar autenticación (si es necesario)

2. **Frontend**:
   - Crear `apiCaseStudiesRepository` y equivalentes para otros módulos
   - Implementar funciones `transformDatabase*` para cada entidad
   - Agregar manejo de errores de API
   - Agregar loading states y cache

3. **Testing**:
   - Tests de transformación de datos
   - Tests de llamadas a API
   - Verificar compatibilidad con componentes actuales

---

## 💡 Notas Importantes

### Por Qué Esta Arquitectura Escala

1. **Separation of Concerns**:
   - UI (Componentes) no sabe dónde vienen los datos
   - Services apenas sabe cómo acceder a datos
   - Repository solo sabe una forma de acceder

2. **Fácil Testeo**:
   - Puedo testear componentes con mock repository
   - Puedo testear servicios con datos fake
   - Puedo testear repositorio con API real

3. **Fácil Migración**:
   - Cambiar de in-memory a API: 1 línea en el servicio
   - Agregar caché: envolver el repositorio
   - Agregar offline support: middleware en repositorio

### Ejemplo: Agregar Caché Sin Cambiar Nada

```javascript
// wrapper-cacheRepository.js
export function createCachedRepository(baseRepository) {
  const cache = new Map()

  return {
    async getById(id) {
      if (cache.has(id)) return cache.get(id)
      const data = await baseRepository.getById(id)
      cache.set(id, data)
      return data
    },
    // ... otros métodos
  }
}

// En el servicio:
const repository = createCachedRepository(apiCaseStudiesRepository)
// Los componentes no se enteran, funciona igual
```

---

## 📚 Referencias

- **Patrón Repository**: Abstrae la fuente de datos
- **Patrón Service**: Lógica de negocio desacoplada
- **Patrón Adapter**: Transforma datos entre formatos
- **Patrón Decorator**: Agrega comportamiento (ej: caché)

Estos patrones hacen posible cambiar de in-memory a BD **sin tocar un solo componente React**.
