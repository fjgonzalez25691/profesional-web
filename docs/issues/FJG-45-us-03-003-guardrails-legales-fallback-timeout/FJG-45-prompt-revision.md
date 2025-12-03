# FJG-45 - PROMPT REVISIÓN
**Issue**: US-03-003: Guardrails Legales + Fallback Timeout  
**Agent Role**: Reviewer  
**Sprint**: S2 (Cycle 2cce504b-650a-4498-bde9-35d43489c6f0)
**Story Points**: 2 SP

## VERIFICACIÓN LINEAR OBLIGATORIA

**ANTES DE REVISAR**: Verificar que la implementación cumple exactamente con los criterios de aceptación y DoD de Linear FJG-45.

**Issue Linear verificada**: US-03-003: Guardrails Legales + Fallback Timeout
**Scope alineado**: Protección legal complementaria a FJG-44 (NO duplicación guardrails)

## MISIÓN REVIEWER

Auditar implementación guardrails legales y fallback timeout, verificando:
1. **Cumplimiento Linear**: CA + DoD exactos
2. **Coherencia FJG-44**: NO duplicar guardrails system prompt
3. **Protección Legal**: UI/UX safeguards apropiados
4. **UX Integration**: Sin breaking changes chatbot

## CHECKLIST FUNCIONAL

### Verificación Criterios Aceptación (Linear)
```
□ Footer legal siempre visible en chatbot abierto
□ Texto orientativo aproximaciones/diagnóstico incluido
□ Botón agenda diagnóstico funcional
□ Tono empresarial coherente FJG-44 mantenido
□ Response validation detecta frases prohibidas automáticamente
□ Disclaimer orientativo añadido (no agresivo)
□ Respuestas válidas no modificadas
□ Timeout >8s detectado y manejado apropiadamente
□ Mensaje fallback humano y cercano (no técnico)
□ CTA agendar llamada incluido en timeout
```

### Verificación Definition of Done (Linear)
```
□ Footer legal implementado y siempre visible
□ validateResponse activo en API route
□ Timeout fallback funcional >8s
□ Tests básicos casos prohibidos + timeout implementados
□ Coherencia posicionamiento FJG-44 preservada
□ No breaking changes UI chatbot existente
□ Documentación integration guardrails disponible
```

## CHECKLIST COHERENCIA FJG-44

### Verificación NO Duplicación
```
□ System prompt FJG-44 NO modificado
□ Guardrails existentes system prompt preservados
□ NO duplicate validation logic backend
□ Implementación complementaria (UI/UX focus)
□ Posicionamiento "empresario que domina tecnología" mantenido
□ Tono resultados financieros comprensibles preservado
```

### Integration Seamless
```
□ ChatbotModal integration sin breaking changes
□ API route modificación mínima y limpia
□ Response flow natural preservado
□ Loading states y error handling coherentes
□ UX chatbot existente mantenida
```

## CHECKLIST TÉCNICO

### Footer Legal Component
```
□ LegalFooter component implementado correctamente
□ Siempre visible en chatbot (no conditional rendering)
□ Texto orientativo sobre aproximaciones claro
□ Mención diagnóstico 30 min incluida
□ Botón agenda diagnóstico funcional y accesible
□ Styling coherente con diseño chatbot existente
□ Responsive design mobile/desktop
```

### Response Validation
```
□ validateResponse function implementada
□ PROHIBITED_PHRASES regex patterns correctos
□ Detecta: "garantizo", "100% seguro", "resultado garantizado", "te aseguro"
□ Disclaimer automático texto apropiado y no agresivo
□ Respuestas válidas pasan sin modificación
□ Performance impact mínimo (<1ms validation)
□ Integration API route limpia
```

### Timeout Handling
```
□ Timeout detection >8s implementado API
□ TIMEOUT_FALLBACK_MESSAGE texto humano y cercano
□ CTA agendar llamada incluido en mensaje
□ UI timeout state apropiado frontend
□ Error handling graceful sin crashes
□ Retry mechanism considerar o documentar
```

