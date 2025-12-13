# FJG-101: Prompt de Revisión

**Issue Linear:** https://linear.app/fjgonzalez2569/issue/FJG-101  
**Rol:** Reviewer  
**Objetivo:** Verificar que Hero, PainPoints y CaseGrid usan tokens de tema de forma coherente, sin mezclas evidentes de paleta antigua.

---

## Instrucciones para el Reviewer

Esta checklist guía la revisión de FJG-101 (Fase 1: Aplicar paleta activa a páginas clave). Verifica cada punto antes de dar aprobación.

**Contexto:** En FJG-99 se implementó el sistema de temas con tokens CSS. FJG-101 revisa y mejora la aplicación de estos tokens en Hero, PainPoints y CaseGrid, eliminando hardcoded colors residuales.

---

## 1. Criterios de Aceptación desde Linear

### ✅ CA-1: Hero usa tokens coherentemente

**Verificar:**
- [ ] Leer `profesional-web/components/Hero.tsx` línea por línea
- [ ] Confirmar que todos los colores usan tokens de `globals.css`:
  - Background: `bg-surface-*`
  - Texto primario: `text-text-primary`
  - Texto secundario: `text-text-secondary`
  - Badges/acentos: `text-accent-*`
  - Botones CTA: `bg-accent-gold-*`, `text-primary-*`, `border-accent-teal-*`
- [ ] NO hay colores hardcoded tipo `text-gray-400`, `bg-slate-900`, etc. (excepto si tienen justificación semántica documentada)

**Pregunta crítica:** ¿El Hero muestra colores coherentes en ambas paletas (Olive y Navy)?

**Cómo verificar:**
```bash
cd profesional-web
npm run dev
# Abrir http://localhost:3000
# Ir a /admin y cambiar entre paletas
# Verificar legibilidad en Hero
```

**Resultado esperado:** Hero legible y coherente en ambas paletas.

---

### ✅ CA-2: PainPoints usa tokens coherentemente

**Verificar:**
- [ ] Leer `profesional-web/components/PainPoints.tsx` línea por línea
- [ ] Confirmar que cards usan tokens:
  - Background: `bg-surface-*`
  - Borders: `border-surface-*`
  - Texto primario: `text-text-primary`
  - Texto secundario: `text-text-secondary`
  - Iconos: `text-accent-*` o justificado (ej: `text-red-500` para X de error)
- [ ] Si hay `text-red-500` en icono X, verificar que tiene justificación semántica
- [ ] NO hay mezclas evidentes de paleta antigua

**Pregunta crítica:** ¿Las cards de PainPoints muestran colores coherentes en ambas paletas?

**Cómo verificar:**
```bash
# Con servidor corriendo
# Cambiar entre paletas en /admin
# Verificar legibilidad en sección "¿Te pasa esto?"
```

**Resultado esperado:** Cards legibles y coherentes en ambas paletas. Si icono X es rojo, debe ser intencional y documentado.

---

### ✅ CA-3: CaseGrid usa tokens coherentemente

**Verificar:**
- [ ] Leer `profesional-web/components/CaseGrid.tsx` línea por línea
- [ ] Confirmar que cards y badges usan tokens:
  - Cards: `bg-surface-*`, `border-surface-*`
  - Títulos: `text-text-primary`
  - Descripciones: `text-text-secondary`
  - Badges sector: `bg-primary-*/20`, `text-primary-*`
  - Iconos tiempo: `text-accent-teal-*`
  - Métricas: `text-accent-teal-*`
  - Badge validación: `text-accent-sage`
- [ ] NO hay colores hardcoded tipo `text-teal-400`, `bg-emerald-500/20`, etc.

**Pregunta crítica:** ¿Las cards de CaseGrid muestran colores coherentes en ambas paletas?

**Cómo verificar:**
```bash
# Con servidor corriendo
# Cambiar entre paletas en /admin
# Verificar legibilidad en sección "Casos reales"
```

**Resultado esperado:** Cards legibles, badges destacados, coherencia en ambas paletas.

---

### ✅ CA-4: Sin mezclas evidentes de paleta antigua

