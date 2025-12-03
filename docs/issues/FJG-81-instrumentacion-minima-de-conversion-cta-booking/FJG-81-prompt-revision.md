# FJG-81 - PROMPT REVISIÓN
**Issue**: In2-DT-01: Instrumentación mínima de conversión (CTA + booking Calendly)
**Agent Role**: Reviewer  
**Sprint**: S2 (Cycle 2cce504b-650a-4498-bde9-35d43489c6f0)
**Story Points**: 2 SP

## 🎯 VERIFICACIÓN LINEAR OBLIGATORIA

**ANTES DE REVISAR**: Verificar que la implementación cumple exactamente con los criterios de aceptación y DoD de Linear FJG-81.

✅ **Issue Linear verificada**: In2-DT-01: Instrumentación mínima de conversión (CTA + booking Calendly)  
✅ **Scope alineado**: Solo tracking CTA clicks + Calendly booking (NO scroll avanzado)

## 📋 MISIÓN REVIEWER

Auditar implementación TDD de instrumentación analytics mínima para conversión, verificando:
1. **Cumplimiento Linear**: CA + DoD exactos
2. **Seguridad**: Sin PII, solo producción  
3. **Calidad**: Tests pasando, código mantenible
4. **Performance**: Sin impacto negativo UX

## ✅ CHECKLIST FUNCIONAL

### Verificación Criterios Aceptación (Linear)
```gherkin
□ Scenario 1: CTA Hero click → evento 'cta_calendly_click' con id 'hero'
□ Scenario 2: CTA flotante click → evento 'cta_calendly_click' con id 'floating'  
□ Scenario 3: Calendly booking completed → evento 'calendly_booking_completed'
□ Todos los eventos visibles en analytics (verificación manual)
```

### Verificación Definition of Done (Linear)
```
□ Eventos cta_calendly_click y calendly_booking_completed implementados
□ Eventos solo se envían en producción (NO en development)
□ Verificado manualmente que eventos llegan a analytics
□ No se introduce PII en eventos  
□ Documentación lib/analytics.md creada y clara
```

## 🔒 CHECKLIST SEGURIDAD & PRIVACIDAD

### Sin PII (Personal Identifiable Information)
```
□ No se captura email del usuario
□ No se captura nombre del booking Calendly
□ No se captura teléfono o datos personales
□ No se captura IP específica o user agent completo
□ Solo datos agregados: pathname, CTA ID, timestamp
```

### Entorno & Variables
```
□ GOOGLE_ANALYTICS_ID configurado solo para producción
□ Variable NEXT_PUBLIC_ANALYTICS_ENABLED controla feature flag
□ Events NO se envían en NODE_ENV=development
□ Build producción incluye analytics, build dev los omite
```

### Headers & Cookies
```
□ No se añaden cookies adicionales de tracking
□ Compliance GDPR/CCPA mantenido (opt-in no requerido para analytics básico)
□ Política privacidad sigue siendo válida sin modificaciones
```

## 🧪 CHECKLIST TÉCNICO

### Tests & Cobertura
```
□ lib/analytics.test.ts: Tests unitarios core function
□ hooks/useAnalytics.test.ts: Tests React hook 
□ Hero.test.tsx: Tests CTA tracking integración
□ FloatingCalendlyButton.test.tsx: Tests CTA flotante tracking
□ CalendlyModal.test.tsx: Tests booking completion tracking
□ npm run test pasa 100% sin errores
□ Cobertura tests ≥90% archivos nuevos/modificados
```

### Código & Arquitectura
```
□ TypeScript strict mode sin errores
□ Interfaces bien definidas (AnalyticsEvent, CTAClickEvent, etc.)
□ lib/analytics.ts: Utility function sin side effects
□ hooks/useAnalytics.ts: Hook React reutilizable
□ Componentes modificados: Hero, FloatingCalendlyButton, CalendlyModal
□ No duplicación código tracking (DRY principle)
```

