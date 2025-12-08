# FJG-97: Prompt de Implementación – Validación masiva aleatoria de ROI

## Contexto del Proyecto
- **Identificador Linear**: FJG-97
- **Título**: US-DT-04-TEST-RANDOM – Validación masiva aleatoria de ROI
- **Rama Git**: `fjgonzalez25691-fjg-97-us-dt-04-test-random-validacion-masiva-aleatoria-de-roi`
- **Sprint**: Sprint 3 - Lead Magnet ROI (Días 15-21)

## Objetivo de la Tarea
Crear un script que genere al menos 10,000 escenarios aleatorios de la calculadora ROI dentro de límites razonables, ejecute el cálculo SIN activar fallback (siempre devuelve valores numéricos), y exporte los resultados completos en formato CSV/JSON para análisis estadístico posterior por Fran.

**Propósito**: Generar un histórico de resultados de la calculadora sin fallback para análisis exploratorio, identificando donde la fórmula produce valores fuera de rango y permitiendo ajustes de parámetros en futuras iteraciones.

## Especificaciones Linear (Fuente de Verdad)

### Descripción
Como Fran, quiero generar un conjunto amplio de escenarios aleatorios dentro de límites razonables para crear un histórico de resultados de la calculadora sin aplicar fallback y así analizar donde la fórmula produce valores fuera de rango y ajustar parámetros posteriormente.

**Alcance**:
- Crear un script que genere al menos 10,000 escenarios aleatorios variando tamaño de empresa, sector, dolor, gasto cloud, horas manuales, error de forecast e inventario, siempre dentro de límites coherentes
- Ejecutar el cálculo de ROI sin activar fallback, incluso cuando los valores sean extremos
- Exportar los resultados en formato CSV o JSON incluyendo inputs y outputs completos
- Incluir metadatos básicos como fecha de generación y versión de configuración usada

### Criterios de Aceptación (Gherkin)
```gherkin
CA1: Se generan al menos 10,000 escenarios aleatorios válidos
CA2: La salida contiene todos los campos necesarios para análisis estadístico (inputs completos + savings, inversión, payback y ROI3Y)
CA3: El script no aplica fallback; siempre devuelve valores numéricos
CA4: Se genera un archivo CSV o JSON con nombre estándar (roi-random-validation-YYYYMMDD.csv)
CA5: Se documentan en la propia issue las conclusiones del análisis exploratorio realizado externamente por Fran (NO es responsabilidad del Developer ni Reviewer)
```

### Definition of Done (DoD)
```
DoD1: Script creado y funcional dentro del repo
DoD2: Archivo de resultados generado y documentada su ubicación
DoD3: Comentario en la issue con las conclusiones del análisis externo realizado por Fran
DoD4: Validación final por Fran de que el dataset generado es útil para tuning en futuras iteraciones
```

## Análisis Técnico

### Contexto de la Calculadora ROI Actual
La calculadora ROI del proyecto tiene la siguiente estructura:

**Archivos Core**:
- `profesional-web/lib/calculator/calculateROI.ts`: Función principal de cálculo con sistema de fallback
- `profesional-web/lib/calculator/types.ts`: Tipos TypeScript incluyendo `ROICalculationResult`, `ROISuccess`, `ROIFallback`
- `profesional-web/lib/calculator/validation.ts`: Validaciones pre-cálculo (función `shouldCalculateROI()`)
- `profesional-web/lib/calculator/calculatorConfig.ts`: Configuración centralizada (company sizes, pain points, ROI factors)

**Sistema de Fallback Actual**:
Según FJG-85 y FJG-96 (ya implementados), la calculadora tiene 4 razones de fallback:
1. `invalid_inputs`: Inputs fuera de rango
2. `incoherent_scenario`: Inconsistencias cloud/revenue, forecast extremos
3. `out_of_range`: Valores intermedios no realistas
4. `extreme_roi`: ROI >90% o payback <3 meses

