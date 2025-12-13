# FJG-102: Prompt de Revisión

**Issue Linear:** https://linear.app/fjgaparicio/issue/FJG-102  
**Rol:** Reviewer  
**Objetivo:** Verificar que los cambios de espaciado y microinteracciones mejoran la percepción de calidad sin introducir regresiones.

---

## Instrucciones para el Reviewer

Esta checklist guía la revisión de FJG-102 (Mejora de espaciado y microinteracciones v0). Verifica cada punto antes de dar aprobación.

**Contexto:** Esta es una iteración v0 (básica), NO se busca perfección pixel-perfect. El objetivo es mejora perceptible con documentación clara de qué queda para v2.

---

## 1. Criterios de Aceptación desde Linear

### ✅ CA-1: Espaciado vertical más consistente

**Verificar:**
- [ ] Leer componentes modificados: Hero, PainPoints, CaseGrid, y otros si aplica
- [ ] Confirmar que todas las secciones principales tienen clases de espaciado vertical coherentes
- [ ] Patrón esperado: `py-12 md:py-20` o similar en todas las secciones
- [ ] Verificar que NO hay mezcla evidente de escalas (ej: py-8 en una, py-24 en otra sin justificación)

**Cómo verificar:**
```bash
cd profesional-web
# Buscar clases de padding vertical en secciones
grep -r "className.*py-" components/*.tsx | grep "section"
```

**Pregunta crítica:** ¿El espaciado vertical se ve más consistente que en la versión anterior?

**Resultado esperado:** Pauta clara aplicada, sin inconsistencias evidentes.

---

### ✅ CA-2: Cards con microinteracción visible al hover

**Verificar:**
- [ ] Abrir `PainPoints.tsx` y verificar clases de transición/hover
- [ ] Clases esperadas: `transition-all`, `hover:scale-[1.02]`, `hover:shadow-md`, `hover:border-*`
- [ ] Abrir `CaseGrid.tsx` y verificar clases similares
- [ ] Confirmar que las transiciones son sutiles (scale pequeño, duration 300ms o similar)

**Cómo verificar:**
```bash
# Levantar servidor
npm run dev
# Abrir http://localhost:3000
# Navegar a sección pain-points y cases
# Hacer hover sobre cards
# Observar si hay feedback visual suave (scale, shadow)
```

**Pregunta crítica:** ¿Las cards responden al hover con feedback visual claro pero no excesivo?

**Resultado esperado:** Hover suave y visible, sin animaciones bruscas.

---

### ✅ CA-3: CTAs con feedback visual al interactuar

**Verificar:**
- [ ] Abrir `Hero.tsx` y buscar botones CTA
- [ ] Clases esperadas: `transition-all`, `hover:scale-105`, `focus:ring-2`, `focus:ring-offset-2`
- [ ] Confirmar que hay estados hover y focus definidos
- [ ] Verificar accesibilidad: focus ring visible para navegación por teclado

**Cómo verificar:**
```bash
# Con servidor corriendo
# Hacer hover sobre CTA primario ("Agendar diagnóstico")
# Observar si escala sutilmente y cambia color
# Navegar con Tab (teclado)
# Verificar que focus ring es visible
```

**Pregunta crítica:** ¿Los CTAs dan feedback visual claro en hover y focus?

**Resultado esperado:** Hover con scale y color, focus ring accesible.

---

### ✅ CA-4: 2-3 puntos documentados para v2

**Verificar:**
- [ ] Leer `FJG-102-informe-implementacion.md`
- [ ] Confirmar que lista al menos 2-3 mejoras identificadas pero NO implementadas
- [ ] Ejemplos esperados:
  - Animaciones scroll reveal
  - Indicador sección activa en Header
  - Espaciado fino en Footer
  - Hover en badges informativos
- [ ] Confirmar que hay comentario en Linear con este plan

**Pregunta crítica:** ¿Está claro qué NO es parte de v0 y se deja para v2?

**Resultado esperado:** Documentación clara de alcance v0 vs v2.

---

### ✅ CA-5: OK visual de Fran

**Verificar:**
- [ ] Confirmar que Fran ha revisado visualmente la landing
- [ ] Confirmar que no hay objeciones de espaciado o microinteracciones
- [ ] Si hay cambios solicitados, documentar en Linear

