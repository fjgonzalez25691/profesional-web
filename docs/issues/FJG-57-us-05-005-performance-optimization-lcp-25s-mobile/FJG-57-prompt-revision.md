# FJG-57: Prompt Revisión – Performance Optimization LCP <2.5s Mobile

**Rol**: Agent Reviewer  
**Fecha Planning**: 2025-12-09  
**Story Points**: 2 SP  
**Prioridad**: 🟡 Medium

---

## Objetivo de la Revisión

Verificar que la implementación de optimización de performance (imágenes WebP, lazy loading, font optimization, code splitting, edge caching) cumple **100% con la especificación Linear FJG-57**, logra Core Web Vitals objetivo (LCP <2.5s, FID <100ms, CLS <0.1), y mantiene bundle <200KB sin agregar librerías de monitoring innecesarias (anti-camello).

---

## Checklist de Revisión

### 1. Image Optimization

- [ ] **Hero image** convertida a WebP (<80KB).
- [ ] Hero image usa `next/image` con `priority` flag.
- [ ] Hero image tiene `width` y `height` explícitos (evita CLS).
- [ ] Hero image tiene `blurDataURL` placeholder real (no dummy).
- [ ] **Imágenes casos** convertidas a WebP (<50KB cada una).
- [ ] Imágenes casos usan `loading="lazy"` (default Next.js Image).
- [ ] **OG Image** se mantiene PNG (requerido Open Graph).
- [ ] No quedan imágenes JPG/PNG sin optimizar en `public/`.

**Validación**:
```bash
ls -lh profesional-web/public/*.webp
# hero-image.webp <80KB
# casos/*.webp <50KB cada una
```

---

### 2. Font Optimization

- [ ] `next/font/google` configurado en `app/layout.tsx`.
- [ ] Font family: `Inter`.
- [ ] `display: 'swap'` configurado (evita FOIT).
- [ ] `preload: true` configurado.
- [ ] `subsets: ['latin']` (no incluir subsets innecesarios).
- [ ] `weight` solo incluye pesos usados (400, 600, 700).
- [ ] Variable CSS `--font-inter` aplicada en `<html>`.
- [ ] `app/globals.css` usa `font-family: var(--font-inter), sans-serif`.

**Validación Lighthouse**: "Font display: swap" ✅, no warnings de font loading.

---

### 3. Code Splitting – Lazy Loading

- [ ] Chatbot modal usa `next/dynamic` con `ssr: false`.
- [ ] Chatbot modal tiene `loading` fallback (no blank).
- [ ] Chatbot modal se carga solo cuando `isOpen === true`.
- [ ] Calculadora ROI (si es modal) usa lazy loading similar.
- [ ] No hay imports sincrónicos de componentes pesados (>20KB).

**Validación**:
- Network tab: Chatbot bundle NO aparece en carga inicial.
- Bundle analyzer: Chatbot separado en chunk propio.

---

### 4. Bundle Analysis

- [ ] `npm run build` ejecutado sin errores.
- [ ] **First Load JS** <200KB para ruta `/`.
- [ ] Rutas adicionales (`/calculadora-roi`, `/legal/*`) <250KB.
- [ ] No dependencies duplicadas (verificar con bundle analyzer).
- [ ] No Moment.js, Lodash completo, o librerías >50KB sin justificar.

**Output esperado**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB        ~150 kB
├ ○ /calculadora-roi                    12.8 kB        ~180 kB
└ ○ /legal/aviso-legal                   1.1 kB        ~145 kB

First Load JS shared by all            ~144 kB
```

**Rechazar si**: First Load JS >200KB sin justificación documentada.

---

### 5. Edge Caching

- [ ] `app/page.tsx` tiene `export const revalidate = 3600` (1 hora).
- [ ] Páginas legales tienen `export const dynamic = 'force-static'`.
- [ ] Páginas legales tienen `export const revalidate = 86400` (24 horas).
- [ ] Headers Vercel incluyen `cache-control: s-maxage=3600` (validar en staging).

**Validación**:
```bash
curl -I https://fjgaparicio.es | grep cache-control
# Debe incluir s-maxage o max-age
```

---

### 6. Lighthouse CI – GitHub Actions

- [ ] Archivo `.github/workflows/lighthouse.yml` creado.
- [ ] Workflow ejecuta en `pull_request` a `main`.
- [ ] URLs testeadas: home (`/`) y calculadora (`/calculadora-roi`).
- [ ] Action usa `treosh/lighthouse-ci-action@v10`.
- [ ] Artifacts subidos (`uploadArtifacts: true`).
- [ ] Server espera con `wait-on http://localhost:3000`.

**Validación**: PR muestra comentario Lighthouse CI con scores.

---

### 7. Core Web Vitals

- [ ] **LCP** <2.5s en Lighthouse mobile throttled 4G.
- [ ] **FID** <100ms (o INP <200ms en Lighthouse moderno).
- [ ] **CLS** <0.1.
- [ ] **Performance Score** >85 mobile.
- [ ] **Performance Score** >90 desktop (opcional, bonus).

