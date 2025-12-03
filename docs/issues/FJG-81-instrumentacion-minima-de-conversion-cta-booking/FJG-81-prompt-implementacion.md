# FJG-81 - PROMPT IMPLEMENTACIÓN
**Issue**: In2-DT-01: Instrumentación mínima de conversión (CTA + booking Calendly)
**Agent Role**: Developer
**Sprint**: S2 (Cycle 2cce504b-650a-4498-bde9-35d43489c6f0)
**Story Points**: 2 SP

## 🎯 VERIFICACIÓN LINEAR OBLIGATORIA
**ANTES DE PROCEDER**: Has verificado la issue FJG-81 en Linear y confirmas que los criterios de aceptación y DoD coinciden exactamente con este prompt.

✅ **Issue verificada en Linear**: In2-DT-01: Instrumentación mínima de conversión (CTA + booking Calendly)
✅ **Status**: In Progress
✅ **Scope alineado**: Tracking CTA clicks + Calendly booking completion (NO scroll depth avanzado)

## 📋 MISIÓN DEVELOPER TDD

Implementar **instrumentación mínima viable** para medir conversión en la landing siguiendo metodología TDD estricta.

### 🔴 Alcance Específico (según Linear)
1. **Tracking clic CTA**: Eventos `cta_calendly_click` para Hero y flotante
2. **Tracking booking Calendly**: Evento `calendly_booking_completed` 
3. **Solo producción**: No eventos en desarrollo
4. **Sin PII**: Cumplimiento privacidad
5. **Documentación**: Breve guía para reutilización

### ❌ FUERA DE ALCANCE
- Scroll depth tracking (25%, 50%, 75%, 100%)
- Tiempo en página con pestaña visible
- Tracking visibilidad secciones específicas
- Panel debug desarrollo
- Métricas avanzadas engagement

## 🧪 PLAN TDD IMPLEMENTACIÓN

### FASE 1: Tests Setup + Analytics Core
```bash
# 1. RED: Test analytics utility function
touch lib/analytics.test.ts
# 2. GREEN: Implementar lib/analytics.ts (prod vs dev check)
# 3. REFACTOR: Clean implementation

# Test Cases:
- ✅ trackEvent() solo envía en producción
- ✅ trackEvent() incluye timestamp automático  
- ✅ trackEvent() rechaza eventos con PII
- ✅ trackEvent() valida estructura eventos requeridos
```

### FASE 2: CTA Click Tracking
```bash
# 1. RED: Test Hook useAnalytics
touch hooks/useAnalytics.test.ts
# 2. GREEN: Implementar hooks/useAnalytics.ts
# 3. RED: Test Hero CTA tracking
touch __tests__/components/Hero.test.tsx (ampliar existing)
# 4. GREEN: Integrar tracking en Hero.tsx
# 5. RED: Test FloatingCalendlyButton tracking  
touch __tests__/components/FloatingCalendlyButton.test.tsx (ampliar existing)
# 6. GREEN: Integrar tracking en FloatingCalendlyButton.tsx
# 7. REFACTOR: DRY tracking logic

# Test Cases CTA:
- ✅ Hero CTA click → evento 'cta_calendly_click' con id 'hero'
- ✅ Floating CTA click → evento 'cta_calendly_click' con id 'floating'  
- ✅ Eventos incluyen pathname actual
- ✅ Eventos incluyen timestamp
```

### FASE 3: Calendly Booking Tracking
```bash
# 1. RED: Test Calendly callback integration
touch __tests__/components/CalendlyModal.test.tsx (ampliar existing)
# 2. GREEN: Implementar callback onEventScheduled en CalendlyModal
# 3. RED: Test evento calendly_booking_completed
# 4. GREEN: Integrar tracking booking completion
# 5. REFACTOR: Clean callback handling

# Test Cases Calendly:
- ✅ Booking completado → evento 'calendly_booking_completed'
- ✅ Evento incluye pathname origen (si disponible)
- ✅ Evento incluye timestamp
- ✅ No leakage PII del booking
```

### FASE 4: Documentación + Integración Final
```bash
# 1. Crear documentación lib/analytics.md
# 2. Tests E2E verificación eventos (dev vs prod)
# 3. Verificación manual Calendly webhook/callback
```

