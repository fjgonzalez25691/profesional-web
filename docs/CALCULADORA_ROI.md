# Calculadora ROI - Documentación Técnica (Modelo FJG-86 a FJG-91)

## Índice
1. [Visión general](#visión-general)
2. [Supuestos de negocio](#supuestos-de-negocio)
3. [Lógica de cálculo](#lógica-de-cálculo)
4. [Validaciones y avisos](#validaciones-y-avisos)
5. [Ejemplos realistas](#ejemplos-realistas)
6. [Casos extremos](#casos-extremos)
7. [Testing](#testing)
8. [Mantenimiento](#mantenimiento)

---

## Visión general

La calculadora estima ahorro, inversión, payback y ROI a 3 años para cuatro pains:
cloud, procesos manuales, forecasting e inventario. Los cálculos usan supuestos
prudentes y se cappea el ROI en > 1.000% para evitar resultados “milagrosos”.

---

## Supuestos de negocio

- **Cloud:** Ahorro prudente del 27,5% sobre gasto anual (`CLOUD_SAVINGS_RATE = 0.275`).
- **Manual:** Coste/hora 25€ con recuperación del 50% del tiempo (`MANUAL_IMPROVEMENT_RATE = 0.5`).
- **Forecasting:** Impacto prudente del 5% del revenue y mejora del error en 35%.
- **Inventario:** Coste anual del 10% del valor de inventario, mejora del 30% con cap al 80% del valor.
- **Inversión:** Base por pain + multiplicador por tamaño (ver `getInvestmentForPain` en código).
- **Cap ROI:** `ROI_CAP_PERCENT = 1000` para evitar outputs sin contexto.

Referencias en código: `lib/calculator/calculateROI.ts` y `lib/calculator/types.ts`.

---

## Lógica de cálculo

Para cada pain seleccionado:

```ts
totalSavingsAnnual += ahorroPain;
totalInvestment += inversiónPain;
```

Métricas finales:

```ts
paybackMonths = hasSavings ? round((totalInvestment / totalSavingsAnnual) * 12) : 0;
roi3Years = hasSavings ? round(((totalSavingsAnnual * 3 - totalInvestment) / totalInvestment) * 100) : 0;
```

### Fórmulas por pain

- **Cloud:** `cloudSpendMonthly * 12 * 0.275`
- **Manual:** `manualHoursWeekly * 52 * 25 * 0.5`
- **Forecasting:** `revenue(size) * 0.05 * (forecastErrorPercent/100) * 0.35`
- **Inventory:** `inventory(size) * 0.1 * 0.3` con cap al 80% del inventario

Inversión por pain = `base + multiplier * sizeFactor` (ver `calculateROI.ts`).

---

## Validaciones y avisos

Validaciones (bloquean paso 2 → 3):
- Cloud: mínimo 100€/mes, máximo 500.000€/mes, requerido si se marca el pain.
- Manual: 1-168 h/semana, requerido si se marca el pain.
- Forecast: 1-100%, requerido si se marca el pain.

Avisos (no bloquean, se muestran en resultados):
- **Cloud coherencia:** gasto anual cloud > 20% de la facturación estimada.
- **Forecast coherencia:** error de forecast > 50% (dato sospechoso).
- **ROI extremo:** se muestra `> 1.000%` (cap aplicado, requiere validación).
- **Inventory cap:** ahorro ajustado si supera el 80% del inventario estimado.

Mensajes UI en `components/calculator/Step3Results.tsx`. Lógica en
`lib/calculator/validation.ts`.

---

## Ejemplos realistas

Todos los ejemplos usan el modelo actual (cap 1.000%) y muestran órdenes de
magnitud conservadores.

### 1) Cloud moderado
- Tamaño: 10-25M, Gasto cloud: 1.000€/mes, Pain: cloud-costs
- Ahorro anual: `1.000 * 12 * 0.275 = 3.300€`
- Inversión: ~3.220€
- Payback: ~12 meses
- ROI 3 años: ~207% (sin cap)

### 2) Procesos manuales acotados
- Tamaño: 25-50M, Horas manuales: 8 h/semana, Pain: manual-processes
- Ahorro anual: `8 * 52 * 25 * 0.5 = 5.200€`
- Inversión: ~5.200€
- Payback: ~12 meses
- ROI 3 años: ~200% (sin cap)

### 3) Forecasting con error bajo
- Tamaño: 5-10M, Error forecast: 4%, Pain: forecasting
- Ahorro anual: `8.000.000 * 0.05 * 0.04 * 0.35 ≈ 5.600€`
- Inversión: ~5.600€
- Payback: ~12 meses
- ROI 3 años: ~200% (sin cap)

---

## Casos extremos

Cuando los inputs son muy altos (ej. cloud 8.500€/mes o errores de forecast muy
grandes) el ROI puede superar el 1.000% y se muestra como `> 1.000%` con aviso:

- **Interpretación:** hay una oportunidad grande, pero el dato debe validarse
  con cifras reales de la empresa.
- **Acción recomendada:** revisar gasto cloud vs facturación, error de forecast
  y supuestos de negocio antes de presentar el ROI.

---

## Testing

- **Unit:** `__tests__/calculator/calculateROI.test.ts`
- **Validaciones/Avisos:** `__tests__/calculator/validation.test.ts`
- **Componentes:** `__tests__/components/ROICalculator.test.tsx`
- **E2E:** `__tests__/e2e/calculator.spec.ts`, `__tests__/e2e/lead-capture.spec.ts`

---

## Mantenimiento

1. Ajusta constantes en `calculateROI.ts` y tipos en `types.ts` si cambian supuestos.
2. Sincroniza mensajes/umbrales en `validation.ts` y en los tests asociados.
3. Ejecuta `npm test` y `npx playwright test calculator.spec.ts` antes de subir cambios.
