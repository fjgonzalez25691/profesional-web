# FJG-102: Mejora de espaciado y microinteracciones v0

**Issue Linear:** https://linear.app/fjgaparicio/issue/FJG-102  
**Rol:** Developer  
**Prioridad:** Media  
**Estimación:** 2 Story Points  
**Dependencias:** FJG-99 (Tema), FJG-100 (Header), FJG-101 (Paleta activa)

---

## Contexto

La landing actual funciona pero transmite sensación de "bloques pegados" y falta de pulido. Esta issue es una **primera iteración (v0)** para mejorar espaciado y añadir microinteracciones básicas que den sensación de cuidado profesional.

**No se busca perfección pixel-perfect**, sino una mejora perceptible que justifique futuras iteraciones v2.

---

## Criterios de Aceptación (desde Linear)

```gherkin
Given que tengo la landing funcionando con tema y header
When navego por las secciones principales
Then el espaciado vertical entre secciones es más consistente que antes
And las cards clave muestran microinteracción visible al hover
And los CTAs principales ofrecen feedback visual al interactuar
And hay 2-3 puntos anotados en comentarios para futura v2
And Fran da el OK al aspecto final
```

**CA Flexibles:**
- Espaciado vertical consistente entre secciones
- Microinteracciones visibles en cards (hover suave)
- Feedback visual en CTAs (hover, focus)
- 2-3 puntos documentados para v2
- Aprobación visual de Fran

---

## Definition of Done (DoD)

1. Al navegar la home se percibe menos bloques pegados y más cuidado en interacción
2. Sin regresiones de layout (roturas, solapamientos evidentes)
3. Comentario en Linear explicando cambios y qué se deja para v2

---

## Plan de Implementación (TDD)

### Fase 1: Auditoría de Espaciado Actual (15 min)

**Acción:**
1. Revisar secciones principales: Hero, PainPoints, CaseGrid, MethodologySection, TechStackDiagram, Footer
2. Medir espaciado vertical actual (padding-top, padding-bottom de cada section)
3. Identificar inconsistencias evidentes
4. Documentar en `AUDIT_SPACING.md` (temporal):
   - Espaciado actual de cada sección
   - Inconsistencias detectadas
   - Propuesta de pauta base (ej: py-16, py-20, py-24)

**Salida esperada:**
- Documento con tabla de auditoría:
  - Sección | Padding Actual | Propuesta v0 | Notas v2

**Tests:**
- N/A (fase de análisis)

---

### Fase 2: Definir Pauta Base de Espaciado (10 min)

**Acción:**
1. Decidir escala de espaciado vertical base:
   - Mobile: `py-12` o `py-16`
   - Desktop: `py-16` o `py-20` o `py-24`
2. Decidir ancho máximo de contenedor si no está definido:
   - Actual: `max-w-7xl` es común en el proyecto
   - Verificar consistencia en todas las secciones
3. Documentar decisión en `SPACING_GUIDELINES.md` (temporal)

**Ejemplo de pauta:**
```
Espaciado vertical entre secciones:
- Mobile: py-12 (3rem = 48px)
- Desktop: py-20 (5rem = 80px)

Ancho máximo contenedor:
- max-w-7xl (80rem = 1280px)

Excepciones:
- Hero: puede tener py mayor (py-24) por ser landing principal
- Footer: puede tener py menor (py-12)
```

**Tests:**
- N/A (fase de diseño)

---

### Fase 3: Aplicar Pauta de Espaciado (30 min)

**Acción:**
1. Modificar secciones principales aplicando pauta decidida
2. Ajustar gaps internos en cards (PainPoints, CaseGrid)
3. Verificar que max-w-7xl está en todas las secciones

**Ejemplo de cambios:**

**Hero.tsx:**
```tsx
// ANTES (hipotético)
<section className="min-h-[90vh] py-12 bg-surface-950">

// DESPUÉS
<section className="min-h-[90vh] py-12 md:py-24 bg-surface-950">
```

**PainPoints.tsx:**
```tsx
// ANTES
<section className="py-16 bg-surface-900">

// DESPUÉS
<section className="py-12 md:py-20 bg-surface-900">
```

