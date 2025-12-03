# FJG-51 PROMPT IMPLEMENTACIÓN - Agent Developer

## VERIFICACIÓN LINEAR OBLIGATORIA
**ANTES DE IMPLEMENTAR:** Leer issue Linear FJG-51 con `mcp_linear_get_issue` y comparar con estas especificaciones.
**SI HAY DISCREPANCIAS:** PARAR y pedir clarificación al humano sobre cuál especificación seguir.

## CONTEXTO
**Issue**: FJG-51 - US-04-004: Lead Capture Postgres + Validación
**Dependencia**: FJG-35 (Postgres setup completado)
**Story Points**: 2 SP
**Objetivo**: Sistema completo captura y persistencia leads ROI con validaciones

## PLAN TDD - IMPLEMENTACIÓN SECUENCIAL

### FASE 1: Database Migration Leads (RED → GREEN → REFACTOR)

**Test 1 - Schema Leads:**
- Test verificar tabla `leads` completa con estructura UUID, JSONB
- Path: `profesional-web/__tests__/db/migration-002.test.ts`

**Implementación 1:**
- Crear `profesional-web/migrations/002_leads.sql`
- Schema según Linear con UUID, JSONB para roi_data y pains
- Índices optimizados: email, created_at DESC, nurturing
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  company_name VARCHAR(255),
  sector VARCHAR(50),
  company_size VARCHAR(20),
  pains JSONB,
  roi_data JSONB NOT NULL,
  source VARCHAR(100) DEFAULT 'roi-calculator',
  utm_campaign VARCHAR(100),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  nurturing_stage INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMP DEFAULT NOW(),
  calendly_booked BOOLEAN DEFAULT false,
  unsubscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### FASE 2: Validación Schema con Zod (RED → GREEN → REFACTOR)

**Test 2 - Validación Input:**
- Test LeadSchema con casos válidos e inválidos
- Path: `profesional-web/__tests__/lib/validation/lead-schema.test.ts`
- Mock scenarios: email inválido, roiData incompleto, pains array vacío

**Implementación 2:**
- Crear `profesional-web/lib/validation/lead-schema.ts`
- Zod schema exacto según Linear specs
- Validation functions para email desechable/corporativo

### FASE 3: Email Validation Utils (RED → GREEN → REFACTOR)

**Test 3 - Email Validation:**
- Test `isDisposableEmail()`, `isCompanyEmail()`
- Path: `profesional-web/__tests__/lib/validation/email.test.ts`
- Cases: tempmail, gmail, corporate domains

**Implementación 3:**
- Crear `profesional-web/lib/validation/email.ts`
- Funciones detección emails desechables
- Warning opcional (no bloquea MVP según Linear)

### FASE 4: API Route Leads (RED → GREEN → REFACTOR)

**Test 4 - API Endpoints:**
- Test POST `/api/leads` con validación completa
- Test UPSERT behavior (email existente)
- Path: `profesional-web/__tests__/api/leads.test.ts`
- Mock sql y verificar queries

**Implementación 4:**
- Crear `profesional-web/app/api/leads/route.ts`
- POST handler con Zod validation
- UPSERT logic: INSERT ... ON CONFLICT DO UPDATE
- UTM params capture según Linear

### FASE 5: E2E Tests con Playwright (RED → GREEN → REFACTOR)

**REQUISITO CRÍTICO**: Tests E2E NO pueden fallar por configuración DB

**Test 5 - E2E Test Environment Setup:**
- Configurar test DB environment o mocking apropiado
- Path: `profesional-web/__tests__/e2e/lead-capture.spec.ts`
- **Opción A**: Test DB separada (DATABASE_URL_TEST)
- **Opción B**: Mock complete de API calls en E2E

**Implementación 5A - Test DB Environment:**
```typescript
// playwright.config.ts - usar test DB
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST || 'mock://test';

// setup-test-db.ts
export async function setupTestDB() {
  if (process.env.DATABASE_URL_TEST) {
    // Usar test DB real con cleanup
    await sql`TRUNCATE leads RESTART IDENTITY CASCADE`;
  } else {
    // Mock API responses completamente
    await page.route('**/api/leads', mockLeadsAPI);
  }
}
```

