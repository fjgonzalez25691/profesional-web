# FJG-101: Aplicar paleta activa a páginas clave (Fase 1)

**Issue Linear:** https://linear.app/fjgonzalez2569/issue/FJG-101  
**Rol:** Developer  
**Prioridad:** Alta  
**Estimación:** 3 Story Points  
**Dependencias:** FJG-99 (Sistema de temas completado)

---

## Contexto

En US-02-002 (FJG-99) se implementó el sistema de temas con dos paletas (Olive y Navy) y tokens CSS (`--primary-*`, `--surface-*`, `--text-*`, `--accent-*`). Se aplicaron estos tokens a Hero, PainPoints y CaseGrid.

**Objetivo de FJG-101:** Revisar, mejorar y asegurar que Hero, PainPoints y CaseGrid usan los tokens de forma **consistente**, eliminando cualquier color hardcoded residual que pueda crear mezclas evidentes de la paleta antigua.

Esta es la **Fase 1** (alcance limitado a estos 3 componentes). La Fase 2 cubrirá el resto de componentes (Footer, MethodologySection, TechStackDiagram, etc.).

---

## Criterios de Aceptación (Gherkin desde Linear)

```gherkin
Given que he implementado US-02-002 (Sistema de Temas) con dos paletas (Olive, Navy)
When aplico la paleta activa a Hero, sección de dolores y sección de casos
Then los tokens se usan de forma consistente
And no hay mezclas evidentes de la paleta antigua
And queda documentado en comentario de Linear qué falta para Fase 2
```

**Definition of Done:**
1. Hero, PainPoints, y CaseGrid usan tokens coherentemente
2. Sin hardcoded colors mezclando paletas (ej: `text-red-500` en PainPoints es permitido si es intencional, pero revisar si se puede reemplazar con token de error/warning)
3. Verificación en **ambas paletas** (Olive y Navy) - debe ser razonablemente legible
4. Comentario en Linear documentando qué queda pendiente para Fase 2
5. **Visual OK de Fran** (CA flexible: "Le gusta a Fran", no auditoría WCAG formal)

---

## Plan de Implementación (TDD)

### Fase 1: Auditoría y Detección (15 min)

**Acción:**
1. Leer componentes Hero, PainPoints, CaseGrid línea por línea
2. Identificar colores hardcoded que NO son tokens
3. Evaluar si tienen justificación semántica (ej: `text-red-500` para X de error)
4. Crear lista de cambios necesarios

**Salida esperada:**
- Archivo temporal `AUDIT_FASE1.md` con:
  - Hero: Lista de hardcoded colors
  - PainPoints: Lista de hardcoded colors
  - CaseGrid: Lista de hardcoded colors
  - Justificación de cada color (mantener vs reemplazar)

**Tests:**
- N/A (fase de análisis)

---

### Fase 2: Definir Estrategia de Tokens (10 min)

**Acción:**
1. Revisar tokens disponibles en `globals.css`:
   - Primary: `--primary-50` a `--primary-950`
   - Surface: `--surface-50` a `--surface-950`
   - Text: `--text-primary`, `--text-secondary`, `--text-muted`
   - Accent: `--accent-teal-400/500`, `--accent-gold-400/500`, `--accent-sage`
2. Decidir mapeo de colores hardcoded a tokens
3. Identificar si faltan tokens (ej: error, warning, success)

**Salida esperada:**
- Documento `TOKEN_MAPPING.md` con tabla:
  - Componente | Color Actual | Token Propuesto | Justificación

**Decisión importante:**
- Si necesitamos tokens de error/warning NO definidos en FJG-99, documentar en comentario Linear para Fase 2 (NO agregar ahora, fuera de alcance)

**Tests:**
- N/A (fase de planificación)

---

### Fase 3: Aplicar Cambios a Hero (20 min)

**Acción:**
1. Abrir `Hero.tsx`
2. Reemplazar colores hardcoded según `TOKEN_MAPPING.md`
3. Mantener estructura y funcionalidad existente

