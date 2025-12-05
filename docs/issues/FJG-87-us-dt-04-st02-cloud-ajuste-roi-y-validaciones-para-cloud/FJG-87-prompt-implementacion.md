# FJG-87 · Prompt de Implementación (Agent Developer)

## Contexto
- **Issue Linear:** [FJG-87](https://linear.app/fjgaparicio/issue/FJG-87/us-dt-04-st02-cloud-ajuste-roi-y-validaciones-para-cloud)
- **User story:** "US-DT-04-ST02-CLOUD – Ajuste ROI y validaciones para cloud"
- **Objetivo:** Hacer que el cálculo de ahorro cloud sea prudente (reduciendo el % de ahorro) y validar inputs para evitar ROIs inflados por gastos irreales.

## Criterios de Aceptación (CA)
- **CA1:** Introducir un valor fuera del rango de `cloudSpendMonthly` bloquea el avance y muestra mensaje de error claro.
- **CA2:** Si el gasto cloud anual supera un porcentaje máximo de la facturación estimada, se muestra aviso o se bloquea el cálculo.
- **CA3:** Con inputs razonables, el ahorro cloud calculado se mantiene en un porcentaje prudente de gasto cloud anual (~25–30%).

## Definition of Done (DoD)
- Fórmula de ahorro cloud actualizada a la nueva hipótesis (25–30% vs 35% actual).
- Validaciones de rango y coherencia implementadas en el input de cloud.
- Mensajes de error/aviso visibles en la UI.
- Tests unitarios para casos dentro y fuera de rango, y para el check de % sobre facturación.

---

## Plan TDD

### 1. Ajustar fórmula de ahorro cloud (CA3)
**Archivo:** `lib/calculator/calculateROI.ts`

**Test (RED):**
- Añadir test que compruebe que con `cloudSpendMonthly = 5000` y tamaño `'10-25M'`, el ahorro anual resulta de aplicar ~27.5% (en vez de 35%).
- Ejemplo: `5000 * 12 * 0.275 = 16.500€` (aproximado).

**Implementación (GREEN):**
- Cambiar constante `savingsPercent` de `0.35` a `0.275` en el bloque de cálculo cloud.

**Refactor:**
- Considerar extraer la constante a nivel de módulo si se reutiliza.

---

### 2. Validar rango de `cloudSpendMonthly` (CA1)
**Archivo:** `lib/validation/calculator-schema.ts` (o equivalente si existe schema de validación)

**Test (RED):**
- Test que rechace `cloudSpendMonthly < 100` (mínimo razonable).
- Test que rechace `cloudSpendMonthly > 100_000` (máximo razonable).
- Test que acepte `cloudSpendMonthly = 5000` (dentro del rango).

**Implementación (GREEN):**
- Añadir validación en el schema Zod (o equivalente) para `cloudSpendMonthly` con `.min(100)` y `.max(100_000)`.
- Asegurar que el mensaje de error sea descriptivo (ej. "El gasto cloud mensual debe estar entre 100€ y 100.000€").

**Refactor:**
- Revisar si otros campos necesitan rangos similares.

---

### 3. Validación cruzada: cloud anual vs facturación (CA2)
**Archivo:** `lib/calculator/calculateROI.ts` o `components/calculator/Step2PainSelection.tsx` (según dónde se gestione la validación)

**Test (RED):**
- Test que con `cloudSpendMonthly = 10_000` (120k/año) y `companySize = '5-10M'` (revenue ~8M), detecte que 120k > 40% de 8M (3.2M) y emita advertencia/bloqueo.
- Test que con `cloudSpendMonthly = 1_000` (12k/año) y `companySize = '10-25M'` (revenue ~17.5M), el check pase sin problema.

**Implementación (GREEN):**
- En la función de cálculo o en el componente de UI, añadir lógica:
  ```typescript
  const annualCloudSpend = cloudSpendMonthly * 12;
  const estimatedRevenue = getRevenueFromSize(companySize);
  const maxCloudPercent = 0.4; // 40%
  if (annualCloudSpend > estimatedRevenue * maxCloudPercent) {
    // Mostrar mensaje de error o warning
    throw new Error('El gasto cloud anual supera el 40% de la facturación estimada');
  }
  ```
- Si se implementa en UI, mostrar mensaje de error inline debajo del input.

**Refactor:**
- Extraer la constante `maxCloudPercent` y la lógica de validación a una función reutilizable si hace falta.

---

### 4. Mensajes de error visibles en UI (CA1, CA2)
**Archivo:** `components/calculator/Step2PainSelection.tsx` (o donde se capture el input de cloud)

**Test (RED):**
- Test E2E o unitario que simule ingresar un valor fuera de rango y verifique que aparece el mensaje de error.
- Test que simule ingresar un valor que viole el check de facturación y verifique que aparece el aviso.

**Implementación (GREEN):**
- Conectar los errores del schema Zod al estado del componente para mostrarlos debajo del input.
- Para el check de facturación, añadir un `<p className="text-red-600">` con el mensaje de error si la validación falla.

**Refactor:**
- Asegurar consistencia en el estilo de mensajes de error con el resto de la UI.

---

## Checklist Developer
- [ ] He leído la issue FJG-87 en Linear (CA + DoD).
- [ ] He seguido el ciclo TDD (RED → GREEN → REFACTOR) para cada paso.
- [ ] He actualizado los tests existentes si era necesario.
- [ ] He ejecutado `npm run test` y todos los tests pasan.
- [ ] He ejecutado `npm run lint` sin errores.
- [ ] Los mensajes de error son claros y visibles en la UI.
- [ ] No he creado nuevas capas innecesarias (Navaja de Ockham).
- [ ] Generar `FJG-87-informe-implementacion.md` al terminar.
