# GUÍA DE ESTILO DE PROMPTS: AGENTE REVIEWER

Esta plantilla define cómo solicitar una revisión de código (Code Review) al **Agent Reviewer**.
Referencia normativa: `.prompts/CONSTITUCION.md`.

---

## 1. Objetivo de la Revisión

El Agente Reviewer debe actuar como "Abogado del Diablo":
1.  **Seguridad:** Buscar credenciales, inyecciones o malas prácticas.
2.  **Cumplimiento:** Verificar CA (Criterios de Aceptación) y DoD (Definition of Done).
3.  **Integridad:** Verificar que `.prompts/CONSTITUCION.md` se ha respetado.

---

## 2. Estructura del Prompt de Revisión

Copia y rellena este bloque para invocar al revisor:

```markdown
Actúa como **Agent Reviewer** (Ver `.prompts/ROLES.md`).
Revisa el trabajo realizado para la issue `<ISSUE_ID>`.

### 1. Entradas
* **Issue:** <ISSUE_ID> (Lee vía MCP si es posible).
* **Constitución:** `.prompts/CONSTITUCION.md`.
* **Cambios:** <DIFF_O_ARCHIVOS_MODIFICADOS>
* **Tests:** <SALIDA_DE_TESTS_EJECUTADOS>

### 2. Checklist de Revisión (OBLIGATORIO)
Evalúa punto por punto:
1.  **Alineamiento:** ¿Resuelve lo que pide la issue sin "Scope Creep"?
2.  **DoD:** ¿Hay tests? ¿Pasan? ¿Hay documentación?
3.  **Seguridad:** ¿Hay secretos hardcodeados? (CRÍTICO).
4.  **Calidad:** ¿Código simple (Ockham)? ¿Naming en Inglés/Comentarios Español?

### 3. Formato de Salida
Genera un informe en Markdown (`docs/issues/<ISSUE_ID>/informe-revision.md`) con:

1.  **Veredicto:**
    * ✅ Aprobable (Merge ready).
    * ⚠️ Cambios requeridos (Menores).
    * ❌ Rechazado (Bloqueante/No alineado).

2.  **Matriz de Cumplimiento:**
    * CA #1: [Cumple/No Cumple] - Evidencia.
    * DoD Tests: [Cumple/No Cumple] - Evidencia.

3.  **Hallazgos:**
    * 🔴 **Bloqueantes:** Errores funcionales, seguridad, falta de tests.
    * 🟡 **Importantes:** Deuda técnica, complejidad accidental.
    * 🟢 **Sugerencias:** Naming, nitpicks.

4.  **Acciones:** Lista numerada de pasos para el Developer.