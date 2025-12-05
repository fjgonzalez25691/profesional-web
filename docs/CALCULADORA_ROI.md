# Calculadora ROI - Documentación Técnica
## Previa a la Implementación de FJG-85 A FJG-91 para fijar hito inicial

## Índice
1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Origen de Datos](#origen-de-datos)
4. [Lógica de Cálculo](#lógica-de-cálculo)
5. [Fórmulas por Tipo de Dolor](#fórmulas-por-tipo-de-dolor)
6. [Ejemplos de Cálculo](#ejemplos-de-cálculo)
7. [Testing](#testing)
8. [Mantenimiento](#mantenimiento)

---

## Visión General

La Calculadora ROI es una herramienta interactiva que permite a potenciales clientes calcular el retorno de inversión de implementar soluciones de automatización e IA en su empresa.

### Flujo del Usuario
1. **Paso 1**: Selecciona sector y tamaño de empresa
2. **Paso 2**: Selecciona dolores (pain points) e introduce datos específicos
3. **Paso 3**: Visualiza resultados calculados + opción de captura de lead

---

## Arquitectura

### Estructura de Archivos

```
profesional-web/
├── lib/calculator/
│   ├── calculateROI.ts          # Lógica principal de cálculo
│   └── types.ts                  # TypeScript types
├── components/calculator/
│   ├── Step1CompanyProfile.tsx   # Sector y tamaño
│   ├── Step2Pains.tsx            # Dolores e inputs
│   └── Step3Results.tsx          # Visualización resultados
├── app/calculadora/
│   └── page.tsx                  # Página principal
├── data/
│   └── cases.ts                  # Casos de uso reales
└── __tests__/e2e/
    └── calculator.spec.ts        # Tests E2E Playwright
```

### Tipos de Datos

```typescript
// lib/calculator/types.ts

export type CompanySize = '5-10M' | '10-25M' | '25-50M' | '50M+';

export type Sector =
  | 'industrial'
  | 'logistica'
  | 'agencia'
  | 'farmaceutica'
  | 'retail'
  | 'otro';

export type PainPoint =
  | 'cloud-costs'        // Reducir costes cloud
  | 'manual-processes'   // Reducir procesos manuales
  | 'forecasting'        // Forecasting/planificación
  | 'inventory';         // Inventario y roturas

export interface CalculatorInputs {
  companySize: CompanySize;
  sector: Sector;
  pains: PainPoint[];
  cloudSpendMonthly?: number;      // Gasto mensual en cloud (€)
  manualHoursWeekly?: number;      // Horas manuales/semana
  forecastErrorPercent?: number;   // % error en forecasting
}

export interface ROIResult {
  investment: number;      // Inversión inicial (€)
  savingsAnnual: number;   // Ahorro anual estimado (€)
  paybackMonths: number;   // Meses hasta recuperar inversión
  roi3Years: number;       // ROI a 3 años (%)
}
```

---

## Origen de Datos

### 1. Casos Reales Documentados

Los cálculos están basados en casos reales de implementación documentados en [`data/cases.ts`](../profesional-web/data/cases.ts):

```typescript
// Ejemplo: Caso-002 - Agencia Marketing
{
  sector: "Agencia Marketing",
  company_size: "12M€",
  employees: 60,
  pain: "Factura AWS 8,5K€/mes sin control",
  solution: "Rightsizing + Reserved Instances",
  investment: 3100,
  savings_annual: 38000,
  payback_weeks: 4
}
```

### 2. Supuestos de Negocio

Los parámetros de cálculo están basados en:

- **Estudios de industria**: Porcentajes de ahorro típicos en cloud optimization (30-40%)
- **Experiencia profesional**: Coste por hora de trabajo manual (25€/h)
- **Benchmarks del sector**: Impacto de errores de forecasting (5-15% del revenue)
- **Datos de clientes reales**: Casos documentados en la carpeta `data/cases.ts`

### 3. Factores Clave por Dolor

| Dolor | Factor Clave | Fuente |
|-------|--------------|--------|
| Cloud Costs | 35% ahorro | AWS Well-Architected + casos reales |
| Manual Processes | 70% tiempo recuperable | Casos logística + industrial |
| Forecasting | 8% revenue impactado | Literatura académica + casos manufactura |
| Inventory | 12% coste anual | Retail benchmarks |

---

## Lógica de Cálculo

### Función Principal

**Ubicación**: [`lib/calculator/calculateROI.ts`](../profesional-web/lib/calculator/calculateROI.ts)

```typescript
export function calculateROI(inputs: CalculatorInputs): ROIResult {
  let totalSavingsAnnual = 0;
  let totalInvestment = 0;

  // Cálculo por cada dolor seleccionado
  // (ver secciones siguientes)

  const hasSavings = totalSavingsAnnual > 0 && totalInvestment > 0;

  // Payback en meses
  const paybackMonths = hasSavings
    ? Math.round((totalInvestment / totalSavingsAnnual) * 12)
    : 0;

  // ROI a 3 años
  const roi3Years = hasSavings
    ? Math.round(((totalSavingsAnnual * 3 - totalInvestment) / totalInvestment) * 100)
    : 0;

  return {
    investment: Math.round(totalInvestment),
    savingsAnnual: Math.round(totalSavingsAnnual),
    paybackMonths,
    roi3Years,
  };
}
```

### Métricas Calculadas

1. **Ahorro Anual** (`savingsAnnual`): Suma de ahorros de todos los dolores seleccionados
2. **Inversión** (`investment`): Suma de inversiones iniciales requeridas
3. **Payback** (`paybackMonths`): `(Inversión / Ahorro Anual) × 12 meses`
4. **ROI 3 años** (`roi3Years`): `((Ahorro × 3 años - Inversión) / Inversión) × 100`

---

## Fórmulas por Tipo de Dolor

### 1. Cloud Costs (Reducir costes cloud)

**Input del usuario**: Gasto mensual en cloud (€)

**Fórmula**:
```typescript
if (inputs.pains.includes('cloud-costs') && inputs.cloudSpendMonthly) {
  const savingsPercent = 0.35;  // 35% ahorro típico
  const annualSavings = inputs.cloudSpendMonthly * 12 * savingsPercent;
  totalSavingsAnnual += annualSavings;
  totalInvestment += 3200;  // Inversión típica en optimización cloud
}
```

**Base del cálculo**:
- **35% de ahorro**: Basado en rightsizing, reserved instances, y optimización de arquitectura
- **3.200€ inversión**: Auditoría + implementación + documentación
- **Caso real**: Agencia Marketing (caso-002) → 8.500€/mes → 35.700€/año ahorro

**Ejemplo**:
```
Input: 10.000€/mes en AWS
Cálculo: 10.000 × 12 × 0.35 = 42.000€/año
Inversión: 3.200€
Payback: (3.200 / 42.000) × 12 = 0.9 meses
```

---

### 2. Manual Processes (Reducir procesos manuales)

**Input del usuario**: Horas manuales semanales

**Fórmula**:
```typescript
if (inputs.pains.includes('manual-processes') && inputs.manualHoursWeekly) {
  const costPerHour = 25;  // Coste hora trabajo administrativo/operativo
  const annualSavings = inputs.manualHoursWeekly * 52 * costPerHour * 0.7;
  totalSavingsAnnual += annualSavings;
  totalInvestment += 4800;  // Inversión típica en automatización
}
```

**Base del cálculo**:
- **25€/hora**: Coste promedio hora trabajo administrativo/operativo
- **70% recuperable**: No todo el tiempo se recupera (curva aprendizaje, excepciones)
- **52 semanas/año**: Semanas laborables
- **4.800€ inversión**: Desarrollo automatización + integración + training
- **Caso real**: Logística (caso-001) → 35h/semana → 31.850€/año ahorro

**Ejemplo**:
```
Input: 30 horas/semana en verificación manual
Cálculo: 30 × 52 × 25 × 0.7 = 27.300€/año
Inversión: 4.800€
Payback: (4.800 / 27.300) × 12 = 2.1 meses
```

---

### 3. Forecasting (Forecasting/planificación)

**Input del usuario**: Error de forecast (%)

**Fórmula**:
```typescript
if (inputs.pains.includes('forecasting') && inputs.forecastErrorPercent) {
  const avgRevenue = 20000000;  // 20M€ revenue promedio target
  const impactFactor = 0.08;    // 8% revenue afectado por errores
  const errorCostRate = inputs.forecastErrorPercent / 100;
  const improvementRate = 0.5;  // ML reduce error en 50%

  const annualSavings = avgRevenue * impactFactor * errorCostRate * improvementRate;
  totalSavingsAnnual += annualSavings;
  totalInvestment += 5800;  // Inversión en ML + alertas
}
```

**Base del cálculo**:
- **20M€ revenue**: Empresa target (15-25M€ según tamaño seleccionado)
- **8% impacto**: Porcentaje del revenue afectado por errores de forecast (exceso stock, cambios producción, urgencias)
- **50% mejora**: ML/IA puede reducir error de forecast a la mitad
- **5.800€ inversión**: Modelo predictivo + integración + alertas automáticas
- **Caso real**: Industrial (caso-003) → 30% error → 240.000€/año ahorro potencial

**Ejemplo**:
```
Input: 25% error en forecasting
Cálculo: 20.000.000 × 0.08 × 0.25 × 0.5 = 200.000€/año
Inversión: 5.800€
Payback: (5.800 / 200.000) × 12 = 0.3 meses
```

**Desglose del impacto**:
- Revenue afectado: 20M × 8% = 1.6M€
- Coste actual del error: 1.6M × 25% = 400.000€
- Mejora con ML: 400.000 × 50% = 200.000€ ahorro

---

### 4. Inventory (Inventario y roturas)

**Input del usuario**: Ninguno (cálculo fijo)

**Fórmula**:
```typescript
if (inputs.pains.includes('inventory')) {
  const avgInventoryValue = 1000000;  // 1M€ inventario típico
  const inventoryCostRate = 0.12;     // 12% coste anual gestión
  const improvementRate = 0.4;        // 40% mejora con automatización

  const annualSavings = avgInventoryValue * inventoryCostRate * improvementRate;
  totalSavingsAnnual += annualSavings;
  totalInvestment += 5800;  // Integración ERP + alertas predictivas
}
```

**Base del cálculo**:
- **1M€ inventario**: Valor promedio inventario empresas 10-25M€
- **12% coste anual**: Obsolescencia + almacenamiento + coste oportunidad + roturas
- **40% mejora**: Reducción mediante alertas automáticas + reposición predictiva
- **5.800€ inversión**: Integración ERP ↔ e-commerce + alertas + dashboards
- **Caso real**: Retail (caso-005) → 68.000€/año ahorro

**Ejemplo**:
```
Inventario: 1.000.000€
Coste actual: 1.000.000 × 12% = 120.000€/año
Mejora: 120.000 × 40% = 48.000€/año ahorro
Inversión: 5.800€
Payback: (5.800 / 48.000) × 12 = 1.4 meses
```

**Componentes del coste de inventario (12%)**:
- Obsolescencia/caducidad: 4%
- Coste almacenamiento: 3%
- Coste oportunidad capital: 3%
- Roturas de stock perdidas: 2%

---

## Ejemplos de Cálculo

### Caso 1: Agencia Marketing - Solo Cloud

**Inputs**:
- Sector: Agencia Marketing
- Tamaño: 10-25M
- Dolor: Cloud costs
- Gasto cloud: 8.500€/mes

**Cálculo**:
```
Ahorro cloud: 8.500 × 12 × 0.35 = 35.700€/año
Inversión: 3.200€
Payback: (3.200 / 35.700) × 12 = 1 mes
ROI 3 años: ((35.700 × 3 - 3.200) / 3.200) × 100 = 3.237%
```

---

### Caso 2: Farmacéutica - Solo Forecasting

**Inputs**:
- Sector: Farmacéutica
- Tamaño: 10-25M
- Dolor: Forecasting
- Error forecast: 30%

**Cálculo**:
```
Ahorro forecasting: 20.000.000 × 0.08 × 0.30 × 0.5 = 240.000€/año
Inversión: 5.800€
Payback: (5.800 / 240.000) × 12 = 0.3 meses
ROI 3 años: ((240.000 × 3 - 5.800) / 5.800) × 100 = 12.314%
```

---

### Caso 3: Industrial - Combinación Múltiple

**Inputs**:
- Sector: Industrial
- Tamaño: 50M+
- Dolores: Cloud + Manual + Forecasting + Inventory
- Gasto cloud: 20.000€/mes
- Horas manuales: 40h/semana
- Error forecast: 25%

**Cálculo**:
```
Ahorro cloud: 20.000 × 12 × 0.35 = 84.000€/año
Ahorro manual: 40 × 52 × 25 × 0.7 = 36.400€/año
Ahorro forecasting: 20.000.000 × 0.08 × 0.25 × 0.5 = 200.000€/año
Ahorro inventory: 1.000.000 × 0.12 × 0.4 = 48.000€/año

Total ahorro: 368.400€/año
Total inversión: 3.200 + 4.800 + 5.800 + 5.800 = 19.600€
Payback: (19.600 / 368.400) × 12 = 0.6 meses
ROI 3 años: ((368.400 × 3 - 19.600) / 19.600) × 100 = 5.541%
```

---

## Testing

### Cobertura de Tests E2E

**Archivo**: [`__tests__/e2e/calculator.spec.ts`](../profesional-web/__tests__/e2e/calculator.spec.ts)

**Total**: 54 tests (27 únicos × 2 browsers: Chromium + Mobile Chrome)

#### Tests por Categoría

**1. Tests por Dolor (10 tests)**:
- Cloud costs: 3 tests (valores diferentes + validación)
- Manual processes: 2 tests (20h/semana, 35h/semana)
- Forecasting: 3 tests (30%, 18%, 10% error)
- Inventory: 2 tests (diferentes tamaños empresa)

**2. Tests por Sector (4 tests)**:
- Industrial + forecasting
- Logística + manual-processes
- Retail + inventory
- Otro + cloud-costs

**3. Tests por Tamaño Empresa (4 tests)**:
- 5-10M (pequeña)
- 10-25M (mediana)
- 25-50M (mediana-grande)
- 50M+ (grande)

**4. Tests Combinaciones Múltiples (4 tests)**:
- Cloud + Manual
- Forecasting + Inventory
- Cloud + Manual + Forecasting
- Todos los dolores combinados

**5. Tests Validación y Edge Cases (5 tests)**:
- Sin dolores seleccionados
- Valores mínimos (100€/mes cloud)
- Valores altos (80h/semana)
- Forecasting error bajo (5%)
- Forecasting error alto (50%)

### Ejecutar Tests

```bash
# Solo calculadora
npx playwright test calculator.spec.ts

# Todos los tests E2E
npx playwright test

# Con UI mode
npx playwright test --ui
```

---

## Mantenimiento

### Actualizar Fórmulas

Si necesitas ajustar los cálculos:

1. **Editar constantes** en [`lib/calculator/calculateROI.ts`](../profesional-web/lib/calculator/calculateROI.ts)
2. **Actualizar tests** en [`__tests__/e2e/calculator.spec.ts`](../profesional-web/__tests__/e2e/calculator.spec.ts)
3. **Ejecutar tests** para verificar
4. **Actualizar esta documentación**

### Parámetros Ajustables

| Parámetro | Ubicación | Valor Actual | Justificación |
|-----------|-----------|--------------|---------------|
| `savingsPercent` cloud | calculateROI.ts:8 | 0.35 (35%) | AWS Well-Architected |
| `costPerHour` manual | calculateROI.ts:15 | 25€ | Coste hora administrativo |
| `avgRevenue` forecasting | calculateROI.ts:24 | 20.000.000€ | Empresa target 15-25M |
| `impactFactor` forecasting | calculateROI.ts:26 | 0.08 (8%) | Literatura académica |
| `improvementRate` forecasting | calculateROI.ts:30 | 0.5 (50%) | Capacidad ML/IA |
| `avgInventoryValue` | calculateROI.ts:40 | 1.000.000€ | Benchmarks retail |
| `inventoryCostRate` | calculateROI.ts:42 | 0.12 (12%) | Coste gestión inventario |

### Agregar Nuevo Dolor

1. **Agregar tipo** en `types.ts`:
```typescript
export type PainPoint =
  | 'cloud-costs'
  | 'manual-processes'
  | 'forecasting'
  | 'inventory'
  | 'nuevo-dolor';  // Agregar aquí
```

2. **Agregar opción UI** en `Step2Pains.tsx`:
```typescript
const painOptions = [
  // ... existentes
  {
    value: 'nuevo-dolor',
    label: 'Nombre del Dolor',
    helper: 'Descripción breve',
  },
];
```

3. **Agregar lógica de cálculo** en `calculateROI.ts`:
```typescript
if (inputs.pains.includes('nuevo-dolor') && inputs.nuevoInput) {
  const annualSavings = // tu fórmula
  totalSavingsAnnual += annualSavings;
  totalInvestment += // inversión requerida
}
```

4. **Agregar tests** en `calculator.spec.ts`

5. **Documentar** en este archivo

---

## Referencias

- **Casos reales**: [`data/cases.ts`](../profesional-web/data/cases.ts)
- **Código fuente**: [`lib/calculator/calculateROI.ts`](../profesional-web/lib/calculator/calculateROI.ts)
- **Tests E2E**: [`__tests__/e2e/calculator.spec.ts`](../profesional-web/__tests__/e2e/calculator.spec.ts)
- **Tipos TypeScript**: [`lib/calculator/types.ts`](../profesional-web/lib/calculator/types.ts)

---

**Última actualización**: Diciembre 2024
**Autor**: Francisco Javier García Aparicio
**Versión**: 1.0
