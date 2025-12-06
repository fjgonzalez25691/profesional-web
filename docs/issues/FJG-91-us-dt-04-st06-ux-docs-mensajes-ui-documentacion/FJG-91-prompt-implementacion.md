# FJG-91: Prompt de Implementación
## US-DT-04-ST06-UX-DOCS – Mensajes de UI y documentación de la calculadora

**Rol:** Agent Developer  
**Issue Linear:** FJG-91  
**Estimación:** 1 SP  
**Prioridad:** Medium

---

## 📋 Contexto de la Issue (desde Linear)

**User Story:**  
Como Fran, quiero que los mensajes de la calculadora y los ejemplos documentados reflejen el nuevo modelo de cálculo, para que la herramienta transmita credibilidad y los outputs sean comprensibles para negocio.

**Descripción:**
* Redactar y mostrar mensajes de: errores de validación (inputs fuera de rango), avisos de coherencia (gasto cloud > X% facturación, errores de forecast extremos, etc.), avisos de ROI extremo (cuando se muestra `> 1.000%` o similar).
* Actualizar `CALCULADORA_ROI.md` (y texto de la web si aplica) con: 2–3 ejemplos realistas (no sensacionalistas), sección diferenciada si se quiere mencionar casos extremos.

**Criterios de Aceptación:**
* **CA1:** Todos los casos de error/aviso definidos en las subtareas se reflejan con mensajes claros en la interfaz.
* **CA2:** La documentación de la calculadora contiene ejemplos alineados con el nuevo modelo (mismos órdenes de magnitud que la herramienta).
* **CA3:** No se muestran en la parte principal de la comunicación ejemplos con ROIs "milagrosos" sin contexto.

**Definition of Done:**
* Mensajes de error/aviso implementados y revisados en la UI.
* Documentación actualizada con nuevos ejemplos.
* Revisión de texto final por Fran.

---

## 🎯 Objetivo de la Implementación

Mejorar la experiencia de usuario y la credibilidad de la calculadora ROI mediante:
1. **Validaciones y mensajes de error claros** en inputs fuera de rango
2. **Avisos de coherencia** para valores sospechosos (ej. cloud > 20% facturación)
3. **Avisos de ROI extremo** cuando se supera el cap de 1.000%
4. **Documentación actualizada** con ejemplos realistas y conservadores

---

## 📐 Análisis del Código Actual

### Archivos Relevantes
```
profesional-web/
├── lib/calculator/
│   ├── calculateROI.ts          # Lógica de cálculo con ROI_CAP_PERCENT = 1000
│   └── types.ts                  # Types (ROIResult incluye inventorySavingsCapped)
├── components/calculator/
│   ├── Step2Pains.tsx            # Inputs de dolores (muestra errors pero sin validaciones)
│   └── Step3Results.tsx          # Resultados (ya muestra aviso inventorySavingsCapped)
└── docs/
    └── CALCULADORA_ROI.md        # Documentación técnica (ejemplos desactualizados)
```

### Estado Actual
- **Step2Pains.tsx:** Acepta prop `errors` pero NO implementa validaciones específicas
- **Step3Results.tsx:** Ya muestra aviso cuando `inventorySavingsCapped === true`
- **calculateROI.ts:** Tiene constantes como `ROI_CAP_PERCENT`, `CLOUD_SAVINGS_RATE`, etc.
- **CALCULADORA_ROI.md:** Documentación pre-FJG-86 a FJG-90 (ejemplos desactualizados)

---

## 🧪 Plan TDD

### PASO 1: Tests de Validación de Inputs (RED → GREEN → REFACTOR)

**Archivo:** `__tests__/calculator/validation.test.ts` (NUEVO)

**Tests a implementar:**
1. **Test: Validación cloudSpendMonthly**
   - Input < 100 → error "El gasto mínimo es 100€/mes"
   - Input > 500,000 → error "¿Más de 500K€/mes? Verifica el dato"
   - Input válido → sin error

2. **Test: Validación manualHoursWeekly**
   - Input < 1 → error "Introduce al menos 1 hora/semana"
   - Input > 168 → error "Una semana tiene 168 horas máximo"
   - Input válido → sin error