**Nota:** Este es un CA flexible. "Que Fran le guste" es el estándar.

**Resultado esperado:** Fran da OK visual.

---

## 2. Definition of Done (DoD)

### ✅ DoD-1: Menos bloques pegados, más cuidado percibido

**Verificar:**
- [ ] Levantar servidor y navegar la home completa
- [ ] Evaluar subjetivamente: ¿se percibe más separación entre secciones?
- [ ] Evaluar: ¿las cards y CTAs se sienten más "pulidas"?
- [ ] Comparar con versión anterior si es posible (git diff visual)

**Pregunta crítica:** ¿La landing se siente menos prototipo y más cuidada?

**Resultado esperado:** Mejora perceptible en sensación de calidad.

---

### ✅ DoD-2: Sin regresiones graves de layout

**Verificar:**
- [ ] Verificar en mobile (320px, 375px, 414px):
  ```bash
  # Con servidor corriendo
  # Abrir DevTools > Device Toolbar
  # Probar iPhone SE (375px), iPhone 12 (390px), etc.
  ```
- [ ] Buscar:
  - Texto cortado o solapado
  - Cards que se rompen
  - Botones fuera de viewport
  - Scroll horizontal no deseado
- [ ] Verificar en desktop (1280px, 1920px):
  - Layout coherente
  - Sin espacios enormes vacíos
  - Contenedor max-w funcionando

**Resultado esperado:** Sin roturas evidentes en ningún viewport común.

---

### ✅ DoD-3: Comentario en Linear con explicación

**Verificar:**
- [ ] Leer comentario en Linear issue FJG-102
- [ ] Confirmar que incluye:
  - Resumen de cambios de espaciado
  - Resumen de microinteracciones añadidas
  - Lista de mejoras v2
  - Mención a verificación en mobile/desktop
  - Mención a verificación en ambas paletas (Olive/Navy)
- [ ] Confirmar que el comentario es claro y útil

**Resultado esperado:** Comentario completo y accionable.

---

## 3. Verificación de Tests

### ✅ Tests E2E pasando

**Verificar:**
- [ ] Ejecutar tests E2E para espaciado:
  ```bash
  cd profesional-web
  npm run test:e2e -- spacing.spec.ts
  ```
- [ ] Ejecutar tests E2E para microinteracciones:
  ```bash
  npm run test:e2e -- microinteractions.spec.ts
  ```
- [ ] Ejecutar tests E2E para CTAs:
  ```bash
  npm run test:e2e -- cta-interactions.spec.ts
  ```
- [ ] Confirmar que todos los tests pasan sin errores
- [ ] Si hay tests fallando, rechazar implementación

**Resultado esperado:** 100% tests E2E pasando.

---

### ✅ Tests unitarios pasando

**Verificar:**
- [ ] Ejecutar tests unitarios completos:
  ```bash
  npm run test
  ```
- [ ] Confirmar que no hay regresiones en tests existentes
- [ ] Verificar que nuevos tests (si los hay) están pasando

**Resultado esperado:** 100% tests unitarios pasando.

---

## 4. Verificación de Código

### ✅ Calidad de Código

**Verificar:**
- [ ] Componentes mantienen estructura original (solo cambios de clases CSS)
- [ ] No hay cambios de funcionalidad (solo estilos)
- [ ] Código es legible y sigue convenciones del proyecto
- [ ] No hay comentarios TODO/FIXME sin resolver

**Herramientas:**
```bash
# Linter
npm run lint

# TypeScript check
npm run type-check
```

**Resultado esperado:** Sin errores de linter ni TypeScript.

---

### ✅ Tailwind CSS v4 Compatibility

**Verificar:**
- [ ] Clases de transición usan sintaxis correcta: `transition-all duration-300`
- [ ] Clases de hover usan sintaxis correcta: `hover:scale-[1.02]`
- [ ] Clases de focus usan sintaxis correcta: `focus:ring-2`
- [ ] No hay conflictos con configuración Tailwind

**Resultado esperado:** Compatible con Tailwind CSS v4.x.

---

### ✅ Accesibilidad

