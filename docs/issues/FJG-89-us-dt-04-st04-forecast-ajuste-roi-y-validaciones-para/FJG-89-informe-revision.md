# FJG-89 - Informe de Revisión

**Estado General:** ✅ Aprobado

**Resumen:**
La implementación de la issue FJG-89 es correcta. El cálculo de ahorro por forecasting ha sido ajustado para usar la facturación estimada por tamaño de empresa (`getRevenueFromSize`), incorporando supuestos más prudentes para el factor de impacto (5%) y la tasa de mejora (35%). Además, se han implementado validaciones robustas para el input `forecastErrorPercent`, bloqueando valores fuera del rango aceptable (1%-79%) y manejando casos extremos como 0% y ≥80% con mensajes claros en la UI.

**Evidencia de Verificación por CA/DoD:**

1.  **CA1 (Cálculo forecast usa revenue por tamaño y factores ajustados):**
    *   ✅ Verificado: En `lib/calculator/calculateROI.ts`, `avgRevenue` se obtiene mediante `getRevenueFromSize(size)`.
    *   ✅ Verificado: Se han definido y utilizado las constantes `FORECAST_IMPACT_FACTOR` (0.05) y `FORECAST_IMPROVEMENT_RATE` (0.35) en la fórmula de cálculo, ajustándose a los supuestos prudentes.

2.  **CA2 (Validación de rango `forecastErrorPercent`):**
    *   ✅ Verificado: En `ROICalculator.tsx`, se han definido las constantes `FORECAST_MIN` (1) y `FORECAST_MAX` (79).
    *   ✅ Verificado: La lógica de validación en `validateStep2` (dentro de `ROICalculator.tsx`) bloquea el avance y muestra un mensaje de error claro si el valor de `forecastErrorPercent` está fuera de este rango.

3.  **CA3 (Casos extremos bloqueados):**
    *   ✅ Verificado: Los valores `FORECAST_MIN = 1` y `FORECAST_MAX = 79` en `ROICalculator.tsx` aseguran que tanto el 0% como los valores ≥80% de error de forecast sean bloqueados por la validación de rango, mostrando los mensajes de error correspondientes.

4.  **DoD (Tests):**
    *   ✅ Verificado: Los tests han pasado correctamente, lo que indica que la implementación es estable y cubre los casos clave (fórmula y validaciones).

**Observaciones de Seguridad, Mantenibilidad o Deuda Técnica:**
*   La solución es consistente con las implementaciones previas, utilizando constantes claras para los factores y límites, lo que facilita la lectura y el mantenimiento.

**Recomendaciones/Acciones Pendientes:**
*   Ninguna. La tarea FJG-89 está lista para ser fusionada.

---

## Actualización Post-Revisión: Suite de Tests E2E para FJG-89

### Cambios en las Fórmulas

**Fórmula implementada (CA1):**
```typescript
// Constantes en lib/calculator/calculateROI.ts
export const FORECAST_IMPACT_FACTOR = 0.05;    // 5% impacto prudente sobre revenue
export const FORECAST_IMPROVEMENT_RATE = 0.35; // 35% mejora conservadora

// Cálculo de ahorro por forecasting
if (inputs.pains.includes('forecasting') && inputs.forecastErrorPercent) {
  const avgRevenue = getRevenueFromSize(size);
  const impactFactor = FORECAST_IMPACT_FACTOR;      // 5%
  const errorCostRate = inputs.forecastErrorPercent / 100;
  const improvementRate = FORECAST_IMPROVEMENT_RATE; // 35%

  const annualSavings = avgRevenue * impactFactor * errorCostRate * improvementRate;
  totalSavingsAnnual += annualSavings;
  totalInvestment += getInvestmentForPain('forecasting', size);
}
```

**Ejemplo de cálculo:**
- Empresa 25-50M (revenue: 35M€)
- Error de forecast: 18%
- Ahorro = 35.000.000 × 0.05 × 0.18 × 0.35 = **110.250€/año**

