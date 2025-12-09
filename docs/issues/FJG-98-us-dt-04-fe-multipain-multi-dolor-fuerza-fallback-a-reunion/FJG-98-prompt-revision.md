# FJG-98: Prompt de Revisión
**Issue**: US-DT-04-FE-MULTIPAIN – Multi-dolor fuerza fallback a reunión  
**Rol**: Agent Reviewer  
**Objetivo**: Verificación exhaustiva del cumplimiento de CA y DoD

---

## 1. VERIFICACIÓN DE CRITERIOS DE ACEPTACIÓN

### CA1: Un solo dolor permite success
**Comando de verificación**:
```bash
cd /home/fjgaparicio/proyectos/profesional_web/profesional-web
npm test -- __tests__/calculator/calculateROI.test.ts -t "devuelve success con un solo dolor"
```

**Checklist**:
- [ ] Test `devuelve success con un solo dolor válido` pasa
- [ ] Test manual: Seleccionar 1 dolor en UI → ver cifras ROI/payback (o extreme_roi si aplica, pero NO multi_pain)

**Criterio de aprobación**: ✅ Test pasa + verificación manual exitosa

---

### CA2: Multi-dolor devuelve fallback multi_pain sin cálculos
**Comandos de verificación**:
```bash
# Tests unitarios
npm test -- __tests__/calculator/validation.test.ts -t "multi_pain"
npm test -- __tests__/calculator/calculateROI.test.ts -t "multi_pain"

# Verificar que no se calculan métricas numéricas
grep -r "investment\|savingsAnnual\|roi3Years" lib/calculator/calculateROI.ts
```

**Checklist**:
- [ ] Test `bloquea cálculo con dos dolores` pasa
- [ ] Test `bloquea cálculo con tres dolores` pasa
- [ ] Test `bloquea cálculo con cuatro dolores` pasa
- [ ] Test `multi_pain tiene prioridad sobre extreme_roi` pasa
- [ ] Código NO calcula investment/savings cuando `pains.length > 1`
- [ ] Test manual: Seleccionar 2+ dolores → ver solo mensaje, no cifras

**Criterio de aprobación**: ✅ Todos los tests pasan + código no calcula métricas + verificación manual exitosa

---

### CA3: UI muestra solo mensaje + CTA para multi_pain
**Comandos de verificación**:
```bash
# Tests E2E
npm run test:e2e -- calculator-multi-pain.spec.ts

# Verificar código UI
grep -A 20 "reason === 'multi_pain'" components/calculator/Step3Results.tsx
```

**Checklist**:
- [ ] Test E2E `muestra fallback multi_pain con dos dolores` pasa
- [ ] Test E2E verifica que NO aparecen textos "ROI a 3 años", "Payback", "Ahorro anual"
- [ ] Código UI renderiza mensaje de `result.message`
- [ ] Código UI renderiza CTA Calendly/contacto
- [ ] Código UI NO renderiza componentes de métricas numéricas
- [ ] Test manual: Inspeccionar DOM → no debe haber elementos HTML con investment/savings/roi/payback

**Criterio de aprobación**: ✅ Tests E2E pasan + código UI correcto + verificación manual DOM limpio

---

### CA4: Todos los tests pasan tras modificación
**Comandos de verificación**:
```bash
# Suite completa
npm test
npm run test:e2e

# Verificar cobertura
npm run test:coverage

# Verificar que tests antiguos se actualizaron
git diff HEAD~1 __tests__/calculator/validation.test.ts | grep -E "^\+.*pains:"
```

**Checklist**:
- [ ] `npm test` → 100% tests pasan
- [ ] `npm run test:e2e` → 100% tests pasan
- [ ] Tests que antes usaban multi-pain ahora usan single-pain o esperan fallback multi_pain
- [ ] Cobertura de tests se mantiene o mejora (≥ X%)
- [ ] No hay tests `.skip` relacionados con FJG-98

**Criterio de aprobación**: ✅ Todos los tests pasan + tests antiguos actualizados correctamente

---

## 2. VERIFICACIÓN DE DEFINITION OF DONE

### DoD1: Lógica multi_pain en capa de dominio
**Comandos de verificación**:
```bash
# Verificar tipos
grep -n "multi_pain" lib/calculator/types.ts

# Verificar validación
grep -A 10 "inputs.pains.length > 1" lib/calculator/validation.ts
```

**Checklist**:
- [ ] `'multi_pain'` añadido a tipo `FallbackReason` en `types.ts`
- [ ] Validación implementada en `shouldCalculateROI()` en `validation.ts`
- [ ] Validación multi_pain se ejecuta ANTES de otras validaciones (orden correcto)
- [ ] Mensaje de fallback es claro y orientado a acción