**Ejemplo de cambio:**
```tsx
// ANTES (si existe algún hardcoded)
<p className="text-sm text-emerald-400 font-medium">
  {badgeText}
</p>

// DESPUÉS (usar token)
<p className="text-sm text-accent-sage font-medium">
  {badgeText}
</p>
```

**Tests:**
1. **Unit test:** `__tests__/components/Hero.test.tsx`
   ```typescript
   it('usa tokens de tema en todos los elementos de texto', () => {
     const { container } = render(<Hero {...mockProps} />);
     
     // Badge debe usar token accent
     const badge = screen.getByText(mockProps.badgeText);
     expect(badge).toHaveClass('text-accent-sage');
     
     // Headline debe usar text-primary
     const headline = screen.getByText(mockProps.headline);
     expect(headline).toHaveClass('text-text-primary');
     
     // Subtitle debe usar text-secondary
     const subtitle = screen.getByText(mockProps.subtitle);
     expect(subtitle).toHaveClass('text-text-secondary');
   });
   ```

2. **E2E test:** `__tests__/e2e/hero-theme.spec.ts`
   ```typescript
   test('Hero muestra colores coherentes en paleta Olive', async ({ page }) => {
     await page.goto('/');
     await page.evaluate(() => localStorage.setItem('theme', 'olive'));
     await page.reload();
     
     const hero = page.locator('[data-testid="hero-section"]');
     const bgColor = await hero.evaluate(el => 
       getComputedStyle(el).backgroundColor
     );
     
     // Verificar que usa color de superficie oscura (surface-950)
     expect(bgColor).toMatch(/rgb\(9, 11, 10\)/); // valor aproximado
   });

   test('Hero muestra colores coherentes en paleta Navy', async ({ page }) => {
     await page.goto('/');
     await page.evaluate(() => localStorage.setItem('theme', 'navy'));
     await page.reload();
     
     const hero = page.locator('[data-testid="hero-section"]');
     const bgColor = await hero.evaluate(el => 
       getComputedStyle(el).backgroundColor
     );
     
     // Verificar que usa color de superficie oscura (surface-950 navy)
     expect(bgColor).toMatch(/rgb\(10, 14, 23\)/); // valor aproximado
   });
   ```

**Resultado esperado:**
- Hero sin hardcoded colors no justificados
- Tests pasando en ambas paletas

---

### Fase 4: Aplicar Cambios a PainPoints (20 min)

**Acción:**
1. Abrir `PainPoints.tsx`
2. **Caso especial:** El icono X rojo (`text-red-500`) tiene justificación semántica
   - **Decisión:** Mantener `text-red-500` SOLO si es intencional para "error/problema"
   - Alternativamente, crear token `--accent-error` en Fase 2 (documentar)
3. Reemplazar el resto de hardcoded colors según `TOKEN_MAPPING.md`

**Ejemplo de cambio:**
```tsx
// ANTES (hipotético)
<div className="bg-gray-800 border-gray-700">
  <p className="text-gray-400">{point.category}</p>
  <p className="text-gray-100">{point.text}</p>
</div>

// DESPUÉS (usar tokens)
<div className="bg-surface-800 border-surface-700">
  <p className="text-text-secondary">{point.category}</p>
  <p className="text-text-primary">{point.text}</p>
</div>
```

**Tests:**
1. **Unit test:** `__tests__/components/PainPoints.test.tsx`
   ```typescript
   it('usa tokens de tema en cards', () => {
     render(<PainPoints />);
     
     const cards = screen.getAllByTestId('pain-point-item');
     cards.forEach(card => {
       expect(card).toHaveClass('bg-surface-800');
       expect(card).toHaveClass('border-surface-700');
     });
   });

   it('mantiene icono X rojo para indicar problema', () => {
     render(<PainPoints />);
     
     const icons = screen.getAllByTestId('pain-point-icon');
     icons.forEach(icon => {
       expect(icon).toHaveClass('text-red-500');
     });
   });
   ```

