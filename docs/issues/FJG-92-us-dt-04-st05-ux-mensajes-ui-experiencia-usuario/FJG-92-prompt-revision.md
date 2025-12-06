# FJG-92: Prompt de Revisión
## US-DT-04-ST05-UX – Mensajes de UI y experiencia de usuario

**Rol:** Agent Reviewer  
**Issue Linear:** FJG-92  
**Estimación:** 2 SP  
**Prioridad:** Medium

---

## 📋 Contexto de la Issue (desde Linear)

**User Story:**  
Como Fran, quiero que la interfaz de la calculadora explique claramente errores, avisos y supuestos conservadores, para que los usuarios entiendan el contexto y sepan qué hacer cuando su caso no encaja.

**Criterios de Aceptación:**
* **CA1:** Mensajes diferenciados para error duro, aviso y fallback
* **CA2:** Disclaimer visible en resultados con texto consensuado
* **CA3:** Copy alineado con el tono de la web y validado por Fran

**Definition of Done:**
* Mensajes implementados en desktop y móvil
* Probados escenarios: error, aviso, fallback
* Revisión de copy por Fran

---

## 🎯 Objetivo de la Revisión

Verificar que la implementación cumple con:
1. **Mensajes claros y diferenciados:** Error vs Aviso vs Fallback
2. **Disclaimer visible y profesional**
3. **Copy coherente con tono de la web**
4. **Responsive:** Funciona en desktop y mobile
5. **Tests completos:** Cubren todos los escenarios

---

## ✅ Checklist de Revisión

### 1. Mensajes de Validación Actualizados

**Acción:** Leer `lib/calculator/validation.ts`

**Verificar:**
- [ ] Mensaje cloudSpendMonthly > 500K actualizado a:  
  "Parece muy alto (>500K€/mes). Si es correcto, contáctanos para caso específico"
- [ ] Resto de mensajes de validación permanecen igual (cloudSpendMonthly < 100, manual, forecast)

**Criterios de FALLO (❌):**
- Mensaje cloudSpendMonthly > 500K no actualizado
- Otros mensajes cambiaron sin justificación

---

### 2. Mensajes de Warnings Actualizados

**Acción:** Leer `lib/calculator/validation.ts` función `getCalculatorWarnings`

**Verificar:**
- [ ] Warning cloud-coherencia actualizado:  
  "⚠️ Gasto cloud alto (>20% facturación). Si el dato es correcto, perfecto. Si no, corrígelo para un cálculo más preciso."
  
- [ ] Warning forecast-coherencia actualizado:  
  "⚠️ Error de forecast muy alto (>50%). Corrige el valor si es un error o valida el ROI con datos reales antes de presentarlo."
  
- [ ] Warning roi-extremo actualizado:  
  "⚠️ ROI extremo (> 1.000%). Este resultado indica una oportunidad muy significativa, pero debe validarse en una consulta personalizada."

**Criterios de FALLO (❌):**
- Mensajes no actualizados o con copy diferente al especificado
- Emojis faltantes (⚠️)
- Tono alarmista o negativo

---

### 3. Mensaje de Fallback Implementado

**Acción:** Leer `components/calculator/Step3Results.tsx`

**Verificar:**
- [ ] Detecta estado fallback: `!hasData`
- [ ] Muestra mensaje en lugar de cards con "N/A":  
  "ℹ️ No hemos podido calcular el ROI porque faltan datos. Vuelve al paso anterior y selecciona al menos un dolor con sus valores."
- [ ] Diseño: callout neutral (bg-slate-50, border-slate-300)
- [ ] NO muestra las 4 cards de métricas cuando `!hasData`

**Criterios de FALLO (❌):**
- Mensaje fallback no implementado
- Muestra "N/A" repetido en lugar de mensaje claro
- Cards de métricas visibles cuando no hay datos

---

### 4. Disclaimer de Supuestos Implementado

**Acción:** Leer `components/calculator/Step3Results.tsx`

