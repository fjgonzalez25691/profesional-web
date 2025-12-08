# FJG-96: Prompt de Implementación
## US-DT-04-BUG-FALLBACK – ROI extremo o payback < 3m activa fallback

**Rol:** Agent Developer
**Issue Linear:** FJG-96
**Fecha generación:** 2025-12-08
**Generado por:** Agent Manager

---

## 📋 VERIFICACIÓN PREVIA OBLIGATORIA

**ANTES DE IMPLEMENTAR**, debes:

1. **Leer la issue FJG-96 en Linear** usando `mcp_linear_get_issue` con id `FJG-96`
2. **Verificar** que este prompt coincide 100% con los **Criterios de Aceptación (CA)** y **Definition of Done (DoD)** de Linear
3. **Si detectas alguna discrepancia**, PARAR y preguntar a Fran qué debe prevalecer

---

## 🎯 Objetivo de la Issue

**Problema detectado:**
Escenarios con ROI extremadamente optimistas (>90%) o payback muy cortos (<3 meses) son irreales y dañan la credibilidad. Deben activar fallback en lugar de mostrar cifras.

**Solución:**
Añadir validación post-cálculo que active fallback con `reason: 'extreme_roi'` cuando:
- `roi3Years > 90` **O**
- `paybackMonths < 3`

---

## 📊 Estado Actual de Implementación

### ✅ Infraestructura existente (FJG-85/FJG-89):

**Tipos definidos** (`lib/calculator/types.ts`):
```typescript
export interface ROIFallback {
  type: 'fallback';
  reason: 'invalid_inputs' | 'incoherent_scenario' | 'out_of_range';
  message: string;
  recommendedAction: string;
}

export type ROICalculationResult = ROISuccess | ROIFallback;
```

**Lógica actual** (`lib/calculator/calculateROI.ts`):
```typescript
export function calculateROI(inputs: CalculatorInputs, options?: CalculateROIOptions): ROICalculationResult {
  // 1. Validación pre-cálculo (shouldCalculateROI)
  const validation = shouldCalculateROI(inputs);
  if (!validation.canCalculate) {
    return { type: 'fallback', ... };
  }

  // 2. Cálculo de ROI
  const paybackMonths = ...;
  const roi3Years = ...;

  // 3. Retorno de success (SIN validación post-cálculo)
  return {
    type: 'success',
    investment,
    savingsAnnual,
    paybackMonths,
    roi3Years,
    ...
  };
}
```

**⚠️ FALTA:** Validación post-cálculo para ROI extremo/payback bajo.

---

## 🔨 Plan de Implementación TDD

### Tarea 1: Extender tipo ROIFallback con nueva reason

**Archivo:** `lib/calculator/types.ts`

**Tests a crear primero (RED):**
```typescript
// __tests__/calculator/calculateROI.test.ts

describe('calculateROI - extreme ROI fallback', () => {
  it('should return fallback when ROI > 90%', () => {
    // Escenario: empresa pequeña, dolor cloud con gasto muy bajo vs ahorro alto
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'industrial',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 10_000, // 120K anual
    };
    
    const result = calculateROI(inputs);
    
    // Con savings rate 27.5%, ahorro = 33K anual
    // Investment ~15K (base) * 1.0 (size) * min(10K/10K, 5) = 15K
    // Payback ~5 meses, ROI 3y ~560% → debería activar fallback
    
    expect(result.type).toBe('fallback');
    expect(result.reason).toBe('extreme_roi');
    expect(result.message).toContain('escenario extremadamente optimista');
  });

  it('should return fallback when payback < 3 months', () => {
    // Escenario: combinación multi-pain con ahorro muy alto vs inversión baja
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'industrial',
      pains: ['cloud-costs', 'manual-processes'],
      cloudSpendMonthly: 5_000,
      manualHoursWeekly: 100,
    };
    
    const result = calculateROI(inputs);
    
    // Cloud: 5K * 12 * 0.275 = 16.5K
    // Manual: 100 * 52 * 25 * 0.5 = 65K
    // Total savings: 81.5K
    // Investment: ~27K (15K+12K)
    // Payback: ~4 meses OK, pero si payback sale <3, debe activar fallback
    
    // Ajustar escenario para forzar payback <3
    // ... (Developer debe encontrar combinación real que lo active)
  });

  it('should return success when ROI ≤ 90% and payback ≥ 3 months', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'industrial',
      pains: ['forecasting'],
      forecastErrorPercent: 30,
    };
    
    const result = calculateROI(inputs);
    
    expect(result.type).toBe('success');
    if (result.type === 'success') {
      expect(result.roi3Years).toBeLessThanOrEqual(90);
      expect(result.paybackMonths).toBeGreaterThanOrEqual(3);
    }
  });
});
```

