# REVISIÓN DE IMPLEMENTACIÓN: FJG-40

**Rol:** Agent Reviewer (Ver `.prompts/ROLES.md`)
**Tarea:** Revisar issue FJG-40

**⚠️ REGLA DE ORO:** Tienes permisos de **SOLO LECTURA**.
* NO intentes arreglar el código.
* NO generes versiones corregidas de los archivos.
* Tu único entregable es el **Informe de Revisión**.

## 0. Verificación Linear (OBLIGATORIO)
**ANTES DE REVISAR, AGENT REVIEWER DEBE:**
1. Leer issue Linear original: `mcp_linear_get_issue FJG-40`
2. Comparar implementación vs especificaciones Linear (no solo vs prompt)
3. Incluir discrepancias en informe si las hay
4. Verificar coherencia entre Linear, prompt e implementación

## 1. Entradas a Analizar
* **Issue Linear Original:** FJG-40 (Leer via `mcp_linear_get_issue` - OBLIGATORIO)
* **Prompt Generado:** `docs/issues/FJG-40-grid-3-casos-exito-roi/FJG-40-prompt-implementacion.md`
* **Informe Implementación:** `docs/issues/FJG-40-grid-3-casos-exito-roi/FJG-40-informe-implementacion.md` (si existe)
* **Cambios:** Código implementado en el workspace
* **Tests:** Resultado de la ejecución de tests (actualmente 1 test failing)

## 2. Checklist de Revisión (OBLIGATORIO)

### 2.1 Coherencia Linear vs Implementación
- [ ] **Linear Specification Match**: ¿Implementación sigue issue Linear FJG-40 original?
- [ ] **Prompt Alignment**: ¿Hay discrepancias entre prompt generado y Linear?
- [ ] **Scope Compliance**: ¿Resuelve exactamente lo que pide sin "Scope Creep"?

### 2.2 Definition of Done (Linear Specific)
- [ ] **data/cases.ts**: ¿3 casos con estructura exacta Linear (`CASOS_MVP`)?
- [ ] **CaseGrid Component**: ¿Componente responsive (1 col mobile, 3 cols desktop)?
- [ ] **CEO Validation**: ¿Cada caso muestra validación CEO real (email/contrato)?
- [ ] **Tests Passing**: ¿`case-grid.spec.tsx` PASANDO completamente?
- [ ] **UTM Tracking**: ¿CTA Calendly con tracking implementado?
- [ ] **ROI Visibility**: ¿ROI específico visible (inversión → ahorro → payback)?

### 2.3 Seguridad & Calidad
- [ ] **No Hardcoded Secrets**: ¿Sin credenciales en código?
- [ ] **Code Quality**: ¿Código simple siguiendo Navaja de Ockham?
- [ ] **Naming Convention**: ¿Naming en inglés, comentarios en español?
- [ ] **TypeScript Compliance**: ¿Tipos correctos y coherentes?

### 2.4 Testing & Integration
- [ ] **Test Coverage**: ¿Tests cubren casos especificados en Linear?
- [ ] **Component Integration**: ¿CaseGrid integrado en page.tsx correctamente?
- [ ] **Analytics Integration**: ¿Eventos de tracking implementados según spec?
- [ ] **Responsive Testing**: ¿Comportamiento mobile/desktop verificado?

### 2.5 Documentación & Workflow
- [ ] **Implementation Report**: ¿Informe técnico completo generado?
- [ ] **Git Workflow**: ¿Branch nomenclatura y commits apropiados?
- [ ] **Constitution Compliance**: ¿Workflow respeta `.prompts/CONSTITUCION.md`?

## 3. Errores Conocidos a Verificar

**Test Failing Identificado:**
- Test `muestra la información correcta para cada caso` falla
- Error: "Unable to find element with text: /OCR + flujo automático a ERP/i"
- **Revisar**: ¿El componente CaseGrid renderiza correctamente el campo `solution`?
- **Verificar**: ¿Estructura del componente coincide con expectativas del test?

## 4. Entregable Esperado

Generar informe detallado en:
`docs/issues/FJG-40-grid-3-casos-exito-roi/FJG-40-informe-revision.md`

El informe debe incluir:
- ✅/❌ para cada punto del checklist
- Descripción específica de issues encontrados
- Recomendaciones para corrección
- Verificación final Linear vs implementación
- Estado de readiness para merge

**CRÍTICO**: Verificar coherencia 100% con Linear antes de aprobar.