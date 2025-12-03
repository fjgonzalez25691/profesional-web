# FJG-46: PROMPT DE IMPLEMENTACIÓN
**US-03-004: Grid 5 Casos Completo (Ampliación)**

## 📋 CONTEXTO LINEAR VERIFICADO ✅

**Epic:** In2-03 Chatbot IA Cualificación Leads  
**Sprint:** S2 (Días 8-14)  
**Prioridad:** 🟡 Medium/Low (2 Story Points)  
**Dependencias:** FJG-40 ✅ (Grid 3 casos base completado)

## 🎯 OBJETIVO TDD

Ampliar casos de éxito de 3 a 5 visibles en la landing + casos adicionales internos para chatbot. Mejorar prueba social en landing y calidad respuestas chatbot con diversidad sectorial.

**Historia de Usuario Validada:**
> Como visitante de la landing  
> Quiero ver 5 casos de éxito variados  
> Para tener más confianza en la expertise sectorial

> Como chatbot IA  
> Quiero acceso a casos extensos (8-10 total)  
> Para responder mejor preguntas sectoriales específicas

## 🔧 IMPLEMENTACIÓN TÉCNICA (TDD)

### 1️⃣ FASE RED - Tests Primero

#### Test 1: Casos Visibles Grid 5
```typescript
// __tests__/components/CaseGrid.test.tsx
describe('CaseGrid - 5 casos visibles', () => {
  it('should render exactly 5 visible cases', () => {
    render(<CaseGrid />);
    
    const caseCards = screen.getAllByTestId(/^case-card-/);
    expect(caseCards).toHaveLength(5);
  });

  it('should display grid with correct layout desktop', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    
    render(<CaseGrid />);
    
    const grid = screen.getByTestId('cases-grid');
    expect(grid).toHaveClass('lg:grid-cols-3');
    
    // Primera fila: 3 casos, segunda fila: 2 casos
    const caseCards = screen.getAllByTestId(/^case-card-/);
    expect(caseCards).toHaveLength(5);
  });

  it('should display single column layout mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });
    
    render(<CaseGrid />);
    
    const grid = screen.getByTestId('cases-grid');
    expect(grid).toHaveClass('grid-cols-1');
  });

  it('should show new sectors: Farmacéutica and Retail e-commerce', () => {
    render(<CaseGrid />);
    
    expect(screen.getByText(/Farmacéutica/)).toBeInTheDocument();
    expect(screen.getByText(/Retail e-commerce/)).toBeInTheDocument();
  });
});
```

#### Test 2: Casos Data Structure Extended
```typescript
// __tests__/data/cases.test.ts
describe('Cases Data Structure', () => {
  it('should have exactly 5 visible cases', () => {
    const visibleCases = cases.filter(c => c.visible === true);
    expect(visibleCases).toHaveLength(5);
  });

  it('should have additional internal cases for chatbot', () => {
    const totalCases = cases.length;
    const visibleCases = cases.filter(c => c.visible === true).length;
    const internalCases = totalCases - visibleCases;
    
    expect(totalCases).toBeGreaterThanOrEqual(8); // 5 visible + 3+ internal
    expect(internalCases).toBeGreaterThanOrEqual(3);
  });

  it('should include new required cases: farmaceutica and retail', () => {
    const farmaceuticaCase = cases.find(c => 
      c.visible && c.sector.toLowerCase().includes('farmacéutica')
    );
    const retailCase = cases.find(c => 
      c.visible && c.sector.toLowerCase().includes('retail')
    );
    
    expect(farmaceuticaCase).toBeDefined();
    expect(retailCase).toBeDefined();
  });

  it('should have diverse sectors in internal cases', () => {
    const sectors = cases.map(c => c.sector.toLowerCase());
    
    // Verificar diversidad sectorial
    expect(sectors).toContain('restauración'); // ejemplo interno
    expect(sectors).toContain('clínicas'); // ejemplo interno
    expect(sectors).toContain('servicios'); // ejemplo interno
  });

  it('should have valid ROI metrics for all cases', () => {
    cases.forEach(caso => {
      expect(caso.investment).toBeGreaterThan(0);
      expect(caso.savings_annual).toBeGreaterThan(0);
      expect(caso.payback_weeks).toBeGreaterThan(0);
      expect(caso.payback_weeks).toBeLessThan(52); // payback < 1 año
    });
  });
});
```

