# FJG-91: Prompt de Revisión
## US-DT-04-ST06-UX-DOCS – Mensajes de UI y documentación de la calculadora

**Rol:** Agent Reviewer  
**Issue Linear:** FJG-91  
**Estimación:** 1 SP  
**Prioridad:** Medium

---

## 📋 Contexto de la Issue (desde Linear)

**User Story:**  
Como Fran, quiero que los mensajes de la calculadora y los ejemplos documentados reflejen el nuevo modelo de cálculo, para que la herramienta transmita credibilidad y los outputs sean comprensibles para negocio.

**Criterios de Aceptación:**
* **CA1:** Todos los casos de error/aviso definidos en las subtareas se reflejan con mensajes claros en la interfaz.
* **CA2:** La documentación de la calculadora contiene ejemplos alineados con el nuevo modelo (mismos órdenes de magnitud que la herramienta).
* **CA3:** No se muestran en la parte principal de la comunicación ejemplos con ROIs "milagrosos" sin contexto.

**Definition of Done:**
* Mensajes de error/aviso implementados y revisados en la UI.
* Documentación actualizada con nuevos ejemplos.
* Revisión de texto final por Fran.

---

## 🎯 Objetivo de la Revisión

Verificar que la implementación cumple con:
1. **Funcionalidad:** Validaciones, avisos y mensajes funcionan correctamente
2. **Credibilidad:** Mensajes son claros, profesionales y no alarmistas
3. **Documentación:** Ejemplos son realistas y alineados con el código
4. **Seguridad:** No hay exposición de datos sensibles en mensajes
5. **Mantenibilidad:** Código es simple y sigue la Navaja de Ockham

---

## ✅ Checklist de Revisión

### 1. Verificación de Tests (CRÍTICO)

**Acción:** Leer archivos de tests y ejecutar suite completa

**Archivos a revisar:**
- [ ] `__tests__/calculator/validation.test.ts` existe y tiene al menos 9 tests (3 campos × 3 casos)
- [ ] `__tests__/calculator/warnings.test.ts` existe y tiene al menos 2 tests
- [ ] `__tests__/calculator/calculateROI.test.ts` extendido con tests ROI extremo
- [ ] **Ejecutar:** `npm test` → todos los tests VERDES

**Criterios de FALLO (❌):**
- Tests no existen o están comentados
- Tests fallan (cualquier test en rojo)
- Coverage < 80% en archivos nuevos/modificados

---

### 2. Revisión de Validaciones de Inputs

**Acción:** Leer `lib/calculator/validation.ts` y verificar lógica

**Validaciones esperadas:**
- [ ] **cloudSpendMonthly:**
  - Rechaza < 100€ con mensaje "El gasto mínimo es 100€/mes"
  - Rechaza > 500,000€ con mensaje "¿Más de 500K€/mes? Verifica el dato"
  - Acepta valores válidos sin error

- [ ] **manualHoursWeekly:**
  - Rechaza < 1 con mensaje "Introduce al menos 1 hora/semana"
  - Rechaza > 168 con mensaje "Una semana tiene 168 horas máximo"
  - Acepta valores válidos sin error

- [ ] **forecastErrorPercent:**
  - Rechaza < 1 con mensaje "El error mínimo es 1%"
  - Rechaza > 100 con mensaje "El error máximo razonable es 100%"
  - Acepta valores válidos sin error

**Criterios de FALLO (❌):**
- Mensajes confusos o técnicos (ej. "Invalid input")
- Rangos diferentes a los especificados
- Validaciones hardcodeadas en componentes (debe estar en `validation.ts`)

---

### 3. Revisión de Avisos de Coherencia

**Acción:** Leer `lib/calculator/validation.ts` función `getCalculatorWarnings`

**Warnings esperados:**
- [ ] **Cloud > 20% facturación:**
  - Calcula facturación anual desde `REVENUE_BY_SIZE[companySize]`
  - Compara `cloudSpendMonthly * 12` vs `revenue * 0.20`
  - Si supera, warning: "⚠️ El gasto cloud parece alto respecto a tu facturación. Verifica el dato."

