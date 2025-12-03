# FJG-52: PROMPT REVISIÓN
## Dashboard Admin Leads Ultra-Light

### CONTEXTO REVISIÓN
**Issue Linear:** [FJG-52](https://linear.app/fjgaparicio/issue/FJG-52/us-04-005-dashboard-admin-leads-ultra-light)  
**Objetivo:** Auditar implementación vs especificaciones Linear (CA + DoD)

---

## CHECKLIST REVISIÓN OBLIGATORIA

### 🔐 SEGURIDAD (CRÍTICO)
- [ ] **Credenciales:** ADMIN_PASSWORD y ADMIN_TOKEN en variables entorno (NO hardcoded)
- [ ] **Cookie:** HttpOnly, Secure, SameSite=Strict configurado correctamente
- [ ] **Auth:** Verificación process.env.ADMIN_TOKEN exacta (no bypass)
- [ ] **Exposición datos:** Sin logs/console con información sensible leads
- [ ] **SQL Injection:** Query getLeads usa parámetros seguros
- [ ] **Headers:** noindex,nofollow en metadata admin pages

### 📋 CRITERIOS ACEPTACIÓN (GHERKIN EXACTOS)

#### Scenario: Login admin
- [ ] **Given** accedo /admin/leads → página existe y carga
- [ ] **When** ingreso contraseña correcta → POST /admin/login exitoso
- [ ] **Then** veo dashboard leads → redirección/render dashboard

#### Scenario: Ver leads  
- [ ] **Given** autenticado como admin → cookie admin_auth válida
- [ ] **When** abro dashboard → página /admin/leads renderiza
- [ ] **Then** veo tabla leads ordenados por fecha DESC → ORDER BY created_at DESC
- [ ] **And** veo 4 métricas top → Total, Agendados, Conversión, Payback

#### Scenario: Sin auth
- [ ] **Given** NO autenticado → sin cookie admin_auth
- [ ] **When** accedo /admin/leads → directo a página
- [ ] **Then** veo formulario login → LoginForm component
- [ ] **And** NO veo datos leads → sin acceso tabla/métricas

### ✅ DEFINITION OF DONE (LINEAR EXACTA)

#### Funcionalidad Core
- [ ] ✅ Página `/admin/leads` protegida
- [ ] ✅ Auth básica password env var (NO OAuth MVP) 
- [ ] ✅ Cookie HttpOnly secure 24h
- [ ] ✅ Tabla leads: email, nombre, sector, ROI, stage, fecha
- [ ] ✅ 4 métricas: total leads, agendados, %, payback promedio
- [ ] ✅ Ordenado created_at DESC (más recientes primero)

#### Restricciones MVP Respetadas
- [ ] ✅ **NO filtros S3** (solo vista completa)
- [ ] ✅ **NO export CSV S3** (manual query si necesario)  
- [ ] ✅ **NO paginación S3** (lista completa <100 leads MVP)
- [ ] ✅ Test: auth funciona, datos mostrados correctamente

### 🧪 TESTS OBLIGATORIOS
- [ ] **Auth Tests:** login correcto/incorrecto + cookie setting
- [ ] **Protection Tests:** sin auth → LoginForm rendering  
- [ ] **Database Tests:** getLeads() + ORDER BY created_at DESC
- [ ] **Metrics Tests:** cálculos matemáticos (conversión %, payback avg)
- [ ] **Table Tests:** rendering leads data + formateo números
- [ ] **E2E Tests:** flujo completo login → dashboard → logout

### 🏗️ ARQUITECTURA NAVAJA OCKHAM
- [ ] **Reutilización:** tabla leads existente (NO nueva tabla)
- [ ] **Simplicidad:** TailwindCSS existente (NO nuevos frameworks)
- [ ] **MVP Focus:** Dashboard ultra-light (NO features extras)
- [ ] **Dependencies:** Mínimas nuevas deps (reutilizar @vercel/postgres)

### 📊 MÉTRICAS BUSINESS LOGIC
- [ ] **Total Leads:** COUNT(*) leads table
- [ ] **Agendados:** COUNT calendly_booked = true
- [ ] **Conversión:** (agendados/total * 100).toFixed(1)%
- [ ] **Payback Promedio:** AVG roi_data.paybackMonths

### 🎨 UI/UX REQUIREMENTS
- [ ] **Responsive:** Grid funciona mobile/desktop
- [ ] **Accesibilidad:** Alt texts, ARIA labels básicos
- [ ] **Performance:** <100 leads rendering sin lag
- [ ] **Error Handling:** Mensajes user-friendly

---

## TEMPLATE INFORME REVISIÓN

```markdown
# FJG-52: INFORME REVISIÓN
**Fecha:** [DATE]
**Reviewer:** [AGENT_REVIEWER]
**Veredicto:** [✅ APROBADO / ⚠️ OBSERVACIONES / ❌ RECHAZADO]

## RESUMEN EJECUTIVO
[Descripción general cumplimiento Linear vs implementación]

## VERIFICACIÓN SEGURIDAD
### 🔐 Credenciales y Auth
- [✅/❌] Variables entorno configuradas
- [✅/❌] Cookie security headers
- [✅/❌] Auth bypass verification

### Findings Críticos:
[Lista vulnerabilidades encontradas o "None"]

## VERIFICACIÓN FUNCIONAL
### 📋 Criterios Aceptación Gherkin
- [✅/❌] Scenario: Login admin  
- [✅/❌] Scenario: Ver leads
- [✅/❌] Scenario: Sin auth

### ✅ Definition of Done
[Checklist detallado cada punto DoD]

### Findings Funcionales:
[Discrepancias Linear vs implementación]

## VERIFICACIÓN TÉCNICA
### 🧪 Tests Coverage
- [✅/❌] Auth tests passing
- [✅/❌] Protection tests passing  
- [✅/❌] Database tests passing
- [✅/❌] Metrics calculations tests passing

### 🏗️ Arquitectura
- [✅/❌] Navaja Ockham respetada
- [✅/❌] MVP scope mantenido
- [✅/❌] Dependencies mínimas

## DECISIÓN FINAL
**[✅ APROBADO / ⚠️ CONDICIONAL / ❌ RECHAZADO]**

### Si RECHAZADO - Acciones Requeridas:
1. [Acción específica 1]
2. [Acción específica 2]

### Si APROBADO - Observaciones:
[Mejoras sugeridas no bloqueantes]
```

---

## INSTRUCCIONES ESPECÍFICAS REVIEWER

### PROHIBICIONES ESTRICTAS
- ❌ **NO modificar código** - Solo señalar errores
- ❌ **NO generar bloques código** en chat para "arreglar"
- ❌ **NO tocar ESTADO_PROYECTO.md** 
- ❌ **NO ejecutar git commands**

### VERIFICACIÓN DUAL OBLIGATORIA
1. **Primary:** Issue Linear original (descripción + CA + DoD)
2. **Secondary:** Código implementado + tests

### CONFLICTOS LINEAR VS IMPLEMENTACIÓN
Si encuentras discrepancias entre especificación Linear y código implementado:
- ✅ Incluir en sección "Findings Funcionales"
- ✅ Marcar como ❌ RECHAZADO si crítico
- ✅ Específicar qué debe corregirse para match Linear

### ESTÁNDARES CALIDAD
- **Security First:** Credenciales y auth son bloqueantes
- **Linear Compliance:** CA y DoD son fuente verdad absoluta
- **Test Coverage:** Tests obligatorios según plan TDD
- **MVP Discipline:** Features extra son motivo rechazo