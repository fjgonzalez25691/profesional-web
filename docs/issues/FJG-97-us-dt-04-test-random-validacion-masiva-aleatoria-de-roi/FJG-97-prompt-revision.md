# FJG-97: Prompt de Revisión – Validación masiva aleatoria de ROI

## Contexto del Proyecto
- **Identificador Linear**: FJG-97
- **Título**: US-DT-04-TEST-RANDOM – Validación masiva aleatoria de ROI
- **Rama Git**: `fjgonzalez25691-fjg-97-us-dt-04-test-random-validacion-masiva-aleatoria-de-roi`
- **Sprint**: Sprint 3 - Lead Magnet ROI (Días 15-21)

## Misión del Reviewer
Verificar que el script de validación aleatoria cumple con las especificaciones de Linear (CA + DoD), garantiza la generación de 10,000+ escenarios sin fallback, y produce un CSV válido para análisis estadístico posterior.

**IMPORTANTE**: Este rol es de **SOLO LECTURA**. No corrijas código, solo documenta hallazgos.

## Especificaciones Linear (Fuente de Verdad)

### Criterios de Aceptación
```gherkin
CA1: Se generan al menos 10,000 escenarios aleatorios válidos
CA2: La salida contiene todos los campos necesarios para análisis estadístico (inputs completos + savings, inversión, payback y ROI3Y)
CA3: El script no aplica fallback; siempre devuelve valores numéricos
CA4: Se genera un archivo CSV o JSON con nombre estándar (roi-random-validation-YYYYMMDD.csv)
CA5: Se documentan en la propia issue las conclusiones del análisis exploratorio realizado externamente por Fran
     ⚠️ NO es responsabilidad del Developer ni del Reviewer. Este CA se cumple FUERA del ciclo de implementación.
```

### Definition of Done
```
DoD1: Script creado y funcional dentro del repo
DoD2: Archivo de resultados generado y documentada su ubicación
DoD3: Comentario en la issue con las conclusiones del análisis externo realizado por Fran
      ⚠️ NO es responsabilidad del Developer ni del Reviewer. Este DoD se cumple FUERA del ciclo de revisión.
DoD4: Validación final por Fran de que el dataset generado es útil para tuning en futuras iteraciones
      ⚠️ NO es responsabilidad del Developer ni del Reviewer. Este DoD se cumple FUERA del ciclo de revisión.
```

**CLARIFICACIÓN CRÍTICA**: CA5, DoD3 y DoD4 son análisis externos realizados por Fran. El Reviewer NO debe bloquear la implementación por ausencia de estos elementos. La revisión se centra en CA1-CA4 y DoD1-DoD2.

## Checklist de Revisión

### 1. Verificación de Arquitectura y Navaja de Ockham

#### 1.1. Ubicación y Estructura del Script
- [ ] Script principal ubicado en `profesional-web/scripts/generate-random-roi-scenarios.ts`
- [ ] No se modificó código de producción (`lib/calculator/calculateROI.ts`, `types.ts`, etc.)
- [ ] No se añadieron dependencias externas innecesarias (solo Node.js built-ins: fs, path)
- [ ] Script es autocontenido en un solo archivo (o máximo 2 si hay helpers)

**Criterio**: El script NO debe modificar la lógica de producción de la calculadora. Si se modificó `calculateROI.ts` o archivos de `lib/calculator/`, es un **FALLO CRÍTICO**.

#### 1.2. Tests Unitarios
- [ ] Existe archivo `profesional-web/__tests__/scripts/generate-random-roi.test.ts`
- [ ] Al menos 3 casos de test:
  - Generación de escenario aleatorio válido
  - Coherencia dolor-seleccionado vs campos numéricos
  - Cálculo siempre retorna valores numéricos (no NaN ni undefined)
- [ ] Tests ejecutables con `npm test -- __tests__/scripts/generate-random-roi.test.ts`
- [ ] Todos los tests pasan (0 failures)

**Criterio**: Sin tests adecuados, la implementación no es verificable. Mínimo 3 tests como se indica arriba.

---

### 2. Verificación de Criterios de Aceptación (CA1-CA4)

#### CA1: Se generan al menos 10,000 escenarios aleatorios válidos