**Verificar:**
- [ ] Disclaimer visible solo si `hasData === true`
- [ ] Texto del disclaimer:  
  "ℹ️ Supuestos conservadores
  
  Este cálculo usa supuestos conservadores basados en casos reales. Los resultados son orientativos y no constituyen una oferta comercial vinculante. Para un diagnóstico preciso, agenda una sesión de 30 minutos gratuita."
  
- [ ] Incluye link a Calendly funcional (`NEXT_PUBLIC_CALENDLY_URL`)
- [ ] Link tiene `target="_blank"` y `rel="noopener noreferrer"`
- [ ] Diseño: callout info (bg-blue-50, border-blue-200, text-blue-800)

**Criterios de FALLO (❌):**
- Disclaimer no visible o visible cuando `!hasData`
- Copy diferente o incompleto
- Link a Calendly faltante o roto
- Diseño inconsistente

---

### 5. Warnings Visuales Mejorados

**Acción:** Leer `components/calculator/Step3Results.tsx`

**Verificar:**
- [ ] Sección warnings tiene título con emoji: "⚠️ Avisos de coherencia"
- [ ] Diseño: bg-amber-50, border-amber-300
- [ ] Lista de warnings se muestra correctamente
- [ ] Solo visible si `warnings.length > 0`

**Criterios de FALLO (❌):**
- Emoji faltante en título
- Diseño inconsistente (colores diferentes)
- Warnings no se muestran correctamente

---

### 6. Tests Actualizados

**Acción:** Leer y ejecutar tests

**Archivos a verificar:**
- [ ] `__tests__/calculator/validation.test.ts`: Tests actualizados con nuevos mensajes
- [ ] `__tests__/components/ROICalculator.test.tsx`: Test de estado fallback
- [ ] `__tests__/e2e/calculator.spec.ts`: Tests E2E para fallback, disclaimer, warnings

**Ejecutar:**
```bash
npm test
npm run test:e2e
```

**Verificar:**
- [ ] Todos los tests VERDES
- [ ] Test fallback: sin pains seleccionados → mensaje fallback visible
- [ ] Test disclaimer: ROI calculado → disclaimer con link Calendly visible
- [ ] Test warnings: datos con avisos → warnings visibles

**Criterios de FALLO (❌):**
- Tests fallan
- Tests no cubren escenarios (fallback, disclaimer, warnings)
- Tests comentados o skipped sin justificación

---

### 7. Responsive (Desktop + Mobile)

**Acción:** Revisar tests E2E o verificar manualmente en modo dev

**Verificar:**
- [ ] Mensajes de error visibles en mobile (viewport 375px)
- [ ] Callouts (fallback, disclaimer, warnings) se adaptan a mobile
- [ ] Padding adecuado en mobile (no texto pegado a bordes)
- [ ] Links Calendly tap-friendly (min 44px altura)

**Criterios de FALLO (❌):**
- Texto cortado o ilegible en mobile
- Callouts con scroll horizontal
- Links difíciles de pulsar en mobile

---

### 8. Copy y Tono

**Acción:** Revisar todos los mensajes nuevos/modificados

**Verificar:**
- [ ] Tono profesional pero cercano (no técnico, no alarmista)
- [ ] Mensajes accionables (indican qué hacer)
- [ ] Coherente con tono del resto de la web
- [ ] Sin errores ortográficos o gramaticales

**Mensajes a revisar:**
1. cloudSpendMonthly > 500K
2. cloud-coherencia
3. forecast-coherencia
4. roi-extremo
5. Fallback
6. Disclaimer

**Criterios de FALLO (❌):**
- Tono técnico o alarmista
- Mensajes vagos ("Error", "Aviso")
- Inconsistente con tono de la web
- Errores ortográficos

---

### 9. Verificación Visual (Screenshots)

**Acción:** Revisar informe de implementación con screenshots

**Verificar:**
- [ ] Screenshot estado error (Step2 con campo rojo)
- [ ] Screenshot estado aviso (Step3 con warnings amarillos)
- [ ] Screenshot estado fallback (Step3 con mensaje neutral)
- [ ] Screenshot disclaimer visible (Step3 con ROI calculado)

**Criterios de FALLO (❌):**
- Screenshots faltantes o no claros
- Estados visuales no diferenciados
- Diseño roto o inconsistente

