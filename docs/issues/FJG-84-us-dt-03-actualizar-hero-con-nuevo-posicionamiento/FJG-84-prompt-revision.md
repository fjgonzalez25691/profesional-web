# FJG-84 - PROMPT REVISIÓN
**Issue**: US-DT-03 Actualizar Hero con nuevo posicionamiento de negocio
**Agent Role**: Reviewer
**Story Points**: 2 SP

## VERIFICACIÓN LINEAR OBLIGATORIA

**ANTES DE REVISAR**: Verificar que la implementación cumple exactamente con los criterios de aceptación y DoD de Linear FJG-84.

**Issue Linear verificada**: US-DT-03 Actualizar Hero con nuevo posicionamiento de negocio
**Scope alineado**: Solo actualización copy/texto, NO layout ni diseño

## MISIÓN REVIEWER

Auditar actualización textos Hero verificando cumplimiento exacto Linear FJG-84 y coherencia posicionamiento empresarial FJG-44.

**ROL DE SOLO LECTURA**: NO modificar código, solo señalar errores para que Developer corrija.

## CHECKLIST FUNCIONAL

### Verificación Criterios Aceptación (Linear)
```
□ H1 actualizado: "Hago que tu negocio gane más y gaste menos usando IA, automatización y soluciones Cloud"
□ Subtítulo actualizado: "Menos costes, menos errores y más tiempo para lo importante."
□ Texto apoyo actualizado: "+37 años dirigiendo operaciones y equipos en empresas reales. Ahora uso la tecnología para mejorar tus números, no para complicarte la vida."
□ Tono alineado FJG-44: lenguaje llano, orientado negocio, sin promesas absolutas
□ CTAs mantienen funcionalidad: Calendly operativo
□ CTAs mantienen funcionalidad: Chatbot operativo  
□ Layout/diseño NO modificado: solo textos cambiados
□ Mobile y desktop funcionan correctamente
□ Implementación por props: Hero recibe contenido via props en lugar de hardcoded
□ Component interface: Hero utiliza interface HeroProps con campos específicos
```

### Verificación Definition of Done (Linear)
```
□ Hero actualizado en código con textos exactos
□ Preview deployment verificado y funcional
□ No colisiona con tareas completadas sprint anterior
□ CTAs funcionales preservados (Calendly + chatbot)
□ Responsive behavior mantenido sin cambios
```

## CHECKLIST COHERENCIA FJG-44

### Posicionamiento Empresarial
```
□ Lenguaje llano: Sin jerga técnica excesiva
□ Orientado negocio: Enfoque números/resultados financieros
□ "Empresario que domina tecnología": Posicionamiento correcto vs "técnico que aprendió negocio"
□ Sin promesas absolutas: No usa "garantizo", "siempre", "100%"
□ Tono profesional P&L: Enfoque mejora números negocio
□ Coherencia system prompt: Alineado con chatbot messaging FJG-44
```

### Validación Textos Exactos
```
□ H1 coincide 100% con especificación Linear (sin punto final)
□ Subtítulo coincide 100% con especificación Linear (con punto final)  
□ Texto apoyo coincide 100% con especificación Linear (con punto final)
□ No añadidos textos no especificados
□ No modificaciones creativas no autorizadas
□ Implementación via props permite flexibilidad futura
```

## CHECKLIST TÉCNICO

### Funcionalidad CTAs
```
□ CTA "Agendar diagnóstico" abre modal Calendly correctamente
□ CTA "Hablar con el asistente IA" activa chatbot correctamente via CustomEvent 
□ onClick handlers preservados sin modificaciones
□ Analytics tracking mantenido (track "cta_calendly_click")
□ Accesibilidad CTAs preservada
□ CTA secundario usa icono Bot de lucide-react
□ Props onCtaClick y onSecondaryCta funcionan correctamente
```