**Verificaciones**:
- [ ] Script tiene constante `NUM_SCENARIOS` o similar configurada >= 10,000
- [ ] Loop principal ejecuta exactamente `NUM_SCENARIOS` iteraciones
- [ ] Cada escenario generado tiene campos `companySize`, `sector`, `selectedPain` válidos
- [ ] Validar manualmente: ejecutar script y contar filas del CSV (debe ser 10,000 + 1 header)

**Comando de verificación**:
```bash
npm run generate-roi-random
wc -l profesional-web/validation-results/roi-random-validation-*.csv
# Debe mostrar 10001 (10,000 datos + 1 header)
```

**Criterio**: Si el script genera menos de 10,000 escenarios o falla durante la generación, es un **FALLO de CA1**.

#### CA2: La salida contiene todos los campos necesarios para análisis estadístico

**Campos Obligatorios en CSV**:

**Inputs**:
- [ ] `company_size` (SMALL/MEDIUM/LARGE/XLARGE)
- [ ] `sector` (RETAIL/INDUSTRIAL/LOGISTICA/OTHER)
- [ ] `selected_pain` (cloud_costs/manual_processes/forecasting/inventory)
- [ ] `cloud_cost_euros_month` (numérico o null)
- [ ] `manual_process_hours_week` (numérico o null)
- [ ] `forecast_error_percent` (numérico o null)
- [ ] `inventory_excess_percent` (numérico o null)

**Outputs**:
- [ ] `savings_year1` (numérico)
- [ ] `savings_year2` (numérico)
- [ ] `savings_year3` (numérico)
- [ ] `total_savings_3y` (numérico, suma de años 1-3)
- [ ] `investment_year0` (numérico)
- [ ] `payback_months` (numérico)
- [ ] `roi_3_years` (numérico, porcentaje ROI a 3 años)

**Metadatos**:
- [ ] `scenario_id` (secuencial 1-N)
- [ ] `generated_at` (timestamp ISO)
- [ ] `config_version` (string identificador)

**Comando de verificación**:
```bash
head -1 profesional-web/validation-results/roi-random-validation-*.csv
# Debe listar todas las columnas arriba mencionadas
```

**Criterio**: Si falta alguna columna clave (especialmente outputs: payback, roi_3_years), es un **FALLO de CA2**.

#### CA3: El script no aplica fallback; siempre devuelve valores numéricos

**Verificaciones**:
- [ ] Código del script NO llama a `shouldCalculateROI()` (función de validación pre-cálculo)
- [ ] Código del script NO tiene condicionales que retornen objeto de tipo `ROIFallback`
- [ ] Lógica de cálculo está duplicada/adaptada para bypass de validaciones
- [ ] Inspección de CSV: columna `roi_3_years` NO contiene strings como "fallback", "invalid", etc.
- [ ] Inspección de CSV: columna `roi_3_years` tiene SOLO valores numéricos (incluye negativos, pueden ser >90% o <0, eso está permitido)

**Comando de verificación**:
```bash
# Verificar que no hay valores no-numéricos en roi_3_years
awk -F',' 'NR>1 && ($14 !~ /^-?[0-9]+(\.[0-9]+)?$/) {print "INVALID:", $14}' profesional-web/validation-results/roi-random-validation-*.csv
# No debe imprimir nada. Si imprime filas, hay valores inválidos.
```

**Criterio**: Si el script aplica fallback o retorna valores no-numéricos en `roi_3_years`, es un **FALLO CRÍTICO de CA3**.

#### CA4: Se genera un archivo CSV o JSON con nombre estándar

**Verificaciones**:
- [ ] Formato de salida es CSV (no JSON, a menos que también se genere CSV)
- [ ] Nombre del archivo sigue patrón `roi-random-validation-YYYYMMDD.csv`
- [ ] Archivo ubicado en carpeta `profesional-web/validation-results/` o similar (documentado)
- [ ] Fecha en nombre de archivo coincide con fecha de ejecución
- [ ] Header presente en primera línea del CSV

**Comando de verificación**:
```bash
ls -lh profesional-web/validation-results/roi-random-validation-*.csv
# Debe existir archivo con nombre correcto y tamaño ~1-2 MB
```

