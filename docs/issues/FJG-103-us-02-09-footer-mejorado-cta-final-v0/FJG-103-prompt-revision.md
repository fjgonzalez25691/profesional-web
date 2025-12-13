# FJG-103: Prompt de Revisión

**Issue Linear:** https://linear.app/fjgaparicio/issue/FJG-103  
**Rol:** Reviewer  
**Objetivo:** Verificar que CTA final y footer reorganizado cumplen CA/DoD sin introducir problemas de usabilidad.

---

## Instrucciones para el Reviewer

Esta checklist guía la revisión de FJG-103 (Footer mejorado + CTA final v0). Verifica cada punto antes de dar aprobación.

**Contexto:** v0 = estructura básica funcional. Textos y URLs pueden ser provisionales. El objetivo es última oportunidad de conversión + acceso fácil a contacto/legal.

---

## 1. Criterios de Aceptación desde Linear

### ✅ CA-1: Sección CTA final claramente diferenciada

**Verificar:**
- [ ] Existe componente `FinalCTA.tsx` o equivalente
- [ ] Sección tiene `id="final-cta"` para navegación
- [ ] Visualmente diferenciada del contenido anterior (background destacado)
- [ ] Contiene: headline, texto valor, botón CTA
- [ ] Botón llama a Calendly correctamente

**Cómo verificar:**
```bash
# Con servidor corriendo
npm run dev
# Navegar hasta el final de la landing
# Verificar que hay sección CTA antes del footer
# Click en botón debe abrir Calendly
```

**Pregunta crítica:** ¿La última oportunidad de conversión es clara antes del footer?

**Resultado esperado:** Sección CTA final visible y funcional.

---

### ✅ CA-2: Footer muestra contacto, legal y canales principales

**Verificar:**
- [ ] Footer tiene 3 bloques claros:
  - Contacto (email visible)
  - Legal (3 enlaces: privacidad, legal, cookies)
  - Social (LinkedIn, GitHub, Calendly u otros)
- [ ] Cada bloque tiene título claro
- [ ] Enlaces funcionan (aunque pages sean placeholder)
- [ ] Iconos social visibles con aria-label

**Cómo verificar:**
```bash
# Con servidor corriendo
# Scroll hasta footer
# Verificar 3 bloques visibles
# Click en "Política de Privacidad" debe llevar a /politica-privacidad
# Click en icono LinkedIn debe abrir link (aunque sea provisional)
```

**Pregunta crítica:** ¿Es fácil encontrar contacto, legal y canales sociales?

**Resultado esperado:** Footer con información clara y accesible.

---

### ✅ CA-3: Footer legible en móvil sin roturas

**Verificar:**
- [ ] Abrir en mobile (375px viewport)
- [ ] Footer apilado correctamente (1 columna)
- [ ] Sin scroll horizontal
- [ ] Texto legible (tamaño adecuado)
- [ ] Enlaces tappables (44x44px mínimo)
- [ ] No hay solapamiento de elementos

**Cómo verificar:**
```bash
# Con servidor corriendo
# DevTools > Device Toolbar > iPhone SE (375px)
# Scroll hasta footer
# Verificar que no hay scroll horizontal
# Intentar tap en enlaces (deben ser fáciles de pulsar)
```

**Resultado esperado:** Footer funcional y legible en mobile.

---

### ✅ CA-4: Documentado qué es provisional

**Verificar:**
- [ ] Informe de implementación lista decisiones v0 provisionales
- [ ] Comentario en Linear indica qué ajustar después
- [ ] Ejemplos esperados:
  - Email provisional
  - URLs social provisionales
  - Texto FinalCTA genérico
  - Páginas legales placeholder

**Pregunta crítica:** ¿Está claro qué NO es definitivo y debe revisarse?

**Resultado esperado:** Documentación clara de alcance v0 vs futuro.

---

### ✅ CA-5: Aprobación visual de Fran

**Verificar:**
- [ ] Fran ha revisado visualmente FinalCTA y Footer
- [ ] No hay objeciones de diseño o contenido
- [ ] Si hay cambios solicitados, documentar

**Resultado esperado:** Fran da OK visual.

---

## 2. Definition of Done (DoD)

### ✅ DoD-1: Usuario tiene última oportunidad de conversión y acceso a contacto/legal

