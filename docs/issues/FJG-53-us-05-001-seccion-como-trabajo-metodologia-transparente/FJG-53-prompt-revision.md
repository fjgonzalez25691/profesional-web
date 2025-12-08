# FJG-53: Prompt de Revisión
## US-05-001: Sección "Cómo Trabajo" Metodología Transparente

**Rol:** Agent Reviewer  
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

**Criterios de Aceptación (Gherkin):**
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

**Definition of Done:**
- Sección "Cómo Trabajo" visible home (tras casos éxito)
- Componente `<MethodologySection>` con 3 `<PhaseCard>`
- Timeline visual desktop (horizontal) + mobile (vertical)
- Copy aprobado enfoque P&L (no jargon técnico)
- Badge "Anti-camello" destacado Fase 2
- Responsive mobile+desktop
- SEO: H2 "Cómo Trabajo", keywords metadata
- Test `methodology.spec.ts`: 3 fases visibles

---

## 🎯 Objetivo de la Revisión

Verificar que la implementación cumple con:
1. **Copy exacto de Linear** (texto literal de las 3 fases)
2. **Badge "anti-camello"** visible y destacado en Fase 2
3. **Timeline visual** funcional en desktop (horizontal) y mobile (vertical)
4. **Responsive** correcto (3 cols desktop, 1 col mobile)
5. **Tests completos** (unitarios + E2E)
6. **SEO** keywords implementados

---

## ✅ Checklist de Revisión

### 1. Verificación Copy Literal (CRÍTICO)

**Acción:** Leer `components/MethodologySection.tsx`

**Texto OBLIGATORIO según Linear:**

**Fase 1:**
- Título: "Fase 1: Auditoría Express 48h"
- Acciones:
  - "Análisis factura cloud (AWS/Azure/GCP)"
  - "Detección procesos manuales > 5h/semana"
  - "Forecasting actual vs óptimo"
- Entregable: "Report 1 página con 3 quick wins"

**Fase 2:**
- Título: "Fase 2: Roadmap Priorizado ROI"
- Acciones:
  - "Priorizamos por payback <6 meses"
  - "Evitamos over-engineering" (puede tener referencia a "anti-camello")
  - "Roadmap 90 días máximo"
- Entregable: "Roadmap con inversión/ahorro cada item"
- Badge: "anti-camello"

**Fase 3:**
- Título: "Fase 3: Implementación Supervisada"
- Acciones:
  - "Tu equipo ejecuta, yo superviso"
  - "Revisiones semanales 1h"
  - "Transferencia conocimiento incluida"
- Entregable: "Garantía: Si no reduces >20% → no cobro"

**Verificar:**
- [ ] Copy de las 3 fases coincide 100% con Linear (sin variaciones)
- [ ] No hay jargon técnico innecesario
- [ ] Enfoque P&L presente ("payback", "ahorro", "ROI", "garantía")

**Criterios de FALLO (❌):**
- Copy modificado o parafraseado sin aprobación
- Jargon técnico añadido ("microservicios", "arquitectura", etc.)
- Falta alguna acción o entregable

---

### 2. Badge "Anti-Camello" Visible

**Acción:** Leer `components/MethodologySection.tsx` y verificar implementación del badge

**Verificar:**
- [ ] Badge "anti-camello" presente en Fase 2
- [ ] Diseño destacado (color distinto, border, posición visible)
- [ ] Badge NO aparece en Fase 1 ni Fase 3

**Criterios de FALLO (❌):**
- Badge no implementado
- Badge no visible o muy pequeño
- Badge en fase incorrecta

---

### 3. Timeline Visual Implementada

**Acción:** Leer `components/MethodologySection.tsx`

**Verificar Desktop:**
- [ ] Timeline horizontal conecta las 3 fases
- [ ] Timeline visible solo en desktop (clase `hidden md:flex` o similar)
- [ ] Diseño visual claro (línea, gradiente, o similar)

**Verificar Mobile:**
- [ ] Timeline vertical en mobile (o adaptación visual clara)
- [ ] Cards en 1 columna vertical
- [ ] Timeline NO horizontal en mobile

**Criterios de FALLO (❌):**
- Timeline no implementada o no visible
- Timeline horizontal en mobile (scroll horizontal)
- Timeline no conecta visualmente las 3 fases

---

### 4. Componente `<MethodologySection>` y `<PhaseCard>`

**Acción:** Leer `components/MethodologySection.tsx`

