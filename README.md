# Atlas del Post-extractivismo

## Propósito del Proyecto

Atlas del Post-extractivismo es una plataforma interactiva de visualización de datos que documenta y analiza el impacto ecológico de actividades extractivistas en zonas específicas de América Latina. El proyecto mapea de manera visual y educativa cómo la fauna y flora autóctona se ve afectada por operaciones de extracción mineral, agrícola y de infraestructura.

Desarrollado por un equipo multidisciplinario de ingenieros ambientales y desarrolladores, este Atlas presenta información compleja de manera accesible, permitiendo a investigadores, educadores y ciudadanía general comprender las relaciones entre zonas de extracción y biodiversidad.

## Estructura del Proyecto

El proyecto está dividido en dos implementaciones:

### Implementación Original (HTML/CSS/JS)
Versión inicial con 41 páginas HTML interconectadas que demuestran el concepto. Incluye efectos visuales sofisticados como parallax, animaciones de radar pulsante, y transiciones de zoom.

Ubicación: Archivos `.html` en la raíz del proyecto

### Implementación Moderna (React)
Migración en progreso a React 19 con arquitectura escalable, animaciones con Framer Motion, y diseño responsivo con Tailwind CSS. Actualmente en fase de desarrollo (aproximadamente 15% completado).

Ubicación: `atlas-react/` directorio

## Tecnología

### Stack Actual (React)
- React 19.1.1
- React Router DOM 7.1.2 - Enrutamiento
- Framer Motion 12.23.24 - Animaciones
- Tailwind CSS 4.1.14 - Estilos
- Vite 7.1.7 - Build tool
- Vitest 2.1.8 - Testing

### Stack Original
- HTML5
- CSS3 (863 líneas)
- JavaScript Vanilla (459 líneas)
- Google Fonts (Inter, Baskervville)

## Instalación y Desarrollo

### Requisitos Previos
- Node.js 18+
- npm o yarn

### Instalación

```bash
cd atlas-react
npm install
```

### Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

### Tests

```bash
npm run test
```

## Arquitectura de Datos

El proyecto maneja una estructura jerárquica de datos:

```
Caso de Estudio (ej: Provincia de Choapa)
  └── Zonas (ej: Puerto Punta Chungo)
      └── Escenas (ej: Perturbación Aérea)
          └── Elementos (ej: Jilguero, Eucalipto, Luminaria)
```

Actualmente los datos están almacenados en:
- `atlas-react/src/shared/data/atlasContent.js` - Datos en memoria
- `context/old-db.csv` - Datos originales en CSV (96 filas)
- `context/new-db.md` - Esquema propuesto de base de datos

## Documentación de Desarrollo

La documentación técnica del proyecto se encuentra en la carpeta `context/`:

- **reusable-patterns.md** - Patrones de código reutilizable (Compound Components, Custom Hooks, Render Props)
- **component-catalog.md** - Catálogo de componentes disponibles y cómo reutilizarlos
- **data-architecture.md** - Arquitectura de datos, patrón Repository, Services Layer

Estos documentos explican cómo mantener código altamente reutilizable en todo el proyecto.

## Estructura del Repositorio

```
Atlas-del-post-extractivismo/
├── index.html                      Página principal (HTML original)
├── *.html                          41 páginas de contenido (HTML original)
├── style.css                       Estilos principales (HTML original)
├── script.js                       Lógica principal (HTML original)
├── img/                            Imágenes y activos
├── atlas-react/                    Implementación en React
│   ├── src/
│   │   ├── app/                   Rutas y configuración
│   │   ├── casosDeEstudio/        Módulo de casos de estudio
│   │   ├── zonas/                 Módulo de zonas
│   │   ├── escenas/               Módulo de escenas
│   │   ├── elementos/             Módulo de elementos
│   │   └── shared/                Código compartido
│   │       ├── design/            Componentes reutilizables
│   │       ├── hooks/             Custom hooks
│   │       ├── data/              Datos y factories
│   │       └── layout/            Layouts base
│   ├── vite.config.js
│   └── package.json
├── context/                        Documentación técnica
│   ├── reusable-patterns.md       Patrones de reutilización
│   ├── component-catalog.md       Catálogo de componentes
│   ├── data-architecture.md       Arquitectura de datos
│   ├── new-db.md                  Esquema de BD propuesto
│   └── old-db.csv                 Datos originales
└── README.md                       Este archivo
```

## Flujo de Navegación

El usuario navega a través de las diferentes capas de información:

1. Página de inicio - Presenta el concepto general
2. Selecciona un caso de estudio (Provincia de Choapa, etc.)
3. Visualiza el mapa interactivo del caso
4. Selecciona una zona específica (Puerto Punta Chungo, etc.)
5. Explora las escenas de esa zona (Perturbación Aérea, etc.)
6. Examina elementos individuales (especies afectadas, infraestructura)
7. Lee información detallada, fuentes académicas y relaciones

## Características Principales

### Visualización Interactiva
- Mapas interactivos con parallax basado en movimiento del mouse
- Puntos de radar pulsantes que indican zonas de extracción
- Transiciones suave entre diferentes niveles de información
- Zoom y navegación fluida

### Información Estructurada
- Categorización de elementos: Biótico, Antrópico, Físico
- Filtrado dinámico por tipo de afectación
- Palabras clave y etiquetado sistemático
- Fuentes académicas citadas

### Diseño Responsivo
- Interfaz adaptable a diferentes tamaños de pantalla
- Navegación mediante breadcrumbs en todas las páginas
- Gestos y interacciones intuitivas

### Datos Ricos
- Descripciones detalladas de especies y zonas
- Imágenes de alta calidad
- Información sobre tipos de afectación (hábitat, reproducción, alimentación, etc.)
- Referencias científicas

## Equipo

Desarrollado por un equipo multidisciplinario:
- Ingenieros Ambientales - Investigación y contenido
- Diseñadores - Conceptos visuales y diseño UX
- Desarrolladores Frontend - Implementación React
- Desarrolladores Full Stack - Arquitectura de datos

## Contribución

Las pautas para contribuir se encuentran en los documentos de la carpeta `context/`. Antes de implementar nuevas características:

1. Revisa `reusable-patterns.md` para entender los patrones del proyecto
2. Consulta `component-catalog.md` para ver componentes existentes
3. Sigue `data-architecture.md` para mantener datos desacoplados

## Roadmap

### Fase Actual (React - 15% completado)
- Migración de páginas HTML a componentes React
- Implementación de sistema de animaciones con Framer Motion
- Establecimiento de arquitectura escalable

### Próximas Fases
- Implementación completa de todas las escenas y elementos
- Integración con base de datos
- Sistema de filtrado avanzado
- Expansión a nuevos casos de estudio (Congo, Indonesia, Charleroi)
- API REST para acceso a datos

### Mejoras Futuras
- Soporte multiidioma
- Sistema de contribuciones de usuarios
- Búsqueda avanzada
- Exportación de datos
- Características PWA

## Licencia

Por definir

## Contacto

Para preguntas o sugerencias sobre el proyecto, contacta al equipo de desarrollo.

---

Última actualización: 2025-11-08