**Criterio**: Si el nombre del archivo no sigue el patrón o está en ubicación no documentada, es un **FALLO de CA4**.

---

### 3. Verificación de Definition of Done (DoD1-DoD2)

#### DoD1: Script creado y funcional dentro del repo

**Verificaciones**:
- [ ] Script ubicado en `profesional-web/scripts/` (dentro del monorepo)
- [ ] Script ejecutable con comando npm (ej: `npm run generate-roi-random`)
- [ ] Script documentado en `package.json` (entry en section "scripts")
- [ ] Script NO requiere instalación de dependencias externas adicionales
- [ ] Ejecución completa sin errores en terminal

**Comando de verificación**:
```bash
npm run generate-roi-random
# Debe completar sin errores y mostrar mensaje de éxito
```

**Criterio**: Si el script no se puede ejecutar o requiere setup complejo, es un **FALLO de DoD1**.

#### DoD2: Archivo de resultados generado y documentada su ubicación

**Verificaciones**:
- [ ] Existe README o documentación del script (ej: `scripts/README-generate-random-roi.md`)
- [ ] Documentación especifica ubicación exacta del CSV generado
- [ ] Documentación explica estructura del CSV (columnas, formato)
- [ ] Informe de implementación (`FJG-97-informe-implementacion.md`) documenta:
  - Ruta completa del CSV generado
  - Tamaño del archivo
  - Número de escenarios generados
  - Tiempo de ejecución aproximado

**Comando de verificación**:
```bash
cat profesional-web/scripts/README-generate-random-roi.md
# Debe contener sección "Output" con ruta del CSV
```

**Criterio**: Si la ubicación del CSV no está claramente documentada, es un **FALLO de DoD2**.

---

### 4. Verificación de Calidad del Código

#### 4.1. TypeScript y Linting
- [ ] Script escrito en TypeScript (extensión `.ts`)
- [ ] No hay errores de compilación TypeScript (`npm run type-check` o similar)
- [ ] No hay errores de ESLint críticos (warnings aceptables)
- [ ] Uso de tipos existentes del proyecto (`ROIInput`, `CompanySize`, etc.)

**Comando de verificación**:
```bash
npx tsc --noEmit profesional-web/scripts/generate-random-roi-scenarios.ts
# Debe retornar sin errores
```

#### 4.2. Generación Aleatoria Coherente
- [ ] Función `generateRandomScenario()` o similar está presente
- [ ] Lógica garantiza que solo un dolor se selecciona a la vez
- [ ] Si `selectedPain === 'cloud_costs'`, entonces solo `cloudCostEurosMonth` está definido
- [ ] Si `selectedPain === 'manual_processes'`, entonces solo `manualProcessHoursWeek` está definido
- [ ] Rangos de valores aleatorios son razonables:
  - `cloudCostEurosMonth`: 5,000 - 50,000
  - `manualProcessHoursWeek`: 10 - 60
  - `forecastErrorPercent`: 5 - 50
  - `inventoryExcessPercent`: 10 - 60

**Inspección Manual**: Revisar código de `generateRandomScenario()` y verificar rangos.

#### 4.3. Cálculo Numérico Sin Fallback
- [ ] Función de cálculo (`calculateROINumerically()` o similar) está presente
- [ ] NO llama a `shouldCalculateROI()` ni a funciones de validación
- [ ] NO tiene condicionales que retornen fallback
- [ ] Cálculo de ROI sigue fórmula: `((totalSavings3Y - investment) / investment) * 100`
- [ ] Cálculo de payback manejado correctamente (evita división por cero con valores pequeños)

**Inspección Manual**: Revisar lógica de cálculo y comparar con `lib/calculator/calculateROI.ts` (debe ser similar pero sin fallback).

#### 4.4. Exportación CSV
- [ ] Uso de `fs.writeFileSync()` o similar para escribir CSV
- [ ] Headers generados automáticamente (no hardcodeados manualmente)
- [ ] Valores null/undefined exportados como cadenas vacías o "null"
- [ ] No hay caracteres especiales sin escapar (comas dentro de valores, etc.)

---

### 5. Verificación de Seguridad y Best Practices