**CaseGrid.tsx:**
```tsx
// ANTES
<section className="py-20 bg-surface-950">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// DESPUÉS
<section className="py-12 md:py-20 bg-surface-950">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
```

**Tests:**
1. **E2E test:** `__tests__/e2e/spacing.spec.ts`
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Espaciado consistente entre secciones', () => {
     test('Hero tiene padding vertical adecuado', async ({ page }) => {
       await page.goto('/');
       
       const hero = page.locator('#hero');
       await expect(hero).toBeVisible();
       
       // Verificar padding en desktop (viewport grande)
       await page.setViewportSize({ width: 1280, height: 720 });
       const heroBox = await hero.boundingBox();
       expect(heroBox?.height).toBeGreaterThan(600); // min-h-[90vh] aprox
     });

     test('Secciones principales tienen espaciado consistente', async ({ page }) => {
       await page.goto('/');
       
       const sections = [
         '#hero',
         '#pain-points',
         '#cases',
         '#methodology'
       ];
       
       for (const selector of sections) {
         const section = page.locator(selector);
         await expect(section).toBeVisible();
         
         // Verificar que tiene clase de padding vertical
         const classes = await section.getAttribute('class');
         expect(classes).toMatch(/py-(12|16|20|24)/);
       }
     });

     test('Cards en CaseGrid tienen gap consistente', async ({ page }) => {
       await page.goto('/');
       
       const grid = page.locator('[data-testid="case-grid-container"]');
       await expect(grid).toBeVisible();
       
       const classes = await grid.getAttribute('class');
       expect(classes).toContain('gap-6');
       expect(classes).toMatch(/md:gap-8/);
     });
   });
   ```

2. **Visual regression (opcional):**
   ```typescript
   test('Screenshot de espaciado general', async ({ page }) => {
     await page.goto('/');
     await page.waitForLoadState('networkidle');
     
     await expect(page).toHaveScreenshot('spacing-overview.png', {
       fullPage: true,
       maxDiffPixels: 100
     });
   });
   ```

**Resultado esperado:**
- Espaciado vertical consistente aplicado
- Tests E2E verificando padding en secciones
- Sin regresiones visuales

---

### Fase 4: Microinteracciones en Cards (30 min)

**Acción:**
1. Añadir transiciones suaves en cards de PainPoints
2. Añadir microinteracciones hover en cards de CaseGrid
3. Mantener simplicidad (v0, no over-engineering)

**Ejemplo de cambios:**

**PainPoints.tsx:**
```tsx
// ANTES
<div className="flex flex-col items-start gap-3 p-6 bg-surface-800 rounded-lg shadow-sm border border-surface-700">

// DESPUÉS
<div className="flex flex-col items-start gap-3 p-6 bg-surface-800 rounded-lg shadow-sm border border-surface-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-surface-600">
```

**CaseGrid.tsx:**
```tsx
// ANTES
<Card className="flex flex-col h-full bg-surface-900 border-surface-700 hover:shadow-lg transition-shadow">

// DESPUÉS
<Card className="flex flex-col h-full bg-surface-900 border-surface-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-surface-600">
```

**Notas técnicas:**
- `transition-all duration-300`: Transición suave de 300ms
- `hover:scale-[1.02]`: Escalado sutil al hover (2%)
- `hover:shadow-xl`: Sombra más pronunciada
- `hover:border-surface-600`: Border más claro al hover

**Tests:**
1. **E2E test:** `__tests__/e2e/microinteractions.spec.ts`
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Microinteracciones en cards', () => {
     test('Cards de PainPoints responden al hover', async ({ page }) => {
       await page.goto('/');
       
       const firstCard = page.locator('[data-testid="pain-point-item"]').first();
       await expect(firstCard).toBeVisible();
       
       // Verificar clases de transición
       const classes = await firstCard.getAttribute('class');
       expect(classes).toContain('transition');
       expect(classes).toMatch(/hover:scale/);
     });

     test('Cards de CaseGrid responden al hover', async ({ page }) => {
       await page.goto('/');
       
       const firstCase = page.locator('[data-testid^="case-card-"]').first();
       await expect(firstCase).toBeVisible();
       
       // Hover sobre la card
       await firstCase.hover();
       
       // Verificar que tiene clases de transición
       const classes = await firstCase.getAttribute('class');
       expect(classes).toContain('transition');
       expect(classes).toMatch(/hover:shadow/);
     });

     test('Screenshot de card en estado hover', async ({ page }) => {
       await page.goto('/');
       
       const firstCase = page.locator('[data-testid^="case-card-"]').first();
       await firstCase.hover();
       await page.waitForTimeout(350); // Esperar fin de transición
       
       await expect(firstCase).toHaveScreenshot('case-card-hover.png');
     });
   });
   ```

