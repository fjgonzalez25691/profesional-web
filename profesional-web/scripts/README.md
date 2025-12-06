# Validación Masiva ROI v2 (FJG-94)

Script en TypeScript que recorre más de 1.000 combinaciones de la calculadora de ROI usando únicamente `components/calculator/calculatorConfig.ts` como fuente de verdad. Marca escenarios extremos y exporta los resultados en JSON y CSV.

## Ejecución

```bash
npx tsx scripts/validate-roi-v2.ts
# Genera:
# - scripts/validation-results-YYYY-MM-DDTHH-mm-ssZ.json
# - scripts/validation-extremes-YYYY-MM-DDTHH-mm-ssZ.csv (solo extremos)
```

> Requisitos: Node con las dependencias del proyecto instaladas (tsx ya viene en node_modules).

## Flags y validaciones aplicadas
- `roi_cap`: ROI 3 años >= 1000% (cap de la calculadora).
- `payback_below_min`: Payback menor a `thresholds.minPaybackMonths`.
- `cloud_ratio_high`: Gasto cloud anual supera `thresholds.maxCloudToRevenueRatio`.
- `forecast_warning`: Error de forecast >= `thresholds.forecastWarningThreshold`.
- `savings_over_revenue`: Ahorro anual > facturación estimada del tamaño de empresa.
- `savings_over_inventory`: Ahorro anual > inventario estimado.

Además se registran los warnings de `getCalculatorWarnings` (cloud/forecast/roi extremos).

## Estructura del JSON
- `metadata`: timestamp, thresholds e inputs utilizados desde `roiConfig`.
- `summary`: totales, flags, warnings y promedios.
- `validations[]`: cada caso con inputs, resultado, flags, warnings y ratios.
- `extremes[]`: subconjunto de casos con al menos un flag.

## Consejos de revisión
- Inspeccionar `extremes` para decidir ajustes en thresholds o mensajes.
- Revisar `cloud_ratio_high` y `savings_over_inventory` para coherencia sector/tamaño.
