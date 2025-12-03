# FJG-47: PROMPT DE IMPLEMENTACIÓN
**US-03-005: Logging Conversaciones Postgres Básico**

## 📋 CONTEXTO LINEAR VERIFICADO ✅

**Epic:** In2-03 Chatbot IA Cualificación Leads  
**Sprint:** S2 (Días 8-14)  
**Prioridad:** 🟠 Medium (2 Story Points)  
**Dependencias:** FJG-35 ✅ (Postgres), FJG-44 ✅ (API chat funcionando)

## 🎯 OBJETIVO TDD

Implementar logging básico de conversaciones del chatbot en Postgres para analytics cualitativo. Crear tabla + migration, modificar API `/api/chat` para guardar logs, y generar sessionId único persistente en frontend.

**Historia de Usuario Validada:**
> Como owner analizando conversiones  
> Quiero log conversaciones chatbot  
> Para identificar patrones de preguntas y detectar objeciones frecuentes

## 🔧 IMPLEMENTACIÓN TÉCNICA (TDD)

### 1️⃣ FASE RED - Tests Primero

#### Test 1: Migration Schema Postgres
```typescript
// __tests__/db/chatbot-logs.test.ts
describe('Chatbot Logs Schema', () => {
  it('should create chatbot_conversations table with correct schema', async () => {
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'chatbot_conversations'
    `;
    
    expect(result.rows).toContainEqual({ 
      column_name: 'id', data_type: 'uuid' 
    });
    expect(result.rows).toContainEqual({ 
      column_name: 'session_id', data_type: 'character varying' 
    });
  });

  it('should have required indexes', async () => {
    const indexes = await sql`
      SELECT indexname FROM pg_indexes 
      WHERE tablename = 'chatbot_conversations'
    `;
    
    expect(indexes.rows.map(r => r.indexname)).toContain('idx_session');
    expect(indexes.rows.map(r => r.indexname)).toContain('idx_created_at');
  });
});
```

#### Test 2: API Chat con Logging
```typescript
// __tests__/api/chat-logging.test.ts
describe('POST /api/chat - Logging', () => {
  it('should log conversation to postgres after successful response', async () => {
    const payload = {
      messages: [{ role: 'user', content: '¿Reducís costes AWS?' }],
      sessionId: 'test-session-123'
    };

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    expect(response.ok).toBe(true);
    
    // Verificar log en DB
    const logs = await sql`
      SELECT * FROM chatbot_conversations 
      WHERE session_id = 'test-session-123'
    `;
    
    expect(logs.rows).toHaveLength(1);
    expect(logs.rows[0].user_message).toBe('¿Reducís costes AWS?');
    expect(logs.rows[0].response_time_ms).toBeGreaterThan(0);
  });

  it('should log errors when groq API fails', async () => {
    // Mock groq to fail
    jest.spyOn(groq.chat.completions, 'create').mockRejectedValue(
      new Error('API Error')
    );

    const payload = {
      messages: [{ role: 'user', content: 'test' }],
      sessionId: 'error-session'
    };

    await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const logs = await sql`
      SELECT error, bot_response FROM chatbot_conversations 
      WHERE session_id = 'error-session'
    `;
    
    expect(logs.rows[0].error).toBe(true);
    expect(logs.rows[0].bot_response).toContain('Error técnico');
  });
});
```

#### Test 3: SessionId Hook Frontend
```typescript
// __tests__/hooks/useSessionId.test.ts
describe('useSessionId Hook', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should generate new sessionId if none exists', () => {
    const { result } = renderHook(() => useSessionId());
    
    expect(result.current).toMatch(/^[0-9a-f-]{36}$/); // UUID format
    expect(sessionStorage.getItem('chatbot_session_id')).toBe(result.current);
  });

  it('should reuse existing sessionId', () => {
    const existingId = 'existing-session-123';
    sessionStorage.setItem('chatbot_session_id', existingId);
    
    const { result } = renderHook(() => useSessionId());
    
    expect(result.current).toBe(existingId);
  });

  it('should persist sessionId across re-renders', () => {
    const { result, rerender } = renderHook(() => useSessionId());
    const firstId = result.current;
    
    rerender();
    
    expect(result.current).toBe(firstId);
  });
});
```

### 2️⃣ FASE GREEN - Implementación Mínima

#### Archivo 1: Migration Postgres
```sql
-- profesional-web/lib/migrations/003_chatbot_logs.sql
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  visitor_ip VARCHAR(45), -- IPv4/IPv6
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  response_time_ms INTEGER,
  model_used VARCHAR(100) DEFAULT 'llama-3.3-70b-versatile',
  error BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_session ON chatbot_conversations(session_id);
CREATE INDEX idx_created_at ON chatbot_conversations(created_at DESC);
```

#### Archivo 2: API Chat Actualizada
```typescript
// profesional-web/app/api/chat/route.ts
import { sql } from '@vercel/postgres';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();
    
    if (!sessionId || !messages?.length) {
      return Response.json(
        { error: 'SessionId y messages requeridos' }, 
        { status: 400 }
      );
    }

    const userMessage = messages[messages.length - 1].content;
    const startTime = Date.now();
    let botResponse = '';
    let hasError = false;
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Eres el asistente de Fran, experto en reducción de costes...` // System prompt existente
          },
          ...messages
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 500,
      });
      
      botResponse = completion.choices[0].message.content || 'Sin respuesta';
      
    } catch (error) {
      console.error('Error Groq API:', error);
      hasError = true;
      botResponse = 'Error técnico, intenta de nuevo...';
    } finally {
      const responseTime = Date.now() - startTime;
      const visitorIp = req.headers.get('x-forwarded-for') || 'unknown';
      
      // Log a Postgres - SIEMPRE, incluso en errores
      try {
        await sql`
          INSERT INTO chatbot_conversations 
            (session_id, visitor_ip, user_message, bot_response, response_time_ms, error)
          VALUES 
            (${sessionId}, ${visitorIp}, ${userMessage}, ${botResponse}, ${responseTime}, ${hasError})
        `;
      } catch (dbError) {
        console.error('Error logging to DB:', dbError);
      }
    }
    
    return Response.json({ 
      message: botResponse,
      sessionId 
    });
    
  } catch (error) {
    console.error('Error general API chat:', error);
    return Response.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
```

