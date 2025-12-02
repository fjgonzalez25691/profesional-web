# TAREA DE IMPLEMENTACIÓN: FJG-40

**Rol:** Agent Developer (Ver `.prompts/ROLES.md`)
**Objetivo:** US-02-003: Grid 3 Casos Éxito con ROI Específico

## 0. Verificación Linear (OBLIGATORIO)
**ANTES DE IMPLEMENTAR, AGENT DEVELOPER DEBE:**
1. Leer issue Linear original: `mcp_linear_get_issue FJG-40`
2. Comparar especificaciones Linear vs este prompt
3. Si hay discrepancias, PARAR y pedir clarificación al humano
4. Solo proceder si Linear y prompt coinciden 100%

## 1. Constitución (OBLIGATORIO)
Confirma que has leído:
1.  `.prompts/CONSTITUCION.md` (Verificación Linear incluida)
2.  `docs/ESTADO_PROYECTO.md`
3.  La issue FJG-40 verificada via Linear MCP

## 1. Objetivo Funcional (VERIFICADO vs Linear)
**Como** CEO escéptico  
**Quiero** ver 3 casos reales con ROI específico  
**Para** creer que funciona en empresas como mía

**Impacto**: Prueba social crítica. Casos con "Inversión 4.8K€ → Ahorro 38K€/año → Payback 6 semanas" = negocio tangible. Impacto directo "Demostración casos" (15%) + "Conversión" (22%).

## 2. Criterios de Aceptación (CA) - COPIADOS DE LINEAR
* [ ] 3 casos data/cases.ts con estructura exacta especificada
* [ ] Componente `<CaseGrid>` responsive (1 col mobile, 3 cols desktop)
* [ ] Cada caso validado CEO real (email/contrato mencionado)
* [ ] Test case-grid.spec.tsx PASANDO
* [ ] CTA Calendly con UTM tracking en cada caso
* [ ] ROI específico visible: inversión → ahorro → payback semanas

## 3. Definición de Hecho (DoD) - SEGÚN LINEAR + ESTÁNDARES
* [ ] Tests pasando (Unitarios/Integración) - case-grid.spec.tsx
* [ ] 3 casos data/cases.ts con estructura Linear exacta
* [ ] Componente `<CaseGrid>` implementado
* [ ] Responsive: 1 col mobile, 3 cols desktop
* [ ] CTA Calendly con UTM tracking
* [ ] Sin credenciales hardcodeadas
* [ ] Estilo: Comentarios en ES, Código en EN

## 4. Datos Hardcoded Especificados (Linear)

Crear **exactamente** según Linear:

```typescript
// profesional-web/data/cases.ts
export const CASOS_MVP = [
  {
    id: 'caso-001',
    sector: 'Logística',
    company_size: '8M€',
    employees: 45,
    pain: '42.000€/año picando albaranes en papel',
    solution: 'OCR + flujo automático a ERP',
    investment: 4800,
    savings_annual: 38000,
    payback_weeks: 6,
  },
  {
    id: 'caso-002',
    sector: 'Agencia Marketing',
    company_size: '12M€',
    employees: 60,
    pain: 'Factura AWS 8.5K€/mes sin control',
    solution: 'Rightsizing + Reserved Instances',
    investment: 3200,
    savings_annual: 35000,
    payback_weeks: 4,
  },
  {
    id: 'caso-003',
    sector: 'Fabricante Industrial',
    company_size: '25M€',
    employees: 120,
    pain: 'Forecasting demanda falla 30%',
    solution: 'ML predicción + alertas automáticas',
    investment: 9500,
    savings_annual: 85000,
    payback_weeks: 5,
  },
];
```

## 5. Archivos Afectados

**Crear:**
* `profesional-web/data/cases.ts`: Datos hardcoded según estructura Linear exacta
* `profesional-web/components/CaseGrid.tsx`: Grid responsive 3 casos con ROI
* `profesional-web/__tests__/components/case-grid.spec.tsx`: Tests unitarios completos

**Modificar:**
* `profesional-web/app/page.tsx`: Integrar `<CaseGrid>` entre PainPoints y FloatingCalendlyButton

## 6. Especificaciones Técnicas

### CaseGrid.tsx
- **Layout**: Grid CSS responsive (1 col mobile, 3 cols desktop)
- **Contenido por caso**:
  - Sector + tamaño empresa
  - Pain point específico (cuantificado €)
  - Solución implementada
  - **ROI destacado**: Inversión → Ahorro anual → Payback semanas
  - CTA "Ver detalles" con tracking UTM
- **Diseño**: Cards con hover effects, tipografía jerárquica ROI
- **Analytics**: Track clicks en CTAs con source differentiation

### Tests case-grid.spec.tsx
- Renderizado correcto 3 casos
- Responsive behavior mobile/desktop
- UTM tracking functionality
- ROI calculations display
- CTA click events

## 7. Integración Analytics
- Track "case_view" events con sector
- Track "case_cta_click" con case_id + UTM parameters
- Source tracking para conversión funnel

**CRÍTICO**: Verificar coherencia 100% con Linear antes de implementar.