**Herramientas validación**:
- Lighthouse Chrome DevTools (mobile throttling).
- [PageSpeed Insights](https://pagespeed.web.dev/).
- Lighthouse CI en PR.

**Rechazar si**: LCP >2.5s o Performance Score <85 sin plan de mejora.

---

### 8. Tests Unitarios (`performance.test.ts`)

- [ ] Archivo creado en `profesional-web/__tests__/performance.test.ts`.
- [ ] Test 1: Verifica First Load JS <200KB (simulated).
- [ ] Test 2: Verifica hero image <80KB.
- [ ] Test 3: Verifica imágenes casos <50KB cada una.
- [ ] **3/3 tests pasan** en `npm run test`.

---

### 9. Tests E2E (`performance.spec.ts`)

- [ ] Archivo creado en `profesional-web/__tests__/e2e/performance.spec.ts`.
- [ ] Test 1: Home carga en <3s (simulated 4G).
- [ ] Test 2: Hero image tiene `fetchpriority="high"`.
- [ ] Test 3: Chatbot NO está en initial bundle.
- [ ] Test 4: Fonts usan `display: swap`.
- [ ] **4/4 tests pasan** en `npm run test:e2e`.

---

### 10. Build y Linter

- [ ] `npm run build` exitoso sin errores TypeScript.
- [ ] `npm run lint` sin warnings ESLint.
- [ ] No se agregaron librerías de monitoring (Sentry, New Relic, Datadog) sin aprobación.
- [ ] Bundle size no aumentó >50KB respecto a branch anterior (verificar diff).

---

## Puntos Críticos de Revisión (Anti-Camello)

### ⚠️ Riesgo 1: Librerías de Monitoring Innecesarias
**Verificar**: `package.json` NO debe contener `@sentry/nextjs`, `newrelic`, `datadog`.  
**Razón**: MVP no requiere APM completo. Vercel Analytics + Lighthouse CI suficiente.

### ⚠️ Riesgo 2: Imágenes No Optimizadas
**Verificar**: Hero image <80KB, casos <50KB. Si >100KB, comprimir más.  
**Razón**: LCP depende directamente del tamaño hero image. 100KB 4G = ~800ms solo descarga.

### ⚠️ Riesgo 3: Font Weights Innecesarios
**Verificar**: Solo pesos 400, 600, 700 en `next/font/google`.  
**Razón**: Cada peso adicional = +15KB. No incluir 100, 200, 300, 800, 900 si no se usan.

### ⚠️ Riesgo 4: Chatbot en Initial Bundle
**Verificar**: Network tab muestra chatbot chunk carga SOLO después de click botón.  
**Razón**: Chatbot modal (~30KB) no necesario para First Paint. Lazy load crítico.

### ⚠️ Riesgo 5: BlurDataURL Placeholder Dummy
**Verificar**: `blurDataURL` NO debe ser string vacío ni placeholder genérico.  
**Razón**: Placeholder real mejora UX y reduce CLS durante carga imagen.

---

## Resultados Esperados

### Tests
- **Unitarios**: 3/3 pasando (`performance.test.ts`).
- **E2E**: 4/4 pasando (`performance.spec.ts`).
- **Build**: `npm run build` exitoso, First Load JS <200KB.
- **Linter**: Sin warnings.

### Performance
- **Lighthouse Mobile**: Performance >85, LCP <2.5s, FID <100ms, CLS <0.1.
- **Bundle Size**: First Load JS <200KB (home), <250KB (calculadora).
- **Image Sizes**: Hero <80KB, casos <50KB cada.

### CI/CD
- **Lighthouse CI**: Workflow ejecuta en PRs, sube artifacts.
- **GitHub Actions**: Badge verde en PR checks.

---

## Acciones Requeridas Si Fallan Checks

| Check Fallido | Acción Correctiva |
|---------------|-------------------|
| Hero image >80KB | Comprimir WebP con TinyPNG o reducir dimensiones |
| LCP >2.5s | Verificar `priority` flag en hero image, eliminar render-blocking scripts |
| CLS >0.1 | Agregar `width`/`height` explícitos a todas las imágenes |
| Chatbot en initial bundle | Asegurar `next/dynamic` con `ssr: false` |
| First Load JS >200KB | Usar bundle analyzer, eliminar dependencies pesadas |
| Font display no swap | Verificar `display: 'swap'` en `next/font/google` config |
| Tests E2E fallan | Ajustar timeouts Playwright o verificar server local |
| Lighthouse CI no ejecuta | Verificar `wait-on` timeout, aumentar a 60s si necesario |

---

## Aprobación Final

**Reviewer aprueba si**:
- ✅ 10/10 checks pasados.
- ✅ Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1.
- ✅ Performance Score >85 mobile.
- ✅ Tests 7/7 pasando (3 unitarios + 4 E2E).
- ✅ Bundle <200KB.
- ✅ Lighthouse CI workflow funcional.

**Rechazar si**:
- ❌ LCP >2.5s sin plan de mejora.
- ❌ Hero image >100KB (bloquea LCP crítico).
- ❌ Chatbot en initial bundle (no lazy loading).
- ❌ Se agregó librería de monitoring sin justificar.
- ❌ First Load JS >250KB sin documentar por qué.

---

**Commit esperado después de aprobación**:
```
perf(FJG-57): optimizacion performance LCP <2.5s mobile

- Hero image WebP con priority flag (LCP)
- Imagenes casos WebP lazy loading
- Fonts next/font/google con display swap
- Chatbot lazy loaded con next/dynamic
- Edge caching home 1h, legales 24h
- Lighthouse CI workflow GitHub Actions
- Tests: performance.test.ts (3/3), performance.spec.ts (4/4)
- Bundle First Load JS <200KB

Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1

Closes FJG-57
```
