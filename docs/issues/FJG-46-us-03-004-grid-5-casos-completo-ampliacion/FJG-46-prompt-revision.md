# FJG-46: PROMPT DE REVISIÓN
**US-03-004: Grid 5 Casos Completo (Ampliación)**

## 📋 CONTEXTO LINEAR VERIFICADO ✅

**Epic:** In2-03 Chatbot IA Cualificación Leads  
**Sprint:** S2 (Días 8-14)  
**Prioridad:** 🟡 Medium/Low (2 Story Points)  
**Issue Original:** https://linear.app/fjgaparicio/issue/FJG-46/us-03-004-grid-5-casos-completo-ampliacion

## 🔍 MISIÓN DEL AGENT REVIEWER

**ROL DE SOLO LECTURA** - Verificar calidad, contenido y cumplimiento exacto de especificaciones Linear **SIN MODIFICAR CÓDIGO**.

## 📊 CRITERIOS DE AUDITORÍA TÉCNICA

### 1️⃣ VERIFICACIÓN DATA STRUCTURE CASOS

**Checklist Casos Visibles (5):**
- [ ] Exactamente 5 casos con `visible: true`
- [ ] Caso Farmacéutica incluido (sector requerido Linear)
- [ ] Caso Retail E-commerce incluido (sector requerido Linear)
- [ ] Casos existentes mantenidos (Manufactura, Logística, SaaS)
- [ ] Todos los campos obligatorios presentes: id, sector, company_size, employees, pain, solution, investment, savings_annual, payback_weeks, visible

**Checklist Casos Internos (4+):**
- [ ] Al menos 4 casos con `visible: false`
- [ ] Sectores diversos: Restauración, Clínicas, Servicios, Consultoría
- [ ] Calidad contenido igual que casos visibles
- [ ] Campos ROI completos y realistas

**Checklist Validación Métricas:**
- [ ] Payback entre 4-9 semanas (no promesas irreales <4)
- [ ] ROI annual 300-1000% (realista para automatización)
- [ ] Investment 3-8K€ (rango SME apropiado)
- [ ] Savings 28-68K€ (proporcional empresa sizes)
- [ ] Company sizes variados: 3-22M€

### 2️⃣ VERIFICACIÓN COMPONENTE CASEGRID

**Checklist Rendering:**
- [ ] Import correcto `CASOS_VISIBLES` de data/cases
- [ ] Renderiza exactamente 5 casos (no más, no menos)
- [ ] `data-testid="cases-grid"` presente para tests
- [ ] `data-testid="case-card-{id}"` para cada caso
- [ ] Título actualizado "5 Casos Reales de Éxito"

**Checklist Responsive Layout:**
- [ ] Mobile: `grid-cols-1` (columna única)
- [ ] Tablet: `md:grid-cols-2` (2 columnas) 
- [ ] Desktop: `lg:grid-cols-3` (3 columnas → layout 3+2)
- [ ] Gap apropiado entre cards
- [ ] Cards mantienen proporción en todos breakpoints

**Checklist Contenido Cards:**
- [ ] Sector badge con color distintivo
- [ ] Company size + employees mostrados
- [ ] Problema (PROBLEMA label + descripción)
- [ ] Solución (SOLUCIÓN label + descripción)
- [ ] Métricas ROI: ahorro/año, payback, ROI%
- [ ] Cálculos ROI correctos: `(savings_annual/investment)*100`

### 3️⃣ VERIFICACIÓN CHATBOT INTEGRATION

**Checklist System Prompt:**
- [ ] Import correcto `CASOS_MVP` (todos los casos)
- [ ] Función `getChatbotSystemPrompt()` actualizada
- [ ] Casos formateados en prompt: sector + problema + solución + métricas
- [ ] Incluye casos visibles (5) + casos internos (4+)
- [ ] Texto coherente con personalidad establecida

**Checklist Contenido Prompt:**
- [ ] Casos Farmacéutica y Retail presentes en prompt
- [ ] Casos internos (Restauración, Clínicas, Servicios) presentes
- [ ] Métricas formateadas: "Inversión XK€, ahorro YK€/año, payback Z semanas"
- [ ] No promesas irreales en texto prompt
- [ ] Enfoque cualificación leads mantenido

