# FJG-51 - Informe de implementación (Lead Capture Postgres + Validación)

## Resumen
- Opción A aplicada: se mantiene `SERIAL` y se añaden campos/índices faltantes vía `migrations/005_leads_patch.sql`.
- Validación con Zod para payload de leads (`lib/validation/lead-schema.ts`) y utilidades de email (desechables/corporativos).
- API `/api/leads` con UPSERT por email (actualiza roi_data, sector, pains, utm...), warnings de email desechable.
- Integración en el wizard: Step3 ahora guarda el lead antes de enviar el email; se pasa pains y datos de usuario.
- Tests unit/RTL cubren migración, validaciones, API y wizard; se añadió suite E2E `__tests__/e2e/lead-capture.spec.ts` (mock de APIs).

## Cambios clave
- Migraciones: `migrations/005_leads_patch.sql` (campos company_name, sector, company_size, pains JSONB, roi_data JSONB, utm_*, unsubscribed, updated_at + índices). *Ejecutada por consola según indicación.*
- Validación: `lib/validation/email.ts`, `lib/validation/lead-schema.ts`.
- API: `app/api/leads/route.ts` (Zod + UPSERT + warnings).
- UI: `components/calculator/Step3Results.tsx` y `ROICalculator.tsx` guardan lead antes de enviar email.
- Tests:
  - DB: `__tests__/db/migration-005.test.ts`
  - Validación: `__tests__/lib/validation/email.test.ts`, `__tests__/lib/validation/lead-schema.test.ts`
  - API: `__tests__/api/leads.test.ts`
  - UI: `__tests__/components/ROICalculator.test.tsx`
  - E2E (mocked): `__tests__/e2e/lead-capture.spec.ts`

## Tests ejecutados
- ✅ `npm test -- __tests__/db/migration-005.test.ts __tests__/lib/validation/email.test.ts __tests__/lib/validation/lead-schema.test.ts __tests__/api/leads.test.ts __tests__/components/ROICalculator.test.tsx`
  - Nota: tests de error de API loguean en consola (esperado).
- ⏳ E2E `__tests__/e2e/lead-capture.spec.ts` no ejecutados en esta sesión; requieren Playwright con servidor activo o mocks (el archivo ya incluye mocks de /api/leads y /api/send-roi-email).

## Criterios de aceptación
- Lead nuevo válido con nurturing_stage=0 y leadId en respuesta: ✅ (API + tests).
- Email duplicado actualiza roi_data manteniendo leadId: ✅ (UPSERT).
- Email inválido retorna 400: ✅ (Zod + tests).
- Detección email desechable: ✅ (warnings, no bloquea).

## DoD
- Tabla `leads` con campos e índices: ✅ (005 aplicado; se indicó ejecución por consola).
- API POST `/api/leads` funcional: ✅
- Validación Zod completa: ✅
- UPSERT por email: ✅
- Emails desechables detectados (warning): ✅
- UTM tracking capturado: ✅
- Tests unit/RTL: ✅
- E2E: ⚠️ archivo listo, pendiente de ejecución en entorno con Playwright/servidor activo.

## Notas/Pendientes
- Confirmar en Neon que `migrations/005` se ejecutó correctamente y que los índices existen.
- Si se requiere evidencia E2E, lanzar `npm run test:e2e -- __tests__/e2e/lead-capture.spec.ts` con `npm run dev` activo o ajustando mock server.
