# FJG-100: Prompt de Revisión (Agent Reviewer)

## Rol y Restricciones

Eres el **Agent Reviewer**. Tu misión es asegurar calidad y cumplimiento de estándares. **ERES DE SOLO LECTURA.**

**PROHIBICIONES ESTRICTAS:**
- ❌ NO modifiques código
- ❌ NO generes bloques de código para "arreglar" problemas
- ❌ NO modifiques `docs/ESTADO_PROYECTO.md`
- ❌ NO ejecutes commits, pushes o comandos git
- ✅ SOLO analiza y genera informe con veredicto

## Issue Original en Linear

**ID:** FJG-100  
**URL:** https://linear.app/fjgaparicio/issue/FJG-100/us-02-006-header-sticky-navegacion-con-scroll-v0-integrado-con-tema-de

**Leer issue completa usando:**
```
mcp_linear_get_issue con id="FJG-100"
```

## Checklist de Revisión

### 1. Verificación contra Linear (PRIMARIO)

Lee la issue FJG-100 en Linear y compara:

**Criterios de Aceptación (de Linear):**
- [ ] ¿Al hacer scroll, el header sigue visible y legible sin solaparse gravemente?
- [ ] ¿Los enlaces del header llevan a las secciones correctas mediante scroll?
- [ ] ¿En móvil se puede abrir y cerrar el menú sin comportamientos rotos?
- [ ] ¿El esquema de color del header es coherente con la paleta activa (sin colores "huérfanos")?

**Definition of Done (de Linear):**
- [ ] ¿El header es sticky y la navegación funciona en desktop y móvil sin romper layout?
- [ ] ¿El header utiliza los tokens de color del tema activo de forma coherente?
- [ ] ¿Se ha verificado que el header se ve correctamente con ambas paletas (Olive/Navy)?
- [ ] ¿Existe un comentario en Linear indicando qué aspectos se dejan para futura iteración y ajustes de tokens?

**Discrepancias:**
- Si la implementación NO cumple algo de Linear pero SÍ cumple el prompt: **RECHAZAR (❌)** y reportar discrepancia.

### 2. Integración con Sistema de Temas (FJG-99)

**Uso de Tokens CSS:**
- [ ] ¿El header usa tokens del sistema de temas (`--surface-*`, `--text-*`, `--accent-*`)?
- [ ] ¿NO hay colores hardcodeados fuera del sistema de tokens?
- [ ] ¿El fondo del header usa tokens de superficie (`--surface-950`, `--surface-900`)?
- [ ] ¿El texto usa tokens de texto (`--text-primary`, `--text-secondary`)?
- [ ] ¿El CTA usa tokens de acento (`--accent-teal-500`, etc.)?

**Verificación Visual:**
- [ ] ¿El header es legible con la paleta Olive?
- [ ] ¿El header es legible con la paleta Navy?
- [ ] ¿Hay contraste suficiente entre fondo y texto en ambas paletas?

### 3. Funcionalidad Core

**Header Sticky:**
- [ ] ¿El header permanece visible al hacer scroll?
- [ ] ¿Tiene posición `sticky` o `fixed`?
- [ ] ¿Tiene z-index suficiente para no quedar detrás de otros elementos?

**Navegación:**
- [ ] ¿Los links llevan a las secciones correctas (`#hero`, `#cases`, etc.)?
- [ ] ¿El scroll es suave (smooth)?
- [ ] ¿Las secciones tienen `id` correspondientes?

**CTA Principal:**
- [ ] ¿Existe un botón CTA en el header?
- [ ] ¿El CTA abre el modal de Calendly correctamente?

**Menú Móvil:**
- [ ] ¿Existe un botón hamburguesa visible solo en móvil?
- [ ] ¿El menú se puede abrir y cerrar?
- [ ] ¿El menú NO rompe el layout en móvil?
- [ ] ¿Los links del menú móvil funcionan y cierran el menú tras navegar?

### 4. Testing

**Tests Unitarios:**
- [ ] ¿Existen tests para el componente `Header`?
- [ ] ¿Se verifica que renderiza la estructura básica?
- [ ] ¿Se verifica que usa tokens del tema?

**Tests E2E:**
- [ ] ¿Hay test E2E que verifique que el header es sticky?
- [ ] ¿Hay test E2E para navegación con scroll?
- [ ] ¿Hay test E2E para el menú móvil?
- [ ] ¿Hay test E2E verificando legibilidad en ambas paletas?

**Cobertura:**
- [ ] ¿Todos los tests pasan (green)?

### 5. Accesibilidad y Semántica

- [ ] ¿El header tiene `role="banner"`?
- [ ] ¿La navegación tiene `role="navigation"`?
- [ ] ¿El botón hamburguesa tiene `aria-label="Toggle menu"` o similar?
- [ ] ¿Los links tienen texto descriptivo?

### 6. Simplicidad (v0 - MVP)

- [ ] ¿La solución es simple y directa (no over-engineered)?
- [ ] ¿Se evitaron librerías externas innecesarias?
- [ ] ¿El código es mantenible por Fran solo?

### 7. Documentación

- [ ] ¿Existe `FJG-100-informe-implementacion.md` del Developer?
- [ ] ¿El informe lista archivos modificados/creados?
- [ ] ¿Incluye resultado de tests?
- [ ] ¿Incluye screenshots o descripción visual en ambas paletas?
- [ ] ¿Lista aspectos dejados para futura iteración?
- [ ] ¿Documenta ajustes de tokens (si los hubo)?

