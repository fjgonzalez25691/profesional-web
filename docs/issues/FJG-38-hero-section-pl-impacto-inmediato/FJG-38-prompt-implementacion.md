# TAREA DE IMPLEMENTACIÓN: FJG-38

**Rol:** Agent Developer (Ver `.prompts/ROLES.md`)
**Objetivo:** US-02-001: Hero Section P&L Impacto Inmediato

## 0. Constitución (OBLIGATORIO)
Antes de escribir código, confirma que has leído:
1.  `.prompts/CONSTITUCION.md`.
2.  `docs/ESTADO_PROYECTO.md`.
3.  La issue FJG-38 (Vía MCP).

## 1. Objetivo Funcional

**Como** CEO que llega por referencia  
**Quiero** entender en <10s qué haces y para quién  
**Para** decidir si seguir leyendo

**TRANSFORMACIÓN REQUERIDA:**
- **Estado Actual**: `"Arquitecto Cloud & IA para P&L"` (genérico, no accionable)
- **Estado Objetivo**: `"Reduzco tu factura Cloud y automatizo procesos con payback <6 meses"` (específico, cuantificado)

## 2. Criterios de Aceptación (CA)

* [ ] **CA-1**: Hero visible above fold (sin scroll) mobile+desktop
* [ ] **CA-2**: Headline específico: "Reduzco tu factura Cloud y automatizo procesos con payback <6 meses"
* [ ] **CA-3**: Subtítulo segmentado: "Para empresas industriales, logísticas y agencias 5–50M€"
* [ ] **CA-4**: Foto profesional con badge "+37 años gestionando P&L"
* [ ] **CA-5**: CTA flotante "Diagnóstico gratuito 30 min" visible sin scroll
* [ ] **CA-6**: Modal Calendly abre <500ms al clic en CTA
* [ ] **CA-7**: LCP <2s mobile 4G (Performance crítico)

## 3. Definición de Hecho (DoD)

* [ ] Tests E2E hero.spec.ts PASANDO (Playwright)
* [ ] Tests unitarios hero.test.tsx PASANDO (Vitest)
* [ ] Lighthouse Performance >85 mobile
* [ ] Imagen hero WebP <80KB, priority loading
* [ ] Sin credenciales hardcodeadas
* [ ] Código: Comentarios en ES, Variables en EN
* [ ] Modal Calendly funcional (usa NEXT_PUBLIC_CALENDLY_URL)

## 4. Archivos Afectados

**Modificar:**
* `profesional-web/app/page.tsx`: Actualizar hero section existente con nueva copy y estructura
* `profesional-web/app/globals.css`: Ajustar estilos específicos si es necesario para CTA flotante

**Crear (Solo si es imprescindible):**
* `profesional-web/components/Hero.tsx`: Componente reutilizable para hero section
* `profesional-web/components/CalendlyModal.tsx`: Modal flotante con integración React Calendly
* `profesional-web/__tests__/e2e/hero.spec.ts`: Tests E2E para validación funcional y performance
* `profesional-web/__tests__/components/hero.test.tsx`: Tests unitarios del componente Hero

## 5. Plan TDD (Definido por el Manager)

Ejecuta estos pasos **ESTRICTAMENTE** en orden:

### **PASO 1: Tests E2E (RED)**
1. **Crear** `__tests__/e2e/hero.spec.ts` con validaciones:
   - Headline contiene "Reduzco tu factura Cloud"
   - Subtítulo contiene "5–50M€"  
   - CTA flotante visible sin scroll
   - LCP <2000ms
   - Modal Calendly abre al clic CTA

### **PASO 2: Tests Unitarios Hero (RED)**
2. **Crear** `__tests__/components/hero.test.tsx`:
   - Render del componente Hero
   - Props correctas (headline, subtitle, cta text)
   - Badge "+37 años" visible

### **PASO 3: Componente Hero (GREEN)**
3. **Crear** `components/Hero.tsx`:
   - Props interface para configurabilidad
   - Estructura responsive (mobile+desktop)
   - Imagen WebP optimizada <80KB
   - Badge profesional integrado

### **PASO 4: Modal Calendly (GREEN)**
4. **Crear** `components/CalendlyModal.tsx`:
   - Integración React Calendly
   - Estado open/close
   - Triggers: click CTA, ESC, click outside
   - Performance: lazy load del iframe

### **PASO 5: Integración page.tsx (GREEN)**
5. **Modificar** `app/page.tsx`:
   - Reemplazar hero actual por `<Hero>`
   - Integrar `<CalendlyModal>` con estado
   - CTA flotante position: fixed
   - Mantener estructura responsive existente

### **PASO 6: Optimización Performance (REFACTOR)**
6. **Ajustar** para DoD:
   - Imagen con priority loading
   - Lazy load modal
   - Verificar LCP <2s
   - Lighthouse >85 mobile

## 6. Especificaciones Técnicas

### Copy Exacto (NO modificar):
```
HEADLINE: "Reduzco tu factura Cloud y automatizo procesos con payback <6 meses"
SUBTITLE: "Para empresas industriales, logísticas y agencias 5–50M€"  
BADGE: "+37 años gestionando P&L"
CTA: "Diagnóstico gratuito 30 min"
```

### Performance Targets:
- **LCP**: <2000ms mobile 4G
- **Lighthouse**: >85 Performance mobile
- **Imagen Hero**: WebP, <80KB, priority
- **Modal**: Apertura <500ms

### Responsive Breakpoints:
- **Mobile**: <640px (CTA bottom-center fixed)
- **Desktop**: ≥640px (CTA bottom-right fixed)
- **Hero Image**: Responsive, aspect-ratio preserved

## 7. Instrucciones de Respuesta

1.  **SIEMPRE** empieza por el test que falla (RED)
2.  **Implementa** código mínimo para pasar el test (GREEN)  
3.  **Refactoriza** mejorando sin romper tests (REFACTOR)
4.  **Al finalizar**, genera obligatoriamente:
    * Archivo: `docs/issues/FJG-38-hero-section-pl-impacto-inmediato/FJG-38-informe-implementacion.md`
    * Contenido: Resumen de cambios, Tests ejecutados, Decisiones técnicas, Performance metrics

**RECORDATORIO TDD**: No escribas código productivo sin test que lo demande. El test define el comportamiento esperado.