# FJG-50 PROMPT REVISIÓN - Agent Reviewer

## VERIFICACIÓN DUAL OBLIGATORIA
**PRIMARIO:** Leer issue Linear FJG-50 original con `mcp_linear_get_issue`
**SECUNDARIO:** Leer código implementado y este prompt
**CONFLICTOS:** Si hay discrepancias Linear vs implementación, incluir en informe

## CONTEXTO REVISIÓN
**Issue**: FJG-50 - US-04-003: Secuencia Nurturing 2 Emails Automáticos
**Prioridad**: 🟠 High (2)
**Story Points**: 3 SP
**Dependencies**: FJG-49 (completado)

## CHECKLIST REVISIÓN TÉCNICA

### 1. CUMPLIMIENTO DEFINITION OF DONE (Linear)
- [ ] Migration `004_nurturing.sql` ejecutada y funcional
- [ ] Cron configurado Vercel (10 AM diario) en `vercel.json`
- [ ] API `/api/cron/nurturing` responde correctamente
- [ ] Templates `nurturing-day1.html`, `nurturing-day3.html` creados
- [ ] Función `sendNurturingEmail()` reutiliza Resend (no nueva librería)
- [ ] Lógica: skip correctamente si `calendly_booked = true`
- [ ] Link desuscribir funcional en email día 3
- [ ] Tests comprueban cron envía emails correctos
- [ ] Límite 50 emails/ejecución implementado
- [ ] Variable `CRON_SECRET` configurada en .env

### 2. CRITERIOS ACEPTACIÓN GHERKIN (Linear)
**Verificar implementación coincide con:**
- Email Día 1: lead ROI +24h, no agendó → email "¿Viste ahorro?" → stage=1
- Email Día 3: stage=1 +48h, no agendó → email "Última oportunidad" → stage=2  
- Lead agendó: NO más emails nurturing independiente del stage

### 3. SEGURIDAD Y CREDENCIALES
- [ ] `CRON_SECRET` usado para autorización endpoint
- [ ] No exposición credenciales en logs
- [ ] Variables ambiente correctamente configuradas
- [ ] Rate limiting: máximo 50 emails/batch
- [ ] Headers autorización verificados en cron endpoint

### 4. ARQUITECTURA Y NAVAJA DE OCKHAM
- [ ] NO nuevas librerías innecesarias (reutiliza Resend FJG-49)
- [ ] NO over-engineering en lógica temporal
- [ ] PostgreSQL queries directas (NO ORM adicional si no existía)
- [ ] Templates reutilizan estructura existente
- [ ] NO servicios externos scheduling (solo Vercel cron)

### 5. CALIDAD CÓDIGO
- [ ] Tests unitarios cubren casos edge
- [ ] Tests E2E verifican flujo completo
- [ ] Manejo errores en cron (fallos envío email)
- [ ] Logs apropiados para debugging
- [ ] TypeScript types correctos

### 6. BASE DE DATOS
- [ ] Migration correcta: `nurturing_stage INTEGER DEFAULT 0`
- [ ] Migration correcta: `last_email_sent_at TIMESTAMP`
- [ ] Queries optimizadas con LIMIT 50
- [ ] Índices necesarios considerados
- [ ] Transacciones para atomicidad updates

### 7. TEMPLATES EMAIL
- [ ] Variables Handlebars: `{{name}}`, `{{savingsAnnual}}`, `{{paybackMonths}}`
- [ ] `{{calendlyLink}}` con UTM tracking
- [ ] `{{unsubscribeLink}}` solo en día 3
- [ ] HTML responsive y compatible email clients
- [ ] Texto coherente con especificaciones Linear

## CASOS FALLO COMUNES A VERIFICAR
1. **Timing incorrecto**: Verificar lógica 24h/48h vs specs Linear
2. **Missing dependencies**: Usar Resend existente, no instalar nueva librería
3. **Schema mismatch**: Verificar migration vs especificaciones Linear
4. **Security gaps**: CRON_SECRET no verificado o hardcoded
5. **Over-engineering**: Scheduler externo vs simple Vercel cron

## OUTPUT REQUERIDO
**Generar:** `FJG-50-informe-revision.md` con veredicto:
- ✅ **APROBADO**: Implementación cumple 100% Linear + DoD
- ⚠️ **CONDICIONAL**: Cumple funcional, issues menores identificados
- ❌ **RECHAZADO**: No cumple criterios críticos, Developer debe corregir

**Incluir:**
- Lista específica de checks pasados/fallados
- Evidencia de verificación (screenshots tests, etc.)
- Recomendaciones mejora si aplica
- Discrepancias Linear vs implementación si las hay

## PROHIBICIONES ESTRICTAS
- **NO modificar código** (solo señalar errores)
- **NO generar bloques código** para "arreglar" problemas
- **NO modificar `docs/ESTADO_PROYECTO.md`**
- **NO ejecutar git commands** 
- **ROL SOLO LECTURA** - si falla, rechazar para corrección