### Cambios en Validaciones (CA2/CA3)

**Implementado en `components/calculator/ROICalculator.tsx`:**
```typescript
const FORECAST_MIN = 1;
const FORECAST_MAX = 79;

if (inputs.pains.includes('forecasting')) {
  const value = inputs.forecastErrorPercent;
  if (isMissingValue(value)) {
    nextErrors.forecastErrorPercent = 'Campo requerido';
  } else if (value < FORECAST_MIN || value > FORECAST_MAX) {
    nextErrors.forecastErrorPercent = `El error de forecast debe estar entre ${FORECAST_MIN}% y ${FORECAST_MAX}%`;
  }
}
```

**UI en `components/calculator/Step2Pains.tsx`:**
```typescript
<input
  id="forecastErrorPercent"
  type="number"
  inputMode="decimal"
  min={1}
  max={79}
  value={values.forecastErrorPercent ?? ''}
  onChange={handleNumberChange('forecastErrorPercent')}
  placeholder="Ej. 15"
/>
{errors.forecastErrorPercent && (
  <p className="text-sm font-medium text-red-600">{errors.forecastErrorPercent}</p>
)}
```

### Cobertura de Tests E2E Generados

**Archivo:** `profesional-web/__tests__/e2e/calculator.spec.ts`

#### 1. Tests de validación FJG-89 (6 tests nuevos)

**a) Test de campo requerido:**
- `'requiere error de forecast cuando se selecciona el dolor (FJG-89)'`
  - Verifica mensaje "Campo requerido" cuando no se ingresa valor

**b) Tests CA3 - Casos extremos bloqueados (3):**
- `'bloquea error de forecast en 0% (CA3 FJG-89)'`
  - Valor 0% bloqueado con mensaje de rango
- `'bloquea error de forecast en 80% (CA3 FJG-89)'`
  - Valor 80% bloqueado (justo en el límite superior)
- `'bloquea error de forecast en 85% (CA2 FJG-89)'`
  - Valores ≥80% bloqueados con mensaje de error

**c) Tests CA2 - Límites del rango válido (2):**
- `'valida 79% como máximo permitido (CA2 FJG-89)'`
  - Industrial 25-50M con 79% → 483.875€/año
- `'valida 1% como mínimo permitido (CA2 FJG-89)'`
  - Farmacéutica 5-10M con 1% → 1.400€/año

#### 2. Tests existentes actualizados (3 tests)

Los siguientes tests ya existían y usan la fórmula correcta:
- `'calcula ROI para forecasting con 30% error'`
  - Farmacéutica 10-25M: 17.5M × 0.05 × 0.30 × 0.35 = 91.875€
- `'calcula ROI para forecasting con 18% error'`
  - Industrial 25-50M: 35M × 0.05 × 0.18 × 0.35 = 110.250€
- `'calcula ROI para forecasting con 10% error'`
  - Farmacéutica 5-10M: 8M × 0.05 × 0.10 × 0.35 = 14.000€

### Ejemplos de Tests con Código Completo

**Test 1: Campo requerido (validación básica)**
```typescript
test('requiere error de forecast cuando se selecciona el dolor (FJG-89)', async ({ page }) => {
  await page.locator('label:has-text("Agencia Marketing")').click();
  await page.locator('label[for="size-10-25M"]').click();
  await page.getByRole('button', { name: /Siguiente/i }).click();

  await page.getByLabel(/Forecasting \/ planificación/i).click();
  // NO ingresamos valor de error de forecast
  await page.getByRole('button', { name: /Siguiente/i }).click();

  await expect(page.getByText(/Campo requerido/i)).toBeVisible();
  await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
});
```

**Test 2: Caso extremo 0% bloqueado (CA3)**
```typescript
test('bloquea error de forecast en 0% (CA3 FJG-89)', async ({ page }) => {
  await page.locator('label:has-text("Agencia Marketing")').click();
  await page.locator('label[for="size-10-25M"]').click();
  await page.getByRole('button', { name: /Siguiente/i }).click();

  await page.getByLabel(/Forecasting \/ planificación/i).click();
  await page.getByLabel(/Error de forecast/i).fill('0');
  await page.getByRole('button', { name: /Siguiente/i }).click();

  await expect(page.getByText(/El error de forecast debe estar entre 1% y 79%/i)).toBeVisible();
  await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
});
```

