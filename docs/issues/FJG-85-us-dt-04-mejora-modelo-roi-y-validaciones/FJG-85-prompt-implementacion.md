# FJG-85: Prompt de Implementación
## US-DT-04 – Mejora modelo ROI y validaciones de la calculadora de ROI

**Rol:** Agent Developer
**Issue Linear:** FJG-85
**Fecha generación:** 2025-12-07
**Generado por:** Agent Manager

---

## 📋 VERIFICACIÓN PREVIA OBLIGATORIA

**ANTES DE IMPLEMENTAR**, debes:

1. **Leer la issue FJG-85 en Linear** usando `mcp_linear_get_issue` con id `FJG-85`
2. **Verificar** que este prompt coincide 100% con los **Criterios de Aceptación (CA)** y **Definition of Done (DoD)** de Linear
3. **Si detectas alguna discrepancia**, PARAR y preguntar a Fran qué debe prevalecer

---

## 🎯 Objetivo de la Issue

Mejorar la calculadora ROI para que:
- Aplique **validaciones lógicas exhaustivas** de entrada
- Use **supuestos conservadores** para evitar ROIs irreales
- Esté **parametrizada** vía fichero de configuración (sin números mágicos)
- Tenga **lógica de fallback** para escenarios no calculables
- Muestre **mensajes UX claros** de error/aviso
- Incluya **script de validación masiva v2** para verificar escenarios

---

## 📊 Estado Actual de Implementación

### ✅ YA COMPLETADO (FJG-86 a FJG-91)

**Arquitectura existente:**
```
profesional-web/
├── components/calculator/
│   └── calculatorConfig.ts          ✅ Fichero de configuración COMPLETO
├── lib/calculator/
│   ├── calculateROI.ts              ✅ Lógica de cálculo con config
│   ├── validation.ts                ✅ Validaciones de entrada y warnings
│   └── types.ts                     ✅ Tipos TypeScript completos
├── scripts/
│   └── validate-roi-v2.ts           ✅ Script validación masiva (≥1000 tests)
└── __tests__/
    ├── calculator/
    │   ├── calculateROI.test.ts     ✅ Tests unitarios cálculo ROI
    │   └── validation.test.ts       ✅ Tests validaciones y warnings
    └── scripts/
        └── validate-roi-v2.test.ts  ✅ Tests script validación
```

**Funcionalidades implementadas:**

1. **`calculatorConfig.ts`** ✅ (DoD1 - COMPLETO)
   - Configuración centralizada con tipos
   - Parámetros por `companySize`, `pain`, `sector`
   - Rangos de validación (`inputs.cloudSpendMonthly`, `manualHoursWeekly`, `forecastErrorPercent`)
   - Thresholds globales (`minPaybackMonths`, `roi3yCapPercent`, `maxCloudToRevenueRatio`, etc.)
   - Bien documentado y tipado

2. **`validation.ts`** ✅ (CA1, DoD2 - COMPLETO)
   - `validateCalculatorInputs()`: Validaciones de entrada con rangos min/max
   - `getCalculatorWarnings()`: Warnings de coherencia (cloud vs revenue, forecast alto, ROI extremo)
   - Mensajes claros y localizados en español
   - Tests unitarios completos (100% coverage)

3. **`calculateROI.ts`** ✅ (CA2, DoD3 - COMPLETO)
   - Usa `roiConfig` para todos los parámetros (no hay números mágicos)
   - Supuestos conservadores: cloud 27.5%, forecast 35% mejora, inventory 30% mejora
   - ROI cap a 1000% con flag `inventorySavingsCapped`
   - Funciones helper: `getRevenueFromSize()`, `getInventoryFromSize()`, `getInvestmentForPain()`

4. **`validate-roi-v2.ts`** ✅ (CA6, DoD6 - COMPLETO)
   - Script que genera >1000 combinaciones de inputs
   - Valida todos los escenarios y marca extremos
   - Exporta JSON + CSV con resultados
   - Tests automatizados que verifican funcionamiento

