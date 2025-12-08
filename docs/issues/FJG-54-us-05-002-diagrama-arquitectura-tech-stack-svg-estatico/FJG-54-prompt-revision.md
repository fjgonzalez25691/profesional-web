# FJG-54: Prompt de Revisión
## US-05-002: Diagrama Arquitectura Tech Stack SVG Estático

**Rol:** Agent Reviewer  
**Issue Linear:** FJG-54  
**Estimación:** 3 SP  
**Prioridad:** Medium  
**Sprint:** S4 (Días 22-28)

---

## 📋 Contexto de la Issue (desde Linear)

**Historia de Usuario:**  
Como CTO evaluando proveedor  
Quiero ver tech stack real que usas  
Para validar no usas tecnologías obsoletas

**Criterios de Aceptación (Gherkin):**
```gherkin
Feature: Diagrama tech stack
  Scenario: Visualización diagrama
    Given scroll a sección "Stack Tecnológico"
    When veo diagrama
    Then muestra 4 capas: Frontend, Backend, Infra, Analytics
    And flechas conectan capas lógicamente
    And SVG responsive escala sin pixelar

  Scenario: Listado tecnologías
    Given veo sección tech stack
    Then bajo diagrama veo grid badges tecnologías
    And cada badge muestra: nombre + propósito
```

**Definition of Done:**
- SVG estático `/public/diagrams/tech-stack.svg`
- Componente `<TechStackDiagram>` en home
- Archivo `data/tech-stack.ts` con stack completo
- Grid badges tecnologías bajo diagrama
- SVG responsive (viewBox preserveAspectRatio)
- **NO React Flow S4** (estático suficiente)
- **NO interactividad S4** (click nodes, zoom)
- SEO: alt text descriptivo, H2 "Stack Tecnológico"
- Test: SVG carga, badges visibles

**Decisión Anti-Camello (CRÍTICA):**
- ❌ React Flow: 6 SP, 50KB bundle, interactividad innecesaria MVP
- ✅ SVG estático: 3 SP, 5KB, SEO-friendly, load instant
- **Ahorro**: -3 SP, -45KB bundle, 0 dependencies extras

---

## 🎯 Objetivo de la Revisión

Verificar que la implementación cumple con:
1. **SVG estático completo** con 4 capas + flechas conectoras
2. **Data file** `tech-stack.ts` con stack MVP completo
3. **Componente `<TechStackDiagram>`** con SVG + grid badges
4. **Responsive** sin pixelado (viewBox correcto)
5. **Tests completos** (unitarios + E2E)
6. **NO React Flow ni interactividad** (decisión anti-camello)

---

## ✅ Checklist de Revisión

### 1. Verificación Data File (`data/tech-stack.ts`)

**Acción:** Leer `data/tech-stack.ts`

**Verificar estructura TypeScript:**
- [ ] Exporta tipos `TechItem` y `TechStack`
- [ ] Exporta constante `TECH_STACK_MVP`
- [ ] Contiene 4 categorías: `frontend`, `backend`, `infra`, `analytics`

**Verificar contenido Frontend:**
- [ ] Next.js 15 (App Router SSR)
- [ ] React 19 (UI Components)
- [ ] TypeScript (Type Safety)
- [ ] Tailwind CSS (Styling)
- [ ] Shadcn/ui (Component Library)

**Verificar contenido Backend:**
- [ ] Next.js API Routes (Serverless APIs)
- [ ] Vercel Postgres (Database)
- [ ] Groq (Llama 3.3) - Chatbot IA
- [ ] Resend (Transactional Email)

**Verificar contenido Infra:**
- [ ] Vercel (Deploy + CDN)
- [ ] GitHub Actions (CI/CD)
- [ ] Vercel Cron (Email Nurturing)

**Verificar contenido Analytics:**
- [ ] Vercel Analytics (Performance)
- [ ] Postgres Logs (Leads + Chat)

**Criterios de FALLO (❌):**
- Data file no existe o está incompleto
- Falta alguna tecnología especificada en Linear
- Tipos TypeScript incorrectos o ausentes
- Purpose strings vacíos o genéricos

---

### 2. Verificación SVG Estático (`public/diagrams/tech-stack.svg`)

**Acción:** Leer `public/diagrams/tech-stack.svg`

**Verificar estructura técnica:**
- [ ] `viewBox="0 0 800 600"` (ratio 4:3)
- [ ] `preserveAspectRatio="xMidYMid meet"` (responsive correcto)
- [ ] 4 grupos `<g>` con IDs: `frontend`, `backend`, `infra`, `analytics`
- [ ] Cada grupo contiene `<rect>` + textos `<text>`

