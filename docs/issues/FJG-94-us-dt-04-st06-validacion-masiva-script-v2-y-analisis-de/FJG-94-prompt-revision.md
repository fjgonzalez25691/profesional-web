# 🔍 FJG-94 – Prompt de Revisión – Validación Masiva Script v2 + Refactorización validation.ts

**Issue ID Linear**: FJG-94  
**Parent Issue**: FJG-85 (US-DT-04 – Mejora Modelo ROI + Validaciones)  
**Estimación**: 5 Story Points  
**Rol**: Agent Reviewer (Análisis exhaustivo)  

---

## 🎯 Objetivo de la Revisión

Verificar que la implementación de **FJG-94** cumple con:
1. **Fase 1**: Refactorización completa de `validation.ts` para eliminar constantes hardcodeadas y usar `calculatorConfig.ts`
2. **Fase 2**: Script de validación masiva funcional que genera reportes JSON con 50+ test cases
3. **Integración**: Ambas fases trabajan cohesivamente usando config centralizado
4. **Calidad**: TDD estricto, tests passing, código limpio

---

## ✅ Checklist de Revisión – FASE 1: Refactorización

### 1.1 calculatorConfig.ts – Nuevos Thresholds

**Archivos a revisar**:
- `components/calculator/calculatorConfig.ts`

**Verificaciones**:
- [ ] Interface `GlobalThresholds` incluye 2 nuevos campos:
  - `cloudRevenueWarningRatio: number`
  - `forecastWarningThreshold: number`
- [ ] Objeto `roiConfig.thresholds` define valores concretos:
  - `cloudRevenueWarningRatio: 0.2` (o valor justificado)
  - `forecastWarningThreshold: 50` (o valor justificado)
- [ ] Tipos exportados correctamente
- [ ] NO hay breaking changes en interfaces existentes

**Comandos de verificación**:
```bash
grep -A 5 "interface GlobalThresholds" components/calculator/calculatorConfig.ts
grep -A 8 "thresholds:" components/calculator/calculatorConfig.ts | grep -E "(cloudRevenueWarningRatio|forecastWarningThreshold)"
```

**Criterio de aceptación**: Ambos thresholds definidos y accesibles vía `roiConfig.thresholds.*`

---

### 1.2 validation.ts – Eliminación Constantes Hardcodeadas

**Archivos a revisar**:
- `lib/calculator/validation.ts`

**Verificaciones**:
- [ ] NO existe ninguna de estas 8 constantes:
  - `const CLOUD_MIN`
  - `const CLOUD_MAX`
  - `const MANUAL_MIN`
  - `const MANUAL_MAX`
  - `const FORECAST_MIN`
  - `const FORECAST_MAX`
  - `const CLOUD_REVENUE_WARNING_RATIO`
  - `const FORECAST_WARNING_THRESHOLD`
- [ ] Import de `roiConfig` presente: `import { roiConfig } from '@/components/calculator/calculatorConfig'`
- [ ] Funciones de validación usan valores dinámicos:
  - `validateCloudSpend()` → `roiConfig.inputs.cloudSpendMonthly.min/max`
  - `validateManualHours()` → `roiConfig.inputs.manualHoursWeekly.min/max`
  - `validateForecastError()` → `roiConfig.inputs.forecastErrorPercent.min/max`
  - Warnings usan → `roiConfig.thresholds.cloudRevenueWarningRatio` y `roiConfig.thresholds.forecastWarningThreshold`
- [ ] Mensajes de error incluyen valores dinámicos (template literals con variables de config)

**Comandos de verificación**:
```bash
# Verificar ausencia de constantes hardcodeadas
grep -E "const (CLOUD|MANUAL|FORECAST)_(MIN|MAX|WARNING|THRESHOLD)" lib/calculator/validation.ts
# Resultado esperado: VACÍO

# Verificar import de roiConfig
grep "import.*roiConfig" lib/calculator/validation.ts

# Verificar uso en funciones
grep -A 5 "validateCloudSpend" lib/calculator/validation.ts | grep "roiConfig"
grep -A 5 "validateManualHours" lib/calculator/validation.ts | grep "roiConfig"
grep -A 5 "validateForecastError" lib/calculator/validation.ts | grep "roiConfig"
```

