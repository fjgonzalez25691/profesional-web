# FJG-98: Prompt de Implementación
**Issue**: US-DT-04-FE-MULTIPAIN – Multi-dolor fuerza fallback a reunión  
**Rol**: Agent Developer  
**Metodología**: TDD estricto

---

## 1. CONTEXTO Y OBJETIVO

**Problema actual:**
La calculadora ROI permite seleccionar múltiples dolores simultáneamente y calcula un ROI combinado sumando los ahorros de cada dolor. Esto genera resultados extremadamente optimistas (ROI > 90%, payback < 3 meses) que activan el fallback `extreme_roi`, creando confusión porque el usuario recibe un mensaje de "escenario extremadamente optimista" cuando en realidad la herramienta NO debe calcular ROI para escenarios multi-dolor.

**Objetivo de FJG-98:**
Modificar la lógica para que cuando se seleccionen **2 o más dolores**, la calculadora devuelva directamente un fallback específico `multi_pain` indicando que casos complejos requieren sesión personalizada, SIN calcular ni mostrar cifras numéricas de ROI/payback.

**Especificaciones Linear:**
- **CA1**: Un solo dolor → resultado success (salvo otros fallbacks existentes)
- **CA2**: Dos o más dolores → fallback `multi_pain`, sin cálculos numéricos
- **CA3**: UI muestra solo mensaje + CTA contacto para `multi_pain`
- **CA4**: Todos los tests pasan tras la modificación

---

## 2. PLAN DE IMPLEMENTACIÓN TDD (7 FASES)

### FASE 1: Análisis de dependencias (15 min)
**Objetivo**: Entender arquitectura actual de la calculadora ROI

**Tareas**:
1. Leer `lib/calculator/calculateROI.ts`:
   - Identificar punto de entrada: función `calculateROI(inputs)`
   - Localizar validaciones pre-cálculo: `shouldCalculateROI()`
   - Entender validación post-cálculo `extreme_roi`
   - Confirmar estructura `ROICalculationResult` (success | fallback)

2. Leer `lib/calculator/types.ts`:
   - Verificar tipo `ROIFallback` y campo `reason`
   - Confirmar valores actuales de `reason`: 'invalid_inputs' | 'incoherent_scenario' | 'out_of_range' | 'extreme_roi'
   - Preparar adición de `'multi_pain'`

3. Leer `lib/calculator/validation.ts`:
   - Entender función `shouldCalculateROI()` y su retorno
   - Confirmar que es el lugar correcto para añadir validación `multi_pain`

4. Leer `components/calculator/Step3Results.tsx`:
   - Identificar lógica de renderizado para `fallback`
   - Localizar switch/condicional por `result.reason`
   - Confirmar dónde añadir case `multi_pain`

**Entregable**: Mapa mental de puntos de modificación

---

### FASE 2: Diseño de la solución (20 min)
**Objetivo**: Definir cambios mínimos necesarios

**Decisiones arquitectónicas**:
1. **Ubicación de la validación**: `shouldCalculateROI()` en `validation.ts`
   - Rationale: Es el punto de validación pre-cálculo, consistente con `invalid_inputs`, `incoherent_scenario`, `out_of_range`
   
2. **Orden de validaciones**: multi_pain debe ir ANTES de validaciones específicas
   ```typescript
   shouldCalculateROI(inputs) {
     // 0. Validar multi_pain PRIMERO
     if (inputs.pains.length > 1) {
       return { canCalculate: false, reason: 'multi_pain', message: '...' }
     }
     
     // 1. Validar inputs básicos
     // 2. Validar coherencia cloud vs revenue
     // 3. Validar forecast extremo
     // ...
   }
   ```
   - Rationale: Evitar validaciones innecesarias si el escenario es multi-dolor

3. **Mensaje de fallback**: Claro, orientado a acción
   ```
   "Cuando combinas varios problemas, los ahorros potenciales son más difíciles de estimar con precisión. 
   Te recomendamos agendar una sesión de 30 minutos donde analizaremos tu caso específico y te 
   daremos una estimación personalizada."
   ```

4. **UI**: Componente `Step3Results.tsx`
   - Añadir case `'multi_pain'` en el switch/condicional de `result.reason`
   - Mostrar: mensaje explicativo + CTA Calendly destacado
   - NO mostrar: investment, savingsAnnual, roi3Years, paybackMonths