**Scripts Existentes de Validación**:
- `profesional-web/scripts/validate-roi-v2.ts`: Script de validación masiva que genera combinaciones exhaustivas y aplica validaciones con fallback

### Diferencias Clave vs Scripts Existentes
El script `validate-roi-v2.ts` genera combinaciones **exhaustivas** y **aplica fallback**. El nuevo script FJG-97 debe:
1. Generar combinaciones **aleatorias** (no exhaustivas)
2. **NO aplicar fallback** (bypass de validaciones pre-cálculo)
3. Generar **10,000+ escenarios** (vs ~pocos cientos en validate-roi-v2)
4. Exportar formato CSV optimizado para análisis estadístico externo

### Estrategia de Implementación

#### Opción 1: Script TypeScript independiente (RECOMENDADO)
Crear `profesional-web/scripts/generate-random-roi-scenarios.ts` que:
- Genera inputs aleatorios dentro de límites razonables
- Llama directamente a la lógica de cálculo BYPASSEANDO validaciones pre-cálculo
- Exporta CSV con todas las columnas necesarias

**Ventajas**:
- Reutiliza infraestructura de scripts existentes (register-ts.js)
- Puede importar directamente funciones de cálculo desde `calculateROI.ts`
- Formato CSV nativo más rápido para análisis masivo

**Desventajas**:
- Requiere entender el flujo interno de `calculateROI.ts` para bypass de fallback

#### Opción 2: Modificar calculateROI.ts con flag bypass
Añadir parámetro opcional `bypassFallback?: boolean` a la función principal:
```typescript
export function calculateROI(
  input: ROIInput,
  bypassFallback?: boolean
): ROICalculationResult | ROISuccess
```

**Ventajas**:
- Mantenibilidad: cambios futuros en cálculo se reflejan automáticamente
- No duplica lógica de cálculo

**Desventajas**:
- Modifica código de producción para caso de testing
- Aumenta complejidad de firma de función

**DECISIÓN ARQUITECTÓNICA**: Opción 1 (script independiente) siguiendo Navaja de Ockham. Extraer la lógica core de cálculo numérico en función interna si es necesario, pero sin modificar la API pública de `calculateROI.ts` que usa la UI.

## Plan de Implementación TDD

### Fase 1: Análisis de Dependencias (15 min)
**Objetivo**: Entender la estructura actual de `calculateROI.ts` para identificar qué lógica reutilizar.

**Acciones**:
1. Leer `profesional-web/lib/calculator/calculateROI.ts` completo
2. Leer `profesional-web/lib/calculator/calculatorConfig.ts` completo
3. Leer `profesional-web/lib/calculator/types.ts` para tipos de entrada/salida
4. Identificar la sección de código que realiza el cálculo numérico puro (post-validaciones)

**Entregable**: Comentario en código del nuevo script documentando qué funciones/constantes se reutilizan.

### Fase 2: Diseño de Generación Aleatoria (20 min)
**Objetivo**: Definir rangos razonables para cada parámetro de entrada.

**Parámetros a Variar**:
```typescript
interface RandomScenarioParams {
  companySize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'XLARGE'
  sector: 'RETAIL' | 'INDUSTRIAL' | 'LOGISTICA' | 'OTHER'
  selectedPain: 'cloud_costs' | 'manual_processes' | 'forecasting' | 'inventory'
  
  // Rangos por dolor
  cloudCostEurosMonth?: number      // 5,000 - 50,000 (si cloudCosts seleccionado)
  manualProcessHoursWeek?: number   // 10 - 60 (si manualProcesses seleccionado)
  forecastErrorPercent?: number     // 5 - 50 (si forecasting seleccionado)
  inventoryExcessPercent?: number   // 10 - 60 (si inventory seleccionado)
}
```

