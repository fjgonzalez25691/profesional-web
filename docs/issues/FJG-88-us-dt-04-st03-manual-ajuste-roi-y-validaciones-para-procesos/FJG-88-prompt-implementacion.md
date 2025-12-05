# FJG-88 · Prompt de Implementación (Agent Developer)

## Contexto
- **Issue Linear:** [FJG-88](https://linear.app/fjgaparicio/issue/FJG-88/us-dt-04-st03-manual-ajuste-roi-y-validaciones-para-procesos-manuales)
- **User story:** "US-DT-04-ST03-MANUAL – Ajuste ROI y validaciones para procesos manuales"
- **Objetivo:** Hacer que el cálculo de ahorro por automatización de procesos manuales sea conservador (reduciendo % de tiempo recuperable de 70% a ~50%) y validar inputs para evitar ROIs sobreestimados.

## Criterios de Aceptación (CA)
- **CA1:** Inputs de horas manuales fuera del rango definido impiden avanzar y muestran error.
- **CA2:** Con un caso típico (ej. 40h/semana), el ahorro anual está en un orden de magnitud razonable para una pyme 5–50M.
- **CA3:** La fórmula ya no utiliza supuestos "best case" extremos de reducción de horas (ajuste de 70% a ~50%).

## Definition of Done (DoD)
- Fórmula de ahorro manual actualizada (50% vs 70% actual).
- Validaciones de rango integradas en el formulario.
- Mensajes de error revisados.
- Tests de cálculo y de validación de inputs.

---

## Plan TDD

### 1. Ajustar fórmula de ahorro manual (CA3)
**Archivo:** `lib/calculator/calculateROI.ts`

**Test (RED):**
- Añadir test que compruebe que con `manualHoursWeekly = 40` y tamaño `'10-25M'`, el ahorro anual resulta de aplicar ~50% (en vez de 70%) de tiempo recuperable.
- Ejemplo: `40 * 52 * 25€/h * 0.5 = 26.000€` (aproximado).

**Implementación (GREEN):**
- Cambiar constante `improvementRate` de `0.7` a `0.5` en el bloque de cálculo manual-processes.

**Refactor:**
- Considerar extraer la constante a nivel de módulo si se reutiliza.

---

### 2. Validar rango de `manualHoursWeekly` (CA1)
**Archivo:** `lib/validation/calculator-schema.ts` o `components/calculator/ROICalculator.tsx` (según dónde se gestione la validación)

**Test (RED):**
- Test que rechace `manualHoursWeekly < 1` (mínimo razonable).
- Test que rechace `manualHoursWeekly > 168` (máximo razonable: 7 días × 24h).
- Test que acepte `manualHoursWeekly = 40` (dentro del rango).

**Implementación (GREEN):**
- Añadir validación en el schema o componente para `manualHoursWeekly` con `.min(1)` y `.max(168)`.
- Asegurar que el mensaje de error sea descriptivo (ej. "Las horas semanales deben estar entre 1 y 168").

**Refactor:**
- Revisar si otros campos necesitan rangos similares.

---

### 3. Mensajes de error visibles en UI (CA1)
**Archivo:** `components/calculator/Step2Pains.tsx` (o donde se capture el input de horas manuales)

**Test (RED):**
- Test E2E o unitario que simule ingresar un valor fuera de rango y verifique que aparece el mensaje de error.

**Implementación (GREEN):**
- Conectar los errores del schema/validación al estado del componente para mostrarlos debajo del input.
- Añadir un `<p className="text-red-600">` con el mensaje de error si la validación falla.

**Refactor:**
- Asegurar consistencia en el estilo de mensajes de error con el resto de la UI.

---

### 4. Verificar orden de magnitud razonable (CA2)
**Test (RED):**
- Test que con `manualHoursWeekly = 40`, `companySize = '10-25M'`, el ahorro anual esté en rango razonable (ej. 20k-30k€).

**Implementación (GREEN):**
- Ya implementado por el ajuste de fórmula (paso 1).

**Refactor:**
- Validar que el test cubre el caso típico y documenta el supuesto.

---

## Checklist Developer
- [ ] He leído la issue FJG-88 en Linear (CA + DoD).
- [ ] He seguido el ciclo TDD (RED → GREEN → REFACTOR) para cada paso.
- [ ] He actualizado los tests existentes si era necesario.
- [ ] He ejecutado `npm run test` y todos los tests pasan.
- [ ] He ejecutado `npm run lint` sin errores.
- [ ] Los mensajes de error son claros y visibles en la UI.
- [ ] No he creado nuevas capas innecesarias (Navaja de Ockham).
- [ ] Generar `FJG-88-informe-implementacion.md` al terminar.