3. **Test: Validación forecastErrorPercent**
   - Input < 1 → error "El error mínimo es 1%"
   - Input > 100 → error "El error máximo razonable es 100%"
   - Input válido → sin error

**Implementación:**
- Crear función `validateCalculatorInputs(inputs)` en `lib/calculator/validation.ts`
- Retorna objeto con errores por campo: `{ cloudSpendMonthly?: string, ... }`

---

### PASO 2: Tests de Avisos de Coherencia (RED → GREEN → REFACTOR)

**Archivo:** `__tests__/calculator/warnings.test.ts` (NUEVO)

**Tests a implementar:**
1. **Test: Aviso cloud > 20% facturación**
   - Empresa 5-10M (facturación ~8M) + cloud 150K€/mes → warning
   - Empresa 50M+ + cloud 150K€/mes → sin warning

2. **Test: Aviso forecast error > 50%**
   - Input forecastErrorPercent > 50 → warning "Error muy alto, revisa"
   - Input < 50 → sin warning

**Implementación:**
- Crear función `getCalculatorWarnings(inputs, result)` en `lib/calculator/validation.ts`
- Retorna array de warnings: `{ type: string, message: string }[]`
- Integrar en `ROIResult` o como prop separada

---

### PASO 3: Tests de Mensajes ROI Extremo (RED → GREEN → REFACTOR)

**Archivo:** `__tests__/calculator/calculateROI.test.ts` (EXTENDER)

**Tests a implementar:**
1. **Test: ROI > 1.000% muestra mensaje específico**
   - Verificar que `formatRoiWithCap` ya existe y funciona
   - Agregar test para mensaje UI cuando `roiDisplay.isCapped === true`

**Implementación:**
- **YA EXISTE:** `formatRoiWithCap(roi3Years)` retorna `{ label, isCapped }`
- **YA EXISTE:** Step3Results.tsx muestra "Caso extremo (ROI cap aplicado)" cuando `roiDisplay.isCapped`
- **NUEVA ACCIÓN:** Agregar mensaje más detallado en UI

---

### PASO 4: Tests de Documentación (MANUAL)

**Archivo:** `docs/CALCULADORA_ROI.md`

**Acciones:**
1. **Actualizar sección "Ejemplos de Cálculo"**
   - Reemplazar ejemplos con ROIs sensacionalistas
   - Agregar 2-3 ejemplos realistas con nuevo modelo:
     - Ejemplo 1: Empresa 10-25M, cloud 5K€/mes → ROI ~150-200%
     - Ejemplo 2: Empresa 25-50M, procesos manuales 40h/sem → ROI ~180-250%
     - Ejemplo 3: Empresa 50M+, forecasting error 25% → ROI ~120-180%

2. **Agregar sección "Casos Extremos"**
   - Explicar cuándo y por qué aparece `> 1.000%`
   - Contexto: "Este resultado indica una oportunidad de mejora muy significativa, pero debe validarse con datos reales en un diagnóstico personalizado"

---

### PASO 5: Integración en UI (RED → GREEN → REFACTOR)

**Archivos a modificar:**
1. **Step2Pains.tsx:**
   - Agregar lógica para llamar `validateCalculatorInputs` al cambiar inputs
   - Mostrar errores debajo de cada input (ya existe estructura para `errors`)

2. **Step3Results.tsx:**
   - Agregar sección de "Avisos de coherencia" si `warnings.length > 0`
   - Mejorar mensaje de ROI extremo cuando `roiDisplay.isCapped`

3. **ROICalculator.tsx (parent component):**
   - Integrar validación y warnings en el flujo del estado

---

## 📝 Checklist de Implementación

### Tests (TDD)
- [ ] `validation.test.ts`: Tests de validación inputs (3 funciones × 3 casos)
- [ ] `warnings.test.ts`: Tests de avisos coherencia (2 tipos)
- [ ] `calculateROI.test.ts`: Extender tests ROI extremo
- [ ] Todos los tests VERDES antes de modificar UI

