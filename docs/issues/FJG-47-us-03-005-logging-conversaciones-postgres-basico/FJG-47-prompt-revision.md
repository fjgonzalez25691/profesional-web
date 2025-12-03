# FJG-47: PROMPT DE REVISIÓN
**US-03-005: Logging Conversaciones Postgres Básico**

## 📋 CONTEXTO LINEAR VERIFICADO ✅

**Epic:** In2-03 Chatbot IA Cualificación Leads  
**Sprint:** S2 (Días 8-14)  
**Prioridad:** 🟠 Medium (2 Story Points)  
**Issue Original:** https://linear.app/fjgaparicio/issue/FJG-47/us-03-005-logging-conversaciones-postgres-basico

## 🔍 MISIÓN DEL AGENT REVIEWER

**ROL DE SOLO LECTURA** - Verificar calidad, seguridad y cumplimiento exacto de especificaciones Linear **SIN MODIFICAR CÓDIGO**.

## 📊 CRITERIOS DE AUDITORÍA TÉCNICA

### 1️⃣ VERIFICACIÓN SCHEMA POSTGRES

**Checklist Tabla `chatbot_conversations`:**
- [ ] Estructura exacta según especificación Linear
- [ ] Campo `id` UUID con DEFAULT gen_random_uuid()
- [ ] Campo `session_id` VARCHAR(255) NOT NULL
- [ ] Campo `visitor_ip` VARCHAR(45) para IPv4/IPv6
- [ ] Campo `user_message` TEXT NOT NULL
- [ ] Campo `bot_response` TEXT NOT NULL  
- [ ] Campo `response_time_ms` INTEGER
- [ ] Campo `model_used` VARCHAR(100) DEFAULT 'llama-3.3-70b-versatile'
- [ ] Campo `error` BOOLEAN DEFAULT false
- [ ] Campo `created_at` TIMESTAMP DEFAULT NOW()

**Checklist Indexes:**
- [ ] INDEX `idx_session` en session_id
- [ ] INDEX `idx_created_at` en created_at DESC
- [ ] Migration `003_chatbot_logs.sql` correcta

### 2️⃣ VERIFICACIÓN API `/api/chat` LOGGING

**Checklist Funcionalidad:**
- [ ] Import correcto `@vercel/postgres`
- [ ] Extracción `sessionId` del request body
- [ ] Validación sessionId requerido
- [ ] Medición `response_time_ms` con Date.now()
- [ ] Captura `visitor_ip` desde headers
- [ ] Try-catch para errores Groq API
- [ ] Insert Postgres en bloque `finally` (siempre ejecuta)
- [ ] Log tanto éxito como error (hasError flag)
- [ ] Error handling sin afectar respuesta usuario

**Checklist Seguridad:**
- [ ] Sanitización inputs (user_message, sessionId)
- [ ] Manejo seguro IP headers (x-forwarded-for)
- [ ] No exposición secrets en logs
- [ ] Error messages no revelan internals
- [ ] Rate limiting considerado (opcional S2)

### 3️⃣ VERIFICACIÓN FRONTEND SessionId

**Checklist Hook `useSessionId`:**
- [ ] Uso correcto useState + useEffect
- [ ] Generación UUID con `uuidv4()`
- [ ] Persistencia en `sessionStorage`
- [ ] Reutilización sessionId existente
- [ ] Formato UUID válido
- [ ] Hook exportado correctamente

**Checklist Integración ChatbotWidget:**
- [ ] Import hook useSessionId
- [ ] SessionId incluido en fetch `/api/chat`
- [ ] Validación sessionId antes envío
- [ ] Manejo estado carga sessionId
- [ ] Sin romper funcionalidad existente

### 4️⃣ VERIFICACIÓN TESTING TDD

**Checklist Tests Obligatorios:**
- [ ] Test schema Postgres (table + indexes)
- [ ] Test API logging exitoso (insert DB)
- [ ] Test API logging en error
- [ ] Test sessionId generación única
- [ ] Test sessionId persistencia
- [ ] Mocks apropiados (groq, sessionStorage)
- [ ] Assertions específicas y completas
- [ ] Tests pasan 100% (npm run test)

### 5️⃣ VERIFICACIÓN CRITERIOS GHERKIN

**Scenario: Primera conversación**
- [ ] SessionId único generado
- [ ] SessionId guardado sessionStorage
- [ ] Mensaje + respuesta → Postgres
- [ ] response_time_ms registrado

**Scenario: Conversación continuada**  
- [ ] Mismo sessionId reutilizado
- [ ] Nuevo registro cada mensaje
- [ ] Session_id consistente

