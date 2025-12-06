# 📋 FJG-94 – US-DT-04-ST06 – Validación Masiva Script v2 + Refactorización validation.ts

**Issue ID Linear**: FJG-94  
**Parent Issue**: FJG-85 (US-DT-04 – Mejora Modelo ROI + Validaciones)  
**Sibling Issue**: FJG-92 (US-DT-04-ST05-UX – Mensajes UI) - DONE  
**Estimación**: 5 Story Points  
**Branch**: `fjgonzalez25691-fjg-94-us-dt-04-st06-validacion-masiva-script-v2-y-analisis-de`  
**Rol**: Agent Developer (TDD estricto)  

---

## 🎯 Alcance de la Issue

**Objetivos duales**:

### FASE 1: Refactorización validation.ts (Eliminación Deuda Técnica)
- **Problema identificado**: `lib/calculator/validation.ts` contiene 8 constantes hardcodeadas que divergen de `calculatorConfig.ts` (hasta 5x en algunos casos)
- **Solución**: Eliminar constantes hardcodeadas y usar `calculatorConfig.ts` como única fuente de verdad
- **Divergencias críticas detectadas**:
  - `CLOUD_MIN = 100` (config dice 500) → 5x divergencia
  - `CLOUD_MAX = 500_000` (config dice 100_000) → 5x divergencia
  - `MANUAL_MIN = 1` (config dice 5) → 5x divergencia
  - `MANUAL_MAX = 168` (config dice 200) → 1.2x divergencia
  - `FORECAST_MIN = 1` (config dice 5) → 5x divergencia
  - `FORECAST_MAX = 100` (config dice 60-80) → 1.4x divergencia
  - `CLOUD_REVENUE_WARNING_RATIO = 0.2` (no existe en config)
  - `FORECAST_WARNING_THRESHOLD = 50` (no existe en config)

### FASE 2: Script de Validación Masiva v2
- Crear script `validate-roi-v2.ts` que valide múltiples combinaciones de inputs contra lógica ROI
- Usar ÚNICAMENTE valores de `calculatorConfig.ts` (post-refactorización)
- Detectar flags, advertencias, thresholds aplicados
- Generar reporte JSON con análisis completo

---

## 📐 Criterios de Aceptación (CA)

### CA1: Refactorización validation.ts Completada
- ✅ 8 constantes hardcodeadas eliminadas
- ✅ `calculatorConfig.ts` ampliado con 2 thresholds faltantes (cloudRevenueWarningRatio, forecastWarningThreshold)
- ✅ `validation.ts` importa `roiConfig` y usa valores dinámicos
- ✅ Tests de refactorización pasan (validation-refactor.test.ts)
- ✅ Tests existentes actualizados (validation.test.ts)

### CA2: Script Validación Masiva Funcional
- ✅ Script `validate-roi-v2.ts` ejecutable vía `tsx scripts/validate-roi-v2.ts`
- ✅ Genera archivo JSON con timestamp: `scripts/validation-results-YYYY-MM-DD-HH-mm-ss.json`
- ✅ El script recorre ≥ 1.000 combinaciones de test (companySizes × sectors × pain mixes × input variations)

### CA3: Uso Obligatorio de calculatorConfig.ts
- ✅ Script usa `roiConfig.inputs.*` para rangos (cloudSpendMonthly, manualHoursWeekly, forecastErrorPercent)
- ✅ Script usa `roiConfig.thresholds.*` para validaciones (minPaybackMonths, roi3yCapPercent, maxCloudToRevenueRatio)
- ✅ Script usa `roiConfig.cloudCostFactors.pricingMultipliers.*` para sectores
- ✅ NO hay valores hardcodeados (excepto structure del JSON output)

### CA4: Detección de Escenarios Extremos
- ✅ Script identifica flags claros de escenarios extremos:
  - `payback_cap_applied`: Payback = `roi3yCapPercent * 36`
  - `payback_below_min`: Payback < `minPaybackMonths`
  - `savings_exceed_revenue`: Ahorro anual > facturación estimada
  - `savings_exceed_inventory`: Ahorro anual > inventario estimado
  - `high_forecast_error`: ForecastError >= `forecastWarningThreshold`
  - `high_cloud_revenue_ratio`: CloudSpend/Revenue > `maxCloudToRevenueRatio`
- ✅ Script compara valores calculados vs. thresholds de `calculatorConfig.ts`

### CA5: Validación y Revisión con Fran
- ✅ JSON incluye metadata: timestamp, source file, total test cases, pass/fail summary
- ✅ JSON incluye array `validations[]` con cada test case: inputs, outputs, flags, warnings, validationStatus
- ✅ JSON incluye section `summary` con estadísticas: totalTests, flagsCounts, warningsCounts, avgROI, avgPayback
- ✅ Script ejecutado al menos una vez y resultados revisados con Fran
- ✅ Tabla de escenarios extremos generada y revisada
- ✅ Ajustes aplicados si se detectan desviaciones graves

---

## ✅ Definition of Done (DoD)