### Código
- [ ] `lib/calculator/validation.ts`: Funciones `validateCalculatorInputs` y `getCalculatorWarnings`
- [ ] `lib/calculator/types.ts`: Agregar tipo `CalculatorWarning` si necesario
- [ ] `components/calculator/Step2Pains.tsx`: Integrar validación en inputs
- [ ] `components/calculator/Step3Results.tsx`: Mostrar warnings + mejorar mensaje ROI extremo
- [ ] `components/calculator/ROICalculator.tsx`: Orquestar validación/warnings

### Documentación
- [ ] `docs/CALCULADORA_ROI.md`: Actualizar ejemplos (3 nuevos realistas)
- [ ] `docs/CALCULADORA_ROI.md`: Agregar sección "Casos Extremos"
- [ ] Verificar que ejemplos coincidan con órdenes de magnitud del código

---

## 🚨 Restricciones y Consideraciones

### Navaja de Ockham
- **NO** crear nuevos componentes complejos para avisos (usar alerts simples inline)
- **NO** sobre-validar: solo casos críticos mencionados en la issue
- **Reutilizar** estructura de `errors` ya existente en Step2Pains

### Validaciones Específicas
**Rangos conservadores basados en contexto real:**
- Cloud: 100€ - 500K€/mes (contexto: startups a enterprise)
- Horas manuales: 1 - 168 h/semana (max = semana completa)
- Forecast error: 1% - 100% (context: forecasting razonable)

**Warnings de coherencia:**
- Cloud > 20% facturación anual → sospechoso
- Forecast error > 50% → revisar dato

### Mensajes de Usuario
- **Tono:** Profesional pero cercano
- **Formato:** Claro y accionable
- **Ejemplo error:** "El gasto mínimo es 100€/mes"
- **Ejemplo warning:** "⚠️ El gasto cloud parece alto respecto a tu facturación. Verifica el dato."
- **Ejemplo ROI extremo:** "Este resultado indica una oportunidad muy significativa. Te recomendamos validarlo en una consulta personalizada."

---

## 📤 Output Esperado

### 1. Informe de Implementación
Al finalizar, genera `FJG-91-informe-implementacion.md` en esta carpeta con:
- Resumen de cambios (archivos modificados/creados)
- Resultados de tests (output de `npm test`)
- Ejemplos de mensajes implementados (screenshots o código)
- Confirmación de actualización de documentación

### 2. Archivos Generados/Modificados
```
profesional-web/
├── __tests__/calculator/
│   ├── validation.test.ts       # NUEVO
│   ├── warnings.test.ts         # NUEVO
│   └── calculateROI.test.ts     # EXTENDIDO
├── lib/calculator/
│   └── validation.ts             # NUEVO
├── components/calculator/
│   ├── Step2Pains.tsx            # MODIFICADO
│   ├── Step3Results.tsx          # MODIFICADO
│   └── ROICalculator.tsx         # MODIFICADO (si necesario)
└── docs/
    └── CALCULADORA_ROI.md        # MODIFICADO
```

---

## 🎬 Orden de Ejecución

1. **Crear tests de validación** (`validation.test.ts`) → RED
2. **Implementar funciones de validación** → GREEN
3. **Crear tests de warnings** (`warnings.test.ts`) → RED
4. **Implementar funciones de warnings** → GREEN
5. **Extender tests ROI extremo** → verificar GREEN
6. **Integrar validación en Step2Pains** → tests E2E
7. **Integrar warnings en Step3Results** → tests E2E
8. **Actualizar documentación CALCULADORA_ROI.md**
9. **Ejecutar suite completa de tests**
10. **Generar informe de implementación**

---

## 🔗 Referencias

- **Issue Linear:** [FJG-91](https://linear.app/fjgaparicio/issue/FJG-91)
- **Branch Git:** `fjgonzalez25691-fjg-91-us-dt-04-st06-ux-docs-mensajes-de-ui-y-documentacion-de-la`
- **Issues relacionadas:** FJG-86 (Core), FJG-87 (Cloud), FJG-88 (Manual), FJG-89 (Forecast), FJG-90 (Inventory)
- **Documentación actual:** `docs/CALCULADORA_ROI.md`

---

**RECORDATORIO FINAL:**  
Este prompt está verificado contra la issue Linear FJG-91. Cualquier duda o conflicto con los requisitos, **PARAR** y consultar con Fran antes de continuar.
