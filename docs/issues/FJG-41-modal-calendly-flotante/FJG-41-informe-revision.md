# INFORME DE REVISIÓN FJG-41

**Rol:** Agent Reviewer  
**Issue:** FJG-41 - US-02-004: Modal Calendly Flotante 2 Clics  
**Fecha:** 3 de diciembre de 2025  
**Revisor:** Agente Revisor

## Veredicto Final
✅ **Aprobable** — Cumple CA/DoD tras la corrección del prompt: Radix Dialog, FAB en posiciones requeridas, tracking de booking completado y foco devuelto al FAB.

## Matriz de Cumplimiento
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| CA: 2 clics CTA → Calendly con overlay y scroll bloqueado | ✅ | Hero/FAB → Radix Dialog con InlineWidget; Radix bloquea scroll y overlay negro semitransparente. |
| CA: Cierre con X/ESC/clic fuera | ✅ | Radix Dialog gestiona ESC y click fuera; botón X incluido en `DialogContent`. |
| CA: CTA flotante accesible en toda la home | ✅ | `FloatingCalendlyButton.tsx` con variantes desktop (top-right) y mobile (bottom-center), soporte teclado. |
| DoD: Posición CTA flotante (desktop top-right sticky, mobile bottom-center) | ✅ | Desktop `top-6 right-6`, mobile `bottom-4 left-1/2 -translate-x-1/2`, ver tests `floating-calendly-button.spec.tsx`. |
| DoD: Modal Radix UI Dialog (a11y) | ✅ | Migrado a Radix Dialog con InlineWidget; backdrop y focus trap gestionados por Radix. |
| DoD: Analytics tracking (opened, completed) | ✅ | `lib/analytics.ts` emite `calendly_modal_open/close`, clicks CTA/FAB y `calendly_booking_completed` vía `postMessage` de Calendly. |
| DoD: Test `calendly-modal.spec.ts` pasando | ✅ | `__tests__/components/calendly-modal.spec.tsx` (7 tests) en verde. |
| DoD: Librería react-calendly instalada y modal accesible | ✅ | `InlineWidget` integrado en Radix Dialog. |
| DoD: CTA flotante responsive y sobre el contenido | ✅ | z-50, dos variantes responsive, texto visible. |
| DoD: Tests unitarios/integración/e2e | ✅ | `npm test` → 10/10 files, 42/42 tests en verde (03/12/2025 20:36); `npx playwright test` → 10/10 passed (03/12/2025 20:37). |

## Hallazgos
### 🟢 Sugerencias
- Mantener validación manual de foco (Tab/Shift+Tab) en QA, especialmente en mobile con teclado externo/lector.
- Integrar analytics con proveedor real (GA/Posthog) usando `lib/analytics.ts`.

## Acciones para Developer
No se requieren acciones bloqueantes: listo para aprobación.***
