# INFORME DE REVISIÓN: FJG-37

## Veredicto
⚠️ Cambios requeridos (menores). El workflow cumple CA técnicos, pero la protección de rama main quedó como pendiente/documentada y no consta aplicada.

## Matriz de Cumplimiento
| Criterio | Estado | Comentario |
|----------|---------|------------|
| **CA Workflow** | ✅ | `.github/workflows/ci.yml` creado con checkout, setup-node@v4 (Node 20, cache npm), npm ci, lint, typecheck, test:coverage y build, sobre `./profesional-web`. Triggers en push main y PR a main. |
| **CA PR/Main** | ✅ | `on: push: [main]` y `pull_request: [main]`. |
| **CA Steps (lint/type-check/build)** | ✅ | Steps `npm run lint`, `npm run typecheck`, `npm run build`; además incluye tests con cobertura. |
| **CA Node 20 + cache** | ✅ | `actions/setup-node@v4` con `node-version: '20'` y `cache: 'npm'` usando `package-lock` del subproyecto. |
| **CA Badge CI** | ✅ | Badge añadido en `profesional-web/README.md`. |
| **CA Branch protection** | ⚠️ | No hay evidencia de regla aplicada; el informe de implementación la marca como pendiente y solo documenta pasos manuales. |

## Hallazgos
- 🟡 Protección de rama pendiente: El DoD exige rama `main` con status check requerido. Solo se documentan pasos manuales en el informe; no hay confirmación de que la regla esté aplicada en GitHub.

## Acciones
1. Configurar en GitHub la regla de protección de `main` para requerir el check “Build, Lint & Test” (job `build-and-test`) antes de merge. Confirma cuando quede activa.***
