# FJG-44 - PROMPT REVISIÓN
**Issue**: US-03-002: Backend Groq + Prompt Engineering SIN RAG
**Agent Role**: Reviewer  
**Sprint**: S2 (Cycle 2cce504b-650a-4498-bde9-35d43489c6f0)
**Story Points**: 8 SP

## VERIFICACIÓN LINEAR OBLIGATORIA

**ANTES DE REVISAR**: Verificar que la implementación cumple exactamente con los criterios de aceptación y DoD de Linear FJG-44.

**Issue Linear verificada**: US-03-002: Backend Groq + Prompt Engineering SIN RAG
**Scope alineado**: Solo prompt engineering hardcoded (NO RAG, NO embeddings)

## MISIÓN REVIEWER

Auditar implementación TDD de backend chatbot con Groq, verificando:
1. **Cumplimiento Linear**: CA + DoD exactos
2. **Anti-camello**: Prompt engineering puro, NO over-engineering
3. **Calidad**: Tests pasando, código mantenible
4. **Coste**: <5€/mes según especificado

## CHECKLIST FUNCIONAL

### Verificación Criterios Aceptación (Linear)
```
□ API POST /api/chat funcional con respuestas contextualizadas
□ Model llama-3.3-70b-versatile usado correctamente
□ System prompt alineado con posicionamiento empresarial actual
□ Casos hardcoded importados desde data/cases.ts (FJG-40)
□ Timeout fallback >8s coordinated con FJG-45
□ Rate limiting 10 msg/IP/hora implementado (Vercel KV)
□ Logging básico coordinado con FJG-47
□ Tests verifican tono negocio y guardrails
□ Variable GROQ_API_KEY configurada local y Vercel
```

### Verificación Definition of Done (Linear)
```
□ Groq SDK instalado correctamente
□ System prompt archivo prompts/chatbot-system.ts existe
□ Casos hardcoded importados desde data/cases.ts (FJG-40)
□ Rate limiting Vercel KV configurado
□ Tests TDD: respuesta contiene casos, timeout <8s
□ Variable entorno GROQ_API_KEY configurada
□ Prompt engineering puro (NO RAG implementation)
```

## CHECKLIST ANTI-CAMELLO

### Verificación Simplicidad
```
□ NO implementa RAG Pinecone (over-engineering detectado)
□ NO usa vector embeddings o similarity search
□ NO persistent conversation memory compleja
□ NO múltiples modelos A/B testing
□ System prompt es hardcoded simple con casos JSON
□ Arquitectura mínima viable pero funcional
```

### Decisión Técnica Correcta
```
□ Prompt engineering chosen over RAG (cost: 0€ vs 20€/mes)
□ Llama 3.3 128K context suficiente para casos hardcoded
□ Mantenimiento 0 horas vs 2h/mes RAG
□ Story Points: 8 SP vs 13 SP RAG completo
□ Justificación anti-camello documentada
```

## CHECKLIST TÉCNICO

### Tests & Cobertura
```
□ __tests__/api/chat.test.ts: API route functionality
□ __tests__/prompts/chatbot-system.test.ts: System prompt validation
□ __tests__/middleware/rate-limit.test.ts: Rate limiting logic
□ __tests__/logging/chat-logger.test.ts: Postgres logging
□ npm run test pasa 100% sin errores
□ Cobertura tests ≥90% archivos nuevos backend
```

### API Implementation
```
□ POST /api/chat acepta messages array
□ Response format: { message: string } consistent
□ Error handling: timeout, rate limit, server errors
□ HTTP status codes correctos (200, 429, 500)
□ TypeScript strict mode sin errores
□ Groq client configurado correctamente
```

### Rate Limiting & Security
```
□ Vercel KV integration functional
□ 10 messages per IP per hour enforced
□ Rate limit reset after 1 hour verified
□ IP extraction correcta from NextRequest
□ Security: no API key leakage en logs
□ Error messages no reveal internal details
```

## CHECKLIST PROMPT ENGINEERING