**Verificar:**
- [ ] CTA final presente antes del footer
- [ ] Botón CTA funcional (abre Calendly)
- [ ] Footer tiene email de contacto visible
- [ ] Footer tiene enlaces legales funcionando
- [ ] Footer tiene canales social visibles

**Cómo verificar:**
```bash
# Navegar landing completa de arriba a abajo
# Verificar flujo de conversión:
#   1. Hero CTA
#   2. Cases CTA
#   3. FinalCTA
# Verificar que siempre hay forma de contactar
```

**Resultado esperado:** Múltiples oportunidades de conversión, info contacto accesible.

---

### ✅ DoD-2: Footer sin problemas evidentes de usabilidad

**Verificar:**
- [ ] No hay scroll horizontal en mobile
- [ ] Enlaces clickables/tappables correctamente
- [ ] Hover en enlaces funciona (cambio de color)
- [ ] Iconos social tienen tamaño adecuado
- [ ] Copyright visible y correcto

**Herramientas:**
```bash
# Lighthouse en DevTools
# Ejecutar auditoría de Accessibility
# Score > 90 esperado
```

**Resultado esperado:** Sin problemas de usabilidad evidentes.

---

### ✅ DoD-3: Comentario documentando partes v0

**Verificar:**
- [ ] Comentario en Linear existe
- [ ] Incluye resumen de cambios
- [ ] Lista decisiones provisionales
- [ ] Propone mejoras v2

**Resultado esperado:** Comentario completo y útil.

---

### ✅ DoD-4: Aprobación visual de estética

**Verificar:**
- [ ] Fran aprueba estética del FinalCTA
- [ ] Fran aprueba estética del Footer
- [ ] Ambas paletas (Olive/Navy) se ven bien

**Resultado esperado:** Estética aprobada.

---

## 3. Verificación de Tests

### ✅ Tests unitarios pasando

**Verificar:**
- [ ] `FinalCTA.test.tsx` pasa al 100%
- [ ] `Footer.test.tsx` pasa al 100%
- [ ] Tests validan:
  - Renderizado correcto
  - Callbacks funcionan
  - Clases de estilo aplicadas

**Comandos:**
```bash
npm run test -- FinalCTA.test.tsx
npm run test -- Footer.test.tsx
```

**Resultado esperado:** 100% tests unitarios pasando.

---

### ✅ Tests E2E pasando

**Verificar:**
- [ ] `final-cta.spec.ts` pasa al 100%
- [ ] `footer.spec.ts` pasa al 100%
- [ ] `page-structure.spec.ts` pasa al 100%
- [ ] `legal-pages.spec.ts` pasa al 100%

**Comandos:**
```bash
npm run test:e2e -- final-cta.spec.ts
npm run test:e2e -- footer.spec.ts
npm run test:e2e -- page-structure.spec.ts
npm run test:e2e -- legal-pages.spec.ts
```

**Resultado esperado:** 100% tests E2E pasando.

---

## 4. Verificación de Código

### ✅ Calidad de Código

**Verificar:**
- [ ] Componentes nuevos siguen convenciones del proyecto
- [ ] No hay comentarios TODO/FIXME sin resolver
- [ ] Código legible y mantenible
- [ ] TypeScript types correctos

**Herramientas:**
```bash
npm run lint
npm run type-check
```

**Resultado esperado:** Sin errores de linter ni TypeScript.

---

### ✅ Tailwind CSS v4 Compatibility

**Verificar:**
- [ ] Clases Tailwind usan sintaxis correcta
- [ ] Tokens de tema aplicados (text-text-primary, bg-surface-950, etc.)
- [ ] Grid responsive funciona (grid-cols-1 md:grid-cols-3)
- [ ] Transiciones usan duration-300 o similar

**Resultado esperado:** Compatible con Tailwind CSS v4.x.

---

### ✅ Accesibilidad

**Verificar:**
- [ ] Enlaces tienen textos descriptivos o aria-label
- [ ] Iconos tienen aria-label
- [ ] Focus ring visible en elementos interactivos
- [ ] Contraste de colores adecuado
- [ ] Navegación por teclado funciona

**Herramientas:**
```bash
# Lighthouse > Accessibility > Score > 90
```