**Resultado esperado:**
- Cards con hover suave y feedback visual
- Tests E2E verificando transiciones
- Sin animaciones bruscas o distractoras

---

### Fase 5: Microinteracciones en CTAs (20 min)

**Acción:**
1. Mejorar hover/focus en botones CTA principales
2. Añadir transiciones suaves
3. Mantener accesibilidad (focus visible)

**Ejemplo de cambios:**

**Hero.tsx (CTA primario):**
```tsx
// ANTES
<Button
  size="lg"
  onClick={handleCtaClick}
  className="bg-accent-gold-500 text-primary-950 text-lg font-semibold hover:bg-accent-gold-400"
>

// DESPUÉS
<Button
  size="lg"
  onClick={handleCtaClick}
  className="bg-accent-gold-500 text-primary-950 text-lg font-semibold transition-all duration-300 hover:bg-accent-gold-400 hover:scale-105 focus:ring-2 focus:ring-accent-gold-400 focus:ring-offset-2 focus:ring-offset-surface-950"
>
```

**Hero.tsx (CTA secundario):**
```tsx
// ANTES
<Button
  size="lg"
  variant="outline"
  onClick={onSecondaryCta}
  className="border-accent-teal-500 text-accent-teal-500 hover:bg-accent-teal-500/10"
>

// DESPUÉS
<Button
  size="lg"
  variant="outline"
  onClick={onSecondaryCta}
  className="border-accent-teal-500 text-accent-teal-500 transition-all duration-300 hover:bg-accent-teal-500/10 hover:scale-105 hover:border-accent-teal-400 focus:ring-2 focus:ring-accent-teal-500 focus:ring-offset-2 focus:ring-offset-surface-950"
>
```

**Notas técnicas:**
- `hover:scale-105`: Escalado 5% al hover para destacar
- `focus:ring-2`: Anillo visible para accesibilidad teclado
- `focus:ring-offset-2`: Separación del anillo respecto al botón
- `duration-300`: Transición suave

**Tests:**
1. **E2E test:** `__tests__/e2e/cta-interactions.spec.ts`
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Microinteracciones en CTAs', () => {
     test('CTA primario responde al hover', async ({ page }) => {
       await page.goto('/');
       
       const ctaPrimary = page.getByRole('button', { name: /agendar diagnóstico/i });
       await expect(ctaPrimary).toBeVisible();
       
       // Verificar clases de transición
       const classes = await ctaPrimary.getAttribute('class');
       expect(classes).toContain('transition');
       expect(classes).toMatch(/hover:scale/);
     });

     test('CTA primario tiene focus visible', async ({ page }) => {
       await page.goto('/');
       
       const ctaPrimary = page.getByRole('button', { name: /agendar diagnóstico/i });
       
       // Enfocar con teclado
       await ctaPrimary.focus();
       
       // Verificar que tiene ring de focus
       const classes = await ctaPrimary.getAttribute('class');
       expect(classes).toMatch(/focus:ring/);
     });

     test('CTA secundario responde al hover', async ({ page }) => {
       await page.goto('/');
       
       const ctaSecondary = page.getByRole('button', { name: /hablar con el asistente/i });
       await expect(ctaSecondary).toBeVisible();
       
       await ctaSecondary.hover();
       await page.waitForTimeout(350);
       
       // Screenshot en hover
       await expect(ctaSecondary).toHaveScreenshot('cta-secondary-hover.png');
     });

     test('CTAs accesibles por teclado', async ({ page }) => {
       await page.goto('/');
       
       // Navegar con Tab
       await page.keyboard.press('Tab');
       await page.keyboard.press('Tab');
       
       // Verificar que algún CTA tiene focus
       const focusedElement = await page.evaluateHandle(() => document.activeElement);
       const tagName = await focusedElement.evaluate(el => el?.tagName);
       expect(tagName).toBe('BUTTON');
     });
   });
   ```

**Resultado esperado:**
- CTAs con hover/focus visible y suave
- Tests E2E verificando accesibilidad
- Feedback visual claro en interacción

---

### Fase 6: Documentar Puntos para v2 (10 min)

**Acción:**
1. Identificar 2-3 mejoras que NO se implementan en v0
2. Documentar en comentario de issue Linear
3. Añadir comentarios en código si aplica

**Ejemplos de puntos v2:**

```markdown
## Mejoras identificadas para v2 (refinado)

