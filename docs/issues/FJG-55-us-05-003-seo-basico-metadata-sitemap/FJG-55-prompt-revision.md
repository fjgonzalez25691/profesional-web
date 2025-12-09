# FJG-55: Prompt Revisión – SEO Básico Metadata + Sitemap

**Rol**: Agent Reviewer  
**Fecha Planning**: 2025-12-09  
**Story Points**: 2 SP  
**Prioridad**: 🟡 Medium

---

## Objetivo de la Revisión

Verificar que la implementación de SEO básico (metadata Next.js, sitemap, robots.txt, JSON-LD) cumple **100% con la especificación Linear FJG-55**, sigue los principios anti-camello (cero librerías externas), y garantiza indexación Google correcta sin generar JavaScript cliente innecesario.

---

## Checklist de Revisión

### 1. Metadata Next.js (`app/layout.tsx`)

- [ ] **`metadataBase`** configurada como `https://fjgaparicio.es`.
- [ ] **`title.default`** incluye "Francisco García", "Reducción Costes Cloud", "Payback <6 meses".
- [ ] **`title.template`** usa formato `%s | Francisco García`.
- [ ] **`description`** tiene 120-160 caracteres y menciona "30-70%", "5-50M€", "anti-camello".
- [ ] **`keywords`** contiene exactamente 7 términos long-tail de Linear:
  - consultor cloud ROI
  - reducir costes AWS
  - automatización procesos industriales
  - optimización factura Azure
  - auditoría cloud 48 horas
  - consultor DevOps España
  - reducción costes cloud payback
- [ ] **`openGraph`** incluye `type: 'website'`, `locale: 'es_ES'`, imagen 1200x630px.
- [ ] **`twitter.card`** es `summary_large_image` con imagen OG.
- [ ] **`robots`** permite indexación (`index: true`, `follow: true`).

---

### 2. Sitemap (`app/sitemap.ts`)

- [ ] Archivo creado en `profesional-web/app/sitemap.ts`.
- [ ] Usa `MetadataRoute.Sitemap` de Next.js (no librería externa).
- [ ] Incluye exactamente 4 URLs especificadas en Linear:
  - `https://fjgaparicio.es` (priority 1.0, weekly)
  - `https://fjgaparicio.es/calculadora-roi` (priority 0.9, monthly)
  - `https://fjgaparicio.es/legal/aviso-legal` (priority 0.3, yearly)
  - `https://fjgaparicio.es/legal/privacidad` (priority 0.3, yearly)
- [ ] `lastModified` usa `new Date()` para regeneración dinámica.
- [ ] Accesible en `https://fjgaparicio.es/sitemap.xml` (validar en local y Vercel).

---

### 3. Robots.txt (`public/robots.txt`)

- [ ] Archivo creado en `profesional-web/public/robots.txt`.
- [ ] Contiene exactamente 3 líneas de Linear:
  ```
  User-agent: *
  Allow: /
  
  Sitemap: https://fjgaparicio.es/sitemap.xml
  ```
- [ ] Accesible en `https://fjgaparicio.es/robots.txt`.

---

### 4. JSON-LD Schema.org (`app/layout.tsx`)

- [ ] Script `<script type="application/ld+json">` agregado al `<head>` del layout.
- [ ] Schema `@type: 'ProfessionalService'` (no `Person` ni `Organization`).
- [ ] Campos obligatorios presentes:
  - `name: 'Francisco García Aparicio'`
  - `url: 'https://fjgaparicio.es'`
  - `image: 'https://fjgaparicio.es/og-image.png'`
  - `address.addressCountry: 'ES'`
  - `areaServed: 'ES'`
  - `sameAs: ['https://linkedin.com/in/fjgaparicio']`
- [ ] JSON válido (sin errores de sintaxis).

---

### 5. OG Image (`public/og-image.png`)

- [ ] Archivo creado en `profesional-web/public/og-image.png`.
- [ ] Dimensiones exactas 1200x630px (estándar Open Graph).
- [ ] Contiene texto "Reducción Costes Cloud 30-70% | Payback <6 meses" legible.
- [ ] Fondo gradiente azul → púrpura (o placeholder aceptable si diseño final pendiente).
- [ ] Peso optimizado <200KB (PNG comprimido).

**Nota**: Si solo hay placeholder temporal para sprint, marcar como **bloqueante** si afecta validación Google Search Console.

---

### 6. Tests Unitarios (`__tests__/metadata.test.ts`)

- [ ] Archivo creado en `profesional-web/__tests__/metadata.test.ts`.
- [ ] Test 1: Verifica 7 keywords long-tail P&L.
- [ ] Test 2: Título <70 caracteres (límite Google SERP).
- [ ] Test 3: Description 120-160 caracteres.
- [ ] Test 4: `metadataBase` es URL absoluta HTTPS.
- [ ] **4/4 tests pasan** en `npm run test`.

---

### 7. Tests E2E (`__tests__/seo.spec.ts`)