**Distribución Aleatoria**:
- `companySize`: 25% cada categoría
- `sector`: 25% cada categoría
- `selectedPain`: 25% cada categoría
- Valores numéricos: distribución uniforme dentro de rango (usar `Math.random()`)

**Coherencia Básica**:
- Si `cloudCosts` seleccionado: solo generar `cloudCostEurosMonth`
- Si `manualProcesses` seleccionado: solo generar `manualProcessHoursWeek`
- Etc. (un dolor a la vez)

**Entregable**: Función `generateRandomScenario(): ROIInput` que retorna un escenario válido.

### Fase 3: Bypass de Fallback (30 min)
**Objetivo**: Ejecutar cálculo ROI sin validaciones pre-cálculo ni post-cálculo.

**Estrategia**:
Dado que `calculateROI.ts` tiene:
```typescript
// Pre-validación
const preValidation = shouldCalculateROI(input);
if (!preValidation.canCalculate) {
  return { type: 'fallback', reason: '...', ... };
}

// Cálculo numérico
const savings = calculateSavings(input);
const investment = calculateInvestment(input);
// ...

// Post-validación
if (roi3Years > 90 || paybackMonths < 3) {
  return { type: 'fallback', reason: 'extreme_roi', ... };
}

return { type: 'success', ... };
```

**Opción A (RECOMENDADA)**: Copiar lógica numérica
Extraer en el nuevo script las fórmulas de cálculo puro (savings, investment, ROI) sin condicionales de fallback:
```typescript
function calculateROINumerically(input: ROIInput): {
  savings: number;
  investment: number;
  paybackMonths: number;
  roi3Years: number;
} {
  // Copiar fórmulas desde calculateROI.ts eliminando checks de fallback
}
```

**Opción B**: Modificar calculateROI.ts
Añadir flag `bypassFallback` (rechazada por modificar producción).

**DECISIÓN**: Opción A. El script de validación aleatoria tendrá su propia implementación numérica simplificada que copia las fórmulas actuales.

**Entregable**: Función `calculateROINumerically(input: ROIInput)` en el nuevo script.

### Fase 4: Generación Masiva y Exportación CSV (30 min)
**Objetivo**: Generar 10,000 escenarios y exportar CSV.

**Estructura del Script Principal**:
```typescript
// profesional-web/scripts/generate-random-roi-scenarios.ts

import fs from 'fs';
import path from 'path';
import { ROIInput } from '../lib/calculator/types';

const NUM_SCENARIOS = 10000;
const OUTPUT_DIR = path.join(__dirname, '../validation-results');
const DATE_STAMP = new Date().toISOString().split('T')[0].replace(/-/g, '');

function main() {
  console.log(`Generating ${NUM_SCENARIOS} random ROI scenarios...`);
  
  const results: Array<{
    scenario_id: number;
    company_size: string;
    sector: string;
    selected_pain: string;
    cloud_cost_euros_month: number | null;
    manual_process_hours_week: number | null;
    forecast_error_percent: number | null;
    inventory_excess_percent: number | null;
    savings_year1: number;
    savings_year2: number;
    savings_year3: number;
    total_savings_3y: number;
    investment_year0: number;
    payback_months: number;
    roi_3_years: number;
    generated_at: string;
    config_version: string;
  }> = [];

  for (let i = 0; i < NUM_SCENARIOS; i++) {
    const input = generateRandomScenario();
    const output = calculateROINumerically(input);
    
    results.push({
      scenario_id: i + 1,
      company_size: input.companySize,
      sector: input.sector,
      selected_pain: input.selectedPain,
      cloud_cost_euros_month: input.cloudCostEurosMonth ?? null,
      manual_process_hours_week: input.manualProcessHoursWeek ?? null,
      forecast_error_percent: input.forecastErrorPercent ?? null,
      inventory_excess_percent: input.inventoryExcessPercent ?? null,
      savings_year1: output.savings.year1,
      savings_year2: output.savings.year2,
      savings_year3: output.savings.year3,
      total_savings_3y: output.savings.year1 + output.savings.year2 + output.savings.year3,
      investment_year0: output.investment,
      payback_months: output.paybackMonths,
      roi_3_years: output.roi3Years,
      generated_at: new Date().toISOString(),
      config_version: 'v1.0-fjg-97'
    });

    if ((i + 1) % 1000 === 0) {
      console.log(`  Generated ${i + 1}/${NUM_SCENARIOS} scenarios`);
    }
  }

  // Exportar CSV
  const filename = `roi-random-validation-${DATE_STAMP}.csv`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const headers = Object.keys(results[0]).join(',');
  const rows = results.map(r => Object.values(r).map(v => v === null ? '' : v).join(','));
  const csv = [headers, ...rows].join('\n');

  fs.writeFileSync(filepath, csv, 'utf-8');
  
  console.log(`\n✅ Generated ${NUM_SCENARIOS} scenarios`);
  console.log(`📊 Output file: ${filepath}`);
  console.log(`📦 File size: ${(csv.length / 1024 / 1024).toFixed(2)} MB`);
}

main();
```