1. **Animaciones de entrada (scroll reveal):**
   - Las cards podrían aparecer con fade-in al scrollear
   - Requiere librería (Framer Motion o similar) - fuera de alcance v0

2. **Microinteracciones avanzadas en Header:**
   - Indicador visual de sección activa en navegación
   - Smooth scroll con highlight dinámico
   - Requiere JavaScript adicional - dejar para v2

3. **Espaciado fino en Footer:**
   - Footer actual tiene espaciado básico
   - Requiere revisión de grid y alineación de links
   - No crítico para v0, dejar para refinado

4. **Hover states en badges/labels:**
   - Badges de sector, validación, etc. no tienen hover
   - Evaluar si es necesario feedback en elementos informativos
   - Dejar decisión para v2 tras feedback Fran
```

**Tests:**
- N/A (fase de documentación)

---

### Fase 7: Verificación Visual y Tests Completos (20 min)

**Acción:**
1. Ejecutar todos los tests (unitarios + E2E)
2. Verificar visualmente en ambas paletas (Olive y Navy)
3. Verificar responsiveness (mobile + desktop)
4. Tomar screenshots para documentación

**Comandos:**
```bash
# Tests unitarios
cd profesional-web
npm run test

# Tests E2E
npm run test:e2e -- spacing.spec.ts
npm run test:e2e -- microinteractions.spec.ts
npm run test:e2e -- cta-interactions.spec.ts

# Levantar servidor para verificación manual
npm run dev
```

**Checklist de verificación manual:**
- [ ] Espaciado vertical consistente en todas las secciones
- [ ] Cards de PainPoints con hover suave
- [ ] Cards de CaseGrid con hover suave
- [ ] CTAs con hover y focus visible
- [ ] Sin roturas de layout en mobile (320px, 375px, 414px)
- [ ] Sin roturas de layout en desktop (1280px, 1920px)
- [ ] Ambas paletas (Olive y Navy) se ven bien
- [ ] Performance: transiciones no causan lag

**Tests:**
1. **Test de regresión visual (opcional):**
   ```typescript
   test('No hay regresiones visuales en landing', async ({ page }) => {
     await page.goto('/');
     await page.waitForLoadState('networkidle');
     
     // Screenshots por viewport
     await page.setViewportSize({ width: 375, height: 667 }); // Mobile
     await expect(page).toHaveScreenshot('landing-mobile-v0.png', { fullPage: true });
     
     await page.setViewportSize({ width: 1280, height: 720 }); // Desktop
     await expect(page).toHaveScreenshot('landing-desktop-v0.png', { fullPage: true });
   });
   ```

**Resultado esperado:**
- Todos los tests pasando
- Verificación visual aprobada por Fran
- Sin regresiones evidentes

---

### Fase 8: Informe de Implementación (15 min)

**Acción:**
1. Crear `FJG-102-informe-implementacion.md`
2. Documentar cambios realizados
3. Incluir screenshots relevantes
4. Listar puntos para v2
5. Comentar en Linear con resumen

**Estructura del informe:**
```markdown
# Informe de Implementación FJG-102

## Resumen Ejecutivo
- Espaciado vertical estandarizado a py-12 (mobile) / py-20 (desktop)
- Microinteracciones añadidas en cards (scale 1.02, shadow)
- CTAs con hover y focus mejorados (scale 1.05, ring visible)
- Sin regresiones de layout

## Cambios Realizados

### Espaciado
- Hero: py-12 md:py-24
- PainPoints: py-12 md:py-20
- CaseGrid: py-12 md:py-20, gap-6 md:gap-8
- MethodologySection: py-12 md:py-20
- TechStackDiagram: py-12 md:py-20

