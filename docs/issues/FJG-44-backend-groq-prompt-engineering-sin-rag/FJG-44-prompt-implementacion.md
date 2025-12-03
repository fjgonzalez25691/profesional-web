# FJG-44 - PROMPT IMPLEMENTACIÓN
**Issue**: US-03-002: Backend Groq + Prompt Engineering SIN RAG
**Agent Role**: Developer
**Sprint**: S2 (Cycle 2cce504b-650a-4498-bde9-35d43489c6f0)
**Story Points**: 8 SP

## VERIFICACIÓN LINEAR OBLIGATORIA
**ANTES DE PROCEDER**: Has verificado la issue FJG-44 en Linear y confirmas que los criterios de aceptación y DoD coinciden exactamente con este prompt.

**Issue verificada en Linear**: US-03-002: Backend Groq + Prompt Engineering SIN RAG
**Status**: In Progress
**Scope alineado**: Prompt Engineering hardcoded (NO RAG Pinecone, NO embeddings)

## MISIÓN DEVELOPER TDD

Implementar **backend chatbot con Groq** usando prompt engineering puro siguiendo metodología TDD estricta.

### ALCANCE ESPECÍFICO (según Linear)
1. **API Route**: POST `/api/chat` con Groq SDK
2. **Model**: llama-3.3-70b-versatile (128K context)
3. **System Prompt**: Hardcoded con 5-10 casos reales de FJG-40
4. **Rate Limiting**: 10 msg/IP/hora (Vercel KV)
5. **Logging básico**: Postgres user msg + bot response
6. **Timeout fallback**: >8s → error técnico
7. **Coste**: <5€/mes Groq free tier

### FUERA DE ALCANCE
- RAG Pinecone (over-engineering)
- Vector embeddings
- Persistent conversation memory
- Advanced prompt templates
- Múltiples modelos A/B testing

## PLAN TDD IMPLEMENTACIÓN

### FASE 1: Tests Setup + Groq Integration
```bash
# 1. RED: Test API route /api/chat
touch __tests__/api/chat.test.ts
# 2. GREEN: Implementar app/api/chat/route.ts básico
# 3. REFACTOR: Clean error handling

# Test Cases:
- POST /api/chat retorna respuesta válida
- Timeout >8s retorna error fallback
- Rate limiting funciona (10 msg/IP/hora)
- Model llama-3.3-70b-versatile usado
```

### FASE 2: System Prompt + Cases Integration
```bash
# 1. RED: Test system prompt incluye casos
touch __tests__/prompts/chatbot-system.test.ts
# 2. GREEN: Implementar prompts/chatbot-system.ts
# 3. RED: Test casos importados desde data/cases.ts
# 4. GREEN: Integrar casos FJG-40 en system prompt
# 5. REFACTOR: DRY prompt construction

# Test Cases System Prompt:
- System prompt contiene casos reales FJG-40
- Incluye guardrails legales (no garantías)
- Formato 150 palabras máximo
- CTA suave incluido
- Tono profesional P&L
```

### FASE 3: Rate Limiting + Logging
```bash
# 1. RED: Test rate limiting 10 msg/IP/hora
touch __tests__/middleware/rate-limit.test.ts
# 2. GREEN: Implementar rate limiting Vercel KV
# 3. RED: Test logging Postgres
touch __tests__/logging/chat-logger.test.ts
# 4. GREEN: Implementar logging básico
# 5. REFACTOR: Clean middleware integration

# Test Cases Rate Limiting:
- IP puede enviar 10 mensajes/hora
- IP bloqueado después de 10 mensajes
- Rate limit reset después 1 hora
- Logging: user message + bot response guardado
- Error handling si Postgres falla
```

