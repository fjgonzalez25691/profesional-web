# FJG-44 - INFORME DE IMPLEMENTACIÓN
**Issue**: US-03-002: Backend Groq + Prompt Engineering SIN RAG  
**Fecha**: 2025-12-03  
**Sprint**: S2  
**Story Points**: 8 SP

## ✅ RESUMEN
Se implementó el backend del chatbot usando Groq (llama-3.3-70b-versatile) con prompt engineering puro y casos duros embebidos. La API `/api/chat` aplica rate limiting (10 msg/IP/h), timeout de seguridad y logging en Postgres. El widget del chatbot ahora consume la API real con fallback de error controlado.

## 📌 Cambios principales
- `app/api/chat/route.ts`: Endpoint POST que añade el system prompt, aplica rate limiting, timeout (8s prod, 200ms test), y loguea cada turno en Postgres antes de responder.
- `prompts/chatbot-system.ts`: Prompt de sistema con los casos `CASOS_MVP`, guardrails legales y CTA suave.
- `lib/groq.ts`: Cliente Groq singleton con validación de `GROQ_API_KEY`.
- `lib/rate-limit.ts`: Rate limiting 10/h usando Vercel KV y fallback en memoria, exporta disponibilidad `kvAvailable`.
- `lib/chat-logger.ts`: Inserción en tabla `chat_logs` (creación si no existe) con ip, mensaje usuario y bot.
- `components/Chatbot/ChatbotWidget.tsx`: El widget envía el historial a `/api/chat`, muestra typing y maneja fallback local en caso de error.
- Tests TDD añadidos: `__tests__/api/chat.test.ts`, `__tests__/prompts/chatbot-system.test.ts`, `__tests__/lib/rate-limit.test.ts`, `__tests__/lib/chat-logger.test.ts`.
- `.env.example`: variables de Groq, Vercel KV, Neon y app (`NEXTAUTH_*`, Calendly).
- `tsconfig.json`: incluye `vitest/globals` para typecheck; guardas de error estrictas en `app/api/chat/route.ts`.

## 🎯 Criterios de Aceptación / DoD (Linear)
- API POST `/api/chat` operativa con modelo `llama-3.3-70b-versatile`: ✅
- Prompt `prompts/chatbot-system.ts` con 5-10 casos hardcoded de FJG-40 y guardrails legales: ✅
- Timeout >8s → mensaje de error técnico (200ms en test para agilizar): ✅
- Rate limiting 10 msg/IP/h usando Vercel KV con fallback en memoria: ✅
- Logging básico a Postgres (tabla `chat_logs` con user msg + bot response): ✅
- Groq SDK + @vercel/kv instalados y validados por código: ✅
- Tests TDD cubren prompt, rate limit y fallback timeout: ✅
- Frontend conectado a la API real con manejo de error: ✅

## 🧪 Testing
- `npm test` → **74/74** pasando.
- `npm run lint` → sin errores.
- `npm run typecheck` → sin errores.

## ⚙️ Notas técnicas
- `TIMEOUT_MS` se reduce a 200ms en test para acelerar la prueba de fallback; en runtime es 8s.
- Rate limiting usa `x-forwarded-for` como IP primaria; si KV no está configurado cae a Map en memoria.
- `chat_logs` crea la tabla si no existe (id BIGSERIAL, timestamps) antes de insertar cada mensaje.
- El widget utiliza `fetch("/api/chat")` con reintento básico y CTA de error: “Disculpa, error técnico. Puedes agendar una consulta directa.”

## 🚧 Pendiente / Riesgos
- Requiere variables de entorno (`GROQ_API_KEY`, KV REST, `DATABASE_URL`) configuradas en despliegue para usar Groq, KV y Neon.
- Logging crea tabla en caliente; si se migra a migrations, retirar creación dinámica.