**Implementación 5B - Mock Strategy (Recomendado):**
```typescript
// __tests__/e2e/lead-capture.spec.ts
test.beforeEach(async ({ page }) => {
  // Mock API /api/leads responses
  await page.route('**/api/leads', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, leadId: 'test-id-123' })
      });
    }
  });
});

test('should capture lead after ROI calculation', async ({ page }) => {
  await page.goto('/calculadora-roi');
  // Completar calculadora...
  await page.fill('[data-testid="email"]', 'ceo@empresa.com');
  await page.click('[data-testid="submit-lead"]');
  
  // Verificar UI response (no DB real)
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});
```

**Test Cases con Mock:**
- Happy path: calculadora → email válido → success message
- Validation: email inválido → error message  
- Network errors: API failure → retry/error handling
- Loading states: form submission → spinner → result

## CRITERIOS ACEPTACIÓN GHERKIN (Linear)
```gherkin
Feature: Captura leads
  Scenario: Lead nuevo válido
    Given completo calculadora ROI
    And ingreso email "ceo@empresa.com"
    When envío formulario
    Then lead guardado Postgres
    And recibo leadId en respuesta
    And nurturing_stage = 0

  Scenario: Email duplicado
    Given email ya existe en DB
    When envío mismo email
    Then actualiza roi_data
    And mantiene mismo leadId
    And updated_at actualizado

  Scenario: Email inválido
    Given ingreso "email-invalido"
    When envío formulario
    Then recibo error 400
    And mensaje "Email inválido"

  Scenario: Email desechable
    Given ingreso "test@tempmail.com"
    When envío formulario
    Then warning opcional (no bloquea MVP)
```

## DEFINICIÓN DE HECHO (Linear DoD)
- [ ] Tabla `leads` creada/extendida (EJECUTADO con migration 005)
- [ ] Migration `005_leads_patch.sql` ejecutada producción
- [ ] API POST `/api/leads` funcional
- [ ] Validación Zod: email, nombre, roiData
- [ ] UPSERT: si email existe → actualiza roi_data
- [ ] Detección emails desechables (opcional MVP)
- [ ] UTM tracking capturado (campaign, source, medium)
- [ ] Tests: insert correcto, validación errores
- [ ] **E2E Tests Playwright**: flujo calculadora → lead capture → DB
- [ ] Índices creados (email, created_at, nurturing) - EJECUTADO

## ESTRUCTURA DATOS ESPECÍFICA

### ROI Data Object:
```typescript
{
  investment: number,
  savingsAnnual: number,
  paybackMonths: number,
  roi3Years: number
}
```

### Pains Array:
```typescript
string[] // Array de dolores seleccionados en calculadora
```

### UTM Params:
```typescript
{
  campaign?: string,
  source?: string,
  medium?: string
}
```

## RESTRICCIONES NAVAJA DE OCKHAM
- Reutilizar conexión Postgres existente (getNeonClient)
- NO ORM adicional, usar @vercel/postgres directo
- Zod para validación (ya en dependencies)
- SERIAL ID mantenido (compatibilidad FJG-50)
- JSONB para estructuras complejas (roi_data, pains)
- **E2E Tests**: Mocking API preferido sobre test DB setup
- **NO test DB** real en CI/CD - usar mocks para stabilidad

## NOTA IMPORTANTE
**CONFLICTO DETECTADO:** FJG-50 ya creó tabla `leads` básica. Verificar si migration 002 debe ser ALTER TABLE o CREATE IF NOT EXISTS para compatibilidad.

## OUTPUT REQUERIDO
Al terminar: generar `FJG-51-informe-implementacion.md` con:
- Lista archivos creados/modificados
- Resultados tests (schema, validation, API, e2e)
- Evidencia DoD completado
- Conflictos schema resueltos