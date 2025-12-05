# FJG-89 · Prompt de Implementación (Agent Developer)

## Contexto
- **Issue Linear:** [FJG-89](https://linear.app/fjgaparicio/issue/FJG-89/us-dt-04-st04-forecast-ajuste-roi-y-validaciones-para-forecasting)
- **User story:** "US-DT-04-ST04-FORECAST – Ajuste ROI y validaciones para forecasting"
- **Objetivo:** Hacer que el cálculo de ahorro por forecasting sea realista usando revenue por `companySize`, ajustando supuestos conservadores (impacto ~5% vs 8%, mejora 30-40% vs 50%), y validar inputs para evitar ROIs desproporcionados.

## Criterios de Aceptación (CA)
- **CA1:** El cálculo de ahorro por forecast usa revenue derivado del tamaño de empresa.
- **CA2:** `forecastErrorPercent` tiene validaciones de mínimo y máximo, con mensajes de error visibles.
- **CA3:** 0% de error y errores extremados (≥ umbral definido) no generan resultados normales de ROI, sino aviso y/o bloqueo.

## Definition of Done (DoD)
- Fórmulas de forecast refactorizadas para usar revenue por `companySize`.
- Supuestos de impacto y mejora ajustados a valores prudentes.
- Validaciones y mensajes implementados para el input de error.
- Tests cubriendo casos normales, borde y extremos.

---

## Plan TDD

### 1. Refactorizar cálculo forecast con revenue por tamaño (CA1)
**Archivo:** `lib/calculator/calculateROI.ts`

**Test (RED):**
- Añadir test que compruebe que con `forecastErrorPercent = 20`, `companySize = '10-25M'`, el ahorro usa `getRevenueFromSize('10-25M')` en vez de constante fija.
- Verificar que el cálculo resulta coherente con el nuevo factor de impacto (~5%) y mejora (30-40%).

**Implementación (GREEN):**
- Ya existe `getRevenueFromSize(companySize)` (de FJG-86), reutilizarlo en el bloque de forecasting.
- Ajustar constantes:
  - `impactFactor` de `0.08` a `0.05`
  - `improvementRate` de `0.5` a `0.35` (promedio 30-40%)

**Refactor:**
- Extraer constantes a nivel de módulo si hace falta.

---

### 2. Validar rango de `forecastErrorPercent` (CA2)
**Archivo:** `lib/validation/calculator-schema.ts` o `components/calculator/ROICalculator.tsx`

**Test (RED):**
- Test que rechace `forecastErrorPercent = 0` (sin sentido como dolor).
- Test que rechace `forecastErrorPercent >= 80` (umbral extremo).
- Test que acepte `forecastErrorPercent = 20` (dentro del rango 1-79).

**Implementación (GREEN):**
- Añadir validación para `forecastErrorPercent` con `.min(1)` y `.max(79)`.
- Asegurar que el mensaje de error sea descriptivo (ej. "El error de forecast debe estar entre 1% y 79%").

**Refactor:**
- Revisar consistencia con otras validaciones.

---

### 3. Casos extremos: 0% y ≥80% (CA3)
**Archivo:** `components/calculator/ROICalculator.tsx`

**Test (RED):**
- Test E2E o unitario que simule ingresar `forecastErrorPercent = 0` y verifique que aparece mensaje de error bloqueando avance.
- Test con `forecastErrorPercent = 85` que verifique el mismo bloqueo.

**Implementación (GREEN):**
- La validación del paso 2 ya maneja esto bloqueando el avance.
- Conectar errores al estado del componente para mostrarlos debajo del input.

**Refactor:**
- Asegurar consistencia en estilo de mensajes de error.

---

### 4. Ajustar supuestos prudentes (DoD)
**Test (RED):**
- Test que con `forecastErrorPercent = 20`, `companySize = '10-25M'` (revenue ~17.5M), el ahorro anual esté en rango razonable con nuevos factores (impacto 5%, mejora 35%).
- Ejemplo: `17.5M * 0.05 * 0.2 * 0.35 ≈ 61.250€`

**Implementación (GREEN):**
- Ya implementado por ajustes de paso 1.

**Refactor:**
- Validar que el test documenta el supuesto.

---

## Checklist Developer
- [ ] He leído la issue FJG-89 en Linear (CA + DoD).
- [ ] He seguido el ciclo TDD (RED → GREEN → REFACTOR) para cada paso.
- [ ] He actualizado los tests existentes si era necesario.
- [ ] He ejecutado `npm run test` y todos los tests pasan.
- [ ] He ejecutado `npm run lint` sin errores.
- [ ] Los mensajes de error son claros y visibles en la UI.
- [ ] No he creado nuevas capas innecesarias (Navaja de Ockham).
- [ ] Generar `FJG-89-informe-implementacion.md` al terminar.
