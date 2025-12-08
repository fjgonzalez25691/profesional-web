# FJG-54: Prompt de Implementación
## US-05-002: Diagrama Arquitectura Tech Stack SVG Estático

**Rol:** Agent Developer  
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

**Impacto Negocio:**  
Credibilidad técnica. CTO ve "Next.js 15, Postgres, Groq, Vercel" → tecnologías modernas → confía expertise. **Impacto "Posicionamiento P&L" (18%) + SEO técnico**.

**Decisión Anti-Camello:**  
- ❌ React Flow: 6 SP, 50KB bundle, interactividad innecesaria MVP
- ✅ SVG estático: 3 SP, 5KB, SEO-friendly, load instant
- **Ahorro**: -3 SP, -45KB bundle, 0 dependencies extras

**Bloqueadores:**  
- FJG-44 (US-03-002 - Backend chatbot) → Para incluir Groq en stack

**Bloquea a:**  
- Ninguno

---

## 🎯 Objetivo de la Implementación

Crear sección "Stack Tecnológico Transparente" en landing con:
1. **SVG estático** (`/public/diagrams/tech-stack.svg`) con 4 capas visuales
2. **Componente React** `<TechStackDiagram>` que muestra SVG + grid de badges
3. **Data file** `data/tech-stack.ts` con lista completa de tecnologías
4. **Diseño responsive** sin pixelado (viewBox SVG)

**Diferenciador clave:** Transparencia total del stack técnico como caso de estudio.

---

## 📐 Estado Actual del Proyecto

### Estructura Existente
```
profesional-web/
├── app/
│   └── page.tsx              # Landing principal
├── components/
│   ├── MethodologySection.tsx  # Ya existe (FJG-53)
│   ├── Hero.tsx                # Ya existe
│   ├── CaseGrid.tsx            # Ya existe
│   └── ui/                     # Shadcn/ui components
├── data/
│   └── case-studies.ts         # Ya existe
├── public/
│   └── diagrams/               # NUEVA carpeta
└── __tests__/
    ├── components/             # Tests unitarios
    └── e2e/                    # Tests E2E
```

### Stack Técnico
- **Next.js 16.0.6** (App Router) + React 19 + TypeScript strict
- **Tailwind CSS 4.1.17** (v4 moderna)
- **Shadcn/ui** (estilo New York)
- **Lucide React** (iconos)
- **Vitest 4.0.14** + Testing Library

---

## 🆕 Contenido a Implementar (según Linear)

### 1. Data File: `data/tech-stack.ts`

```typescript
export type TechItem = {
  name: string;
  purpose: string;
};

export type TechStack = {
  frontend: TechItem[];
  backend: TechItem[];
  infra: TechItem[];
  analytics: TechItem[];
};

export const TECH_STACK_MVP: TechStack = {
  frontend: [
    { name: 'Next.js 15', purpose: 'App Router SSR' },
    { name: 'React 19', purpose: 'UI Components' },
    { name: 'TypeScript', purpose: 'Type Safety' },
    { name: 'Tailwind CSS', purpose: 'Styling' },
    { name: 'Shadcn/ui', purpose: 'Component Library' },
  ],
  backend: [
    { name: 'Next.js API Routes', purpose: 'Serverless APIs' },
    { name: 'Vercel Postgres', purpose: 'Database' },
    { name: 'Groq (Llama 3.3)', purpose: 'Chatbot IA' },
    { name: 'Resend', purpose: 'Transactional Email' },
  ],
  infra: [
    { name: 'Vercel', purpose: 'Deploy + CDN' },
    { name: 'GitHub Actions', purpose: 'CI/CD' },
    { name: 'Vercel Cron', purpose: 'Email Nurturing' },
  ],
  analytics: [
    { name: 'Vercel Analytics', purpose: 'Performance' },
    { name: 'Postgres Logs', purpose: 'Leads + Chat' },
  ],
};
```

### 2. SVG Diagram: `public/diagrams/tech-stack.svg`

