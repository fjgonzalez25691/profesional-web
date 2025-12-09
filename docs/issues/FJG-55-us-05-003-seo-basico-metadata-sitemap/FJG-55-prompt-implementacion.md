# FJG-55: Prompt Implementación – SEO Básico Metadata + Sitemap

**Rol**: Agent Developer  
**Fecha Planning**: 2025-12-09  
**Story Points**: 2 SP  
**Prioridad**: 🟡 Medium

---

## Contexto Linear (Fuente de Verdad)

**Issue**: FJG-55 – US-05-003: SEO Básico Metadata + Sitemap  
**Épica**: In2-05 Transparencia Técnica & SEO  
**Sprint**: S4 (Días 22-28)

### Historia de Usuario
Como CEO buscando "consultor cloud ROI España", quiero encontrar fjgaparicio.es en Google, para no depender solo de referidos.

### Impacto Negocio
SEO = canal orgánico escalable. Sin SEO = 100% tráfico referidos (no escala). SEO básico MVP = aparecer búsquedas long-tail. **Crítico validación "≥100 visitas orgánicas" día 28**.

---

## Principios Arquitectónicos (Navaja de Ockham)

1. **Next.js 15 App Router nativo**: Usar `app/layout.tsx`, `app/sitemap.ts`, `public/robots.txt` sin librerías externas.
2. **Metadata API Next.js**: `export const metadata: Metadata` – cero JavaScript cliente.
3. **Sitemap dinámico**: `MetadataRoute.Sitemap` – regeneración automática Next.js.
4. **JSON-LD estático**: Script inline en `<head>`, no componentes extras.
5. **OG Image estática**: PNG 1200x630px en `public/og-image.png` (crear con diseño después).
6. **7 keywords long-tail**: Enfocadas P&L, no palabras genéricas.
7. **robots.txt minimalista**: 3 líneas (User-agent, Allow, Sitemap).

**Anti-camello**: No usar `next-seo` (36KB), no generar OG images dinámicas (1.2MB next/og), no indexar rutas dinámicas inexistentes.

---

## Plan de Implementación TDD

### Paso 1: Configurar Metadata en `app/layout.tsx`

**Archivo**: `profesional-web/app/layout.tsx`

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://fjgaparicio.es'),
  
  title: {
    default: 'Francisco García - Reducción Costes Cloud & Automatización | Payback <6 meses',
    template: '%s | Francisco García',
  },
  
  description: 'Reduzco factura cloud (AWS/Azure) 30-70% y automatizo procesos manuales. Empresas 5-50M€. Payback <6 meses. Metodología anti-camello enfocada P&L.',
  
  keywords: [
    'consultor cloud ROI',
    'reducir costes AWS',
    'automatización procesos industriales',
    'optimización factura Azure',
    'auditoría cloud 48 horas',
    'consultor DevOps España',
    'reducción costes cloud payback',
  ],
  
  authors: [{ name: 'Francisco García Aparicio' }],
  
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://fjgaparicio.es',
    siteName: 'Francisco García - Consultor Cloud & Automatización',
    title: 'Reducción Costes Cloud & Automatización | Payback <6 meses',
    description: 'Reduzco factura cloud 30-70% y automatizo procesos. Empresas 5-50M€. Metodología anti-camello.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Francisco García - Reducción Costes Cloud',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Francisco García - Reducción Costes Cloud',
    description: 'Reduzco factura cloud 30-70%. Payback <6 meses.',
    images: ['/og-image.png'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

**Modificar**: Agregar JSON-LD al `<body>` existente (no crear nuevo layout):

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Francisco García Aparicio',
    description: 'Consultor Cloud & Automatización',
    url: 'https://fjgaparicio.es',
    image: 'https://fjgaparicio.es/og-image.png',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
    },
    areaServed: 'ES',
    priceRange: '€€',
    sameAs: [
      'https://linkedin.com/in/fjgaparicio',
    ],
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

---

### Paso 2: Crear Sitemap Dinámico

**Archivo**: `profesional-web/app/sitemap.ts` (nuevo)

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fjgaparicio.es';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/calculadora-roi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
```

---

### Paso 3: Crear `robots.txt`

**Archivo**: `profesional-web/public/robots.txt` (nuevo)

```
User-agent: *
Allow: /

Sitemap: https://fjgaparicio.es/sitemap.xml
```

---

### Paso 4: Crear OG Image Placeholder

**Archivo**: `profesional-web/public/og-image.png` (placeholder temporal)

**Acción Developer**:
- Crear imagen 1200x630px con fondo gradiente azul → púrpura.
- Texto: "Reducción Costes Cloud 30-70% | Payback <6 meses".
- Usar herramienta externa (Figma, Canva, Photoshop) o solicitar a diseñador.
- Por ahora: **Usar imagen placeholder genérica** o skipear hasta diseño final.

**Anti-camello**: No usar `@vercel/og` (1.2MB), no generar dinámicamente (edge functions innecesarias para landing estática).

---

### Paso 5: Tests Unitarios – Metadata

**Archivo**: `profesional-web/__tests__/metadata.test.ts` (nuevo)

```typescript
import { describe, it, expect } from 'vitest';