**Verificar:**
- [ ] Buscar en los 3 componentes colores hardcoded no justificados:
  ```bash
  # Buscar posibles hardcoded colors
  grep -E "text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+" Hero.tsx PainPoints.tsx CaseGrid.tsx
  
  # Buscar bg hardcoded
  grep -E "bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+" Hero.tsx PainPoints.tsx CaseGrid.tsx
  ```
- [ ] Para cada match encontrado, verificar:
  - ¿Tiene justificación semántica? (ej: `text-red-500` para error)
  - ¿Está documentado en el informe de implementación?
  - ¿Debería usar un token en su lugar?

**Resultado esperado:** Cero mezclas evidentes no justificadas.

---

### ✅ CA-5: Documentado qué falta para Fase 2

**Verificar:**
- [ ] Leer `FJG-101-informe-implementacion.md`
- [ ] Confirmar que lista componentes pendientes de Fase 2:
  - Footer
  - MethodologySection
  - TechStackDiagram
  - Otros (si existen)
- [ ] Confirmar que hay comentario en Linear con resumen y plan de Fase 2

**Pregunta crítica:** ¿Está claro qué NO es parte de FJG-101 y queda para Fase 2?

**Resultado esperado:** Documentación clara de alcance Fase 1 vs Fase 2.

---

## 2. Definition of Done (DoD)

### ✅ DoD-1: Tests unitarios pasando

**Verificar:**
- [ ] Ejecutar tests unitarios para los 3 componentes:
  ```bash
  cd profesional-web
  npm run test -- Hero.test.tsx
  npm run test -- PainPoints.test.tsx
  npm run test -- CaseGrid.test.tsx
  ```
- [ ] Confirmar que todos los tests pasan sin errores
- [ ] Verificar que tests validan uso de tokens (ej: `expect(element).toHaveClass('bg-surface-950')`)

**Resultado esperado:** 100% tests unitarios pasando.

---

### ✅ DoD-2: Tests E2E pasando

**Verificar:**
- [ ] Ejecutar tests E2E para los 3 componentes:
  ```bash
  npm run test:e2e -- hero-theme.spec.ts
  npm run test:e2e -- pain-points-theme.spec.ts
  npm run test:e2e -- case-grid-theme.spec.ts
  ```
- [ ] Confirmar que tests validan ambas paletas (Olive y Navy)
- [ ] Verificar que tests comprueban colores computados (no solo clases CSS)

**Resultado esperado:** 100% tests E2E pasando en ambas paletas.

---

### ✅ DoD-3: Verificación visual en ambas paletas

**Verificar:**
- [ ] Levantar servidor: `npm run dev`
- [ ] Abrir `/admin` y cambiar entre paletas
- [ ] Verificar legibilidad en:
  - Hero (headline, subtitle, CTAs)
  - PainPoints (cards, iconos, texto)
  - CaseGrid (cards, badges, métricas)
- [ ] Tomar screenshots si hay dudas

**Pregunta crítica:** ¿Fran aprobaría esto visualmente? (CA flexible: "Le gusta a Fran")

**Resultado esperado:** Coherencia visual en ambas paletas, razonablemente legible.

---

### ✅ DoD-4: Comentario en Linear con Fase 2 plan

**Verificar:**
- [ ] Leer comentario en Linear issue FJG-101
- [ ] Confirmar que incluye:
  - Resumen de cambios aplicados
  - Decisiones tomadas (ej: mantener `text-red-500` en PainPoints)
  - Lista de componentes pendientes para Fase 2
  - Mención a verificación en ambas paletas
- [ ] Confirmar que el comentario es claro y accionable

**Resultado esperado:** Comentario completo y útil para quien haga Fase 2.

---

### ✅ DoD-5: Visual OK de Fran

**Verificar:**
- [ ] Confirmar que Fran ha revisado visualmente en ambas paletas
- [ ] Confirmar que no hay objeciones de legibilidad o estética
- [ ] Si hay cambios solicitados, documentar en Linear

**Nota:** Este es un CA flexible. No necesitamos auditoría WCAG AAA, solo que "le guste a Fran".

**Resultado esperado:** Fran da OK visual.

---

## 3. Verificación de Código

### ✅ Calidad de Código

