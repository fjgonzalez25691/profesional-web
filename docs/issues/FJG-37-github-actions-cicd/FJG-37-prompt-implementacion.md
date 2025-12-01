# TAREA DE IMPLEMENTACIÓN: FJG-37

**Rol:** Agent Developer (Ver `.prompts/ROLES.md`)
**Objetivo:** US-01-003: GitHub Actions CI/CD

## 0. Constitución (OBLIGATORIO)
Antes de escribir código, confirma que has leído:
1. `.prompts/CONSTITUCION.md`.
2. `docs/ESTADO_PROYECTO.md`.
3. La issue FJG-37 (Vía MCP).

## 1. Objetivo Funcional
Configurar pipeline CI/CD automático con GitHub Actions que ejecute lint, type-check y build en cada PR para garantizar calidad del código antes de merge a main. Incluir protección de rama que requiera CI verde.

## 2. Criterios de Aceptación (CA)
* [ ] Workflow `.github/workflows/ci.yml` creado y funcional
* [ ] CI ejecuta automáticamente en pull requests
* [ ] CI ejecuta automáticamente en push a main
* [ ] Steps configurados: checkout, setup-node, npm ci, lint, type-check, build
* [ ] Node.js 20 configurado con cache npm
* [ ] Badge CI añadido al README.md
* [ ] Protección rama main configurada (require status checks)

## 3. Definición de Hecho (DoD)
* [ ] Tests pasando (Unitarios/Integración).
* [ ] Sin credenciales hardcodeadas.
* [ ] Estilo: Comentarios en ES, Código en EN.
* [ ] Linting sin errores.
* [ ] Build exitoso.
* [ ] Documentación actualizada.

## 4. Archivos Afectados
**Crear (Solo si es imprescindible):**
* `.github/workflows/ci.yml`: Workflow principal de CI/CD

**Modificar:**
* `profesional-web/README.md`: Añadir CI badge y sección deployment
* `docs/ESTADO_PROYECTO.md`: Actualizar con progreso FJG-37

## 5. Plan TDD (Definido por el Manager)
Ejecuta estos pasos en orden:

1. **Paso 1: Verificación Scripts Base (RED)**
   - Crear test para verificar que `npm run lint` existe y funciona
   - Crear test para verificar que `npm run type-check` existe y funciona  
   - Crear test para verificar que `npm run build` existe y funciona
   
2. **Paso 2: Workflow Básico (GREEN)**
   - Implementar `.github/workflows/ci.yml` con estructura mínima
   - Configurar triggers: on pull_request y push a main
   - Añadir jobs básicos: checkout, setup-node, npm ci
   
3. **Paso 3: Jobs CI (GREEN)**
   - Implementar step lint usando `npm run lint`
   - Implementar step type-check usando `npm run type-check`
   - Implementar step build usando `npm run build`
   
4. **Paso 4: Optimización (REFACTOR)**
   - Añadir cache npm para optimizar velocidad
   - Configurar Node.js 20 específico
   - Añadir badge CI en README.md

## 6. Instrucciones de Respuesta
1. Itera siguiendo el ciclo RED-GREEN-REFACTOR.
2. Al finalizar, **genera obligatoriamente el informe**:
   * Ruta: `docs/issues/FJG-37-github-actions-cicd/FJG-37-informe-implementacion.md`
   * Contenido: Resumen de cambios, Tests ejecutados, Decisiones técnicas.