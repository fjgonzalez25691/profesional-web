# FJG-92: Prompt de Implementación
## US-DT-04-ST05-UX – Mensajes de UI y experiencia de usuario

**Rol:** Agent Developer  
**Issue Linear:** FJG-92  
**Estimación:** 2 SP  
**Prioridad:** Medium

---

## 📋 Contexto de la Issue (desde Linear)

**User Story:**  
Como Fran, quiero que la interfaz de la calculadora explique claramente errores, avisos y supuestos conservadores, para que los usuarios entiendan el contexto y sepan qué hacer cuando su caso no encaja.

**Alcance:**
* Mensajes de error (inputs fuera de rango)
* Avisos de coherencia (inputs altos pero no bloqueantes)
* Mensaje de fallback (cuando no se calcula ROI)
* Disclaimer en resultados: supuestos conservadores y no oferta vinculante
* Ajustes visuales (estados: error, aviso, fallback)

**Criterios de Aceptación:**
* **CA1:** Mensajes diferenciados para error duro, aviso y fallback
* **CA2:** Disclaimer visible en resultados con texto consensuado
* **CA3:** Copy alineado con el tono de la web y validado por Fran

**Definition of Done:**
* Mensajes implementados en desktop y móvil
* Probados escenarios: error, aviso, fallback
* Revisión de copy por Fran

---

## 🎯 Objetivo de la Implementación

Mejorar la experiencia de usuario de la calculadora ROI mediante:
1. **Mensajes diferenciados** (error vs aviso vs fallback)
2. **Disclaimer claro** sobre supuestos conservadores
3. **Estados visuales** consistentes
4. **Copy profesional** alineado con tono de la web

---

## 📐 Estado Actual (Post FJG-91)

### Archivos Relevantes
```
profesional-web/
├── lib/calculator/
│   ├── validation.ts             # Validaciones y warnings YA implementados
│   └── types.ts                  # CalculatorWarning type definido
├── components/calculator/
│   ├── Step2Pains.tsx            # Muestra errors (rojo)
│   └── Step3Results.tsx          # Muestra warnings (amarillo)
```

### Funcionalidad Existente (FJG-91)
✅ **Validaciones implementadas:**
- cloudSpendMonthly: 100€ - 500K€/mes
- manualHoursWeekly: 1 - 168 horas/semana
- forecastErrorPercent: 1% - 100%

✅ **Warnings implementados:**
- Cloud > 20% facturación
- Forecast error > 50%
- ROI extremo (> 1.000%)

✅ **Mensajes actuales:**
- Errors en Step2Pains (texto rojo)
- Warnings en Step3Results (callout amarillo)
- Aviso inventorySavingsCapped (callout amarillo)

---

## 🆕 Cambios Necesarios (FJG-92)

### 1. Mensaje de Fallback (cuando NO se calcula ROI)

**Contexto:** Si usuario no selecciona ningún pain o no introduce datos, `result` es `{investment: 0, savingsAnnual: 0, ...}`

**Acción:**
- Detectar estado fallback: `!hasData` (ya existe en Step3Results)
- Mostrar mensaje claro en lugar de "N/A" repetido
- Sugerir acción: "Selecciona al menos un dolor e introduce datos"

**Diseño visual:**
- Callout neutral (bg-slate-50, border-slate-300)
- Icono ℹ️ o similar
- Texto: "No hemos podido calcular el ROI porque faltan datos. Vuelve al paso anterior y selecciona al menos un dolor con sus valores."

---

### 2. Disclaimer de Supuestos Conservadores

**Ubicación:** Step3Results, debajo de las métricas ROI

**Copy propuesto (consensuar con Fran):**
```
ℹ️ Supuestos conservadores

Este cálculo usa supuestos conservadores basados en casos reales. 
Los resultados son orientativos y no constituyen una oferta comercial vinculante.
Para un diagnóstico preciso, agenda una sesión de 30 minutos gratuita.
```

**Diseño visual:**
- Callout info (bg-blue-50, border-blue-200, text-blue-800)
- Texto pequeño (text-sm)
- Link a Calendly destacado

---

### 3. Mejora de Mensajes de Error

**Problema actual:** Mensajes funcionan pero podrían ser más claros

**Mejoras propuestas:**

| Campo | Error Actual | Mejora Propuesta |
|-------|-------------|------------------|
| cloudSpendMonthly < 100 | "El gasto mínimo es 100€/mes" | ✅ OK (mantener) |
| cloudSpendMonthly > 500K | "¿Más de 500K€/mes? Verifica el dato" | "Parece muy alto (>500K€/mes). Si es correcto, [contáctanos para caso específico]" |
| manualHoursWeekly < 1 | "Introduce al menos 1 hora/semana" | ✅ OK (mantener) |
| manualHoursWeekly > 168 | "Una semana tiene 168 horas máximo" | ✅ OK (mantener) |
| forecastErrorPercent < 1 | "El error mínimo es 1%" | ✅ OK (mantener) |
| forecastErrorPercent > 100 | "El error máximo razonable es 100%" | ✅ OK (mantener) |