### 4️⃣ VERIFICACIÓN TESTING TDD

**Checklist Tests CaseGrid:**
- [ ] Test renderiza exactamente 5 casos
- [ ] Test layout responsive (mobile 1 col, desktop 3 col)
- [ ] Test sectores nuevos presentes (Farmacéutica, Retail)
- [ ] Mock window.innerWidth para responsive tests
- [ ] Assertions específicas grid classes

**Checklist Tests Data:**
- [ ] Test exactamente 5 casos visible: true
- [ ] Test al menos 4 casos visible: false  
- [ ] Test casos requeridos presentes (farmacéutica, retail)
- [ ] Test diversidad sectorial casos internos
- [ ] Test métricas ROI válidas (ranges realistas)

**Checklist Tests Chatbot Prompt:**
- [ ] Test system prompt incluye todos casos
- [ ] Test casos visibles presentes en prompt
- [ ] Test casos internos presentes en prompt  
- [ ] Test no promesas irreales (90%, 100%, 1 week payback)

### 5️⃣ VERIFICACIÓN CRITERIOS GHERKIN

**Scenario: Grid 5 casos desktop**
- [ ] Grid 3 columnas en desktop (lg:grid-cols-3)
- [ ] Primera fila: 3 casos
- [ ] Segunda fila: 2 casos  
- [ ] Sector, problema, solución, impacto mostrados

**Scenario: Grid 5 casos mobile**
- [ ] 5 cards en columna única
- [ ] Scroll vertical funcional
- [ ] Legibilidad mantenida en mobile

**Scenario: CASOS_MVP extendido chatbot**
- [ ] 5 casos visibles identificados
- [ ] 4+ casos internos identificados
- [ ] Sectores requeridos presentes
- [ ] Todos casos con impacto económico

### 6️⃣ VERIFICACIÓN DEFINITION OF DONE

**Checklist DoD Linear:**
- [ ] data/cases.ts con 5 casos visible: true
- [ ] Casos adicionales visible: false para chatbot
- [ ] Sectores Farmacéutica + Retail incluidos
- [ ] CaseGrid muestra solo CASOS_VISIBLES
- [ ] Responsive 1/2/3 columnas correcto
- [ ] CASOS_MVP en system prompt chatbot
- [ ] Números realistas (payback 4-9 sem)
- [ ] Tests actualizados 5 casos
- [ ] Sin promesas irreales
- [ ] Sectores diversos casos internos

## 🔒 VERIFICACIÓN CALIDAD CONTENIDO

**Checklist Realismo Casos:**
- [ ] Problemas específicos y creíbles por sector
- [ ] Soluciones técnicamente factibles
- [ ] Métricas ROI en rangos SME realistas
- [ ] Company sizes apropiadas por sector
- [ ] Inversiones proporcionales al problema

**Checklist Escritura:**
- [ ] Lenguaje claro sin jerga técnica
- [ ] Problemas cuantificados (horas, %, costes)
- [ ] Soluciones concretas (no genéricas)
- [ ] Coherencia tono con casos existentes
- [ ] Sin promesas absolutas ("elimina 100%")

### 7️⃣ VERIFICACIÓN UX/UI

**Checklist Experiencia Usuario:**
- [ ] Grid no se siente saturado con 5 casos
- [ ] Cards mantienen legibilidad en todos devices
- [ ] Métricas ROI destacan visualmente
- [ ] Layout 3+2 desktop se ve equilibrado
- [ ] Mobile scroll suave sin cortes

**Checklist Accesibilidad:**
- [ ] Contraste apropiado badges sectores
- [ ] Jerarquía visual clara problema/solución
- [ ] Text size legible en mobile
- [ ] Focus states botones
- [ ] Alt texts si hay iconos/imágenes

## 📝 SCRIPT VERIFICACIÓN AUTOMÁTICA

