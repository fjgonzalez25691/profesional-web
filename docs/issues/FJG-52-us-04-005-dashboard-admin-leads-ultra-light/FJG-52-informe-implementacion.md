# FJG-52 - Informe de implementación (Dashboard Admin Leads Ultra-Light)

## Resumen
- Dashboard admin `/admin/leads` protegido por password/env con cookie HttpOnly (24h).
- Login API `/admin/login` con `ADMIN_PASSWORD`/`ADMIN_TOKEN`; formulario client-side en `LoginForm`.
- Query de leads con orden DESC y límite 100 (`lib/admin/get-leads.ts`).
- Métricas top (total, agendados, conversión, payback) y tabla con ROI + stage (badges).

## Cambios
- Auth: `app/admin/login/route.ts` (cookie secure/strict), `components/admin/LoginForm.tsx` ya existente.
- Página: `app/admin/leads/page.tsx` (protección + render metrics/table).
- Datos: `lib/admin/get-leads.ts`.
- UI: `components/admin/MetricCard.tsx`, `LeadsMetrics.tsx`, `NurturingBadge.tsx`, `LeadsTable.tsx`.
- Tests: `__tests__/admin/auth.test.ts`, `__tests__/lib/admin/get-leads.test.ts`, `__tests__/components/admin/LeadsMetrics.test.tsx`, `__tests__/components/admin/LeadsTable.test.tsx`.
- E2E lead-capture existente (`__tests__/e2e/lead-capture.spec.ts`) sigue disponible pero no ejecutado en esta tarea.

## Tests ejecutados
- ✅ `npm test -- __tests__/admin/auth.test.ts __tests__/lib/admin/get-leads.test.ts __tests__/components/admin/LeadsMetrics.test.tsx __tests__/components/admin/LeadsTable.test.tsx`
  - Nota: logs esperados al mockear errores en otros tests previos.
  - ✅ E2E `__tests__/e2e/lead-capture.spec.ts` ejecutados manualmente en consola (pasan).

## DoD (estado)
- Página `/admin/leads` protegida: ✅
- Auth básica password env var + cookie HttpOnly/Secure 24h: ✅
- Tabla leads: email, nombre, sector, ROI, stage, fecha: ✅
- Métricas: total, agendados, conversión, payback: ✅
- Orden created_at DESC, sin filtros/export/paginación: ✅ (límite 100)
- Tests auth/datos/UI: ✅

## Pendientes/Notas
- Requiere `ADMIN_PASSWORD` y `ADMIN_TOKEN` en entorno para acceso.
- Assumption: tabla `leads` contiene `roi_data` JSONB y campos nurturing según migraciones previas.
- Si se desea E2E del dashboard, lanzar Playwright con servidor activo.***