**Verificar:**
- [ ] Componente `<MethodologySection>` exportado por defecto
- [ ] `<PhaseCard>` interno (no exportado) con props: icon, title, duration, actions, deliverable, badge?
- [ ] 3 `<PhaseCard>` renderizadas con datos correctos
- [ ] Iconos de Lucide React usados (FileSearch, ListOrdered, Users o similares)

**Criterios de FALLO (❌):**
- `<PhaseCard>` no existe o está en archivo separado (over-engineering)
- Iconos no usados o importados de librería externa innecesaria
- Más de 3 fases renderizadas

---

### 5. Integración en `app/page.tsx`

**Acción:** Leer `app/page.tsx`

**Verificar:**
- [ ] `<MethodologySection />` importado correctamente
- [ ] Sección aparece DESPUÉS de `<CaseGrid />` (tras casos de éxito)
- [ ] Sección aparece ANTES de `<CalendlyModal />` y `<FloatingCalendlyButton />`

**Criterios de FALLO (❌):**
- Sección no integrada en `page.tsx`
- Orden incorrecto (aparece antes de casos de éxito)
- Import incorrecto o componente no encontrado

---

### 6. Responsive Desktop + Mobile

**Acción:** Revisar clases Tailwind en `components/MethodologySection.tsx`

**Verificar Desktop (≥768px):**
- [ ] 3 columnas (`grid grid-cols-3` o similar)
- [ ] Timeline horizontal visible
- [ ] Padding y espaciado adecuados

**Verificar Mobile (<768px):**
- [ ] 1 columna (`flex flex-col` o `grid grid-cols-1`)
- [ ] Timeline vertical o adaptación clara
- [ ] Texto legible (font-size ≥14px)
- [ ] Padding mobile correcto (no texto pegado a bordes)

**Criterios de FALLO (❌):**
- Desktop no muestra 3 columnas
- Mobile muestra scroll horizontal
- Texto ilegible en mobile (muy pequeño)

---

### 7. Tests Unitarios

**Acción:** Leer y ejecutar `__tests__/components/MethodologySection.test.tsx`

**Verificar:**
- [ ] Test "renderiza título principal de la sección" ✅
- [ ] Test "renderiza 3 fases con títulos correctos" ✅
- [ ] Test "muestra badge anti-camello en Fase 2" ✅
- [ ] Test "muestra timeline conectando fases en desktop" ✅
- [ ] Test "muestra entregables de cada fase" ✅

**Ejecutar:**
```bash
cd profesional-web
npm test -- MethodologySection.test.tsx
```

**Criterios de FALLO (❌):**
- Tests no existen o están comentados
- Tests fallan
- Tests no cubren badge o timeline

---

### 8. Tests E2E (Playwright)

**Acción:** Leer y ejecutar `__tests__/e2e/methodology.spec.ts`

**Verificar:**
- [ ] Test "muestra las 3 fases en orden correcto" ✅
- [ ] Test "muestra badge anti-camello en Fase 2" ✅
- [ ] Test "muestra timeline en desktop" ✅
- [ ] Test "muestra cards verticales en mobile" ✅
- [ ] Test "entregables visibles para cada fase" ✅

**Ejecutar:**
```bash
cd profesional-web
npm run test:e2e -- methodology.spec.ts
```

**Criterios de FALLO (❌):**
- Tests E2E no existen
- Tests fallan
- Tests no verifican mobile (viewport 375px)

---

### 9. SEO Metadata

**Acción:** Leer `app/page.tsx` (metadata export)

**Verificar:**
- [ ] H2 en componente: "Cómo Trabajo: 3 Fases Enfocadas en P&L"
- [ ] Keywords incluyen:
  - "consultor cloud enfoque ROI"
  - "reducir costes AWS metodología"
  - "automatización procesos industriales"
  - "auditoría cloud 48 horas"
- [ ] Meta description menciona "metodología transparente" + "3 fases"

**Criterios de FALLO (❌):**
- H2 no es semántico (usa `<div>` en vez de `<h2>`)
- Keywords faltantes o incorrectos
- Meta description no actualizada

---

### 10. Navaja de Ockham (Anti-Over-Engineering)

**Acción:** Revisar estructura de archivos y componentes

**Verificar:**
- [ ] `<PhaseCard>` es componente INTERNO (no archivo separado)
- [ ] NO se crearon carpetas innecesarias (`components/methodology/`)
- [ ] NO se usaron librerías de animación externas (solo Tailwind)
- [ ] NO se creó API route para contenido estático