### System Prompt Quality
```
□ Usa variable BUSINESS_NAME correctamente
□ Posicionamiento "empresario que domina tecnología" (no técnico que aprendió negocio)
□ Enfoque mejora números negocio (ingresos, costes, beneficio)
□ Casos reales JSON integrados desde @/data/cases
□ Guardrails sin lenguaje absoluto (sin "garantizo", "100%", "te aseguro")
□ Comportamiento conversacional natural (evita "Sí, puedo ayudarte")
□ Selección inteligente casos según contexto usuario
□ CTA suave: "revisar tu caso en una sesión de 30 minutos"
□ Tono centrado negocio, técnico solo si usuario lo pide
□ Formato respuesta: 3 párrafos (~150 palabras)
```

### Cases Integration & Business Positioning
```
□ Importa correctamente desde data/cases.ts
□ Selección inteligente casos según contexto usuario
□ Evita exagerar cantidad proyectos ("otras empresas" natural)
□ Máximo 1-2 casos por respuesta cuando ayuden
□ Explica números sencillos: ahorros, horas liberadas, errores
□ Posicionamiento "empresario + tecnología" vs "técnico + negocio"
□ Tono centrado resultados financieros (no jerga P&L excesiva)
```

## CHECKLIST LOGGING & MONITORING

### Postgres Logging
```
□ Schema correcto: ip, user_message, bot_response, timestamp
□ Connection usa DATABASE_URL existente (Neon)
□ Error handling si Postgres unavailable
□ No PII logging (solo IP genérico)
□ Log retention considera GDPR
```

### Performance & Cost Monitoring
```
□ Groq API calls monitoreadas
□ Response time <8s enforced
□ Cost projection <5€/mes validada
□ Memory usage reasonable (<100MB)
□ No memory leaks en API routes
```

## CHECKLIST FRONTEND INTEGRATION

### ChatbotModal Connection
```
□ Mock responses reemplazadas por API real
□ Loading states implementados
□ Error handling UI para timeout/rate limit
□ Typing indicator timing realistic
□ No breaking changes en UI existing
```

### Error Handling UX
```
□ Rate limit message user-friendly
□ Timeout fallback message appropriate
□ Network error handling graceful
□ Retry mechanism considerar
```

## RED FLAGS (Rechazar implementación)

### Bloqueantes Absolutos
```
□ RAG implementation detectada (violación scope)
□ Tests no pasan o errores críticos
□ API no responde o respuestas incorrectas
□ Rate limiting no funciona
□ Coste >5€/mes proyectado
□ System prompt no incluye casos FJG-40
□ Build falla o errores TypeScript críticos
```

### Concerns Mayores  
```
□ Over-engineering detectado (embeddings, vector DB)
□ Performance >8s timeout no manejado
□ Logging no funcional o excesivo
□ Security issues (API key exposure)
□ Frontend integration breaking existing UX
□ Prompt engineering quality pobre
```

## TEMPLATE INFORME REVISIÓN

```markdown
# FJG-44 - INFORME REVISIÓN

## Veredicto: [Aprobado | Aprobado con observaciones | Rechazado]

### Cumplimiento Linear
- Criterios Aceptación: [✓/✗]
- Definition of Done: [✓/✗]

### Anti-camello Verification
- Prompt engineering puro: [✓/✗]
- NO RAG over-engineering: [✓/✗]
- Coste <5€/mes: [✓/✗]

### Calidad Técnica
- Tests pasando: [✓/✗] 
- API funcional: [✓/✗]
- Rate limiting: [✓/✗]
- Logging: [✓/✗]

### Prompt Engineering Quality
- System prompt contextual: [✓/✗]
- Casos FJG-40 integrados: [✓/✗]
- Guardrails legales: [✓/✗]

### Frontend Integration
- ChatbotModal conectado: [✓/✗]
- Error handling: [✓/✗]
- UX preserved: [✓/✗]

### Issues Encontradas
[Lista específica issues y severidad]

### Observaciones
[Feedback prompt engineering y arquitectura]

### Next Steps
[Si rejected: qué debe corregir Developer]
[Si approved: ready for production deployment]
```

---

**ROL RESTRICTION**: Como Reviewer, NO modificar código. Solo auditar, señalar problemas, y rechazar/aprobar. Developer corrige issues reportadas.