- [ ] Archivo creado en `profesional-web/__tests__/seo.spec.ts`.
- [ ] Test 1: Metadata en `<head>` (title, description, OG tags).
- [ ] Test 2: Robots meta `index,follow`.
- [ ] Test 3: Sitemap XML válido con 4+ URLs.
- [ ] Test 4: `robots.txt` con `Allow: /` y referencia sitemap.
- [ ] Test 5: JSON-LD Schema.org presente y parseable.
- [ ] **5/5 tests pasan** en `npm run test:e2e`.

---

### 8. Build y Linter

- [ ] `npm run build` exitoso sin errores de TypeScript.
- [ ] `npm run lint` sin warnings ESLint.
- [ ] No se agregaron dependencias externas (`next-seo`, `@vercel/og`, etc.).
- [ ] Bundle size no aumentó >5KB (metadata es cero JS cliente).

---

### 9. Validación Manual

- [ ] Inspeccionar `http://localhost:3000` → `<head>` contiene metadata completa.
- [ ] Acceder `http://localhost:3000/sitemap.xml` → XML válido visible.
- [ ] Acceder `http://localhost:3000/robots.txt` → Texto plano correcto.
- [ ] Usar herramienta [Google Rich Results Test](https://search.google.com/test/rich-results) → Schema.org validado.
- [ ] Usar [Open Graph Debugger](https://www.opengraph.xyz/) → OG tags correctos.

---

### 10. Criterios de Aceptación Linear (Verificación Final)

- [ ] **CA1**: Metadata configurada `app/layout.tsx` ✅
- [ ] **CA2**: Sitemap accesible `/sitemap.xml` con 4 URLs ✅
- [ ] **CA3**: `robots.txt` público ✅
- [ ] **CA4**: JSON-LD Schema.org `ProfessionalService` ✅
- [ ] **CA5**: OG Image 1200x630px ✅
- [ ] **CA6**: 7 keywords long-tail P&L ✅
- [ ] **CA7**: Tests E2E verifican metadata, sitemap, robots ✅

---

## Puntos Críticos de Revisión (Anti-Camello)

### ⚠️ Riesgo 1: Librerías Externas Innecesarias
**Verificar**: `package.json` no debe contener `next-seo`, `react-helmet`, `@vercel/og`.  
**Razón**: Next.js 15 tiene Metadata API nativa. Librerías externas = 36KB+ bundle innecesario.

### ⚠️ Riesgo 2: OG Image Dinámica
**Verificar**: `og-image.png` es archivo estático, no generado con `@vercel/og` edge function.  
**Razón**: Generar OG dinámicamente para landing estática = 1.2MB + edge runtime innecesario.

### ⚠️ Riesgo 3: Keywords Genéricas
**Verificar**: Keywords deben ser long-tail específicas ("consultor cloud ROI"), no genéricas ("consultoría", "cloud").  
**Razón**: SEO MVP = aparecer en búsquedas nicho con baja competencia. Genéricas = imposible rankear.

### ⚠️ Riesgo 4: Sitemap con Rutas Inexistentes
**Verificar**: Solo 4 URLs reales. No agregar `/blog`, `/servicios` si no existen.  
**Razón**: Google penaliza sitemaps con 404s.

### ⚠️ Riesgo 5: JSON-LD Malformado
**Verificar**: Schema.org debe parsear correctamente en [Schema Validator](https://validator.schema.org/).  
**Razón**: JSON inválido = Google ignora structured data.

---

## Resultados Esperados

### Tests
- **Unitarios**: 4/4 pasando (`metadata.test.ts`).
- **E2E**: 5/5 pasando (`seo.spec.ts`).
- **Build**: `npm run build` exitoso.
- **Linter**: Sin warnings.

### Performance
- **Bundle size**: +0KB (metadata es server-side).
- **Lighthouse SEO**: 100/100 (metadata, sitemap, robots presentes).

### Funcional
- **Google Search Console**: Sitemap enviable y aceptado.
- **Rich Results Test**: Schema.org validado.
- **OG Debugger**: Tags Open Graph correctos.

---

## Acciones Requeridas Si Fallan Checks

| Check Fallido | Acción Correctiva |
|---------------|-------------------|
| Keywords no son 7 long-tail | Reemplazar por lista exacta de Linear |
| Sitemap tiene >4 URLs | Eliminar URLs no especificadas |
| `robots.txt` con `Disallow` | Cambiar a `Allow: /` (Linear especifica permitir crawling) |
| JSON-LD tipo `Person` | Cambiar a `ProfessionalService` |
| OG Image >500KB | Comprimir PNG con TinyPNG |
| Tests E2E fallan | Verificar rutas `/sitemap.xml`, `/robots.txt` accesibles en dev |
| Dependencia `next-seo` agregada | **Eliminar** y usar Metadata API nativa |

---

## Aprobación Final

**Reviewer aprueba si**:
- ✅ 10/10 checks pasados.
- ✅ Cero librerías externas SEO agregadas.
- ✅ Tests 9/9 pasando (4 unitarios + 5 E2E).
- ✅ Validación manual con herramientas Google exitosa.

**Rechazar si**:
- ❌ Falta algún campo obligatorio de metadata Linear.
- ❌ Sitemap no es XML válido.
- ❌ Keywords son genéricas (no long-tail P&L).
- ❌ Se agregó `next-seo` u otra librería externa.

---

**Commit esperado después de aprobación**:
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
