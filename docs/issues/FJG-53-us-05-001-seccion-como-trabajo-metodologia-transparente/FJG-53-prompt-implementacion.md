# FJG-53: Prompt de Implementación
## US-05-001: Sección "Cómo Trabajo" Metodología Transparente

**Rol:** Agent Developer  
**Issue Linear:** FJG-53  
**Estimación:** 3 SP  
**Prioridad:** Medium  
**Sprint:** S4 (Días 22-28)

---

## 📋 Contexto de la Issue (desde Linear)

**Historia de Usuario:**  
Como CEO técnicamente curioso  
Quiero entender cómo trabajas antes de agendar  
Para validar eres diferente a consultoras genéricas

**Impacto Negocio:**  
Diferenciación competitiva. Consultoras genéricas = caja negra. Transparencia metodología = confianza. CEO lee "Auditoría 48h → Roadmap priorizado P&L → Implementación supervisada" → entiende proceso → confía. **Impacto "Posicionamiento P&L" (18%)**.

**Bloqueadores:**  
- FJG-36 (US-01-002 - Deploy funcionando) ✅ COMPLETADO

**Bloquea a:**  
- US-06-002 (recomienda estructura metodología)

---

## 🎯 Objetivo de la Implementación

Crear sección "Cómo Trabajo" en landing que explica las 3 fases de metodología enfocada en P&L:
1. **Auditoría Express 48h** - Análisis inicial + quick wins
2. **Roadmap Priorizado ROI** - Payback <6 meses + anti-camello
3. **Implementación Supervisada** - Ejecución + garantía 20%

**Diferenciador clave:** Destacar "anti-camello" (evitar over-engineering) como badge distintivo en Fase 2.

---

## 📐 Estado Actual del Proyecto

### Estructura Existente
```
profesional-web/
├── app/
│   └── page.tsx              # Landing principal (Hero + PainPoints + CaseGrid)
├── components/
│   ├── Hero.tsx              # Ya existe
│   ├── PainPoints.tsx        # Ya existe
│   ├── CaseGrid.tsx          # Ya existe
│   ├── Footer.tsx            # Ya existe
│   └── ui/                   # Shadcn/ui components
└── __tests__/
    └── components/           # Tests unitarios
```

### Stack Técnico
- **Next.js 16.0.6** (App Router) + React 19 + TypeScript strict
- **Tailwind CSS 4.1.17** (v4 moderna)
- **Shadcn/ui** (estilo New York)
- **Lucide React** (iconos)
- **Vitest 4.0.14** + Testing Library

---

## 🆕 Contenido a Implementar (según Linear)

### Texto Literal de las 3 Fases

```markdown
## Cómo Trabajo: 3 Fases Enfocadas en P&L

### Fase 1: Auditoría Express 48h
- Análisis factura cloud (AWS/Azure/GCP)
- Detección procesos manuales > 5h/semana
- Forecasting actual vs óptimo
- **Entregable**: Report 1 página con 3 quick wins

### Fase 2: Roadmap Priorizado ROI
- Priorizamos por payback <6 meses
- Evitamos over-engineering ("anti-camello")
- Roadmap 90 días máximo
- **Entregable**: Roadmap con inversión/ahorro cada item

### Fase 3: Implementación Supervisada
- Tu equipo ejecuta, yo superviso
- Revisiones semanales 1h
- Transferencia conocimiento incluida
- **Garantía**: Si no reduces >20% → no cobro
```

---

## 🧪 Plan de Implementación TDD

### PASO 1: Crear componente `<PhaseCard>` (Test-First)