**Scenario: Error API**
- [ ] Log con error=true
- [ ] bot_response fallback apropiado
- [ ] Tiempo hasta timeout medido

### 6️⃣ VERIFICACIÓN DEFINITION OF DONE

**Checklist DoD Linear:**
- [ ] Tabla `chatbot_conversations` creada
- [ ] Migration ejecutada producción
- [ ] API guarda logs Postgres
- [ ] Frontend genera sessionId (UUID)
- [ ] SessionId persiste sessionStorage  
- [ ] Logs incluyen todos campos requeridos
- [ ] Test log insertado correctamente
- [ ] **NO dashboard admin** (fuera scope)
- [ ] IP anonimizada opcional implementada

## 🔒 VERIFICACIÓN SEGURIDAD Y PRIVACIDAD

**Checklist GDPR/Privacidad:**
- [ ] Solo datos necesarios loggeados
- [ ] IP anonimización implementada (opcional)
- [ ] Sin PII sensible en logs
- [ ] Retention policy considerada
- [ ] Consent implícito uso chatbot

**Checklist Seguridad Código:**
- [ ] SQL injection protegida (prepared statements)
- [ ] Input validation user_message
- [ ] SessionId validation formato UUID
- [ ] Error messages sin data leakage
- [ ] Headers sanitization IP

## ⚡ VERIFICACIÓN PERFORMANCE

**Checklist Rendimiento:**
- [ ] Logging NO bloquea respuesta usuario
- [ ] Insert DB asíncrono/background
- [ ] Timeout handling apropiado
- [ ] Indexes optimizados queries
- [ ] Memory leaks prevenidos sessionStorage

## 🧪 SCRIPT DE VERIFICACIÓN AUTOMÁTICA

```typescript
// Script para Agent Reviewer - Solo lectura
describe('FJG-47 Compliance Check', () => {
  it('should verify all components implemented correctly', async () => {
    // 1. Verificar schema existe
    const tableExists = await checkTableSchema('chatbot_conversations');
    expect(tableExists).toBe(true);
    
    // 2. Verificar API response estructura
    const apiResponse = await testChatAPI();
    expect(apiResponse.status).toBe(200);
    
    // 3. Verificar sessionId frontend
    const sessionId = await testSessionGeneration();
    expect(sessionId).toMatch(/^[0-9a-f-]{36}$/);
    
    // 4. Verificar logging funcionando
    const logCount = await countLogsInDB();
    expect(logCount).toBeGreaterThan(0);
  });
});
```

## 📝 FORMATO INFORME REVISIÓN

**Template Respuesta Agent Reviewer:**

```markdown
## 🔍 INFORME REVISIÓN FJG-47

### ✅ CUMPLIMIENTO ESPECIFICACIÓN LINEAR
- **Schema Postgres**: [✅/⚠️/❌] + detalles
- **API Logging**: [✅/⚠️/❌] + detalles  
- **Frontend SessionId**: [✅/⚠️/❌] + detalles
- **Testing TDD**: [✅/⚠️/❌] + detalles

### 🔒 SEGURIDAD Y PRIVACIDAD
- **GDPR Compliance**: [✅/⚠️/❌] + notas
- **Input Validation**: [✅/⚠️/❌] + notas
- **Error Handling**: [✅/⚠️/❌] + notas

### ⚡ PERFORMANCE Y CALIDAD
- **Logging Performance**: [✅/⚠️/❌] + métricas
- **Code Quality**: [✅/⚠️/❌] + observaciones

### 🎯 VEREDICTO FINAL
**[✅ APROBADO / ⚠️ APROBADO CON OBSERVACIONES / ❌ RECHAZADO]**

**Justificación:** [Explicación técnica del veredicto]

**Observaciones Críticas:** [Solo si ⚠️ o ❌]
1. [Detalle específico issue]
2. [Detalle específico issue]

**Acción Requerida:** [Solo si ❌]
- [Acción específica para Developer]
```

## ⚠️ REGLAS ESTRICTAS REVIEWER

1. **SOLO LECTURA**: NO modificar código bajo ninguna circunstancia
2. **NO SUGERIR FIXES**: Solo señalar errores específicos
3. **VERIFICACIÓN DUAL**: Linear + código implementado
4. **RECHAZO SI**: Discrepancia crítica con especificación
5. **APROBACIÓN SI**: 100% conformidad CA + DoD

---
**Generado por Agent Manager | Prompt Revisión FJG-47 | 3 diciembre 2025**