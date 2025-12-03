# FJG-81 - INFORME REVISIÓN

## Veredicto: ✅ Aprobado

### Cumplimiento Linear
- Criterios Aceptación: ✅ (CTA hero/floating y booking Calendly instrumentados sin duplicados)
- Definition of Done: ✅ Validación manual en GA4 confirmada por Fran

### Seguridad & Privacidad  
- Sin PII: ✅ (solo pathname, cta_id/source, timestamp)
- Solo producción: ✅ (`trackEvent` envía a GA solo en `NODE_ENV=production` y flag `NEXT_PUBLIC_ANALYTICS_ENABLED`)
- Variables entorno: ✅ gating presente

### Calidad Técnica
- Tests pasando: ✅ (`npm test`)
- TypeScript limpio: ✅
- Performance: ✅ sin emisiones redundantes detectadas tras la corrección

### Testing Manual
- GA eventos visible: ✅ Validado en GA4 Real-Time (CTA + booking)
- Calendly tracking: ✅ Validado manualmente en embed
- Cross-browser: ⚠️ No cubierto aquí

### Observaciones
- Se corrigió la emisión espuria de `calendly_modal_close` y la duplicidad de eventos `open/close`. Ahora se usa `useRef` para detectar transiciones reales y `useCallback` en `useAnalytics` para estabilizar `track`.
- Los tests nuevos en `__tests__/components/calendly-modal.spec.tsx` cubren que no se emite `close` en montaje y que solo se dispara en transiciones `false→true` y `true→false`.
- Se ajustó la UX del FAB: aparece tras ~45% de scroll y se dejó un único icono/emoji “🗓️ Reserva 30 min” para reducir solapados con el CTA del Hero.

### Next Steps
1) Monitorear GA4 post-deploy por si hubiera eventos duplicados en navegadores no probados (Safari/Firefox).