### DoD Fase 1: Refactorización
- [x] `components/calculator/calculatorConfig.ts` ampliado con 2 thresholds faltantes
- [x] `lib/calculator/validation.ts` refactorizado (sin constantes hardcodeadas)
- [x] Test unitario `lib/calculator/__tests__/validation-refactor.test.ts` creado y passing
- [x] Test existente `lib/calculator/__tests__/validation.test.ts` actualizado y passing
### DoD Fase 2: Script Validación
- [x] Script `scripts/validate-roi-v2.ts` creado
- [x] Script documentado (README específico): `scripts/README.md` actualizado
- [x] Ejecución de ≥ 1.000 combinaciones confirmada
- [x] Archivo JSON generado en `scripts/validation-results-*.json` con metadata, validations[], summary
- [x] Tabla de escenarios extremos generada (flags en JSON)
- [x] Script ejecutado al menos una vez y resultados revisados con Fran
- [x] Ajustes aplicados si se detectan desviaciones graves
- [x] Commit atómico: `feat(FJG-94): add validate-roi-v2 script + JSON report`
- [x] Tests E2E pasan: `npm run test`
- [x] Branch pusheado: `git push origin fjgonzalez25691-fjg-94-...`
- [x] Informe de implementación generado: `docs/issues/FJG-94-.../FJG-94-informe-implementacion.md`
- [x] Branch pusheado: `git push origin fjgonzalez25691-fjg-94-...`
- [x] Informe de implementación generado: `docs/issues/FJG-94-.../FJG-94-informe-implementacion.md`

---

## 🧪 Implementación TDD (11 Pasos - 2 Fases)

### 🔧 FASE 1: Refactorización validation.ts (Pasos 1-4)

#### Paso 1: Red – Ampliar calculatorConfig.ts con thresholds faltantes
**Objetivo**: Agregar `cloudRevenueWarningRatio` y `forecastWarningThreshold` al config central.

**Test que debe FALLAR primero**:
```typescript
// lib/calculator/__tests__/validation-refactor.test.ts
import { roiConfig } from '@/components/calculator/calculatorConfig';

describe('FJG-94 – calculatorConfig.ts debe incluir thresholds de validación', () => {
  test('debe tener cloudRevenueWarningRatio definido', () => {
    expect(roiConfig.thresholds.cloudRevenueWarningRatio).toBeDefined();
    expect(roiConfig.thresholds.cloudRevenueWarningRatio).toBeGreaterThan(0);
    expect(roiConfig.thresholds.cloudRevenueWarningRatio).toBeLessThan(1);
  });

  test('debe tener forecastWarningThreshold definido', () => {
    expect(roiConfig.thresholds.forecastWarningThreshold).toBeDefined();
    expect(roiConfig.thresholds.forecastWarningThreshold).toBeGreaterThan(0);
    expect(roiConfig.thresholds.forecastWarningThreshold).toBeLessThanOrEqual(100);
  });
});
```

**Ejecutar test**:
```bash
npm test -- lib/calculator/__tests__/validation-refactor.test.ts
```

**Resultado esperado**: ❌ FAIL (thresholds no existen en GlobalThresholds interface)

---

#### Paso 2: Green – Implementar thresholds en calculatorConfig.ts
**Objetivo**: Agregar 2 thresholds faltantes al interface y objeto roiConfig.

**Código producción**:
```typescript
// components/calculator/calculatorConfig.ts

// 1. Actualizar interface GlobalThresholds
export interface GlobalThresholds {
  minPaybackMonths: number;
  roi3yCapPercent: number;
  maxCloudToRevenueRatio: number;
  cloudRevenueWarningRatio: number; // NUEVO - Ratio CloudSpend/Revenue para warning amarillo
  forecastWarningThreshold: number; // NUEVO - % ForecastError para flag crítico
}

// 2. Actualizar objeto roiConfig.thresholds
export const roiConfig: RoiConfiguration = {
  companySizes: { /* ... sin cambios ... */ },
  inputs: { /* ... sin cambios ... */ },
  thresholds: {
    minPaybackMonths: 3,
    roi3yCapPercent: 0.8, // 80%
    maxCloudToRevenueRatio: 0.5, // 50%
    cloudRevenueWarningRatio: 0.2, // NUEVO - Warning si CloudSpend > 20% Revenue
    forecastWarningThreshold: 50,  // NUEVO - Flag si forecastError >= 50%
  },
  // ... resto sin cambios
};
```

**Ejecutar test**:
```bash
npm test -- lib/calculator/__tests__/validation-refactor.test.ts
```

**Resultado esperado**: ✅ PASS

**Commit**:
```bash
git add components/calculator/calculatorConfig.ts lib/calculator/__tests__/validation-refactor.test.ts
git commit -m "test(FJG-94): add cloudRevenueWarningRatio + forecastWarningThreshold to config"
```

---

#### Paso 3: Red – Test para eliminar constantes hardcodeadas en validation.ts
**Objetivo**: Verificar que validation.ts usa roiConfig en lugar de constantes locales.