2. **E2E test:** `__tests__/e2e/pain-points-theme.spec.ts`
   ```typescript
   test('PainPoints muestra colores coherentes en ambas paletas', async ({ page }) => {
     for (const theme of ['olive', 'navy']) {
       await page.goto('/');
       await page.evaluate((t) => localStorage.setItem('theme', t), theme);
       await page.reload();
       
       const section = page.locator('#pain-points');
       await expect(section).toBeVisible();
       
       const cards = page.locator('[data-testid="pain-point-item"]');
       const count = await cards.count();
       expect(count).toBeGreaterThan(0);
       
       // Verificar que cards tienen background de surface
       const firstCard = cards.first();
       const bgColor = await firstCard.evaluate(el => 
         getComputedStyle(el).backgroundColor
       );
       
       // Debe tener un color de superficie (no hardcoded gray)
       expect(bgColor).not.toBe('rgb(31, 41, 55)'); // gray-800
     }
   });
   ```

**Resultado esperado:**
- PainPoints sin hardcoded colors innecesarios
- Icono X rojo justificado (o documentado para token en Fase 2)
- Tests pasando en ambas paletas

---

### Fase 5: Aplicar Cambios a CaseGrid (20 min)

**Acción:**
1. Abrir `CaseGrid.tsx`
2. Reemplazar hardcoded colors según `TOKEN_MAPPING.md`
3. Verificar que badges, cards y badges de validación usan tokens

**Ejemplo de cambio:**
```tsx
// ANTES (hipotético)
<Badge className="bg-teal-500/20 text-teal-400">
  {caso.sector}
</Badge>

// DESPUÉS (usar token)
<Badge className="bg-accent-teal-500/20 text-accent-teal-400">
  {caso.sector}
</Badge>
```

**Tests:**
1. **Unit test:** `__tests__/components/CaseGrid.test.tsx`
   ```typescript
   it('usa tokens de tema en cards y badges', () => {
     render(<CaseGrid />);
     
     const cards = screen.getAllByTestId(/^case-card-/);
     cards.forEach(card => {
       expect(card).toHaveClass('bg-surface-900');
       expect(card).toHaveClass('border-surface-700');
     });
     
     // Verificar badges de sector
     const badges = screen.getAllByText(/Retail|Construcción|Consultoría/);
     badges.forEach(badge => {
       expect(badge.closest('.badge')).toHaveClass('bg-primary-500/20');
       expect(badge.closest('.badge')).toHaveClass('text-primary-400');
     });
   });
   ```

2. **E2E test:** `__tests__/e2e/case-grid-theme.spec.ts`
   ```typescript
   test('CaseGrid muestra colores coherentes en ambas paletas', async ({ page }) => {
     for (const theme of ['olive', 'navy']) {
       await page.goto('/');
       await page.evaluate((t) => localStorage.setItem('theme', t), theme);
       await page.reload();
       
       const section = page.locator('#cases');
       await section.scrollIntoViewIfNeeded();
       await expect(section).toBeVisible();
       
       const cards = page.locator('[data-testid^="case-card-"]');
       const count = await cards.count();
       expect(count).toBe(3);
       
       // Verificar que cards tienen background de surface
       const firstCard = cards.first();
       const bgColor = await firstCard.evaluate(el => 
         getComputedStyle(el).backgroundColor
       );
       
       // Debe tener un color de superficie (no hardcoded)
       expect(bgColor).not.toBe('rgb(31, 41, 55)'); // gray-800
     }
   });
   ```

**Resultado esperado:**
- CaseGrid sin hardcoded colors innecesarios
- Tests pasando en ambas paletas

---

### Fase 6: Verificación Visual (10 min)

**Acción:**
1. Levantar servidor de desarrollo: `npm run dev`
2. Abrir `/admin` y cambiar entre paletas Olive y Navy
3. Verificar visualmente:
   - Hero: Legibilidad de texto, contraste suficiente
   - PainPoints: Cards visibles, icono X destacado
   - CaseGrid: Cards legibles, badges destacados
4. Tomar screenshots si hay dudas para consultar con Fran