5. **UI/UX mensajes** ✅ (CA5, DoD5 - COMPLETADO en FJG-91)
   - Mensajes de error claros por campo
   - Warnings visibles de coherencia
   - Disclaimers sobre supuestos prudentes

---

## ⚠️ ANÁLISIS: ¿Qué falta por hacer?

### Estado del DoD:

- [x] **DoD1:** Fichero `calculatorConfig.ts` creado y usado ✅
- [x] **DoD2:** Validaciones de entrada implementadas y testeadas ✅
- [x] **DoD3:** Fórmulas con supuestos conservadores verificadas ✅
- [ ] **DoD4:** Lógica de fallback para escenarios inválidos ⚠️ **PENDIENTE**
- [x] **DoD5:** UI/UX con mensajes de error/aviso consistentes ✅
- [x] **DoD6:** Script validación masiva v2 ejecutado al menos una vez ✅
- [ ] **DoD7:** Fran ha revisado y validado comportamiento ⏳ **PENDIENTE APROBACIÓN**

### Análisis técnico:

**DoD4 - Lógica de fallback:** ⚠️ **REQUIERE IMPLEMENTACIÓN**

Actualmente:
- `validateCalculatorInputs()` devuelve errores por campo
- `getCalculatorWarnings()` devuelve warnings de coherencia
- Pero **NO HAY** lógica de fallback que impida devolver ROI numérico cuando:
  - Los inputs tienen errores de validación
  - Las combinaciones son incoherentes
  - Los escenarios están fuera de rango

**Lo que especifica CA4:**
> "Cuando los inputs no cumplen las validaciones (rangos o coherencia), la calculadora no devuelve ROI numérico, sino un mensaje de recomendación de diagnóstico personal, manteniendo la experiencia de usuario coherente."

**Necesitamos:**
1. Una función `shouldCalculateROI()` o similar que evalúe si los inputs son válidos
2. Modificar `calculateROI()` para devolver un tipo union: `ROIResult | ROIFallback`
3. El tipo `ROIFallback` debe contener:
   - `type: 'fallback'`
   - `reason: 'invalid_inputs' | 'incoherent_scenario' | 'out_of_range'`
   - `message: string` (mensaje para el usuario)
   - `recommendedAction: string` (p.ej. "recomendamos diagnóstico personalizado")

---

## 🔨 Plan de Implementación TDD

### Tarea 1: Extender tipos para soportar fallback

**Archivo:** `lib/calculator/types.ts`

**Tests a crear primero (RED):**
```typescript
// __tests__/calculator/calculateROI.test.ts

describe('calculateROI - fallback scenarios', () => {
  it('should return fallback when cloud spend is below minimum', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'industrial',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 100, // < 500 (min)
    };
    const result = calculateROI(inputs);
    expect(result.type).toBe('fallback');
    expect(result.reason).toBe('invalid_inputs');
    expect(result.message).toContain('dato no está en rango válido');
  });

  it('should return fallback when inputs have validation errors', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'industrial',
      pains: ['manual-processes'],
      manualHoursWeekly: 300, // > 200 (max)
    };
    const result = calculateROI(inputs);
    expect(result.type).toBe('fallback');
  });

  it('should return fallback when cloud spend is too high vs revenue', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'industrial',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 50_000, // 600K anual vs 7.5M revenue = 8% (warning pero no bloqueo)
    };
    // Este caso debe calcular ROI pero con warnings
    const result = calculateROI(inputs);
    expect(result.type).toBe('success');
    // Pero si fuera > 50% revenue (maxCloudToRevenueRatio), sí fallback:
    const extremeInputs = { ...inputs, cloudSpendMonthly: 350_000 }; // >4.2M anual
    const extremeResult = calculateROI(extremeInputs);
    expect(extremeResult.type).toBe('fallback');
    expect(extremeResult.reason).toBe('incoherent_scenario');
  });

  it('should return success for valid inputs without errors', () => {
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'industrial',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 5_000,
    };
    const result = calculateROI(inputs);
    expect(result.type).toBe('success');
    expect(result.investment).toBeGreaterThan(0);
  });
});
```