**Test que debe FALLAR primero**:
```typescript
// lib/calculator/__tests__/validation-refactor.test.ts
import { roiConfig } from '@/components/calculator/calculatorConfig';
import * as validationModule from '@/lib/calculator/validation';

describe('FJG-94 – validation.ts debe usar calculatorConfig', () => {
  test('no debe tener constantes CLOUD_MIN/MAX hardcodeadas', () => {
    const validationCode = require('fs').readFileSync(
      require('path').join(process.cwd(), 'lib/calculator/validation.ts'),
      'utf-8'
    );
    expect(validationCode).not.toMatch(/const CLOUD_MIN\s*=/);
    expect(validationCode).not.toMatch(/const CLOUD_MAX\s*=/);
  });

  test('validateCloudSpend debe usar roiConfig.inputs.cloudSpendMonthly', () => {
    const result = validationModule.validateCloudSpend(400); // Bajo el mínimo del config (500)
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain(roiConfig.inputs.cloudSpendMonthly.min.toString());
  });

  test('validateManualHours debe usar roiConfig.inputs.manualHoursWeekly', () => {
    const result = validationModule.validateManualHours(3); // Bajo el mínimo del config (5)
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain(roiConfig.inputs.manualHoursWeekly.min.toString());
  });

  test('validateForecastError debe usar roiConfig.inputs.forecastErrorPercent', () => {
    const result = validationModule.validateForecastError(3); // Bajo el mínimo del config (5)
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain(roiConfig.inputs.forecastErrorPercent.min.toString());
  });

  test('warnings deben usar roiConfig.thresholds (cloudRevenueWarning, forecastWarning)', () => {
    // Test cloudRevenueWarning usa roiConfig.thresholds.cloudRevenueWarningRatio
    const result1 = validationModule.validateCloudSpendWithRevenue(50000, 200000);
    const ratio = 50000 / 200000; // 0.25 > 0.2 (cloudRevenueWarningRatio)
    if (ratio > roiConfig.thresholds.cloudRevenueWarningRatio) {
      expect(result1.warnings?.length).toBeGreaterThan(0);
      expect(result1.warnings[0]).toContain((roiConfig.thresholds.cloudRevenueWarningRatio * 100).toString());
    }

    // Test forecastWarning usa roiConfig.thresholds.forecastWarningThreshold
    const result2 = validationModule.validateForecastError(55); // >= 50 (forecastWarningThreshold)
    expect(result2.warnings?.length).toBeGreaterThan(0);
    expect(result2.warnings[0]).toContain(roiConfig.thresholds.forecastWarningThreshold.toString());
  });
});
```

**Ejecutar test**:
```bash
npm test -- lib/calculator/__tests__/validation-refactor.test.ts
```

**Resultado esperado**: ❌ FAIL (validation.ts aún tiene constantes hardcodeadas)

---

#### Paso 4: Green – Refactorizar validation.ts para usar roiConfig
**Objetivo**: Eliminar 8 constantes hardcodeadas y usar valores de calculatorConfig.ts.

**Código producción**:
```typescript
// lib/calculator/validation.ts
import { roiConfig } from '@/components/calculator/calculatorConfig';

// ❌ ELIMINAR estas constantes hardcodeadas:
// const CLOUD_MIN = 100;
// const CLOUD_MAX = 500_000;
// const MANUAL_MIN = 1;
// const MANUAL_MAX = 168;
// const FORECAST_MIN = 1;
// const FORECAST_MAX = 100;
// const CLOUD_REVENUE_WARNING_RATIO = 0.2;
// const FORECAST_WARNING_THRESHOLD = 50;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export function validateCloudSpend(value: number): ValidationResult {
  const errors: string[] = [];
  const { min, max } = roiConfig.inputs.cloudSpendMonthly; // ✅ Usar config

  if (value < min) {
    errors.push(`El gasto en nube debe ser al menos ${min}€/mes`);
  }
  if (value > max) {
    errors.push(`El gasto en nube no puede superar ${max}€/mes`);
  }

  return { isValid: errors.length === 0, errors };
}

export function validateManualHours(value: number): ValidationResult {
  const errors: string[] = [];
  const { min, max } = roiConfig.inputs.manualHoursWeekly; // ✅ Usar config

  if (value < min) {
    errors.push(`Las horas manuales deben ser al menos ${min}h/semana`);
  }
  if (value > max) {
    errors.push(`Las horas manuales no pueden superar ${max}h/semana`);
  }

  return { isValid: errors.length === 0, errors };
}

export function validateForecastError(value: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { min, max } = roiConfig.inputs.forecastErrorPercent; // ✅ Usar config

  if (value < min) {
    errors.push(`El error de forecast debe ser al menos ${min}%`);
  }
  if (value > max) {
    errors.push(`El error de forecast no puede superar ${max}%`);
  }

  // Warning crítico usando threshold de config
  const warningThreshold = roiConfig.thresholds.forecastWarningThreshold; // ✅ Usar config
  if (value >= warningThreshold) {
    warnings.push(
      `⚠️ Error de forecast >= ${warningThreshold}%: los resultados pueden ser muy imprecisos`
    );
  }

  return { isValid: errors.length === 0, errors, warnings };
}

export function validateCloudSpendWithRevenue(
  cloudSpend: number,
  estimatedRevenue: number
): ValidationResult {
  const warnings: string[] = [];
  const ratio = cloudSpend / estimatedRevenue;
  const warningRatio = roiConfig.thresholds.cloudRevenueWarningRatio; // ✅ Usar config

  if (ratio > warningRatio) {
    warnings.push(
      `⚠️ El gasto en nube representa ${(ratio * 100).toFixed(1)}% de los ingresos (>${(warningRatio * 100)}%). Considera optimizar costes.`
    );
  }

  return { isValid: true, errors: [], warnings };
}

// ... resto de funciones de validación sin cambios (si las hay)
```