## CHECKLIST TESTS & COVERAGE

### Component Tests
```
□ chatbot-legal-footer.test.tsx implementado
□ Footer rendering test pasando
□ Botón agenda click handler test
□ Responsive behavior test
□ Accessibility ARIA test basic
```

### Validation Tests
```
□ response-validator.test.ts implementado
□ Prohibited phrases detection test casos múltiples
□ Disclaimer addition test correcto
□ Valid responses unchanged test
□ Edge cases manejo (empty, null, very long)
```

### Timeout Tests
```
□ timeout-fallback.test.ts API implementado
□ >8s timeout detection test
□ Fallback message return test
□ API integration timeout handling test
□ Frontend timeout UI state test
```

### Integration Tests
```
□ Chatbot modal footer integration test
□ API route validation integration test
□ End-to-end timeout flow test basic
□ No breaking changes regression test
```

## CHECKLIST PROTECCIÓN LEGAL

### Disclaimer Quality
```
□ Texto disclaimer orientativo (no defensivo)
□ Mención "aproximados basados en experiencia previa"
□ "Cada caso único requiere diagnóstico específico"
□ Tono empresarial profesional mantenido
□ NO lenguaje legal complicado
□ CTA diagnóstico sutil incluido
```

### Footer Legal Content
```
□ Texto footer comprensible y directo
□ NO sobrecarga información legal
□ Enfoque diagnóstico personalizado
□ Coherencia posicionamiento empresarial
□ Balance protección/UX apropiado
```

## CHECKLIST UX/UI INTEGRATION

### Visual Integration
```
□ Footer styling coherente chatbot design
□ No visual disruption flow conversación
□ Timeout message styling apropiado
□ Mobile/desktop responsive behavior
□ Loading states smooth transitions
```

### Conversational Flow
```
□ Footer no interrumpe conversación
□ Disclaimer insertion natural en response
□ Timeout fallback feels human y helpful
□ CTA placement apropriado (no invasivo)
□ Overall chatbot UX preserved
```

## RED FLAGS (Rechazar implementación)

### Bloqueantes Absolutos
```
□ Modifica system prompt FJG-44 (violación scope)
□ Duplica guardrails ya existentes backend
□ Breaking changes chatbot UI existente
□ Footer no siempre visible
□ Timeout >8s no manejado correctamente
□ Tests críticos fallan o no existen
□ Disclaimer texto agresivo o defensivo
```

### Concerns Mayores  
```
□ Performance impact significativo validation
□ UX chatbot degradada notablemente
□ Footer demasiado intrusivo conversación
□ Timeout handling confuso usuario
□ Integration API route messy o compleja
□ Coherencia FJG-44 comprometida
```

## TEMPLATE INFORME REVISIÓN

```markdown
# FJG-45 - INFORME REVISIÓN

## Veredicto: [Aprobado | Aprobado con observaciones | Rechazado]

### Cumplimiento Linear
- Criterios Aceptación: [✓/✗]
- Definition of Done: [✓/✗]

### Coherencia FJG-44
- NO duplicación guardrails: [✓/✗]
- Posicionamiento preservado: [✓/✗]
- System prompt no modificado: [✓/✗]

### Protección Legal
- Footer legal siempre visible: [✓/✗]
- Response validation funcional: [✓/✗]
- Timeout fallback apropiado: [✓/✗]

### UX Integration  
- No breaking changes: [✓/✗]
- Footer no intrusivo: [✓/✗]
- Flow conversación preservado: [✓/✗]

### Testing Coverage
- Tests componentes: [✓/✗]
- Tests validation: [✓/✗]  
- Tests timeout: [✓/✗]

### Issues Encontradas
[Lista específica issues y severidad]

### Observaciones
[Feedback integration y UX]

### Next Steps
[Si rejected: qué debe corregir Developer]
[Si approved: ready for merge with FJG-44]
```

---

**ROL RESTRICTION**: Como Reviewer, NO modificar código. Solo auditar implementación complementaria a FJG-44, señalar problemas, y rechazar/aprobar.