**Entregable**: Pseudocódigo de cambios en cada archivo

---

### FASE 3: Tests unitarios - Lógica de validación (30 min)
**Objetivo**: Tests RED para la nueva validación `multi_pain`

**Archivo**: `__tests__/calculator/validation.test.ts`

**Tests a crear**:
```typescript
describe('shouldCalculateROI - multi_pain validation', () => {
  it('permite cálculo con un solo dolor (cloud-costs)', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 5000,
    };
    const result = shouldCalculateROI(inputs);
    expect(result.canCalculate).toBe(true);
  });

  it('permite cálculo con un solo dolor (manual-processes)', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['manual-processes'],
      manualHoursWeekly: 40,
    };
    const result = shouldCalculateROI(inputs);
    expect(result.canCalculate).toBe(true);
  });

  it('bloquea cálculo con dos dolores (cloud + manual)', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes'],
      cloudSpendMonthly: 5000,
      manualHoursWeekly: 40,
    };
    const result = shouldCalculateROI(inputs);
    expect(result.canCalculate).toBe(false);
    expect(result.reason).toBe('multi_pain');
    expect(result.message).toContain('varios problemas');
  });

  it('bloquea cálculo con tres dolores', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes', 'forecasting'],
      cloudSpendMonthly: 5000,
      manualHoursWeekly: 40,
      forecastErrorPercent: 30,
    };
    const result = shouldCalculateROI(inputs);
    expect(result.canCalculate).toBe(false);
    expect(result.reason).toBe('multi_pain');
  });

  it('bloquea cálculo con cuatro dolores', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes', 'forecasting', 'inventory'],
      cloudSpendMonthly: 5000,
      manualHoursWeekly: 40,
      forecastErrorPercent: 30,
    };
    const result = shouldCalculateROI(inputs);
    expect(result.canCalculate).toBe(false);
    expect(result.reason).toBe('multi_pain');
  });
});
```

**Ejecutar tests**: `npm test -- __tests__/calculator/validation.test.ts`
- ✅ Confirmar que fallan (RED)

---

### FASE 4: Implementación - Tipos y validación (45 min)
**Objetivo**: Hacer pasar los tests de validación (GREEN)

#### PASO 4.1: Actualizar tipos (10 min)
**Archivo**: `lib/calculator/types.ts`

```typescript
// Añadir 'multi_pain' a la unión de FallbackReason
export type FallbackReason = 
  | 'invalid_inputs'
  | 'incoherent_scenario'
  | 'out_of_range'
  | 'extreme_roi'
  | 'multi_pain';  // ← NUEVO
```

**Verificar**: `npm run typecheck`

#### PASO 4.2: Implementar validación (20 min)
**Archivo**: `lib/calculator/validation.ts`

```typescript
export function shouldCalculateROI(inputs: CalculatorInputs): {
  canCalculate: boolean;
  reason?: ROIFallback['reason'];
  message?: string;
} {
  // 0. FJG-98: Validar multi-pain ANTES de cualquier otra validación
  if (inputs.pains.length > 1) {
    return {
      canCalculate: false,
      reason: 'multi_pain',
      message: 'Cuando combinas varios problemas, los ahorros potenciales son más difíciles de estimar con precisión. Te recomendamos agendar una sesión de 30 minutos donde analizaremos tu caso específico y te daremos una estimación personalizada.',
    };
  }

  // 1. Validar inputs básicos (rangos min/max)
  const errors = validateCalculatorInputs(inputs);
  if (Object.keys(errors).length > 0) {
    // ... código existente ...
  }

  // 2. Validar coherencia cloud vs revenue
  // ... código existente ...

  // 3. Validar forecast extremo
  // ... código existente ...

  return { canCalculate: true };
}
```

#### PASO 4.3: Ejecutar tests (5 min)
```bash
npm test -- __tests__/calculator/validation.test.ts -t "multi_pain"
```
- ✅ Confirmar todos los tests pasan (GREEN)

#### PASO 4.4: Verificar no-regresión (10 min)
```bash
npm test -- __tests__/calculator/validation.test.ts
```
- ✅ Confirmar que tests existentes siguen pasando
- ⚠️ Si algún test pre-existente falla porque esperaba success con multi-dolor, actualizarlo para esperar fallback