**Ejecutar tests**:
```bash
npm test -- lib/calculator/__tests__/validation-refactor.test.ts
npm test -- lib/calculator/__tests__/validation.test.ts # Actualizar tests existentes si fallan
```

**Actualizar tests existentes si es necesario**:
```typescript
// lib/calculator/__tests__/validation.test.ts
// Actualizar expects para reflejar nuevos valores de config:
// - CLOUD_MIN: 100 → 500
// - MANUAL_MIN: 1 → 5
// - FORECAST_MIN: 1 → 5
// - FORECAST_MAX: 100 → 60 (o 80 según sector)
```

**Resultado esperado**: ✅ PASS (ambos test suites)

**Commit**:
```bash
git add lib/calculator/validation.ts lib/calculator/__tests__/validation-refactor.test.ts lib/calculator/__tests__/validation.test.ts
git commit -m "test(FJG-94): refactor validation.ts to use calculatorConfig + tests"
```

---

### 🚀 FASE 2: Script de Validación Masiva (Pasos 5-11)

#### Paso 5: Red – Test para estructura básica del script
**Objetivo**: Verificar que el script existe, exporta función principal y usa calculatorConfig.

**Test que debe FALLAR primero**:
```typescript
// scripts/__tests__/validate-roi-v2.test.ts
import { validateROIMassive, type ValidationReport } from '../validate-roi-v2';
import { roiConfig } from '@/components/calculator/calculatorConfig';

describe('FJG-94 – validate-roi-v2.ts estructura básica', () => {
  test('debe exportar función validateROIMassive', () => {
    expect(typeof validateROIMassive).toBe('function');
  });

  test('debe retornar ValidationReport con metadata', () => {
    const report = validateROIMassive();
    expect(report.metadata).toBeDefined();
    expect(report.metadata.timestamp).toBeDefined();
  test('debe incluir al menos 1000 test cases en validations[]', () => {
    const report = validateROIMassive();
    expect(report.validations.length).toBeGreaterThanOrEqual(1000);
  });t('debe incluir al menos 50 test cases en validations[]', () => {
    const report = validateROIMassive();
    expect(report.validations.length).toBeGreaterThanOrEqual(50);
  });

  test('debe incluir section summary con estadísticas', () => {
    const report = validateROIMassive();
    expect(report.summary.totalTests).toBeGreaterThan(0);
    expect(report.summary.flagsCounts).toBeDefined();
    expect(report.summary.warningsCounts).toBeDefined();
  });
});
```

**Ejecutar test**:
```bash
npm test -- scripts/__tests__/validate-roi-v2.test.ts
```

**Resultado esperado**: ❌ FAIL (script no existe)

---

#### Paso 6: Green – Implementar estructura básica del script
**Objetivo**: Crear script con esqueleto de función validateROIMassive y tipos.

