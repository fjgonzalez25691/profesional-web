# FJG-52: PROMPT IMPLEMENTACIÓN
## Dashboard Admin Leads Ultra-Light

### CONTEXTO
**Issue Linear:** [FJG-52](https://linear.app/fjgaparicio/issue/FJG-52/us-04-005-dashboard-admin-leads-ultra-light)  
**Prioridad:** 🟠 High (2 SP)  
**Épica:** In2-04 Lead Magnet ROI Auto-Servicio  

### HISTORIA DE USUARIO (LINEAR)
**Como** owner monitoreando conversiones  
**Quiero** ver leads capturados en dashboard simple  
**Para** validar funnel funciona

### IMPACTO NEGOCIO (CRÍTICO)
Dashboard mínimo viable = validar métricas Sprint 3. Sin dashboard = ceguera total sobre conversiones. **Crítico validación "≥10 leads capturados" día 28**.

---

## PLAN TDD DETALLADO

### FASE 1: AUTH SIMPLE (MVP)
**NO OAuth** - Solo password env var con cookie HttpOnly

#### Tests Auth
```typescript
// __tests__/admin/auth.test.ts
describe('Admin Auth', () => {
  test('POST /admin/login - password correcto', async () => {
    const response = await POST({ password: process.env.ADMIN_PASSWORD });
    expect(response.status).toBe(200);
    expect(response.headers).toContain('admin_auth');
  });

  test('POST /admin/login - password incorrecto', async () => {
    const response = await POST({ password: 'wrong' });
    expect(response.status).toBe(401);
  });
});
```

#### Implementación Auth
1. **API Route:** `app/admin/login/route.ts`
   - POST endpoint password validation
   - Set-Cookie admin_auth con token env var
   - HttpOnly, Secure, SameSite=Strict, Max-Age=86400

2. **LoginForm:** `components/admin/LoginForm.tsx`
   - Form password único campo
   - Estado loading/error
   - Submit → fetch /admin/login
   - Success → window.location.reload()

### FASE 2: PÁGINA PROTEGIDA
#### Tests Protección
```typescript
// __tests__/admin/leads-page.test.ts
describe('Admin Leads Page', () => {
  test('sin auth - muestra LoginForm', async () => {
    // Mock cookies sin admin_auth
    const result = await AdminLeadsPage();
    expect(result.type.name).toBe('LoginForm');
  });

  test('con auth válida - muestra dashboard', async () => {
    // Mock cookies con admin_auth = ADMIN_TOKEN
    const result = await AdminLeadsPage();
    expect(result.props.children[0]).toContain('Leads Capturados');
  });
});
```

#### Implementación Página
1. **Layout:** `app/admin/layout.tsx`
   - Metadata noindex,nofollow
   - min-h-screen bg-gray-50

2. **Page:** `app/admin/leads/page.tsx`
   - cookies() verification
   - authToken !== ADMIN_TOKEN → return LoginForm
   - getLeads() database fetch
   - Render LeadsMetrics + LeadsTable

### FASE 3: DATABASE QUERY
#### Tests Database
```typescript
// __tests__/lib/admin/get-leads.test.ts
describe('getLeads', () => {
  test('retorna leads ordenados por created_at DESC', async () => {
    const leads = await getLeads();
    expect(leads[0].created_at >= leads[1].created_at).toBe(true);
  });

  test('include todos los campos requeridos', async () => {
    const leads = await getLeads();
    expect(leads[0]).toHaveProperty('email');
    expect(leads[0]).toHaveProperty('roi_data');
    expect(leads[0]).toHaveProperty('nurturing_stage');
  });
});
```

#### Implementación Database
1. **Query Function:** `lib/admin/get-leads.ts`
   - sql`SELECT * FROM leads ORDER BY created_at DESC`
   - Type: Lead[] interface
   - Error handling + logging

### FASE 4: MÉTRICAS TOP
#### Tests Métricas
```typescript
// __tests__/components/admin/LeadsMetrics.test.ts
describe('LeadsMetrics', () => {
  test('calcula total leads correcto', () => {
    const leads = [mockLead1, mockLead2];
    render(<LeadsMetrics leads={leads} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('calcula conversion rate', () => {
    const leads = [
      { ...mockLead, calendly_booked: true },
      { ...mockLead, calendly_booked: false }
    ];
    render(<LeadsMetrics leads={leads} />);
    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });
});
```

#### Implementación Métricas
1. **Component:** `components/admin/LeadsMetrics.tsx`
   - Grid 4 columnas: Total, Agendados, Conversión, Payback
   - Cálculos: totalLeads, bookedCount, conversionRate, avgPayback
   - MetricCard reusable

2. **MetricCard:** `components/admin/MetricCard.tsx`
   - Props: label, value
   - Styling consistente

### FASE 5: TABLA LEADS
#### Tests Tabla
```typescript
// __tests__/components/admin/LeadsTable.test.ts
describe('LeadsTable', () => {
  test('muestra headers correctos', () => {
    render(<LeadsTable leads={[]} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Sector')).toBeInTheDocument();
    expect(screen.getByText('Stage')).toBeInTheDocument();
  });

  test('renderiza lead data', () => {
    const leads = [mockLeadWithROI];
    render(<LeadsTable leads={leads} />);
    expect(screen.getByText(mockLead.email)).toBeInTheDocument();
    expect(screen.getByText('35.700€')).toBeInTheDocument();
  });
});
```

#### Implementación Tabla
1. **Table:** `components/admin/LeadsTable.tsx`
   - Headers: Email, Nombre, Sector, Ahorro €/año, Payback, Stage, Fecha
   - lead.roi_data.savingsAnnual.toLocaleString()€
   - NurturingBadge component para stage

2. **NurturingBadge:** `components/admin/NurturingBadge.tsx`
   - Badge coloreado según stage
   - initial/day1/day3/converted

---

## CRITERIOS ACEPTACIÓN (GHERKIN - LINEAR)
```gherkin
Feature: Dashboard admin leads
  Scenario: Login admin
    Given accedo /admin/leads
    When ingreso contraseña correcta
    Then veo dashboard leads

  Scenario: Ver leads
    Given autenticado como admin
    When abro dashboard
    Then veo tabla leads ordenados por fecha DESC
    And veo 4 métricas top: total, agendados, conversión, payback

  Scenario: Sin auth
    Given NO autenticado
    When accedo /admin/leads
    Then veo formulario login
    And NO veo datos leads
```

## DEFINITION OF DONE (LINEAR)
* ✅ Página `/admin/leads` protegida
* ✅ Auth básica password env var (NO OAuth MVP)
* ✅ Cookie HttpOnly secure 24h
* ✅ Tabla leads: email, nombre, sector, ROI, stage, fecha
* ✅ 4 métricas: total leads, agendados, %, payback promedio
* ✅ Ordenado created_at DESC (más recientes primero)
* ✅ **NO filtros S3** (solo vista completa)
* ✅ **NO export CSV S3** (manual query si necesario)
* ✅ **NO paginación S3** (lista completa <100 leads MVP)
* ✅ Test: auth funciona, datos mostrados correctamente

---

## INSTRUCCIONES ESPECÍFICAS

### ENV VARS REQUERIDAS
```env
ADMIN_PASSWORD=tu_password_seguro
ADMIN_TOKEN=random_token_secure_24h
```

### ARQUITECTURA SIMPLE (NAVAJA OCKHAM)
- **Reutilizar:** tabla leads existente (FJG-51)
- **NO crear:** nuevos servicios, APIs complejas, OAuth
- **KISS:** Auth = password + cookie, Styling = TailwindCSS existente

### RESTRICCIONES MVP
- **NO paginación** (máximo 100 leads esperados)
- **NO filtros** (vista completa suficiente Sprint 3)
- **NO export** (query manual PostgreSQL si necesario)
- **NO real-time** (refresh manual página)

### TESTS OBLIGATORIOS TDD
1. Auth: login correcto/incorrecto, cookie setting
2. Protection: página sin auth → LoginForm
3. Database: getLeads query + ordenamiento DESC
4. Metrics: cálculos matemáticos correctos
5. Table: rendering data, formateo números

### OUTPUT ESPERADO
Al completar, generar `FJG-52-informe-implementacion.md` con:
- ✅ Checklist DoD cumplido
- 📊 Resultados tests (todos verdes)
- 🔧 Archivos creados/modificados
- ⚠️ Limitaciones/assumptions
- 🚀 Instrucciones deployment/uso