#### Test 3: Chatbot Integration CASOS_MVP
```typescript
// __tests__/api/chat-prompt.test.ts
describe('Chatbot System Prompt - CASOS_MVP Extended', () => {
  it('should include all cases (visible + internal) in system prompt', () => {
    const systemPrompt = getChatbotSystemPrompt();
    
    // Verificar que incluye casos visibles
    expect(systemPrompt).toContain('Farmacéutica');
    expect(systemPrompt).toContain('Retail e-commerce');
    
    // Verificar que incluye casos internos
    expect(systemPrompt).toContain('Restauración');
    expect(systemPrompt).toContain('Clínicas');
    expect(systemPrompt).toContain('Servicios');
  });

  it('should have realistic numbers in all cases', () => {
    const systemPrompt = getChatbotSystemPrompt();
    
    // Verificar que no contiene promesas irreales
    expect(systemPrompt).not.toContain('90%'); // No promesas >80%
    expect(systemPrompt).not.toContain('100%');
    expect(systemPrompt).not.toMatch(/payback.*1.*week/i); // No payback 1 semana
  });
});
```

### 2️⃣ FASE GREEN - Implementación Mínima

#### Archivo 1: Data Cases Extended
```typescript
// profesional-web/data/cases.ts
export interface Case {
  id: string;
  sector: string;
  company_size: string;
  employees: number;
  pain: string;
  solution: string;
  investment: number;
  savings_annual: number;
  payback_weeks: number;
  visible: boolean; // true = mostrar en landing, false = solo chatbot
}

export const cases: Case[] = [
  // CASOS VISIBLES (5) - MOSTRADOS EN LANDING
  {
    id: 'caso-001',
    sector: 'Manufactura Industrial',
    company_size: '12M€',
    employees: 65,
    pain: 'Planificación manual de producción consume 2-4h/día del jefe de planta',
    solution: 'Dashboard automático que optimiza secuencias según pedidos y materiales disponibles',
    investment: 8500,
    savings_annual: 48000,
    payback_weeks: 9,
    visible: true
  },
  {
    id: 'caso-002',
    sector: 'Logística y Distribución',
    company_size: '8M€',
    employees: 45,
    pain: 'Costes AWS subieron 35% en 8 meses sin control de spending',
    solution: 'Monitorización automática + políticas de auto-scaling inteligentes',
    investment: 4200,
    savings_annual: 32000,
    payback_weeks: 7,
    visible: true
  },
  {
    id: 'caso-003',
    sector: 'SaaS B2B',
    company_size: '5M€',
    employees: 28,
    pain: 'Forecasting de ingresos con hojas Excel: errores 20-30%, revisiones semanales 6h',
    solution: 'Pipeline automatizado Stripe → modelo predictivo → alertas Slack',
    investment: 6800,
    savings_annual: 45000,
    payback_weeks: 8,
    visible: true
  },
  {
    id: 'caso-004',
    sector: 'Farmacéutica',
    company_size: '15M€',
    employees: 80,
    pain: 'Validación de lotes manual: 18h/semana en documentación y trazabilidad',
    solution: 'OCR + IA para clasificación automática de documentos de lote y alertas de compliance',
    investment: 7200,
    savings_annual: 52000,
    payback_weeks: 7,
    visible: true
  },
  {
    id: 'caso-005',
    sector: 'Retail E-commerce',
    company_size: '22M€',
    employees: 95,
    pain: 'Inventario desincronizado genera 12% de pérdidas por roturas o exceso de stock',
    solution: 'Integración automática ERP ↔ plataforma e-commerce + alertas de reposición predictivas',
    investment: 5800,
    savings_annual: 68000,
    payback_weeks: 4,
    visible: true
  },

  // CASOS INTERNOS (solo chatbot) - NO MOSTRADOS EN LANDING
  {
    id: 'caso-006',
    sector: 'Restauración',
    company_size: '3M€',
    employees: 35,
    pain: 'Planificación de turnos manual causa 15% de sobrecostes en personal',
    solution: 'Predicción de demanda + optimización automática de turnos',
    investment: 4500,
    savings_annual: 28000,
    payback_weeks: 8,
    visible: false
  },
  {
    id: 'caso-007',
    sector: 'Clínicas Privadas',
    company_size: '6M€',
    employees: 42,
    pain: 'No-shows 18% de citas + gestión manual recordatorios consume 12h/semana',
    solution: 'Recordatorios automáticos WhatsApp + relleno inteligente de huecos',
    investment: 3200,
    savings_annual: 35000,
    payback_weeks: 5,
    visible: false
  },
  {
    id: 'caso-008',
    sector: 'Servicios Profesionales',
    company_size: '4M€',
    employees: 25,
    pain: 'Partes de trabajo y facturación manual: 8h/semana + errores 5%',
    solution: 'Automatización partes → ERP → facturación con validación automática',
    investment: 5200,
    savings_annual: 31000,
    payback_weeks: 9,
    visible: false
  },
  {
    id: 'caso-009',
    sector: 'Consultoría IT',
    company_size: '7M€',
    employees: 38,
    pain: 'Reporting semanal clientes consume 14h + datos desactualizados',
    solution: 'Dashboard en tiempo real con métricas automáticas por proyecto',
    investment: 6100,
    savings_annual: 42000,
    payback_weeks: 7,
    visible: false
  }
];

// Export para chatbot (todos los casos)
export const CASOS_MVP = cases;

// Export para landing (solo visibles)
export const CASOS_VISIBLES = cases.filter(c => c.visible);
```

