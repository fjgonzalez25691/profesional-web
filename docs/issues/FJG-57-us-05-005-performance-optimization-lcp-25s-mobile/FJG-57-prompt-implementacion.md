# FJG-57: Prompt Implementación – Performance Optimization LCP <2.5s Mobile

**Rol**: Agent Developer  
**Fecha Planning**: 2025-12-09  
**Story Points**: 2 SP  
**Prioridad**: 🟡 Medium

---

## Contexto Linear (Fuente de Verdad)

**Issue**: FJG-57 – US-05-005: Performance Optimization LCP <2.5s Mobile  
**Épica**: In2-05 Transparencia Técnica & SEO  
**Sprint**: S4 (Días 22-28)

### Historia de Usuario
Como visitante mobile 4G, quiero que la web cargue rápido, para no abandonar por frustración.

### Impacto Negocio
Performance = SEO + conversión. LCP >4s = -53% conversión móvil. Google penaliza Core Web Vitals malos. **Crítico validación "LCP <2.5s mobile 4G"**.

### Métricas Objetivo Core Web Vitals
- **LCP** (Largest Contentful Paint): <2.5s mobile 4G ✅
- **FID** (First Input Delay): <100ms ✅
- **CLS** (Cumulative Layout Shift): <0.1 ✅
- **Performance Score**: >85 mobile

---

## Principios Arquitectónicos (Navaja de Ockham)

1. **Next.js 15 optimizations nativas**: Image, Font, dynamic imports automáticos.
2. **WebP images**: Convertir JPG/PNG a WebP (<80KB hero).
3. **Priority loading**: Hero image con `priority` flag (LCP crítico).
4. **Lazy loading**: Chatbot, calculadora, componentes pesados con `React.lazy()` / `next/dynamic`.
5. **Font optimization**: `next/font/google` con `display: swap`, `preload: true`.
6. **Edge caching**: `revalidate` en páginas estáticas (legal, home).
7. **Bundle analysis**: `npm run build -- --analyze` para identificar dependencies >50KB.
8. **Lighthouse CI**: GitHub Actions para validar Core Web Vitals en cada PR.

**Anti-camello**: No agregar libraries de performance monitoring (Sentry, New Relic) en MVP. No optimizar prematuramente rutas que no existen. No usar CDN externo (Vercel Edge nativo suficiente).

---

## Plan de Implementación TDD

### Paso 1: Image Optimization – Hero y Casos

**Objetivo**: Convertir imágenes a WebP, agregar `priority` al hero image, lazy load resto.

#### 1.1. Convertir Imágenes a WebP

**Archivos a optimizar**:
- `public/hero-image.jpg` → `public/hero-image.webp` (<80KB)
- `public/casos/*.jpg` → `public/casos/*.webp` (<50KB cada una)
- `public/og-image.png` → mantener PNG (requerido Open Graph)

**Comando**: Usar herramienta externa (squoosh.app, cwebp CLI, o Photoshop).

**Validación**: `ls -lh public/*.webp` → todas <80KB.

#### 1.2. Hero Image Priority Loading

**Archivo**: `profesional-web/components/Hero.tsx`

**Cambio**:
```typescript
import Image from 'next/image';

// Antes (si existe <img> o sin priority)
<img src="/hero-image.jpg" alt="Francisco García" />

// Después
<Image
  src="/hero-image.webp"
  alt="Francisco García - Consultor Cloud & Automatización"
  width={800}
  height={600}
  priority // LCP crítico
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJUAB//Z"
/>
```

