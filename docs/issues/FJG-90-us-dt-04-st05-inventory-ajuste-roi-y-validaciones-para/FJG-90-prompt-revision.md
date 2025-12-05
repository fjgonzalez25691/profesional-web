# FJG-90 · Prompt de Revisión (Agent Reviewer)

## Contexto
- **Issue Linear:** [FJG-90](https://linear.app/fjgaparicio/issue/FJG-90/us-dt-04-st05-inventory-ajuste-roi-y-validaciones-para-inventario)
- **User story:** "US-DT-04-ST05-INVENTORY – Ajuste ROI y validaciones para inventario"
- **Objetivo de la revisión:** Verificar que la implementación cumple con todos los criterios de aceptación y DoD de la issue, sin comprometer la calidad, seguridad o mantenibilidad del código.

## Criterios de Aceptación (CA) a verificar
- **CA1:** El cálculo de ahorro en inventario usa inventario estimado por `companySize`.
- **CA2:** Con inputs razonables, el ahorro anual no supera un porcentaje extremo del inventario.
- **CA3:** Si se supera ese umbral, la UI muestra aviso o limita el resultado.

## Definition of Done (DoD) a verificar
- Fórmula de inventario actualizada con valores por tamaño de empresa.
- Lógica de tope de ahorro vs valor de inventario implementada.
- Tests para casos normales y casos donde se dispara el ahorro.

---

## Checklist de Revisión

### 1. Verificación de especificaciones Linear vs implementación

#### CA1: Cálculo usa inventario por companySize
- [ ] **Código:** `lib/calculator/calculateROI.ts` usa `getInventoryFromSize(size)`
- [ ] **Coherencia:** Los valores están alineados con `INVENTORY_BY_SIZE` definidos en FJG-86
- [ ] **Test:** Existe test que verifica el uso correcto de `getInventoryFromSize`

#### CA2: Supuestos conservadores aplicados
- [ ] **Constantes ajustadas:**
  - `inventoryCostRate`: cambiado de 0.12 → 0.10 (10%)
  - `improvementRate`: cambiado de 0.4 → 0.3 (30%)
- [ ] **Constantes exportadas:** `INVENTORY_COST_RATE` y `INVENTORY_IMPROVEMENT_RATE` definidas a nivel módulo
- [ ] **Test:** Verifica que con `companySize = '10-25M'` (inventario 1.2M€), ahorro = `1.200.000 * 0.10 * 0.30 = 36.000€`

#### CA3: Lógica de tope implementada
- [ ] **Código:** Existe cap de ahorro máximo (80% del inventario)
- [ ] **Constante:** `INVENTORY_MAX_SAVINGS_RATE = 0.80` definida
- [ ] **Lógica:** Se aplica `Math.min(annualSavings, maxPossibleSavings)`
- [ ] **Flag:** Campo `inventorySavingsCapped` añadido a `ROIResult`
- [ ] **UI:** Aviso visible en `Step3Results.tsx` cuando `inventorySavingsCapped = true`
- [ ] **Test:** Existe test que fuerza escenario extremo y verifica cap + flag

---

### 2. Seguridad y buenas prácticas

#### Gestión de secretos
- [ ] **Verificado:** No se han introducido API keys, tokens o credenciales en el código
- [ ] **Verificado:** No se han expuesto valores sensibles en logs o mensajes

#### Validación de inputs
- [ ] **Coherencia:** Las validaciones de inventory están al nivel de las otras validaciones (cloud, manual, forecast)
- [ ] **Mensajes de error:** Claros, en español, orientados a negocio

#### Calidad de código
- [ ] **Navaja de Ockham:** No se han creado funciones/archivos innecesarios
- [ ] **Reutilización:** Se aprovechan utilidades existentes (`getInventoryFromSize`, tipos, etc.)
- [ ] **Comentarios:** El código complejo tiene explicaciones breves y claras
- [ ] **Consistencia:** Estilo coherente con FJG-86/87/88/89 (issues previas de la serie)

---

### 3. Testing

#### Cobertura funcional
- [ ] **Test unitario:** Caso normal sin cap
  - Input: `companySize = '10-25M'`
  - Output esperado: ahorro = 36.000€, `inventorySavingsCapped = false`
- [ ] **Test unitario:** Caso extremo con cap
  - Escenario donde ahorro calculado > 80% inventario
  - Output esperado: ahorro = `inventario * 0.80`, `inventorySavingsCapped = true`
- [ ] **Test integración:** Inventory + otros pains
  - Verificar que el cap solo afecta al componente inventory
- [ ] **Test E2E (opcional):** Flujo completo en calculadora seleccionando pain inventory

#### Ejecución de tests
- [ ] **Comando ejecutado:** `npm run test` pasa sin errores
- [ ] **Comando ejecutado:** `npm run lint` pasa sin errores
- [ ] **Cobertura:** Los cambios no reducen la cobertura global

---

### 4. Documentación y trazabilidad

#### Coherencia con issue Linear
- [ ] **Verificado:** Todos los CA están cumplidos (CA1, CA2, CA3)
- [ ] **Verificado:** Todos los puntos del DoD están implementados
- [ ] **Discrepancias:** Si hay alguna desviación de la spec Linear, está documentada y justificada

#### Informe de implementación
- [ ] **Existe:** `FJG-90-informe-implementacion.md` generado por Developer
- [ ] **Completo:** Describe cambios, decisiones técnicas, resultados de tests
- [ ] **Trazable:** Referencias a archivos modificados y líneas de código clave

#### Estado del proyecto
- [ ] **No modificado:** `docs/ESTADO_PROYECTO.md` no ha sido tocado (responsabilidad del Manager)

---

### 5. Integración con código existente

#### Consistencia con FJG-86 (Core)
- [ ] **Verificado:** Usa `getInventoryFromSize` correctamente
- [ ] **Verificado:** Usa `getInvestmentForPain('inventory', size)` correctamente

#### Consistencia con FJG-87/88/89 (validaciones previas)
- [ ] **Patrón coherente:** La lógica de cap sigue el mismo estilo que otras validaciones
- [ ] **Constantes:** Exportadas a nivel módulo como las demás (`CLOUD_SAVINGS_RATE`, etc.)
- [ ] **Mensajes UI:** Estilo y tono coherente con avisos de cloud/manual/forecast

#### No regresiones
- [ ] **Verificado:** Tests de FJG-86/87/88/89 siguen pasando
- [ ] **Verificado:** Calculadora funciona correctamente con todos los pains combinados

---

## Veredicto

Tras revisar la implementación contra las especificaciones de Linear y los estándares del proyecto:

### ✅ APROBADO (escribir "APROBADO" si todo OK)
**Justificación:**
- Todos los CA cumplidos
- DoD completo
- Tests pasan
- Código coherente con issues previas
- Sin vulnerabilidades de seguridad
- Navaja de Ockham respetada

### ⚠️ APROBADO CON OBSERVACIONES (escribir si hay issues menores no bloqueantes)
**Observaciones:**
- [Listar observaciones específicas]
- [Ejemplo: "Comentario en línea X podría ser más claro"]

### ❌ RECHAZADO (escribir si hay bloqueantes)
**Motivos de rechazo:**
- [Listar motivos específicos con referencias a archivos/líneas]
- [Ejemplo: "CA3 no cumplido: falta aviso en UI"]

---

## Instrucciones finales para Reviewer

1. **No modifiques código.** Tu rol es auditoría pura.
2. **Sé específico.** Referencias exactas a archivos/líneas en caso de problemas.
3. **Compara con Linear.** La issue es la fuente de verdad, no el prompt.
4. **Documenta todo** en `FJG-90-informe-revision.md`.
5. Si rechazas (❌), el Developer debe corregir y volver a someter a revisión.
