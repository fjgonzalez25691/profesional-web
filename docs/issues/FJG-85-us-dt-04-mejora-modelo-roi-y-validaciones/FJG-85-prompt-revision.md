# FJG-85: Prompt de Revisión
## US-DT-04 – Mejora modelo ROI y validaciones de la calculadora de ROI

**Rol:** Agent Reviewer (Auditor - Solo Lectura)
**Issue Linear:** FJG-85
**Fecha generación:** 2025-12-07
**Generado por:** Agent Manager

---

## 📋 VERIFICACIÓN PREVIA OBLIGATORIA

**ANTES DE REVISAR**, debes:

1. **Leer la issue FJG-85 en Linear** usando `mcp_linear_get_issue` con id `FJG-85`
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

**Si encuentras un fallo**, rechaza la tarea (❌) para que el Developer la corrija.

---

## 📊 Criterios de Aceptación (CA) de Linear FJG-85

Debes verificar:

### CA1 – Validaciones de entrada ✅
> "Para cada input numérico (gasto cloud, horas manuales, error de forecast, etc.) existen rangos mínimos y máximos definidos, y combinaciones claramente incoherentes (p.ej. gasto cloud > X% de la facturación estimada) son bloqueadas o derivadas a fallback."

**Verificar:**
- [ ] Existen rangos min/max para `cloudSpendMonthly`, `manualHoursWeekly`, `forecastErrorPercent`
- [ ] La función `validateCalculatorInputs()` devuelve errores claros cuando los valores están fuera de rango
- [ ] Combinaciones incoherentes (p.ej. cloud > 50% revenue) son detectadas
- [ ] Tests cubren casos de validación (mínimos, máximos, valores fuera de rango)

### CA2 – Supuestos conservadores ✅
> "Con datos típicos para empresas de 5–50M, el ROI a 3 años se sitúa en rangos razonables (p.ej. 20–80%) y nunca se muestran paybacks inferiores a 3 meses ni ROI extremos sin cap/aviso."

**Verificar:**
- [ ] Porcentajes de ahorro son conservadores (cloud ~27.5%, forecast ~35% mejora, inventory ~30%)
- [ ] Payback mínimo >= 3 meses (verificado con tests o config)
- [ ] ROI extremos (>1000%) están cappeados o marcados con warnings
- [ ] Tests incluyen escenarios típicos (5-10M, 10-25M, 25-50M) y verifican rangos razonables

### CA3 – Fichero de configuración ✅
> "Existe un fichero de configuración centralizado con los parámetros clave del modelo, y la lógica de la calculadora lo utiliza (no hay "números mágicos" dispersos en el código)."

**Verificar:**
- [ ] Archivo `calculatorConfig.ts` existe y contiene todos los parámetros
- [ ] `calculateROI()` usa `roiConfig` en lugar de constantes hardcodeadas
- [ ] No hay números mágicos en `calculateROI.ts` ni `validation.ts`
- [ ] Configuración está bien tipada (TypeScript)

### CA4 – Fallback ⚠️ **CRÍTICO - NUEVA FUNCIONALIDAD**
> "Cuando los inputs no cumplen las validaciones (rangos o coherencia), la calculadora no devuelve ROI numérico, sino un mensaje de recomendación de diagnóstico personal, manteniendo la experiencia de usuario coherente."

**Verificar (CRÍTICO):**
- [ ] `calculateROI()` devuelve tipo union: `ROISuccess | ROIFallback`
- [ ] Existe función `shouldCalculateROI()` que evalúa si se puede calcular ROI
- [ ] Cuando hay errores de validación, se devuelve `ROIFallback` con `type: 'fallback'`
- [ ] `ROIFallback` contiene:
  - `reason`: 'invalid_inputs' | 'incoherent_scenario' | 'out_of_range'
  - `message`: mensaje claro para el usuario
  - `recommendedAction`: texto recomendando diagnóstico personalizado
- [ ] Tests verifican que escenarios inválidos devuelven fallback (no ROI numérico)
- [ ] Tests verifican que escenarios válidos devuelven `type: 'success'`

**Escenarios de fallback esperados:**
1. Cloud spend < 500€ o > 100K€
2. Manual hours < 5 o > 200
3. Forecast error < 5% o > 60% (o >80% extremeHigh)
4. Cloud anual > 50% revenue estimado
5. Combinación de validación + coherencia