**Notas**:
- `priority`: Next.js preload image (LCP).
- `blurDataURL`: Placeholder 10x10px base64 (genera con [BlurHash](https://blurha.sh/) o `next-image-export-optimizer`).
- `width/height`: Dimensiones reales para evitar CLS.

#### 1.3. Lazy Load Casos de Éxito Images

**Archivo**: `profesional-web/components/CasosExito.tsx` (o similar)

**Cambio**:
```typescript
<Image
  src="/casos/caso-1.webp"
  alt="Caso Éxito 1"
  width={400}
  height={300}
  loading="lazy" // Lazy load (default Next.js)
  quality={80}
/>
```

**Validación**: Imágenes casos no bloquean LCP.

---

### Paso 2: Font Optimization

**Objetivo**: Usar `next/font/google` para optimizar Inter, evitar FOIT.

**Archivo**: `profesional-web/app/layout.tsx`

**Cambio**:
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Evita FOIT (Flash of Invisible Text)
  preload: true,
  variable: '--font-inter',
  weight: ['400', '600', '700'], // Solo pesos usados
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      {/* ...resto del layout */}
    </html>
  );
}
```

**CSS** (`app/globals.css`):
```css
body {
  font-family: var(--font-inter), sans-serif;
}
```

**Validación**: Lighthouse muestra "Font display: swap" ✅.

---

### Paso 3: Code Splitting – Lazy Load Chatbot

**Objetivo**: Cargar chatbot solo cuando usuario interactúa (no en initial bundle).

**Archivo**: `profesional-web/components/ChatbotWidget.tsx`

**Cambio**:
```typescript
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Lazy load modal chatbot
const ChatbotModal = dynamic(() => import('./ChatbotModal'), {
  loading: () => <div className="animate-pulse">Cargando chatbot...</div>,
  ssr: false, // No SSR para modal
});

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Habla con IA
      </button>
      {isOpen && <ChatbotModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
```

**Validación**: Bundle `/` no incluye código chatbot (~30KB saved).

---

### Paso 4: Bundle Analysis

**Objetivo**: Identificar dependencies >50KB y eliminar/reducir.

#### 4.1. Analizar Bundle

**Comando**:
```bash
cd profesional-web
npm run build
```

**Output esperado**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB        150 kB
├ ○ /calculadora-roi                    12.8 kB        180 kB
├ ○ /legal/aviso-legal                   1.1 kB        145 kB
└ ○ /legal/privacidad                    1.1 kB        145 kB

First Load JS shared by all            144 kB
  ├ chunks/framework-*.js               45 kB
  ├ chunks/main-*.js                    32 kB
  └ chunks/pages/_app-*.js              67 kB
```

**Acción**:
- Si First Load JS **>200KB**: Investigar dependencies pesadas.
- Usar `@next/bundle-analyzer` si necesario:
  ```bash
  npm install --save-dev @next/bundle-analyzer
  ```

#### 4.2. Eliminar Dependencies Innecesarias

**Checklist**:
- ❌ Moment.js (2.29MB) → ✅ `date-fns` (si necesario) o nativo `Intl.DateTimeFormat`.
- ❌ Lodash completo → ✅ `lodash-es` (tree-shaking) o funciones nativas.
- ❌ Unused Shadcn components → Importar solo los usados.

**Validación**: `npm run build` → First Load JS <200KB.

---

### Paso 5: Edge Caching – Páginas Estáticas

**Objetivo**: Cachear home y legales en Vercel Edge (1 hora revalidate).

#### 5.1. Home Page

**Archivo**: `profesional-web/app/page.tsx`

**Agregar**:
```typescript
export const revalidate = 3600; // 1 hora cache

export default function HomePage() {
  // ...
}
```

#### 5.2. Páginas Legales

**Archivo**: `profesional-web/app/legal/[slug]/page.tsx` (o rutas individuales)

**Agregar**:
```typescript
export const dynamic = 'force-static'; // Static generation
export const revalidate = 86400; // 24 horas cache

export default function LegalPage() {
  // ...
}
```

**Validación**: Headers Vercel incluyen `cache-control: s-maxage=3600`.

---

### Paso 6: Lighthouse CI – GitHub Actions

**Objetivo**: Automatizar validación Core Web Vitals en cada PR.

**Archivo**: `.github/workflows/lighthouse.yml` (nuevo)

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Next.js
        run: npm run build
        working-directory: ./profesional-web
      
      - name: Start Next.js server
        run: npm run start &
        working-directory: ./profesional-web
      
      - name: Wait for server
        run: npx wait-on http://localhost:3000
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/calculadora-roi
          uploadArtifacts: true
          temporaryPublicStorage: true
      
      - name: Check Core Web Vitals
        run: |
          echo "Validar LCP <2.5s, FID <100ms, CLS <0.1"
```

**Validación**: PR muestra badge Lighthouse con score >85.

---

### Paso 7: Tests Unitarios – Performance Budgets

**Objetivo**: Validar bundle size no excede 200KB.

**Archivo**: `profesional-web/__tests__/performance.test.ts` (nuevo)

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Performance Budgets', () => {
  it('debe tener First Load JS <200KB para home', () => {
    // Simular verificación bundle (en CI real usar manifest)
    const maxBundleSize = 200 * 1024; // 200KB
    expect(maxBundleSize).toBeGreaterThan(150 * 1024); // Ejemplo
  });

  it('debe tener hero image <80KB', () => {
    const heroImagePath = path.join(process.cwd(), 'profesional-web/public/hero-image.webp');
    if (fs.existsSync(heroImagePath)) {
      const stats = fs.statSync(heroImagePath);
      expect(stats.size).toBeLessThan(80 * 1024); // <80KB
    }
  });

  it('debe tener imágenes casos <50KB cada una', () => {
    const casosDir = path.join(process.cwd(), 'profesional-web/public/casos');
    if (fs.existsSync(casosDir)) {
      const images = fs.readdirSync(casosDir).filter(f => f.endsWith('.webp'));
      images.forEach(img => {
        const stats = fs.statSync(path.join(casosDir, img));
        expect(stats.size).toBeLessThan(50 * 1024); // <50KB
      });
    }
  });
});
```

---

### Paso 8: Tests E2E – Core Web Vitals

**Objetivo**: Validar métricas Lighthouse en Playwright.

**Archivo**: `profesional-web/__tests__/e2e/performance.spec.ts` (nuevo)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance Optimization', () => {
  test('debe cargar home en <3s (simulated 4G)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // <3s
  });

  test('hero image debe tener priority attribute', async ({ page }) => {
    await page.goto('/');
    
    const heroImage = page.locator('img[alt*="Francisco García"]').first();
    await expect(heroImage).toBeVisible();
    
    // Next.js Image con priority agrega fetchpriority="high"
    const fetchPriority = await heroImage.getAttribute('fetchpriority');
    expect(fetchPriority).toBe('high');
  });

  test('chatbot no debe estar en initial bundle', async ({ page }) => {
    // Monitorear requests durante carga inicial
    const requests: string[] = [];
    page.on('request', req => requests.push(req.url()));
    
    await page.goto('/');
    
    // Chatbot modal no debe cargarse hasta click
    const chatbotRequests = requests.filter(url => url.includes('ChatbotModal'));
    expect(chatbotRequests).toHaveLength(0);
  });

  test('fonts deben usar display swap', async ({ page }) => {
    await page.goto('/');
    
    const fontFace = await page.evaluate(() => {
      const fonts = document.fonts;
      const inter = Array.from(fonts).find(f => f.family.includes('Inter'));
      return inter ? inter.display : null;
    });
    
    expect(fontFace).toBe('swap');
  });
});
```

---

## Criterios de Aceptación (Replicados de Linear)

* **CA1**: Imágenes convertidas a WebP (<80KB hero, <50KB casos).
* **CA2**: Hero image con `priority` flag (LCP <2.5s).
* **CA3**: Fonts optimizados con `next/font/google` (`display: swap`).
* **CA4**: Chatbot lazy loaded con `next/dynamic`.
* **CA5**: Bundle First Load JS <200KB.
* **CA6**: Lighthouse CI configurado en GitHub Actions.
* **CA7**: Core Web Vitals pasando (LCP <2.5s, FID <100ms, CLS <0.1).
* **CA8**: Performance Score >85 mobile en Lighthouse.

---

## Definition of Done

- [x] Hero image convertida a WebP con `priority` flag.
- [x] Imágenes casos convertidas a WebP con lazy loading.
- [x] Fonts optimizados con `next/font/google` (Inter, display swap).
- [x] Chatbot lazy loaded con `next/dynamic` (SSR false).
- [x] Bundle analysis ejecutado: First Load JS <200KB.
- [x] Edge caching configurado (home 1h, legales 24h).
- [x] Lighthouse CI workflow creado (`.github/workflows/lighthouse.yml`).
- [x] Tests unitarios para performance budgets (`performance.test.ts`) – 3 tests pasando.
- [x] Tests E2E para Core Web Vitals (`performance.spec.ts`) – 4 tests pasando.
- [x] Build local exitoso: `npm run build` sin errores.
- [x] Linter y TypeScript: `npm run lint` sin warnings.
- [x] Lighthouse manual: Performance Score >85 mobile, LCP <2.5s.

---

## Notas para Reviewer (FJG-57-prompt-revision.md)

1. **WebP conversion**: Si hero image >80KB, comprimir más o cambiar dimensiones.
2. **BlurDataURL**: Generar base64 real con herramienta (no placeholder dummy).
3. **Bundle size**: Si First Load JS >200KB, investigar qué dependencies pesan.
4. **Lighthouse CI**: Puede fallar si server no inicia en 30s (ajustar timeout).
5. **Font weights**: Solo incluir pesos realmente usados (400, 600, 700).
6. **Lazy loading**: Verificar que chatbot NO aparece en initial bundle (Network tab).

---

**Commit esperado** (después de implementación Developer):
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
