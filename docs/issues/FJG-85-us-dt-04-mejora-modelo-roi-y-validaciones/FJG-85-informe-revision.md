# FJG-85: Informe de Revisión
## US-DT-04 – Mejora modelo ROI y validaciones de la calculadora de ROI

**Fecha:** 2025-12-07  
**Rol:** Agent Reviewer  
**Duración:** ~45 minutos (segunda pasada)

---

## 🎯 VEREDICTO: ❌ RECHAZADO (CA2 pendiente + CA4 a decisión de negocio)

Tras la segunda revisión: el desarrollador indica que todo está resuelto salvo CA4, a la espera de decisión de negocio. Sin embargo, CA2 sigue incumplido (paybacks <3m y ROI desorbitados con inputs válidos). CA4 sigue sin poder activarse y requiere definición de negocio (qué hacer con escenarios incoherentes/fuera de rango).

---

## ✅ Criterios de Aceptación (CA)

### CA1 – Validaciones de entrada
- [⚠] Rangos min/max implementados y errores claros en `validateCalculatorInputs`, pero la detección de incoherencias (cloud > X% revenue) no se ejerce porque el tope `cloudSpendMonthly.max` hace imposible superar el ratio configurado (0.5).  
- **Notas:** La rama de incoherencia existe pero no se prueba ni se alcanza con los límites actuales.

### CA2 – Supuestos conservadores
- [❌] Sigue habiendo paybacks <3 meses y ROI >1000% con inputs permitidos: p.ej. `cloudSpendMonthly=100000`, tamaño `50M+` arroja payback ~1.5 meses y ROI ~2300% (`lib/calculator/calculateROI.ts:140-159`) usando el nuevo rate progresivo e inversión escalada. No se aplica `minPaybackMonths=3` ni se capea ROI para estos escenarios.  
- **Impacto:** Continúa incumpliéndose el requisito de payback mínimo y rangos prudentes (CA2/DoD3).

### CA3 – Fichero de configuración
- [✅] `components/calculator/calculatorConfig.ts` centraliza parámetros; la lógica usa `roiConfig` y está tipada.

### CA4 – Fallback (crítico)
- [⚠] Pendiente de decisión de negocio: las ramas `incoherent_scenario` y `out_of_range` siguen inalcanzables con la config actual.  
  - Cloud >50% revenue no puede ocurrir con `cloudSpendMonthly.max=100000` (ratio máximo ~16%); test mantiene expectativa de `success` (`__tests__/calculator/calculateROI.test.ts:171-211`).  
  - Forecast >`extremeHigh` (80) nunca se cumple porque `max=60`; la rama cae en `invalid_inputs` (`__tests__/calculator/calculateROI.test.ts:214-229`).  
- **Resultado:** CA4 necesita definición: o se ajustan rangos/umbrales para activar fallback en incoherencias o se confirma que no se bloqueará y se adapta el CA. Hasta entonces, no verificable.

### CA5 – UI/UX
- [✅] Mensajes de error/avisos en validaciones y warnings; fallback view específica en `Step3Results.tsx`.

### CA6 – Validación masiva
- [⚠] Script v2 existe, maneja el union y tiene tests, con outputs previos (`scripts/validation-results-*.json/csv`). No se evidenció ejecución posterior al cambio de fallback del 7 dic, por lo que los artefactos no reflejan la nueva lógica.

---

## 📋 Definition of Done (DoD)

- [✅] DoD1: Configuración centralizada (`calculatorConfig.ts`)
- [✅] DoD2: Validaciones implementadas y testeadas (min/max)
- [❌] DoD3: Supuestos conservadores — siguen paybacks <3m y ROI extremos con inputs válidos
- [⚠] DoD4: Lógica fallback — pendiente decisión de negocio; ramas incoherente/out_of_range siguen sin activarse
- [✅] DoD5: UI/UX consistente con mensajes
- [⚠] DoD6: Script validación masiva presente y testeado, pero outputs visibles son previos al último cambio
- [ ] DoD7: Revisión Fran pendiente

---

## 🔍 Verificaciones Técnicas

- Seguridad: sin credenciales expuestas detectadas.
- TypeScript/tests/build: no re-ejecuté comandos en esta revisión (solo análisis estático).

---

## 🚨 Problemas Encontrados

1) **Payback <3 meses y ROI desorbitados con inputs válidos (CA2/DoD3 incumplido)**  
   - **Ubicación:** `lib/calculator/calculateROI.ts:140-159`.  
   - **Detalle:** Con `cloudSpendMonthly=100000`, tamaño `50M+` (input permitido) se obtiene payback ~1.5 meses y ROI ~2300%. No se aplica `minPaybackMonths` ni se limita ROI para rangos prudentes.  
   - **Acción requerida:** Aplicar mínimo de payback/cap prudente o ajustar parámetros para que los inputs válidos respeten CA2.

2) **Fallback incoherente/out_of_range pendiente de decisión (CA4)**  
   - **Ubicación:** `lib/calculator/validation.ts:116-143`; tests `__tests__/calculator/calculateROI.test.ts:171-229`.  
   - **Detalle:** Las ramas `incoherent_scenario` y `out_of_range` siguen sin dispararse con los rangos actuales (ratio cloud no supera 50%; `extremeHigh` > `max`). El desarrollador espera instrucción de negocio.  
   - **Acción requerida:** Definir política para escenarios incoherentes/fuera de rango (ajustar thresholds o aceptar no bloquear) y alinear tests/CA.

3) **Validación masiva no marca fallbacks como fallo y promedia sobre totales (riesgo CA6 si se activan fallbacks)**  
   - **Ubicación:** `scripts/validate-roi-v2.ts:249-321`.  
   - **Detalle:** `status` depende sólo de errores básicos; un fallback por coherencia contaría como “pass”. Promedios usan total de casos aunque sólo suman éxitos. Si se activan fallbacks tras definir CA4, las métricas quedarían sesgadas.  
   - **Acción sugerida:** Marcar fallbacks como `fail` o excluirlos de promedios si representan escenarios no calculables.

---

## ✅ Aspectos Positivos

- Tipado claro con discriminated unions y type guards (`ROICalculationResult`, `isROISuccess`).
- UI de fallback en `Step3Results.tsx` coherente con la narrativa de diagnóstico personalizado.
- Script de validación masiva actualizado para manejar el union type y exportar CSV/JSON.

---

## 🔗 Verificación vs Linear

- Issue FJG-85 leída desde Linear: ✅ Sí.  
- Discrepancias detectadas: CA2 (payback mínimo/ROI razonable) y CA4 (fallback coherencia/out_of_range) no quedan cumplidos con la implementación actual.

---

## 📊 Siguiente Paso

❌ Requiere: (1) resolver CA2 (payback mínimo/ROI prudente) y (2) decidir a nivel de negocio cómo tratar CA4 (bloquear incoherencias o ajustar thresholds) para luego alinear lógica y tests. Luego regenerar validación masiva con la política final.
