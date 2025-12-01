# INFORME DE IMPLEMENTACIÓN: FJG-35

**Tarea:** US-01-001 – Setup Next.js 16 + TypeScript + Neon PostgreSQL  
**Estado:** Completado ✅

## 1. Resumen de Cambios
- Vitest estabilizado con `pool: 'threads'` y paths de tests explícitos (`vitest.config.mts`), añadiendo script `typecheck`.
- Integración Neon: helper `lib/db.ts` con guardado de `DATABASE_URL` y tests de cliente (`__tests__/db.test.ts`); `.env.example` actualizado a variables Neon.
- Landing revisada: nuevo hero orientado a diagnóstico P&L y CTA a Calendly, eliminando fuentes remotas para builds offline (`app/page.tsx`, `app/layout.tsx`, `app/globals.css`).
- README alineado con Next.js 16, Neon, comandos de lint/typecheck/tests/build y estructura del proyecto (`profesional-web/README.md`).
- Build seguro: `npm run build` ahora fuerza webpack (`package.json`); ESLint ignora `coverage/`.

## 2. Tests Ejecutados
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## 3. Decisiones Técnicas
- Forzar webpack en `npm run build` para evitar bloqueo de Turbopack en el entorno (error de puerto no permitido).
- Mock de `@neondatabase/serverless` en tests para validar wiring sin dependencias externas ni conexión real.
- Eliminación de `next/font/google` para evitar dependencias de red en build y mantener Ockham.