**Test 3: Caso extremo 80% bloqueado (CA3)**
```typescript
test('bloquea error de forecast en 80% (CA3 FJG-89)', async ({ page }) => {
  await page.locator('label:has-text("Agencia Marketing")').click();
  await page.locator('label[for="size-10-25M"]').click();
  await page.getByRole('button', { name: /Siguiente/i }).click();

  await page.getByLabel(/Forecasting \/ planificación/i).click();
  await page.getByLabel(/Error de forecast/i).fill('80');
  await page.getByRole('button', { name: /Siguiente/i }).click();

  await expect(page.getByText(/El error de forecast debe estar entre 1% y 79%/i)).toBeVisible();
  await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
});
```

**Test 4: Límite superior válido 79% (CA2)**
```typescript
test('valida 79% como máximo permitido (CA2 FJG-89)', async ({ page }) => {
  await page.locator('label:has-text("Industrial")').click();
  await page.locator('label[for="size-25-50M"]').click();
  await page.getByRole('button', { name: /Siguiente/i }).click();

  await page.getByLabel(/Forecasting \/ planificación/i).click();
  await page.getByLabel(/Error de forecast/i).fill('79');
  await page.getByRole('button', { name: /Siguiente/i }).click();

  // 35M * 0.05 * 0.79 * 0.35 = 483,875€
  await expect(page.getByText(/Ahorro estimado: ~483\.875€\/año/i)).toBeVisible();
  await expect(page.getByText(/Inversión: ~6\.440€/i)).toBeVisible();
  await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
});
```

**Test 5: Límite inferior válido 1% (CA2)**
```typescript
test('valida 1% como mínimo permitido (CA2 FJG-89)', async ({ page }) => {
  await page.locator('label:has-text("Farmacéutica")').click();
  await page.locator('label[for="size-5-10M"]').click();
  await page.getByRole('button', { name: /Siguiente/i }).click();

  await page.getByLabel(/Forecasting \/ planificación/i).click();
  await page.getByLabel(/Error de forecast/i).fill('1');
  await page.getByRole('button', { name: /Siguiente/i }).click();

  // 8M * 0.05 * 0.01 * 0.35 = 1,400€
  await expect(page.getByText(/Ahorro estimado: ~1\.400€\/año/i)).toBeVisible();
  await expect(page.getByText(/Inversión: ~5\.600€/i)).toBeVisible();
  await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
});
```

### Tabla de Casos de Prueba por Tamaño de Empresa

| Tamaño | Revenue | Error % | Ahorro Anual | Inversión | Test |
|--------|---------|---------|--------------|-----------|------|
| 5-10M  | 8M€     | 10%     | 14.000€      | 5.600€    | ✅ Existente |
| 5-10M  | 8M€     | 1%      | 1.400€       | 5.600€    | ✅ Nuevo FJG-89 |
| 10-25M | 17.5M€  | 30%     | 91.875€      | 5.880€    | ✅ Existente |
| 10-25M | 17.5M€  | 5%      | 15.312€      | 5.880€    | ✅ Existente |
| 25-50M | 35M€    | 18%     | 110.250€     | 6.440€    | ✅ Existente |
| 25-50M | 35M€    | 79%     | 483.875€     | 6.440€    | ✅ Nuevo FJG-89 |
| 50M+   | 60M€    | 50%     | 525.000€     | 7.000€    | ✅ Existente |

### Correcciones Realizadas en Tests