**Especificaciones técnicas:**
- **viewBox**: `0 0 800 600` (ratio 4:3 responsive)
- **preserveAspectRatio**: `xMidYMid meet` (escala proporcional)
- **4 capas de color**:
  - Frontend: `#3b82f6` (blue-500)
  - Backend: `#8b5cf6` (violet-500)
  - Infraestructura: `#f59e0b` (amber-500)
  - Analytics: `#10b981` (emerald-500)
- **Flechas conectoras**: `#64748b` (slate-500) con `marker-end` arrowhead
- **Tipografía**: Sans-serif, bold 18px títulos, regular 14px textos
- **Border radius**: 8px en rectángulos

**Estructura SVG (según Linear):**

```svg
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <!-- Frontend Layer -->
  <g id="frontend">
    <rect x="50" y="50" width="200" height="150" fill="#3b82f6" rx="8"/>
    <text x="150" y="80" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Frontend</text>
    <text x="150" y="110" text-anchor="middle" fill="white" font-size="14">Next.js 15 + React 19</text>
    <text x="150" y="135" text-anchor="middle" fill="white" font-size="14">TypeScript + Tailwind</text>
    <text x="150" y="160" text-anchor="middle" fill="white" font-size="14">Shadcn/ui</text>
  </g>
  
  <!-- Backend Layer -->
  <g id="backend">
    <rect x="300" y="50" width="200" height="150" fill="#8b5cf6" rx="8"/>
    <text x="400" y="80" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Backend</text>
    <text x="400" y="110" text-anchor="middle" fill="white" font-size="14">Next.js API Routes</text>
    <text x="400" y="135" text-anchor="middle" fill="white" font-size="14">Vercel Postgres</text>
    <text x="400" y="160" text-anchor="middle" fill="white" font-size="14">Groq (Llama 3.3)</text>
  </g>
  
  <!-- Infra Layer -->
  <g id="infra">
    <rect x="550" y="50" width="200" height="150" fill="#f59e0b" rx="8"/>
    <text x="650" y="80" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Infraestructura</text>
    <text x="650" y="110" text-anchor="middle" fill="white" font-size="14">Vercel Deploy</text>
    <text x="650" y="135" text-anchor="middle" fill="white" font-size="14">GitHub Actions CI</text>
    <text x="650" y="160" text-anchor="middle" fill="white" font-size="14">Vercel Cron</text>
  </g>
  
  <!-- Analytics Layer -->
  <g id="analytics">
    <rect x="300" y="250" width="200" height="100" fill="#10b981" rx="8"/>
    <text x="400" y="280" text-anchor="middle" fill="white" font-size="18" font-weight="bold">Analytics</text>
    <text x="400" y="310" text-anchor="middle" fill="white" font-size="14">Vercel Analytics</text>
    <text x="400" y="335" text-anchor="middle" fill="white" font-size="14">Postgres Logs</text>
  </g>
  
  <!-- Arrows connecting layers -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
    </marker>
  </defs>
  
  <line x1="250" y1="125" x2="300" y2="125" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="500" y1="125" x2="550" y2="125" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="400" y1="200" x2="400" y2="250" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
</svg>
```

### 3. Componente React: `components/TechStackDiagram.tsx`

```typescript
import { TECH_STACK_MVP } from '@/data/tech-stack';

type TechBadgeProps = {
  name: string;
  purpose: string;
};

function TechBadge({ name, purpose }: TechBadgeProps) {
  return (
    <div className="flex flex-col items-start rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <span className="text-sm font-semibold text-slate-900">{name}</span>
      <span className="text-xs text-slate-500">{purpose}</span>
    </div>
  );
}

export default function TechStackDiagram() {
  return (
    <section id="tech-stack" className="w-full bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Stack Tecnológico Transparente
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            Esta web es un caso de estudio. Tecnologías modernas, 0 legacy, deploy automático.
          </p>
        </div>

        {/* SVG Diagram */}
        <div className="mx-auto mb-12 max-w-4xl">
          <img
            src="/diagrams/tech-stack.svg"
            alt="Diagrama arquitectura tech stack: Frontend (Next.js, React, TypeScript), Backend (API Routes, Postgres, Groq), Infraestructura (Vercel, GitHub Actions), Analytics (Vercel Analytics, Postgres Logs)"
            className="h-auto w-full"
          />
        </div>

        {/* Tech Badges Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[...TECH_STACK_MVP.frontend, ...TECH_STACK_MVP.backend, ...TECH_STACK_MVP.infra, ...TECH_STACK_MVP.analytics].map((tech) => (
            <TechBadge key={tech.name} {...tech} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 🧪 Plan de Implementación TDD

### PASO 1: Crear data file `data/tech-stack.ts` (Test-First)

**Test:** `__tests__/data/tech-stack.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { TECH_STACK_MVP } from '@/data/tech-stack';