**Verificar capas visuales:**
- [ ] Frontend: `fill="#3b82f6"` (blue-500), posición `x="50"`
- [ ] Backend: `fill="#8b5cf6"` (violet-500), posición `x="300"`
- [ ] Infraestructura: `fill="#f59e0b"` (amber-500), posición `x="550"`
- [ ] Analytics: `fill="#10b981"` (emerald-500), posición `y="250"`

**Verificar flechas conectoras:**
- [ ] Definición `<defs><marker id="arrowhead">` presente
- [ ] 3 líneas `<line>` con `marker-end="url(#arrowhead)"`
- [ ] Línea Frontend → Backend
- [ ] Línea Backend → Infra
- [ ] Línea Backend → Analytics (vertical)

**Verificar textos:**
- [ ] Títulos en negrita (`font-weight="bold"`) 18px
- [ ] Textos tecnologías 14px
- [ ] Todos los textos `fill="white"` (contraste sobre colores)
- [ ] `text-anchor="middle"` para centrado

**Criterios de FALLO (❌):**
- SVG no existe o malformado
- viewBox incorrecto (pixelado al escalar)
- Falta alguna capa (menos de 4 grupos)
- Flechas no conectan layers o ausentes
- Colores incorrectos vs especificación

---

### 3. Componente `<TechStackDiagram>`

**Acción:** Leer `components/TechStackDiagram.tsx`

**Verificar estructura:**
- [ ] Exporta `TechStackDiagram` por defecto
- [ ] Componente interno `TechBadge` (no exportado)
- [ ] Importa `TECH_STACK_MVP` de `@/data/tech-stack`
- [ ] Usa `<img>` para cargar SVG (NO inline SVG)

**Verificar contenido sección:**
- [ ] `<section id="tech-stack">` con aria-label
- [ ] H2: "Stack Tecnológico Transparente"
- [ ] Párrafo: "Esta web es un caso de estudio. Tecnologías modernas, 0 legacy, deploy automático."
- [ ] Imagen SVG con alt text descriptivo completo
- [ ] Grid de badges con todas las tecnologías (frontend + backend + infra + analytics)

**Verificar `<TechBadge>`:**
- [ ] Props: `name` y `purpose`
- [ ] Muestra `name` en font-semibold
- [ ] Muestra `purpose` en text-xs text-slate-500
- [ ] Border y shadow suaves
- [ ] Hover effect (shadow-md)