**Verificar:**
- [ ] Botones tienen estados focus visibles (`focus:ring-*`)
- [ ] Navegación por teclado funciona correctamente
- [ ] Contraste de colores es adecuado (usar DevTools Lighthouse)
- [ ] No hay elementos interactivos sin feedback visual

**Cómo verificar:**
```bash
# Con servidor corriendo
# Abrir DevTools > Lighthouse
# Ejecutar auditoría de accesibilidad
# Verificar score > 90
```

**Resultado esperado:** Score de accesibilidad > 90 en Lighthouse.

---

## 5. Verificación Visual

### ✅ Ambas paletas (Olive y Navy)

**Verificar:**
- [ ] Ir a `/admin` y cambiar entre paletas
- [ ] Verificar que espaciado se mantiene consistente
- [ ] Verificar que microinteracciones funcionan en ambas
- [ ] Verificar legibilidad de texto en ambas

**Resultado esperado:** Funcionalidad coherente en ambas paletas.

---

### ✅ Responsiveness

**Verificar:**
- [ ] Mobile (320px - 767px):
  - Espaciado vertical adecuado
  - Cards apiladas correctamente
  - CTAs accesibles
  - Sin scroll horizontal
- [ ] Tablet (768px - 1023px):
  - Grid de cards funciona (2 columnas si aplica)
  - Espaciado proporcionado
- [ ] Desktop (1024px+):
  - Layout completo visible
  - Espaciado generoso
  - Grid de cards 3 columnas (CaseGrid)

**Resultado esperado:** Layout funcional en todos los rangos de viewport.

---

## 6. Checklist Final del Reviewer

Antes de aprobar, confirmar:

- [ ] Espaciado vertical más consistente (CA-1) ✅
- [ ] Cards con microinteracción visible (CA-2) ✅
- [ ] CTAs con feedback visual (CA-3) ✅
- [ ] 2-3 puntos documentados para v2 (CA-4) ✅
- [ ] OK visual de Fran (CA-5) ✅
- [ ] Menos bloques pegados percibidos (DoD-1) ✅
- [ ] Sin regresiones graves de layout (DoD-2) ✅
- [ ] Comentario en Linear explicativo (DoD-3) ✅
- [ ] Tests E2E pasando ✅
- [ ] Tests unitarios pasando ✅
- [ ] Código de calidad sin errores linter/TypeScript ✅
- [ ] Tailwind v4 compatible ✅
- [ ] Accesibilidad score > 90 ✅
- [ ] Ambas paletas funcionan correctamente ✅
- [ ] Responsiveness OK en mobile/tablet/desktop ✅

---

## 7. Decisión de Aprobación

**Si todos los checks anteriores pasan:**
✅ **APROBAR** - Issue FJG-102 v0 completada, lista para merge a `in2-ui-v0`.

**Si hay fallos:**
❌ **RECHAZAR** - Documentar claramente qué falta y por qué.

**Formato de feedback:**
```
## Revisión FJG-102

**Estado:** [APROBADO / RECHAZADO]

**Motivo (si rechazado):**
- [ ] CA-X no cumplido: [explicación]
- [ ] DoD-X no cumplido: [explicación]
- [ ] Tests fallando: [detalles]
- [ ] Regresiones de layout: [detalles]
- [ ] Problemas de accesibilidad: [detalles]

**Comentarios adicionales:**
[Cualquier observación útil para el Developer]
```

---

## 8. Notas Importantes

1. **v0 = básico, no perfecto:** No rechazar por falta de refinado extremo. El objetivo es mejora perceptible, no pixel-perfect.

2. **CA flexible = "que Fran le guste":** El OK visual de Fran es el criterio final. Si Fran aprueba visualmente, está OK.

3. **Documentación v2 es clave:** Verificar que está claro qué NO se hace ahora y por qué.

4. **Tests son obligatorios:** Sin tests pasando, NO aprobar.

5. **Accesibilidad no negociable:** Focus ring visible y navegación por teclado funcional son obligatorios.

6. **Sin regresiones:** Cualquier rotura evidente de layout es motivo de rechazo.

7. **Simplicidad > complejidad:** Si el Developer agregó librerías de animación complejas sin necesidad, cuestionar decisión.

---

**¿Dudas o bloqueos?**  
Consultar con Agent Manager o Fran antes de aprobar/rechazar.
