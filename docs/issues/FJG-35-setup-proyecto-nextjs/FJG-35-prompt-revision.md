# PROMPT DE REVISIÓN: FJG-35

Actúa como **Agent Reviewer** (Ver `.prompts/ROLES.md`).
Revisa el trabajo realizado para la issue `FJG-35`.

## 1. Entradas
* **Issue:** FJG-35 - Setup proyecto Next.js 16 + TypeScript + Neon PostgreSQL (Lee vía MCP si es posible).
* **Constitución:** `.prompts/CONSTITUCION.md`.
* **Cambios:** Revisar archivos modificados/creados durante la implementación
* **Tests:** Verificar salida de tests ejecutados con Vitest
* **Informe Developer:** `docs/issues/FJG-35-setup-proyecto-nextjs/FJG-35-informe-implementacion.md`

## 2. Checklist de Revisión (OBLIGATORIO)
Evalúa punto por punto:
1. **Alineamiento:** ¿Resuelve el setup de Next.js 16 + TypeScript + Neon PostgreSQL sin "Scope Creep"?
2. **DoD:** ¿Hay tests con Vitest? ¿Pasan? ¿Hay documentación actualizada?
3. **Seguridad:** ¿Hay secretos hardcodeados? ¿Variables de entorno Neon bien documentadas? (CRÍTICO).
4. **Calidad:** ¿Código simple (Ockham)? ¿Naming en Inglés/Comentarios Español?
5. **Stack:** ¿Vitest correctamente configurado? ¿TypeScript en modo estricto?
6. **Documentación:** ¿README.md actualizado con stack Neon? ¿.env.example creado?

## 3. Criterios de Aceptación Específicos
Verificar cumplimiento de:
* [ ] Next.js 16 instalado y funcionando
* [ ] TypeScript configurado en modo estricto  
* [ ] Neon PostgreSQL integrado
* [ ] Testing framework configurado (Vitest + Testing Library)
* [ ] Variables de entorno documentadas (.env.example)
* [ ] Documentación actualizada (README.md)
* [ ] Build y lint pasando sin errores

## 4. Definición de Hecho Específica
Verificar cumplimiento de:
* [ ] Tests pasando (Unitarios/Integración).
* [ ] Sin credenciales hardcodeadas.
* [ ] Estilo: Comentarios en ES, Código en EN.
* [ ] Linting sin errores.
* [ ] Build exitoso.
* [ ] Documentación actualizada.

## 5. Formato de Salida
Genera un informe en Markdown (`docs/issues/FJG-35-setup-proyecto-nextjs/FJG-35-informe-revision.md`) con:

### 5.1 Veredicto:
* ✅ Aprobable (Merge ready).
* ⚠️ Cambios requeridos (Menores).
* ❌ Rechazado (Bloqueante/No alineado).

### 5.2 Matriz de Cumplimiento:
* CA #1 (Next.js 16): [Cumple/No Cumple] - Evidencia.
* CA #2 (TypeScript strict): [Cumple/No Cumple] - Evidencia.
* CA #3 (Neon PostgreSQL): [Cumple/No Cumple] - Evidencia.
* CA #4 (Vitest + Testing Library): [Cumple/No Cumple] - Evidencia.
* CA #5 (.env.example): [Cumple/No Cumple] - Evidencia.
* CA #6 (README actualizado): [Cumple/No Cumple] - Evidencia.
* CA #7 (Build/lint): [Cumple/No Cumple] - Evidencia.
* DoD Tests: [Cumple/No Cumple] - Evidencia.
* DoD Security: [Cumple/No Cumple] - Evidencia.

### 5.3 Hallazgos:
* 🔴 **Bloqueantes:** Errores funcionales, seguridad, falta de tests.
* 🟡 **Importantes:** Deuda técnica, complejidad accidental.
* 🟢 **Sugerencias:** Naming, nitpicks.

### 5.4 Acciones:
Lista numerada de pasos para el Developer (si aplican cambios).

## 6. Comando de Verificación
Ejecutar para validar setup completo:
```bash
npm run build && npm run lint && npm run test
```