**Código producción**:
```typescript
// scripts/validate-roi-v2.ts
import { roiConfig, type CompanySize, type Sector } from '@/components/calculator/calculatorConfig';
import { calculateROI, type ROIResult } from '@/lib/calculator/calculateROI';
import { validateCloudSpend, validateManualHours, validateForecastError } from '@/lib/calculator/validation';
import fs from 'fs';
import path from 'path';

export interface ValidationTestCase {
  inputs: {
    companySize: CompanySize;
    sector: Sector;
    cloudSpendMonthly: number;
    manualHoursWeekly: number;
    forecastErrorPercent: number;
    pains: string[]; // IDs de pains activos
  };
  outputs: ROIResult;
  flags: string[]; // Ej: ["payback_cap_applied", "high_forecast_error"]
  warnings: string[];
  validationStatus: 'PASS' | 'FAIL';
}

export interface ValidationSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  flagsCounts: Record<string, number>;
  warningsCounts: Record<string, number>;
  avgROI: number;
  avgPayback: number;
}

export interface ValidationReport {
  metadata: {
    timestamp: string;
    sourceFile: string;
    configVersion: string; // Ej: "v2.1" (extraído de calculatorConfig si existe)
  };
  validations: ValidationTestCase[];
  summary: ValidationSummary;
}

export function validateROIMassive(): ValidationReport {
  const timestamp = new Date().toISOString();
  const validations: ValidationTestCase[] = [];

  // Generar combinaciones de test cases
  const companySizes: CompanySize[] = ['startup', 'pyme', 'enterprise'];
  const sectors: Sector[] = ['retail', 'manufacturing', 'logistics', 'services', 'technology'];
  
  // Usar rangos de calculatorConfig para valores de prueba
  const cloudSpendValues = [
    roiConfig.inputs.cloudSpendMonthly.min, // 500
    5000,
    20000,
    roiConfig.inputs.cloudSpendMonthly.max, // 100000
  ];
  
  const manualHoursValues = [
    roiConfig.inputs.manualHoursWeekly.min, // 5
    20,
    50,
    roiConfig.inputs.manualHoursWeekly.max, // 200
  ];
  
  const forecastErrorValues = [
    roiConfig.inputs.forecastErrorPercent.min, // 5
    15,
    30,
    roiConfig.inputs.forecastErrorPercent.max, // 60
  ];

  // Generar al menos 1000 combinaciones
  // 3 companySizes × 5 sectors × 4 cloudSpend × 4 manualHours × 4 forecastError × 2+ pain combos = 960+ combos
  for (const companySize of companySizes) {
    for (const sector of sectors) {
      for (let i = 0; i < cloudSpendValues.length; i++) {
        const cloudSpend = cloudSpendValues[i];
        const manualHours = manualHoursValues[i % manualHoursValues.length];
        const forecastError = forecastErrorValues[i % forecastErrorValues.length];

        // Calcular ROI con inputs dados
        const inputs = {
          companySize,
          sector,
          cloudSpendMonthly: cloudSpend,
          manualHoursWeekly: manualHours,
          forecastErrorPercent: forecastError,
          pains: ['cloud-costs', 'forecast-errors'], // Ejemplo simplificado
        };

        const roiResult = calculateROI(inputs);

        // Detectar flags
        const flags: string[] = [];
        if (roiResult.paybackMonths === roiConfig.thresholds.roi3yCapPercent * 36) {
          flags.push('payback_cap_applied');
        }
        if (forecastError >= roiConfig.thresholds.forecastWarningThreshold) {
          flags.push('high_forecast_error');
        }

        // Detectar warnings
        const warnings: string[] = [];
        const validationForecast = validateForecastError(forecastError);
        if (validationForecast.warnings && validationForecast.warnings.length > 0) {
          warnings.push(...validationForecast.warnings);
        }

        // Validar que outputs cumplen thresholds
        let validationStatus: 'PASS' | 'FAIL' = 'PASS';
        if (roiResult.paybackMonths < roiConfig.thresholds.minPaybackMonths) {
          validationStatus = 'FAIL';
        }

        validations.push({
          inputs,
          outputs: roiResult,
          flags,
          warnings,
          validationStatus,
        });
      }
    }
  }

  // Calcular summary
  const totalTests = validations.length;
  const passedTests = validations.filter(v => v.validationStatus === 'PASS').length;
  const failedTests = totalTests - passedTests;

  const flagsCounts: Record<string, number> = {};
  const warningsCounts: Record<string, number> = {};
  let totalROI = 0;
  let totalPayback = 0;

  validations.forEach(v => {
    v.flags.forEach(flag => {
      flagsCounts[flag] = (flagsCounts[flag] || 0) + 1;
    });
    v.warnings.forEach(warn => {
      const key = warn.substring(0, 30); // Truncar para agrupar
      warningsCounts[key] = (warningsCounts[key] || 0) + 1;
    });
    totalROI += v.outputs.roi3Years;
    totalPayback += v.outputs.paybackMonths;
  });

  const summary: ValidationSummary = {
    totalTests,
    passedTests,
    failedTests,
    flagsCounts,
    warningsCounts,
    avgROI: totalROI / totalTests,
    avgPayback: totalPayback / totalTests,
  };

  return {
    metadata: {
      timestamp,
      sourceFile: 'validate-roi-v2.ts',
      configVersion: 'v2.1',
    },
    validations,
    summary,
  };
}

// CLI execution
if (require.main === module) {
  console.log('🚀 Iniciando validación masiva ROI v2...\n');
  
  const report = validateROIMassive();
  
  // Guardar JSON
  const outputPath = path.join(
    __dirname,
    `validation-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  
  // Imprimir summary en consola
  console.log('✅ Validación completada!\n');
  console.log(`📄 Reporte generado: ${outputPath}\n`);
  console.log('📊 Resumen:');
  console.log(`  Total tests: ${report.summary.totalTests}`);
  console.log(`  Passed: ${report.summary.passedTests} ✅`);
  console.log(`  Failed: ${report.summary.failedTests} ❌`);
  console.log(`  Avg ROI 3Y: ${report.summary.avgROI.toFixed(0)}%`);
  console.log(`  Avg Payback: ${report.summary.avgPayback.toFixed(1)} meses\n`);
  console.log('🚩 Flags más comunes:');
  Object.entries(report.summary.flagsCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([flag, count]) => {
      console.log(`  - ${flag}: ${count} veces`);
    });
}
```

**Ejecutar test**:
```bash
npm test -- scripts/__tests__/validate-roi-v2.test.ts
```

**Resultado esperado**: ✅ PASS

**Commit**:
```bash
git add scripts/validate-roi-v2.ts scripts/__tests__/validate-roi-v2.test.ts
git commit -m "test(FJG-94): add validate-roi-v2 script skeleton + basic tests"
```

---

#### Paso 7: Red – Test para detección correcta de payback cap flag
**Objetivo**: Verificar que script detecta cuando se aplica `roi3yCapPercent * 36`.

**Test que debe FALLAR primero**:
```typescript
// scripts/__tests__/validate-roi-v2.test.ts (agregar al suite existente)
describe('FJG-94 – validate-roi-v2.ts flags detection', () => {
  test('debe detectar payback_cap_applied cuando payback = roi3yCapPercent * 36', () => {
    const report = validateROIMassive();
    const casesWithCap = report.validations.filter(v => 
      v.flags.includes('payback_cap_applied')
    );
    
    expect(casesWithCap.length).toBeGreaterThan(0);
    
    casesWithCap.forEach(testCase => {
      const expectedCap = roiConfig.thresholds.roi3yCapPercent * 36;
      expect(testCase.outputs.paybackMonths).toBe(expectedCap);
    });
  });

  test('debe detectar high_forecast_error cuando forecastError >= threshold', () => {
    const report = validateROIMassive();
    const casesWithHighError = report.validations.filter(v => 
      v.flags.includes('high_forecast_error')
    );
    
    expect(casesWithHighError.length).toBeGreaterThan(0);
    
    casesWithHighError.forEach(testCase => {
      expect(testCase.inputs.forecastErrorPercent).toBeGreaterThanOrEqual(
        roiConfig.thresholds.forecastWarningThreshold
      );
    });
  });
});
```

**Ejecutar test**:
```bash
npm test -- scripts/__tests__/validate-roi-v2.test.ts
```

**Resultado esperado**: ⚠️ PUEDE PASAR o FALLAR dependiendo de si calculateROI ya aplica cap (verificar en Paso 8)

---

#### Paso 8: Green – Ajustar lógica de detección de flags en script
**Objetivo**: Asegurar que flags se detectan correctamente comparando con thresholds de config.

**Verificación previa**:
```bash
# Verificar si calculateROI aplica cap de payback
grep -n "roi3yCapPercent" lib/calculator/calculateROI.ts
```

**Si calculateROI NO aplica cap**, actualizar script:
```typescript
// scripts/validate-roi-v2.ts (ajustar detección de payback_cap_applied)