**Criterio de aprobación**: ✅ Código implementado correctamente en capa de dominio

---

### DoD2: UI ajustada para multi_pain
**Comandos de verificación**:
```bash
# Verificar componente
grep -B 5 -A 15 "multi_pain" components/calculator/Step3Results.tsx
```

**Checklist**:
- [ ] Case `'multi_pain'` implementado en `Step3Results.tsx`
- [ ] Renderiza `result.message` del fallback
- [ ] Renderiza CTA Calendly/contacto destacado
- [ ] NO renderiza componentes de métricas (investment, savings, ROI, payback)
- [ ] Estilos consistentes con otros fallbacks

**Criterio de aprobación**: ✅ UI implementada correctamente

---

### DoD3: Tests unitarios para 1 dolor y >1 dolor
**Comandos de verificación**:
```bash
# Verificar tests nuevos
grep -n "describe.*multi_pain" __tests__/calculator/validation.test.ts
grep -n "describe.*multi_pain" __tests__/calculator/calculateROI.test.ts

# Ejecutar tests
npm test -- __tests__/calculator/validation.test.ts -t "multi_pain"
npm test -- __tests__/calculator/calculateROI.test.ts -t "multi_pain"
```

**Checklist**:
- [ ] Al menos 5 tests en `validation.test.ts` para `shouldCalculateROI()`:
  - [ ] 1 dolor cloud → canCalculate: true
  - [ ] 1 dolor manual → canCalculate: true
  - [ ] 2 dolores → canCalculate: false, reason: multi_pain
  - [ ] 3 dolores → canCalculate: false, reason: multi_pain
  - [ ] 4 dolores → canCalculate: false, reason: multi_pain
- [ ] Al menos 4 tests en `calculateROI.test.ts`:
  - [ ] 1 dolor → success o extreme_roi (NOT multi_pain)
  - [ ] 2 dolores → fallback multi_pain
  - [ ] 3 dolores → fallback multi_pain
  - [ ] multi_pain tiene prioridad sobre extreme_roi
- [ ] Todos los tests pasan

**Criterio de aprobación**: ✅ Tests unitarios implementados y pasando

---

### DoD4: Tests E2E actualizados
**Comandos de verificación**:
```bash
# Verificar tests E2E nuevos
ls __tests__/e2e/calculator-multi-pain.spec.ts

# Ejecutar tests E2E
npm run test:e2e -- calculator-multi-pain.spec.ts

# Verificar que tests antiguos no esperan ROI numérico con multi-dolor
grep -r "text=/ROI\|Payback\|Ahorro/" __tests__/e2e/calculator.spec.ts
```

**Checklist**:
- [ ] Archivo `calculator-multi-pain.spec.ts` existe
- [ ] Test E2E para 2 dolores → verifica mensaje sin cifras
- [ ] Test E2E para 1 dolor → verifica que NO aparece mensaje multi_pain
- [ ] Tests E2E antiguos actualizados si seleccionaban múltiples dolores
- [ ] Todos los tests E2E pasan

**Criterio de aprobación**: ✅ Tests E2E implementados y pasando

---

### DoD5: Todos los tests pasan en CI/local
**Comandos de verificación**:
```bash
# Local
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build

# Verificar CI (GitHub Actions)
gh run list --limit 1
gh run view --log | grep -E "test|build"
```

**Checklist**:
- [ ] `npm run typecheck` → sin errores
- [ ] `npm run lint` → sin errores
- [ ] `npm test` → 100% tests pasan
- [ ] `npm run test:e2e` → 100% tests pasan
- [ ] `npm run build` → build exitoso
- [ ] CI GitHub Actions → workflow verde

**Criterio de aprobación**: ✅ Todos los checks pasan

---

## 3. VERIFICACIÓN DE ARQUITECTURA Y CÓDIGO

### 3.1. Orden de validaciones
**Verificar**: `lib/calculator/validation.ts`

```typescript
export function shouldCalculateROI(inputs: CalculatorInputs) {
  // ✅ CORRECTO: multi_pain PRIMERO
  if (inputs.pains.length > 1) {
    return { canCalculate: false, reason: 'multi_pain', ... }
  }
  
  // ✅ Luego: invalid_inputs
  const errors = validateCalculatorInputs(inputs);
  if (Object.keys(errors).length > 0) { ... }
  
  // ✅ Luego: incoherent_scenario (cloud vs revenue)
  if (ratio > maxCloudToRevenueRatio) { ... }
  
  // ✅ Luego: out_of_range (forecast extremo)
  if (forecastErrorPercent > extremeHigh) { ... }
  
  return { canCalculate: true };
}
```