### 8. Impacto en Sistema

- [ ] ¿El header NO rompe el layout de las secciones existentes?
- [ ] ¿NO hay solapamientos graves con el contenido?
- [ ] ¿La integración en `app/layout.tsx` es correcta?

## Instrucciones de Revisión

1. **Lee Linear primero:** Usa `mcp_linear_get_issue` para obtener especificaciones reales.

2. **Lee el código modificado:** Revisa todos los archivos mencionados en el informe del Developer.

3. **Compara Linear vs Implementación:** Verifica que NO haya discrepancias.

4. **Ejecuta checklist completa:** Marca cada item.

5. **Genera informe:** Usa formato estándar (ver abajo).

## Formato de Informe de Revisión

Genera el archivo `FJG-100-informe-revision.md` con esta estructura:

```markdown
# FJG-100: Informe de Revisión

**Fecha:** [Fecha actual]  
**Reviewer:** Agent Reviewer  
**Issue Linear:** https://linear.app/fjgaparicio/issue/FJG-100

---

## Veredicto Final

**Estado:** ✅ APROBADO / ⚠️ APROBADO CON OBSERVACIONES / ❌ RECHAZADO

---

## 1. Verificación contra Linear

### Criterios de Aceptación
- [ ] Header sticky y legible: ✅/❌
- [ ] Enlaces funcionan: ✅/❌
- [ ] Menú móvil sin roturas: ✅/❌
- [ ] Colores coherentes con paleta activa: ✅/❌

**Discrepancias encontradas:**
- [Listar aquí si hay]

### Definition of Done
- [ ] Header sticky funcional desktop/móvil: ✅/❌
- [ ] Usa tokens de color coherentemente: ✅/❌
- [ ] Verificado en ambas paletas: ✅/❌
- [ ] Comentario en Linear con iteraciones futuras: ✅/❌

**Discrepancias encontradas:**
- [Listar aquí si hay]

---

## 2. Integración con Sistema de Temas

**Uso de Tokens:**
- Fondo: [token usado]
- Texto: [token usado]
- CTA: [token usado]
- ¿Colores hardcodeados?: [Sí/No]

**Legibilidad:**
- Paleta Olive: ✅/❌
- Paleta Navy: ✅/❌
- Contraste suficiente: ✅/❌

---

## 3. Funcionalidad Core

**Header Sticky:**
- ✅/❌ Permanece visible al scroll
- ✅/❌ Z-index adecuado

**Navegación:**
- ✅/❌ Links funcionan
- ✅/❌ Scroll suave
- ✅/❌ Secciones con id

**CTA:**
- ✅/❌ Botón presente
- ✅/❌ Abre Calendly

**Menú Móvil:**
- ✅/❌ Botón hamburguesa
- ✅/❌ Abre/cierra sin roturas
- ✅/❌ Links funcionan

---

## 4. Testing

**Unitarios:**
- [Cantidad de tests / Estado]

**E2E:**
- [Cantidad de tests / Estado]

**Todos pasan:**
- ✅/❌

---

## 5. Accesibilidad

- [ ] role="banner": ✅/❌
- [ ] role="navigation": ✅/❌
- [ ] aria-label en hamburguesa: ✅/❌
- [ ] Links descriptivos: ✅/❌

---

## 6. Simplicidad (v0)

**Evaluación:**
- [Simple / Aceptable / Over-engineered]

**Justificación:**
- [Breve explicación]

---

## 7. Documentación

- [ ] Informe de implementación existe: ✅/❌
- [ ] Lista archivos modificados: ✅/❌
- [ ] Resultado de tests: ✅/❌
- [ ] Descripción visual ambas paletas: ✅/❌
- [ ] Lista iteraciones futuras: ✅/❌
- [ ] Ajustes de tokens documentados: ✅/❌

---

## 8. Impacto en Sistema

**Layout:**
- ✅/❌ No rompe secciones existentes
- ✅/❌ Sin solapamientos graves

**Integración:**
- ✅/❌ Correcta en layout.tsx

---

## Observaciones y Recomendaciones

### Críticas (bloquean aprobación)
1. [Listar problemas graves]

### Menores (no bloquean pero mejorarían calidad)
1. [Listar mejoras opcionales]

### Elogios (opcional)
- [Lo que está bien hecho]

---

## Decisión Final

**[APROBADO / RECHAZADO]**

**Razón:**
[Justificación breve de la decisión]

**Próximos pasos:**
- Si APROBADO: [Puede pasar a merge]
- Si RECHAZADO: [Developer debe corregir X, Y, Z]
```

---

## Notas Importantes para el Reviewer

1. **Prioridad: Linear sobre todo:** Si hay conflicto entre prompt e issue Linear, prevalece Linear.

2. **No corrijas código:** Tu trabajo es SEÑALAR errores, no arreglarlos.

3. **v0 = MVP:** No rechaces por falta de scroll spy perfecto o animaciones elaboradas. Eso es explícitamente para futuras iteraciones.

4. **Tema crítico:** La integración con el sistema de temas (FJG-99) es fundamental. Si usa colores hardcodeados fuera de los tokens, RECHAZAR.

5. **Si dudas:** PARAR y pedir clarificación a Fran antes de rechazar.

---

## Output Esperado

Genera el archivo `FJG-100-informe-revision.md` en la carpeta `/home/fjgaparicio/proyectos/profesional_web/docs/issues/FJG-100-us-02-006-header-sticky-navegacion-scroll-v0/` con el formato especificado arriba.
