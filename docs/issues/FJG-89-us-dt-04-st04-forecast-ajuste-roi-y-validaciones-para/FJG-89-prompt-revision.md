# FJG-89 · Prompt de Revisión (Agent Reviewer)

## Contexto
- **Issue:** FJG-89 "US-DT-04-ST04-FORECAST – Ajuste ROI y validaciones para forecasting"
- **Objetivo:** Verificar que el cálculo de ahorro por forecasting sea realista usando revenue por `companySize`, con supuestos prudentes (impacto ~5%, mejora 30-40%), y que existan validaciones para evitar inputs extremos.
- **Fuente de verdad:** Issue Linear + Constitución. Si detectas discrepancias entre implementación y CA/DoD, repórtalas inmediatamente.

## Alcance de la Revisión
1. **Revenue por tamaño de empresa (CA1)**
   - Confirmar que el cálculo usa `getRevenueFromSize(companySize)` en vez de constante fija.
   - Verificar que los factores están ajustados: impacto ~5% (no 8%), mejora 30-40% (no 50%).

2. **Validación de rango `forecastErrorPercent` (CA2)**
   - Asegurar que existe validación de mínimo (1%) y máximo (79%) en el schema de validación.
   - Verificar que intentar introducir un valor fuera de rango bloquea el avance y muestra mensaje de error claro en la UI.

3. **Casos extremos bloqueados (CA3)**
   - Comprobar que 0% de error muestra error y bloquea.
   - Comprobar que errores ≥80% muestran error y bloquean.

4. **Tests**
   - Asegurar que existen tests unitarios para:
     - Cálculo forecast con revenue por tamaño.
     - Validación de rango (dentro y fuera).
     - Casos extremos (0%, ≥80%).
   - Ejecutar `npm run test` para confirmar que todos pasan.

## Checklist de Revisión
- [ ] Issue Linear leída (CA/DoD). Confirmar alineación.
- [ ] Cálculo forecast usa revenue por tamaño (`getRevenueFromSize`).
- [ ] Factores ajustados: impacto ~5%, mejora ~35%.
- [ ] Validación de rango implementada en schema con mensajes claros.
- [ ] Casos extremos (0%, ≥80%) bloqueados correctamente.
- [ ] Tests unitarios cubren los casos clave (rango, extremos, magnitud).
- [ ] Código respeta simplicidad (sin nuevas capas innecesarias).
- [ ] Tipado estricto (sin `any` nuevos) y código documentado cuando haya supuestos.
- [ ] Informe del developer revisado para ver supuestos/pendientes.

## Formato de Salida
Completa `FJG-89-informe-revision.md` con:
- Resumen general (✅/⚠️/❌).
- Evidencia de verificación por cada CA/DoD.
- Observaciones de seguridad, mantenibilidad o deuda técnica.
- Recomendaciones/acciones pendientes (si aplica).

Recuerda: el Reviewer **no modifica código**. Si encuentras un incumplimiento, márcalo y solicita corrección al Developer.
