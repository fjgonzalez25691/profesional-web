# FJG-86 · Prompt de Implementación (Agent Developer)

## Contexto
- **Issue Linear:** [FJG-86](https://linear.app/fjgaparicio/issue/FJG-86/us-dt-04-st01-core-logica-comun-de-roi-por-tamano-de-empresa)
- **User story:** "US-DT-04-ST01-CORE – Lógica común de ROI por tamaño de empresa"
- **Objetivo:** Derivar facturación, inventario e inversión base en la calculadora ROI a partir de `companySize`, aplicar ajustes por módulo y capear ROI extremo (> 1.000%).
- **Principios:** Constitución del proyecto (Human-in-the-loop, Navaja de Ockham, TDD estricto, commits conventional en español, sin nuevas capas innecesarias).

## Alcance & Entregables
1. **Funciones utilitarias** tipo `getRevenueFromSize(companySize)` y `getInventoryFromSize(companySize)` reutilizables en toda la calculadora.
2. **Refactor de inversión base**: incorporar componente fijo + multiplicador por tamaño dentro del core de cálculo (aplica a módulos cloud/manual/forecast/inventario según corresponda).
3. **Cap ROI extremo**: si `roi3Years` excede el umbral definido (1.000%), devolver/mostrar `"> 1.000%"` y marcar el resultado como caso extremo (flag booleano para UI/tests).
4. **Tests unitarios** que cubran: 
   - mapping revenue/inventory por tamaño,
   - fórmula de inversión (base + multiplicador),
   - comportamiento del cap (> 1.000%).

## Criterios de Aceptación (CA)
- **CA1:** calculadora ya no usa constantes fijas de revenue/inventory; todo sale de funciones basadas en `companySize`.
- **CA2:** inversión total = base + ajuste por tamaño.
- **CA3:** ROI > umbral se muestra cappeado y marcado como extremo.

## Definition of Done (DoD)
- Funciones de revenue e inventario por tamaño implementadas y usadas.
- Lógica de inversión refactorizada para usar tamaño.
- Cap visual de ROI extremo implementado.
- Tests unitarios básicos cubriendo lo anterior.

## Plan de Trabajo (TDD)
1. **Exploración**
   - Identificar archivo(s) donde hoy se calculan revenue/inventory/inversión (probablemente `lib/calculateROI.ts` o equivalentes) y los puntos donde se usa `companySize`.
   - Detectar dependencias de UI/estado que consumen ROI calculado (para propagar el flag de caso extremo).
2. **Diseño de funciones base**
   - Definir tablas/constantes por `companySize` (ej. `SMB`, `Mid`, `Enterprise`) y crear funciones puras con tipos estrictos.
   - TDD: escribir tests para cada tamaño validando valores esperados.
3. **Integración en cálculo principal**
   - Reemplazar constantes actuales por las funciones nuevas.
   - Refactorizar inversión para usar `baseAmount + multiplier[size] * factor` (levantar este multiplicador de acuerdo a datos actuales/negocio; documentar en el código con comentarios breves).
   - TDD: tests que aseguren inversión correcta para al menos 3 tamaños.
4. **Cap ROI extremo**
   - Introducir utilidad `capRoiValue(roi)` que devuelva `{ valueLabel: string, isCapped: boolean }`.
   - Actualizar flujo de cálculo/DTO para exponer flag a la UI (sin modificar UI en esta tarea más allá de reflejar el label si ya existe componente).
   - Tests que cubran `roi3Years = 1500%` => `"> 1.000%"` y flag `true`.
5. **Revisión cruzada**
   - Ejecutar `npm run test` y `npm run lint`.
   - Documentar supuestos relevantes en `informe-implementacion`.

## Consideraciones
- Mantener compatibilidad con flows existentes (API, hooks, componentes). Si se requiere data shape extra, hacerlo hacia atrás compatible.
- No crear nuevos directorios salvo que sea imprescindible; reutilizar `lib`/`calculator` actuales.
- Tipar estrictamente (evitar `any`).
- En caso de dudas sobre valores base/multiplicadores, documentar en el informe y usa constantes razonables (ej. `SMB`, `MID`, `ENTERPRISE`).
- Git: aún no se hacen commits; el Developer lo hará al finalizar implementación.

## Checklist para el Developer
- [ ] Leer esta instrucción + issue en Linear (validación cruzada).
- [ ] Seguir plan TDD (tests antes de implementación principal).
- [ ] Actualizar/crear tests para CA1-CA3.
- [ ] Ejecutar lint + test.
- [ ] Generar `FJG-86-informe-implementacion.md` al terminar.