**Checklist**:
- [ ] Validación multi_pain está en la PRIMERA posición
- [ ] No hay código de cálculo ANTES de la validación multi_pain
- [ ] Rationale documentado en comentario

---

### 3.2. Consistencia de tipos
**Verificar**: `lib/calculator/types.ts`

```typescript
export type FallbackReason = 
  | 'invalid_inputs'
  | 'incoherent_scenario'
  | 'out_of_range'
  | 'extreme_roi'
  | 'multi_pain';  // ✅ Presente
```

**Checklist**:
- [ ] `'multi_pain'` está en la unión `FallbackReason`
- [ ] TypeScript no reporta errores en asignación `reason: 'multi_pain'`

---

### 3.3. UI no filtra datos sensibles
**Verificar**: `components/calculator/Step3Results.tsx`

```typescript
if (result.type === 'fallback' && result.reason === 'multi_pain') {
  return (
    <div>
      <p>{result.message}</p>
      <CalendlyButton />
      {/* ✅ NO debe haber: */}
      {/* result.investment */}
      {/* result.savingsAnnual */}
      {/* result.roi3Years */}
      {/* result.paybackMonths */}
    </div>
  );
}
```

**Checklist**:
- [ ] Código UI para multi_pain NO accede a `result.investment`, etc.
- [ ] Inspección DOM manual: no hay elementos con cifras numéricas para multi_pain

---

### 3.4. Mensaje de fallback
**Verificar**: Contenido de `message` en `validation.ts`

```typescript
message: 'Cuando combinas varios problemas, los ahorros potenciales son más difíciles de estimar con precisión. Te recomendamos agendar una sesión de 30 minutos donde analizaremos tu caso específico y te daremos una estimación personalizada.'
```

**Checklist**:
- [ ] Mensaje es claro y no técnico
- [ ] Mensaje orienta a acción (agendar sesión)
- [ ] Mensaje no genera alarma innecesaria
- [ ] Mensaje está en español

---

## 4. VERIFICACIÓN DE NO-REGRESIÓN

### 4.1. Tests antiguos actualizados
**Verificar**: Tests que antes usaban multi-pain

**Archivos a revisar**:
- `__tests__/calculator/validation.test.ts`
- `__tests__/e2e/calculator.spec.ts`

**Checklist**:
- [ ] Tests que usaban `pains: ['cloud-costs', 'manual-processes']` ahora usan `pains: ['cloud-costs']`
- [ ] Tests actualizados NO están `.skip` ni comentados
- [ ] Tests actualizados pasan correctamente
- [ ] Commit message explica cambios en tests antiguos

---

### 4.2. Fallbacks existentes no afectados
**Verificar**: Otros fallbacks siguen funcionando

**Comandos**:
```bash
npm test -- __tests__/calculator/calculateROI.test.ts -t "extreme_roi"
npm test -- __tests__/calculator/validation.test.ts -t "invalid_inputs"
npm test -- __tests__/calculator/validation.test.ts -t "incoherent_scenario"
```

**Checklist**:
- [ ] Fallback `extreme_roi` sigue funcionando con 1 dolor + ROI > 90%
- [ ] Fallback `invalid_inputs` sigue funcionando con datos fuera de rango
- [ ] Fallback `incoherent_scenario` sigue funcionando con cloud > 50% revenue
- [ ] Fallback `out_of_range` sigue funcionando con forecast > 80%

---

## 5. VERIFICACIÓN MANUAL (TESTING EXPLORATORIO)

### 5.1. Flujo multi-dolor
1. `npm run dev`
2. Navegar a calculadora
3. Seleccionar empresa 10-25M, sector retail
4. Seleccionar 2 dolores: cloud-costs + manual-processes
5. Rellenar: cloudSpendMonthly=5000, manualHoursWeekly=40
6. Calcular ROI

**Checklist**:
- [ ] Se muestra mensaje "varios problemas"
- [ ] Se muestra CTA Calendly/contacto
- [ ] NO se muestran cifras: investment, savings, ROI, payback
- [ ] NO se muestra mensaje "extremadamente optimista" (extreme_roi)

---

### 5.2. Flujo single-dolor
1. Mismos pasos pero seleccionar SOLO cloud-costs
2. Rellenar: cloudSpendMonthly=5000
3. Calcular ROI

**Checklist**:
- [ ] Se muestran cifras: investment, savings, ROI, payback (o extreme_roi si aplica)
- [ ] NO se muestra mensaje "varios problemas"
- [ ] CTA Calendly aparece pero como secundario (no único)

