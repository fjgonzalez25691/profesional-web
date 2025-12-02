# PROMPT DE REVISIÓN: FJG-42

**Rol:** Agent Reviewer (Ver `.prompts/ROLES.md`)
**Tarea:** Revisar issue FJG-42 - US-06-001: Footer + Políticas Legales GDPR Básicas

**⚠️ REGLA DE ORO:** Tienes permisos de **SOLO LECTURA**.
* NO intentes arreglar el código.
* NO generes versiones corregidas de los archivos.
* Tu único entregable es el **Informe de Revisión**.

## 1. Entradas a Analizar
* **Issue:** FJG-42 (Lee vía MCP para obtener CA y DoD originales).
* **Informe Implementación:** `docs/issues/FJG-42-footer-politicas-legales-gdpr-basicas/FJG-42-informe-implementacion.md` (verificar existencia).
* **Cambios:** Código modificado en el workspace desde la rama base.
* **Tests:** Resultado de ejecución de tests unitarios y E2E.

## 2. Checklist de Revisión Específico FJG-42

### 2.1 Criterios de Aceptación (CA)
Verifica que se cumple cada punto de la issue original:
- [ ] **CA-1:** Footer contiene 3 columnas: Legal (Aviso Legal, Privacidad), Social (LinkedIn, Email), Copyright (© 2025 Francisco García)
- [ ] **CA-2:** Footer sticky al final de la página home
- [ ] **CA-3:** Páginas `/legal/aviso-legal` y `/legal/privacidad` con plantillas estándar GDPR España
- [ ] **CA-4:** Links LinkedIn y Email funcionales
- [ ] **CA-5:** Responsive: 3 columnas desktop → 1 columna mobile

### 2.2 Definición de Hecho (DoD)
- [ ] **DoD-1:** Tests pasando (Unitarios/Integración)
- [ ] **DoD-2:** Componente `<Footer>` creado y renderizado correctamente
- [ ] **DoD-3:** Páginas legales accesibles y con contenido GDPR completo
- [ ] **DoD-4:** Sin credenciales hardcodeadas
- [ ] **DoD-5:** Estilo: Comentarios en ES, Código en EN
- [ ] **DoD-6:** Responsive funcional verificado

### 2.3 Archivos Esperados
Verificar existencia y contenido apropiado:
- [ ] `profesional-web/components/Footer.tsx`
- [ ] `profesional-web/app/legal/aviso-legal/page.tsx`
- [ ] `profesional-web/app/legal/privacidad/page.tsx`
- [ ] `profesional-web/__tests__/components/Footer.test.tsx`
- [ ] `profesional-web/__tests__/legal/pages.test.tsx`
- [ ] Modificación en `profesional-web/app/layout.tsx` para incluir Footer

## 3. Análisis de Seguridad y Calidad

### 3.1 Seguridad GDPR
- [ ] Contenido de páginas legales cumple estándares GDPR España
- [ ] No hay datos personales hardcodeados en código
- [ ] Links externos (LinkedIn) son seguros

### 3.2 Calidad de Código
- [ ] Componentes siguen patrones Next.js App Router
- [ ] Uso correcto de Tailwind CSS v4
- [ ] Naming conventions: inglés para código, español para comentarios
- [ ] Componentes reutilizables y mantenibles

### 3.3 Testing
- [ ] Tests unitarios cubren funcionalidad básica
- [ ] Tests de renderizado para componentes
- [ ] Tests de navegación para páginas legales
- [ ] Tests responsive si corresponde

## 4. Formato de Salida Requerido

Genera el archivo `docs/issues/FJG-42-footer-politicas-legales-gdpr-basicas/FJG-42-informe-revision.md` con:

### 4.1 Veredicto Final
* ✅ **Aprobable** (Merge ready) - Cumple todos los CA y DoD
* ⚠️ **Cambios requeridos** (Menores) - Funciona pero necesita ajustes
* ❌ **Rechazado** (Bloqueante) - No cumple CA críticos o problemas de seguridad

### 4.2 Matriz de Cumplimiento
```
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| CA-1: 3 Columnas Footer | [✅/❌] | [Descripción] |
| CA-2: Footer Sticky | [✅/❌] | [Descripción] |
| CA-3: Páginas GDPR | [✅/❌] | [Descripción] |
| CA-4: Links Funcionales | [✅/❌] | [Descripción] |
| CA-5: Responsive | [✅/❌] | [Descripción] |
| DoD-1: Tests Pasando | [✅/❌] | [Descripción] |
| DoD-2: Footer Component | [✅/❌] | [Descripción] |
| DoD-3: Contenido GDPR | [✅/❌] | [Descripción] |
```

### 4.3 Hallazgos por Severidad
**🔴 Bloqueantes:**
* [Lista de errores críticos que impiden merge]

**🟡 Importantes:**
* [Lista de mejoras necesarias pero no bloqueantes]

**🟢 Sugerencias:**
* [Lista de optimizaciones recomendadas]

### 4.4 Acciones para Developer
1. [Acción específica 1]
2. [Acción específica 2]
3. [Etc...]

## 5. Instrucciones Específicas de Contexto
* **Framework:** Next.js 16 con App Router - verificar que páginas siguen estructura correcta
* **Styling:** Tailwind CSS v4 - verificar clases y responsive design
* **GDPR:** Contenido legal debe ser estándar español, no genérico
* **Testing:** Vitest + Testing Library - verificar que tests son efectivos
* **Componentes:** Integración con layout existente sin romper estructura

---
**Nota Final:** Recuerda que tu rol es de auditoría crítica. Busca errores activamente y no apruebes nada que no cumpla estrictamente los CA y DoD establecidos.