### Microinteracciones Cards
- PainPoints: transition-all, hover:scale-[1.02], hover:shadow-md
- CaseGrid: transition-all, hover:scale-[1.02], hover:shadow-xl

### Microinteracciones CTAs
- CTA primario: hover:scale-105, focus:ring-2
- CTA secundario: hover:scale-105, focus:ring-2

## Tests
- E2E spacing: ✅ 100%
- E2E microinteractions: ✅ 100%
- E2E cta-interactions: ✅ 100%

## Puntos para v2
1. Animaciones scroll reveal
2. Indicador sección activa en Header
3. Espaciado fino en Footer
4. Hover en badges informativos

## Screenshots
[Incluir capturas relevantes]
```

**Comentario Linear:**
```
✅ FJG-102 v0 completado

Cambios aplicados:
- Espaciado vertical estandarizado (py-12/py-20)
- Microinteracciones en cards (hover suave con scale y shadow)
- CTAs con feedback visual mejorado (hover + focus ring)

Verificación:
- Tests E2E pasando al 100%
- Sin regresiones de layout
- Verificado en ambas paletas (Olive/Navy)
- Responsiveness OK (mobile + desktop)

Pendiente v2 (refinado):
1. Animaciones scroll reveal
2. Indicador sección activa en navegación
3. Espaciado fino en Footer
4. Evaluar hover en badges informativos

Requiere OK visual de Fran para aprobar definitivamente.
```

**Tests:**
- N/A (fase de documentación)

---

## Comandos de Ejecución

```bash
# Levantar servidor de desarrollo
cd profesional-web
npm run dev

# Ejecutar tests unitarios
npm run test

# Ejecutar tests E2E específicos
npm run test:e2e -- spacing.spec.ts
npm run test:e2e -- microinteractions.spec.ts
npm run test:e2e -- cta-interactions.spec.ts

# Ejecutar todos los tests E2E
npm run test:e2e

# Linter
npm run lint

# TypeScript check
npm run type-check
```

---

## Criterios de Finalización

- [ ] Espaciado vertical consistente aplicado
- [ ] Microinteracciones en cards de PainPoints
- [ ] Microinteracciones en cards de CaseGrid
- [ ] Feedback visual en CTAs principales
- [ ] 2-3 puntos documentados para v2
- [ ] Tests unitarios pasando
- [ ] Tests E2E pasando
- [ ] Sin regresiones de layout
- [ ] Verificación visual en ambas paletas
- [ ] Verificación responsiveness (mobile + desktop)
- [ ] Informe de implementación completo
- [ ] Comentario en Linear con resumen y v2 plan
- [ ] OK visual de Fran

---

## Notas Importantes

1. **v0 = iteración básica:** No buscar perfección pixel-perfect, solo mejora perceptible.

2. **Simplicidad > complejidad:** No introducir librerías de animación (Framer Motion, etc.) sin necesidad crítica.

3. **Accesibilidad obligatoria:** Focus ring visible, navegación por teclado funcional.

4. **Tests obligatorios:** Sin tests pasando, no se aprueba la implementación.

5. **CA flexible = "que Fran le guste":** El OK visual es el criterio final de éxito.

6. **Documentar para v2:** Ser explícito sobre qué NO se hace ahora y por qué.

7. **Tailwind v4 compatibility:** Verificar que clases de transición sean compatibles.

---

## Entregables

1. `AUDIT_SPACING.md` (temporal, puede borrarse)
2. `SPACING_GUIDELINES.md` (temporal, puede borrarse)
3. Componentes modificados:
   - `Hero.tsx`
   - `PainPoints.tsx`
   - `CaseGrid.tsx`
   - Otros si aplica
4. Tests E2E nuevos:
   - `spacing.spec.ts`
   - `microinteractions.spec.ts`
   - `cta-interactions.spec.ts`
5. Screenshots (opcional pero recomendado)
6. `FJG-102-informe-implementacion.md`
7. Comentario en Linear con resumen

---

**¿Dudas o bloqueos?**  
Consultar con Agent Manager o Fran antes de tomar decisiones que cambien el alcance v0.
