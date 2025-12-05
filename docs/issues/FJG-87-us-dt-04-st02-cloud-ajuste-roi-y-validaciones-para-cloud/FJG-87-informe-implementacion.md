## Resumen
- Ajuste prudente del ahorro cloud al 27,5% del gasto anual para evitar ROI inflado.
- Validaciones en Step 2: rango de gasto cloud (100€–300.000€) y check de coherencia (cloud anual ≤ 40% de facturación estimada por `companySize`), con mensajes de error visibles en la UI.
- ROI cap (1.000%) sigue aplicándose; los datos de ROI se muestran y se envían formateados de forma consistente.

## Detalles técnicos
- `lib/calculator/calculateROI.ts`: nuevo `CLOUD_SAVINGS_RATE` (0.275), reutiliza revenue por tamaño y mantiene formato de cap.
- `components/calculator/ROICalculator.tsx`: validación extendida de `cloudSpendMonthly` (rango + ratio facturación) y errores bloqueando avance.
- `components/calculator/Step2Pains.tsx`: min del input cloud alineado al rango.
- `components/calculator/Step3Results.tsx`, `app/api/send-roi-email/route.ts`, `templates/roi-email.html`: consumen ROI formateado y cappeado de forma consistente.
- Tests actualizados/añadidos para nuevos rangos, ratio facturación, y valores de ROI/ahorro cloud.

## Tests ejecutados
- `npm test`
