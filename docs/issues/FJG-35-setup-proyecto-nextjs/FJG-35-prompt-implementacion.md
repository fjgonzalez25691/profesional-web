# TAREA DE IMPLEMENTACIÓN: FJG-35

**Rol:** Agent Developer (Ver `.prompts/ROLES.md`)
**Objetivo:** US-01-001: Setup proyecto Next.js 16 + TypeScript + Neon PostgreSQL

## 0. Constitución (OBLIGATORIO)
Antes de escribir código, confirma que has leído:
1. `.prompts/CONSTITUCION.md`.
2. `docs/ESTADO_PROYECTO.md`.
3. La issue FJG-35 (Vía MCP).

## 1. Objetivo Funcional
Configurar un entorno de desarrollo completo con Next.js 16, TypeScript en modo estricto, y Neon PostgreSQL, incluyendo testing framework con Vitest, variables de entorno y documentación actualizada.

## 2. Criterios de Aceptación (CA)
* [ ] Next.js 16 instalado y funcionando
* [ ] TypeScript configurado en modo estricto
* [ ] Neon PostgreSQL integrado
* [ ] Testing framework configurado (Vitest + Testing Library)
* [ ] Variables de entorno documentadas (.env.example)
* [ ] Documentación actualizada (README.md)
* [ ] Build y lint pasando sin errores

## 3. Definición de Hecho (DoD)
* [ ] Tests pasando (Unitarios/Integración).
* [ ] Sin credenciales hardcodeadas.
* [ ] Estilo: Comentarios en ES, Código en EN.
* [ ] Linting sin errores.
* [ ] Build exitoso.
* [ ] Documentación actualizada.

## 4. Archivos Afectados
**Modificar:**
* `README.md`: Actualizar con stack tecnológico y comandos de desarrollo
* `package.json`: Verificar scripts de testing y dependencias

**Crear (Solo si es imprescindible):**
* `vitest.config.ts`: Configuración de Vitest para testing
* `__tests__/setup.test.ts`: Test básico de configuración
* `.env.example`: Plantilla de variables de entorno
* `__tests__/components/`: Estructura para tests de componentes

## 5. Plan TDD (Definido por el Manager)
Ejecuta estos pasos en orden:
1. **Paso 1:** Crear test básico de configuración en `__tests__/setup.test.ts` para verificar que Vitest funciona.
2. **Paso 2:** Configurar Vitest con `vitest.config.ts` y asegurar que el test pasa.
3. **Paso 3:** Crear test para verificar variables de entorno de Neon en `__tests__/db.test.ts`.
4. **Paso 4:** Implementar `.env.example` con las variables de Neon necesarias.
5. **Paso 5:** Crear test básico de componente en `__tests__/components/page.test.tsx`.
6. **Paso 6:** Asegurar que el componente principal pasa el test.
7. **Paso 7:** Actualizar `README.md` con stack Next.js 16 + Neon y comandos de desarrollo.

## 6. Instrucciones de Respuesta
1. Itera siguiendo el ciclo RED-GREEN-REFACTOR.
2. Al finalizar, **genera obligatoriamente el informe**:
   * Ruta: `docs/issues/FJG-35-setup-proyecto-nextjs/FJG-35-informe-implementacion.md`
   * Contenido: Resumen de cambios, Tests ejecutados, Decisiones técnicas.