### CA5 – UI/UX ✅
> "La interfaz muestra mensajes claros de error/aviso/advertencia según el tipo de problema (input inválido, escenario extremo, falta de datos) y explica que los resultados se basan en supuestos prudentes."

**Verificar:**
- [ ] Función `validateCalculatorInputs()` devuelve mensajes de error localizados (español)
- [ ] Función `getCalculatorWarnings()` devuelve warnings de coherencia
- [ ] Mensajes son claros y específicos (no genéricos)
- [ ] Tests verifican formato de mensajes

### CA6 – Validación masiva ✅
> "Existe un script (v2) que permite ejecutar la lógica de la calculadora sobre un conjunto amplio de combinaciones y marcar casos extremos para revisión; se ha usado al menos una vez antes de cerrar la US."

**Verificar:**
- [ ] Script `validate-roi-v2.ts` existe en `scripts/`
- [ ] Script genera ≥1000 combinaciones de inputs
- [ ] Script maneja correctamente `ROICalculationResult` (success y fallback)
- [ ] Script exporta JSON y CSV con resultados
- [ ] Tests automatizados verifican que el script funciona (`validate-roi-v2.test.ts`)
- [ ] Script se ha ejecutado al menos una vez (verificar existencia de archivos de salida)

---

## 📋 Definition of Done (DoD)

### DoD1 – Fichero de configuración ✅
- [ ] `calculatorConfig.ts` existe y está documentado
- [ ] Parámetros están tipados con TypeScript
- [ ] `calculateROI()` y `validation.ts` usan este config

### DoD2 – Validaciones implementadas y testeadas ✅
- [ ] Validaciones de entrada implementadas en `validation.ts`
- [ ] Tests unitarios para validaciones (min/max/coherencia)
- [ ] Coverage ≥80% en `validation.test.ts`

### DoD3 – Fórmulas con supuestos conservadores ✅
- [ ] Fórmulas ajustadas a supuestos conservadores
- [ ] Verificadas con escenarios representativos por tamaño y dolor
- [ ] Tests verifican rangos razonables de ROI/payback

### DoD4 – Lógica de fallback ⚠️ **CRÍTICO**
- [ ] Lógica de fallback implementada (función `shouldCalculateROI()`)
- [ ] `calculateROI()` devuelve fallback cuando inputs inválidos
- [ ] Tests verifican comportamiento de fallback
- [ ] **Escenarios fuera de rango NO devuelven ROI numérico**

### DoD5 – UI/UX consistente ✅
- [ ] Mensajes de error/aviso/disclaimer implementados
- [ ] Consistentes con lógica de validación
- [ ] Tests verifican mensajes

### DoD6 – Script validación masiva ejecutado ✅
- [ ] Script `validate-roi-v2.ts` existe y funciona
- [ ] Ejecutado al menos una vez (verificar archivos output)
- [ ] Tests automatizados del script pasan

### DoD7 – Revisión de Fran ⏳
- [ ] Pending: Fran debe revisar y validar antes de merge

---

## 🔍 Checklist de Revisión Técnica

### 1. Seguridad
- [ ] No hay credenciales hardcodeadas
- [ ] No hay datos sensibles en logs o comentarios
- [ ] Validaciones previenen injection o exploits

### 2. Calidad de Código
- [ ] Código claro, legible y bien estructurado
- [ ] No hay código duplicado innecesario
- [ ] Sigue principio de Navaja de Ockham (simplicidad)
- [ ] Nombres de variables/funciones descriptivos (inglés)
- [ ] Comentarios en español donde necesario

### 3. TypeScript
- [ ] `npm run type-check` pasa sin errores
- [ ] Tipos correctamente definidos (no `any` innecesarios)
- [ ] Interfaces exportadas desde `types.ts`

### 4. Tests
- [ ] `npm test` pasa al 100%
- [ ] Tests cubren casos felices y casos de error
- [ ] Tests de fallback implementados y pasando
- [ ] Coverage ≥80% en archivos modificados
- [ ] Tests son mantenibles (no frágiles)

### 5. Build
- [ ] `npm run build` ejecuta sin errores
- [ ] No warnings críticos en build

### 6. Consistencia con Linear
- [ ] **CRÍTICO:** Verificar que implementación coincide con CA/DoD de Linear
- [ ] Si hay discrepancias, documentarlas en informe