**Verificar responsive:**
- [ ] Grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`
- [ ] SVG container: `max-w-4xl mx-auto` (limita ancho desktop)
- [ ] Padding responsive: `px-4 sm:px-6 lg:px-8`

**Criterios de FALLO (❌):**
- Componente no existe o malformado
- H2 incorrecto o faltante
- SVG no se carga (src incorrecto)
- Alt text genérico o ausente
- Grid no responsive o badges hardcodeados
- `TechBadge` exportado (debería ser interno)

---

### 4. Integración en `app/page.tsx`

**Acción:** Leer `app/page.tsx`

**Verificar:**
- [ ] `<TechStackDiagram />` importado correctamente
- [ ] Sección aparece DESPUÉS de `<MethodologySection />`
- [ ] Sección aparece ANTES de `<CalendlyModal />`
- [ ] Import correcto: `import TechStackDiagram from "@/components/TechStackDiagram"`

**Criterios de FALLO (❌):**
- Sección no integrada en `page.tsx`
- Orden incorrecto (aparece antes de metodología)
- Import incorrecto o componente no encontrado

---

### 5. Tests Unitarios

**Acción:** Leer y ejecutar tests

#### Test 1: `__tests__/data/tech-stack.test.ts`

**Verificar:**
- [ ] Test "contiene las 4 categorías principales" ✅
- [ ] Test "frontend incluye Next.js 15 y React 19" ✅
- [ ] Test "backend incluye Groq (Llama 3.3)" ✅
- [ ] Test "cada tecnología tiene name y purpose" ✅

**Ejecutar:**
```bash
cd profesional-web
npm test -- tech-stack.test.ts
```

#### Test 2: `__tests__/components/TechStackDiagram.test.tsx`

**Verificar:**
- [ ] Test "renderiza título principal" ✅
- [ ] Test "renderiza descripción del caso de estudio" ✅
- [ ] Test "muestra imagen SVG del diagrama" ✅
- [ ] Test "renderiza badges de tecnologías frontend" ✅
- [ ] Test "renderiza badges de tecnologías backend" ✅
- [ ] Test "cada badge muestra purpose" ✅
- [ ] Test "grid de badges responsive" ✅

**Ejecutar:**
```bash
cd profesional-web
npm test -- TechStackDiagram.test.tsx
```

**Criterios de FALLO (❌):**
- Tests no existen o están comentados
- Tests fallan
- Tests no cubren SVG carga o badges

---

### 6. Tests E2E (Playwright)

**Acción:** Leer y ejecutar `__tests__/e2e/tech-stack.spec.ts`

**Verificar:**
- [ ] Test "muestra diagrama SVG y 4 capas" ✅
- [ ] Test "muestra badges de tecnologías en grid" ✅
- [ ] Test "badges muestran purpose al hover" ✅
- [ ] Test "responsive: 2 columnas en mobile" ✅
- [ ] Test "SVG se carga correctamente" ✅

**Ejecutar:**
```bash
cd profesional-web
npm run test:e2e -- tech-stack.spec.ts
```

**Criterios de FALLO (❌):**
- Tests E2E no existen
- Tests fallan
- Tests no verifican mobile (viewport 375px)
- Test carga SVG standalone no existe

---

### 7. SEO y Accesibilidad

**Acción:** Revisar componente y SVG

**Verificar:**
- [ ] H2 semántico: "Stack Tecnológico Transparente"
- [ ] Alt text descriptivo (menciona 4 capas + tecnologías clave)
- [ ] Section con `id="tech-stack"` (ancla navegación)
- [ ] SVG archivo estático (indexable por bots)
- [ ] No JavaScript necesario para renderizar contenido

**Criterios de FALLO (❌):**
- H2 no es semántico (usa `<div>` en vez de `<h2>`)
- Alt text genérico ("diagram") o ausente
- SVG inline en JSX (no indexable)

---

### 8. Decisión Anti-Camello (CRÍTICA)

**Acción:** Revisar implementación completa

**Verificar que NO existe:**
- [ ] React Flow instalado en `package.json`
- [ ] Librerías de diagramas interactivos (D3, Mermaid, etc.)
- [ ] Event handlers en SVG (onClick, onHover, etc.)
- [ ] Zoom/Pan funcionalidad
- [ ] Drag & drop de nodos
- [ ] Tooltips interactivos (solo CSS allowed)

**Verificar que SÍ existe:**
- [ ] SVG estático en `public/diagrams/`
- [ ] Carga simple con `<img src="/diagrams/tech-stack.svg">`
- [ ] Bundle size NO aumentó (verificar con `npm run build`)

**Criterios de FALLO (❌):**
- React Flow o librería similar instalada
- Interactividad JavaScript implementada
- SVG dinámico (componentes React SVG)
- Bundle size aumentó > 10KB por esta feature

---

### 9. Responsive y Visual

**Acción:** Revisar clases Tailwind

**Verificar Desktop (≥768px):**
- [ ] Grid 4 columnas (`md:grid-cols-4`)
- [ ] SVG ocupa max-w-4xl
- [ ] Padding adecuado (px-4 sm:px-6 lg:px-8)

**Verificar Mobile (<768px):**
- [ ] Grid 2 columnas (`grid-cols-2`)
- [ ] SVG escala proporcionalmente (viewBox funciona)
- [ ] Texto legible (font-size ≥14px)
- [ ] No scroll horizontal

**Test visual manual:**
1. Abrir `/diagrams/tech-stack.svg` directamente
2. Redimensionar ventana navegador
3. Verificar NO pixelado, escalado proporcional
4. Verificar textos legibles en todos los tamaños

**Criterios de FALLO (❌):**
- Desktop no muestra 4 columnas
- Mobile muestra scroll horizontal
- SVG pixelado al redimensionar
- Textos ilegibles en mobile

---

### 10. Checklist DoD (Definition of Done)

**Acción:** Verificar contra DoD de Linear

- [ ] SVG estático `/public/diagrams/tech-stack.svg` ✅
- [ ] Componente `<TechStackDiagram>` en home ✅
- [ ] Archivo `data/tech-stack.ts` con stack completo ✅
- [ ] Grid badges tecnologías bajo diagrama ✅
- [ ] SVG responsive (viewBox preserveAspectRatio) ✅
- [ ] **NO React Flow S4** ✅
- [ ] **NO interactividad S4** ✅
- [ ] SEO: alt text descriptivo, H2 "Stack Tecnológico" ✅
- [ ] Test: SVG carga, badges visibles ✅

**Criterios de FALLO (❌):**
- Cualquier item del DoD no cumplido
- React Flow implementado (violación decisión anti-camello)

---

## 📤 Output: Informe de Revisión

**Archivo:** `FJG-54-informe-revision.md` (generar en misma carpeta)

**Estructura del informe:**

```markdown
# Informe de Revisión - FJG-54