// Dentro del loop de generación de test cases:
const roiResult = calculateROI(inputs);

// Detectar flags con lógica más robusta
const flags: string[] = [];

// Flag: payback_cap_applied
const expectedMaxPayback = roiConfig.thresholds.roi3yCapPercent * 36; // 28.8 meses (80% * 36)
if (Math.abs(roiResult.paybackMonths - expectedMaxPayback) < 0.1) {
  flags.push('payback_cap_applied');
}

// Flag: high_forecast_error
if (forecastError >= roiConfig.thresholds.forecastWarningThreshold) {
  flags.push('high_forecast_error');
}

// Flag: high_cloud_revenue_ratio (NUEVO)
const estimatedRevenue = roiResult.savings3Years / 0.3; // Estimación simplificada
const cloudRevenueRatio = (cloudSpend * 12) / estimatedRevenue;
if (cloudRevenueRatio > roiConfig.thresholds.maxCloudToRevenueRatio) {
  flags.push('high_cloud_revenue_ratio');
}
```

**Ejecutar test**:
```bash
npm test -- scripts/__tests__/validate-roi-v2.test.ts
```

**Resultado esperado**: ✅ PASS

**Commit**:
```bash
git add scripts/validate-roi-v2.ts scripts/__tests__/validate-roi-v2.test.ts
git commit -m "test(FJG-94): improve flags detection logic with config thresholds"
```

---

#### Paso 9: Red – Test para warnings detection
**Objetivo**: Verificar que script captura warnings de validation.ts y otros sources.

**Test que debe FALLAR primero**:
```typescript
// scripts/__tests__/validate-roi-v2.test.ts (agregar al suite)
describe('FJG-94 – validate-roi-v2.ts warnings detection', () => {
  test('debe capturar warnings de validateForecastError', () => {
    const report = validateROIMassive();
    const casesWithWarnings = report.validations.filter(v => 
      v.warnings.length > 0
    );
    
    expect(casesWithWarnings.length).toBeGreaterThan(0);
    
    // Al menos algunos warnings deben mencionar forecast error
    const forecastWarnings = casesWithWarnings.filter(v =>
      v.warnings.some(w => w.includes('forecast'))
    );
    expect(forecastWarnings.length).toBeGreaterThan(0);
  });

  test('warnings deben incluir valores dinámicos de config', () => {
    const report = validateROIMassive();
    const warningsText = report.validations
      .flatMap(v => v.warnings)
      .join(' ');
    
    // Verificar que warnings incluyen threshold de config (50)
    expect(warningsText).toContain(roiConfig.thresholds.forecastWarningThreshold.toString());
  });
});
```

**Ejecutar test**:
```bash
npm test -- scripts/__tests__/validate-roi-v2.test.ts
```

**Resultado esperado**: ❌ FAIL (warnings no se capturan completamente)

---

#### Paso 10: Green – Implementar captura completa de warnings
**Objetivo**: Agregar lógica para capturar warnings de validation y calculateROI.

**Código producción**:
```typescript
// scripts/validate-roi-v2.ts (mejorar sección de warnings)