**Test:** `__tests__/components/MethodologySection.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MethodologySection from '@/components/MethodologySection';

describe('MethodologySection', () => {
  it('renderiza título principal de la sección', () => {
    render(<MethodologySection />);
    expect(screen.getByRole('heading', { level: 2, name: /Cómo Trabajo: 3 Fases Enfocadas en P&L/i })).toBeInTheDocument();
  });

  it('renderiza 3 fases con títulos correctos', () => {
    render(<MethodologySection />);
    expect(screen.getByRole('heading', { level: 3, name: /Fase 1: Auditoría Express 48h/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Fase 2: Roadmap Priorizado ROI/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Fase 3: Implementación Supervisada/i })).toBeInTheDocument();
  });

  it('muestra badge "anti-camello" en Fase 2', () => {
    render(<MethodologySection />);
    expect(screen.getByText(/anti-camello/i)).toBeInTheDocument();
  });

  it('muestra timeline conectando fases en desktop', () => {
    render(<MethodologySection />);
    // Timeline debe tener clase específica para desktop
    const timeline = screen.getByTestId('methodology-timeline');
    expect(timeline).toHaveClass('hidden', 'md:flex');
  });

  it('muestra entregables de cada fase', () => {
    render(<MethodologySection />);
    expect(screen.getByText(/Report 1 página con 3 quick wins/i)).toBeInTheDocument();
    expect(screen.getByText(/Roadmap con inversión\/ahorro cada item/i)).toBeInTheDocument();
    expect(screen.getByText(/Si no reduces >20% → no cobro/i)).toBeInTheDocument();
  });
});
```

**Implementación:** `components/MethodologySection.tsx`

```typescript
import { FileSearch, ListOrdered, Users } from 'lucide-react';

interface PhaseCardProps {
  icon: React.ReactNode;
  title: string;
  duration: string;
  actions: string[];
  deliverable: string;
  badge?: string;
}

function PhaseCard({ icon, title, duration, actions, deliverable, badge }: PhaseCardProps) {
  return (
    <div className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{duration}</p>
          </div>
        </div>
        {badge && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-300">
            {badge}
          </span>
        )}
      </div>
      
      <ul className="mb-4 space-y-2 grow">
        {actions.map((action, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
            <span>{action}</span>
          </li>
        ))}
      </ul>
      
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm">
          <span className="font-semibold text-gray-900">Entregable: </span>
          <span className="text-gray-700">{deliverable}</span>
        </p>
      </div>
    </div>
  );
}

export default function MethodologySection() {
  const phases = [
    {
      icon: <FileSearch className="h-6 w-6" />,
      title: 'Fase 1: Auditoría Express 48h',
      duration: '48 horas',
      actions: [
        'Análisis factura cloud (AWS/Azure/GCP)',
        'Detección procesos manuales > 5h/semana',
        'Forecasting actual vs óptimo',
      ],
      deliverable: 'Report 1 página con 3 quick wins',
    },
    {
      icon: <ListOrdered className="h-6 w-6" />,
      title: 'Fase 2: Roadmap Priorizado ROI',
      duration: '1 semana',
      actions: [
        'Priorizamos por payback <6 meses',
        'Evitamos over-engineering',
        'Roadmap 90 días máximo',
      ],
      deliverable: 'Roadmap con inversión/ahorro cada item',
      badge: 'anti-camello',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Fase 3: Implementación Supervisada',
      duration: '90 días',
      actions: [
        'Tu equipo ejecuta, yo superviso',
        'Revisiones semanales 1h',
        'Transferencia conocimiento incluida',
      ],
      deliverable: 'Garantía: Si no reduces >20% → no cobro',
    },
  ];

  return (
    <section id="metodologia" className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          Cómo Trabajo: 3 Fases Enfocadas en P&L
        </h2>
        
        {/* Desktop: 3 columnas con timeline */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-6 relative">
            {phases.map((phase, idx) => (
              <PhaseCard key={idx} {...phase} />
            ))}
            
            {/* Timeline horizontal */}
            <div 
              data-testid="methodology-timeline"
              className="absolute top-14 left-0 right-0 flex items-center justify-between px-24 pointer-events-none  md:flex"
            >
              <div className="h-0.5 w-full bg-linear-r from-blue-400 via-amber-400 to-green-400" />
            </div>
          </div>
        </div>
        
        {/* Mobile: 1 columna con timeline vertical */}
        <div className="md:hidden space-y-6 relative">
          {/* Timeline vertical */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-linear-b from-blue-400 via-amber-400 to-green-400" />
          
          {phases.map((phase, idx) => (
            <div key={idx} className="relative pl-4">
              <PhaseCard {...phase} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Ejecutar test:**
```bash
cd profesional-web
npm test -- MethodologySection.test.tsx
```

---

### PASO 2: Integrar en `app/page.tsx`

**Test:** Actualizar `__tests__/page.test.tsx` (o crear si no existe)

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renderiza sección de metodología', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2, name: /Cómo Trabajo/i })).toBeInTheDocument();
  });
  
  it('sección metodología aparece después de casos de éxito', () => {
    render(<Home />);
    const caseGrid = screen.getByRole('region', { name: /casos/i });
    const methodology = screen.getByRole('region', { name: /metodología/i });
    
    // Verificar orden en el DOM
    const parent = caseGrid.parentElement;
    const children = Array.from(parent?.children || []);
    const caseIndex = children.indexOf(caseGrid);
    const methodologyIndex = children.indexOf(methodology);
    
    expect(methodologyIndex).toBeGreaterThan(caseIndex);
  });
});
```