**Metadatos**:
- `scenario_id`: Número secuencial 1-10000
- `generated_at`: Timestamp ISO completo
- `config_version`: String identificador (ej: "v1.0-fjg-97")

**Ubicación del CSV**:
- Carpeta: `profesional-web/validation-results/`
- Nombre: `roi-random-validation-YYYYMMDD.csv`

**Comando de Ejecución**:
```bash
cd profesional-web
npm run tsx scripts/generate-random-roi-scenarios.ts
```

**Entregable**: Script completo funcional que genera CSV.

### Fase 5: Tests Unitarios (30 min)
**Objetivo**: Probar funciones clave del script.

**Test 1: Generación de Escenarios Aleatorios**
```typescript
// profesional-web/__tests__/scripts/generate-random-roi.test.ts

describe('generateRandomScenario', () => {
  it('genera un escenario válido con todos los campos requeridos', () => {
    const scenario = generateRandomScenario();
    
    expect(scenario.companySize).toMatch(/^(SMALL|MEDIUM|LARGE|XLARGE)$/);
    expect(scenario.sector).toMatch(/^(RETAIL|INDUSTRIAL|LOGISTICA|OTHER)$/);
    expect(scenario.selectedPain).toMatch(/^(cloud_costs|manual_processes|forecasting|inventory)$/);
  });

  it('genera cloudCostEurosMonth solo cuando selectedPain es cloud_costs', () => {
    for (let i = 0; i < 50; i++) {
      const scenario = generateRandomScenario();
      
      if (scenario.selectedPain === 'cloud_costs') {
        expect(scenario.cloudCostEurosMonth).toBeGreaterThanOrEqual(5000);
        expect(scenario.cloudCostEurosMonth).toBeLessThanOrEqual(50000);
        expect(scenario.manualProcessHoursWeek).toBeUndefined();
      } else if (scenario.selectedPain === 'manual_processes') {
        expect(scenario.manualProcessHoursWeek).toBeGreaterThanOrEqual(10);
        expect(scenario.manualProcessHoursWeek).toBeLessThanOrEqual(60);
        expect(scenario.cloudCostEurosMonth).toBeUndefined();
      }
      // Similar para forecasting e inventory
    }
  });
});
```