**Criterio de aceptación**: 0 constantes hardcodeadas, todos los valores vienen de `calculatorConfig.ts`

---

### 1.3 Tests de Refactorización

**Archivos a revisar**:
- `lib/calculator/__tests__/validation-refactor.test.ts` (nuevo)
- `lib/calculator/__tests__/validation.test.ts` (actualizado)

**Verificaciones validation-refactor.test.ts**:
- [ ] Suite describe "FJG-94 – calculatorConfig.ts debe incluir thresholds de validación"
  - Test: verifica `cloudRevenueWarningRatio` definido
  - Test: verifica `forecastWarningThreshold` definido
- [ ] Suite describe "FJG-94 – validation.ts debe usar calculatorConfig"
  - Test: verifica ausencia de constantes hardcodeadas (fs.readFileSync check)
  - Test: `validateCloudSpend()` usa `roiConfig.inputs.cloudSpendMonthly`
  - Test: `validateManualHours()` usa `roiConfig.inputs.manualHoursWeekly`
  - Test: `validateForecastError()` usa `roiConfig.inputs.forecastErrorPercent`
  - Test: warnings usan thresholds de config
- [ ] Todos los tests pasan: `npm test -- lib/calculator/__tests__/validation-refactor.test.ts`

**Verificaciones validation.test.ts**:
- [ ] Tests existentes actualizados para reflejar nuevos valores de config:
  - Valores mínimos/máximos actualizados (ej. CLOUD_MIN: 100 → 500)
  - Expects ajustados a rangos de `calculatorConfig.ts`
- [ ] Todos los tests pasan: `npm test -- lib/calculator/__tests__/validation.test.ts`

**Comandos de verificación**:
```bash
npm test -- lib/calculator/__tests__/validation-refactor.test.ts
npm test -- lib/calculator/__tests__/validation.test.ts
```

**Criterio de aceptación**: Ambos test suites pasan (✅ PASS)

---

## ✅ Checklist de Revisión – FASE 2: Script Validación Masiva

### 2.1 Estructura del Script validate-roi-v2.ts

**Archivos a revisar**:
- `scripts/validate-roi-v2.ts`

**Verificaciones**:
- [ ] Imports correctos:
  - `roiConfig` desde `@/components/calculator/calculatorConfig`
  - `calculateROI` desde `@/lib/calculator/calculateROI`
  - `validateCloudSpend, validateManualHours, validateForecastError` desde `@/lib/calculator/validation`
  - `fs`, `path` (node modules)
- [ ] Interfaces TypeScript definidas:
  - `ValidationTestCase` (inputs, outputs, flags, warnings, validationStatus)
  - `ValidationSummary` (totalTests, passedTests, failedTests, flagsCounts, warningsCounts, avgROI, avgPayback)
  - `ValidationReport` (metadata, validations[], summary)
- [ ] Función principal exportada: `export function validateROIMassive(): ValidationReport`
- [ ] CLI execution block: `if (require.main === module)`

**Comandos de verificación**:
```bash
grep "export function validateROIMassive" scripts/validate-roi-v2.ts
grep "export interface ValidationReport" scripts/validate-roi-v2.ts
```

**Criterio de aceptación**: Estructura TypeScript completa y exportable

---

### 2.2 Uso Exclusivo de calculatorConfig.ts

**Verificaciones**:
- [ ] Rangos de inputs usan `roiConfig.inputs.*`:
  - `roiConfig.inputs.cloudSpendMonthly.min/max`
  - `roiConfig.inputs.manualHoursWeekly.min/max`
  - `roiConfig.inputs.forecastErrorPercent.min/max`
- [ ] Thresholds de flags usan `roiConfig.thresholds.*`:
  - `roiConfig.thresholds.roi3yCapPercent` (payback cap)
  - `roiConfig.thresholds.minPaybackMonths`
  - `roiConfig.thresholds.maxCloudToRevenueRatio`
  - `roiConfig.thresholds.forecastWarningThreshold`
  - `roiConfig.thresholds.cloudRevenueWarningRatio`
- [ ] NO hay valores numéricos hardcodeados (excepto estructura de arrays/loops)
- [ ] Sectores y companySizes usan tipos de `calculatorConfig.ts`