describe('TECH_STACK_MVP', () => {
  it('contiene las 4 categorías principales', () => {
    expect(TECH_STACK_MVP).toHaveProperty('frontend');
    expect(TECH_STACK_MVP).toHaveProperty('backend');
    expect(TECH_STACK_MVP).toHaveProperty('infra');
    expect(TECH_STACK_MVP).toHaveProperty('analytics');
  });

  it('frontend incluye Next.js 15 y React 19', () => {
    const frontendNames = TECH_STACK_MVP.frontend.map((t) => t.name);
    expect(frontendNames).toContain('Next.js 15');
    expect(frontendNames).toContain('React 19');
    expect(frontendNames).toContain('TypeScript');
    expect(frontendNames).toContain('Tailwind CSS');
    expect(frontendNames).toContain('Shadcn/ui');
  });

  it('backend incluye Groq (Llama 3.3)', () => {
    const backendNames = TECH_STACK_MVP.backend.map((t) => t.name);
    expect(backendNames).toContain('Groq (Llama 3.3)');
    expect(backendNames).toContain('Vercel Postgres');
  });

  it('cada tecnología tiene name y purpose', () => {
    const allTech = [
      ...TECH_STACK_MVP.frontend,
      ...TECH_STACK_MVP.backend,
      ...TECH_STACK_MVP.infra,
      ...TECH_STACK_MVP.analytics,
    ];

    allTech.forEach((tech) => {
      expect(tech).toHaveProperty('name');
      expect(tech).toHaveProperty('purpose');
      expect(typeof tech.name).toBe('string');
      expect(typeof tech.purpose).toBe('string');
      expect(tech.name.length).toBeGreaterThan(0);
      expect(tech.purpose.length).toBeGreaterThan(0);
    });
  });
});
```

**Implementación:** Crear `data/tech-stack.ts` con contenido especificado arriba.

**Ejecutar:**
```bash
cd profesional-web
npm test -- tech-stack.test.ts
```

---

### PASO 2: Crear SVG estático (Visual Test)

**Acción:** Crear `public/diagrams/tech-stack.svg` con contenido especificado arriba.

**Test Visual:** Abrir en navegador `http://localhost:3000/diagrams/tech-stack.svg` y verificar:
- 4 capas visibles con colores correctos
- Flechas conectan layers
- Textos legibles
- Sin pixelado al redimensionar

---

### PASO 3: Crear componente `<TechStackDiagram>` (Test-First)

**Test:** `__tests__/components/TechStackDiagram.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TechStackDiagram from '@/components/TechStackDiagram';

describe('TechStackDiagram', () => {
  it('renderiza título principal', () => {
    render(<TechStackDiagram />);
    expect(screen.getByRole('heading', { level: 2, name: /Stack Tecnológico Transparente/i })).toBeInTheDocument();
  });

  it('renderiza descripción del caso de estudio', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText(/Esta web es un caso de estudio/i)).toBeInTheDocument();
  });

  it('muestra imagen SVG del diagrama', () => {
    render(<TechStackDiagram />);
    const img = screen.getByRole('img', { name: /Diagrama arquitectura tech stack/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/diagrams/tech-stack.svg');
  });

  it('renderiza badges de tecnologías frontend', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText('Next.js 15')).toBeInTheDocument();
    expect(screen.getByText('React 19')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renderiza badges de tecnologías backend', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText('Groq (Llama 3.3)')).toBeInTheDocument();
    expect(screen.getByText('Vercel Postgres')).toBeInTheDocument();
  });

  it('cada badge muestra purpose', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText('App Router SSR')).toBeInTheDocument(); // Next.js purpose
    expect(screen.getByText('Chatbot IA')).toBeInTheDocument(); // Groq purpose
  });

  it('grid de badges responsive (2 cols mobile, 4 cols desktop)', () => {
    const { container } = render(<TechStackDiagram />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-4');
  });
});
```

