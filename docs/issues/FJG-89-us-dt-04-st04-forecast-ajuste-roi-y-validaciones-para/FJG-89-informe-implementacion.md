## Resumen
- Forecasting usa facturación estimada por tamaño (`getRevenueFromSize`) con supuestos prudentes: impacto 5% sobre revenue y mejora del error al 35%.
- Se validan inputs de forecast entre 1% y 79%, bloqueando 0% y valores extremos con mensajes visibles en el paso 2.
- La UI limpia valores/errores al deseleccionar dolores y mantiene la consistencia de tipos para los nuevos errores.

## Detalles técnicos
- `lib/calculator/calculateROI.ts`: introduce constantes `FORECAST_IMPACT_FACTOR` y `FORECAST_IMPROVEMENT_RATE` y recalcula ahorro forecast usando revenue por tamaño; se reutiliza `getRevenueFromSize`.
- `components/calculator/ROICalculator.tsx`: añade validación de rango para `forecastErrorPercent`, soporta el nuevo error en el estado y limpia inputs/errores al desactivar pains; ajuste del helper `isMissingValue` para que el rango dispare el mensaje correcto.
- `components/calculator/Step2Pains.tsx`: el input de forecast muestra el error de rango y fija `min={1}`.
- Tests: se añaden/actualizan expectativas de cifras y validaciones en `__tests__/calculator/calculateROI.test.ts`, `__tests__/components/ROICalculator.test.tsx` y `__tests__/e2e/calculator.spec.ts` para cubrir casos normales y extremos de forecast.

## Tests ejecutados
- `npm test`