### Build & Performance
```
□ npm run build completa sin errores
□ Bundle size impact <5KB (analytics utilities)
□ No runtime errors en navegador
□ Events se envían async sin bloquear UI
□ Fallback graceful si analytics provider falla
```

## 🎯 CHECKLIST INTEGRACIÓN

### Google Analytics Setup
```
□ Google Tag Manager configurado (o gtag directo)
□ Eventos custom definidos correctamente
□ Test manual: eventos visibles en GA Real-Time reports
□ Test manual: eventos aparecen en GA Events dashboard <24h
□ No spam events (throttling adecuado)
```

### Calendly Integration
```
□ onEventScheduled callback implementado correctamente
□ Callback dispara analytics event sin PII
□ Test manual: booking real dispara evento analytics
□ Manejo errores si Calendly callback falla
□ No afecta UX original Calendly modal
```

### Cross-Browser
```
□ Testing Chrome: eventos se envían correctamente  
□ Testing Firefox: eventos se envían correctamente
□ Testing Safari: eventos se envían correctamente
□ Testing Mobile (Chrome/Safari): eventos se envían
□ Console errors: 0 errores JavaScript relacionados analytics
```

## 📚 CHECKLIST DOCUMENTACIÓN

### lib/analytics.md Content
```
□ Propósito y scope claro del sistema analytics
□ Función trackEvent() documented con ejemplos
□ Hook useAnalytics() documented con ejemplos  
□ Lista eventos actuales: cta_calendly_click, calendly_booking_completed
□ Guía para añadir nuevos eventos en futuras features
□ Troubleshooting común (eventos no aparecen, etc.)
```

### Código Self-Documented
```
□ Funciones tienen JSDoc comments adecuados
□ Interfaces TypeScript bien comentadas
□ README del proyecto actualizado si necesario
□ No TODOs o código commented out dejado
```

## 🚩 RED FLAGS (Rechazar implementación)

### Bloqueantes Absolutos
```
□ Tests no pasan o hay errores críticos
□ Se está enviando PII (email, nombre, teléfono)
□ Eventos se envían en desarrollo (violación CA)
□ Build falla o errores TypeScript críticos
□ No funciona instrumentación básica (eventos no llegan analytics)
```

### Concerns Mayores  
```
□ Performance impact significativo (>100ms delay)
□ Múltiples console errors relacionados analytics
□ Violación principios anti-camello (over-engineering)
□ Implementación no sigue especificación Linear CA/DoD
□ Documentación falta o incompleta
```

## 📋 VEREDICTO FINAL

**Si TODO ✅**: Aprobado ✅  
**Si >3 concerns menores**: Aprobado con observaciones ⚠️  
**Si ≥1 bloqueante absoluto**: Rechazado ❌ (Developer debe corregir)

## 🎯 TEMPLATE INFORME REVISIÓN

```markdown
# FJG-81 - INFORME REVISIÓN

## Veredicto: [✅ Aprobado | ⚠️ Aprobado con observaciones | ❌ Rechazado]

### Cumplimiento Linear
- Criterios Aceptación: [✅/❌]
- Definition of Done: [✅/❌]

### Seguridad & Privacidad  
- Sin PII: [✅/❌]
- Solo producción: [✅/❌]
- Variables entorno: [✅/❌]

### Calidad Técnica
- Tests pasando: [✅/❌] 
- TypeScript limpio: [✅/❌]
- Performance: [✅/❌]

### Testing Manual
- GA eventos visible: [✅/❌]
- Calendly tracking: [✅/❌]
- Cross-browser: [✅/❌]

### Issues Encontradas
[Lista específica issues y severidad]

### Observaciones
[Feedback constructivo para mejora futura]

### Next Steps
[Si rejected: qué debe corregir Developer]
[Si approved: ready for merge/deploy]
```

---

**ROL RESTRICTION**: Como Reviewer, NO modificar código. Solo auditar, señalar problemas, y rechazar/aprobar. Developer corrige issues reportadas.