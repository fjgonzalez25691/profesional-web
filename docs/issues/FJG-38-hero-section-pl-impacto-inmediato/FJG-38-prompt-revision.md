# TAREA DE REVISIÓN: FJG-38

**Rol:** Agent Reviewer (Ver `.prompts/ROLES.md`)
**Objetivo:** Revisar US-02-001: Hero Section P&L Impacto Inmediato

## ⚠️ REGLA DE ORO: SOLO LECTURA
* **NO** intentes arreglar el código.
* **NO** generes versiones corregidas de los archivos.
* Tu único entregable es el **Informe de Revisión**.

## 1. Entradas a Analizar
* **Issue:** FJG-38 (Leer vía MCP Linear si es posible)
* **Informe Implementación:** `docs/issues/FJG-38-hero-section-pl-impacto-inmediato/FJG-38-informe-implementacion.md` (si existe)
* **Cambios de Código:** Archivos modificados en el workspace
* **Tests:** Resultado de la ejecución de tests E2E y unitarios

## 2. Checklist de Revisión (OBLIGATORIO)

### A. Alineamiento con Issue
* [ ] **CA-1**: Hero visible above fold (sin scroll) mobile+desktop
* [ ] **CA-2**: Headline exacto: "Reduzco tu factura Cloud y automatizo procesos con payback <6 meses"
* [ ] **CA-3**: Subtítulo exacto: "Para empresas industriales, logísticas y agencias 5–50M€"
* [ ] **CA-4**: Foto profesional con badge "+37 años gestionando P&L"
* [ ] **CA-5**: CTA flotante "Diagnóstico gratuito 30 min" visible sin scroll
* [ ] **CA-6**: Modal Calendly abre <500ms al clic en CTA
* [ ] **CA-7**: LCP <2s mobile 4G (Performance crítico)

### B. Definición de Hecho (DoD)
* [ ] **Tests E2E**: `hero.spec.ts` existe y PASA
* [ ] **Tests Unitarios**: `hero.test.tsx` existe y PASA  
* [ ] **Performance**: Lighthouse >85 mobile documentado
* [ ] **Imagen**: WebP <80KB, priority loading implementado
* [ ] **Seguridad**: Sin credenciales hardcodeadas
* [ ] **Estilo**: Comentarios en ES, Variables/Funciones en EN

### C. Cumplimiento Constitución
* [ ] **TDD**: Tests escritos ANTES que código productivo
* [ ] **Ockham**: No hay abstracciones innecesarias
* [ ] **Reutilización**: Aprovecha componentes/libs existentes
* [ ] **Git**: Commits siguen formato `tipo(scope): descripción`

## 3. Puntos Críticos de Validación

### 3.1 Copy NO Negociable
Verificar que el texto sea **EXACTAMENTE**:
```
HEADLINE: "Reduzco tu factura Cloud y automatizo procesos con payback <6 meses"
SUBTITLE: "Para empresas industriales, logísticas y agencias 5–50M€"  
BADGE: "+37 años gestionando P&L"
CTA: "Diagnóstico gratuito 30 min"
```

### 3.2 Performance Crítica
* **LCP <2s**: Medición documentada o test automatizado
* **Modal <500ms**: Apertura instantánea al clic
* **Imagen optimizada**: WebP, <80KB, priority loading

### 3.3 Integración Calendly
* **Variable entorno**: Usa `NEXT_PUBLIC_CALENDLY_URL`
* **UX Modal**: Cierre con [X], [ESC], click fuera
* **No redirección**: Modal in-page, NO nueva ventana

## 4. Archivos Esperados

**Creados/Modificados:**
* `profesional-web/components/Hero.tsx`
* `profesional-web/components/CalendlyModal.tsx`
* `profesional-web/app/page.tsx` (hero actualizado)
* `profesional-web/__tests__/e2e/hero.spec.ts`
* `profesional-web/__tests__/components/hero.test.tsx`
* `docs/issues/FJG-38-hero-section-pl-impacto-inmediato/FJG-38-informe-implementacion.md`

## 5. Criterios de Veredicto

### ✅ **APROBABLE (Merge Ready)**
- Todos los CA cumplidos
- Tests verdes (E2E + unitarios)
- Performance >85 Lighthouse
- Copy exacto implementado
- DoD completo

### ⚠️ **CAMBIOS REQUERIDOS (Menores)**
- CA parcialmente cumplidos
- Tests pasan pero faltan algunos
- Performance limítrofe (80-84)
- Copy ligeramente desviado
- DoD mayormente cumplido

### ❌ **RECHAZADO (Bloqueante)**
- CA críticos fallidos (headline, performance)
- Tests fallan o no existen
- Performance <80 Lighthouse
- Seguridad comprometida
- Scope creep evidente

## 6. Formato de Salida

Generar archivo: `docs/issues/FJG-38-hero-section-pl-impacto-inmediato/FJG-38-informe-revision.md`

### Estructura del Informe:

```markdown
# INFORME DE REVISIÓN: FJG-38

**Fecha**: [FECHA]
**Revisor**: Agent Reviewer
**Commit**: [HASH]

## 1. Veredicto
[✅ Aprobable | ⚠️ Cambios Requeridos | ❌ Rechazado]

## 2. Matriz de Cumplimiento

### Criterios de Aceptación
* CA-1 (Hero above fold): [✅ Cumple | ❌ No Cumple] - [Evidencia]
* CA-2 (Headline exacto): [✅ Cumple | ❌ No Cumple] - [Evidencia]
* [... resto de CA]

### Definición de Hecho  
* Tests E2E: [✅ Pasan | ❌ Fallan] - [Evidencia]
* Performance: [✅ >85 | ❌ <85] - [Score Lighthouse]
* [... resto DoD]

## 3. Hallazgos

### 🔴 Bloqueantes
[Lista numerada de errores críticos]

### 🟡 Importantes  
[Lista de mejoras recomendadas]

### 🟢 Sugerencias
[Lista de optimizaciones menores]

## 4. Acciones para Developer
1. [Acción específica para corregir bloqueante #1]
2. [Acción específica para corregir bloqueante #2]
[...]

## 5. Evidencias Técnicas
[Screenshots, logs de tests, métricas performance]
```

## 7. Instrucciones de Ejecución

1. **Lee la issue FJG-38** (vía MCP si disponible)
2. **Analiza el código** modificado en el workspace  
3. **Ejecuta los tests** y documenta resultados
4. **Verifica performance** (Lighthouse si es posible)
5. **Genera el informe** siguiendo la estructura exacta
6. **Emite veredicto** basado en evidencias objetivas

**RECORDATORIO**: Tu rol es **crítico constructivo**. Señala problemas específicos con evidencias, no opinions generales.