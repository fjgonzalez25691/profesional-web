# FJG-43 - PROMPT REVISIÓN
**Issue**: US-03-001: Chatbot UI Flotante + Mobile UX
**Agent Role**: Reviewer  
**Sprint**: S2 (Cycle 2cce504b-650a-4498-bde9-35d43489c6f0)
**Story Points**: 5 SP

## 🎯 VERIFICACIÓN LINEAR OBLIGATORIA

**ANTES DE REVISAR**: Verificar que la implementación cumple exactamente con los criterios de aceptación y DoD de Linear FJG-43.

✅ **Issue Linear verificada**: US-03-001: Chatbot UI Flotante + Mobile UX
✅ **Scope alineado**: Solo UI flotante responsive + mock responses (NO backend)

## 📋 MISIÓN REVIEWER

Auditar implementación TDD de chatbot UI flotante, verificando:
1. **Cumplimiento Linear**: CA + DoD exactos
2. **UX Responsive**: Mobile vs desktop optimizado
3. **Calidad**: Tests pasando, código mantenible  
4. **Accesibilidad**: ARIA + keyboard navigation

## ✅ CHECKLIST FUNCIONAL

### Verificación Criterios Aceptación (Linear)
```gherkin
□ Scenario 1: Desktop - botón bottom-right → modal 400x600px
□ Scenario 2: Mobile - botón bottom-center → fullscreen
□ Scenario 3: Input autofocus + placeholder "¿En qué puedo ayudarte?"
□ Scenario 4: Envío mensaje → bubble derecha + typing indicator + response
□ Scroll automático último mensaje funciona correctamente
```

### Verificación Definition of Done (Linear)
```
□ Componente ChatbotWidget flotante implementado
□ Modal desktop 400x600px, mobile fullscreen responsive  
□ Input autofocus automático al abrir
□ Histórico scroll automático último mensaje
□ Botón cerrar [X] funcional
□ Estado local React useState (no external storage)
□ Tests chatbot pasando 100%
□ Responsive mobile+desktop verificado
□ Accesibilidad ARIA labels + keyboard navigation
□ Mock responses "Próximamente..." (NO backend integrado)
```

## 📱 CHECKLIST UX RESPONSIVE

### Mobile Experience (< md:)
```
□ Botón flotante bottom-center (no right)
□ Modal fullscreen (no 400x600px)
□ Keyboard pushes content up correctly
□ Scroll histórico smooth en mobile
□ Touch targets ≥44px (botones/inputs)
□ Safe area insets respected (iOS notch)
□ Fullscreen no interferir status bar
```

### Desktop Experience (≥ md:)
```
□ Botón flotante bottom-right positioned
□ Modal 400x600px anchored bottom-right
□ Modal no covering floating CTA (z-index management)
□ Click outside modal closes (UX expected)
□ Modal stays in viewport (no overflow)
□ Hover states en botones/elementos
```

## 🧪 CHECKLIST TÉCNICO

### Tests & Cobertura
```
□ chatbot-widget.spec.tsx: Botón flotante + toggle state
□ chatbot-modal.spec.tsx: Modal responsive + close behavior
□ message-bubble.spec.tsx: User vs chatbot bubbles
□ npm run test pasa 100% sin errores
□ Cobertura tests ≥90% archivos nuevos chatbot
□ Tests mobile/desktop usando viewport mocking
```

### Código & Arquitectura
```
□ TypeScript strict mode sin errores
□ Interfaces Message, ChatbotState bien definidas
□ Hook useChatbot encapsula lógica estado
□ Componentes separados: Widget, Modal, MessageBubble
□ Estado local useState (no Zustand/Redux aún)
□ No prop drilling excesivo
□ Components reutilizables, no over-engineered
```

### Performance & Build
```
□ npm run build completa sin errores
□ Bundle size impact chatbot <15KB
□ No memory leaks (useEffect cleanup)
□ Lazy loading considerar si necesario
□ Smooth animations sin jank
□ Mock responses delay realista (1-3s)
```

