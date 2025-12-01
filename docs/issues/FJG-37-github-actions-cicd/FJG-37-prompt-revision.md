# PROMPT DE REVISIÓN: FJG-37

Actúa como **Agent Reviewer** (Ver `.prompts/ROLES.md`).
Revisa el trabajo realizado para la issue `FJG-37`.

## 1. Entradas
* **Issue:** FJG-37 - GitHub Actions CI/CD (Lee vía MCP si es posible).
* **Constitución:** `.prompts/CONSTITUCION.md`.
* **Cambios:** Revisar archivos modificados/creados durante la implementación
* **Tests:** Verificar workflow funcional y sintaxis válida
* **Informe Developer:** `docs/issues/FJG-37-github-actions-cicd/FJG-37-informe-implementacion.md`

## 2. Checklist de Revisión (OBLIGATORIO)
Evalúa punto por punto:
1. **Alineamiento:** ¿Resuelve el CI/CD con GitHub Actions sin "Scope Creep"?
2. **DoD:** ¿Hay tests/verificaciones? ¿Workflow sintácticamente correcto? ¿Documentación actualizada?
3. **Seguridad:** ¿Hay secretos hardcodeados? ¿Workflow usa versiones seguras de actions?
4. **Calidad:** ¿Código simple (Ockham)? ¿Naming en Inglés/Comentarios Español?
5. **Stack:** ¿GitHub Actions correctamente configurado? ¿Node.js 20 y cache npm?
6. **Documentación:** ¿README.md actualizado con CI badge? ¿Branch protection documentada?

## 3. Criterios de Aceptación Específicos
* [ ] Workflow `.github/workflows/ci.yml` creado y funcional
* [ ] CI ejecuta en pull requests y push a main
* [ ] Steps: checkout, setup-node, npm ci, lint, type-check, build
* [ ] Node.js 20 configurado con cache npm
* [ ] Badge CI añadido al README.md
* [ ] Protección rama main configurada (documentada)

## 4. Definición de Hecho Específica
* [ ] Tests pasando (verificación workflow)
* [ ] Sin credenciales hardcodeadas
* [ ] Estilo: Comentarios ES, Código EN
* [ ] Linting sin errores
* [ ] Build exitoso
* [ ] Documentación actualizada

## 5. Formato de Salida
Genera un informe en Markdown (`docs/issues/FJG-37-github-actions-cicd/FJG-37-informe-revision.md`) con:

### 5.1 Veredicto:
* ✅ Aprobable (Merge ready).
* ⚠️ Cambios requeridos (Menores).
* ❌ Rechazado (Bloqueante/No alineado).

### 5.2 Matriz de Cumplimiento:
| Criterio | Estado | Comentario |
|----------|---------|------------|
| **CA Workflow** | ✅/⚠️/❌ | Descripción |

### 5.3 Hallazgos:
* 🔴 **Bloqueantes:** Errores funcionales, seguridad, workflow inválido.
* 🟡 **Importantes:** Deuda técnica, optimizaciones perdidas.
* 🟢 **Sugerencias:** Naming, best practices.

### 5.4 Acciones:
Lista numerada de pasos para el Developer (si aplican cambios).

## 6. Comando de Verificación
Ejecuta para verificar el workflow:
```bash
# Verificar sintaxis (si tienes GitHub CLI)
gh workflow list
# O verificar archivos YAML
cat .github/workflows/ci.yml
```