- [ ] **Forecast error > 50%:**
  - Si `forecastErrorPercent > 50`, warning: "⚠️ Error de forecast muy alto. Revisa este dato para un cálculo preciso."

**Criterios de FALLO (❌):**
- Warnings no implementados o no se muestran en UI
- Umbrales diferentes a los especificados (20% cloud, 50% forecast)
- Warnings alarmistas o negativos (deben ser informativos)

---

### 4. Revisión de Mensajes ROI Extremo

**Acción:** Verificar que Step3Results.tsx muestra mensaje cuando `roiDisplay.isCapped`

**Comportamiento esperado:**
- [ ] Cuando `roi3Years > 1000%`:
  - Muestra `> 1.000%` (ya existe via `formatRoiWithCap`)
  - Muestra mensaje adicional: "Este resultado indica una oportunidad muy significativa. Te recomendamos validarlo en una consulta personalizada."
  - **NO** debe decir solo "Caso extremo (ROI cap aplicado)" (mensaje antiguo)

**Criterios de FALLO (❌):**
- Mensaje antiguo no actualizado
- Mensaje sensacionalista tipo "¡Increíble retorno!" o similar
- No se muestra warning cuando `isCapped === true`

---

### 5. Revisión de Integración en UI

**Acción:** Leer componentes modificados y verificar flujo

**Step2Pains.tsx:**
- [ ] Llama a `validateCalculatorInputs` cuando cambian inputs
- [ ] Muestra errores debajo de cada input usando prop `errors`
- [ ] Errores se limpian cuando input se corrige
- [ ] NO hay lógica de validación hardcodeada en el componente

**Step3Results.tsx:**
- [ ] Muestra sección de warnings si `warnings.length > 0`
- [ ] Warnings tienen formato claro (ej. alert/callout con icono ⚠️)
- [ ] Mensaje ROI extremo actualizado según especificación
- [ ] Mantiene mensaje `inventorySavingsCapped` existente

**ROICalculator.tsx (parent):**
- [ ] Orquesta estado de `errors` y `warnings`
- [ ] Pasa props correctamente a Step2 y Step3
- [ ] NO duplica lógica de validación

**Criterios de FALLO (❌):**
- Validación duplicada en múltiples componentes
- Mensajes no se muestran o tienen estilos inconsistentes
- Warnings se muestran como errors o viceversa

---

### 6. Revisión de Documentación

**Acción:** Leer `docs/CALCULADORA_ROI.md` sección "Ejemplos de Cálculo"

**Ejemplos esperados (2-3):**
- [ ] **Ejemplo 1:** Empresa 10-25M + cloud 5K€/mes → ROI ~150-200%
- [ ] **Ejemplo 2:** Empresa 25-50M + procesos manuales 40h/sem → ROI ~180-250%
- [ ] **Ejemplo 3:** Empresa 50M+ + forecasting error 25% → ROI ~120-180%

**Sección "Casos Extremos":**
- [ ] Explica cuándo aparece `> 1.000%`
- [ ] Contexto: "Debe validarse con datos reales en diagnóstico personalizado"
- [ ] Tono profesional y no alarmista

**Criterios de FALLO (❌):**
- Ejemplos con ROIs > 500% sin contexto
- Ejemplos inconsistentes con el código (calcular manualmente para verificar)
- Falta sección "Casos Extremos"
- Documentación no actualizada (mantiene ejemplos antiguos)

---

### 7. Seguridad y Buenas Prácticas

**Acción:** Revisar código para vulnerabilidades comunes

**Checklist:**
- [ ] NO hay `console.log` con datos de usuario en producción
- [ ] NO hay credenciales o API keys hardcodeadas
- [ ] Validaciones sanitizan inputs (no confiar en cliente)
- [ ] Mensajes no exponen detalles técnicos internos
- [ ] NO hay XSS: mensajes escapan caracteres especiales

**Criterios de FALLO (❌):**
- Cualquier exposición de credenciales
- Console.logs sin guardar (agregar comentario `// TODO: remove before merge`)
- Mensajes técnicos tipo "Error in function calculateROI line 42"

---

### 8. Navaja de Ockham y Mantenibilidad