#### Archivo 2: CaseGrid Component Updated
```typescript
// profesional-web/components/CaseGrid.tsx
import { CASOS_VISIBLES } from '@/data/cases';

export default function CaseGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            5 Casos Reales de Éxito
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empresas que redujeron costes y aumentaron eficiencia con soluciones prácticas.
            Payback entre 4-9 semanas.
          </p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          data-testid="cases-grid"
        >
          {CASOS_VISIBLES.map((caso) => (
            <div
              key={caso.id}
              data-testid={`case-card-${caso.id}`}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Header con sector y tamaño */}
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {caso.sector}
                  </span>
                  <span className="text-sm text-gray-500">
                    {caso.company_size} • {caso.employees} empleados
                  </span>
                </div>
              </div>

              {/* Problema */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-red-600 mb-2">PROBLEMA</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {caso.pain}
                </p>
              </div>

              {/* Solución */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-green-600 mb-2">SOLUCIÓN</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {caso.solution}
                </p>
              </div>

              {/* Métricas ROI */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {(caso.savings_annual / 1000).toFixed(0)}K€
                    </div>
                    <div className="text-xs text-gray-500">ahorro/año</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {caso.payback_weeks}sem
                    </div>
                    <div className="text-xs text-gray-500">payback</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {((caso.savings_annual / caso.investment) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">ROI/año</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            ¿Tu empresa tiene problemas similares? Hablemos de tu situación específica.
          </p>
          <button 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={() => window.open('https://calendly.com/fjgaparicio/diagnostico', '_blank')}
          >
            Agenda diagnóstico gratuito
          </button>
        </div>
      </div>
    </section>
  );
}
```

#### Archivo 3: Chatbot Prompt Integration Updated
```typescript
// profesional-web/app/api/chat/route.ts (actualizar system prompt)
import { CASOS_MVP } from '@/data/cases';

function getChatbotSystemPrompt(): string {
  const casosText = CASOS_MVP.map(caso => 
    `${caso.sector} (${caso.company_size}, ${caso.employees} empleados): ${caso.pain} → ${caso.solution}. Inversión ${(caso.investment/1000).toFixed(1)}K€, ahorro ${(caso.savings_annual/1000).toFixed(0)}K€/año, payback ${caso.payback_weeks} semanas.`
  ).join('\n');

  return `Eres el asistente de Fran J. González, experto en reducir costes empresariales usando IA, automatización y soluciones Cloud.

OBJETIVO: Cualificar leads preguntando sobre sus dolores específicos y sugiriendo agenda de diagnóstico si hay fit.

CASOS DE ÉXITO REALES (ÚSALOS COMO REFERENCIA):
${casosText}

ENFOQUE CONVERSACIONAL:
1. Pregunta por dolores específicos (costes, tiempo, errores)
2. Si hay fit con casos similares, menciona ejemplo relevante
3. Sugiere agenda diagnóstico si problema es complejo
4. Si preguntan precios: "depende del problema específico, charlemos"

PERSONALIDAD:
- Directo y profesional, sin jerga técnica
- Enfocado en números de negocio (ahorros, payback)
- No prometas nada sin conocer el contexto
- Si no sabes algo, dilo claramente

RESTRICCIONES:
- NO des precios específicos
- NO prometas porcentajes de ahorro sin análisis
- Máximo 2-3 frases por respuesta
- Si preguntan por sectores no cubiertos, pregunta por su problema específico`;
}

// Usar en el endpoint
export async function POST(req: Request) {
  // ... código existente ...
  
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: getChatbotSystemPrompt()
      },
      ...messages
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 500,
  });
  
  // ... resto del código ...
}
```

### 3️⃣ FASE REFACTOR - Optimización

#### Mejoras Responsive
```typescript
// CaseGrid responsive optimizations
const gridClasses = cn(
  "grid gap-6",
  "grid-cols-1", // Mobile: 1 columna
  "sm:grid-cols-1", // Small: sigue 1 columna
  "md:grid-cols-2", // Tablet: 2 columnas 
  "lg:grid-cols-3", // Desktop: 3 columnas (3+2 layout)
  "xl:grid-cols-3" // XL: mantiene 3 columnas
);
```