#### 5.1. Seguridad
- [ ] No hay credenciales hardcodeadas
- [ ] No hay paths absolutos del sistema del developer (ej: `/Users/fulano/...`)
- [ ] Uso de `path.join()` para rutas multiplataforma
- [ ] No hay `eval()` ni `exec()` de código dinámico

#### 5.2. Performance y Recursos
- [ ] Loop de 10,000 iteraciones tiene logging intermedio (ej: cada 1,000 escenarios)
- [ ] No hay memory leaks evidentes (array de resultados de tamaño fijo)
- [ ] Script completa en tiempo razonable (<30 segundos para 10,000 escenarios)

**Comando de verificación**:
```bash
time npm run generate-roi-random
# Debe completar en menos de 30 segundos
```

---

### 6. Verificación de Documentación

#### 6.1. Informe de Implementación
- [ ] Existe `docs/issues/FJG-97-.../FJG-97-informe-implementacion.md`
- [ ] Contiene sección "Resumen Ejecutivo" con ubicación del CSV
- [ ] Contiene sección "Decisiones Técnicas" explicando bypass de fallback
- [ ] Contiene sección "Resultados de Tests" con output de tests
- [ ] Contiene tabla de verificación de CA1-CA4 con evidencias
- [ ] Contiene tabla de verificación de DoD1-DoD2
- [ ] **NO** contiene análisis estadístico del CSV (eso es CA5, fuera de scope)

#### 6.2. README del Script
- [ ] Existe `profesional-web/scripts/README-generate-random-roi.md`
- [ ] Documenta propósito del script
- [ ] Documenta comando de ejecución
- [ ] Documenta ubicación y estructura del CSV generado
- [ ] Aclara que análisis estadístico es responsabilidad externa

---

## Matriz de Decisión del Reviewer

### ✅ APROBADO (Merge Ready)
Todos los checks críticos cumplen:
- CA1-CA4 verificados con evidencias
- DoD1-DoD2 cumplidos
- Tests unitarios passing (100%)
- CSV generado correctamente (10,000 filas + header)
- Script ejecutable sin errores
- Documentación completa

### ⚠️ APROBADO CON OBSERVACIONES (Minor Issues)
Cumple CA1-CA4 y DoD1-DoD2, pero tiene issues menores:
- Warnings de linting no críticos
- Documentación incompleta (falta README o detalles)
- Performance subóptima (>30 segundos pero <60)
- Código poco legible pero funcional

**Acción**: Documentar observaciones en informe, pero NO bloquear merge. Crear issues de mejora si es necesario.

### ❌ RECHAZADO (Requiere Corrección)
Falla algún CA crítico o DoD:
- **CA1**: Genera menos de 10,000 escenarios
- **CA3**: Aplica fallback o retorna valores no-numéricos
- **CA4**: Archivo con nombre incorrecto o ausente
- **DoD1**: Script no ejecutable o con errores
- **DoD2**: Ubicación del CSV no documentada

**Acción**: Rechazar y devolver al Developer con lista detallada de fallos.

---

## Informe de Revisión

Al finalizar, generar `FJG-97-informe-revision.md` con:

### Sección 1: Veredicto General
```markdown
**Estado**: [✅ APROBADO | ⚠️ APROBADO CON OBSERVACIONES | ❌ RECHAZADO]

**Resumen**: [Breve descripción del estado general de la implementación]
```

### Sección 2: Verificación de Criterios de Aceptación
```markdown
| Criterio | Estado | Evidencia | Observaciones |
|----------|--------|-----------|---------------|
| CA1: ≥10,000 escenarios | [✅/❌] | [wc -l output] | |
| CA2: Todos los campos | [✅/❌] | [head -1 CSV] | |
| CA3: Sin fallback | [✅/❌] | [Inspección código + CSV] | |
| CA4: CSV nombre estándar | [✅/❌] | [ls -lh output] | |
| CA5: Análisis Fran | N/A | Fuera de scope | |
```

### Sección 3: Verificación de Definition of Done
```markdown
| DoD | Estado | Evidencia | Observaciones |
|-----|--------|-----------|---------------|
| DoD1: Script funcional | [✅/❌] | [npm run output] | |
| DoD2: CSV documentado | [✅/❌] | [README presente] | |
| DoD3: Comentario Fran | N/A | Fuera de scope | |
| DoD4: Validación Fran | N/A | Fuera de scope | |
```

