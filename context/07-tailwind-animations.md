# Tailwind CSS v4 Custom Animations

## Problema
Tailwind v4 cambió de arquitectura. Las animaciones custom no funcionan con `tailwind.config.js` (sintaxis v3). Requiere `@theme` CSS-first directives.

## Solución Implementada

### 1. Archivo: `atlas-react/src/index.css`
Ubicar después de `@import 'tailwindcss'` pero antes de otros imports:

```css
@import 'tailwindcss';

@theme {
  --animate-rotate-clockwise: rotateClockwise 10s linear infinite;

  @keyframes rotateClockwise {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
```

**Por qué**: Tailwind v4 con `@tailwindcss/vite` requiere que las animaciones custom se definan dentro del bloque `@theme` en CSS, no en JavaScript.

### 2. Uso en Componentes

Referencia la clase en el HTML/JSX:
```jsx
<div className="animate-rotate-clockwise" />
```

### 3. Propiedades Clave

- **Variable**: `--animate-rotate-clockwise`
- **Valor**: `rotateClockwise 10s linear infinite`
- **Duración**: 10 segundos (360° en 10s = 36°/s)
- **Timing**: `linear` (velocidad constante)
- **Repetición**: `infinite`

## Archivos Relacionados

1. **atlas-react/src/index.css** (línea ~15-25)
   - Define el `@theme` con animación
   - Esta es la fuente única de verdad para la animación

2. **atlas-react/src/shared/ui/RotatingHotspot.jsx** (línea 58)
   - Componente que usa `animate-rotate-clockwise`
   - Dibuja círculo punteado con `border-dashed border-white`
   - Tamaño: `7vw` x `7vw`
   - Posicionamiento: Porcentajes (left/top) heredados de props

3. **atlas-react/tailwind.config.js**
   - NO contiene la definición de animación custom
   - Existe solo para configuración base de Tailwind
   - Las animaciones custom deben ir en index.css con `@theme`

## Responsividad

- Ancho/alto: `7vw` (viewport width, escala con pantalla)
- Posición: Porcentajes (left: "75%", top: "55%")
- Mantiene proporciones al abrir/cerrar DevTools
- Motivo: `7vw` es relativo al viewport, los porcentajes son relativos al contenedor padre

## Diferencias v3 vs v4

| Aspecto | v3 | v4 |
|---------|----|----|
| Config | `tailwind.config.js` | `CSS @theme` |
| Animaciones custom | `theme.extend.animation` | `@theme { --animate-... }` |
| Ubicación | JavaScript | index.css |
| Keyframes | En `theme.extend.keyframes` | En `@keyframes` dentro `@theme` |

## Depuración

Si la animación no aparece:
1. Verificar que `index.css` tenga el `@theme` block
2. Verificar que sea DESPUÉS de `@import 'tailwindcss'`
3. Verificar que el nombre de la clase coincida: `animate-rotate-clockwise`
4. Revisar DevTools > Elements > Styles para ver si la clase está siendo aplicada
5. Revisar DevTools > Elements > Computed para ver la animación CSS resultante
