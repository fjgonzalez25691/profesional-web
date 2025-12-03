# FJG-43 - PROMPT IMPLEMENTACIÓN
**Issue**: US-03-001: Chatbot UI Flotante + Mobile UX
**Agent Role**: Developer
**Sprint**: S2 (Cycle 2cce504b-650a-4498-bde9-35d43489c6f0)
**Story Points**: 5 SP

## 🎯 VERIFICACIÓN LINEAR OBLIGATORIA
**ANTES DE PROCEDER**: Has verificado la issue FJG-43 en Linear y confirmas que los criterios de aceptación y DoD coinciden exactamente con este prompt.

✅ **Issue verificada en Linear**: US-03-001: Chatbot UI Flotante + Mobile UX
✅ **Status**: In Progress
✅ **Scope alineado**: UI flotante responsive + mock responses (NO backend integrado aún)

## 📋 MISIÓN DEVELOPER TDD

Implementar **UI chatbot flotante** responsive con UX optimizada para mobile y desktop siguiendo metodología TDD estricta.

### 🔴 Alcance Específico (según Linear)
1. **Botón flotante**: Desktop bottom-right, mobile bottom-center
2. **Modal chatbot**: Desktop 400x600px, mobile fullscreen
3. **Input autofocus**: Placeholder "¿En qué puedo ayudarte?"
4. **Histórico scroll**: Automático al último mensaje
5. **Mock responses**: "Próximamente..." (NO backend real)
6. **Responsive**: UX diferenciada mobile vs desktop
7. **Accesibilidad**: ARIA labels + keyboard navigation

### ❌ FUERA DE ALCANCE
- Backend integración (issue separada US-03-002)
- IA responses reales
- Persistencia mensajes
- Notificaciones push
- Integración analytics (ya existe en proyecto)

## 🧪 PLAN TDD IMPLEMENTACIÓN

### FASE 1: Tests Setup + Botón Flotante
```bash
# 1. RED: Test botón flotante responsive
touch __tests__/components/chatbot-widget.spec.tsx
# 2. GREEN: Implementar ChatbotWidget.tsx (botón + estado)
# 3. REFACTOR: Clean button styles

# Test Cases:
- ✅ Botón aparece bottom-right desktop
- ✅ Botón aparece bottom-center mobile
- ✅ Click abre/cierra chatbot
- ✅ Z-index alto (9999)
```

### FASE 2: Modal Desktop + Mobile
```bash
# 1. RED: Test modal responsive
touch __tests__/components/chatbot-modal.spec.tsx
# 2. GREEN: Implementar ChatbotModal.tsx
# 3. RED: Test fullscreen mobile vs 400x600 desktop
# 4. GREEN: Responsive modal styles
# 5. REFACTOR: DRY modal logic

# Test Cases Modal:
- ✅ Desktop: modal 400x600px bottom-right positioned
- ✅ Mobile: fullscreen overlay con padding safe
- ✅ Botón cerrar [X] funcional
- ✅ Click outside cierra modal (desktop only)
```

### FASE 3: Input + Histórico Mensajes
```bash
# 1. RED: Test MessageBubble component
touch __tests__/components/message-bubble.spec.tsx
# 2. GREEN: Implementar MessageBubble.tsx (usuario vs chatbot)
# 3. RED: Test input autofocus + placeholder
# 4. GREEN: Input handling con Enter
# 5. RED: Test scroll automático último mensaje
# 6. GREEN: useEffect scroll behavior
# 7. REFACTOR: Clean message state management

# Test Cases Mensajes:
- ✅ Input autofocus al abrir modal
- ✅ Placeholder "¿En qué puedo ayudarte?"
- ✅ Enter envía mensaje
- ✅ Usuario: bubble azul derecha
- ✅ Chatbot: bubble gris izquierda  
- ✅ Scroll automático último mensaje
- ✅ Mock response "Próximamente..." después 2s
```

### FASE 4: Accesibilidad + Integración Final
```bash
# 1. RED: Test keyboard navigation
# 2. GREEN: ARIA labels + focus management
# 3. RED: Test integración en page.tsx
# 4. GREEN: Integrar ChatbotWidget en layout
# 5. REFACTOR: Performance optimizations

# Test Cases A11y:
- ✅ ARIA labels en botón flotante
- ✅ role="dialog" en modal
- ✅ Focus trap en modal abierto
- ✅ Escape cierra modal
- ✅ Tab navigation funcional
```

## 🎨 ARQUITECTURA TÉCNICA

### Estructura Archivos
```
components/
├── Chatbot/
│   ├── ChatbotWidget.tsx     # Botón flotante + estado principal (NEW)
│   ├── ChatbotModal.tsx      # Modal responsive (NEW)
│   ├── MessageBubble.tsx     # Bubble usuario/chatbot (NEW)
│   └── index.ts              # Export barrel (NEW)

__tests__/
└── components/
    ├── chatbot-widget.spec.tsx    # NUEVO
    ├── chatbot-modal.spec.tsx     # NUEVO
    └── message-bubble.spec.tsx    # NUEVO

app/
└── page.tsx                  # MODIFICAR: integrar ChatbotWidget
```