**Comandos de verificación**:
```bash
# Verificar uso de roiConfig
grep -c "roiConfig\." scripts/validate-roi-v2.ts
# Resultado esperado: >= 10 ocurrencias

# Verificar ausencia de magic numbers críticos
grep -E "(500|100000|5|200|60|0\.8|0\.5|0\.2|50)" scripts/validate-roi-v2.ts
# Revisar cada match: deben estar en contexto de roiConfig o comments
```

**Criterio de aceptación**: Todos los valores críticos vienen de `calculatorConfig.ts`

---

### 2.3 Generación de Test Cases (≥ 1.000 combinaciones)

**Verificaciones**:
- [ ] Loops anidados generan combinaciones:
  - `companySizes` (3) × `sectors` (5) × variaciones de inputs (4-5 niveles cada uno)
- [ ] Valores de prueba incluyen:
  - Valores mínimos de config
  - Valores medios representativos
  - Valores máximos de config
- [ ] Total test cases >= 1.000 (crítico: CA2 de Linear)
- [ ] Cada test case incluye:
  - `inputs` completo (companySize, sector, cloudSpend, manualHours, forecastError, pains)
  - `outputs` del `calculateROI()`
  - `flags[]` array con escenarios extremos
  - `warnings[]` array
  - `validationStatus` ('PASS' o 'FAIL')

**Comandos de verificación**:
```bash
# Ejecutar script y contar test cases
tsx scripts/validate-roi-v2.ts
cat scripts/validation-results-*.json | jq '.validations | length'
# Resultado esperado: >= 1000
```

**Criterio de aceptación**: JSON generado con ≥ 1.000 test cases válidos

---

### 2.4 Detección de Escenarios Extremos (Flags)

**Verificaciones**:
- [ ] Flag `payback_cap_applied`:
  - Detecta cuando `paybackMonths === roiConfig.thresholds.roi3yCapPercent * 36`
  - Usa comparación con tolerancia (Math.abs < 0.1) si aplica
- [ ] Flag `payback_below_min`:
  - Detecta cuando `paybackMonths < roiConfig.thresholds.minPaybackMonths`
- [ ] Flag `savings_exceed_revenue`:
  - Detecta cuando ahorro anual estimado > facturación estimada de la empresa
- [ ] Flag `savings_exceed_inventory`:
  - Detecta cuando ahorro anual estimado > inventario estimado
- [ ] Flag `high_forecast_error`:
  - Detecta cuando `forecastErrorPercent >= roiConfig.thresholds.forecastWarningThreshold`
- [ ] Flag `high_cloud_revenue_ratio`:
  - Detecta cuando ratio CloudSpend/Revenue > `roiConfig.thresholds.maxCloudToRevenueRatio`
- [ ] Flags correctamente agregados al array `flags[]` de cada test case

**Comandos de verificación**:
```bash
# Verificar flags en JSON generado
cat scripts/validation-results-*.json | jq '.validations[].flags | select(length > 0)' | head -20
cat scripts/validation-results-*.json | jq '.summary.flagsCounts'
# Debe mostrar los 6 tipos de flags mencionados arriba
```

**Criterio de aceptación**: Summary muestra flagsCounts con los 6 tipos de escenarios extremos detectados

---

### 2.5 Captura de Warnings

**Verificaciones**:
- [ ] Warnings de `validation.ts` capturados:
  - `validateCloudSpend()` warnings
  - `validateManualHours()` warnings
  - `validateForecastError()` warnings
- [ ] Warnings personalizados basados en thresholds:
  - CloudSpend/Revenue ratio warning
  - ROI exceptionally high warning (outliers)
- [ ] Warnings incluyen valores dinámicos de config (no hardcodeados)
- [ ] Warnings correctamente agregados al array `warnings[]` de cada test case

**Comandos de verificación**:
```bash
# Verificar warnings en JSON
cat scripts/validation-results-*.json | jq '.validations[].warnings | select(length > 0)' | head -20
cat scripts/validation-results-*.json | jq '.summary.warningsCounts'
```

**Criterio de aceptación**: Summary muestra warningsCounts con varios tipos de warnings

---

### 2.6 JSON Report – Estructura y Metadata

