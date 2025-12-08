# FJG-96: Prompt de Revisión
## US-DT-04-BUG-FALLBACK – ROI extremo o payback < 3m activa fallback

**Rol:** Agent Reviewer (Auditor - Solo Lectura)
**Issue Linear:** FJG-96
**Fecha generación:** 2025-12-08
**Generado por:** Agent Manager

---

## 📋 VERIFICACIÓN PREVIA OBLIGATORIA

**ANTES DE REVISAR**, debes:

1. **Leer la issue FJG-96 en Linear** usando `mcp_linear_get_issue` con id `FJG-96`
2. **Leer el código implementado** por el Developer
3. **Comparar implementación vs issue Linear** (CA + DoD), NO solo vs prompt de implementación
4. **Si detectas discrepancias** entre Linear y la implementación, incluirlas en tu informe

---

## 🎯 Tu Misión

Como **Agent Reviewer**, eres el auditor de calidad. Tu trabajo es:

1. **Verificar** que la implementación cumple los **Criterios de Aceptación (CA)** y **Definition of Done (DoD)** de Linear
2. **Asegurar** calidad, seguridad y cumplimiento de estándares
3. **Generar un informe** con veredicto ✅ (aprobado), ⚠️ (aprobado con observaciones) o ❌ (rechazado)

**PROHIBIDO:**
- ❌ Tocar el código (eres solo lectura)
- ❌ Generar bloques de código para "arreglar" problemas
- ❌ Modificar `docs/ESTADO_PROYECTO.md`
- ❌ Ejecutar commits/pushes

---

## 📊 Criterios de Aceptación (CA) de Linear FJG-96

### CA1: ROI 3y > 90 → devuelve `fallback/extreme_roi`

**Verificar:**
- [ ] Existe validación post-cálculo que comprueba `roi3Years > 90`
- [ ] Cuando se cumple, se devuelve `{ type: 'fallback', reason: 'extreme_roi' }`
- [ ] Test unitario verifica este comportamiento
- [ ] Test usa escenario real que genera ROI > 90%

**Código esperado en `calculateROI.ts`:**
```typescript
if (roi3Years > 90 || paybackMonths < 3) {
  return {
    type: 'fallback',
    reason: 'extreme_roi',
    message: '...',
    recommendedAction: '...'
  };
}
```

### CA2: Payback < 3m → devuelve `fallback/extreme_roi`

**Verificar:**
- [ ] Existe validación post-cálculo que comprueba `paybackMonths < 3`
- [ ] Cuando se cumple, se devuelve `{ type: 'fallback', reason: 'extreme_roi' }`
- [ ] Test unitario verifica este comportamiento
- [ ] Test usa escenario real que genera payback < 3 meses

### CA3: Caso normal → devuelve `ROISuccess`

**Verificar:**
- [ ] Escenarios con `roi3Years ≤ 90` y `paybackMonths ≥ 3` devuelven `type: 'success'`
- [ ] Test unitario verifica casos normales no activan fallback
- [ ] No hay regresión: casos válidos previos siguen funcionando

### CA4: UI muestra mensaje/CTA sin cifras para `fallback/extreme_roi`

**Verificar:**
- [ ] Componentes UI detectan `reason === 'extreme_roi'`
- [ ] Cuando es fallback extremo, NO se muestran cifras (ROI, ahorro, payback)
- [ ] Se muestra `message` y `recommendedAction` del fallback
- [ ] Existe CTA claro para agendar consulta
- [ ] Tests E2E o validación manual confirma comportamiento

**Componentes a revisar:**
- `components/calculator/Step3Results.tsx`
- `components/calculator/ROICalculator.tsx`

---

## 📋 Definition of Done (DoD)

### DoD1: Lógica implementada en `calculateROI`
- [ ] Validación post-cálculo añadida después de calcular `roi3Years` y `paybackMonths`
- [ ] Condición correcta: `roi3Years > 90 || paybackMonths < 3`
- [ ] Retorno de fallback con `reason: 'extreme_roi'`
- [ ] Mensajes claros y en español

### DoD2: UI ajustada para ocultar cifras en `fallback/extreme_roi`
- [ ] UI detecta `reason === 'extreme_roi'`
- [ ] NO renderiza cifras numéricas cuando es fallback extremo
- [ ] Muestra mensaje y CTA de contacto
- [ ] Estilo/diseño consistente con otros fallbacks

### DoD3: Tests unitarios para los 3 casos
- [ ] Test ROI extremo (>90%) → fallback
- [ ] Test payback extremo (<3m) → fallback
- [ ] Test caso normal → success
- [ ] Tests pasan al 100%
- [ ] Coverage ≥80% en código modificado

### DoD4: Validación manual de ejemplos
- [ ] Developer ha validado manualmente al menos 1 escenario extremo
- [ ] Informe de implementación incluye evidencia (logs, screenshots, descripción)