**Test 2: Cálculo Numérico (Sanity Check)**
```typescript
describe('calculateROINumerically', () => {
  it('calcula ROI positivo para escenario favorable', () => {
    const input: ROIInput = {
      companySize: 'LARGE',
      sector: 'RETAIL',
      selectedPain: 'manual_processes',
      manualProcessHoursWeek: 40
    };

    const result = calculateROINumerically(input);

    expect(result.savings).toBeGreaterThan(0);
    expect(result.investment).toBeGreaterThan(0);
    expect(result.roi3Years).toBeGreaterThan(-100); // Puede ser negativo, pero razonable
    expect(result.paybackMonths).toBeGreaterThan(0);
  });

  it('devuelve valores numéricos incluso para escenario extremo', () => {
    const input: ROIInput = {
      companySize: 'SMALL',
      sector: 'OTHER',
      selectedPain: 'cloud_costs',
      cloudCostEurosMonth: 5000 // Mínimo posible
    };

    const result = calculateROINumerically(input);

    expect(typeof result.savings).toBe('number');
    expect(typeof result.investment).toBe('number');
    expect(typeof result.roi3Years).toBe('number');
    expect(typeof result.paybackMonths).toBe('number');
    expect(isNaN(result.roi3Years)).toBe(false);
  });
});
```

**Test 3: Verificación de No-Fallback**
```typescript
describe('Script de validación aleatoria', () => {
  it('NO lanza excepciones para 100 escenarios aleatorios consecutivos', () => {
    expect(() => {
      for (let i = 0; i < 100; i++) {
        const input = generateRandomScenario();
        const result = calculateROINumerically(input);
        
        // Verificar que siempre retorna valores numéricos
        expect(typeof result.roi3Years).toBe('number');
        expect(isNaN(result.roi3Years)).toBe(false);
      }
    }).not.toThrow();
  });
});
```

**Comando de Tests**:
```bash
npm test -- __tests__/scripts/generate-random-roi.test.ts
```

### Fase 6: Documentación (15 min)
**Objetivo**: Documentar ubicación del archivo y cómo usar el script.

**Archivo README del Script**:
Crear `profesional-web/scripts/README-generate-random-roi.md`:
```markdown
# Script de Validación Aleatoria ROI (FJG-97)

## Propósito
Generar 10,000+ escenarios aleatorios de la calculadora ROI sin aplicar fallback para análisis estadístico posterior.

## Uso
\`\`\`bash
cd profesional-web
npm run tsx scripts/generate-random-roi-scenarios.ts
\`\`\`

## Output
- **Ubicación**: `profesional-web/validation-results/roi-random-validation-YYYYMMDD.csv`
- **Formato**: CSV con headers
- **Columnas**: 
  - Inputs: company_size, sector, selected_pain, cloud_cost_euros_month, manual_process_hours_week, forecast_error_percent, inventory_excess_percent
  - Outputs: savings_year1/2/3, total_savings_3y, investment_year0, payback_months, roi_3_years
  - Metadatos: scenario_id, generated_at, config_version

## Análisis Posterior
El análisis estadístico del CSV se realiza externamente (Python/R/Excel) por Fran. Resultados se documentan en Linear issue FJG-97.
```

**Actualización package.json**:
Añadir script npm:
```json
{
  "scripts": {
    "generate-roi-random": "tsx scripts/generate-random-roi-scenarios.ts"
  }
}
```

### Fase 7: Ejecución y Generación del Dataset (10 min)
**Objetivo**: Ejecutar el script y verificar que genera el CSV correctamente.

**Acciones**:
1. Ejecutar `npm run generate-roi-random`
2. Verificar que se crea `profesional-web/validation-results/roi-random-validation-YYYYMMDD.csv`
3. Verificar tamaño del archivo (aprox 1-2 MB)
4. Abrir CSV y verificar primeras/últimas filas

**Validaciones**:
- Exactamente 10,000 filas de datos + 1 header
- Todas las columnas presentes
- Sin valores `NaN` o `undefined` en columnas numéricas
- `scenario_id` secuencial 1-10000

## Informe de Implementación

Al finalizar, generar `FJG-97-informe-implementacion.md` con:

### Sección 1: Resumen Ejecutivo
- Número de escenarios generados
- Tamaño del archivo CSV
- Ubicación exacta del archivo
- Tiempo de ejecución del script