## Veredicto: [✅ APROBADO | ⚠️ APROBADO CON OBSERVACIONES | ❌ RECHAZADO]

## 1. Data File (tech-stack.ts)
- Estado: [✅ | ⚠️ | ❌]
- Frontend completo: [✅ | ❌]
- Backend completo: [✅ | ❌]
- Groq presente: [✅ | ❌]
- Observaciones: ...

## 2. SVG Estático (tech-stack.svg)
- Estado: [✅ | ⚠️ | ❌]
- viewBox correcto: [✅ | ❌]
- 4 capas visibles: [✅ | ❌]
- Flechas conectoras: [✅ | ❌]
- Colores correctos: [✅ | ❌]

## 3. Componente TechStackDiagram
- Estado: [✅ | ⚠️ | ❌]
- H2 semántico: [✅ | ❌]
- SVG cargado: [✅ | ❌]
- Grid badges: [✅ | ❌]
- TechBadge interno: [✅ | ❌]

## 4. Integración page.tsx
- Estado: [✅ | ⚠️ | ❌]
- Después de MethodologySection: [✅ | ❌]
- Import correcto: [✅ | ❌]

## 5. Tests Unitarios
- Estado: [✅ | ⚠️ | ❌]
- tech-stack.test.ts: [verdes | X fallos]
- TechStackDiagram.test.tsx: [verdes | X fallos]

## 6. Tests E2E
- Estado: [✅ | ⚠️ | ❌]
- tech-stack.spec.ts: [verdes | X fallos]
- Test mobile viewport: [✅ | ❌]
- Test SVG standalone: [✅ | ❌]

## 7. SEO y Accesibilidad
- Estado: [✅ | ⚠️ | ❌]
- H2 semántico: [✅ | ❌]
- Alt text descriptivo: [✅ | ❌]
- SVG indexable: [✅ | ❌]

## 8. Decisión Anti-Camello
- Estado: [✅ | ⚠️ | ❌]
- Sin React Flow: [✅ | ❌]
- Sin interactividad: [✅ | ❌]
- Bundle size OK: [✅ | ❌]

## 9. Responsive y Visual
- Estado: [✅ | ⚠️ | ❌]
- Desktop 4 columnas: [✅ | ❌]
- Mobile 2 columnas: [✅ | ❌]
- SVG sin pixelado: [✅ | ❌]

## 10. DoD Completo
- Estado: [✅ | ⚠️ | ❌]
- Todos los items: [✅ | ❌]

## Resumen de Issues Encontrados
[Lista numerada de problemas, si los hay]

## Aprobación Final
- [ ] Código listo para merge
- [ ] Requiere correcciones (ver issues)
```

---

## 🚨 Criterios de Veredicto

### ✅ APROBADO
- SVG estático completo con 4 capas + flechas
- Data file con stack MVP completo (incluye Groq)
- Componente `<TechStackDiagram>` con SVG + grid badges
- Tests verdes (unitarios + E2E)
- Responsive correcto (sin pixelado)
- SEO: H2 + alt text descriptivo
- **Sin React Flow ni interactividad** (decisión anti-camello respetada)

### ⚠️ APROBADO CON OBSERVACIONES
- SVG correcto pero colores podrían ajustarse (no bloqueante)
- Tests verdes pero podrían ampliarse
- Alt text correcto pero podría ser más descriptivo
- Grid responsive funciona pero podría optimizarse

### ❌ RECHAZADO
- SVG faltante o malformado
- React Flow instalado (violación anti-camello)
- Interactividad implementada (violación DoD)
- Tests fallan o no existen
- SVG pixelado (viewBox incorrecto)
- Data file incompleto (falta Groq u otras tecnologías)
- Componente no integrado en home

---

## 🔗 Referencias

- **Issue Linear:** [FJG-54](https://linear.app/fjgaparicio/issue/FJG-54)
- **Prompt Implementación:** `FJG-54-prompt-implementacion.md`
- **Constitución:** `.prompts/CONSTITUCION.md`
- **Roles:** `.prompts/ROLES.md`

---

**RECORDATORIO:**  
Como Reviewer, tu rol es **SOLO LECTURA**. NO corrijas código, NO generes bloques de código en el chat. Si encuentras errores, documéntalos en el informe y rechaza la tarea (❌) para que el Developer la corrija.

**CRÍTICO:** La decisión anti-camello (NO React Flow, SVG estático) es **mandatoria**. Cualquier implementación con interactividad o React Flow es motivo de rechazo automático (❌), sin excepciones.
