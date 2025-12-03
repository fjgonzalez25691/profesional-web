# FJG-51 PROMPT REVISIÓN - Agent Reviewer

## VERIFICACIÓN DUAL OBLIGATORIA
**PRIMARIO:** Leer issue Linear FJG-51 original con `mcp_linear_get_issue`
**SECUNDARIO:** Leer código implementado y este prompt
**CONFLICTOS:** Si hay discrepancias Linear vs implementación, incluir en informe

## CONTEXTO REVISIÓN
**Issue**: FJG-51 - US-04-004: Lead Capture Postgres + Validación
**Prioridad**: 🟠 High (2)
**Story Points**: 2 SP
**Dependencies**: FJG-35 (Postgres setup), FJG-50 (tabla leads básica ya existe)

## CHECKLIST REVISIÓN TÉCNICA

### 1. CUMPLIMIENTO DEFINITION OF DONE (Linear)
- [ ] Tabla `leads` creada/extendida correctamente
- [ ] Migration `002_leads.sql` ejecutada en producción
- [ ] API POST `/api/leads` responde correctamente
- [ ] Validación Zod implementada: email, nombre, roiData
- [ ] UPSERT funcional: email existente → actualiza roi_data
- [ ] Detección emails desechables implementada (opcional MVP)
- [ ] UTM tracking capturado (campaign, source, medium)
- [ ] Tests verifican: insert correcto, validación errores
- [ ] Índices creados: email, created_at DESC, nurturing

### 2. CRITERIOS ACEPTACIÓN GHERKIN (Linear)
**Verificar implementación coincide con:**
- Lead nuevo válido: email → Postgres → leadId response → nurturing_stage=0
- Email duplicado: upsert roi_data, mantener leadId, update timestamp
- Email inválido: error 400 con mensaje descriptivo
- Email desechable: warning opcional, no bloquea flujo MVP

### 3. SCHEMA DATABASE COMPLIANCE
- [ ] UUID PRIMARY KEY con gen_random_uuid()
- [ ] JSONB para roi_data con estructura exacta Linear
- [ ] JSONB para pains array
- [ ] VARCHAR límites apropiados (email 255, sector 50, etc.)
- [ ] Defaults correctos: nurturing_stage=0, calendly_booked=false
- [ ] Índices optimizados para queries esperadas

### 4. VALIDACIÓN ZOD ROBUSTA
- [ ] Email validation con mensajes específicos
- [ ] RoiData object validation completa
- [ ] Pains array string validation
- [ ] Optional fields manejados correctamente
- [ ] UTM params optional pero capturados

### 5. API ROUTE SECURITY & PERFORMANCE
- [ ] Request body parsing seguro
- [ ] Error handling comprehensivo
- [ ] HTTP status codes apropiados (400 validation, 500 server)
- [ ] Response format consistente
- [ ] SQL injection prevention (parametrized queries)

### 6. RESOLUCIÓN CONFLICTO SCHEMA
**CRÍTICO:** FJG-50 ya creó tabla `leads` básica
- [ ] Migration 002 usa ALTER TABLE o CREATE IF NOT EXISTS apropiado
- [ ] Columns conflictivas resueltas correctamente
- [ ] Backward compatibility mantenida
- [ ] No data loss en existing records

### 7. EMAIL VALIDATION LOGIC
- [ ] isDisposableEmail() detecta dominios temporales
- [ ] isCompanyEmail() diferencia personal vs corporate
- [ ] Warning system implementado (no blocking según Linear)
- [ ] Lista dominios desechables actualizada

### 8. TESTING COVERAGE COMPLETA
- [ ] Migration tests verifican schema correcto
- [ ] Validation tests cubren edge cases  
- [ ] API tests incluyen scenarios success/error
- [ ] **E2E Playwright tests** con API mocking (NO test DB)
- [ ] **User journey testing**: UI flow sin dependencias DB externas
- [ ] **Error scenarios E2E**: validation failures, network errors
- [ ] **NO FAILING TESTS**: Todos los tests deben pasar en CI/CD
- [ ] Mock strategy consistente para isolation

## CASOS FALLO COMUNES A VERIFICAR
1. **Schema conflicts**: FJG-50 vs FJG-51 lead table structure
2. **Missing validation**: roiData structure not enforced
3. **UPSERT bugs**: conflicting emails not handled correctly
4. **Index missing**: performance issues en queries nurturing
5. **UTC timezone**: timestamp fields consistency

## COMPATIBILIDAD BACKWARD
**VERIFICAR:** Cambios schema compatibles con:
- Existing nurturing cron (FJG-50)
- Existing email templates variables
- Frontend ROI calculator integration

## OUTPUT REQUERIDO
**Generar:** `FJG-51-informe-revision.md` con veredicto:
- ✅ **APROBADO**: Schema + API + validation 100% Linear compliant
- ⚠️ **CONDICIONAL**: Funcional con issues menores o warnings
- ❌ **RECHAZADO**: Schema conflicts o validation gaps críticos

**Incluir:**
- Verificación DoD item por item
- Resolución conflicto FJG-50 tabla leads
- Performance implications índices
- Security validation gaps si los hay
- Backward compatibility assessment

## PROHIBICIONES ESTRICTAS
- **NO modificar código** (solo señalar errores)
- **NO generar bloques código** para "arreglar" problemas
- **NO modificar `docs/ESTADO_PROYECTO.md`**
- **NO ejecutar git commands** 
- **ROL SOLO LECTURA** - si falla, rechazar para corrección Developer