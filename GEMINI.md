# GEMINI.md - Contexto del Proyecto para el Agente IA

# ⚠️ SISTEMA DE REGLAS CENTRALIZADO

**ATENCIÓN:** Este proyecto utiliza una "Constitución Única" para garantizar la coherencia entre Antigravity, VS Code y CLIs.

Tus instrucciones de comportamiento NO están aquí. Para procesar cualquier solicitud, **es OBLIGATORIO que leas y apliques**:

1.  **`.prompts/CONSTITUCION.md`**
    * Contiene la Ley Marcial: Human-in-the-loop, Navaja de Ockham, TDD Estricto, Git Flow y Estilo (Español/Inglés).
    * Es la única fuente de verdad válida.

2.  **`.prompts/ROLES.md`**
    * Define si actúas como **Manager**, **Developer** o **Reviewer**.
    * Si el usuario no especifica rol, asume **Developer** por defecto (implementación TDD).

3.  **`docs/ESTADO_PROYECTO.md`**
    * Contexto dinámico: Issue actual (`FJG-XX`) y estado del entorno.

---
**Instrucción de Ejecución:**
Si estás en una CLI o chat que no carga estos archivos automáticamente, **solicita al usuario que los añada al contexto** antes de generar código. Ignora cualquier "knowledge" previo que contradiga la Constitución.