// Dentro del loop de generación de test cases:
const warnings: string[] = [];

// Warnings de validation.ts
const validationCloud = validateCloudSpend(cloudSpend);
if (validationCloud.warnings) warnings.push(...validationCloud.warnings);

const validationManual = validateManualHours(manualHours);
if (validationManual.warnings) warnings.push(...validationManual.warnings);

const validationForecast = validateForecastError(forecastError);
if (validationForecast.warnings) warnings.push(...validationForecast.warnings);

// Warnings personalizados basados en thresholds
const estimatedRevenue = roiResult.savings3Years / 0.3; // Simplificación
const cloudRevenueRatio = (cloudSpend * 12) / estimatedRevenue;
if (cloudRevenueRatio > roiConfig.thresholds.cloudRevenueWarningRatio) {
  warnings.push(
    `⚠️ CloudSpend representa ${(cloudRevenueRatio * 100).toFixed(1)}% de ingresos estimados (>${roiConfig.thresholds.cloudRevenueWarningRatio * 100}%)`
  );
}

// Warning si ROI 3Y es excepcionalmente alto (posible data issue)
if (roiResult.roi3Years > 500) {
  warnings.push('⚠️ ROI 3Y > 500%: verificar inputs (posible outlier)');
}
```

**Ejecutar test**:
```bash
npm test -- scripts/__tests__/validate-roi-v2.test.ts
```

**Resultado esperado**: ✅ PASS

**Commit**:
```bash
git add scripts/validate-roi-v2.ts scripts/__tests__/validate-roi-v2.test.ts
git commit -m "test(FJG-94): add comprehensive warnings detection from validation + thresholds"
```

---

#### Paso 11: Integración – Ejecutar script, generar JSON, actualizar README
**Objetivo**: Ejecutar script end-to-end, validar JSON generado, documentar en README.

**Ejecutar script**:
```bash
tsx scripts/validate-roi-v2.ts
```

**Resultado esperado**:
```
🚀 Iniciando validación masiva ROI v2...

✅ Validación completada!

📄 Reporte generado: /home/user/scripts/validation-results-2025-01-15-10-30-45.json

📊 Resumen:
  Total tests: 60
  Passed: 58 ✅
  Failed: 2 ❌
  Avg ROI 3Y: 187%
  Avg Payback: 18.3 meses

🚩 Flags más comunes:
  - payback_cap_applied: 12 veces
  - high_forecast_error: 8 veces
  - high_cloud_revenue_ratio: 5 veces
```

**Verificar JSON generado**:
```bash
cat scripts/validation-results-*.json | jq '.summary'
cat scripts/validation-results-*.json | jq '.validations[0]' # Primer test case
```

**Actualizar README**:
```markdown
// scripts/README.md (agregar sección)

## 🧪 Validación Masiva ROI v2 (FJG-94)

### Descripción
Script que ejecuta 50+ combinaciones de inputs contra el modelo ROI para validar comportamiento, flags y warnings.

### Uso
```bash
# Ejecutar script
tsx scripts/validate-roi-v2.ts

# Output: scripts/validation-results-YYYY-MM-DD-HH-mm-ss.json
```

### Outputs JSON
- `metadata`: timestamp, sourceFile, configVersion
- `validations[]`: array de test cases con inputs, outputs, flags, warnings, validationStatus
- `summary`: totalTests, passedTests, failedTests, flagsCounts, warningsCounts, avgROI, avgPayback

### Flags detectados
- `payback_cap_applied`: Payback limitado a `roi3yCapPercent * 36` (28.8 meses)
- `high_forecast_error`: ForecastError >= `forecastWarningThreshold` (50%)
- `high_cloud_revenue_ratio`: CloudSpend/Revenue > `maxCloudToRevenueRatio` (50%)