### FASE 4: Integration + Frontend Connection
```bash
# 1. RED: Test integración frontend chatbot
# 2. GREEN: Conectar ChatbotModal con API /api/chat
# 3. RED: Test error handling frontend
# 4. GREEN: Implementar loading states + error UI
# 5. REFACTOR: Performance optimizations

# Test Cases Frontend:
- ChatbotModal envía mensajes a API
- Loading state durante request
- Error state si API falla
- Mock responses reemplazados por API real
- Typing indicator timing realista
```

## ARQUITECTURA TÉCNICA

### Estructura Archivos
```
app/
├── api/
│   └── chat/
│       └── route.ts              # API route Groq (NEW)

prompts/
└── chatbot-system.ts             # System prompt + casos (NEW)

lib/
├── groq.ts                       # Groq client config (NEW)
├── rate-limit.ts                 # Vercel KV rate limiting (NEW)
└── chat-logger.ts                # Postgres logging (NEW)

__tests__/
├── api/
│   └── chat.test.ts              # NUEVO
├── prompts/
│   └── chatbot-system.test.ts    # NUEVO
├── middleware/
│   └── rate-limit.test.ts        # NUEVO
└── logging/
    └── chat-logger.test.ts       # NUEVO

components/Chatbot/
└── ChatbotModal.tsx              # MODIFICAR: conectar API real
```

### API Route Implementation
```typescript
// app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { Groq } from 'groq-sdk';
import { CHATBOT_SYSTEM_PROMPT } from '@/prompts/chatbot-system';
import { checkRateLimit } from '@/lib/rate-limit';
import { logChatMessage } from '@/lib/chat-logger';

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || 'unknown';
    
    // Rate limiting
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return Response.json(
        { error: 'Rate limit exceeded. Try again in 1 hour.' }, 
        { status: 429 }
      );
    }

    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1]?.content;

    // Groq completion with timeout
    const completion = await Promise.race([
      groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 8000)
      )
    ]);

    const botResponse = completion.choices[0].message.content;

    // Log conversation
    await logChatMessage(ip, userMessage, botResponse);

    return Response.json({ message: botResponse });

  } catch (error) {
    if (error.message === 'Timeout') {
      return Response.json({
        message: 'Disculpa, error técnico. Puedes agendar una consulta directamente.'
      });
    }
    
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
```

### System Prompt Structure
```typescript
// prompts/chatbot-system.ts
import { CASOS_MVP } from "@/data/cases";

const BUSINESS_NAME =
  process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Francisco Javier González Aparicio";

export const CHATBOT_SYSTEM_PROMPT = `
Eres el asistente IA de ${BUSINESS_NAME}, que ayuda a las empresas a mejorar sus números (ingresos, costes y beneficio) utilizando soluciones Cloud e Inteligencia Artificial.

CONTEXTO:
${BUSINESS_NAME} no es un técnico que aprendió negocio: es un empresario que domina tecnología y traduce problemas reales de dinero y operación (costes altos, mermas, tareas manuales, errores) en soluciones Cloud/IA robustas, escalables y con un retorno claro.
Ayuda a empresas a:
1. Diagnosticar problemas de negocio que puedan resolverse con Cloud, IA o automatización.
2. Diseñar la arquitectura de la solución (Cloud, IA, procesos, automatización).
3. Gestionar la implementación de principio a fin.

CASOS REALES (úsalos en respuestas):
${JSON.stringify(CASOS_MVP, null, 2)}

CÓMO USAR LOS CASOS:
- No exageres ni des la impresión de tener cientos de proyectos; habla de "otras empresas" o "otros clientes" de forma natural.
- Usa 1–2 casos por respuesta como máximo y solo cuando ayuden a que la persona se reconozca.
- Explica los casos con números sencillos: ahorros aproximados, horas liberadas, mejora de margen o reducción de errores.

GUARDRAILS (NIVEL LINGÜÍSTICO — SIN PISAR FJG-45):
- Habla siempre de estimaciones orientativas y experiencia previa, nunca de garantías.
- No uses lenguaje absoluto como "te aseguro", "100%", "garantizado".
- Explica que el diagnóstico real requiere una reunión de 30 minutos.
- Si el usuario intenta obtener una garantía, aclara que los resultados dependen del caso concreto.
- Cuando el usuario encaje con el perfil (empresa con dolores operativos, costes cloud, procesos manuales), puedes sugerir un diagnóstico.

