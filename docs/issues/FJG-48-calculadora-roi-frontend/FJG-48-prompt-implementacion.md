# FJG-48: Prompt Implementación - Calculadora ROI Frontend

## Issue Linear FJG-48
**Título**: US-04-001: Calculadora ROI Frontend Interactiva  
**Prioridad**: 🟠 High  
**Story Points**: 5 SP  
**Sprint**: S3 (Días 15-21)  

## Historia de Usuario (Linear)
**Como** CEO interesado en reducir costes  
**Quiero** calcular ROI potencial en 2 minutos  
**Para** ver si vale la pena agendar diagnóstico

## Especificaciones Técnicas de Linear

### Inputs Usuario (TypeScript Interface)
```typescript
interface CalculatorInputs {
  // Paso 1: Contexto empresa
  companySize: '5-10M' | '10-25M' | '25-50M' | '50M+';
  sector: 'industrial' | 'logistica' | 'agencia' | 'farmaceutica' | 'retail' | 'otro';
  
  // Paso 2: Dolores específicos (checkboxes)
  pains: Array<'cloud-costs' | 'manual-processes' | 'forecasting' | 'inventory'>;
  
  // Paso 3: Datos específicos
  cloudSpendMonthly?: number; // Si seleccionó cloud-costs
  manualHoursWeekly?: number; // Si seleccionó manual-processes
  forecastErrorPercent?: number; // Si seleccionó forecasting
}
```

### Algoritmo ROI (Especificación Linear)
```typescript
// lib/calculator/calculateROI.ts
export function calculateROI(inputs: CalculatorInputs) {
  let totalSavingsAnnual = 0;
  let totalInvestment = 0;
  
  // Cloud optimization
  if (inputs.pains.includes('cloud-costs') && inputs.cloudSpendMonthly) {
    const savingsPercent = 0.35; // 35% reducción típica
    const annualSavings = inputs.cloudSpendMonthly * 12 * savingsPercent;
    totalSavingsAnnual += annualSavings;
    totalInvestment += 3200; // Investment típico cloud optimization
  }
  
  // Manual processes automation
  if (inputs.pains.includes('manual-processes') && inputs.manualHoursWeekly) {
    const costPerHour = 25; // €/hora coste laboral promedio
    const annualSavings = inputs.manualHoursWeekly * 52 * costPerHour * 0.7; // 70% automatizable
    totalSavingsAnnual += annualSavings;
    totalInvestment += 4800;
  }
  
  const paybackMonths = Math.round((totalInvestment / totalSavingsAnnual) * 12);
  const roi3Years = ((totalSavingsAnnual * 3 - totalInvestment) / totalInvestment) * 100;
  
  return {
    investment: totalInvestment,
    savingsAnnual: totalSavingsAnnual,
    paybackMonths,
    roi3Years: Math.round(roi3Years),
  };
}
```

### Componentes UI/UX (Especificación Linear)
**Wizard 3 Pasos**:
1. Contexto empresa (sector + tamaño)
2. Dolores específicos (checkboxes + inputs condicionales)
3. Resultados + Captura Email

**Componentes Requeridos**:
- `<ROICalculator>` - Container wizard
- `<Step1Company>` - Radio buttons sector/tamaño  
- `<Step2Pains>` - Checkboxes + inputs condicionales
- `<Step3Results>` - Display ROI + form email

## Criterios de Aceptación (Gherkin Linear)

```gherkin
Feature: Calculadora ROI interactiva
  Scenario: Cálculo básico cloud
    Given estoy en paso 1
    When selecciono sector "Agencia Marketing"
    And selecciono tamaño "10-25M"
    And avanzo paso 2
    And marco "Reducir costes cloud"
    And ingreso "8500€/mes" gasto AWS
    And avanzo paso 3
    Then veo "Ahorro estimado: ~35.700€/año"
    And veo "Inversión: ~3.200€"
    And veo "Payback: 1 mes"
    And veo form "Recibe análisis completo"

  Scenario: Validación inputs
    Given estoy en paso 2
    When marco "Reducir costes cloud"
    And dejo input vacío
    And clic "Siguiente"
    Then veo error "Campo requerido"
    And no avanzo paso 3
```

## Definition of Done (Linear)

- [x] Componente `<ROICalculator>` wizard 3 pasos
- [x] Algoritmo `calculateROI()` con fórmulas validadas
- [x] Navegación pasos: Siguiente/Anterior
- [x] Validación inputs requeridos
- [x] Resultados mostrados: investment, savings/año, payback meses, ROI 3 años
- [x] Form captura email paso 3 (envío próximo US)
- [x] Responsive mobile+desktop
- [x] Test calculator.spec.ts: cálculos correctos
- [x] **NO envío email S3** (solo cálculo + captura)

## Plan TDD (Agent Developer)

### Fase 1: Setup Arquitectura
1. **Crear `lib/calculator/types.ts`** con interfaces TypeScript
2. **Crear `lib/calculator/calculateROI.ts`** con algoritmo Linear
3. **Test**: `__tests__/calculator/calculateROI.test.ts` - Validar fórmulas exactas

### Fase 2: Lógica de Negocio (TDD)
4. **Test RED**: Casos de cálculo según escenarios Gherkin
   - Cloud costs: 8500€/mes → 35.700€/año ahorro
   - Manual processes: casos típicos
   - Combinaciones múltiples dolores
5. **Implementación GREEN**: Completar función calculateROI
6. **Test GREEN**: Validar todos los escenarios pasan

### Fase 3: Componentes UI (TDD)
7. **Test RED**: `__tests__/components/ROICalculator.test.tsx`
   - Navegación wizard (3 pasos)
   - Validación inputs requeridos
   - Display resultados correctos
8. **Implementación GREEN**: 
   - `components/calculator/ROICalculator.tsx`
   - `components/calculator/Step1Company.tsx`
   - `components/calculator/Step2Pains.tsx`
   - `components/calculator/Step3Results.tsx`
9. **Test GREEN**: Componentes funcionando según CA

### Fase 4: Integración y Página
10. **Crear página**: `app/calculadora/page.tsx`
11. **Responsive**: Mobile + Desktop
12. **Test E2E**: `__tests__/e2e/calculator.spec.ts` - Flujo completo

### Notas Importantes
- **NO envío email** en S3 (DoD Linear explícito)
- Usar **shadcn/ui** components existentes
- **Validación client-side** para UX
- **Fórmulas exactas** según algoritmo Linear
- **Form captura email** preparado (sin envío)

## Restricciones Técnicas
- **Stack actual**: Next.js 16, TypeScript, shadcn/ui, Tailwind
- **Testing**: Vitest + React Testing Library + Playwright E2E
- **Arquitectura**: Componentes reutilizables en `components/calculator/`
- **Lógica**: Separada en `lib/calculator/`

## Output Esperado (Agent Developer)
Al finalizar, generar `FJG-48-informe-implementacion.md` con:
- ✅ Tests running (todos verdes)
- ✅ Componentes implementados
- ✅ Algoritmo ROI validado
- ✅ Página `/calculadora` funcional
- 📊 Screenshots del wizard funcionando
- 🚦 Estado de cada criterio de aceptación