**Implementación (GREEN):**

1. Extender tipo `ROIFallback` en `lib/calculator/types.ts`:
```typescript
export interface ROIFallback {
  type: 'fallback';
  reason: 'invalid_inputs' | 'incoherent_scenario' | 'out_of_range' | 'extreme_roi'; // ← AÑADIR
  message: string;
  recommendedAction: string;
}
```

2. Añadir validación post-cálculo en `calculateROI()` (`lib/calculator/calculateROI.ts`):
```typescript
export function calculateROI(inputs: CalculatorInputs, options?: CalculateROIOptions): ROICalculationResult {
  // ... código actual hasta el cálculo de roi3Years y paybackMonths ...

  const hasSavings = totalSavingsAnnual > 0 && totalInvestment > 0;
  const paybackMonths = hasSavings ? Math.round((totalInvestment / totalSavingsAnnual) * 12) : 0;
  const roi3Years = hasSavings
    ? Math.round(((totalSavingsAnnual * 3 - totalInvestment) / totalInvestment) * 100)
    : 0;

  // FJG-96: Validar resultados extremos ANTES de devolver success
  if (roi3Years > 90 || paybackMonths < 3) {
    return {
      type: 'fallback',
      reason: 'extreme_roi',
      message:
        'Los datos introducidos generan un escenario extremadamente optimista (ROI muy alto o retorno muy rápido). Para garantizar resultados realistas, recomendamos validarlo en una sesión personalizada.',
      recommendedAction:
        'Agenda una consulta gratuita de 30 minutos para analizar tu caso específico y obtener una estimación detallada y ajustada a tu realidad.',
    };
  }

  return {
    type: 'success',
    investment: Math.round(totalInvestment),
    savingsAnnual: Math.round(totalSavingsAnnual),
    paybackMonths,
    roi3Years,
    inventorySavingsCapped,
  };
}
```

**Refactor:**
- Verificar que los umbrales (90%, 3 meses) coinciden con `roiConfig.thresholds` si existen
- Si no existen en config, considerar añadirlos para parametrización futura

---

### Tarea 2: Actualizar UI para manejar 'extreme_roi'

**Archivos a revisar:**
- `components/calculator/Step3Results.tsx`
- `components/calculator/ROICalculator.tsx`

**Verificación:**
```typescript
// La UI debe detectar reason === 'extreme_roi' y mostrar mensaje específico
if (result.type === 'fallback' && result.reason === 'extreme_roi') {
  return (
    <div className="extreme-roi-fallback">
      <AlertTriangle />
      <p>{result.message}</p>
      <p className="recommended-action">{result.recommendedAction}</p>
      <Button>Agenda tu consulta gratuita</Button>
    </div>
  );
}
```

**Tests E2E (opcional pero recomendado):**
```typescript
// __tests__/e2e/calculator.spec.ts
test('should show extreme ROI fallback message', async ({ page }) => {
  await page.goto('/calculadora');
  
  // Rellenar formulario con escenario extremo
  await page.selectOption('select[name="companySize"]', '5-10M');
  await page.fill('input[name="cloudSpendMonthly"]', '10000');
  
  await page.click('button:has-text("Calcular")');
  
  // Verificar que NO se muestran cifras
  await expect(page.locator('text=/ROI 3 años/i')).not.toBeVisible();
  await expect(page.locator('text=/Ahorro anual/i')).not.toBeVisible();
  
  // Verificar mensaje de fallback
  await expect(page.locator('text=/escenario extremadamente optimista/i')).toBeVisible();
  await expect(page.locator('text=/Agenda una consulta/i')).toBeVisible();
});
```