**Resultado esperado:** Score accesibilidad > 90.

---

## 5. Verificación Visual

### ✅ Ambas paletas funcionan

**Verificar:**
- [ ] Ir a `/admin` y cambiar entre Olive y Navy
- [ ] FinalCTA legible en ambas
- [ ] Footer legible en ambas
- [ ] Enlaces visibles en ambas

**Resultado esperado:** Funcionalidad coherente en ambas paletas.

---

### ✅ Responsiveness completo

**Verificar:**
- [ ] Mobile (320px, 375px, 414px):
  - FinalCTA apilado correctamente
  - Footer 1 columna
  - Sin scroll horizontal
  - Enlaces tappables
- [ ] Tablet (768px):
  - Footer puede ser 2 columnas si se decidió
  - FinalCTA centrado
- [ ] Desktop (1280px, 1920px):
  - Footer 3 columnas
  - FinalCTA max-width aplicado
  - Espaciado generoso

**Resultado esperado:** Layout funcional en todos los viewports.

---

## 6. Verificación de Páginas Legales

### ✅ Páginas placeholder existen

**Verificar:**
- [ ] `/politica-privacidad` accesible
- [ ] `/aviso-legal` accesible
- [ ] `/cookies` accesible
- [ ] Cada página tiene:
  - Título correcto
  - Mensaje placeholder claro
  - Fecha última actualización
  - Metadata correcta

**Cómo verificar:**
```bash
# Navegar a cada URL directamente
# Verificar que no da error 404
# Verificar que tiene contenido básico
```

**Resultado esperado:** Páginas accesibles con placeholder claro.

---

## 7. Checklist Final del Reviewer

Antes de aprobar, confirmar:

- [ ] Sección CTA final diferenciada (CA-1) ✅
- [ ] Footer muestra contacto/legal/social (CA-2) ✅
- [ ] Footer legible en móvil (CA-3) ✅
- [ ] Documentado qué es provisional (CA-4) ✅
- [ ] OK visual de Fran (CA-5) ✅
- [ ] Usuario tiene última oportunidad conversión (DoD-1) ✅
- [ ] Footer sin problemas usabilidad (DoD-2) ✅
- [ ] Comentario documentando v0 (DoD-3) ✅
- [ ] Aprobación visual estética (DoD-4) ✅
- [ ] Tests unitarios pasando ✅
- [ ] Tests E2E pasando ✅
- [ ] Código de calidad sin errores ✅
- [ ] Tailwind v4 compatible ✅
- [ ] Accesibilidad score > 90 ✅
- [ ] Ambas paletas funcionan ✅
- [ ] Responsiveness OK mobile/tablet/desktop ✅
- [ ] Páginas legales placeholder accesibles ✅

---

## 8. Decisión de Aprobación

**Si todos los checks anteriores pasan:**
✅ **APROBAR** - Issue FJG-103 v0 completada, lista para merge a `in2-ui-v0`.

**Si hay fallos:**
❌ **RECHAZAR** - Documentar claramente qué falta y por qué.

**Formato de feedback:**
```
## Revisión FJG-103

**Estado:** [APROBADO / RECHAZADO]

**Motivo (si rechazado):**
- [ ] CA-X no cumplido: [explicación]
- [ ] DoD-X no cumplido: [explicación]
- [ ] Tests fallando: [detalles]
- [ ] Problemas usabilidad: [detalles]
- [ ] Roturas mobile: [detalles]

**Comentarios adicionales:**
[Cualquier observación útil para el Developer]
```

---

## 9. Notas Importantes

1. **v0 = básico, textos provisionales OK:** No rechazar por email o URLs no definitivas si están documentadas.

2. **Páginas legales = placeholder OK:** Contenido real es issue posterior, NO bloquear por esto.

3. **CA flexible = "que Fran le guste":** OK visual de Fran es criterio final.

4. **Tests obligatorios:** Sin tests pasando, NO aprobar.

5. **Accesibilidad no negociable:** Focus, aria-labels y score > 90 obligatorios.

6. **Mobile OK = suficiente:** No hace falta perfección, solo que no parezca roto.

---

**¿Dudas o bloqueos?**  
Consultar con Agent Manager o Fran antes de aprobar/rechazar.