## 🎯 CHECKLIST INTEGRACIÓN

### Integración Page Layout
```
□ ChatbotWidget integrado en app/page.tsx
□ No conflicto z-index con existing FloatingCalendlyButton
□ No solapamiento visual mobile/desktop
□ Estado independiente de otros modals
□ Performance no afectada por chatbot
```

### Mock Backend Simulation
```
□ Responses hardcoded realistas (no lorem ipsum)
□ Typing indicator timing natural (1.5-2.5s)
□ Mock responses varían según input usuario
□ Error handling si mock fails gracefully
□ Estado "typing" se limpia correctamente
```

## 🔍 CHECKLIST ACCESIBILIDAD

### ARIA & Semantic HTML
```
□ Botón flotante: aria-label descriptivo
□ Modal: role="dialog", aria-modal="true"
□ Input: aria-label o associated label
□ Messages: proper semantic structure
□ Live region para new messages (screen readers)
```

### Keyboard Navigation
```
□ Tab navigation funcional entre elementos
□ Enter envía mensaje desde input
□ Escape cierra modal
□ Focus trap dentro modal abierto
□ Focus restoration al cerrar modal
□ Skip links si necesario
```

### Screen Readers
```
□ Messages anunciados cuando aparecen
□ Estado typing indicator comunicado
□ Botón close anunciado correctamente
□ Modal title/description accesibles
```

## 📚 CHECKLIST DOCUMENTACIÓN

### Código Self-Documented
```
□ Componentes tienen JSDoc comments
□ Props interfaces documentadas
□ Hook useChatbot documented con ejemplos
□ README chatbot folder si complejo
□ No TODOs o código commented out
```

## 🚩 RED FLAGS (Rechazar implementación)

### Bloqueantes Absolutos
```
□ Tests no pasan o errores críticos
□ Modal no responsive (mismo tamaño mobile/desktop)
□ Botón flotante misma posición mobile/desktop
□ Input no autofocus o placeholder incorrecto
□ Backend integración incluida (violación scope)
□ Build falla o errores TypeScript críticos
```

### Concerns Mayores  
```
□ UX mobile pobre (no fullscreen, keyboard issues)
□ Accesibilidad falta (no ARIA, no keyboard nav)
□ Z-index conflicts con existing floating buttons
□ Performance impact significativo
□ Over-engineering (state management complejo para MVP)
□ Mock responses no realistas o timing pobre
```

## 📋 VEREDICTO FINAL

**Si TODO ✅**: Aprobado ✅  
**Si >3 concerns menores**: Aprobado con observaciones ⚠️  
**Si ≥1 bloqueante absoluto**: Rechazado ❌ (Developer debe corregir)

## 🎯 TEMPLATE INFORME REVISIÓN

```markdown
# FJG-43 - INFORME REVISIÓN

## Veredicto: [✅ Aprobado | ⚠️ Aprobado con observaciones | ❌ Rechazado]

### Cumplimiento Linear
- Criterios Aceptación: [✅/❌]
- Definition of Done: [✅/❌]

### UX Responsive
- Mobile fullscreen: [✅/❌]
- Desktop modal 400x600: [✅/❌]
- Botones posicionados correctos: [✅/❌]

### Calidad Técnica
- Tests pasando: [✅/❌] 
- TypeScript limpio: [✅/❌]
- Performance: [✅/❌]

### Accesibilidad
- ARIA labels: [✅/❌]
- Keyboard navigation: [✅/❌]
- Screen reader friendly: [✅/❌]

### Issues Encontradas
[Lista específica issues y severidad]

### Observaciones
[Feedback UX/código para mejora futura]

### Next Steps
[Si rejected: qué debe corregir Developer]
[Si approved: ready for backend integration phase]
```

---

**ROL RESTRICTION**: Como Reviewer, NO modificar código. Solo auditar, señalar problemas, y rechazar/aprobar. Developer corrige issues reportadas.