---

### Tarea 3: Actualizar script de validación masiva

**Archivo:** `scripts/validate-roi-v2.ts`

**Modificación:**
```typescript
export type ValidationFlags =
  | 'roi_cap'
  | 'payback_below_min'
  | 'savings_over_revenue'
  | 'savings_over_inventory'
  | 'cloud_ratio_high'
  | 'forecast_warning'
  | 'extreme_roi'; // ← AÑADIR

// En la función de análisis:
if (result.type === 'fallback' && result.reason === 'extreme_roi') {
  flags.push('extreme_roi');
}
```

---

## ✅ Checklist de Implementación

**ANTES de empezar:**
- [ ] Leer issue FJG-96 en Linear con `mcp_linear_get_issue`
- [ ] Verificar que este prompt coincide con CA y DoD de Linear

**Implementación TDD:**
- [ ] **Tarea 1:** Extender tipos y añadir validación post-cálculo (RED → GREEN → REFACTOR)
- [ ] **Tarea 2:** Actualizar UI para manejar 'extreme_roi'
- [ ] **Tarea 3:** Actualizar script validación masiva

**Verificación:**
- [ ] `npm run type-check` → 0 errores TypeScript
- [ ] `npm test` → 100% tests pasando (unitarios + E2E si aplican)
- [ ] `npm run build` → Build exitoso
- [ ] Validación manual de escenarios extremos en calculadora

---

## 📝 Criterios de Aceptación (CA) - Verificación

### CA1: ROI 3y > 90 → devuelve `fallback/extreme_roi`
**Test unitario:**
```typescript
it('CA1: ROI > 90% triggers extreme_roi fallback', () => {
  // ... test implementado
});
```

### CA2: Payback < 3m → devuelve `fallback/extreme_roi`
**Test unitario:**
```typescript
it('CA2: Payback < 3 months triggers extreme_roi fallback', () => {
  // ... test implementado
});
```

### CA3: Caso normal → devuelve `ROISuccess`
**Test unitario:**
```typescript
it('CA3: Normal ROI (≤90%) and payback (≥3m) returns success', () => {
  // ... test implementado
});
```

### CA4: UI muestra mensaje/CTA sin cifras
**Verificación manual + E2E test:**
- Introducir escenario extremo en calculadora
- Verificar que NO se muestran cifras ROI/ahorro/payback
- Verificar mensaje de fallback visible
- Verificar CTA de agenda presente

---

## 📝 Informe de Implementación

Al terminar, genera `FJG-96-informe-implementacion.md` en la misma carpeta con:

1. **Resumen ejecutivo** (qué se implementó)
2. **Escenarios de prueba** (combinaciones que activan fallback)
3. **Tests ejecutados** (coverage, resultados)
4. **Capturas/evidencias** (opcional: screenshots de UI con fallback)
5. **Siguiente paso** (revisión por Agent Reviewer)

---

## 🚨 Restricciones de la Constitución

- **NO** modifiques `docs/ESTADO_PROYECTO.md` (responsabilidad del Manager)
- **NO** ejecutes commits/pushes (responsabilidad del Manager)
- **NO** te salgas del alcance definido en Linear CA/DoD
- **SÍ** pregunta a Fran si algo es ambiguo

---

## 🔗 Referencias

- **Issue Linear:** FJG-96
- **Issue padre:** FJG-85 (mejora modelo ROI)
- **Issue relacionada:** FJG-89 (fallback general)
- **Constitución:** `.prompts/CONSTITUCION.md`
- **Roles:** `.prompts/ROLES.md`