---

### FASE 5: Tests unitarios - Integración calculateROI (30 min)
**Objetivo**: Tests RED/GREEN para `calculateROI()` con multi_pain

**Archivo**: `__tests__/calculator/calculateROI.test.ts`

**Tests a crear**:
```typescript
describe('calculateROI - FJG-98 multi_pain', () => {
  it('devuelve success con un solo dolor válido', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['cloud-costs'],
      cloudSpendMonthly: 5000,
    };
    const result = calculateROI(inputs);
    
    if (result.type === 'fallback') {
      console.log('Unexpected fallback:', result);
    }
    
    expect(result.type).toBe('success');
    if (result.type === 'success') {
      expect(result.investment).toBeGreaterThan(0);
      expect(result.savingsAnnual).toBeGreaterThan(0);
    }
  });

  it('devuelve fallback multi_pain con dos dolores', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes'],
      cloudSpendMonthly: 5000,
      manualHoursWeekly: 40,
    };
    const result = calculateROI(inputs);
    
    expect(result.type).toBe('fallback');
    if (result.type === 'fallback') {
      expect(result.reason).toBe('multi_pain');
      expect(result.message).toContain('varios problemas');
    }
  });

  it('devuelve fallback multi_pain con tres dolores', () => {
    const inputs: CalculatorInputs = {
      companySize: '10-25M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes', 'forecasting'],
      cloudSpendMonthly: 5000,
      manualHoursWeekly: 40,
      forecastErrorPercent: 30,
    };
    const result = calculateROI(inputs);
    
    expect(result.type).toBe('fallback');
    if (result.type === 'fallback') {
      expect(result.reason).toBe('multi_pain');
    }
  });

  it('multi_pain tiene prioridad sobre extreme_roi', () => {
    // Escenario que normalmente activaría extreme_roi
    const inputs: CalculatorInputs = {
      companySize: '5-10M',
      sector: 'retail',
      pains: ['cloud-costs', 'manual-processes'], // Multi-dolor
      cloudSpendMonthly: 95_000, // Muy alto
      manualHoursWeekly: 150,    // Muy alto
    };
    const result = calculateROI(inputs);
    
    expect(result.type).toBe('fallback');
    if (result.type === 'fallback') {
      // Debe devolver multi_pain, NO extreme_roi
      expect(result.reason).toBe('multi_pain');
    }
  });
});
```

**Ejecutar tests**:
```bash
npm test -- __tests__/calculator/calculateROI.test.ts -t "multi_pain"
```
- ✅ Confirmar que pasan (no requiere cambios en `calculateROI.ts`, la lógica ya está en `shouldCalculateROI`)

---

### FASE 6: Implementación UI (45 min)
**Objetivo**: Adaptar `Step3Results.tsx` para manejar fallback `multi_pain`