**Acción:** Actualizar solo mensaje cloudSpendMonthly > 500K para ser más orientativo

---

### 4. Mejora de Avisos de Coherencia

**Problema actual:** Mensajes funcionan pero podrían ser más accionables

**Mejoras propuestas:**

| Tipo | Warning Actual | Mejora Propuesta |
|------|---------------|------------------|
| cloud-coherencia | "El gasto cloud parece alto respecto a tu facturación estimada (>20%). Verifica el dato antes de usar este ROI." | "⚠️ Gasto cloud alto (>20% facturación). Si el dato es correcto, perfecto. Si no, corrígelo para un cálculo más preciso." |
| forecast-coherencia | "El error de forecast es muy alto (>50%). Revisa el dato para que el ROI sea realista." | "⚠️ Error de forecast muy alto (>50%). Corrige el valor si es un error o valida el ROI con datos reales antes de presentarlo." |
| roi-extremo | "Resultado extremo (> 1.000%). Valídalo con datos reales antes de presentarlo." | "⚠️ ROI extremo (> 1.000%). Este resultado indica una oportunidad muy significativa, pero debe validarse en una consulta personalizada." |

**Acción:** Actualizar mensajes en `lib/calculator/validation.ts`

---

### 5. Estados Visuales Consistentes

**Definir jerarquía visual clara:**

| Estado | Color | Borde | Icono | Uso |
|--------|-------|-------|-------|-----|
| **Error** | red-50 | red-600 | ❌ | Bloquea cálculo (Step2) |
| **Warning** | amber-50 | amber-300 | ⚠️ | No bloquea, pero alerta (Step3) |
| **Info** | blue-50 | blue-200 | ℹ️ | Disclaimer neutral (Step3) |
| **Fallback** | slate-50 | slate-300 | ℹ️ | No hay datos (Step3) |

**Acción:**
- Crear componente reutilizable `<Alert variant="error|warning|info">` (opcional, evaluar complejidad)
- O usar clases Tailwind consistentes sin crear componente nuevo

---

## 🧪 Plan de Implementación

### PASO 1: Actualizar Mensajes de Validación

**Archivo:** `lib/calculator/validation.ts`

**Cambios:**
1. Actualizar mensaje cloudSpendMonthly > 500K:
```typescript
errors.cloudSpendMonthly = 'Parece muy alto (>500K€/mes). Si es correcto, contáctanos para caso específico';
```

**Tests:** Actualizar `__tests__/calculator/validation.test.ts` con nuevo mensaje esperado

---

### PASO 2: Actualizar Mensajes de Warnings

**Archivo:** `lib/calculator/validation.ts`

**Cambios:**
1. Actualizar mensaje cloud-coherencia
2. Actualizar mensaje forecast-coherencia  
3. Actualizar mensaje roi-extremo

**Tests:** Actualizar `__tests__/calculator/validation.test.ts` con nuevos mensajes

---

### PASO 3: Implementar Mensaje de Fallback

**Archivo:** `components/calculator/Step3Results.tsx`

**Cambios:**
1. Detectar estado fallback: `!hasData`
2. Si fallback, mostrar mensaje en lugar de las 4 cards con "N/A":
```tsx
{!hasData && (
  <div className="rounded-lg border border-slate-300 bg-slate-50 p-4">
    <p className="text-sm text-slate-700">
      ℹ️ No hemos podido calcular el ROI porque faltan datos. 
      Vuelve al paso anterior y selecciona al menos un dolor con sus valores.
    </p>
  </div>
)}
```

**Tests:** Agregar test en `__tests__/components/ROICalculator.test.tsx` para estado fallback

---

### PASO 4: Implementar Disclaimer de Supuestos

**Archivo:** `components/calculator/Step3Results.tsx`

**Cambios:**
1. Agregar sección de disclaimer después de las métricas ROI
2. Incluir link a Calendly
3. Solo mostrar si `hasData === true`

```tsx
{hasData && (
  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
    <p className="text-sm font-semibold text-blue-800">ℹ️ Supuestos conservadores</p>
    <p className="mt-1 text-sm text-blue-700">
      Este cálculo usa supuestos conservadores basados en casos reales. 
      Los resultados son orientativos y no constituyen una oferta comercial vinculante.
      Para un diagnóstico preciso,{' '}
      <a 
        href={process.env.NEXT_PUBLIC_CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline"
      >
        agenda una sesión de 30 minutos gratuita
      </a>.
    </p>
  </div>
)}
```

**Tests:** Verificar que disclaimer aparece solo cuando `hasData === true`

---

### PASO 5: Mejorar Warnings Visuales

**Archivo:** `components/calculator/Step3Results.tsx`

**Cambios:**
1. Mejorar estructura del callout de warnings existente
2. Agregar icono ⚠️ al título
3. Mantener border-amber-300 (no cambiar)

