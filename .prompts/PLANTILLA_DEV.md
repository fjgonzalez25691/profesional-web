# GUÍA DE ESTILO DE PROMPTS: AGENTE DEVELOPER

Esta plantilla define cómo el **Agent Manager** debe redactar el archivo `FJG-XX-prompt-implementacion.md`.
Referencia normativa: `.prompts/CONSTITUCION.md`.

---

## Estructura del Archivo a Generar

El Manager debe crear el archivo `docs/issues/FJG-XX-[slug]/FJG-XX-prompt-implementacion.md` con este contenido exacto:

```markdown
# TAREA DE IMPLEMENTACIÓN: <ISSUE_ID>

**Rol:** Agent Developer (Ver `.prompts/ROLES.md`)
**Objetivo:** <TITULO_ISSUE>

## 0. Constitución (OBLIGATORIO)
Antes de escribir código, confirma que has leído:
1.  `.prompts/CONSTITUCION.md`.
2.  `docs/ESTADO_PROYECTO.md`.
3.  La issue <ISSUE_ID> (Vía MCP).

## 1. Objetivo Funcional
<RESUMEN_USER_STORY>

## 2. Criterios de Aceptación (CA)
* [ ] <CRITERIO_1>
* [ ] <CRITERIO_2>

## 3. Definición de Hecho (DoD)
* [ ] Tests pasando (Unitarios/Integración).
* [ ] Sin credenciales hardcodeadas.
* [ ] Estilo: Comentarios en ES, Código en EN.

## 4. Archivos Afectados
**Modificar:**
* `path/to/file.py`: <EXPLICACIÓN_CAMBIO>

**Crear (Solo si es imprescindible):**
* `path/to/new_file.py`

## 5. Plan TDD (Definido por el Manager)
Ejecuta estos pasos en orden:
1.  **Paso 1:** Crear test para <CASO_USO> en `tests/test_...py`.
2.  **Paso 2:** Implementar lógica en `src/...`.
3.  **Paso 3:** <SIGUIENTE_PASO_TDD>...

## 6. Instrucciones de Respuesta
1.  Itera siguiendo el ciclo RED-GREEN-REFACTOR.
2.  Al finalizar, **genera obligatoriamente el informe**:
    * Ruta: `docs/issues/FJG-XX-[slug]/FJG-XX-informe-implementacion.md`
    * Contenido: Resumen de cambios, Tests ejecutados, Decisiones técnicas.