## 🎨 ARQUITECTURA TÉCNICA

### Estructura Archivos
```
lib/
├── analytics.ts          # Core analytics utility (NEW)
└── analytics.md          # Documentación usage (NEW)

hooks/
└── useAnalytics.ts       # React hook tracking (NEW)

components/
├── Hero.tsx              # MODIFICAR: add CTA tracking  
├── FloatingCalendlyButton.tsx # MODIFICAR: add CTA tracking
└── CalendlyModal.tsx     # MODIFICAR: add booking tracking

__tests__/
├── lib/
│   └── analytics.test.ts # NUEVO
├── hooks/
│   └── useAnalytics.test.ts # NUEVO
└── components/
    ├── Hero.test.tsx     # AMPLIAR: CTA tracking tests
    ├── FloatingCalendlyButton.test.tsx # AMPLIAR
    └── CalendlyModal.test.tsx # AMPLIAR: booking tracking
```

### Interfaces TypeScript
```typescript
// lib/analytics.ts
interface AnalyticsEvent {
  name: string;
  properties: Record<string, string | number | boolean>;
  timestamp: string;
  pathname: string;
}

interface CTAClickEvent {
  name: 'cta_calendly_click';
  properties: {
    cta_id: 'hero' | 'floating';
  };
}

interface BookingCompletedEvent {
  name: 'calendly_booking_completed';
  properties: {
    source_page?: string;
  };
}
```

## 📊 PROVIDER ANALYTICS

**Decisión técnica**: Para MVP usar **Google Analytics 4** (gtag) por:
- ✅ Setup inmediato con Google Tag Manager
- ✅ Events automáticos sin backend
- ✅ Free tier suficiente MVP
- ✅ Integración Calendly documentada

**Alternativa futuro**: Plausible (más privacy-friendly) post-MVP si necesario.

## 🔒 COMPLIANCE PRIVACIDAD

### Sin PII
- ❌ NO capturar email, nombre, teléfono booking
- ❌ NO capturar IP específica o user agent completo  
- ✅ Solo pathname, CTA ID, timestamp genérico

### Variables Entorno
```bash
# .env.local
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX  # Solo producción
NEXT_PUBLIC_ANALYTICS_ENABLED=true  # Control feature flag
```

## ✅ CRITERIOS ACEPTACIÓN (Gherkin de Linear)

```gherkin
Scenario: Tracking de clic en CTA principal del Hero
  Given un usuario visualiza el Hero en la home
  When hace clic en el botón principal de CTA
  Then se envía un evento de "cta_calendly_click" con id "hero"
  And el evento se registra en analytics

Scenario: Tracking de clic en CTA flotante
  Given un usuario navega por la home con CTA flotante visible  
  When hace clic en el CTA flotante
  Then se envía un evento de "cta_calendly_click" con id "floating"

Scenario: Tracking de booking completado en Calendly
  Given un usuario completa un booking en Calendly
  When Calendly confirma la creación del evento
  Then se envía un evento de "calendly_booking_completed"
  And el evento es visible en analytics en <24h
```

## 📋 DEFINITION OF DONE (Linear)

- [ ] Eventos `cta_calendly_click` y `calendly_booking_completed` implementados
- [ ] Los eventos solo se envían en producción (no en desarrollo)
- [ ] Verificado manualmente que los eventos llegan a Google Analytics
- [ ] No se introduce PII en los eventos
- [ ] Documentación breve (lib/analytics.md) sobre emisión y reutilización eventos

## 🚦 COMANDOS DESARROLLO

```bash
# Tests en modo watch
npm run test -- --watch analytics useAnalytics

# Verificar build después de cambios
npm run build

# Dev server para testing manual
npm run dev

# Verificar types
npm run type-check
```

## 🎯 OUTPUT ESPERADO

Al completar implementación TDD:
1. **Tests verdes**: Todos los tests de analytics pasando
2. **Funcionalidad**: CTAs trackean clicks, Calendly trackea bookings
3. **Solo producción**: Cero eventos en desarrollo
4. **Documentación**: Guide claro para future features
5. **Informe**: FJG-81-informe-implementacion.md con resultados y consideraciones

---

**RECUERDA**: Metodología anti-camello. Implementación mínima viable, extensible pero no over-engineered. Solo lo que requiere Linear exactamente.