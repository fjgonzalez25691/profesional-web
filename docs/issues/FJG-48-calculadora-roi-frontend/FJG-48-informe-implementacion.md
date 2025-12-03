# FJG-48 - Informe de implementación (Calculadora ROI)

## Resumen
- Calculadora ROI completa en 3 pasos (sector/tamaño, dolores con inputs condicionales, resultados + captura email sin envío).
- Algoritmo ROI según especificación Linear implementado en `lib/calculator/calculateROI.ts` con tipado en `lib/calculator/types.ts`.
- Página pública `/calculadora` creada con el wizard integrado y copy alineado a los CA.
- Tests unitarios/RTL verdes; los e2e quedaron pendientes por caída del dev server al lanzarlos desde Playwright (se requiere reintento con servidor estable).

## Cambios realizados
- **Lógica**: `lib/calculator/calculateROI.ts` y tipos en `lib/calculator/types.ts`.
- **Componentes**: `components/calculator/ROICalculator.tsx`, `Step1Company.tsx`, `Step2Pains.tsx`, `Step3Results.tsx`.
- **Página**: `app/calculadora/page.tsx`.
- **Tests**: unitarios `__tests__/calculator/calculateROI.test.ts`, RTL `__tests__/components/ROICalculator.test.tsx`, e2e creado `__tests__/e2e/calculator.spec.ts`.

## Tests ejecutados
- ✅ `npm test -- __tests__/calculator/calculateROI.test.ts __tests__/components/ROICalculator.test.tsx`
- ❌ `npm run test:e2e` (Playwright): el `webServer` de Next se cerró al arrancar; no llegaron a ejecutarse las pruebas. Requiere reintentar con `npm run dev` activo o ajustando `playwright.config.ts`.

## Criterios de aceptación (estado)
- CA escenario cloud: ✅ (ahorro ~35.700€/año, inversión ~3.200€, payback 1 mes, form presente).
- CA validación inputs cloud: ✅ (mensaje “Campo requerido”, no avanza a paso 3).

## Definition of Done (estado)
- Wizard 3 pasos: ✅
- Algoritmo ROI exacto: ✅
- Navegación Siguiente/Anterior: ✅
- Validación inputs requeridos: ✅
- Resultados: investment, savings/año, payback meses, ROI 3 años: ✅
- Form captura email sin envío: ✅
- Responsive mobile/desktop: ✅ (layout flex + grids, inputs accesibles)
- Test calculator.spec.ts: ⚠️ e2e pendiente por caída del server (test creado).

## Notas y pendientes
- Reintentar e2e con `npm run dev` corriendo o ajustar `playwright.config.ts` para evitar salida temprana del server.
- Artefactos generados por Playwright: `playwright-report/index.html`, `test-results/.last-run.json`. Limpiar si no se necesitan.
