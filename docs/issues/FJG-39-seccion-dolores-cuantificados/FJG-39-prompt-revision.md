# PROMPT DE REVISIÓN: FJG-39

**Rol:** Agent Reviewer (Ver `.prompts/ROLES.md`)
**Tarea:** Revisar issue FJG-39 - US-02-002: Sección Dolores Cuantificados

**⚠️ REGLA DE ORO:** Tienes permisos de **SOLO LECTURA**.
* NO intentes arreglar el código.
* NO generes versiones corregidas de los archivos.
* Tu único entregable es el **Informe de Revisión**.

## 1. Entradas a Analizar
* **Issue:** FJG-39 (Lee vía MCP para obtener CA y DoD originales).
* **Informe Implementación:** `docs/issues/FJG-39-seccion-dolores-cuantificados/FJG-39-informe-implementacion.md` (verificar existencia).
* **Cambios:** Código modificado en el workspace desde la rama base.
* **Tests:** Resultado de ejecución de tests unitarios.

## 2. Checklist de Revisión Específico FJG-39

### 2.1 Criterios de Aceptación (CA)
Verifica que se cumple cada punto de la issue original:
- [ ] **CA-1:** Sección visible tras hero section
- [ ] **CA-2:** Exactamente 3 bullets de dolores cuantificados:
  - "2-4 h/día picando facturas/albaranes" (Procesos manuales)
  - "AWS/Azure subió >30% sin explicación" (Factura cloud)  
  - "Previsiones Excel fallan 20-30%" (Forecasting)
- [ ] **CA-3:** Cada bullet con icono ❌
- [ ] **CA-4:** Texto lenguaje P&L (no técnico)
- [ ] **CA-5:** Título sección "¿Te pasa esto?"

### 2.2 Definición de Hecho (DoD)
- [ ] **DoD-1:** Sección visible tras hero
- [ ] **DoD-2:** 3 bullets hardcoded (no CMS S1)
- [ ] **DoD-3:** Componente `<PainPoints>` creado
- [ ] **DoD-4:** Test `pain-points.spec.ts` PASANDO
- [ ] **DoD-5:** Fondo gris #F9FAFB para contraste
- [ ] **DoD-6:** Mobile sin scroll horizontal

### 2.3 Archivos Esperados
Verificar existencia y contenido apropiado:
- [ ] `profesional-web/components/PainPoints.tsx`
- [ ] `profesional-web/__tests__/components/pain-points.spec.ts`
- [ ] Modificación en `profesional-web/app/page.tsx` para incluir PainPoints

## 3. Análisis de Conversión y Negocio

### 3.1 Impacto Negocio
- [ ] **Identificación emocional:** Dolores cuantificados específicos
- [ ] **Lenguaje P&L:** No técnico, enfocado a gerentes/CEOs
- [ ] **Cuantificación específica:** Números concretos (2-4h, >30%, 20-30%)

### 3.2 Calidad de Contenido
- [ ] **Texto exacto:** Coincide con especificaciones de la issue
- [ ] **Dolor real:** Problemas operativos reales de empresas
- [ ] **Cuantificación convincente:** Números creíbles y específicos

### 3.3 UX y Diseño
- [ ] **Posicionamiento:** Inmediatamente tras hero
- [ ] **Contraste visual:** Fondo gris #F9FAFB diferencia del hero
- [ ] **Iconografía:** Iconos ❌ transmiten problema/dolor

## 4. Análisis Técnico

### 4.1 Calidad de Código
- [ ] Componente sigue patrones Next.js App Router
- [ ] Uso correcto de Tailwind CSS v4
- [ ] Integración limpia con Lucide React icons
- [ ] Responsive sin overflow horizontal

### 4.2 Testing
- [ ] Tests unitarios cubren renderizado
- [ ] Tests verifican contenido específico
- [ ] Tests validan estructura HTML
- [ ] Tests responsive si corresponde

### 4.3 Integración
- [ ] PainPoints integrado correctamente en landing
- [ ] Orden correcto: Hero → PainPoints
- [ ] Sin conflictos con otros componentes

## 5. Formato de Salida Requerido

Genera el archivo `docs/issues/FJG-39-seccion-dolores-cuantificados/FJG-39-informe-revision.md` con:

### 5.1 Veredicto Final
* ✅ **Aprobable** (Merge ready) - Cumple todos los CA y DoD
* ⚠️ **Cambios requeridos** (Menores) - Funciona pero necesita ajustes
* ❌ **Rechazado** (Bloqueante) - No cumple CA críticos o problemas de conversión

### 5.2 Matriz de Cumplimiento
```
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| CA-1: Sección tras Hero | [✅/❌] | [Descripción] |
| CA-2: 3 Bullets Específicos | [✅/❌] | [Descripción] |
| CA-3: Iconos ❌ | [✅/❌] | [Descripción] |
| CA-4: Lenguaje P&L | [✅/❌] | [Descripción] |
| CA-5: Título "¿Te pasa esto?" | [✅/❌] | [Descripción] |
| DoD-1: Visible tras Hero | [✅/❌] | [Descripción] |
| DoD-2: Hardcoded 3 bullets | [✅/❌] | [Descripción] |
| DoD-3: Componente PainPoints | [✅/❌] | [Descripción] |
| DoD-4: Tests Pasando | [✅/❌] | [Descripción] |
| DoD-5: Fondo #F9FAFB | [✅/❌] | [Descripción] |
| DoD-6: Mobile responsive | [✅/❌] | [Descripción] |
```

### 5.3 Análisis de Conversión
**Impacto esperado en conversión:**
- [ ] **Identificación:** ¿Los dolores son específicos y reconocibles?
- [ ] **Cuantificación:** ¿Los números son creíbles y impactantes?
- [ ] **Lenguaje:** ¿Habla el idioma del CEO/gerente?

### 5.4 Hallazgos por Severidad
**🔴 Bloqueantes:**
* [Lista de errores críticos que impiden conversión/merge]

**🟡 Importantes:**
* [Lista de mejoras necesarias para optimizar conversión]

**🟢 Sugerencias:**
* [Lista de optimizaciones recomendadas]

### 5.5 Acciones para Developer
1. [Acción específica 1]
2. [Acción específica 2]
3. [Etc...]

## 6. Instrucciones Específicas de Contexto
* **Prioridad:** URGENT - Alta conversión esperada (22%)
* **Audiencia:** Gerentes/CEOs con problemas operativos
* **Framework:** Next.js 16 con App Router - verificar integración correcta
* **Styling:** Tailwind CSS v4 - verificar fondo #F9FAFB y responsive
* **Testing:** Vitest + Testing Library - verificar tests específicos
* **Business:** Texto exacto crítico para conversión - no permitir variaciones

---
**Nota Final:** Esta sección tiene impacto directo en conversión (22%). Audita con especial atención el contenido exacto y la identificación emocional.