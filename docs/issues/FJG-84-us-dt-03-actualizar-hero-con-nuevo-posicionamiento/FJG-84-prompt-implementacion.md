# FJG-84 - PROMPT IMPLEMENTACIÓN
**Issue**: US-DT-03 Actualizar Hero con nuevo posicionamiento de negocio
**Agent Role**: Developer
**Story Points**: 2 SP
**Branch**: fjgonzalez25691-fjg-84-us-dt-03-actualizar-hero-con-nuevo-posicionamiento-de

## VERIFICACIÓN LINEAR OBLIGATORIA

**ANTES DE PROCEDER**: Has verificado la issue FJG-84 en Linear y confirmas que los criterios de aceptación y DoD coinciden exactamente con este prompt.

**Issue verificada en Linear**: US-DT-03 Actualizar Hero con nuevo posicionamiento de negocio
**Status**: In Progress
**Scope alineado**: Solo actualización copy/texto, NO layout ni diseño

## MISIÓN DEVELOPER

Actualizar el copy del Hero para alinearlo con el **nuevo posicionamiento empresarial** definido en FJG-44: "empresario que usa IA/Cloud/automatización para mejorar números del negocio".

### TEXTOS ESPECÍFICOS (según Linear)

**H1 (Título Principal)**:
```
"Hago que tu negocio gane más y gaste menos usando IA, automatización y soluciones Cloud."
```

**Subtítulo**:
```
"Menos costes, menos errores y más tiempo para lo importante."
```

**Texto de Apoyo**:
```
"+37 años dirigiendo operaciones y equipos en empresas reales. Ahora uso la tecnología para mejorar tus números, no para complicarte la vida."
```

**CTAs (Mantener Funcionalidad)**:
- **CTA Principal**: "Agendar diagnóstico" (mantener enlace Calendly)
- **CTA Secundario**: "Hablar con el asistente IA" (enlazar al chatbot)

### ALCANCE ESPECÍFICO

**✅ INCLUIDO**:
- Actualizar textos Hero component
- Verificar funcionalidad CTAs existentes
- Asegurar responsive mobile/desktop
- Mantener coherencia tono FJG-44 (sin promesas absolutas)

**❌ FUERA DE ALCANCE**:
- Cambios layout o diseño visual
- Modificación styling/CSS
- Nueva funcionalidad
- Cambios en otros componentes

## CRITERIOS ACEPTACIÓN (Linear)

1. **H1, subtítulo y apoyo sustituyen textos actuales del Hero**
2. **Tono alineado con FJG-44**: lenguaje llano, orientado negocio, sin promesas
3. **CTAs mantienen funcionalidad**: Calendly y chatbot operativos
4. **No modificación layout/diseño**: solo texto
5. **Mobile y desktop revisados**: responsive preserved

## DEFINITION OF DONE (Linear)

- [ ] Hero actualizado en código con textos exactos especificados
- [ ] Despliegue preview verificado (funcionamiento correcto)
- [ ] Confirmado no colisiona con tareas completadas sprint anterior
- [ ] CTAs funcionales (Calendly + chatbot) preservados
- [ ] Responsive behavior mantenido

## PLAN DE IMPLEMENTACIÓN

### FASE 1: Localizar y Analizar Componente Hero
```bash
# 1. Analizar estructura actual Hero
# 2. Identificar dónde se pasan los textos (props vs hardcoded)
# 3. Verificar integración en app/page.tsx
```

### FASE 2: Actualizar Textos
```bash
# 1. Reemplazar H1, subtítulo y texto apoyo con textos Linear exactos
# 2. Verificar CTAs mantienen funcionalidad
# 3. Asegurar tono empresarial coherente FJG-44
```

### FASE 3: Actualización Tests E2E Obligatoria
```bash
# 1. Actualizar hero.spec.ts con nuevos textos
#    - CA-1: Nuevo headline H1
#    - CA-3: Nuevo subtítulo  
#    - CA-4: Nuevo texto badge
#    - CA-5: Verificar labels CTAs (si cambian)
# 2. Ejecutar tests: npx playwright test __tests__/e2e/hero.spec.ts
# 3. Verificar todos tests pasan con nuevo copy
```

### FASE 4: Verificación Funcionalidad
```bash
# 1. Test CTA Calendly funciona correctamente
# 2. Test CTA chatbot abre widget correctamente
# 3. Verificar responsive mobile/desktop
# 4. Preview deployment check
```

## ARCHIVOS A MODIFICAR

**Probables ubicaciones**:
- `components/Hero.tsx` - Component principal Hero
- `app/page.tsx` - Si textos se pasan como props

**Tests a verificar**:
- `__tests__/components/hero.spec.tsx` - Si existe, actualizar textos test
- `__tests__/e2e/hero.spec.ts` - Tests Playwright E2E que fallarán con nuevo copy
- Tests E2E relevantes para CTAs tras cambio textos

## ACTUALIZACIÓN TESTS OBLIGATORIA

### Tests E2E Playwright - hero.spec.ts
**CRÍTICO**: Los tests E2E buscan textos específicos que cambiarán con FJG-84.

**Tests que fallarán tras implementación**:
```typescript
// CA-1: Busca headline anterior
expect(headline).toContainText('Hago que tu negocio gane más y gaste menos usando IA');

// CA-3: Busca subtítulo anterior  
const subtitle = page.locator('p').filter({ hasText: 'Menos costes' });

// CA-4: Busca badge anterior
const badge = page.getByText('+37 años dirigiendo operaciones');

// CA-5: Busca CTA anterior
const cta = page.getByRole('button', { name: /Diagnóstico gratuito 30 min/i });
```

**OBLIGATORIO actualizar tras cambio textos**:
1. Headline test con nuevo H1
2. Subtítulo test con nuevo copy
3. Badge test con nuevo texto apoyo
4. CTA tests con nuevos labels botones si cambian

## RESTRICCIONES TÉCNICAS

### Coherencia FJG-44
- **Lenguaje llano**: Sin jerga técnica excesiva
- **Orientado negocio**: Enfoque números/resultados
- **Sin promesas absolutas**: Evitar "garantizo", "siempre", "100%"
- **Tono empresarial**: "Empresario que domina tecnología"

### Mantenimiento CTAs
- **CTA Calendly**: Mantener onClick handler existente
- **CTA Chatbot**: Integración con ChatbotWidget existente
- **Analytics tracking**: Preservar tracking events si existen

## VALIDACIÓN FINAL

Antes de crear informe implementación:

1. **Textos exactos Linear**: H1, subtítulo, apoyo coinciden 100%
2. **CTAs funcionales**: Calendly abre modal, chatbot funciona
3. **Tests E2E actualizados**: hero.spec.ts pasa con nuevos textos
4. **Playwright tests verdes**: Todos los tests E2E funcionando
5. **Responsive preserved**: Mobile/desktop behavior correcto
6. **No breaking changes**: Layout visual sin modificaciones
7. **Preview deployment**: Verificar funcionamiento producción

---

**NOTA IMPORTANTE**: Esta es una tarea de **solo contenido + tests**. NO modificar layout, diseño visual, o añadir nueva funcionalidad. Solo reemplazar textos según especificación Linear exacta y actualizar tests correspondientes para que pasen con el nuevo copy.