#### Casos Validation
```typescript
// Validation utilities
export function validateCase(caso: Case): boolean {
  return (
    caso.investment > 0 &&
    caso.savings_annual > 0 &&
    caso.payback_weeks > 0 &&
    caso.payback_weeks < 52 &&
    (caso.savings_annual / caso.investment) > 1 && // ROI > 100%
    caso.sector.length > 0 &&
    caso.pain.length > 10 &&
    caso.solution.length > 10
  );
}
```

## 🧪 CRITERIOS DE ACEPTACIÓN (GHERKIN VERIFICADOS)

```gherkin
Feature: Grid 5 casos completo

  Scenario: Grid de 5 casos en desktop
    Given estoy en la home en un dispositivo desktop (>1024px)
    When hago scroll hasta la sección de casos
    Then veo un grid de 3 columnas
    And la primera fila muestra 3 casos
    And la segunda fila muestra 2 casos
    And todos los casos muestran sector, problema, solución e impacto

  Scenario: Grid de 5 casos en mobile
    Given estoy en la home en un dispositivo mobile (<768px)
    When hago scroll hasta la sección de casos
    Then veo 5 cards en una columna
    And puedo hacer scroll vertical sin problemas
    And cada card mantiene legibilidad completa

  Scenario: CASOS_MVP extendido para chatbot
    Given reviso data/cases.ts
    Then encuentro exactamente 5 casos con visible: true
    And encuentro al menos 4 casos con visible: false
    And cada caso tiene sector, problema, solución e impacto económico
    And los casos incluyen sectores: Farmacéutica, Retail, Restauración, Clínicas, Servicios
```

## ✅ DEFINITION OF DONE VERIFICADA

- [ ] Archivo `data/cases.ts` con exactamente 5 casos visible: true
- [ ] Casos adicionales (4+) con visible: false para uso chatbot
- [ ] Casos incluyen sectores requeridos: Farmacéutica + Retail e-commerce
- [ ] Componente CaseGrid actualizado mostrando solo CASOS_VISIBLES
- [ ] Grid responsive: 1 col mobile, 2 col tablet, 3 col desktop (3+2 layout)
- [ ] CASOS_MVP importado en system prompt chatbot (todos los casos)
- [ ] Números validados realistas: payback 4-9 semanas, ROI 300-1000%
- [ ] Tests actualizados: CaseGrid renderiza 5 casos, data structure válida
- [ ] No promesas irreales: sin ahorros >80%, sin payback <4 semanas
- [ ] Sectores diversos en casos internos: restauración, clínicas, servicios

## 🔍 DEPENDENCIAS Y VALIDACIONES

**Dependencias Verificadas:**
- ✅ FJG-40: Grid 3 casos base implementado y funcionando
- ✅ FJG-44: Chatbot system prompt operativo (para integración CASOS_MVP)

**Archivos a Modificar:**
- `profesional-web/data/cases.ts` (extender de 3 a 9 casos)
- `profesional-web/components/CaseGrid.tsx` (actualizar import a CASOS_VISIBLES)
- `profesional-web/app/api/chat/route.ts` (actualizar system prompt con CASOS_MVP completo)

**Tests a Actualizar:**
- `__tests__/components/CaseGrid.test.tsx` (5 casos en lugar de 3)
- `__tests__/data/cases.test.ts` (nuevo test structure)
- `__tests__/api/chat-prompt.test.ts` (verificar casos en prompt)

## ⚠️ NOTAS IMPORTANTES

1. **Prueba Social:** 5 casos visibles mejoran credibilidad sin saturar UI
2. **Chatbot Quality:** Casos internos permiten respuestas sectoriales específicas
3. **Responsive Critical:** Grid 3+2 desktop debe funcionar perfecto
4. **Números Realistas:** Verificar que payback y ROI son creíbles (no overpromise)
5. **Content Quality:** Casos internos deben ser tan detallados como visibles

## 📊 CASOS REQUERIDOS ESPECÍFICOS

### Casos Visibles (5)
1. **Manufactura** (existente) - Planificación producción
2. **Logística** (existente) - Costes AWS  
3. **SaaS B2B** (existente) - Forecasting Excel
4. **Farmacéutica** (nuevo) - Validación lotes manual → OCR+IA
5. **Retail E-commerce** (nuevo) - Inventario desincronizado → ERP integration

### Casos Internos (4+)
1. **Restauración** - Turnos manual → Predicción demanda
2. **Clínicas** - No-shows + recordatorios → Automatización WhatsApp
3. **Servicios** - Partes trabajo manual → ERP automation
4. **Consultoría IT** - Reporting clientes → Dashboard real-time

---
**Generado por Agent Manager | Verificado contra Linear FJG-46 | 3 diciembre 2025**