```typescript
// Script para Agent Reviewer - Solo lectura
describe('FJG-46 Compliance Check', () => {
  it('should verify 5 visible cases exactly', () => {
    const visibleCases = CASOS_VISIBLES;
    expect(visibleCases).toHaveLength(5);
    
    const sectors = visibleCases.map(c => c.sector);
    expect(sectors).toContain('Farmacéutica');
    expect(sectors).toContain('Retail E-commerce');
  });
  
  it('should verify internal cases for chatbot', () => {
    const totalCases = CASOS_MVP.length;
    const internalCases = CASOS_MVP.filter(c => !c.visible);
    
    expect(totalCases).toBeGreaterThanOrEqual(9);
    expect(internalCases.length).toBeGreaterThanOrEqual(4);
  });
  
  it('should verify grid renders correctly', () => {
    render(<CaseGrid />);
    const cards = screen.getAllByTestId(/^case-card-/);
    expect(cards).toHaveLength(5);
  });
  
  it('should verify chatbot prompt includes all cases', () => {
    const prompt = getChatbotSystemPrompt();
    expect(prompt).toContain('Farmacéutica');
    expect(prompt).toContain('Restauración');
  });
});
```

## 📊 MÉTRICAS DE VALIDACIÓN

**Checklist Números Específicos:**
- [ ] Payback weeks: todos entre 4-9 (no <4, no >12)
- [ ] ROI annual: 300-1000% rango (no <200%, no >1500%)
- [ ] Investment: 3-8K€ rango SME (no <2K, no >10K)  
- [ ] Savings: proporcional company size
- [ ] Company sizes: 3-22M€ diversidad sectorial

**Validaciones Anti-Overpromise:**
- [ ] Sin "90%" o "100%" en descripciones
- [ ] Sin "1 semana" payback
- [ ] Sin "elimina completamente" problemas
- [ ] Sin "garantiza" resultados
- [ ] Sin costes "desde X€" sin contexto

## 📝 FORMATO INFORME REVISIÓN

**Template Respuesta Agent Reviewer:**

```markdown
## 🔍 INFORME REVISIÓN FJG-46

### ✅ CUMPLIMIENTO ESPECIFICACIÓN LINEAR
- **Data Structure**: [✅/⚠️/❌] + detalles casos
- **CaseGrid Component**: [✅/⚠️/❌] + detalles responsive  
- **Chatbot Integration**: [✅/⚠️/❌] + detalles prompt
- **Testing TDD**: [✅/⚠️/❌] + cobertura

### 📊 CALIDAD CONTENIDO
- **Realismo Casos**: [✅/⚠️/❌] + métricas validadas
- **Sectores Requeridos**: [✅/⚠️/❌] + Farmacéutica/Retail
- **Casos Internos**: [✅/⚠️/❌] + diversidad sectorial

### 🎨 UX/UI Y RESPONSIVE
- **Layout Desktop**: [✅/⚠️/❌] + grid 3+2
- **Mobile Experience**: [✅/⚠️/❌] + scroll/legibilidad
- **Content Balance**: [✅/⚠️/❌] + saturación visual

### 🎯 VEREDICTO FINAL
**[✅ APROBADO / ⚠️ APROBADO CON OBSERVACIONES / ❌ RECHAZADO]**

**Justificación:** [Explicación técnica del veredicto]

**Observaciones Críticas:** [Solo si ⚠️ o ❌]
1. [Detalle específico issue]
2. [Detalle específico issue]

**Acción Requerida:** [Solo si ❌]
- [Acción específica para Developer]
```

## ⚠️ REGLAS ESTRICTAS REVIEWER

1. **SOLO LECTURA**: NO modificar código bajo ninguna circunstancia
2. **NO SUGERIR FIXES**: Solo señalar errores específicos
3. **VERIFICACIÓN DUAL**: Linear + código implementado
4. **CONTENT QUALITY**: Validar realismo y coherencia casos
5. **RESPONSIVE CRITICAL**: Layout debe funcionar perfecto mobile/desktop
6. **ANTI-OVERPROMISE**: Rechazar si promesas irreales

## 🔍 PUNTOS CRÍTICOS REVISAR

1. **Exactamente 5 casos visibles** (ni más ni menos)
2. **Farmacéutica + Retail presentes** (requisito Linear específico)  
3. **Layout responsive 3+2** (3 primera fila, 2 segunda fila desktop)
4. **Casos internos calidad** (no placeholder content)
5. **Chatbot prompt actualizado** (incluye todos casos)
6. **Métricas realistas** (no overpromise payback/ROI)

---
**Generado por Agent Manager | Prompt Revisión FJG-46 | 3 diciembre 2025**