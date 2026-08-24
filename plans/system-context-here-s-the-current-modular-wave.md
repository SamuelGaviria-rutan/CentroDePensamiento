# Plan de optimización (Fase 1 — ganancias seguras) — Centro de Pensamiento Ruta N

## Contexto

El proyecto funciona pero se ha vuelto pesado en tiempo de carga. La causa raíz es el tamaño del bundle inicial, no código "lento":

- **Todas las páginas se importan estáticamente** (`src/app/App.tsx:43–48`) y **no hay `React.lazy` ni `Suspense`**. Las 6 páginas grandes (Documentacion 1341, Analisis 1266, Compras 1242, Data 764, Lab 669, Blog 545 líneas) + las páginas inline de App.tsx viajan en el bundle inicial → primera carga lenta.
- **Assets duplicados**: `src/imports/Nova_frontview.png` (1.2 MB) es un duplicado exacto (mismo md5) de `Nova_frontview-1.png`; solo se usa el `-1` (en `AnalisisPage.tsx:4`).
- **Dependencias grandes sin uso**: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` **no se usan en ninguna parte de `src/`** (grep sin resultados).
- **Sin `manualChunks`** en `vite.config.ts`: todo el vendor pesado (gsap, recharts, radix) va en un solo chunk.

Objetivo: reducir el tiempo de carga **sin cambiar aspecto visual, contenido ni comportamiento**, y sin introducir errores. El usuario eligió limitarse a la Fase 1 (bajo riesgo); NO se hará refactor de `App.tsx` ni cambios de memoización en esta iteración.

## Cambios

### 1. Eliminar PNG duplicado
Borrar `src/imports/Nova_frontview.png` (no referenciado; duplicado exacto de `-1`). Verificar antes con grep que no hay ninguna referencia a `Nova_frontview.png` sin el sufijo. Ahorra ~1.2 MB del bundle emitido.

### 2. Code-splitting por ruta con `React.lazy` + `Suspense`
En `src/app/App.tsx`:
- Convertir los imports estáticos (líneas 43–48) a `lazy`. Como los exports son **nombrados**, usar el patrón:
  ```tsx
  const AnalisisCTIPage = lazy(() => import("./pages/AnalisisPage").then(m => ({ default: m.AnalisisCTIPage })));
  ```
  Igual para `LabPoliticasPage`, `DocumentacionPage`, `ComprasPage`, `BlogPage`, `DataPage`.
- Añadir `lazy` y `Suspense` al import de React (línea 13–18).
- Envolver el `<Outlet />` dentro de `RootLayout` (`App.tsx:3245`) en `<Suspense fallback={<LoadingFallback />}>`.
- Crear un componente `LoadingFallback` sencillo que muestre el mensaje oficial de las guidelines: **"Reuniendo la información…"**, respetando `prefers-reduced-motion` (sin animación de spinner si el usuario lo pide; un texto centrado con los colores de marca).
- Resultado: cada página se descarga solo al navegar a ella.

Nota: las páginas inline (HomePage, RadarCTIPage, RankingsPage) siguen en App.tsx en esta fase; no se extraen (eso sería Fase 2, descartada). El code-splitting aplica a las 6 páginas externas.

### 3. Eliminar dependencias no usadas
Quitar de `package.json` `dependencies`: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`. Verificar de nuevo con `grep -rn "@mui\|@emotion" src` (debe estar vacío) antes de quitarlas. Correr `pnpm install` para actualizar el lockfile.

### 4. `vite.config.ts` — `manualChunks`
Añadir `build.rollupOptions.output.manualChunks` separando vendor pesado (`gsap`, `recharts`, radix) en chunks propios para mejor cache y carga paralela. No tocar los `plugins`, `resolve.alias` ni `assetsInclude` existentes.

## Archivos a modificar

- `src/app/App.tsx` — lazy imports + Suspense + componente `LoadingFallback`.
- `vite.config.ts` — `manualChunks`.
- `package.json` — quitar MUI/emotion; `pnpm install`.
- Borrar: `src/imports/Nova_frontview.png`.

## Restricciones (guidelines)

- No cambiar contenido visible, copys, colores de marca ni tipografías.
- Usar el mensaje oficial "Reuniendo la información…" para el estado de carga.
- Respetar `prefers-reduced-motion` en el fallback de Suspense.
- No tocar archivos protegidos ni `theme.css`/tokens.
- No arrancar ni construir el dev server manualmente (ya corre); no usar URLs localhost.

## Verificación

1. La app compila sin errores; revisar en la superficie de preview (no localhost).
2. Navegar cada ruta (Home, Radar CTI, Rankings, Data, Análisis, Lab/Documentación/Compras, Blog, Nova, 404) y confirmar que se ve **idéntica** y que las animaciones GSAP corren.
3. Confirmar que al navegar a una de las 6 páginas externas aparece brevemente el fallback "Reuniendo la información…" y luego la página (code-splitting funcionando).
4. Verificar desktop (1440/1280/1024) y móvil (390/360): sin overflow; header, drawer y "Pulso CTI" (enlace externo) siguen funcionando.
5. Confirmar que quitar MUI/emotion no rompe nada (grep previo vacío + la app carga).