#### PASO 6.1: Tests E2E - Crear tests RED (20 min)
**Archivo**: `__tests__/e2e/calculator-multi-pain.spec.ts` (NUEVO)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Calculadora ROI - Multi-pain fallback', () => {
  test('muestra fallback multi_pain con dos dolores seleccionados', async ({ page }) => {
    await page.goto('/');
    
    // Navegar a calculadora (asumiendo que hay un CTA en el hero)
    await page.click('text=/Calcula tu ROI/i');
    
    // Paso 1: Seleccionar tamaño y sector
    await page.click('text=/10-25M/i');
    await page.click('text=/Siguiente/i');
    
    // Paso 2: Seleccionar DOS dolores
    await page.click('text=/Costes cloud/i');
    await page.click('text=/Procesos manuales/i');
    await page.click('text=/Siguiente/i');
    
    // Paso 2b: Rellenar datos de ambos dolores
    await page.fill('input[name="cloudSpendMonthly"]', '5000');
    await page.fill('input[name="manualHoursWeekly"]', '40');
    await page.click('text=/Calcular ROI/i');
    
    // Paso 3: Verificar que NO se muestran cifras numéricas
    await expect(page.locator('text=/varios problemas/i')).toBeVisible();
    await expect(page.locator('text=/agendar/i')).toBeVisible();
    
    // Verificar que NO aparecen métricas numéricas
    await expect(page.locator('text=/ROI a 3 años/i')).not.toBeVisible();
    await expect(page.locator('text=/Payback/i')).not.toBeVisible();
    await expect(page.locator('text=/Ahorro anual/i')).not.toBeVisible();
  });

  test('muestra resultado normal con un solo dolor', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=/Calcula tu ROI/i');
    
    // Paso 1
    await page.click('text=/10-25M/i');
    await page.click('text=/Siguiente/i');
    
    // Paso 2: Seleccionar UN solo dolor
    await page.click('text=/Costes cloud/i');
    await page.click('text=/Siguiente/i');
    
    // Paso 2b: Rellenar datos
    await page.fill('input[name="cloudSpendMonthly"]', '5000');
    await page.click('text=/Calcular ROI/i');
    
    // Paso 3: Verificar que SÍ se muestran cifras (o fallback extreme_roi si aplica)
    // Puede ser success o extreme_roi, pero NO debe ser multi_pain
    const multiPainMessage = page.locator('text=/varios problemas/i');
    await expect(multiPainMessage).not.toBeVisible();
  });
});
```

**Ejecutar tests**:
```bash
npm run test:e2e -- calculator-multi-pain.spec.ts
```
- ✅ Confirmar que fallan (RED) - aún no hay lógica UI

#### PASO 6.2: Implementar UI (20 min)
**Archivo**: `components/calculator/Step3Results.tsx`

**Cambios**:
1. Localizar el condicional/switch que maneja `result.type === 'fallback'`
2. Añadir case específico para `reason === 'multi_pain'`

```typescript
// Pseudo-código (ajustar a la estructura real)
if (result.type === 'fallback') {
  if (result.reason === 'multi_pain') {
    return (
      <div className="...">
        <AlertCircle className="..." />
        <h3>Caso complejo detectado</h3>
        <p>{result.message}</p>
        <CalendlyButton variant="primary" size="lg">
          Agendar sesión gratuita
        </CalendlyButton>
        {/* NO mostrar investment, savingsAnnual, roi3Years, paybackMonths */}
      </div>
    );
  }
  
  if (result.reason === 'extreme_roi') {
    // ... código existente ...
  }
  
  // ... otros fallbacks ...
}
```

**Verificar**:
```bash
npm run typecheck
npm run test:e2e -- calculator-multi-pain.spec.ts
```
- ✅ Tests E2E pasan (GREEN)

#### PASO 6.3: Verificar UI manualmente (5 min)
```bash
npm run dev
```
1. Navegar a calculadora
2. Seleccionar 2+ dolores
3. Confirmar que muestra mensaje + CTA, sin cifras
4. Seleccionar 1 dolor
5. Confirmar que muestra resultado normal (o extreme_roi si aplica)

---

### FASE 7: Actualización de tests existentes (30 min)
**Objetivo**: Arreglar tests que esperaban success con multi-dolor

#### PASO 7.1: Identificar tests afectados (10 min)
```bash
npm test 2>&1 | grep -i "fail"
```

**Tests potencialmente afectados**:
- `__tests__/calculator/validation.test.ts`: Tests que usaban multi-pain antes de FJG-98
- `__tests__/e2e/calculator.spec.ts`: Tests E2E que seleccionaban múltiples dolores

#### PASO 7.2: Actualizar tests (15 min)
**Estrategia**:
1. Tests que usaban multi-pain para generar `extreme_roi`:
   - Cambiar a single-pain o esperar `multi_pain` fallback

2. Tests que verificaban warnings con multi-pain:
   - ~~Skipear~~ temporalmente o adaptar a single-pain

**Ejemplo - `validation.test.ts`**:
```typescript
// ANTES (FJG-96 intentos)
it('muestra warning cuando el gasto cloud supera 15%', () => {
  const inputs = {
    pains: ['cloud-costs', 'manual-processes'], // Multi-pain
    cloudSpendMonthly: 11_000,
    manualHoursWeekly: 20,
  };
  // ...
});