**Verificaciones**:
- [ ] Archivo generado con formato: `validation-results-YYYY-MM-DD-HH-mm-ss.json`
- [ ] JSON válido (parseable con `jq`)
- [ ] Section `metadata`:
  - `timestamp` (ISO 8601 format)
  - `sourceFile` ("validate-roi-v2.ts")
  - `configVersion` (ej. "v2.1")
- [ ] Section `validations[]`:
  - Array con 50+ objetos
  - Cada objeto tiene: inputs, outputs, flags, warnings, validationStatus
- [ ] Section `summary`:
  - `totalTests` (número)
  - `passedTests` (número)
  - `failedTests` (número)
  - `flagsCounts` (objeto con keys = flag names, values = counts)
  - `warningsCounts` (objeto con keys = warning prefixes, values = counts)
  - `avgROI` (número)
  - `avgPayback` (número)

**Comandos de verificación**:
```bash
# Validar estructura JSON
cat scripts/validation-results-*.json | jq '.metadata, .summary, (.validations | length)'

# Verificar campos requeridos
cat scripts/validation-results-*.json | jq '.metadata.timestamp, .summary.totalTests, .summary.flagsCounts'
```

**Criterio de aceptación**: JSON completo y bien estructurado

---

### 2.7 Output en Consola

**Verificaciones**:
- [ ] Script imprime en consola al ejecutar:
  - "🚀 Iniciando validación masiva ROI v2..."
  - "✅ Validación completada!"
  - Ruta del archivo JSON generado
  - "📊 Resumen:" con stats (totalTests, passed, failed, avgROI, avgPayback)
  - "🚩 Flags más comunes:" con top 3 flags y sus counts
- [ ] Output legible y bien formateado

**Comandos de verificación**:
```bash
tsx scripts/validate-roi-v2.ts | tee output.txt
cat output.txt
```

**Criterio de aceptación**: Output informativo y profesional

---

### 2.8 Tests del Script

**Archivos a revisar**:
- `scripts/__tests__/validate-roi-v2.test.ts`

**Verificaciones**:
- [ ] Suite "FJG-94 – validate-roi-v2.ts estructura básica":
  - Test: exporta `validateROIMassive`
  - Test: retorna `ValidationReport` con metadata
  - Test: incluye >= 50 test cases
  - Test: incluye section summary con stats
- [ ] Suite "FJG-94 – validate-roi-v2.ts flags detection":
  - Test: detecta `payback_cap_applied` correctamente
  - Test: detecta `high_forecast_error` correctamente
- [ ] Suite "FJG-94 – validate-roi-v2.ts warnings detection":
  - Test: captura warnings de `validateForecastError`
  - Test: warnings incluyen valores dinámicos de config
- [ ] Todos los tests pasan: `npm test -- scripts/__tests__/validate-roi-v2.test.ts`

**Comandos de verificación**:
```bash
npm test -- scripts/__tests__/validate-roi-v2.test.ts
```

**Criterio de aceptación**: Test suite completo y passing (✅ PASS)

---

## ✅ Checklist de Revisión – INTEGRACIÓN

### 3.1 Coherencia entre Fase 1 y Fase 2

**Verificaciones**:
- [ ] Script usa `validation.ts` refactorizado (no versión antigua)
- [ ] Warnings capturados por script coinciden con warnings de validation.ts
- [ ] Thresholds usados en flags coinciden con los definidos en calculatorConfig.ts
- [ ] NO hay duplicación de lógica de validación (script reutiliza validation.ts)

**Comandos de verificación**:
```bash
# Verificar que script importa validation.ts
grep "from '@/lib/calculator/validation'" scripts/validate-roi-v2.ts

# Verificar que validation.ts está refactorizado
grep "roiConfig" lib/calculator/validation.ts | wc -l
# Resultado esperado: >= 5 ocurrencias
```

**Criterio de aceptación**: Integración limpia sin duplicación ni contradicciones

---

### 3.2 Revisión con Fran (CA5 - CRÍTICO)

### 3.3 Documentación – README.md

**Archivos a revisar**:
- `scripts/README.md`