### Sección 4: Hallazgos Críticos
Lista de problemas que BLOQUEAN el merge (si existen):
```markdown
1. [CRÍTICO] CA3 fallido: Script aplica fallback en línea X
2. [CRÍTICO] DoD1 fallido: Script genera error de TypeScript
...
```

### Sección 5: Observaciones Menores
Lista de mejoras opcionales que NO bloquean merge:
```markdown
1. [MENOR] Performance: Script tarda 45 segundos (recomendado <30s)
2. [MENOR] Linting: 3 warnings de ESLint en uso de variables
...
```

### Sección 6: Verificación de Tests
```markdown
**Tests Ejecutados**: `npm test -- __tests__/scripts/generate-random-roi.test.ts`

**Resultado**: [X/Y tests passing]

**Output**:
\`\`\`
[Copiar output completo del comando de tests]
\`\`\`
```

### Sección 7: Verificación del CSV Generado
```markdown
**Ubicación**: `profesional-web/validation-results/roi-random-validation-20251208.csv`
**Tamaño**: 1.8 MB
**Filas**: 10,001 (10,000 datos + 1 header)
**Columnas**: 16

**Primeras 3 filas**:
\`\`\`csv
[Copiar primeras 3 filas del CSV]
\`\`\`

**Últimas 3 filas**:
\`\`\`csv
[Copiar últimas 3 filas del CSV]
\`\`\`

**Verificación de valores numéricos en roi_3_years**:
\`\`\`bash
awk -F',' 'NR>1 && ($14 !~ /^-?[0-9]+(\.[0-9]+)?$/) {print}' roi-random-validation-*.csv
# Output: [vacío si OK, o filas problemáticas]
\`\`\`
```

### Sección 8: Recomendaciones para el Manager
```markdown
**Decisión de Merge**: [Aprobar inmediatamente | Aprobar con observaciones | Rechazar y devolver a Developer]

**Acciones Post-Merge** (si aplica):
- Crear issue de mejora para performance
- Documentar findings de análisis estadístico en Linear
- ...
```

---

## Comandos de Verificación Completa

Ejecutar en orden para revisión exhaustiva:

```bash
# 1. Verificar estructura de archivos
ls -lh profesional-web/scripts/generate-random-roi-scenarios.ts
ls -lh profesional-web/scripts/README-generate-random-roi.md
ls -lh profesional-web/__tests__/scripts/generate-random-roi.test.ts

# 2. Ejecutar tests
npm test -- __tests__/scripts/generate-random-roi.test.ts

# 3. Verificar TypeScript
npx tsc --noEmit profesional-web/scripts/generate-random-roi-scenarios.ts

# 4. Ejecutar script
time npm run generate-roi-random

# 5. Verificar CSV generado
ls -lh profesional-web/validation-results/roi-random-validation-*.csv
wc -l profesional-web/validation-results/roi-random-validation-*.csv
head -1 profesional-web/validation-results/roi-random-validation-*.csv
head -5 profesional-web/validation-results/roi-random-validation-*.csv
tail -3 profesional-web/validation-results/roi-random-validation-*.csv

# 6. Verificar valores numéricos en roi_3_years (columna 14)
awk -F',' 'NR>1 && ($14 !~ /^-?[0-9]+(\.[0-9]+)?$/) {print "INVALID:", $14}' profesional-web/validation-results/roi-random-validation-*.csv
```

---

## PROHIBICIONES ESTRICTAS DEL REVIEWER

- ❌ NO corrijas código. Tu rol es SOLO LECTURA.
- ❌ NO generes bloques de código en el informe.
- ❌ NO modifiques archivos del repo.
- ❌ NO ejecutes comandos git (commit, push, etc.).
- ❌ NO rechaces la implementación por ausencia de CA5/DoD3/DoD4 (son externos).
- ❌ NO realices análisis estadístico del CSV (es responsabilidad de Fran).

**Si encuentras fallos**: Documéntalos claramente en el informe y devuelve al Developer para corrección.
