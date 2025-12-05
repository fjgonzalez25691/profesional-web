# FJG-86 · Prompt de Revisión (Agent Reviewer)

## Contexto
- **Issue:** FJG-86 "US-DT-04-ST01-CORE – Lógica común de ROI por tamaño de empresa"
- **Objetivo:** Verificar que la calculadora ROI usa `companySize` para revenue/inventory e inversión y que existe cap de ROI extremo (> 1.000%).
- **Fuente de verdad:** Issue Linear + Constitución. Si detectas discrepancias entre implementación y CA/DoD, repórtalas inmediatamente.

## Alcance de la Revisión
1. **Funciones utilitarias por tamaño**
   - Confirmar que existen `getRevenueFromSize`, `getInventoryFromSize` (o equivalentes) con cobertura de todos los tamaños soportados.
   - Asegurar que la calculadora dejó de depender de constantes fijas.
2. **Lógica de inversión**
   - Verificar que la inversión final es `base + ajuste por tamaño` en todos los módulos/cloud/manual/forecast/inventario.
   - Revisar coherencia de los multiplicadores y que no se dejó lógica legacy muerta.
3. **Cap de ROI extremo**
   - Validar que cualquier `roi3Years` > 1.000% devuelva label cappeado `"> 1.000%"` (o equivalente) y se marque como caso extremo (flag booleano o estructura similar).
   - Comprobar que la UI/DTO recibe el flag para un manejo visual consistente.
4. **Tests**
   - Asegurar existencia de tests unitarios que cubran funciones por tamaño, fórmula de inversión y cap de ROI (DoD).
   - Ejecutar `npm run test`/`npm run lint` según corresponda (o revisar evidencia en informe developer).

## Checklist de Revisión
- [ ] Issue Linear leída (CA/DoD). Confirmar alineación.
- [ ] Código respeta principios de simplicidad, sin nuevas capas innecesarias.
- [ ] Tipado estricto (sin `any` nuevos) y código documentado cuando haya supuestos.
- [ ] Tests unitarios cubren los casos clave indicados.
- [ ] No se introducen regresiones en módulos adyacentes.
- [ ] Informe del developer revisado para ver supuestos/pendientes.

## Formato de Salida
Completa `FJG-86-informe-revision.md` con:
- Resumen general (✅/⚠️/❌).
- Evidencia de verificación por cada CA/DoD.
- Observaciones de seguridad, mantenibilidad o deuda técnica.
- Recomendaciones/acciones pendientes (si aplica).

Recuerda: el Reviewer **no modifica código**. Si encuentras un incumplimiento, márcalo y solicita corrección al Developer.
