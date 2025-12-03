# FJG-48: Prompt Revisión - Calculadora ROI Frontend

## Issue Linear FJG-48
**Título**: US-04-001: Calculadora ROI Frontend Interactiva  
**Prioridad**: 🟠 High  
**Sprint**: S3 (Días 15-21)  

## Misión Agent Reviewer

Verificar que la implementación del Agent Developer cumple **100%** con las especificaciones de Linear FJG-48, no solo con el prompt de implementación.

## Verificaciones Obligatorias

### 1. Conformidad Linear vs Implementación

**Verificar contra issue Linear original**:

#### Interfaces TypeScript (Linear spec)
```typescript
interface CalculatorInputs {
  companySize: '5-10M' | '10-25M' | '25-50M' | '50M+';
  sector: 'industrial' | 'logistica' | 'agencia' | 'farmaceutica' | 'retail' | 'otro';
  pains: Array<'cloud-costs' | 'manual-processes' | 'forecasting' | 'inventory'>;
  cloudSpendMonthly?: number;
  manualHoursWeekly?: number; 
  forecastErrorPercent?: number;
}
```

#### Algoritmo ROI (Linear spec)
- **Cloud optimization**: 35% savings, 3200€ investment
- **Manual processes**: 25€/hora × 52 weeks × 70% automation, 4800€ investment
- **Payback**: Math.round((investment / savingsAnnual) * 12)
- **ROI 3 años**: ((savingsAnnual * 3 - investment) / investment) * 100

#### Componentes UI (Linear spec)
- `<ROICalculator>` - Container wizard
- `<Step1Company>` - Radio buttons sector/tamaño
- `<Step2Pains>` - Checkboxes + inputs condicionales  
- `<Step3Results>` - Display ROI + form email

### 2. Criterios de Aceptación Gherkin

**Scenario 1: Cálculo básico cloud**
- [x] Sector "Agencia Marketing" + tamaño "10-25M" navegación funcional
- [x] Checkbox "Reducir costes cloud" + input 8500€/mes
- [x] Resultado exacto: "Ahorro estimado: ~35.700€/año"
- [x] "Inversión: ~3.200€"  
- [x] "Payback: 1 mes" (cálculo correcto)
- [x] Form "Recibe análisis completo" presente

**Scenario 2: Validación inputs**
- [x] Error "Campo requerido" cuando input requerido vacío
- [x] No avance a paso 3 sin validación

### 3. Definition of Done (Linear)

- [x] Componente `<ROICalculator>` wizard 3 pasos implementado
- [x] Algoritmo `calculateROI()` con fórmulas **exactas** Linear
- [x] Navegación pasos: Siguiente/Anterior funcional
- [x] Validación inputs requeridos implementada
- [x] Resultados mostrados: investment, savings/año, payback meses, ROI 3 años
- [x] Form captura email paso 3 (NO envío)
- [x] Responsive mobile+desktop  
- [x] Test calculator.spec.ts: todos verdes
- [x] **NO envío email S3** confirmado

### 4. Arquitectura y Calidad Código

#### Estructura Archivos
```
lib/calculator/
├── types.ts              # CalculatorInputs interface
├── calculateROI.ts       # Algoritmo Linear exacto

components/calculator/
├── ROICalculator.tsx     # Container wizard
├── Step1Company.tsx      # Sector + tamaño
├── Step2Pains.tsx        # Checkboxes + inputs condicionales
└── Step3Results.tsx      # Resultados + form email

app/calculadora/
└── page.tsx              # Página principal

__tests__/calculator/
├── calculateROI.test.ts  # Tests algoritmo
└── ROICalculator.test.tsx # Tests componentes
```

#### Calidad TypeScript
- [x] Interfaces correctas en `types.ts`
- [x] No `any` types
- [x] Props tipadas correctamente
- [x] Return types explícitos funciones

#### Tests Coverage
- [x] Algoritmo calculateROI: casos cloud, manual, combinados
- [x] Componentes: navegación, validación, display resultados
- [x] Tests **green** (todos pasan)

### 5. UX/UI Compliance

#### Wizard Flow
- [x] 3 pasos claramente definidos
- [x] Navegación Siguiente/Anterior intuitive
- [x] Progress indicator visible

#### Responsive Design  
- [x] Mobile: inputs accesibles, botones clickeable
- [x] Desktop: layout optimizado
- [x] Forms validation UX friendly

#### Texto y Mensajes
- [x] Labels claros para sectores/tamaños
- [x] Mensajes error comprensibles
- [x] Resultados formato legible (€, meses, %)

### 6. Seguridad y Performance

#### Validación
- [x] Client-side validation inputs requeridos
- [x] Sanitización inputs numéricos
- [x] No SQL injection vectors (frontend only)

#### Performance  
- [x] Components lazy-loading si aplicable
- [x] No re-renders innecesarios
- [x] Bundle size razonable

## Criterios de Aprobación

### ✅ APROBADO si:
- **100%** criterios aceptación Gherkin cumplen
- **100%** DoD Linear completado  
- Algoritmo ROI **matemáticamente exacto** vs Linear
- Tests **todos verdes**
- Código arquitectura limpia, tipado correcto

### ⚠️ APROBADO CON OBSERVACIONES si:
- Funcionalidad core correcta
- Minor issues UX/styling no críticos
- Tests mayormente verdes (>90%)
- Observaciones documentadas para iteración futura

### ❌ RECHAZADO si:
- Algoritmo ROI **incorrecto** vs Linear spec
- Criterios aceptación Gherkin **fallan**
- Tests **rojos** o cobertura insuficiente (<80%)
- Interfaces TypeScript **no coinciden** Linear
- Form email **envía** (viola DoD "NO envío S3")

## Output del Agent Reviewer

Generar `FJG-48-informe-revision.md` con:

### Resumen Ejecutivo
- **Veredicto**: ✅/⚠️/❌
- **Conformidad Linear**: % cumplimiento issue original
- **Testing**: X/Y tests verdes
- **Blockers encontrados**: Lista issues críticos

### Verificación Detallada
- **Algoritmo ROI**: ✅/❌ cada fórmula vs Linear
- **Componentes**: ✅/❌ cada requirement vs Linear  
- **Gherkin Scenarios**: ✅/❌ cada paso testeable
- **DoD**: ✅/❌ cada item checklist

### Observaciones
- **Críticas**: Issues que impiden deployment
- **Menores**: Mejoras UX/performance no bloqueantes
- **Sugerencias**: Optimizaciones futuras

### Decisión Final
- **Si ✅**: "Listo para merge y deploy"
- **Si ⚠️**: "Aceptable con issues menores documentados"  
- **Si ❌**: "Requiere correcciones antes de merge"