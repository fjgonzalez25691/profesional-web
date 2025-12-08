# Informe de Implementación – FJG-97

## Resumen
- Script CLI `scripts/generate-random-roi-scenarios.ts` que genera escenarios aleatorios (≥10.000) sin aplicar fallback y exporta CSV con inputs y métricas ROI.
- Se reutiliza `roiConfig` y las fórmulas actuales de cálculo (cloud piecewise, manual, forecast, inventory) sin pasar por validaciones ni caps de fallback.
- Dataset generado con 10.000 filas: `scripts/roi-random-validation-20251208.csv`.

## Detalles clave
- **Bypass fallback**: cálculo numérico directo; no se invoca `shouldCalculateROI` ni las ramas `extreme_roi/invalid_inputs`.
- **Cobertura de inputs**: combinación aleatoria de tamaño, sector y 1-3 pains (`cloud-costs`, `manual-processes`, `forecasting`, `inventory`), con valores dentro de los rangos de `roiConfig.inputs`.
- **Metadatos**: `scenario_id`, timestamp ISO, `config_version=roiConfig-0.1.0`, revenue/inventory estimados por tamaño.
- **Salida**: columnas para inputs + `investment`, `savingsAnnual`, `paybackMonths`, `roi3Years`, `inventorySavingsCapped`.
- **Ejecución**: `npm run generate-roi-random` (usa `ROI_RANDOM_COUNT` opcional para variar el volumen).

## Dataset generado
- Ruta: `scripts/roi-random-validation-20251208.csv`
- Filas: 10.000 (más header)
- Generado con: `npm run generate-roi-random`

## Tests ejecutados
- `npm test -- __tests__/scripts/generate-random-roi.test.ts __tests__/calculator/calculateROI.test.ts __tests__/components/ROICalculator.test.tsx`

## Verificación CA / DoD
| Criterio | Estado | Evidencia |
| --- | --- | --- |
| CA1: ≥10.000 escenarios | ✅ | CSV con 10.000 filas |
| CA2: Inputs + savings/inversión/payback/ROI3Y | ✅ | Columnas completas en CSV |
| CA3: Sin fallback | ✅ | Cálculo numérico directo, sin validaciones ni caps de fallback |
| CA4: Nombre estándar roi-random-validation-YYYYMMDD.csv | ✅ | `roi-random-validation-20251208.csv` |
| CA5: Conclusiones del análisis externo (Fran) | ⏳ | Pendiente (fuera del alcance del Developer) |

| DoD | Estado | Evidencia |
| --- | --- | --- |
| DoD1: Script funcional en repo | ✅ | `scripts/generate-random-roi-scenarios.ts` |
| DoD2: Archivo generado y documentado | ✅ | CSV en `scripts/roi-random-validation-20251208.csv` |
| DoD3: Comentario con análisis externo | ⏳ | Corresponde a Fran |
| DoD4: Validación de utilidad del dataset por Fran | ⏳ | Corresponde a Fran |

## Próximos pasos
- Fran: análisis estadístico externo del CSV y comentar conclusiones en la issue (CA5/DoD3/DoD4).
