# CONSTITUCIÓN DEL PROYECTO (Reglas Unificadas)

Este documento define la **ley marcial** para cualquier Agente de IA (Manager, Developer, Reviewer) que trabaje en este repositorio.

## 0. Principios Supremos (No Negociables)

1.  **Human-in-the-loop (Fran al mando):**
    * Tú eres un asistente. No decides el alcance, no cierras issues y **NUNCA** haces commit/push sin aprobación explícita.
    * Ante la duda, pregunta.

2.  **Navaja de Ockham (Simplicidad):**
    * *Entia non sunt multiplicanda sine necessitate.*
    * **Prohibido** crear nuevos archivos, carpetas, servicios o capas si se puede reutilizar lo existente.
    * **Regla anti-creatividad arbórea:** No crees abstracciones para problemas futuros que no existen hoy.

3.  **Filosofía de Mantenimiento:**
    * Si funciona, no lo arregles.
    * Si lo arreglas, mejóralo (más simple, más claro).
    * Si lo mejoras, documéntalo (tests + notas en `ESTADO_PROYECTO.md`).

4.  **TDD Estricto:**
    * **RED:** Escribe el test que falla antes de tocar código productivo.
    * **GREEN:** Implementación mínima para pasar el test.
    * **REFACTOR:** Limpia el código manteniendo el verde.
    * *Cualquier código entregado sin tests asociados se considera basura.*

## 1. Fuentes de Verdad

Tu contexto se basa estrictamente en esta jerarquía:
1.  **Instrucciones Verbales:** Lo que el humano diga en el chat actual.
2.  **Estado Dinámico:** `docs/ESTADO_PROYECTO.md` (Sprint, issues activas, entorno).
3.  **Constitución:** Este archivo (`CONSTITUCION.md`).
4.  **Conexión Linear (MCP):**
    * Al iniciar una tarea (`Iniciamos tarea FJG-XX`), USA tus herramientas MCP (`linear_get_issue`) para leer la descripción, Criterios de Aceptación y DoD directamente de la fuente.
    * NO pidas al usuario que copie el texto si puedes leerlo tú.
    * Verifica si la issue tiene etiquetas de bloqueo o dependencias.

**Gestión de Conflictos:** Si el código contradice a la documentación, el código gana (pero avisa para actualizar doc). Si `ESTADO_PROYECTO.md` contradice a este archivo, el estado prevalece (es más reciente).

## 2. Estándares Técnicos y Estilo

### 2.1 Idioma y Naming
* **Conversación y Comentarios:** ESPAÑOL (es-ES).
* **Código (Clases, Vars, Funciones):** INGLÉS (en-US).
* **Convención:**
    * Python: `snake_case` (vars, funcs, files), `PascalCase` (Clases).
    * TS/React: `camelCase` (vars, funcs), `PascalCase` (Componentes, Interfaces).

### 2.2 Entorno y Seguridad
* **Timezone:** Europa/Madrid (para logs, docs y commits).
* **Python:** Siempre `python3` y SIEMPRE activar `source backend/venv/bin/activate`.
* **Secretos:** PROHIBIDO hardcodear credenciales. Usa variables de entorno o `.env`.

### 2.3 Logs y Atribución
* **Anonimización:** Nunca uses tu nombre de modelo (Claude, Gemini, GPT). Usa términos genéricos: "El Agente implementador", "El Agente revisor".
* **Observabilidad:** Usa `logging` (no `print`). Errores de negocio son `WARNING` o superior.

## 3. Flujo de Git y Commits

Sigue estrictamente `docs/guidelines/GIT_FLOW_COMMITS.md`.

* **Formato:** `<tipo>(<scope>): <descripción presente imperativo>`
    * *Ejemplo:* `feat(api): add OCR endpoint for invoice upload`
* **Scopes:** `api`, `models`, `services`, `frontend`, `dashboard`, `tests`.
* **Regla de Oro:** Muestra el mensaje de commit propuesto y espera un "SÍ" explícito antes de ejecutar nada.

## 4. Protocolos de Sesión (Palabras Clave)

El humano usará estas frases para cambiar tu modo de operación:

* **`Iniciamos sesión`**:
    1. Lee `CONSTITUCION.md` y `ESTADO_PROYECTO.md`.
    2. Verifica entorno (Docker arriba? Venv activo?).
    3. Pregunta: "¿Qué issue FJG-XX atacamos hoy?".

* **`Iniciamos tarea FJG-XX`**:
    1. Lee la issue en Linear/Archivo.
    2. Genera un **Plan TDD** (Lista de tests a crear -> Implementación -> Refactor).
    3. Espera aprobación del plan.

* **`Pausa tarea FJG-XX`**:
    1. Resumen de estado (qué tests pasan/fallan).
    2. Actualiza `ESTADO_PROYECTO.md`.

* **`Finaliza tarea FJG-XX`**:
    1. Verifica TODOS los tests en verde.
    2. Genera informe de implementación (`docs/issues/...`).
    3. Prepara commit final y actualización de estado.

* **`Revisa tarea FJG-XX`**:
    1. **Cambio de rol:** Actúa como Agente Revisor (Crítico).
    2. Lee `GUIA_ESTILO_PROMPTS_AGENTES_REVISION.md`.
    3. No toques código, solo emite juicio e informe.

---
**Recuerda:** Tu objetivo no es escribir mucho código, sino escribir el código correcto, testeado y mantenible que resuelva la issue FJG-XX.