---

## 📤 Output: Informe de Revisión

**Archivo:** `FJG-92-informe-revision.md` (generar en misma carpeta)

**Estructura del informe:**

```markdown
# Informe de Revisión - FJG-92

## Veredicto: [✅ APROBADO | ⚠️ APROBADO CON OBSERVACIONES | ❌ RECHAZADO]

## 1. Mensajes de Validación
- Estado: [✅ | ⚠️ | ❌]
- cloudSpendMonthly > 500K: [✅ | ❌] - ...
- Observaciones: ...

## 2. Mensajes de Warnings
- Estado: [✅ | ⚠️ | ❌]
- cloud-coherencia: [✅ | ❌] - ...
- forecast-coherencia: [✅ | ❌] - ...
- roi-extremo: [✅ | ❌] - ...

## 3. Mensaje de Fallback
- Estado: [✅ | ⚠️ | ❌]
- Detecta !hasData: [✅ | ❌]
- Mensaje claro: [✅ | ❌]
- Diseño correcto: [✅ | ❌]

## 4. Disclaimer
- Estado: [✅ | ⚠️ | ❌]
- Visible solo si hasData: [✅ | ❌]
- Copy completo: [✅ | ❌]
- Link Calendly funcional: [✅ | ❌]

## 5. Warnings Visuales
- Estado: [✅ | ⚠️ | ❌]
- Emoji en título: [✅ | ❌]
- Diseño consistente: [✅ | ❌]

## 6. Tests
- Estado: [✅ | ⚠️ | ❌]
- Resultado ejecución: [todos verdes | X fallos]
- Test fallback: [✅ | ❌]
- Test disclaimer: [✅ | ❌]
- Test warnings: [✅ | ❌]

## 7. Responsive
- Estado: [✅ | ⚠️ | ❌]
- Mobile 375px: [✅ | ❌]
- Callouts adaptados: [✅ | ❌]

## 8. Copy y Tono
- Estado: [✅ | ⚠️ | ❌]
- Tono profesional: [✅ | ❌]
- Sin errores ortográficos: [✅ | ❌]
- Coherente con web: [✅ | ❌]

## Resumen de Issues Encontrados
[Lista numerada de problemas, si los hay]

## Recomendaciones para Fran
[Copy específico que requiere validación final]

## Aprobación Final
- [ ] Código listo para merge
- [ ] Requiere correcciones (ver issues)
- [ ] Requiere validación de copy por Fran
```

---

## 🚨 Criterios de Veredicto

### ✅ APROBADO
- Todos los mensajes implementados según especificación
- Tests verdes y cubren todos los escenarios
- Responsive funciona correctamente
- Copy profesional y coherente
- **Pendiente:** Validación final de copy por Fran (post-merge o pre-merge según urgencia)

### ⚠️ APROBADO CON OBSERVACIONES
- Mensajes implementados pero copy podría mejorarse (sugerencias no bloqueantes)
- Tests verdes pero podrían ser más específicos
- Pequeños ajustes visuales recomendados
- **Pendiente:** Validación de copy por Fran ANTES de merge

### ❌ RECHAZADO
- Mensajes no implementados o incorrectos
- Tests fallan o no cubren escenarios
- Responsive roto
- Copy con errores o tono incorrecto
- Diseño inconsistente

---

## 🔗 Referencias

- **Issue Linear:** [FJG-92](https://linear.app/fjgaparicio/issue/FJG-92)
- **Prompt Implementación:** `FJG-92-prompt-implementacion.md`
- **Constitución:** `.prompts/CONSTITUCION.md`
- **Roles:** `.prompts/ROLES.md`

---

**RECORDATORIO:**  
Como Reviewer, tu rol es **SOLO LECTURA**. NO corrijas código, NO generes bloques de código en el chat. Si encuentras errores, documéntalos en el informe y rechaza la tarea (❌) para que el Developer la corrija.

**CRÍTICO:** El copy final de todos los mensajes debe ser validado por Fran. Si hay dudas sobre el tono o redacción, incluir en el informe para que Fran lo revise antes o después del merge según urgencia.
