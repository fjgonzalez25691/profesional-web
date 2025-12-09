# FJG-98 – Informe de Implementación

## Cambios realizados
- Dominio: nueva razón de fallback `multi_pain` en los tipos y validación (`lib/calculator/types.ts`, `lib/calculator/validation.ts`) con chequeo temprano basado en configuración (`maxPainsSelected = 1`) y mensaje orientado a sesión personalizada.
- Cálculo: `calculateROI` ahora devuelve fallback específico para multi-dolor con acción recomendada distinta (`lib/calculator/calculateROI.ts`).
- UI: `Step3Results` muestra bloque dedicado a `multi_pain` (mensaje claro, CTA “Agendar sesión personalizada”, sin métricas) y añade `data-testid` para E2E (`components/calculator/Step3Results.tsx`).
- Configuración: documentado límite de dolores en `calculatorConfig` (`components/calculator/calculatorConfig.ts`).
- Tests actualizados/añadidos para la lógica multi_pain en unitarios y E2E (`__tests__/calculator/validation.test.ts`, `__tests__/calculator/calculateROI.test.ts`, `__tests__/e2e/calculator.spec.ts`); limpieza de imports sin uso.

## Tests ejecutados
- `npm test -- __tests__/calculator/validation.test.ts`
- `npm test -- __tests__/calculator/calculateROI.test.ts`
- `npm run test:e2e -- calculator.spec.ts` *(requiere permisos de red/local para Playwright)*
- `npm run typecheck`
- `npm run lint` *(queda 1 warning heredado en `components/TechStackDiagram.tsx` sobre uso de `<img>` vs `next/image`)*

## Criterios de aceptación (CA)
- **CA1:** Con un solo dolor se mantiene el flujo de éxito/otros fallbacks existentes ✅
- **CA2:** Con ≥2 dolores se devuelve siempre `ROIFallback` con `reason: multi_pain` ✅
- **CA3:** La vista de resultados muestra solo mensaje + CTA de contacto para `multi_pain`, sin cifras ✅
- **CA4:** Tests unitarios y E2E actualizados/pasando según nueva lógica ✅

## Notas
- El fallback multi_dolor se valida antes que el resto de chequeos para evitar cálculos irreales.
- Lint deja un warning preexistente (`TechStackDiagram.tsx`, uso de `<img>`); no se toca por estar fuera de alcance de FJG-98.