**Verificaciones**:
- [ ] Sección "🧪 Validación Masiva ROI v2 (FJG-94)" presente
- [ ] Incluye subsecciones:
  - Descripción
  - Uso (comando `tsx scripts/validate-roi-v2.ts`)
  - Outputs JSON (estructura explicada)
  - Escenarios extremos detectados (lista con descripciones de los 6 flags)
  - Configuración (mención a `calculatorConfig.ts`)
  - Nota sobre revisión con Fran (CA5)
- [ ] Instrucciones claras y completas
- [ ] Ejemplos de comandos ejecutables

**Comandos de verificación**:
```bash
grep -A 30 "Validación Masiva ROI v2" scripts/README.md
```

**Criterio de aceptación**: Documentación completa y profesional

---
### 3.4 Tests End-to-End

**Verificaciones**:
- [ ] Todos los test suites pasan:
  - `npm test -- lib/calculator/__tests__/validation-refactor.test.ts` ✅
  - `npm test -- lib/calculator/__tests__/validation.test.ts` ✅
  - `scripts/__tests__/validate-roi-v2.test.ts` ✅
- [ ] Tests E2E de la aplicación pasan: `npm run test` ✅
- [ ] NO hay regresiones en tests existentes

**Comandos de verificación**:
```bash
npm run test
```

**Criterio de aceptación**: 100% tests passing (0 failures)

---

### 3.5 Git – Commits y Branch
**Comandos de verificación**:
```bash
grep -A 20 "Validación Masiva ROI v2" scripts/README.md
```

**Criterio de aceptación**: Documentación completa y profesional

---

### 3.3 Tests End-to-End

**Verificaciones**:
- [ ] Todos los test suites pasan:
  - `npm test -- lib/calculator/__tests__/validation-refactor.test.ts` ✅
  - `npm test -- lib/calculator/__tests__/validation.test.ts` ✅
  - `scripts/__tests__/validate-roi-v2.test.ts` ✅
- [ ] Tests E2E de la aplicación pasan: `npm run test` ✅
- [ ] NO hay regresiones en tests existentes

**Comandos de verificación**:
```bash
npm run test
```

**Criterio de aceptación**: 100% tests passing (0 failures)

---

### 3.4 Git – Commits y Branch

**Métricas a verificar**:
- [ ] Total test cases: >= 1.000 (CRÍTICO: CA2)
- [ ] Pass rate: >= 90% (mayoría debe pasar)
- [ ] Avg ROI 3Y: rango razonable (50% - 300%)
- [ ] Avg Payback: rango razonable (6 - 30 meses)
- [ ] Flags distribution: los 6 tipos de escenarios extremos detectados
- [ ] Warnings distribution: varios tipos de warnings presentes
  - Commit final: `feat(FJG-94): add validate-roi-v2 script + JSON report + README docs`
- [ ] Mensajes de commit siguen Conventional Commits
- [ ] Branch lista para push: `git push origin [branch-name]`

**Comandos de verificación**:
```bash
git log --oneline | head -10
git status
```

**Criterio de aceptación**: Commits limpios y descriptivos, branch ready for PR

---

## 📊 Análisis de Resultados del Script

### 4.1 Validación del JSON Generado

**Ejecutar script y analizar**:
```bash
tsx scripts/validate-roi-v2.ts
cat scripts/validation-results-*.json | jq '.'
```

**Métricas a verificar**:
- [ ] Total test cases: >= 50
- [ ] Pass rate: >= 90% (mayoría debe pasar)
- [ ] Avg ROI 3Y: rango razonable (50% - 300%)
- [ ] Avg Payback: rango razonable (6 - 30 meses)
- [ ] Flags distribution: al menos 2-3 tipos de flags detectados
- [ ] Warnings distribution: varios tipos de warnings presentes

**Análisis de outliers**:
- [ ] Revisar test cases con `validationStatus: 'FAIL'`
  - Razón del fallo debe ser clara
  - Fallo justificado por violación de thresholds
- [ ] Revisar test cases con ROI > 500% (posibles outliers)
  - Warning de "ROI exceptionally high" presente
- [ ] Revisar test cases con payback < minPaybackMonths
  - Flag o validationStatus = FAIL presente

**Criterio de aceptación**: Métricas dentro de rangos esperados, outliers identificados

---

### 4.2 Comparativa: Valores Hardcodeados vs. Config

**Generar tabla comparativa** (para informe):

