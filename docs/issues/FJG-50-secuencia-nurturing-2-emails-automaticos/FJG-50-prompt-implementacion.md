# FJG-50 PROMPT IMPLEMENTACIÓN - Agent Developer

## VERIFICACIÓN LINEAR OBLIGATORIA
**ANTES DE IMPLEMENTAR:** Leer issue Linear FJG-50 con `mcp_linear_get_issue` y comparar con estas especificaciones.
**SI HAY DISCREPANCIAS:** PARAR y pedir clarificación al humano sobre cuál especificación seguir.

## CONTEXTO
**Issue**: FJG-50 - US-04-003: Secuencia Nurturing 2 Emails Automáticos
**Dependencia**: FJG-49 completado (templates email base)
**Story Points**: 3 SP
**Objetivo**: Sistema automatizado de 2 emails de seguimiento post-ROI para aumentar conversión 15-25%

## PLAN TDD - IMPLEMENTACIÓN SECUENCIAL

### FASE 1: Database Migration (RED → GREEN → REFACTOR)

**CORRECCIÓN CRÍTICA REVIEWER**: Incluir CREATE TABLE completa

**Test 1 - Migration Schema:**
- Crear test para verificar tabla `leads` completa + columnas nurturing
- Path: `profesional-web/__tests__/db/migration-004.test.ts`

**Implementación 1:**
- Modificar `profesional-web/migrations/004_nurturing.sql`
- Schema completo (la tabla NO existe):
```sql
-- Crear tabla leads completa (no existía previamente)
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  company VARCHAR(255),
  employees_current INTEGER,
  turnover_annual INTEGER,
  savings_annual INTEGER,
  payback_months INTEGER,
  calendly_booked BOOLEAN DEFAULT FALSE,
  calendly_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  nurturing_stage INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMP
);

-- 0 = email inicial enviado, 1 = día 1, 2 = día 3, 3 = agendó, -1 = desuscrito
```

### FASE 2: Nurturing Email Function (RED → GREEN → REFACTOR)

**Test 2 - Email Function:**
- Crear test para `sendNurturingEmail()` con templates day1/day3
- Path: `profesional-web/__tests__/lib/email/nurturing.test.ts`
- Mock Resend, verificar plantillas

**Implementación 2:**
- Crear `profesional-web/lib/email/nurturing.ts`
- Función reutiliza Resend (FJG-49)
- Templates: `nurturing-day1.html`, `nurturing-day3.html`

### FASE 3: Templates HTML (RED → GREEN → REFACTOR)

**Test 3 - Templates:**
- Test compilación Handlebars con variables requeridas
- Path: `profesional-web/__tests__/templates/nurturing.test.ts`

**Implementación 3:**
- `profesional-web/templates/nurturing-day1.html`
- `profesional-web/templates/nurturing-day3.html`
- Variables: `{{name}}`, `{{savingsAnnual}}`, `{{paybackMonths}}`, `{{calendlyLink}}`, `{{unsubscribeLink}}`

### FASE 4: Cron API (RED → GREEN → REFACTOR)

**Test 4 - Cron Logic:**
- Test lógica timing (24h, 72h)
- Test autorización CRON_SECRET
- Test límite 50 emails/batch
- Path: `profesional-web/__tests__/api/cron/nurturing.test.ts`

**Implementación 4:**
- `profesional-web/app/api/cron/nurturing/route.ts`
- Lógica según Linear specs
- Query leads correctos por timing
- Update nurturing_stage tras envío

### FASE 5: Vercel Cron Config (RED → GREEN → REFACTOR)

**Test 5 - E2E Cron:**
- Test integración completa
- Path: `profesional-web/__tests__/e2e/nurturing-flow.test.ts`

**Implementación 5:**
- Actualizar `profesional-web/vercel.json`
- Cron diario 10 AM: `"0 10 * * *"`

## CRITERIOS ACEPTACIÓN GHERKIN (Linear)
```gherkin
Feature: Nurturing automático
  Scenario: Email Día 1
    Given lead calculó ROI hace 24h
    And no ha agendado Calendly
    When cron ejecuta 10:00 AM
    Then recibe email "¿Viste tu ahorro?"
    And nurturing_stage = 1

  Scenario: Email Día 3
    Given lead recibió email día 1
    And pasaron 48h más
    And no ha agendado
    When cron ejecuta
    Then recibe email "Última oportunidad"
    And nurturing_stage = 2

  Scenario: Lead agendó
    Given lead agendó Calendly
    When cron ejecuta
    Then NO recibe más emails nurturing
```

## DEFINICIÓN DE HECHO (Linear DoD)
- [ ] Migration `004_nurturing.sql` ejecutada
- [ ] Cron configurado Vercel (10 AM diario)
- [ ] API `/api/cron/nurturing` funcional
- [ ] Templates `nurturing-day1.html`, `nurturing-day3.html`
- [ ] Función `sendNurturingEmail()` reutiliza Resend
- [ ] Lógica: skip si `calendly_booked = true`
- [ ] Link desuscribir funcional (día 3)
- [ ] Test: cron envía emails correctos
- [ ] Límite 50 emails/ejecución (evitar spam)
- [ ] Variable `CRON_SECRET` configurada

## RESTRICCIONES NAVAJA DE OCKHAM
- Reutilizar Resend de FJG-49, NO nueva librería email
- Reutilizar estructura templates existente
- PostgreSQL queries simples, NO ORM adicional
- NO añadir servicios externos para scheduling

## OUTPUT REQUERIDO
Al terminar: generar `FJG-50-informe-implementacion.md` con:
- Lista de archivos creados/modificados
- Resultados de todos los tests
- Evidencia DoD completado
- Notas implementación