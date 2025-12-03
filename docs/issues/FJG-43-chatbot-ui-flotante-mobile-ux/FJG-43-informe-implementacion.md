# FJG-43 - INFORME DE IMPLEMENTACIÓN
**Issue**: US-03-001: Chatbot UI Flotante + Mobile UX  
**Fecha**: 2025-12-03  
**Sprint**: S2  
**Story Points**: 5 SP

## ✅ RESUMEN
Se implementó la UI del chatbot flotante (desktop + mobile) con mock responses, historial, auto-scroll, input autofocus y accesibilidad básica. Botón flotante responsive, modal 400x600 en desktop y fullscreen en mobile. Respuestas mock con indicador "Escribiendo..." y envío por Enter o botón.

## 📌 Cambios principales
- `components/Chatbot/MessageBubble.tsx`: Burbujas usuario/bot, colores, alineación y timestamp relativo.
- `components/Chatbot/ChatbotModal.tsx`: Modal responsive con autofocus, scroll al último mensaje, cierre por overlay/X, indicador typing, formulario de envío, `aria-live="polite"` para lectores de pantalla.
- `components/Chatbot/ChatbotWidget.tsx`: Botones flotantes (desktop bottom-right, mobile bottom-center), estado local, mock responses con delay corto, integración modal; lógica memoizada con `useCallback` y delays diferenciados prod/test.
- `components/Chatbot/index.ts`: Barrel exports.
- `app/page.tsx`: Integración de `ChatbotWidget` en la home.
- Tests TDD nuevos: `chatbot-widget.spec.tsx`, `chatbot-modal.spec.tsx`, `message-bubble.spec.tsx`.

## 🎯 Criterios de Aceptación (Linear)
- Apertura chatbot desktop/mobile: ✅ botón flotante, modal responsive, historial vacío, input autofocus + placeholder.
- Envío mensaje: ✅ mensaje usuario alineado derecha, indicador "Escribiendo...", respuesta mock <5s (delay 1.2s prod, 100ms tests).
- Scroll histórico: ✅ auto-scroll al último mensaje.

## 📋 Definition of Done
- `<ChatbotWidget>` flotante responsive: ✅
- Modal desktop 400x600 / mobile fullscreen: ✅
- Input autofocus + placeholder: ✅
- Historial scroll automático: ✅ (`scrollIntoView`)
- Botón cerrar [X] + overlay: ✅
- Estado local React (`useState`): ✅
- Tests pasando: ✅ `npm test` (67/67)
- Accesibilidad: ✅ ARIA labels, role dialog, Escape cierra
- Backend: ❌ no aplica (mock responses "Próximamente...")

## 🧪 Testing
- `npm test` → **67/67** pasando.
- Cobertura de nuevos tests:
  - `chatbot-widget.spec.tsx`: posición botones, apertura/cierre, flujo mensaje + respuesta mock.
  - `chatbot-modal.spec.tsx`: alineación mensajes, scroll al último mensaje.
  - `message-bubble.spec.tsx`: estilos usuario/bot.

## ⚙️ Notas técnicas
- Delay respuesta mock: 1.2s en producción, 100ms en entorno de test (para tests rápidos).
- Z-index alto (`z-[9999]`) para botón y modal.
- Overlay clicable para cerrar en desktop/mobile; Escape también cierra.
- Timestamp relativo simple ("ahora", "hace X mins/horas").
- Linter sin warnings (deps/hooks ajustadas).

## 🚧 Pendiente / Futuro (fuera de alcance)
- Integración backend/IA (US-03-002).
- Persistencia de historial.
- Soporte Markdown avanzado en respuestas.