**Implementación (GREEN):**

1. Modificar `lib/calculator/types.ts`:
```typescript
export interface ROISuccess {
  type: 'success';
  investment: number;
  savingsAnnual: number;
  paybackMonths: number;
  roi3Years: number;
  inventorySavingsCapped?: boolean;
}

export interface ROIFallback {
  type: 'fallback';
  reason: 'invalid_inputs' | 'incoherent_scenario' | 'out_of_range';
  message: string;
  recommendedAction: string;
}

export type ROICalculationResult = ROISuccess | ROIFallback;

// Mantener ROIResult para backward compatibility en tests
export type ROIResult = Omit<ROISuccess, 'type'>;
```

2. Crear función `shouldCalculateROI()` en `lib/calculator/validation.ts`:
```typescript
export function shouldCalculateROI(inputs: CalculatorInputs): {
  canCalculate: boolean;
  reason?: ROIFallback['reason'];
  message?: string;
} {
  // 1. Validar inputs básicos
  const errors = validateCalculatorInputs(inputs);
  if (Object.keys(errors).length > 0) {
    return {
      canCalculate: false,
      reason: 'invalid_inputs',
      message: 'Los datos introducidos no están en rangos válidos',
    };
  }

  // 2. Validar coherencia cloud vs revenue
  if (inputs.pains.includes('cloud-costs') && inputs.cloudSpendMonthly) {
    const annualCloud = inputs.cloudSpendMonthly * 12;
    const estimatedRevenue = roiConfig.companySizes[inputs.companySize].estimatedRevenue;
    const ratio = annualCloud / estimatedRevenue;
    
    if (ratio > roiConfig.thresholds.maxCloudToRevenueRatio) {
      return {
        canCalculate: false,
        reason: 'incoherent_scenario',
        message: `Gasto cloud anual (${Math.round(annualCloud / 1000)}K€) superior al ${roiConfig.thresholds.maxCloudToRevenueRatio * 100}% de la facturación estimada`,
      };
    }
  }

  // 3. Validar forecast extremo (>extremeHigh)
  if (inputs.pains.includes('forecasting') && inputs.forecastErrorPercent) {
    const extremeHigh = roiConfig.inputs.forecastErrorPercent.extremeHigh;
    if (inputs.forecastErrorPercent > extremeHigh) {
      return {
        canCalculate: false,
        reason: 'out_of_range',
        message: `Error de forecast demasiado alto (>${extremeHigh}%)`,
      };
    }
  }

  return { canCalculate: true };
}
```

3. Modificar `calculateROI()` en `lib/calculator/calculateROI.ts`:
```typescript
import type { CalculatorInputs, ROICalculationResult } from './types';
import { shouldCalculateROI } from './validation';

export function calculateROI(
  inputs: CalculatorInputs,
  options?: CalculateROIOptions
): ROICalculationResult {
  // Verificar si podemos calcular
  const validation = shouldCalculateROI(inputs);
  
  if (!validation.canCalculate) {
    return {
      type: 'fallback',
      reason: validation.reason!,
      message: validation.message!,
      recommendedAction:
        'Recomendamos una consulta personalizada para analizar tu caso específico. Agenda una llamada para discutir las mejores soluciones para tu empresa.',
    };
  }

  // Cálculo normal (código existente)
  let totalSavingsAnnual = 0;
  let totalInvestment = 0;
  // ... resto del código actual ...

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
- Añadir type guard helper:
```typescript
// lib/calculator/types.ts
export function isROISuccess(result: ROICalculationResult): result is ROISuccess {
  return result.type === 'success';
}