// DESPUÉS (FJG-98)
it('muestra warning cuando el gasto cloud supera 15%', () => {
  const inputs = {
    pains: ['cloud-costs'], // ← Single-pain
    cloudSpendMonthly: 11_000,
    // manualHoursWeekly: 20, ← Eliminar
  };
  // ...
});
```

#### PASO 7.3: Ejecutar suite completa (5 min)
```bash
npm test
npm run test:e2e
```
- ✅ Todos los tests pasan
- ✅ Coverage se mantiene o mejora

---

## 3. CHECKLIST PRE-COMMIT

Antes de marcar la tarea como completa, verificar:

- [ ] **CA1 verificado**: Con un solo dolor, la calculadora devuelve success (o otros fallbacks válidos, pero NO multi_pain)
- [ ] **CA2 verificado**: Con 2+ dolores, devuelve fallback multi_pain sin cálculos
- [ ] **CA3 verificado**: UI no muestra cifras para multi_pain, solo mensaje + CTA
- [ ] **CA4 verificado**: Todos los tests pasan
- [ ] **Typecheck**: `npm run typecheck` sin errores
- [ ] **Tests unitarios**: `npm test` todos pasan
- [ ] **Tests E2E**: `npm run test:e2e` todos pasan
- [ ] **Lint**: `npm run lint` sin errores
- [ ] **Build**: `npm run build` exitoso
- [ ] **Manual testing**: Verificado en `npm run dev`
  - [ ] 1 dolor → resultado normal
  - [ ] 2 dolores → fallback multi_pain
  - [ ] 3 dolores → fallback multi_pain
  - [ ] UI no muestra números en multi_pain

---

## 4. INFORME DE IMPLEMENTACIÓN

Al finalizar, crear `FJG-98-informe-implementacion.md` con:

### Archivos modificados
- `lib/calculator/types.ts`: Añadido `'multi_pain'` a `FallbackReason`
- `lib/calculator/validation.ts`: Implementada validación multi_pain en `shouldCalculateROI()`
- `components/calculator/Step3Results.tsx`: Añadido case UI para fallback multi_pain
- `__tests__/calculator/validation.test.ts`: +5 tests nuevos para multi_pain
- `__tests__/calculator/calculateROI.test.ts`: +4 tests nuevos para multi_pain
- `__tests__/e2e/calculator-multi-pain.spec.ts`: Nuevo archivo con 2 tests E2E
- `__tests__/calculator/validation.test.ts`: Actualizados 3 tests que usaban multi-pain (ahora single-pain)

### Tests ejecutados
```
✓ npm test -- validation.test.ts -t "multi_pain" (5/5 tests)
✓ npm test -- calculateROI.test.ts -t "multi_pain" (4/4 tests)
✓ npm run test:e2e -- calculator-multi-pain.spec.ts (2/2 tests)
✓ npm test (170/170 tests passed)
✓ npm run test:e2e (XX/XX tests passed)
```

### Criterios de aceptación cumplidos
- ✅ CA1: Un solo dolor → success (verificado test + manual)
- ✅ CA2: Multi-dolor → fallback multi_pain (verificado test + manual)
- ✅ CA3: UI sin cifras para multi_pain (verificado E2E + manual)
- ✅ CA4: Todos los tests pasan (verificado CI + local)

### Decisiones de diseño
1. **Ubicación validación**: `shouldCalculateROI()` - coherente con otras validaciones pre-cálculo
2. **Prioridad**: multi_pain se valida ANTES que invalid_inputs/incoherent_scenario
3. **Mensaje**: Orientado a acción (agendar sesión), no técnico
4. **UI**: Componente específico para multi_pain, sin reutilizar extreme_roi

### Notas adicionales
- Los 3 tests que fallaban en el commit anterior (`ce6192b`) ahora pasan porque usan single-pain
- El fallback `extreme_roi` sigue existiendo para casos de 1 dolor con ROI > 90%
- La validación multi_pain NO afecta a `validate-roi-v2.ts` (script de validación masiva)

---

## 5. RECOMENDACIONES PARA EL REVIEWER

- Verificar que `multi_pain` se valida ANTES de otros fallbacks (orden crítico)
- Confirmar que la UI no filtra datos sensibles (no debe haber investment/savings en DOM para multi_pain)
- Revisar tests E2E: ¿cubren todos los flujos de navegación?
- Validar mensaje de fallback: ¿es claro para el usuario?

---

**Tiempo estimado total**: 3-4 horas  
**Complejidad**: Media (cambios en 3 capas: validación, cálculo, UI)  
**Riesgo**: Bajo (cambio localizado, bien testeado)