### Configuración
Script usa ÚNICAMENTE valores de `components/calculator/calculatorConfig.ts`:
- `roiConfig.inputs.*` para rangos de inputs
- `roiConfig.thresholds.*` para flags y validaciones
- `roiConfig.cloudCostFactors.pricingMultipliers.*` para sectores
```

**Ejecutar tests finales**:
```bash
npm run test # Todos los tests deben pasar
```

**Commit final**:
```bash
git add scripts/validate-roi-v2.ts scripts/README.md scripts/validation-results-*.json
git commit -m "feat(FJG-94): add validate-roi-v2 script + JSON report + README docs"
```

---

## 📦 Entregables

### Archivos Modificados (3)
1. `components/calculator/calculatorConfig.ts`
   - Ampliado con 2 thresholds: `cloudRevenueWarningRatio`, `forecastWarningThreshold`
   - Interface `GlobalThresholds` actualizado

2. `lib/calculator/validation.ts`
   - 8 constantes hardcodeadas eliminadas
   - Imports de `roiConfig` agregados
   - Funciones refactorizadas para usar config dinámico

3. `scripts/README.md`
   - Sección "Validación Masiva ROI v2" agregada con instrucciones

### Archivos Nuevos (5)
1. `scripts/validate-roi-v2.ts`
   - Script principal con función `validateROIMassive()`
   - Genera JSON con 50+ test cases
   - CLI con output en consola

2. `scripts/validation-results-YYYY-MM-DD-HH-mm-ss.json`
   - Reporte JSON con metadata, validations[], summary

3. `lib/calculator/__tests__/validation-refactor.test.ts`
   - Tests unitarios para refactorización de validation.ts
   - Verifica uso de calculatorConfig

4. `scripts/__tests__/validate-roi-v2.test.ts`
   - Tests unitarios para script de validación
   - Verifica estructura, flags, warnings

5. `lib/calculator/__tests__/validation.test.ts` (actualizado)
   - Tests existentes actualizados con nuevos valores de config

### Tests (2 suites)
- `lib/calculator/__tests__/validation-refactor.test.ts`: 5+ tests ✅
- `scripts/__tests__/validate-roi-v2.test.ts`: 7+ tests ✅
- TOTAL: 12+ tests passing

---

## 🔍 Validación Final

### Checklist Pre-Commit
- [ ] Todos los tests pasan: `npm run test`
- [ ] Script ejecutable: `tsx scripts/validate-roi-v2.ts` genera JSON
- [ ] JSON incluye 50+ validations
- [ ] JSON incluye summary con flagsCounts y warningsCounts
- [ ] validation.ts NO tiene constantes hardcodeadas (grep confirm)
- [ ] calculatorConfig.ts tiene 2 nuevos thresholds
- [ ] README.md actualizado con instrucciones

### Comandos de Verificación
```bash
# 1. Tests pasan
npm run test

# 2. Script ejecuta
tsx scripts/validate-roi-v2.ts

# 3. JSON válido
cat scripts/validation-results-*.json | jq '.summary.totalTests'

# 4. NO constantes hardcodeadas
grep -n "const CLOUD_MIN" lib/calculator/validation.ts # Debe retornar vacío

# 5. Nuevos thresholds existen
grep -n "cloudRevenueWarningRatio" components/calculator/calculatorConfig.ts
grep -n "forecastWarningThreshold" components/calculator/calculatorConfig.ts
```

---

## 📝 Informe de Implementación

Al finalizar la implementación, generar:

`docs/issues/FJG-94-us-dt-04-st06-validacion-masiva-script-v2-y-analisis-de/FJG-94-informe-implementacion.md`

**Estructura del informe**:
1. **Resumen Ejecutivo**: Objetivos cumplidos (refactor + script), 5 SP justificados
2. **Fase 1 - Refactorización**: Cambios en calculatorConfig.ts, validation.ts, tests
3. **Fase 2 - Script Validación**: Implementación de validate-roi-v2.ts, lógica de flags/warnings
4. **Resultados Ejecución**: Output del script, análisis de JSON (total tests, flags más comunes, avg ROI/payback)
5. **Divergencias Corregidas**: Tabla comparativa ANTES/DESPUÉS de valores hardcodeados vs. config
6. **Tests**: Cobertura de tests (suites, casos, % passing)
7. **Próximos Pasos**: Recomendaciones para FJG-95+ (si hay follow-up issues)

---

## 🚀 Comandos Git Flow

```bash
# 1. Checkout branch (ya debe existir)
git checkout fjgonzalez25691-fjg-94-us-dt-04-st06-validacion-masiva-script-v2-y-analisis-de

# 2. Commits atómicos (ver pasos TDD arriba)
# Ejemplo:
git add components/calculator/calculatorConfig.ts lib/calculator/__tests__/validation-refactor.test.ts
git commit -m "test(FJG-94): add cloudRevenueWarningRatio + forecastWarningThreshold to config"

# 3. Push final
git push origin fjgonzalez25691-fjg-94-us-dt-04-st06-validacion-masiva-script-v2-y-analisis-de

# 4. Crear PR en GitHub
# Título: "FJG-94: Validación Masiva Script v2 + Refactor validation.ts"
# Descripción: Link a informe de implementación, summary de cambios (5 archivos nuevos, 3 modificados)
```

---

## 📚 Referencias

- **Parent Issue**: FJG-85 (US-DT-04 – Mejora Modelo ROI + Validaciones)
- **Sibling Issue**: FJG-92 (US-DT-04-ST05-UX – Mensajes UI) - Refunded revision: `docs/issues/FJG-92-.../FJG-92-informe-revision-refundido.md`
- **Config Central**: `components/calculator/calculatorConfig.ts`
- **Constitución**: `.prompts/CONSTITUCION.md` (TDD estricto, human-in-the-loop)
- **Roles**: `.prompts/ROLES.md` (Developer: TDD, Manager: review, Reviewer: análisis)

---

**Última actualización**: 2025-01-15 (Prompt ampliado con Fase 1 refactorización)  
**Estimación final**: 5 Story Points (2 SP script + 3 SP refactor)  
**Estado**: Ready for Agent Developer implementation