### Sección 2: Decisiones Técnicas
- Por qué se eligió script independiente vs modificar calculateROI.ts
- Cómo se garantiza no aplicar fallback
- Rangos elegidos para cada parámetro aleatorio

### Sección 3: Resultados de Tests
- Output de `npm test -- __tests__/scripts/generate-random-roi.test.ts`
- Confirmación de 100% tests passing

### Sección 4: Verificación de Criterios de Aceptación
```markdown
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| CA1: ≥10,000 escenarios | ✅ | CSV tiene 10,000 filas |
| CA2: Todos los campos para análisis | ✅ | 16 columnas incluyendo inputs/outputs completos |
| CA3: Sin fallback | ✅ | Script bypasea validaciones, siempre retorna numéricos |
| CA4: CSV con nombre estándar | ✅ | `roi-random-validation-20251208.csv` |
| CA5: Análisis externo por Fran | ⏳ | Pendiente (no es responsabilidad del Developer) |
```

### Sección 5: Verificación de Definition of Done
```markdown
| DoD | Estado | Evidencia |
|-----|--------|-----------|
| DoD1: Script funcional en repo | ✅ | `scripts/generate-random-roi-scenarios.ts` creado |
| DoD2: Archivo generado y documentado | ✅ | CSV en `validation-results/`, README creado |
| DoD3: Comentario con análisis Fran | ⏳ | Pendiente (no es responsabilidad del Developer) |
| DoD4: Validación Fran de utilidad | ⏳ | Pendiente (no es responsabilidad del Developer) |
```

## Restricciones y Consideraciones

### NO HACER (Prohibido)
- ❌ Modificar `profesional-web/lib/calculator/calculateROI.ts` (código de producción)
- ❌ Modificar sistema de fallback existente (FJG-85/FJG-96)
- ❌ Realizar el análisis estadístico del CSV (es responsabilidad de Fran)
- ❌ Documentar conclusiones del análisis en el informe de implementación (CA5/DoD3 son externos)
- ❌ Crear nuevos tipos en `types.ts` para este script (usar tipos existentes o definir localmente)

### Reutilizar (Obligatorio)
- ✅ Tipos existentes: `ROIInput`, `CompanySize`, `Sector`, `PainPoint` desde `types.ts`
- ✅ Constantes: `companySizes`, `sectors` desde `calculatorConfig.ts`
- ✅ Infraestructura: `scripts/register-ts.js` para ejecución TypeScript

### Navaja de Ockham
- Script autocontenido en un solo archivo
- Sin dependencias externas adicionales (solo fs, path de Node.js)
- Sin UI ni servidor (puramente CLI)
- CSV plano (sin librerías de parsing complejas)

### Performance Esperado
- 10,000 cálculos: <10 segundos en máquina moderna
- Tamaño CSV: ~1-2 MB (asumiendo ~200 bytes/fila)
- Memoria: <100 MB (array de 10,000 objetos)

## Comandos Clave

```bash
# Ejecutar script
npm run generate-roi-random

# Ejecutar tests
npm test -- __tests__/scripts/generate-random-roi.test.ts

# Ver archivo generado
cat profesional-web/validation-results/roi-random-validation-*.csv | head -20
```

## Entregables Finales

1. ✅ `profesional-web/scripts/generate-random-roi-scenarios.ts` - Script principal
2. ✅ `profesional-web/scripts/README-generate-random-roi.md` - Documentación del script
3. ✅ `profesional-web/__tests__/scripts/generate-random-roi.test.ts` - Tests unitarios
4. ✅ `profesional-web/validation-results/roi-random-validation-YYYYMMDD.csv` - Dataset generado
5. ✅ `docs/issues/FJG-97-.../FJG-97-informe-implementacion.md` - Informe completo

---

**Developer**: Recuerda que CA5 y DoD3/DoD4 son responsabilidad de Fran (análisis externo). Tu trabajo termina cuando el CSV está generado y documentado correctamente.