**Implementación:** Actualizar `app/page.tsx`

```typescript
// ... imports existentes
import MethodologySection from "@/components/MethodologySection";

export default function Home() {
  // ... código existente

  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-start">
      <Hero {...heroProps} />
      <PainPoints />
      <CaseGrid {...caseGridProps} />
      
      {/* NUEVA SECCIÓN */}
      <MethodologySection />
      
      <CalendlyModal {...modalProps} />
      <FloatingCalendlyButton {...fabProps} />
      <ChatbotWidget {...chatProps} />
    </main>
  );
}
```

---

### PASO 3: Añadir metadatos SEO

**Archivo:** `app/page.tsx` (metadata)

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultor Cloud & IA enfocado en P&L | Fran J. González",
  description: "Reduzco costes cloud, automatizo procesos y optimizo forecasting. Metodología transparente: Auditoría 48h + Roadmap ROI + Garantía 20%. +37 años experiencia operaciones.",
  keywords: [
    "consultor cloud enfoque ROI",
    "reducir costes AWS metodología",
    "automatización procesos industriales",
    "auditoría cloud 48 horas",
    "consultor IA P&L",
    "optimización forecasting",
  ],
  openGraph: {
    title: "Metodología Transparente Cloud & IA | Fran J. González",
    description: "3 fases enfocadas en P&L: Auditoría Express 48h, Roadmap Priorizado ROI, Implementación Supervisada con garantía.",
  },
};
```

---

### PASO 4: Tests E2E (Playwright)

**Archivo:** `__tests__/e2e/methodology.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Sección Metodología', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('muestra las 3 fases en orden correcto', async ({ page }) => {
    await page.locator('section#metodologia').scrollIntoViewIfNeeded();
    
    await expect(page.getByRole('heading', { level: 2, name: /Cómo Trabajo: 3 Fases Enfocadas en P&L/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: /Fase 1: Auditoría Express 48h/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: /Fase 2: Roadmap Priorizado ROI/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: /Fase 3: Implementación Supervisada/i })).toBeVisible();
  });

  test('muestra badge anti-camello en Fase 2', async ({ page }) => {
    await page.locator('section#metodologia').scrollIntoViewIfNeeded();
    await expect(page.getByText('anti-camello')).toBeVisible();
  });

  test('muestra timeline en desktop', async ({ page, viewport }) => {
    test.skip(viewport?.width && viewport.width < 768, 'Solo desktop');
    
    await page.locator('section#metodologia').scrollIntoViewIfNeeded();
    const timeline = page.getByTestId('methodology-timeline');
    await expect(timeline).toBeVisible();
  });

  test('muestra cards verticales en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.locator('section#metodologia').scrollIntoViewIfNeeded();
    
    // Verificar que las 3 cards son visibles en vertical
    const phase1 = page.getByRole('heading', { level: 3, name: /Fase 1/i });
    const phase2 = page.getByRole('heading', { level: 3, name: /Fase 2/i });
    const phase3 = page.getByRole('heading', { level: 3, name: /Fase 3/i });
    
    await expect(phase1).toBeVisible();
    await expect(phase2).toBeVisible();
    await expect(phase3).toBeVisible();
  });

  test('entregables visibles para cada fase', async ({ page }) => {
    await page.locator('section#metodologia').scrollIntoViewIfNeeded();
    
    await expect(page.getByText(/Report 1 página con 3 quick wins/i)).toBeVisible();
    await expect(page.getByText(/Roadmap con inversión\/ahorro cada item/i)).toBeVisible();
    await expect(page.getByText(/Si no reduces >20% → no cobro/i)).toBeVisible();
  });
});
```

---

## ✅ Criterios de Aceptación (Gherkin - según Linear)

```gherkin
Feature: Sección metodología transparente
  Scenario: Lectura completa
    Given scroll a "Cómo Trabajo"
    When leo sección
    Then veo 3 fases claramente separadas
    And cada fase muestra: duración, acciones, entregable
    And veo timeline visual conectando fases
    And destaca "anti-camello" Fase 2

  Scenario: Mobile UX
    Given estoy en mobile
    When scroll a metodología
    Then veo 3 cards verticales
    And timeline adapta vertical
    And texto legible sin zoom