```tsx
{warnings.length > 0 && (
  <div className="mt-4 space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-4">
    <p className="text-sm font-semibold text-amber-800">⚠️ Avisos de coherencia</p>
    <ul className="space-y-1 text-sm text-amber-900">
      {warnings.map((warning) => (
        <li key={warning.type}>{warning.message}</li>
      ))}
    </ul>
  </div>
)}
```

---

### PASO 6: Tests Responsivos (Desktop + Mobile)

**Archivos:** `__tests__/e2e/calculator.spec.ts`

**Tests a agregar:**
1. **Test fallback:** Usuario no selecciona pains → mensaje fallback visible
2. **Test disclaimer:** ROI calculado → disclaimer visible con link Calendly
3. **Test warnings:** Inputs coherentes → warnings visibles
4. **Test responsive:** Verificar que mensajes se ven bien en mobile (viewport 375px)

---

## 📝 Checklist de Implementación

### Mensajes
- [ ] Actualizar mensaje cloudSpendMonthly > 500K en validation.ts
- [ ] Actualizar mensajes de warnings (cloud, forecast, roi-extremo) en validation.ts
- [ ] Tests de validación actualizados con nuevos mensajes

### Fallback
- [ ] Implementar mensaje fallback en Step3Results cuando !hasData
- [ ] Test para estado fallback (sin pains seleccionados)

### Disclaimer
- [ ] Implementar disclaimer supuestos conservadores en Step3Results
- [ ] Incluir link a Calendly
- [ ] Solo mostrar si hasData === true
- [ ] Test para disclaimer visible/oculto

### Warnings
- [ ] Mejorar estructura visual de warnings (icono ⚠️)
- [ ] Verificar que warnings se muestran correctamente

### Tests E2E
- [ ] Test fallback (sin datos)
- [ ] Test disclaimer (con ROI calculado)
- [ ] Test warnings (datos con avisos)
- [ ] Test responsive mobile (viewport 375px)

---

## 🚨 Restricciones y Consideraciones

### Navaja de Ockham
- **NO** crear componente `<Alert>` reutilizable si solo se usa en 2-3 lugares
- **Reutilizar** clases Tailwind directamente (más simple)
- **NO** agregar iconos externos (usar emojis: ℹ️ ⚠️ ❌)

### Copy y Tono
- **Profesional pero cercano:** No técnico, no alarmista
- **Accionable:** Indicar qué hacer ("corrige el valor", "agenda sesión")
- **Honesto:** "Supuestos conservadores", "orientativo"
- **IMPORTANTE:** Copy final debe ser validado por Fran antes de merge

### Responsive
- Todos los mensajes deben verse bien en mobile (min-width: 320px)
- Callouts deben tener padding adecuado en mobile
- Links deben ser tap-friendly (min 44px altura)

---

## 📤 Output Esperado

### 1. Informe de Implementación
Al finalizar, genera `FJG-92-informe-implementacion.md` en esta carpeta con:
- Resumen de cambios (archivos modificados)
- Screenshots de los 3 estados: error, aviso, fallback
- Resultados de tests (output de `npm test` y `npm run test:e2e`)
- Confirmación de que copy está listo para revisión de Fran

### 2. Archivos Generados/Modificados
```
profesional-web/
├── lib/calculator/
│   └── validation.ts             # MODIFICADO (mensajes actualizados)
├── components/calculator/
│   └── Step3Results.tsx          # MODIFICADO (fallback + disclaimer + warnings mejorados)
├── __tests__/calculator/
│   └── validation.test.ts        # MODIFICADO (tests actualizados)
├── __tests__/components/
│   └── ROICalculator.test.tsx    # MODIFICADO (test fallback)
└── __tests__/e2e/
    └── calculator.spec.ts        # MODIFICADO (tests E2E completos)
```

---

## 🎬 Orden de Ejecución

1. **Actualizar mensajes validation.ts** → tests unitarios
2. **Implementar fallback Step3Results** → test componente
3. **Implementar disclaimer Step3Results** → test componente
4. **Mejorar warnings visuales Step3Results** → verificar UI
5. **Tests E2E completos** → verificar flujo end-to-end
6. **Tests responsive** → verificar mobile
7. **Generar informe de implementación**

---

## 🔗 Referencias

- **Issue Linear:** [FJG-92](https://linear.app/fjgaparicio/issue/FJG-92)
- **Branch Git:** `fjgonzalez25691-fjg-92-us-dt-04-st05-ux-mensajes-de-ui-y-experiencia-de-usuario`
- **Issue relacionada:** FJG-91 (validaciones base implementadas)
- **Calendly URL:** Variable `NEXT_PUBLIC_CALENDLY_URL` en .env.local

---

**RECORDATORIO FINAL:**  
Este prompt está verificado contra la issue Linear FJG-92. El **copy final** de todos los mensajes debe ser validado por Fran antes del merge. Cualquier duda sobre el tono o redacción, **PARAR** y consultar.