SELECCIÓN DE CASOS:
- Si el usuario pregunta por AWS u optimización cloud, prioriza ejemplos cloud.
- Si pregunta por procesos manuales, automatización, OCR o eficiencia operativa, prioriza ejemplos de automatización.
- Mantén 1–2 casos por respuesta, seleccionando los más parecidos al sector o problema del usuario.

COMPORTAMIENTO CONVERSACIONAL:
- Evita empezar con "Sí, puedo ayudarte". Prefiere:
  - "Probablemente haya margen de mejora en tu caso..."
  - "En empresas similares hemos encontrado..."
  - "Parece un caso donde podríamos explorar opciones…"
- Si el usuario aporta información vaga, haz 1–2 preguntas de clarificación antes del CTA.
- Explica valor en términos de negocio que cualquiera entienda:
  - dinero que se ahorra,
  - menos horas de trabajo manual,
  - menos errores,
  - más beneficio a final de mes.

FORMATO RESPUESTAS:
- Máximo 3 párrafos (~150 palabras).
- Tono centrado en negocio y resultados (facturación, costes, beneficio), sin abusar de jerga como "P&L" salvo que el usuario la use primero.
- Usa lo técnico solo si el usuario lo pide o demuestra entenderlo.
- Cierra con CTA suave, por ejemplo:
  "Si quieres, podemos revisar tu caso en una sesión de 30 minutos y ver si tiene sentido plantear una solución."
`;
```

## DEFINITION OF DONE (Linear)

- [ ] API POST `/api/chat` funcional
- [ ] Groq SDK instalado (`npm i groq-sdk`)
- [ ] Model: `llama-3.3-70b-versatile`
- [ ] System prompt archivo `prompts/chatbot-system.ts` alineado con posicionamiento empresarial
- [ ] Casos hardcoded importados desde `data/cases.ts` (FJG-40)
- [ ] Timeout fallback >8s coordinated con FJG-45
- [ ] Rate limiting: 10 msg/IP/hora (Vercel KV)
- [ ] Logging básico coordinado con FJG-47
- [ ] Tests TDD: verifican tono negocio y guardrails
- [ ] Variable entorno `GROQ_API_KEY` configurada local y Vercel
- [ ] Prompt engineering puro (NO RAG implementation)

## VARIABLES ENTORNO

```bash
# .env.local (requeridas)
GROQ_API_KEY=gsk_xxxxxxxxxxxx          # Groq API key
KV_URL=kv_xxxxxxxxxxxx                 # Vercel KV para rate limiting
KV_REST_API_URL=https://xxx            # Vercel KV REST
KV_REST_API_TOKEN=xxx                  # Vercel KV token
DATABASE_URL=postgresql://xxx           # Neon Postgres (ya existe)
```

## COMANDOS DESARROLLO

```bash
# Instalar dependencias
npm install groq-sdk @vercel/kv

# Tests en modo watch
npm run test -- --watch chat groq rate-limit

# Test API local
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Reducís costes AWS?"}]}'

# Verificar build
npm run build

# Type checking
npm run type-check
```

## OUTPUT ESPERADO

Al completar implementación TDD:
1. **Tests verdes**: Todos los tests backend pasando
2. **API funcional**: /api/chat responde con casos contextualizados
3. **Rate limiting**: 10 msg/IP/hora funcionando
4. **Logging**: Conversaciones guardadas Postgres
5. **Frontend integrado**: Chatbot UI conectado API real
6. **Informe**: FJG-44-informe-implementacion.md con resultados y métricas

---

**RECUERDA**: Metodología anti-camello. Backend mínimo viable pero **altamente efectivo**. Prompt engineering puro, NO over-engineering RAG para MVP.