**Implementación:** Crear `components/TechStackDiagram.tsx` con código especificado arriba.

**Ejecutar:**
```bash
cd profesional-web
npm test -- TechStackDiagram.test.tsx
```

---

### PASO 4: Integrar en `app/page.tsx`

**Test:** Actualizar `__tests__/page.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renderiza sección tech stack', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: /Stack Tecnológico/i })).toBeInTheDocument();
  });

  it('sección tech stack aparece después de metodología', () => {
    render(<Home />);
    const methodology = screen.getByRole('region', { name: /metodología/i });
    const techStack = screen.getByRole('region', { name: /tech-stack/i });

    const parent = methodology.parentElement;
    const children = Array.from(parent?.children || []);
    const methodologyIndex = children.indexOf(methodology);
    const techStackIndex = children.indexOf(techStack);

    expect(techStackIndex).toBeGreaterThan(methodologyIndex);
  });
});
```

**Implementación:** Actualizar `app/page.tsx`

```typescript
// ... imports existentes
import TechStackDiagram from "@/components/TechStackDiagram";

export default function Home() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-start">
      <Hero {...heroProps} />
      <PainPoints />
      <CaseGrid {...caseGridProps} />
      <MethodologySection />
      
      {/* NUEVA SECCIÓN */}
      <TechStackDiagram />
      
      <CalendlyModal {...modalProps} />
      <FloatingCalendlyButton {...fabProps} />
      <ChatbotWidget {...chatProps} />
    </main>
  );
}
```

---

### PASO 5: Tests E2E (Playwright)

**Archivo:** `__tests__/e2e/tech-stack.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Sección Tech Stack', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('muestra diagrama SVG y 4 capas', async ({ page }) => {
    await page.locator('section#tech-stack').scrollIntoViewIfNeeded();

    await expect(page.getByRole('heading', { level: 2, name: /Stack Tecnológico Transparente/i })).toBeVisible();

    const img = page.getByRole('img', { name: /Diagrama arquitectura tech stack/i });
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', '/diagrams/tech-stack.svg');
  });

  test('muestra badges de tecnologías en grid', async ({ page }) => {
    await page.locator('section#tech-stack').scrollIntoViewIfNeeded();

    await expect(page.getByText('Next.js 15')).toBeVisible();
    await expect(page.getByText('React 19')).toBeVisible();
    await expect(page.getByText('Groq (Llama 3.3)')).toBeVisible();
    await expect(page.getByText('Vercel Postgres')).toBeVisible();
  });

  test('badges muestran purpose al hover', async ({ page }) => {
    await page.locator('section#tech-stack').scrollIntoViewIfNeeded();

    await expect(page.getByText('App Router SSR')).toBeVisible();
    await expect(page.getByText('Chatbot IA')).toBeVisible();
  });

  test('responsive: 2 columnas en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.locator('section#tech-stack').scrollIntoViewIfNeeded();

    const grid = page.locator('section#tech-stack .grid');
    await expect(grid).toBeVisible();
    // Verificar que badges son visibles (grid responsive funciona)
    await expect(page.getByText('Next.js 15')).toBeVisible();
  });

  test('SVG se carga correctamente', async ({ page }) => {
    // Navegar directamente al SVG
    const response = await page.goto('/diagrams/tech-stack.svg');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image/svg');
  });
});
```

**Ejecutar:**
```bash
cd profesional-web
npm run test:e2e -- tech-stack.spec.ts
```

---

## ✅ Criterios de Aceptación (Gherkin - según Linear)

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

**Mapeo a Tests:**
- ✅ "muestra 4 capas" → SVG contiene 4 `<g id="...">` + tests E2E
- ✅ "flechas conectan capas" → SVG contiene 3 `<line>` con `marker-end`
- ✅ "SVG responsive" → `viewBox` + `preserveAspectRatio` + test visual
- ✅ "grid badges tecnologías" → `TechStackDiagram.test.tsx` + E2E
- ✅ "cada badge nombre + propósito" → `TechBadge` component + tests