#### Archivo 3: Hook SessionId
```typescript
// profesional-web/lib/hooks/useSessionId.ts
'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useSessionId() {
  const [sessionId, setSessionId] = useState<string>('');
  
  useEffect(() => {
    // Generar sessionId si no existe en sessionStorage
    let id = sessionStorage.getItem('chatbot_session_id');
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem('chatbot_session_id', id);
    }
    setSessionId(id);
  }, []);
  
  return sessionId;
}
```

#### Archivo 4: Chatbot Widget Actualizado
```typescript
// profesional-web/components/Chatbot/ChatbotWidget.tsx (actualizar)
import { useSessionId } from '@/lib/hooks/useSessionId';

export default function ChatbotWidget() {
  const sessionId = useSessionId();
  // ... resto del código existente

  const sendMessage = async (content: string) => {
    if (!sessionId) return; // Esperar sessionId

    const newMessage = { role: 'user' as const, content };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, newMessage],
          sessionId // ✅ Incluir sessionId
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };
}
```

### 3️⃣ FASE REFACTOR - Optimización

#### Mejoras Opcionales (si tiempo permite):
1. **IP Anonimization GDPR**: Últimos 2 octetos a 0
2. **Rate Limiting**: Máximo 20 mensajes por sessionId/hora
3. **Cleanup Task**: Borrar logs > 30 días
4. **Validation**: Sanitizar user_message (max 1000 chars)

## 🧪 CRITERIOS DE ACEPTACIÓN (GHERKIN VERIFICADOS)

```gherkin
Feature: Logging conversaciones chatbot
  
  Scenario: Primera conversación nueva
    Given usuario nuevo abre chatbot por primera vez
    When envía mensaje "¿Reducís costes AWS?"
    Then se genera sessionId único formato UUID
    And sessionId se guarda en sessionStorage
    And mensaje + respuesta se guardan en tabla chatbot_conversations
    And log incluye response_time_ms > 0
    And error = false

  Scenario: Conversación continuada mismo usuario
    Given usuario con sessionId existente en sessionStorage
    When envía segundo mensaje "¿Qué tipos de proyectos hacéis?"
    Then usa mismo sessionId anterior
    And se crea nuevo registro en chatbot_conversations
    And session_id es consistente entre mensajes

  Scenario: Error API Groq
    Given API Groq está caída o retorna error
    When usuario envía mensaje
    Then log se guarda con error = true
    And bot_response contiene "Error técnico, intenta de nuevo..."
    And response_time_ms registra tiempo hasta timeout
```

## ✅ DEFINITION OF DONE VERIFICADA

- [ ] Tabla `chatbot_conversations` creada en Postgres
- [ ] Migration `003_chatbot_logs.sql` ejecutada en entorno local y producción
- [ ] API `/api/chat` modificada para guardar logs tras cada mensaje
- [ ] Frontend genera sessionId único (formato UUID v4)
- [ ] sessionId persiste en sessionStorage durante sesión browser
- [ ] Logs incluyen: user_message, bot_response, response_time_ms, error flag
- [ ] Test unitario confirma log insertado correctamente tras mensaje
- [ ] Test confirma sessionId persistencia y reutilización
- [ ] Test confirma logging en caso de error API
- [ ] **NO dashboard admin** (fuera de scope Sprint 2)
- [ ] Opcional: IP anonimizada GDPR (últimos 2 octetos)

## 🔍 DEPENDENCIAS Y VALIDACIONES

**Dependencias Verificadas:**
- ✅ FJG-35: Postgres + Neon setup funcionando
- ✅ FJG-44: API `/api/chat` operativa con Groq

**Archivos a Modificar:**
- `profesional-web/lib/migrations/003_chatbot_logs.sql` (nuevo)
- `profesional-web/app/api/chat/route.ts` (modificar logging)
- `profesional-web/lib/hooks/useSessionId.ts` (nuevo)
- `profesional-web/components/Chatbot/ChatbotWidget.tsx` (actualizar)
- `profesional-web/package.json` (añadir uuid dependency)

**Tests a Crear:**
- `__tests__/db/chatbot-logs.test.ts`
- `__tests__/api/chat-logging.test.ts` 
- `__tests__/hooks/useSessionId.test.ts`

## ⚠️ NOTAS IMPORTANTES

1. **Prioridad Analytics:** Este logging es para Post-MVP, no para funcionalidad crítica
2. **Privacidad:** Guardar solo datos necesarios, considerar anonimización IP
3. **Performance:** Logging NO debe afectar velocidad respuesta chatbot
4. **Error Handling:** Si falla el log, chatbot debe seguir funcionando
5. **Scope Sprint 2:** Solo logging básico, dashboard admin para Sprint futuro

---
**Generado por Agent Manager | Verificado contra Linear FJG-47 | 3 diciembre 2025**