| Constante Eliminada | Valor Hardcoded (OLD) | Valor Config (NEW) | Divergencia |
|---------------------|----------------------|-------------------|-------------|
| CLOUD_MIN | 100 | 500 | 5x |
| CLOUD_MAX | 500,000 | 100,000 | 5x |
| MANUAL_MIN | 1 | 5 | 5x |
| MANUAL_MAX | 168 | 200 | 1.2x |
| FORECAST_MIN | 1 | 5 | 5x |
| FORECAST_MAX | 100 | 60 | 1.4x |
| CLOUD_REVENUE_WARNING_RATIO | 0.2 | 0.2 (config) | Centralizado |
| FORECAST_WARNING_THRESHOLD | 50 | 50 (config) | Centralizado |

**Verificaciones**:
- [ ] Tabla completa con 8 constantes
- [ ] Divergencias críticas (5x) corregidas
- [ ] Valores ahora centralizados en `calculatorConfig.ts`

**Criterio de aceptación**: Deuda técnica eliminada, única fuente de verdad establecida

---

## 📝 Informe de Implementación

**Archivo a generar**:
- `docs/issues/FJG-94-us-dt-04-st06-validacion-masiva-script-v2-y-analisis-de/FJG-94-informe-implementacion.md`

**Secciones requeridas**:
1. **Resumen Ejecutivo**
   - Objetivos cumplidos (Fase 1 refactor + Fase 2 script)
   - Estimación 5 SP justificada
   - Deuda técnica eliminada

2. **Fase 1 - Refactorización**
   - Cambios en `calculatorConfig.ts` (2 thresholds)
   - Refactor de `validation.ts` (8 constantes eliminadas)
   - Tests de refactorización (resultados)

3. **Fase 2 - Script Validación**
   - Implementación de `validate-roi-v2.ts`
   - Lógica de flags y warnings
   - Estructura del JSON report

4. **Resultados Ejecución**
   - Output del script (consola)
   - Análisis del JSON (total tests, flags, warnings, promedios)
   - Tabla comparativa ANTES/DESPUÉS (divergencias corregidas)

5. **Tests**
   - Cobertura de tests (3 suites, X tests total)
   - Resultados: % passing
   - Regresiones: ninguna

6. **Próximos Pasos**
   - Recomendaciones para issues posteriores
   - Mejoras potenciales (opcional)

**Criterio de aceptación**: Informe completo, profesional, con evidencias (outputs, tablas, stats)

---

## 🚦 Decisión Final de Revisión

### Resultado de la Revisión

**Opciones**:
- [ ] ✅ **APROBADO** – Todos los criterios cumplidos, listo para merge
- [ ] ⚠️ **APROBADO CON OBSERVACIONES** – Cumple requisitos mínimos, pero hay mejoras sugeridas (especificar)
- [ ] ❌ **RECHAZADO** – Criterios críticos no cumplidos, requiere rehacer (especificar qué)

**Comentarios del Reviewer**:
```
[Espacio para comentarios detallados sobre:
- Puntos fuertes de la implementación
- Áreas de mejora identificadas
- Bugs o issues encontrados
- Recomendaciones para futuras issues]
```

**Aprobación final**:
```
Revisado por: [Agent Reviewer]
Fecha: [YYYY-MM-DD]
Estado: [APROBADO / APROBADO CON OBSERVACIONES / RECHAZADO]
```

---

## 📚 Referencias

- **Parent Issue**: FJG-85 (US-DT-04 – Mejora Modelo ROI + Validaciones)
- **Sibling Issue**: FJG-92 (US-DT-04-ST05-UX) – Refunded revision: `FJG-92-informe-revision-refundido.md`
- **Prompt Implementación**: `FJG-94-prompt-implementacion.md`
- **Config Central**: `components/calculator/calculatorConfig.ts`
- **Constitución**: `.prompts/CONSTITUCION.md` (TDD estricto, human-in-the-loop)
- **Roles**: `.prompts/ROLES.md` (Reviewer: análisis exhaustivo sin implementación)

---

**Última actualización**: 2025-01-15 (Prompt revisión ampliado con Fase 1 + Fase 2)  
**Estimación**: 5 Story Points  
**Estado**: Ready for Agent Reviewer analysis
