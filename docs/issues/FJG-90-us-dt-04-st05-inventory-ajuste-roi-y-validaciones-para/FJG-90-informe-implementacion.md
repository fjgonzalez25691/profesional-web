## Resumen
- Ajuste de inventario con supuestos prudentes (coste 10%, mejora 30%) según `companySize`, manteniendo coherencia con los otros pains.
- Tope de ahorro de inventario al 80% del valor estimado con flag `inventorySavingsCapped` y soporte de overrides para escenarios extremos en tests/E2E.
- Aviso en la UI cuando se aplica el cap para que el usuario entienda que el ahorro se ha limitado.

## Detalles técnicos
- `lib/calculator/calculateROI.ts`: nuevas constantes de inventario, helper de cap con overrides globales de prueba y cálculo principal usando ahorro cappeado; devuelve el flag de cap en el resultado.
- `lib/calculator/types.ts`: `ROIResult` incluye `inventorySavingsCapped`.
- `components/calculator/Step3Results.tsx`: mensaje contextual cuando el ahorro de inventario se ajusta.
- `__tests__/calculator/calculateROI.test.ts`: casos para inventario conservador y cap extremo usando overrides.
- `__tests__/e2e/calculator.spec.ts`: valores actualizados de inventario y flujo que fuerza el cap mostrando el aviso.

## Tests ejecutados
- `npm test -- __tests__/calculator/calculateROI.test.ts`