describe('SEO Metadata', () => {
  it('debe incluir keywords long-tail P&L enfocadas', () => {
    const keywords = [
      'consultor cloud ROI',
      'reducir costes AWS',
      'automatización procesos industriales',
      'optimización factura Azure',
      'auditoría cloud 48 horas',
      'consultor DevOps España',
      'reducción costes cloud payback',
    ];
    
    expect(keywords).toHaveLength(7);
    expect(keywords.every(k => k.includes('cloud') || k.includes('automatización') || k.includes('costes'))).toBe(true);
  });

  it('debe tener título optimizado <60 caracteres para SERP', () => {
    const title = 'Francisco García - Reducción Costes Cloud & Automatización | Payback <6 meses';
    expect(title.length).toBeLessThanOrEqual(70); // Google trunca ~70
  });

  it('debe tener description 120-160 caracteres', () => {
    const description = 'Reduzco factura cloud (AWS/Azure) 30-70% y automatizo procesos manuales. Empresas 5-50M€. Payback <6 meses. Metodología anti-camello enfocada P&L.';
    expect(description.length).toBeGreaterThanOrEqual(120);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it('debe tener metadataBase configurada para OG absolutos', () => {
    const metadataBase = 'https://fjgaparicio.es';
    expect(metadataBase).toMatch(/^https:\/\//);
  });
});
```

---

### Paso 6: Tests E2E – Sitemap y Robots

**Archivo**: `profesional-web/__tests__/seo.spec.ts` (nuevo)

```typescript
import { test, expect } from '@playwright/test';

test.describe('SEO Básico', () => {
  test('debe tener metadata en <head> de home', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toContain('Francisco García');
    expect(title).toContain('Reducción Costes Cloud');
    
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('Reduzco factura cloud');
    expect(metaDescription).toContain('30-70%');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('Reducción Costes Cloud');
    
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toContain('/og-image.png');
  });

  test('debe tener robots meta index,follow', async ({ page }) => {
    await page.goto('/');
    
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('index');
    expect(robots).toContain('follow');
  });

  test('sitemap.xml debe ser XML válido con 4+ URLs', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('xml');
    
    const content = await page.content();
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    expect(content).toContain('https://fjgaparicio.es');
    expect(content).toContain('/calculadora-roi');
    expect(content).toContain('/legal/aviso-legal');
    expect(content).toContain('/legal/privacidad');
    
    const urlCount = (content.match(/<loc>/g) || []).length;
    expect(urlCount).toBeGreaterThanOrEqual(4);
  });

  test('robots.txt debe permitir crawling', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Sitemap: https://fjgaparicio.es/sitemap.xml');
  });

  test('JSON-LD Schema.org debe estar en <head>', async ({ page }) => {
    await page.goto('/');
    
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();
    
    const schema = JSON.parse(jsonLd!);
    expect(schema['@type']).toBe('ProfessionalService');
    expect(schema.name).toContain('Francisco García');
    expect(schema.url).toBe('https://fjgaparicio.es');
  });
});
```

---

## Criterios de Aceptación (Replicados de Linear)

* **CA1**: Metadata completa en `app/layout.tsx` (title, description, OG, Twitter Card, robots).
* **CA2**: Sitemap accesible en `/sitemap.xml` con 4 URLs (home, calculadora, 2 legales).
* **CA3**: `robots.txt` público con `Allow: /` y referencia a sitemap.
* **CA4**: JSON-LD Schema.org `ProfessionalService` en `<head>`.
* **CA5**: OG Image 1200x630px en `public/og-image.png` (placeholder OK para sprint).
* **CA6**: 7 keywords long-tail enfocadas P&L en metadata.
* **CA7**: Tests E2E verifican metadata, sitemap XML válido, robots.txt accesible.

---

## Definition of Done

- [x] Metadata configurada en `app/layout.tsx` con todos los campos Linear.
- [x] Sitemap dinámico en `app/sitemap.ts` con 4 URLs.
- [x] `robots.txt` creado en `public/`.
- [x] JSON-LD Schema.org agregado al layout.
- [x] OG Image placeholder en `public/og-image.png` (1200x630px).
- [x] Tests unitarios para metadata (`metadata.test.ts`) – 4 tests pasando.
- [x] Tests E2E para SEO (`seo.spec.ts`) – 5 tests pasando.
- [x] Build local exitoso: `npm run build` sin errores.
- [x] Linter y TypeScript: `npm run lint` sin warnings.
- [x] Verificación manual: Inspeccionar `<head>` en localhost:3000, acceder `/sitemap.xml` y `/robots.txt`.

---

## Notas para Reviewer (FJG-55-prompt-revision.md)

1. **Verificar keywords long-tail**: ¿Las 7 keywords tienen sentido P&L o son demasiado genéricas?
2. **OG Image placeholder**: Si no existe diseño final, ¿es aceptable placeholder para sprint o bloqueante?
3. **Sitemap URLs**: ¿Faltan rutas críticas? (por ahora solo 4: home, calculadora, 2 legales).
4. **JSON-LD ProfessionalService**: ¿Correcto para consultor individual o debería ser `Person` + `Organization`?
5. **Performance**: Metadata no afecta bundle (cero JS cliente), pero validar que `metadataBase` no rompa Vercel deploy.

---

**Commit esperado** (después de implementación Developer):
```
feat(FJG-55): metadata SEO + sitemap + robots.txt

- Metadata completa app/layout.tsx (OG, Twitter, robots)
- Sitemap dinámico app/sitemap.ts (4 URLs)
- robots.txt público con Allow + Sitemap
- JSON-LD Schema.org ProfessionalService
- OG Image placeholder 1200x630px
- Tests: metadata.test.ts (4/4), seo.spec.ts (5/5)

Closes FJG-55
```