**Verificar:**
- [ ] Componentes Hero, PainPoints y CaseGrid mantienen estructura original
- [ ] No hay cambios de funcionalidad (solo colores)
- [ ] Código es legible y mantiene convenciones del proyecto
- [ ] No hay comentarios tipo "TODO" o "FIXME" sin resolver

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
- [ ] Si hay gradientes, usan sintaxis v4: `bg-linear-to-r` en lugar de `bg-gradient-to-r`
- [ ] Tokens CSS usan sintaxis correcta: `var(--primary-500)` si se usa `style`, o `bg-primary-500` en className
- [ ] No hay conflictos con `@theme inline` en `globals.css`

**Resultado esperado:** Compatible con Tailwind CSS v4.x.

---

## 4. Documentación

### ✅ Informe de Implementación

**Verificar:**
- [ ] Existe `FJG-101-informe-implementacion.md`
- [ ] Incluye:
  - Resumen ejecutivo
  - Cambios realizados en Hero, PainPoints, CaseGrid
  - Decisiones tomadas (ej: mantener `text-red-500`)
  - Tabla de mapeo de colores (opcional pero útil)
  - Lista de componentes pendientes Fase 2
  - Screenshots (opcional si hay dudas visuales)
- [ ] Lenguaje claro y útil para futuros desarrolladores

**Resultado esperado:** Informe completo y bien estructurado.

---

### ✅ Archivos Temporales

**Verificar:**
- [ ] `AUDIT_FASE1.md` existe durante desarrollo pero puede borrarse al final
- [ ] `TOKEN_MAPPING.md` existe durante desarrollo pero puede borrarse al final
- [ ] Estos archivos NO deben estar en el commit final (opcional)

**Resultado esperado:** Archivos temporales gestionados correctamente.

---

## 5. Checklist Final del Reviewer

Antes de aprobar, confirmar:

- [ ] Hero usa tokens coherentemente (CA-1) ✅
- [ ] PainPoints usa tokens coherentemente (CA-2) ✅
- [ ] CaseGrid usa tokens coherentemente (CA-3) ✅
- [ ] Sin mezclas evidentes de paleta antigua (CA-4) ✅
- [ ] Fase 2 documentada (CA-5) ✅
- [ ] Tests unitarios pasando (DoD-1) ✅
- [ ] Tests E2E pasando (DoD-2) ✅
- [ ] Verificación visual en ambas paletas (DoD-3) ✅
- [ ] Comentario en Linear con plan Fase 2 (DoD-4) ✅
- [ ] Visual OK de Fran (DoD-5) ✅
- [ ] Código de calidad sin errores de linter/TypeScript ✅
- [ ] Tailwind v4 compatible ✅
- [ ] Informe de implementación completo ✅

---

## 6. Decisión de Aprobación

**Si todos los checks anteriores pasan:**
✅ **APROBAR** - Issue FJG-101 completada, lista para merge a `in2-ui-v0`.

**Si hay fallos:**
❌ **RECHAZAR** - Documentar claramente qué falta y por qué.

**Formato de feedback:**
```
## Revisión FJG-101

**Estado:** [APROBADO / RECHAZADO]

**Motivo (si rechazado):**
- [ ] CA-X no cumplido: [explicación]
- [ ] DoD-X no cumplido: [explicación]
- [ ] Tests fallando: [detalles]
- [ ] Problemas de legibilidad en paleta [Olive/Navy]: [detalles]

**Comentarios adicionales:**
[Cualquier observación útil para el Developer]
```

---

## 7. Notas Importantes

1. **CA flexible:** "Le gusta a Fran" es el estándar visual. No necesitamos auditoría WCAG formal.

2. **Fase 2 NO es parte de FJG-101:** Si encuentras problemas en Footer, MethodologySection, etc., documentar en comentario Linear pero NO bloquear aprobación de FJG-101.

3. **Colores hardcoded justificados:** Si `text-red-500` en PainPoints tiene justificación semántica clara, está OK mantenerlo.

4. **Scope creep:** Si el Developer agregó tokens nuevos (`--accent-error`, etc.), eso está fuera de alcance. Documentar para Fase 2.

5. **Tests son obligatorios:** Sin tests pasando, NO aprobar.

---

**¿Dudas o bloqueos?**  
Consultar con Agent Manager o Fran antes de aprobar/rechazar.
