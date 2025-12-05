## Resumen
- Capa de cálculo refactorizada para depender de `companySize`: revenue e inventario salen de utilidades (`getRevenueFromSize`, `getInventoryFromSize`) y la inversión usa base + multiplicador por pain (`getInvestmentForPain`).
- Se añade cap de ROI (umbral 1.000%) con helper `formatRoiWithCap` y se aplica tanto en la UI (Step3Results) como en el email de ROI para mantener consistencia.
- ROI calculado ahora expone etiqueta cappeada y flag de caso extremo; se conserva compatibilidad de shape de datos.

## Detalles técnicos
- `lib/calculator/calculateROI.ts`: nuevas constantes por tamaño, inversión escalada por pain y helper de cap; cálculo principal usa estos valores.
- `components/calculator/Step3Results.tsx`: muestra ROI con cap y alerta de caso extremo.
- `app/api/send-roi-email/route.ts` + `templates/roi-email.html`: envían/representan ROI con la etiqueta cappeada.
- Tests actualizados para nuevas cifras y cap.

## Tests ejecutados
- `npm test`