**Acción:** Verificar que la solución es simple y mantenible

**Principios:**
- [ ] NO se crearon componentes nuevos innecesarios
- [ ] Validación centralizada en `lib/calculator/validation.ts`
- [ ] Mensajes definidos como constantes (no strings mágicos)
- [ ] Código DRY: no hay duplicación de lógica
- [ ] Comentarios solo donde sea necesario (código auto-explicativo)

**Criterios de FALLO (❌):**
- Over-engineering: componentes Alert complejos para casos simples
- Validaciones dispersas en múltiples archivos
- Abstracción prematura (ej. factory de validators)

---

## 📤 Output: Informe de Revisión

**Archivo:** `FJG-91-informe-revision.md` (generar en misma carpeta)

**Estructura del informe:**

```markdown
# Informe de Revisión - FJG-91

## Veredicto: [✅ APROBADO | ⚠️ APROBADO CON OBSERVACIONES | ❌ RECHAZADO]

## 1. Tests
- Estado: [✅ | ⚠️ | ❌]
- Resultado ejecución: [todos verdes | X fallos]
- Observaciones: ...

## 2. Validaciones de Inputs
- Estado: [✅ | ⚠️ | ❌]
- cloudSpendMonthly: [✅ | ❌] - ...
- manualHoursWeekly: [✅ | ❌] - ...
- forecastErrorPercent: [✅ | ❌] - ...

## 3. Avisos de Coherencia
- Estado: [✅ | ⚠️ | ❌]
- Warning cloud: [✅ | ❌] - ...
- Warning forecast: [✅ | ❌] - ...

## 4. Mensajes ROI Extremo
- Estado: [✅ | ⚠️ | ❌]
- Observaciones: ...

## 5. Integración UI
- Estado: [✅ | ⚠️ | ❌]
- Step2Pains: [✅ | ❌] - ...
- Step3Results: [✅ | ❌] - ...

## 6. Documentación
- Estado: [✅ | ⚠️ | ❌]
- Ejemplos realistas: [✅ | ❌] - ...
- Sección casos extremos: [✅ | ❌] - ...

## 7. Seguridad
- Estado: [✅ | ⚠️ | ❌]
- Observaciones: ...

## 8. Mantenibilidad
- Estado: [✅ | ⚠️ | ❌]
- Navaja de Ockham: [✅ | ❌] - ...

## Resumen de Issues Encontrados
[Lista numerada de problemas, si los hay]

## Recomendaciones
[Sugerencias opcionales, si las hay]

## Aprobación Final
- [ ] Código listo para merge
- [ ] Requiere correcciones (ver issues)
- [ ] Requiere revisión de Fran (casos específicos)
```

---

## 🚨 Criterios de Veredicto

### ✅ APROBADO
- Todos los tests verdes
- Todas las validaciones y warnings implementados según especificación
- Documentación actualizada y alineada con código
- Sin issues de seguridad
- Código simple y mantenible

### ⚠️ APROBADO CON OBSERVACIONES
- Tests verdes pero coverage bajo (<80% en archivos nuevos)
- Mensajes funcionan pero podrían mejorarse (sugerencias no bloqueantes)
- Pequeñas inconsistencias en documentación (no críticas)

### ❌ RECHAZADO
- Tests fallan o no existen
- Validaciones/warnings no implementados o incorrectos
- Documentación no actualizada o con ejemplos erróneos
- Issues de seguridad (credenciales, XSS, etc.)
- Over-engineering o violación de Navaja de Ockham

---

## 🔗 Referencias

- **Issue Linear:** [FJG-91](https://linear.app/fjgaparicio/issue/FJG-91)
- **Prompt Implementación:** `FJG-91-prompt-implementacion.md`
- **Constitución:** `.prompts/CONSTITUCION.md`
- **Roles:** `.prompts/ROLES.md`

---

**RECORDATORIO:**  
Como Reviewer, tu rol es **SOLO LECTURA**. NO corrijas código, NO generes bloques de código en el chat. Si encuentras errores, documéntalos en el informe y rechaza la tarea (❌) para que el Developer la corrija.
