# Plan — Tanda 1: Accesibilidad Crítica (Focus + Touch targets)

## Contexto

La auditoría UI/UX del sitio del Centro de Pensamiento de Ruta N identificó 13 problemas
agrupados en 3 categorías (Críticos, Alta, Media). El usuario pidió avanzar **por
categorías, de a poco**, y eligió empezar por los **Críticos**. Esta tanda resuelve
únicamente los dos problemas críticos, que son reales pero **acotados** (no sistémicos):

1. **Focus rings faltantes.** El foco global está roto: la regla `[data-focus-visible]`
   en `App.tsx:3417` está muerta (ese atributo no lo aplica nadie) y el reset de
   `-webkit-tap-highlight-color` (`App.tsx:3423-3425`) elimina la retroalimentación
   nativa. El sitio depende de clases `focus-visible:ring-*` por elemento, y ~8 elementos
   de navegación/CTA quitan el outline sin reemplazarlo → foco invisible al navegar con teclado.
2. **Touch targets < 44px.** El header/drawer móvil ya está bien (44px inline), pero
   varios chips de filtro, botones "skip", y botones de icono (cerrar/limpiar) quedan por
   debajo del mínimo de 44px exigido por las guías (WCAG 2.2 AA / guideline §13).

Resultado esperado: navegación por teclado con foco siempre visible y todos los controles
interactivos con área táctil ≥44px, sin regresiones visuales.

## Enfoque

Dos sub-pasos. Primero un **fallback global de foco** (una sola regla, elimina la mayoría
del problema de raíz), luego **fixes puntuales** en los elementos que anulan el outline o
son pequeños.

### Paso 1 — Fallback global de `:focus-visible` (raíz del problema)

En el bloque `<style>` de `App.tsx` (~L3411-3441), reemplazar la regla muerta
`[data-focus-visible] {…}` (`App.tsx:3417`) por una regla real:

```css
:focus-visible { outline: 2px solid #C0D400; outline-offset: 2px; border-radius: 2px; }
```

Esto da anillo de foco a **cualquier** control que no defina el suyo, aprovechando el
token de marca `--ring: #C0D400` ya existente en `theme.css`. Los elementos que usan
`focus:outline-none` / `focus-visible:outline-none` seguirán anulándolo → se corrigen en
el Paso 2.

### Paso 2 — Fixes puntuales de focus (elementos que anulan el outline)

Añadir `focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-offset-2`
(o quitar el `outline-none` para heredar el fallback) en:

- `App.tsx:1467` — botón "Desplázate hacia abajo" (tiene `focus-visible:outline-none` sin reemplazo).
- `App.tsx:1925` — botón "Volver al inicio de la sección" (skip-up, sin focus).
- `App.tsx:1963` — botón "Saltar esta sección" (skip-down, sin focus).
- `App.tsx:2772` — botón "Cerrar resultados" (sin focus).
- `AnalisisPage.tsx:449` — enlace-título de card (`focus:outline-none` sin reemplazo).
- `AnalisisPage.tsx:1206` — input del chat (`focus:outline-none` sin reemplazo).
- `DataPage.tsx:609` — botón limpiar búsqueda (sin focus).
- `DataPage.tsx:736` — enlace "Descargar" (`focus-visible:outline-none` sin reemplazo).

### Paso 3 — Touch targets ≥ 44px

Patrón: garantizar altura/anchura mínima sin romper el layout visual. Para botones de
icono usar `min-h-11 min-w-11` (44px) + centrado flex; para chips/enlaces de texto subir
padding vertical o `min-h-11`. Elementos:

- `App.tsx:834` — cerrar búsqueda desktop (`p-1`, ~28px) → `min-h-11 min-w-11`.
- `App.tsx:844` — abrir búsqueda desktop (~40px) → `min-h-11 min-w-11`.
- `App.tsx:1925` / `App.tsx:1963` — botones skip (~26px alto) → subir `py` a `min-h-11`
  (o `py-2.5`) manteniendo `fontSize:11`.
- `App.tsx:2772` — cerrar resultados (~36px) → `min-h-11 min-w-11`.
- `AnalisisPage.tsx:374, 380, 385` — chips de filtro (tipo/tema/año, ~26px) → `min-h-11`
  (o `py-2`), verificando que la fila de chips no rompa en móvil.
- `AnalisisPage.tsx:404` — select de orden → `min-h-11`.
- `AnalisisPage.tsx:389, 429` — enlaces "limpiar filtros" (texto puro) → `min-h-11 inline-flex items-center`.
- `AnalisisPage.tsx:1181` — botón `text-[11px]` → `min-h-11`.
- `DataPage.tsx:609` — limpiar búsqueda (icono 16px, sin padding) → `min-h-11 min-w-11`.
- `DataPage.tsx:626` — select filtro (bajo) → `min-h-11`.
- `ComprasPage.tsx:283` — enlace texto (sin padding vertical) → `min-h-11 inline-flex items-center`.
- `ComprasPage.tsx:1215` — botón `px-3 py-2 text-xs` (~32px) → `min-h-11`.

Nota de fidelidad de marca: no cambiar copy, colores ni tipografías; solo tamaño/espaciado
y estados de foco. Usar exclusivamente `#C0D400` (token `--ring`) para el anillo.

## Archivos a modificar

- `src/app/App.tsx` — regla global de foco (Paso 1) + focus/touch puntuales.
- `src/app/pages/AnalisisPage.tsx` — focus + chips/enlaces de filtro.
- `src/app/pages/DataPage.tsx` — focus + touch de botones de icono y selects.
- `src/app/pages/ComprasPage.tsx` — touch de enlaces/botones de texto.

(No se toca `theme.css`; el token `--ring: #C0D400` ya existe y se reutiliza.)

## Fuera de alcance (tandas siguientes)

- Categoría B (GSAP cleanup + `prefers-reduced-motion`).
- Categoría C (ARIA `aria-current` en FloatingNav, `aria-label` en DataPage, CLS del logo).

## Verificación

1. `npm run build` (o `npm run dev`) sin errores de TS/compilación.
2. Teclado: `Tab` por header desktop, buscador, chips de filtro en Análisis, botones de
   Data y skip del hero → cada elemento muestra anillo lima `#C0D400` visible.
3. Móvil (DevTools 390px y 360px): inspeccionar chips de filtro, cerrar/limpiar y botones
   skip → caja de layout ≥ 44×44px; sin overflow horizontal ni salto de fila inesperado.
4. Revisión visual desktop 1440/1280px: los cambios de padding no descuadran filas de chips
   ni el header.