**Criterios de FALLO (❌):**
- `<PhaseCard>` en archivo separado
- Librerías externas añadidas (Framer Motion, GSAP, etc.)
- Estructura de carpetas excesiva

---

## 📤 Output: Informe de Revisión

**Archivo:** `FJG-53-informe-revision.md` (generar en misma carpeta)

**Estructura del informe:**

```markdown
# Informe de Revisión - FJG-53

## Veredicto: [✅ APROBADO | ⚠️ APROBADO CON OBSERVACIONES | ❌ RECHAZADO]

## 1. Copy Literal de Linear
- Estado: [✅ | ⚠️ | ❌]
- Fase 1: [✅ | ❌] - ...
- Fase 2: [✅ | ❌] - ...
- Fase 3: [✅ | ❌] - ...
- Observaciones: ...

## 2. Badge "Anti-Camello"
- Estado: [✅ | ⚠️ | ❌]
- Visible en Fase 2: [✅ | ❌]
- Diseño destacado: [✅ | ❌]

## 3. Timeline Visual
- Estado: [✅ | ⚠️ | ❌]
- Desktop horizontal: [✅ | ❌]
- Mobile vertical: [✅ | ❌]

## 4. Componentes
- Estado: [✅ | ⚠️ | ❌]
- <MethodologySection>: [✅ | ❌]
- <PhaseCard> interno: [✅ | ❌]
- Iconos Lucide: [✅ | ❌]

## 5. Integración page.tsx
- Estado: [✅ | ⚠️ | ❌]
- Después de CaseGrid: [✅ | ❌]
- Import correcto: [✅ | ❌]

## 6. Responsive
- Estado: [✅ | ⚠️ | ❌]
- Desktop 3 columnas: [✅ | ❌]
- Mobile 1 columna: [✅ | ❌]
- Texto legible mobile: [✅ | ❌]

## 7. Tests Unitarios
- Estado: [✅ | ⚠️ | ❌]
- Resultado ejecución: [todos verdes | X fallos]
- Cobertura badge: [✅ | ❌]
- Cobertura timeline: [✅ | ❌]

## 8. Tests E2E
- Estado: [✅ | ⚠️ | ❌]
- Resultado ejecución: [todos verdes | X fallos]
- Test mobile viewport: [✅ | ❌]

## 9. SEO Metadata
- Estado: [✅ | ⚠️ | ❌]
- H2 semántico: [✅ | ❌]
- Keywords correctos: [✅ | ❌]
- Meta description: [✅ | ❌]

## 10. Navaja de Ockham
- Estado: [✅ | ⚠️ | ❌]
- PhaseCard interno: [✅ | ❌]
- Sin librerías externas: [✅ | ❌]

## Resumen de Issues Encontrados
[Lista numerada de problemas, si los hay]

## Aprobación Final
- [ ] Código listo para merge
- [ ] Requiere correcciones (ver issues)
```

---

## 🚨 Criterios de Veredicto

### ✅ APROBADO
- Copy literal de Linear implementado 100%
- Badge "anti-camello" visible y destacado en Fase 2
- Timeline visual funcional desktop + mobile
- Tests verdes (unitarios + E2E)
- Responsive correcto
- SEO keywords implementados
- Sin over-engineering

### ⚠️ APROBADO CON OBSERVACIONES
- Copy correcto pero diseño visual mejorable (sugerencias no bloqueantes)
- Timeline funcional pero podría optimizarse
- Tests verdes pero podrían ampliarse
- SEO correcto pero meta description mejorable

### ❌ RECHAZADO
- Copy modificado o incorrecto vs Linear
- Badge "anti-camello" faltante o no visible
- Timeline no implementada o rota
- Tests fallan o no existen
- Responsive roto (scroll horizontal mobile)
- Over-engineering (componentes innecesarios, librerías externas)

---

## 🔗 Referencias

- **Issue Linear:** [FJG-53](https://linear.app/fjgaparicio/issue/FJG-53)
- **Prompt Implementación:** `FJG-53-prompt-implementacion.md`
- **Constitución:** `.prompts/CONSTITUCION.md`
- **Roles:** `.prompts/ROLES.md`

---

**RECORDATORIO:**  
Como Reviewer, tu rol es **SOLO LECTURA**. NO corrijas código, NO generes bloques de código en el chat. Si encuentras errores, documéntalos en el informe y rechaza la tarea (❌) para que el Developer la corrija.

**CRÍTICO:** El copy de las 3 fases debe ser **literal** según Linear. Cualquier modificación sin aprobación de Fran es motivo de rechazo automático (❌).
