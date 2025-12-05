# FJG-90 · Prompt de Implementación (Agent Developer)

## Contexto
- **Issue Linear:** [FJG-90](https://linear.app/fjgaparicio/issue/FJG-90/us-dt-04-st05-inventory-ajuste-roi-y-validaciones-para-inventario)
- **User story:** "US-DT-04-ST05-INVENTORY – Ajuste ROI y validaciones para inventario"
- **Objetivo:** Hacer que el cálculo de ahorro en inventario sea realista usando inventario estimado por `companySize`, ajustando supuestos conservadores (coste 10%, mejora 30%), y validar que el ahorro no supere un porcentaje extremo del valor del inventario.

## Criterios de Aceptación (CA)
- **CA1:** El cálculo de ahorro en inventario usa inventario estimado por `companySize`.
- **CA2:** Con inputs razonables, el ahorro anual no supera un porcentaje extremo del inventario.
- **CA3:** Si se supera ese umbral, la UI muestra aviso o limita el resultado.

## Definition of Done (DoD)
- Fórmula de inventario actualizada con valores por tamaño de empresa.
- Lógica de tope de ahorro vs valor de inventario implementada.
- Tests para casos normales y casos donde se dispara el ahorro.

---

## Plan TDD

### 1. Ajustar cálculo inventory con valores conservadores (CA1 + DoD)
**Archivo:** `lib/calculator/calculateROI.ts`

**Análisis del código actual:**
```typescript
// ACTUAL (líneas ~104-115):
const avgInventoryValue = getInventoryFromSize(size); // ✅ Ya usa companySize
const inventoryCostRate = 0.12; // 12% coste actual
const improvementRate = 0.4;    // 40% mejora actual
```

**Test (RED):**
- Añadir test que compruebe con `companySize = '10-25M'`, el ahorro usa `getInventoryFromSize('10-25M')` = 1.200.000€
- Verificar que con nuevos valores prudentes (coste 10%, mejora 30%), el cálculo es correcto:
  - Ahorro anual = `1.200.000 * 0.10 * 0.30 = 36.000€` (vs actual `1.200.000 * 0.12 * 0.40 = 57.600€`)

**Implementación (GREEN):**
- Ajustar constantes en el bloque inventory (líneas ~104-115):
  - `inventoryCostRate` de `0.12` → `0.10`
  - `improvementRate` de `0.4` → `0.3`
- Extraer como constantes de módulo para coherencia:
  ```typescript
  export const INVENTORY_COST_RATE = 0.10;
  export const INVENTORY_IMPROVEMENT_RATE = 0.30;
  ```

**Refactor:**
- Asegurar que comentarios reflejan los nuevos supuestos conservadores.

---

### 2. Implementar tope de ahorro vs inventario (CA2 + CA3 + DoD)
**Archivo:** `lib/calculator/calculateROI.ts`

**Test (RED):**
- Test con escenario extremo donde el ahorro calculado superaría 80% del inventario:
  - Ejemplo: `companySize = '5-10M'`, inventario = 500.000€
  - Con supuestos exagerados (si alguien manipula inputs), ahorro podría ser > 400.000€
- Verificar que el resultado capea el ahorro a un máximo razonable (ej. 80% del inventario).

**Implementación (GREEN):**
- Después del cálculo de `annualSavings` en el bloque inventory:
  ```typescript
  // Cap: el ahorro no puede superar un % extremo del inventario (80-100%)
  const MAX_SAVINGS_RATE = 0.80; // 80% del inventario como tope
  const maxPossibleSavings = avgInventoryValue * MAX_SAVINGS_RATE;
  const cappedSavings = Math.min(annualSavings, maxPossibleSavings);
  totalSavingsAnnual += cappedSavings;
  ```
- Extraer constante:
  ```typescript
  export const INVENTORY_MAX_SAVINGS_RATE = 0.80;
  ```

**Refactor:**
- Documentar el razonamiento en comentario.

---

### 3. Aviso en UI si se dispara el tope (CA3)
**Archivos:** 
- `lib/calculator/calculateROI.ts` (devolver flag)
- `components/calculator/Step3Results.tsx` (mostrar aviso)

**Test (RED):**
- Test unitario que compruebe que cuando `annualSavings > maxPossibleSavings`, el resultado incluye flag `inventorySavingsCapped: true`
- Test E2E o de componente verificando que se muestra mensaje de aviso en `Step3Results`

**Implementación (GREEN):**
1. Modificar tipo `ROIResult` en `lib/calculator/types.ts`:
   ```typescript
   export interface ROIResult {
     investment: number;
     savingsAnnual: number;
     paybackMonths: number;
     roi3Years: number;
     inventorySavingsCapped?: boolean; // Nuevo campo opcional
   }
   ```

2. En `calculateROI.ts`, trackear si se aplicó el cap:
   ```typescript
   let inventorySavingsCapped = false;
   
   // En el bloque inventory:
   const maxPossibleSavings = avgInventoryValue * INVENTORY_MAX_SAVINGS_RATE;
   if (annualSavings > maxPossibleSavings) {
     inventorySavingsCapped = true;
     annualSavings = maxPossibleSavings;
   }
   
   // Al return final:
   return {
     investment: Math.round(totalInvestment),
     savingsAnnual: Math.round(totalSavingsAnnual),
     paybackMonths,
     roi3Years,
     inventorySavingsCapped,
   };
   ```

3. En `Step3Results.tsx`, después de mostrar resultados, añadir aviso condicional:
   ```tsx
   {result.inventorySavingsCapped && (
     <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
       <p className="text-sm text-amber-800">
         ⚠️ El ahorro estimado en inventario ha sido ajustado para no superar 
         un umbral razonable respecto al valor del inventario de tu empresa.
       </p>
     </div>
   )}
   ```

**Refactor:**
- Revisar que el mensaje sea claro y no técnico.

---

### 4. Tests completos (DoD)
**Archivo:** `__tests__/calculator/calculateROI.test.ts`

**Tests a añadir/actualizar:**
1. Test caso normal inventory (sin cap):
   - `companySize = '10-25M'`, inventario = 1.200.000€
   - Ahorro = `1.200.000 * 0.10 * 0.30 = 36.000€`
   - Verificar `inventorySavingsCapped = false`

2. Test caso extremo (con cap):
   - Simular escenario donde ahorro calculado > 80% inventario
   - Verificar que ahorro final = `inventario * 0.80`
   - Verificar `inventorySavingsCapped = true`

3. Test integración con otros pains:
   - Verificar que el cap solo afecta al componente inventory, no al total de otros pains

**Archivo:** `__tests__/e2e/calculator.spec.ts`

**Test E2E:**
- Flujo completo seleccionando pain "inventory"
- Verificar que en Step3Results aparece el aviso si se dispara el cap (escenario de prueba específico)

---

## Checklist Developer
- [ ] He leído la issue FJG-90 en Linear (CA + DoD).
- [ ] He seguido el ciclo TDD (RED → GREEN → REFACTOR) para cada paso.
- [ ] He ajustado las constantes a valores conservadores (10% coste, 30% mejora).
- [ ] He implementado la lógica de tope (80% del inventario).
- [ ] He añadido el campo `inventorySavingsCapped` al tipo `ROIResult`.
- [ ] He implementado el aviso en la UI cuando se aplica el cap.
- [ ] He ejecutado `npm run test` y todos los tests pasan.
- [ ] He ejecutado `npm run lint` sin errores.
- [ ] El aviso es claro y visible en Step3Results.
- [ ] No he creado nuevas capas innecesarias (Navaja de Ockham).
- [ ] Generar `FJG-90-informe-implementacion.md` al terminar.
