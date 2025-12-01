# GUÍA DE COMMITS Y FLUJO GIT (Normativa del Proyecto)

**Referencia vinculante:** Este documento es parte de las reglas definidas en `.prompts/CONSTITUCION.md`. Su cumplimiento es obligatorio para todos los Agentes.

## 1. Reglas para Agentes IA
1.  **Prohibido ejecutar Git sin permiso:** El agente debe **proponer** el comando y esperar confirmación ("¿Procedo?").
2.  **Identidad:** No uses tu nombre de modelo. Usa términos genéricos ("Agente implementador").
3.  **Idioma:** Mensajes de commit SIEMPRE en **Español**.

---

## 2. Estructura del Commit (Conventional Commits)


<tipo>(<scope>): <resumen imperativo en español>

[cuerpo opcional explicativo con más detalle de lo realiazado en el commit]

Closes <ISSUE_ID>

### Tipos Permitidos

- `feat`: Nueva funcionalidad.

- `fix`: Corrección de errores.

- `test`: Añadir o corregir tests.
- `refactor`: Cambios de código que no alteran funcionalidad.

- `docs`: Cambios en documentación (ESTADO_PROYECTO.md, informe-*.md).

- `chore`: Mantenimiento, dependencias, configuración.
### Scopes Comunes

- `api`, `models`, `services`, `auth` (Backend).

- `frontend`, `components`, `hooks` (Frontend).

- `config`, `docker`, `prompts` (General).
## 3. Ejemplo Perfecto

```Bash

feat(FJG-21): implementa sistema de logs inmutable

- Añade modelo AuditLog sin permisos de borrado/edición
- Integra middleware para captura de IP y Usuario
- Actualiza tests de integración para verificar inmutabilidad

Closes FJG-21
```   

## 4. Checklist de Pre-Commit (Para el Agente)

Antes de sugerir un commit, verifica internamente:
  - [ ] ¿Pasan los tests (pytest/npm test)?
  - [ ] ¿Has actualizado docs/ESTADO_PROYECTO.md?
  - [ ] ¿El mensaje sigue el formato `tipo(scope): resumen`?
  - [ ] ¿Está referenciada la Issue?
  - [ ] ¿Has pedido permiso al humano?