### Interfaces TypeScript
```typescript
// types/chatbot.ts (NEW)
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'chatbot';
  timestamp: Date;
}

interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
}

// Hook personalizado
function useChatbot(): {
  state: ChatbotState;
  sendMessage: (text: string) => void;
  toggleChatbot: () => void;
  closeChatbot: () => void;
}
```

### Responsive Strategy
```scss
// Desktop (md:)
.chatbot-button {
  @apply fixed bottom-6 right-6 md:flex hidden;
}

.chatbot-modal {
  @apply fixed bottom-20 right-6 w-96 h-[600px] md:block hidden;
}

// Mobile (<md:)
.chatbot-button-mobile {
  @apply fixed bottom-6 left-1/2 -translate-x-1/2 flex md:hidden;
}

.chatbot-modal-mobile {
  @apply fixed inset-0 w-full h-full flex md:hidden;
}
```

## ✅ CRITERIOS ACEPTACIÓN (Gherkin de Linear)

```gherkin
Scenario: Apertura chatbot desktop
  Given estoy en home desktop
  When veo botón chatbot bottom-right
  And clic botón
  Then modal chatbot abre
  And veo historial vacío
  And input focalizado automático
  And placeholder "¿En qué puedo ayudarte?"

Scenario: Apertura chatbot mobile  
  Given estoy en home mobile
  When veo botón chatbot bottom-center
  And clic botón
  Then chatbot abre fullscreen
  And teclado se ajusta automático
  And scroll histórico funciona

Scenario: Envío mensaje
  Given chatbot abierto
  When escribo "¿Reducís costes AWS?"
  And pulso Enter o clic "Enviar"
  Then veo mi mensaje alineado derecha
  And veo indicador "Escribiendo..."
  And veo respuesta chatbot <5s
```

## 📋 DEFINITION OF DONE (Linear)

- [ ] Componente `<ChatbotWidget>` flotante
- [ ] Modal desktop 400x600px, mobile fullscreen  
- [ ] Input autofocus, placeholder text
- [ ] Histórico scroll automático
- [ ] Botón cerrar [X] funcional
- [ ] Estado local React (useState)
- [ ] Test chatbot-ui.spec.ts PASANDO
- [ ] Responsive mobile+desktop
- [ ] Accesibilidad: ARIA labels, keyboard navigation
- [ ] **NO backend integrado aún** (mock responses "Próximamente...")

## 🚦 COMANDOS DESARROLLO

```bash
# Tests en modo watch
npm run test -- --watch chatbot

# Verificar responsive
npm run dev  # Test mobile devtools + desktop

# Verificar build
npm run build

# Type checking
npm run type-check
```

## 🎯 MOCK RESPONSES

Para esta phase, usar respuestas hardcoded:

```typescript
const mockResponses = [
  "¡Hola! Soy el asistente de Francisco. ¿En qué puedo ayudarte?",
  "Próximamente podré responder consultas específicas sobre optimización Cloud y automatización.",
  "Mientras tanto, puedes agendar una consulta directa usando el botón azul.",
  "¿Te interesa conocer casos de éxito específicos de tu sector?"
];

// Simular typing delay 1.5-2.5s
setTimeout(() => setResponse(randomResponse), 2000);
```

## 🎨 DESIGN TOKENS

```scss
// Colores (usar existing theme)
--chatbot-user: theme('colors.blue.600');     // Bubble usuario
--chatbot-bot: theme('colors.slate.200');     // Bubble chatbot  
--chatbot-text: theme('colors.slate.800');    // Texto
--chatbot-bg: theme('colors.white');          // Fondo modal

// Sombras
--chatbot-shadow: theme('boxShadow.2xl');     // Modal shadow
--chatbot-button-shadow: theme('boxShadow.lg'); // Botón flotante

// Z-index
--chatbot-z: 9999;                            // Sobre todo
```

## 🎯 OUTPUT ESPERADO

Al completar implementación TDD:
1. **Tests verdes**: Todos los tests chatbot pasando
2. **Funcionalidad**: Botón flotante + modal responsive funcional
3. **UX mobile**: Fullscreen optimal, teclado friendly
4. **Mock responses**: Simulación typing + responses básicas
5. **Accesibilidad**: ARIA compliant, keyboard navigation
6. **Informe**: FJG-43-informe-implementacion.md con resultados

---

**RECUERDA**: Metodología anti-camello. UI mínima viable pero **altamente usable**. Solo componentes que requiere Linear exactamente, preparado para backend integration posterior.