---

## 📝 Plantilla de Informe de Revisión

Al terminar tu auditoría, genera `FJG-85-informe-revision.md` en la misma carpeta:

```markdown
# FJG-85: Informe de Revisión
## US-DT-04 – Mejora modelo ROI y validaciones de la calculadora de ROI

**Fecha:** [Fecha actual]
**Rol:** Agent Reviewer
**Duración:** ~XX minutos

---

## 🎯 VEREDICTO: [✅ APROBADO | ⚠️ APROBADO CON OBSERVACIONES | ❌ RECHAZADO]

**Resumen ejecutivo:**
[Explicación breve del veredicto]

---

## ✅ Criterios de Aceptación (CA)

### CA1 – Validaciones de entrada
- [x] Verificado: [Descripción]
- [Notas/Observaciones]

### CA2 – Supuestos conservadores
- [x] Verificado: [Descripción]
- [Notas/Observaciones]

### CA3 – Fichero de configuración
- [x] Verificado: [Descripción]
- [Notas/Observaciones]

### CA4 – Fallback ⚠️ **CRÍTICO**
- [x] Verificado: [Descripción]
- [Notas/Observaciones]
- **DEBE SER APROBADO para cerrar issue**

### CA5 – UI/UX
- [x] Verificado: [Descripción]
- [Notas/Observaciones]

### CA6 – Validación masiva
- [x] Verificado: [Descripción]
- [Notas/Observaciones]

---

## 📋 Definition of Done (DoD)

- [x] DoD1: Fichero configuración ✅
- [x] DoD2: Validaciones testeadas ✅
- [x] DoD3: Fórmulas conservadores ✅
- [x] DoD4: Lógica fallback ⚠️ **CRÍTICO**
- [x] DoD5: UI/UX consistente ✅
- [x] DoD6: Script validación ejecutado ✅
- [ ] DoD7: Revisión Fran (pendiente)

---

## 🔍 Verificaciones Técnicas

### Seguridad
- [x] No credenciales hardcodeadas
- [x] Validaciones correctas

### TypeScript
- [x] `npm run type-check`: [0 errores | X errores encontrados]

### Tests
- [x] `npm test`: [135/135 pasados | X/Y fallidos]
- [x] Coverage: [X%]

### Build
- [x] `npm run build`: [Exitoso | Fallido]

---

## 🚨 Problemas Encontrados

### Críticos (❌ Bloquean merge)
1. [Descripción problema crítico]
   - **Ubicación:** archivo:línea
   - **Razón:** [Por qué es crítico]
   - **Acción requerida:** [Qué debe hacer el Developer]

### Advertencias (⚠️ No bloquean pero deben revisarse)
1. [Descripción advertencia]
   - **Ubicación:** archivo:línea
   - **Recomendación:** [Sugerencia de mejora]

### Observaciones (ℹ️ Informativas)
1. [Observación informativa]

---

## ✅ Aspectos Positivos

1. [Destacar buenas prácticas]
2. [Código bien estructurado]
3. [Tests completos]

---

## 🔗 Verificación vs Linear

**Issue FJG-85 leída desde Linear:** ✅ Sí
**Discrepancias detectadas:**
- [Ninguna | Lista de discrepancias con explicación]

---

## 📊 Siguiente Paso

- **Si ✅ APROBADO:** El Manager puede proceder a commit/PR
- **Si ⚠️ APROBADO CON OBSERVACIONES:** Developer debe revisar observaciones (opcional) → Manager decide si procede
- **Si ❌ RECHAZADO:** Developer debe corregir problemas críticos y volver a solicitar revisión
```

---

## 🚨 Recordatorios de la Constitución

- **NO** toques el código (rol de solo lectura)
- **NO** generes bloques de código en el chat para "arreglar"
- **NO** modifiques `docs/ESTADO_PROYECTO.md`
- **SÍ** sé riguroso en la verificación de CA4 (fallback) - es crítico
- **SÍ** verifica contra Linear, no solo contra el prompt

---

## 🔗 Referencias

- **Issue Linear:** FJG-85
- **Prompt Implementación:** `FJG-85-prompt-implementacion.md`
- **Informe Developer:** `FJG-85-informe-implementacion.md` (si existe)
- **Constitución:** `.prompts/CONSTITUCION.md`
- **Roles:** `.prompts/ROLES.md`