---

### 5.3. Edge cases
**Casos a probar**:
1. Seleccionar 3 dolores (cloud + manual + forecasting)
2. Seleccionar 4 dolores (todos)
3. Seleccionar 1 dolor con datos extremos (cloud=95000)
4. Cambiar de 2 dolores a 1 dolor (deseleccionar)

**Checklist**:
- [ ] 3 dolores → multi_pain
- [ ] 4 dolores → multi_pain
- [ ] 1 dolor datos extremos → extreme_roi (NOT multi_pain)
- [ ] Cambio 2→1 dolor → resultado normal (sin multi_pain)

---

## 6. DECISIÓN FINAL

### Matriz de Aprobación

| Sección | Estado | Bloqueante |
|---------|--------|------------|
| CA1: Single-dolor permite success | ⬜ | ✅ SÍ |
| CA2: Multi-dolor devuelve multi_pain | ⬜ | ✅ SÍ |
| CA3: UI sin cifras para multi_pain | ⬜ | ✅ SÍ |
| CA4: Todos los tests pasan | ⬜ | ✅ SÍ |
| DoD1: Lógica implementada | ⬜ | ✅ SÍ |
| DoD2: UI ajustada | ⬜ | ✅ SÍ |
| DoD3: Tests unitarios | ⬜ | ✅ SÍ |
| DoD4: Tests E2E actualizados | ⬜ | ✅ SÍ |
| DoD5: CI/local pasan | ⬜ | ✅ SÍ |
| Arquitectura correcta | ⬜ | ⚠️ Sí (orden validaciones) |
| No-regresión verificada | ⬜ | ⚠️ Recomendado |
| Testing manual exitoso | ⬜ | ⚠️ Recomendado |

---

### ✅ APROBADO
**Condiciones**:
- Todos los items bloqueantes (✅ SÍ) están marcados como completados
- Todos los tests pasan (unit + E2E + CI)
- Testing manual confirma comportamiento esperado
- No hay regresiones detectadas

**Siguiente paso**: Agent Manager puede proceder a commit/PR

**Comando de aprobación**:
```bash
echo "✅ FJG-98 APROBADO - Todos los CA y DoD cumplidos" > docs/issues/FJG-98-.../FJG-98-informe-revision.md
```

---

### ⚠️ OBSERVACIONES
**Condiciones**:
- Items bloqueantes cumplidos PERO hay observaciones menores
- Tests pasan PERO hay warnings en consola
- Funcionalidad correcta PERO código mejorable

**Acciones**:
1. Documentar observaciones en informe de revisión
2. Crear issues de mejora (si aplica)
3. Aprobar con comentarios

**Ejemplo de observación**:
```markdown
⚠️ Observación: El mensaje de multi_pain es muy largo (>200 caracteres).
Recomendación: Acortar en una iteración futura.
Impacto: Bajo - no bloquea merge.
```

---

### ❌ RECHAZADO
**Condiciones**:
- Algún item bloqueante NO cumplido
- Tests fallan
- Regresión detectada
- Código no compila

**Acciones**:
1. Documentar problemas en informe de revisión
2. Devolver a Agent Developer con feedback específico
3. NO proceder a commit/PR

**Ejemplo de rechazo**:
```markdown
❌ RECHAZADO: CA2 no cumplido.
Problema: Con 2 dolores, la calculadora devuelve extreme_roi en lugar de multi_pain.
Evidencia: Test `bloquea cálculo con dos dolores` falla.
Solución requerida: Verificar orden de validaciones en shouldCalculateROI().
```

---

## 7. COMANDOS RÁPIDOS DE VERIFICACIÓN

```bash
# Verificación completa en un solo comando
cd /home/fjgaparicio/proyectos/profesional_web/profesional-web && \
npm run typecheck && \
npm run lint && \
npm test && \
npm run test:e2e && \
npm run build && \
echo "✅ Todas las verificaciones pasaron"

# Verificación específica multi_pain
npm test -- -t "multi_pain" && \
npm run test:e2e -- calculator-multi-pain.spec.ts && \
echo "✅ Tests multi_pain pasaron"

# Verificación no-regresión
npm test -- __tests__/calculator/calculateROI.test.ts && \
npm test -- __tests__/calculator/validation.test.ts && \
echo "✅ No hay regresión en tests existentes"
```

---

**Tiempo estimado de revisión**: 1-2 horas  
**Severidad de bloqueo**: Alta (CA y DoD son bloqueantes)  
**Recomendación**: Revisar orden de validaciones primero (punto crítico)