---

## 📝 Definition of Done (según Linear)

- [ ] SVG estático `/public/diagrams/tech-stack.svg`
- [ ] Componente `<TechStackDiagram>` en home
- [ ] Archivo `data/tech-stack.ts` con stack completo
- [ ] Grid badges tecnologías bajo diagrama
- [ ] SVG responsive (viewBox preserveAspectRatio)
- [ ] **NO React Flow S4** (estático suficiente) ✅
- [ ] **NO interactividad S4** (click nodes, zoom) ✅
- [ ] SEO: alt text descriptivo, H2 "Stack Tecnológico"
- [ ] Test: SVG carga, badges visibles

---

## 📤 Output Esperado

### 1. Archivos Creados/Modificados

```
profesional-web/
├── data/
│   └── tech-stack.ts                         # NUEVO
├── public/
│   └── diagrams/
│       └── tech-stack.svg                    # NUEVO
├── components/
│   └── TechStackDiagram.tsx                  # NUEVO
├── app/
│   └── page.tsx                              # MODIFICADO (añadir <TechStackDiagram />)
└── __tests__/
    ├── data/
    │   └── tech-stack.test.ts                # NUEVO
    ├── components/
    │   └── TechStackDiagram.test.tsx         # NUEVO
    └── e2e/
        └── tech-stack.spec.ts                # NUEVO
```

### 2. Informe de Implementación

Genera `FJG-54-informe-implementacion.md` en `docs/issues/FJG-54-us-05-002-diagrama-arquitectura-tech-stack-svg-estatico/` con:

- Resumen de cambios (archivos creados/modificados)
- Screenshot desktop + mobile de la sección
- Screenshot del SVG standalone
- Resultados de tests (`npm test` + `npm run test:e2e`)
- Verificación checklist DoD
- Confirmación SVG responsive (sin pixelado)

---

## 🚨 Restricciones y Consideraciones

### Navaja de Ockham (CRÍTICO)
- **NO** usar React Flow ni librerías de diagramas interactivos
- **NO** crear interactividad (zoom, pan, click nodes) en S4
- **NO** usar componentes SVG dinámicos (solo archivo estático)
- **SVG estático = suficiente** para MVP (decisión anti-camello)

### SVG Técnico
- **viewBox**: `0 0 800 600` (fijo, escalará proporcionalmente)
- **preserveAspectRatio**: `xMidYMid meet` (centra y ajusta)
- **Text rendering**: Sistema operará con fuentes del navegador
- **Accesibilidad**: Alt text descriptivo en `<img>`

### Data File
- **TypeScript types**: Exportar `TechItem` y `TechStack` interfaces
- **Extensible**: Estructura permite añadir categorías futuras
- **Single source of truth**: Data file alimenta badges (no hardcoded)

### Integración
- **Posición**: Después de `<MethodologySection />`, antes de `<CalendlyModal />`
- **Spacing**: Padding vertical 16 (py-16) consistente con otras secciones
- **Background**: `bg-slate-50` (alternado con white sections)

### SEO
- **H2**: "Stack Tecnológico Transparente"
- **Alt text**: Descriptivo completo (menciona las 4 capas + tecnologías clave)
- **Keywords implícitos**: "Next.js", "React", "TypeScript", "Vercel", "Postgres", "Groq"

---

## 🔗 Referencias

- **Issue Linear:** [FJG-54](https://linear.app/fjgaparicio/issue/FJG-54)
- **Branch Git:** `fjgonzalez25691-fjg-54-us-05-002-diagrama-arquitectura-tech-stack-svg-estatico`
- **SVG Docs:** https://developer.mozilla.org/en-US/docs/Web/SVG
- **Tailwind CSS v4:** https://tailwindcss.com/docs

---

**RECORDATORIO FINAL:**  
Esta implementación sigue **ESTRICTAMENTE** la decisión anti-camello de Linear FJG-54. **NO implementar interactividad ni React Flow** en este sprint. SVG estático es **suficiente** para validar transparencia técnica en MVP.