**CA flexible:** "Razonablemente legible", no auditoría WCAG formal. Si Fran aprueba visualmente, es suficiente.

**Resultado esperado:**
- Confirmación visual de coherencia en ambas paletas
- Documentación de cualquier problema de legibilidad para Fase 2

---

### Fase 7: Documentación Final (15 min)

**Acción:**
1. Crear informe de implementación: `FJG-101-informe-implementacion.md`
2. Documentar:
   - Cambios realizados en Hero, PainPoints, CaseGrid
   - Decisiones tomadas (ej: mantener `text-red-500` en PainPoints)
   - Lista de componentes pendientes para Fase 2:
     * Footer
     * MethodologySection
     * TechStackDiagram
     * Otros (si existen)
3. Comentar en Linear con resumen y plan de Fase 2

**Ejemplo de comentario Linear:**
```
✅ Fase 1 completada

Cambios aplicados:
- Hero: 100% tokens, sin hardcoded colors
- PainPoints: 95% tokens (icono X rojo justificado semánticamente)
- CaseGrid: 100% tokens, badges y cards coherentes

Verificación:
- Ambas paletas (Olive/Navy) razonablemente legibles
- Tests E2E pasando en ambas paletas

Pendiente Fase 2:
- Footer (colores hardcoded en links/copyright)
- MethodologySection (timeline gradient necesita revisión)
- TechStackDiagram (badges tech stack)
- Considerar tokens para error/warning/success si son recurrentes
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
npm run test -- Hero.test.tsx
npm run test -- PainPoints.test.tsx
npm run test -- CaseGrid.test.tsx

# Ejecutar tests E2E para Hero
npm run test:e2e -- hero-theme.spec.ts

# Ejecutar tests E2E para PainPoints
npm run test:e2e -- pain-points-theme.spec.ts

# Ejecutar tests E2E para CaseGrid
npm run test:e2e -- case-grid-theme.spec.ts

# Ejecutar todos los tests
npm run test
npm run test:e2e
```

---

## Criterios de Finalización

- [ ] Hero sin hardcoded colors innecesarios
- [ ] PainPoints sin hardcoded colors innecesarios (excepto `text-red-500` justificado)
- [ ] CaseGrid sin hardcoded colors innecesarios
- [ ] Tests unitarios pasando para los 3 componentes
- [ ] Tests E2E pasando en ambas paletas (Olive y Navy)
- [ ] Verificación visual aprobada por Fran
- [ ] Comentario en Linear con resumen y plan de Fase 2
- [ ] Informe de implementación completo

---

## Notas Importantes

1. **No agregar tokens nuevos:** Esta issue es solo para aplicar tokens existentes de FJG-99. Si necesitamos `--accent-error`, `--accent-warning`, etc., documentar en comentario Linear para Fase 2.

2. **CA flexible:** "Le gusta a Fran" es suficiente. No necesitamos auditoría WCAG AAA en esta fase.

3. **Priorizar coherencia sobre perfección:** Si un color hardcoded tiene justificación semántica clara (ej: `text-red-500` para error), está OK mantenerlo temporalmente.

4. **Fase 2 NO es parte de FJG-101:** Documentar claramente qué queda pendiente para no hacer scope creep.

5. **Tailwind v4 syntax:** Recordar usar `bg-linear-to-r` en lugar de `bg-gradient-to-r` si modificamos gradientes.

---

## Entregables

1. `AUDIT_FASE1.md` (temporal, puede borrarse después)
2. `TOKEN_MAPPING.md` (temporal, puede borrarse después)
3. `Hero.tsx` modificado
4. `PainPoints.tsx` modificado
5. `CaseGrid.tsx` modificado
6. Tests unitarios actualizados/nuevos
7. Tests E2E actualizados/nuevos
8. `FJG-101-informe-implementacion.md`
9. Comentario en Linear con resumen y Fase 2 plan
10. Screenshots (opcional) si hay dudas visuales

---

**¿Dudas o bloqueos?**  
Consultar con Agent Manager o Fran antes de tomar decisiones que cambien el alcance de la issue.
