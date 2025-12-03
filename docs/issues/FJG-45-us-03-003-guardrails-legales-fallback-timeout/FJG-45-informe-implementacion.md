# FJG-45 - INFORME DE IMPLEMENTACIÓN
**Issue**: US-03-003: Guardrails Legales + Fallback Timeout  
**Fecha**: 2025-12-03  
**Sprint**: S2  
**Story Points**: 2 SP

## ✅ RESUMEN
Se añadieron guardrails legales y de lenguaje al chatbot: validación de respuestas para frases absolutas, footer legal siempre visible en el modal y mensaje de fallback humano para timeouts. La API ahora filtra respuestas con disclaimer automático y el frontend muestra el aviso legal y un CTA a diagnóstico de 30 minutos.

## 📌 Cambios principales
- `lib/response-validator.ts`: Detecta frases prohibidas (“garantizo”, “100% seguro”, etc.) y añade disclaimer orientativo con CTA a diagnóstico.
- `app/api/chat/route.ts`: Aplica `validateResponse` antes de responder y registrar logs; timeout fallback actualizado (“Reintenta” + sesión 30 min).
- `components/Chatbot/LegalFooter.tsx`: Footer legal con copy orientativo y enlace a Calendly (configurable por env).
- `components/Chatbot/ChatbotModal.tsx`: Integra el footer para que sea visible siempre que el chatbot está abierto.
- `components/Chatbot/ChatbotWidget.tsx`: Fallback de error alineado con el mensaje humano del backend.
- Tests nuevos: `__tests__/lib/response-validator.test.ts`, `__tests__/components/chatbot-legal-footer.spec.tsx`, nuevo caso en `__tests__/api/chat.test.ts` para disclaimer.

## 🎯 Criterios de Aceptación / DoD
- Footer siempre visible con aviso y mención a diagnóstico 30 min: ✅
- Validación de lenguaje absoluto + disclaimer automático: ✅
- Timeout fallback (>8s) con mensaje humano y CTA: ✅ (API y UI alineados)
- Coherencia con FJG-44 mantenida (prompt no modificado en esta tarea, sólo guardrails adicionales): ✅
- Tests básicos de guardrails y timeout: ✅

## 🧪 Testing
- `npm run lint` → ✅
- `npm run typecheck` → ✅
- `npm test` → ✅ (78 tests)

## ⚙️ Notas
- El disclaimer se añade en servidor antes de loguear y responder, evitando exponer frases absolutas.
- `LegalFooter` usa `NEXT_PUBLIC_CALENDLY_URL` si está definido; fallback a calendly.com.
- La validación usa expresiones regulares sencillas (sin moderación avanzada).

## 🚧 Pendiente / Riesgos
- Copiar el mensaje de fallback/aviso a otras superficies (si se añaden nuevos puntos de entrada).
- Si cambian las frases prohibidas, actualizar `PROHIBITED_PATTERNS` y los tests asociados.