```

**Mapeo a Tests:**
- ✅ "veo 3 fases" → `MethodologySection.test.tsx` + `methodology.spec.ts`
- ✅ "cada fase muestra duración/acciones/entregable" → `MethodologySection.test.tsx`
- ✅ "timeline visual" → `MethodologySection.test.tsx` (desktop) + `methodology.spec.ts`
- ✅ "destaca anti-camello" → `MethodologySection.test.tsx` + `methodology.spec.ts`
- ✅ "mobile 3 cards verticales" → `methodology.spec.ts` (viewport 375px)

---

## 📝 Definition of Done (según Linear)

- [ ] Sección "Cómo Trabajo" visible home (tras casos éxito)
- [ ] Componente `<MethodologySection>` con 3 `<PhaseCard>`
- [ ] Timeline visual desktop (horizontal) + mobile (vertical)
- [ ] Copy aprobado enfoque P&L (no jargon técnico)
- [ ] Badge "Anti-camello" destacado Fase 2
- [ ] Responsive mobile+desktop
- [ ] SEO: H2 "Cómo Trabajo", keywords metadata
- [ ] Test `methodology.spec.ts`: 3 fases visibles

---

## 📤 Output Esperado

### 1. Archivos Creados/Modificados

```
profesional-web/
├── components/
│   └── MethodologySection.tsx           # NUEVO
├── app/
│   └── page.tsx                         # MODIFICADO (añadir <MethodologySection />)
└── __tests__/
    ├── components/
    │   └── MethodologySection.test.tsx  # NUEVO
    └── e2e/
        └── methodology.spec.ts          # NUEVO
```

### 2. Informe de Implementación

Genera `FJG-53-informe-implementacion.md` en `docs/issues/FJG-53-us-05-001-seccion-como-trabajo-metodologia-transparente/` con:

- Resumen de cambios (archivos creados/modificados)
- Screenshots desktop + mobile de la sección
- Resultados de tests (`npm test` + `npm run test:e2e`)
- Verificación checklist DoD
- Confirmación de keywords SEO añadidos

---

## 🚨 Restricciones y Consideraciones

### Navaja de Ockham
- **NO** crear componentes reutilizables innecesarios (solo `PhaseCard` interno a `MethodologySection`)
- **NO** usar librerías de animación externas (solo Tailwind transitions)
- **NO** crear API routes ni backend para contenido estático

### Copy y Tono
- **Texto literal de Linear:** NO cambiar copy de las 3 fases sin aprobación
- **Profesional pero directo:** No técnico, no pomposo
- **Enfoque P&L:** "payback", "ahorro", "ROI", "garantía"

### Responsive
- Desktop: 3 columnas con timeline horizontal
- Tablet (md): 2 columnas + adaptar timeline
- Mobile: 1 columna + timeline vertical
- Texto legible sin zoom (min font-size 14px mobile)

### SEO
- H2 "Cómo Trabajo: 3 Fases Enfocadas en P&L"
- Keywords: "consultor cloud enfoque ROI", "auditoría cloud 48 horas", "automatización procesos industriales", "reducir costes AWS metodología"
- Meta description: incluir "metodología transparente" + "3 fases"

---

## 🔗 Referencias

- **Issue Linear:** [FJG-53](https://linear.app/fjgaparicio/issue/FJG-53)
- **Branch Git:** `fjgonzalez25691-fjg-53-us-05-001-seccion-como-trabajo-metodologia-transparente`
- **Documentación Tailwind CSS v4:** https://tailwindcss.com/docs
- **Lucide React Icons:** https://lucide.dev/icons

---

**RECORDATORIO FINAL:**  
Esta implementación sigue **ESTRICTAMENTE** la especificación de Linear FJG-53. El copy de las 3 fases es **literal** y NO debe modificarse. Si tienes dudas sobre diseño o variaciones, **PARAR** y consultar con Fran.