---

## 🔍 Checklist de Revisión Técnica

### 1. Tipo extendido correctamente
- [ ] `ROIFallback['reason']` incluye `'extreme_roi'`
- [ ] Tipo está exportado desde `types.ts`
- [ ] No hay errores TypeScript relacionados

### 2. Lógica de validación
- [ ] Validación está DESPUÉS del cálculo (no antes)
- [ ] Condición usa OR lógico: `roi3Years > 90 || paybackMonths < 3`
- [ ] Umbrales coinciden con los de Linear (90, 3)
- [ ] No hay lógica duplicada o contradictoria

### 3. Mensajes de fallback
- [ ] Mensaje es claro y no técnico (orientado al usuario final)
- [ ] En español
- [ ] Explica por qué no se muestran cifras
- [ ] `recommendedAction` invita a consulta personalizada

### 4. UI/UX
- [ ] Componentes manejan el nuevo `reason` sin errores
- [ ] No hay renderizado condicional roto
- [ ] Accesibilidad: mensajes tienen ARIA labels si es necesario
- [ ] Mobile responsive (si la calculadora lo es)

### 5. Tests
- [ ] Tests unitarios nuevos existen y pasan
- [ ] Tests usan escenarios realistas (no hardcoded)
- [ ] Tests verifican TANTO el tipo de resultado COMO el reason
- [ ] No hay tests comentados o skipped

### 6. Regresión
- [ ] Tests previos (FJG-85, FJG-89) siguen pasando
- [ ] Casos normales de calculadora no afectados
- [ ] Script `validate-roi-v2.ts` maneja el nuevo reason (si fue actualizado)

### 7. Build y Type Check
- [ ] `npm run type-check` → 0 errores
- [ ] `npm run build` → exitoso
- [ ] `npm test` → 100% pasando

---

## 📝 Plantilla de Informe de Revisión

Al terminar tu auditoría, genera `FJG-96-informe-revision.md`:

```markdown
# FJG-96: Informe de Revisión
## US-DT-04-BUG-FALLBACK – ROI extremo o payback < 3m activa fallback

**Fecha:** [Fecha actual]
**Rol:** Agent Reviewer
**Duración:** ~XX minutos

---

## 🎯 VEREDICTO: [✅ APROBADO | ⚠️ APROBADO CON OBSERVACIONES | ❌ RECHAZADO]

**Resumen ejecutivo:**
[Explicación breve del veredicto]

---

## ✅ Criterios de Aceptación (CA)

### CA1: ROI > 90% → fallback
- [x] Verificado: [Descripción de implementación y test]

### CA2: Payback < 3m → fallback
- [x] Verificado: [Descripción de implementación y test]

### CA3: Caso normal → success
- [x] Verificado: [Descripción de tests de regresión]

### CA4: UI sin cifras para extreme_roi
- [x] Verificado: [Descripción de componentes y comportamiento]

---

## 📋 Definition of Done (DoD)

- [x] DoD1: Lógica en calculateROI
- [x] DoD2: UI ajustada
- [x] DoD3: Tests unitarios (3 casos)
- [x] DoD4: Validación manual

---

## 🔍 Verificaciones Técnicas

### TypeScript
- [x] `npm run type-check`: [0 errores | X errores]

### Tests
- [x] `npm test`: [X/Y pasados]
- [x] Coverage: [X%]

### Build
- [x] `npm run build`: [Exitoso | Fallido]

---

## 🚨 Problemas Encontrados

### Críticos (❌ Bloquean merge)
[Ninguno | Lista de problemas]

### Advertencias (⚠️ Revisar)
[Ninguna | Lista de observaciones]

### Observaciones (ℹ️)
[Lista de notas informativas]

---

## ✅ Aspectos Positivos
[Destacar buenas prácticas]

---

## 🔗 Verificación vs Linear
**Issue FJG-96 leída:** ✅
**Discrepancias:** [Ninguna | Lista]

---

## 📊 Siguiente Paso
- **Si ✅:** Manager puede hacer commit/PR
- **Si ⚠️:** Developer revisa observaciones (opcional) → Manager decide
- **Si ❌:** Developer corrige y vuelve a solicitar revisión
```

---

## 🚨 Recordatorios de la Constitución

- **NO** toques el código (rol de solo lectura)
- **NO** generes bloques de código para "arreglar"
- **SÍ** verifica contra Linear, no solo contra el prompt
- **SÍ** valida que no hay regresión en funcionalidad existente

---

## 🔗 Referencias

- **Issue Linear:** FJG-96
- **Issue padre:** FJG-85
- **Prompt Implementación:** `FJG-96-prompt-implementacion.md`
- **Constitución:** `.prompts/CONSTITUCION.md`
- **Roles:** `.prompts/ROLES.md`
