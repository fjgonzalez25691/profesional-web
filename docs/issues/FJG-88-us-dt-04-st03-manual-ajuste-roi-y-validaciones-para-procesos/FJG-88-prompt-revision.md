# FJG-88 · Prompt de Revisión (Agent Reviewer)

## Contexto
- **Issue:** FJG-88 "US-DT-04-ST03-MANUAL – Ajuste ROI y validaciones para procesos manuales"
- **Objetivo:** Verificar que el cálculo de ahorro por automatización de procesos manuales sea conservador (~50% vs 70%) y que existan validaciones para evitar inputs irreales que sobreestimen el ROI.
- **Fuente de verdad:** Issue Linear + Constitución. Si detectas discrepancias entre implementación y CA/DoD, repórtalas inmediatamente.

## Alcance de la Revisión
1. **Fórmula de ahorro manual conservadora (CA3)**
   - Confirmar que el porcentaje de tiempo recuperable es ~50% (no 70%) en `lib/calculator/calculateROI.ts`.
   - Verificar que el cálculo resulta en ahorros coherentes con la nueva hipótesis.

2. **Validación de rango `manualHoursWeekly` (CA1)**
   - Asegurar que existe validación de mínimo (ej. 1h) y máximo (ej. 168h) en el schema de validación.
   - Verificar que intentar introducir un valor fuera de rango bloquea el avance y muestra mensaje de error claro en la UI.

3. **Orden de magnitud razonable (CA2)**
   - Comprobar que con un caso típico (40h/semana, tamaño 10-25M), el ahorro anual está en rango razonable (20k-30k€).

4. **Tests**
   - Asegurar que existen tests unitarios para:
     - Fórmula de ahorro manual con nuevo porcentaje.
     - Validación de rango (dentro y fuera).
     - Orden de magnitud razonable.
   - Ejecutar `npm run test` para confirmar que todos pasan.

## Checklist de Revisión
- [ ] Issue Linear leída (CA/DoD). Confirmar alineación.
- [ ] Fórmula de ahorro manual ajustada a ~50% (no 70%).
- [ ] Validación de rango implementada en schema con mensajes claros.
- [ ] Tests unitarios cubren los casos clave (rango, magnitud).
- [ ] Código respeta simplicidad (sin nuevas capas innecesarias).
- [ ] Tipado estricto (sin `any` nuevos) y código documentado cuando haya supuestos.
- [ ] Informe del developer revisado para ver supuestos/pendientes.

## Formato de Salida
Completa `FJG-88-informe-revision.md` con:
- Resumen general (✅/⚠️/❌).
- Evidencia de verificación por cada CA/DoD.
- Observaciones de seguridad, mantenibilidad o deuda técnica.
- Recomendaciones/acciones pendientes (si aplica).

Recuerda: el Reviewer **no modifica código**. Si encuentras un incumplimiento, márcalo y solicita corrección al Developer.