export function isROIFallback(result: ROICalculationResult): result is ROIFallback {
  return result.type === 'fallback';
}
```

---

### Tarea 2: Actualizar tests existentes para nuevo tipo

**Tests a modificar:**

1. `__tests__/calculator/calculateROI.test.ts`:
   - Todos los tests deben verificar `result.type === 'success'` antes de acceder a `investment`, etc.
   - Usar type guards: `if (isROISuccess(result)) { ... }`

2. `__tests__/calculator/validation.test.ts`:
   - Tests de warnings deben seguir funcionando (warnings != fallback)
   - Añadir tests para `shouldCalculateROI()`

3. `__tests__/scripts/validate-roi-v2.test.ts`:
   - Verificar que el script maneja correctamente los fallbacks

---

### Tarea 3: Actualizar script de validación masiva

**Archivo:** `scripts/validate-roi-v2.ts`

**Modificaciones:**
```typescript
// Actualizar tipo ValidationCase
export interface ValidationCase {
  id: string;
  inputs: CalculatorInputs & { /* ... */ };
  result: ROICalculationResult; // Ya no es siempre ROIResult
  warnings: CalculatorWarning[];
  errors: string[];
  flags: ValidationFlags[];
  ratios: { /* ... */ };
  status: ValidationStatus;
  isFallback?: boolean; // Nueva flag
  fallbackReason?: string;
}

// Actualizar buildValidationReport()
function runValidation(inputs: CalculatorInputs): ValidationCase {
  // ... código actual ...
  
  const result = calculateROI(inputs);
  const isFallback = !isROISuccess(result);
  
  return {
    // ... campos actuales ...
    result,
    isFallback,
    fallbackReason: isFallback ? result.reason : undefined,
  };
}
```

---

### Tarea 4: Actualizar componentes UI (si existen)

**SI** hay componentes que usan `calculateROI()`:
- Buscar con `grep_search` archivos que importen `calculateROI`
- Actualizar para manejar `ROICalculationResult` con type guards
- Mostrar mensaje de fallback cuando `result.type === 'fallback'`

**Ejemplo:**
```typescript
const result = calculateROI(inputs);

if (isROIFallback(result)) {
  return (
    <div className="fallback-message">
      <p>{result.message}</p>
      <p className="recommended-action">{result.recommendedAction}</p>
      <Button>Agenda una consulta</Button>
    </div>
  );
}

// Mostrar ROI normal
return <ROIDisplay investment={result.investment} ... />;
```

---

## ✅ Checklist de Implementación

**ANTES de empezar:**
- [ ] Leer issue FJG-85 en Linear con `mcp_linear_get_issue`
- [ ] Verificar que este prompt coincide con CA y DoD de Linear
- [ ] Confirmar con Fran si hay discrepancias

**Implementación TDD:**
- [ ] **Tarea 1:** Extender tipos para soportar fallback (RED → GREEN → REFACTOR)
- [ ] **Tarea 2:** Actualizar tests existentes para nuevo tipo
- [ ] **Tarea 3:** Actualizar script validación masiva v2
- [ ] **Tarea 4:** Actualizar componentes UI (si existen)

**Verificación:**
- [ ] `npm run type-check` → 0 errores TypeScript
- [ ] `npm test` → 100% tests pasando
- [ ] `npm run build` → Build exitoso
- [ ] Ejecutar `npx tsx scripts/validate-roi-v2.ts` → Script funciona correctamente

---

## 📝 Informe de Implementación

Al terminar, genera `FJG-85-informe-implementacion.md` en la misma carpeta con:

1. **Resumen ejecutivo** (qué se implementó)
2. **Cambios en código** (archivos modificados, líneas aprox)
3. **Tests ejecutados** (coverage, resultados)
4. **Problemas encontrados** (si hubo alguno)
5. **Siguiente paso** (revisión por Agent Reviewer)

---

## 🚨 Restricciones de la Constitución

- **NO** modifiques `docs/ESTADO_PROYECTO.md` (responsabilidad del Manager)
- **NO** ejecutes commits/pushes (responsabilidad del Manager)
- **NO** te salgas del alcance definido en Linear CA/DoD
- **SÍ** pregunta a Fran si algo es ambiguo

---

## 🔗 Referencias

- **Issue Linear:** FJG-85
- **Constitución:** `.prompts/CONSTITUCION.md`
- **Roles:** `.prompts/ROLES.md`
- **Issues relacionadas:** FJG-86 a FJG-91 (subtareas completadas)