### Responsive & UX
```
□ Mobile: textos se leen correctamente en viewport pequeño
□ Desktop: layout Hero preservado sin cambios visuales
□ Tablet: comportamiento intermedio funcional
□ Typography scaling: responsive behavior mantenido
□ No overflow texto en mobile
```

### Integration & Dependencies
```
□ Component Hero rendering sin errores
□ Props Hero (HeroProps interface) actualizados correctamente
□ HeroProps incluye: headline, subtitle, badgeText, onCtaClick, onSecondaryCta
□ No breaking changes otros componentes
□ Page.tsx integration preservada con props específicos
□ Build producción sin errores
□ ChatbotWidget integration con CustomEvent funcionando
```

## CHECKLIST TESTS & QUALITY

### Tests Actualizados
```
□ Tests Hero component actualizados con nuevos textos (si existen)
□ Tests E2E CTAs siguen pasando tras actualización textos
□ Tests E2E actualizados para nuevo copy (hero.spec.ts)
□ No tests rotos por cambio textos
□ Snapshots actualizados si aplicable
□ Playwright tests ejecutándose correctamente
```

### Code Quality
```
□ Modificaciones mínimas: Hero refactorizado a props, page.tsx actualizado
□ No refactoring no autorizado (Hero props es mejora arquitectural válida)
□ Consistencia coding style preservada
□ No new dependencies añadidas (usa lucide-react existente)
□ Git commit message claro y descriptivo
□ HeroProps interface tipada correctamente con TypeScript
```

## RED FLAGS (Rechazar implementación)

### Bloqueantes Absolutos
```
□ Textos no coinciden exactamente con Linear FJG-84
□ Layout o diseño visual modificado (fuera scope)
□ CTAs Calendly o chatbot no funcionan
□ Breaking changes en responsive behavior
□ Build falla o errores críticos
□ Nueva funcionalidad añadida no autorizada
```

### Concerns Mayores
```
□ Tono no alineado con posicionamiento empresarial FJG-44
□ Promesas absolutas detectadas en textos
□ Jerga técnica excesiva añadida
□ CTAs analytics tracking perdido
□ Mobile UX degradada
□ Over-engineering en cambio simple (Hero props es mejora arquitectural válida)
□ Tests E2E necesitan actualización tras cambio copy
```

## TEMPLATE INFORME REVISIÓN

```markdown
# FJG-84 - INFORME REVISIÓN

## Veredicto: [✅ Aprobado | ⚠️ Aprobado con observaciones | ❌ Rechazado]

### Cumplimiento Linear
- Criterios Aceptación: [✓/✗]
- Definition of Done: [✓/✗]

### Coherencia FJG-44  
- Posicionamiento empresarial: [✓/✗]
- Tono sin promesas absolutas: [✓/✗]
- Lenguaje llano orientado negocio: [✓/✗]

### Funcionalidad CTAs
- CTA Calendly operativo: [✓/✗]
- CTA Chatbot operativo via CustomEvent: [✓/✗]
- Analytics tracking preservado: [✓/✗]
- Responsive preserved: [✓/✗]

### Arquitectura & Props
- HeroProps interface correcta: [✓/✗]
- Props implementation funcionando: [✓/✗]
- ChatbotWidget integration: [✓/✗]

### Textos Exactos Linear
- H1 correcto (sin punto final): [✓/✗]
- Subtítulo correcto (con punto final): [✓/✗] 
- Texto apoyo correcto (con punto final): [✓/✗]

### Tests & E2E
- Tests E2E actualizados para nuevo copy: [✓/✗]
- Playwright tests funcionando: [✓/✗]

### Issues Encontradas
[Lista específica issues y severidad]

### Observaciones
[Feedback posicionamiento y funcionalidad]

### Next Steps
[Si rejected: qué debe corregir Developer]
[Si approved: ready for deployment]
```

---

**ROL RESTRICTION**: Como Reviewer, NO modificar código. Solo auditar textos Hero vs especificación Linear exacta, señalar problemas, y rechazar/aprobar.