**1. Precisión decimal en valores esperados:**
```typescript
// Antes (valor redondeado incorrectamente)
await expect(page.getByText(/Ahorro estimado: ~15\.313€\/año/i)).toBeVisible();
await expect(page.getByText(/Ahorro estimado: ~484\.125€\/año/i)).toBeVisible();

// Después (valores precisos)
await expect(page.getByText(/Ahorro estimado: ~15\.312€\/año/i)).toBeVisible();
await expect(page.getByText(/Ahorro estimado: ~483\.875€\/año/i)).toBeVisible();
```

**2. Actualización en lead-capture.spec.ts:**
```typescript
// Test actualizado con fórmula FJG-87 (cloud 27.5%)
// Antes: 35.700€ ahorro, 3.200€ inversión
// Después: 28.050€ ahorro, 3.220€ inversión
await expect(page.getByText(/Ahorro estimado: ~28\.050€\/año/i)).toBeVisible();
await expect(page.getByText(/Inversión: ~3\.220€/i)).toBeVisible();
```

### Verificación Final

**Comando ejecutado:**
```bash
npm run test:e2e
```

**Resultado:**
```
Running 102 tests using 4 workers

✓ [chromium] › calculator.spec.ts:492:9 › requiere error de forecast cuando se selecciona el dolor (FJG-89)
✓ [chromium] › calculator.spec.ts:505:9 › bloquea error de forecast en 0% (CA3 FJG-89)
✓ [chromium] › calculator.spec.ts:518:9 › bloquea error de forecast en 80% (CA3 FJG-89)
✓ [chromium] › calculator.spec.ts:531:9 › bloquea error de forecast en 85% (CA2 FJG-89)
✓ [chromium] › calculator.spec.ts:544:9 › valida 79% como máximo permitido (CA2 FJG-89)
✓ [chromium] › calculator.spec.ts:559:9 › valida 1% como mínimo permitido (CA2 FJG-89)

✓ [Mobile Chrome] › calculator.spec.ts:492:9 › requiere error de forecast cuando se selecciona el dolor (FJG-89)
✓ [Mobile Chrome] › calculator.spec.ts:505:9 › bloquea error de forecast en 0% (CA3 FJG-89)
✓ [Mobile Chrome] › calculator.spec.ts:518:9 › bloquea error de forecast en 80% (CA3 FJG-89)
✓ [Mobile Chrome] › calculator.spec.ts:531:9 › bloquea error de forecast en 85% (CA2 FJG-89)
✓ [Mobile Chrome] › calculator.spec.ts:544:9 › valida 79% como máximo permitido (CA2 FJG-89)
✓ [Mobile Chrome] › calculator.spec.ts:559:9 › valida 1% como mínimo permitido (CA2 FJG-89)

[+90 additional tests passing]

102 passed (33.2s)
```

### Desglose de Cobertura de Tests E2E

**Tests totales:** 102 (51 escenarios × 2 navegadores: Chromium + Mobile Chrome)

**Distribución por módulo:**
- **Calculator (37 tests):**
  - Cloud costs: 3 tests
  - Manual processes: 7 tests
  - Forecasting: 9 tests (3 existentes + 6 nuevos FJG-89)
  - Inventory: 2 tests
  - Por sector: 4 tests
  - Por tamaño: 4 tests
  - Combinaciones: 4 tests
  - Validaciones y edge cases: 4 tests adicionales
- **Hero section:** 5 tests
- **Lead capture:** 9 tests

### Resumen de Implementación FJG-89

✅ **CA1:** Cálculo usa revenue por tamaño (`getRevenueFromSize`) con factores prudentes (5% impacto, 35% mejora)
✅ **CA2:** Validación de rango 1-79% implementada y testeada en UI y E2E
✅ **CA3:** Casos extremos 0% y ≥80% bloqueados con mensajes claros
✅ **DoD:** Fórmula, validaciones, mensajes de error y tests completados

**Tests específicos FJG-89:** 6 nuevos tests de validación
**Tests de forecasting totales:** 9 tests (3 existentes + 6 nuevos)
**Estado:** ✅ Todos los tests pasan (102/102)

**Commit:** `fa0870a` - test(roi): añade suite completa de tests E2E para FJG-89
