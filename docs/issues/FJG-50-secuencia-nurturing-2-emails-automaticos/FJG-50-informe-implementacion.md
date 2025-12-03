# FJG-50 - Informe de implementación (Secuencia Nurturing 2 Emails)

## Resumen
- Migración `004_nurturing.sql` ahora crea `leads` completa si no existe y añade `nurturing_stage` y `last_email_sent_at` con `IF NOT EXISTS`.
- Templates HTML nurturing día 1 y día 3 (`templates/nurturing-day1.html`, `nurturing-day3.html`).
- Función `sendNurturingEmail` (Resend + Handlebars) para day1/day3.
- Cron API `/api/cron/nurturing` con ventanas 24h/48h, límite 50 y Auth via `CRON_SECRET`.
- Cron Vercel 10:00 AM diario configurado en `vercel.json`.

## Cambios realizados
- Migración: `migrations/004_nurturing.sql`.
- Email: `lib/email/nurturing.ts`; templates en `templates/nurturing-day1.html` y `templates/nurturing-day3.html`.
- API: `app/api/cron/nurturing/route.ts`.
- Tests:
  - Migración: `__tests__/db/migration-004.test.ts`
  - Templates: `__tests__/templates/nurturing.test.ts`
  - Email function: `__tests__/lib/email/nurturing.test.ts`
  - Cron: `__tests__/api/cron/nurturing.test.ts`
- Config: `vercel.json` cron 10 AM.

## Tests ejecutados
- ✅ `npm test -- __tests__/db/migration-004.test.ts __tests__/templates/nurturing.test.ts __tests__/lib/email/nurturing.test.ts __tests__/api/cron/nurturing.test.ts`
  - Nota: el test de error en emails de FJG-49 sigue logueando en consola (comportamiento esperado).
  - ✅ Reejecutado `npm test -- __tests__/db/migration-004.test.ts` tras corrección de migración.

## Criterios de Aceptación
- Email día 1 y día 3 con subjects/CTA definidos: ✅ (templates + sendNurturingEmail).
- Cron envía según ventanas 24h/48h y actualiza `nurturing_stage`: ✅ (tests cron).
- Skip si `calendly_booked = true`: ✅ (query filtra).
- Límite 50 emails por batch: ✅ (queries LIMIT 50).
- Desuscribir en día 3: ✅ (link en template y datos en función).

## Definition of Done
- Migration creada (pendiente de ejecutar en entorno real): ⚠️
- Cron Vercel configurado: ✅
- API `/api/cron/nurturing`: ✅
- Templates day1/day3: ✅
- Función sendNurturingEmail: ✅
- Skip si booked: ✅
- Link desuscribir funcional: ✅
- Tests cron/envío correctos: ✅
- `CRON_SECRET` requerido (validación): ✅

## Variables de entorno nuevas
- `CRON_SECRET` (Bearer para endpoint cron).
- `PUBLIC_UNSUBSCRIBE_URL` (opcional, base para link de desuscripción).

## Notas/Pendientes
- Ejecutar migración `004_nurturing.sql` en la base (Neon) antes de habilitar cron.
- Validar en entorno real que la tabla leads contiene `calendly_booked`; ajustar si el esquema difiere.
- Si se requiere end-to-end real, probar cron con `curl` + header `Authorization: Bearer $CRON_SECRET`.
