# FJG-87 · Prompt de Revisión (Agent Reviewer)

## Contexto
- **Issue:** FJG-87 "US-DT-04-ST02-CLOUD – Ajuste ROI y validaciones para cloud"
- **Objetivo:** Verificar que el cálculo de ahorro cloud sea prudente (~25–30%) y que existan validaciones para evitar inputs irreales que inflen el ROI.
- **Fuente de verdad:** Issue Linear + Constitución. Si detectas discrepancias entre implementación y CA/DoD, repórtalas inmediatamente.

## Alcance de la Revisión
1. **Fórmula de ahorro cloud prudente (CA3)**
   - Confirmar que el porcentaje de ahorro aplicado es ~25–30% (no 35%) en `lib/calculator/calculateROI.ts`.
   - Verificar que el cálculo resulta en ahorros coherentes con la nueva hipótesis.

2. **Validación de rango `cloudSpendMonthly` (CA1)**
   - Asegurar que existe validación de mínimo (ej. 100€) y máximo (ej. 100.000€) en el schema de validación.
   - Verificar que intentar introducir un valor fuera de rango bloquea el avance y muestra mensaje de error claro en la UI.

3. **Validación cruzada cloud vs facturación (CA2)**
   - Comprobar que si el gasto cloud anual supera un % máximo de la facturación estimada (ej. 40%), se muestra aviso o se bloquea el cálculo.
   - Verificar que el mensaje de error es visible y claro.

4. **Tests**
   - Asegurar que existen tests unitarios para:
     - Fórmula de ahorro cloud con nuevo porcentaje.
     - Validación de rango (dentro y fuera).
     - Validación cruzada (cloud anual vs facturación).
   - Ejecutar `npm run test` para confirmar que todos pasan.

## Checklist de Revisión
- [ ] Issue Linear leída (CA/DoD). Confirmar alineación.
- [ ] Fórmula de ahorro cloud ajustada a ~25–30% (no 35%).
- [ ] Validación de rango implementada en schema con mensajes claros.
- [ ] Validación cruzada cloud vs facturación implementada y visible en UI.
- [ ] Tests unitarios cubren los casos clave (rango, %, facturación).
- [ ] Código respeta simplicidad (sin nuevas capas innecesarias).
- [ ] Tipado estricto (sin `any` nuevos) y código documentado cuando haya supuestos.
- [ ] Informe del developer revisado para ver supuestos/pendientes.

## Formato de Salida
Completa `FJG-87-informe-revision.md` con:
- Resumen general (✅/⚠️/❌).
- Evidencia de verificación por cada CA/DoD.
- Observaciones de seguridad, mantenibilidad o deuda técnica.
- Recomendaciones/acciones pendientes (si aplica).

Recuerda: el Reviewer **no modifica código**. Si encuentras un incumplimiento, márcalo y solicita corrección al Developer.
