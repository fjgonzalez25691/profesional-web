# TAREA DE IMPLEMENTACIÓN: FJG-42

**Rol:** Agent Developer (Ver `.prompts/ROLES.md`)
**Objetivo:** US-06-001: Footer + Políticas Legales GDPR Básicas

## 0. Constitución (OBLIGATORIO)
Antes de escribir código, confirma que has leído:
1.  `.prompts/CONSTITUCION.md`.
2.  `docs/ESTADO_PROYECTO.md`.
3.  La issue FJG-42 (Vía MCP).

## 1. Objetivo Funcional
**Como** visitante cumplidor GDPR  
**Quiero** acceder a políticas legales  
**Para** cumplir mi política de compras

Implementar footer sticky con columnas (Legal, Social, Copyright) y páginas legales básicas GDPR España.

## 2. Criterios de Aceptación (CA)
* [ ] Footer contiene 3 columnas: Legal (Aviso Legal, Privacidad), Social (LinkedIn, Email), Copyright (© 2025 Francisco García)
* [ ] Footer sticky al final de la página home
* [ ] Páginas `/legal/aviso-legal` y `/legal/privacidad` con plantillas estándar GDPR España
* [ ] Links LinkedIn y Email funcionales
* [ ] Responsive: 3 columnas desktop → 1 columna mobile

## 3. Definición de Hecho (DoD)
* [ ] Tests pasando (Unitarios/Integración).
* [ ] Componente `<Footer>` creado y renderizado
* [ ] Páginas legales accesibles y con contenido GDPR
* [ ] Sin credenciales hardcodeadas.
* [ ] Estilo: Comentarios en ES, Código en EN.
* [ ] Responsive funcional verificado

## 4. Archivos Afectados
**Crear (Imprescindible):**
* `profesional-web/components/Footer.tsx`: Componente footer con 3 columnas
* `profesional-web/app/legal/aviso-legal/page.tsx`: Página aviso legal GDPR
* `profesional-web/app/legal/privacidad/page.tsx`: Página política privacidad
* `profesional-web/__tests__/components/Footer.test.tsx`: Tests unitarios footer

**Modificar:**
* `profesional-web/app/layout.tsx`: Incluir componente Footer en layout principal

## 5. Plan TDD (Definido por el Manager)
Ejecuta estos pasos en orden:

### Paso 1: Tests Footer Component (RED)
1.  **Test 1:** Crear `__tests__/components/Footer.test.tsx`
2.  **Test:** Footer renderiza 3 columnas (Legal, Social, Copyright)
3.  **Test:** Links LinkedIn y Email están presentes
4.  **Test:** Copyright contiene "© 2025 Francisco García"
5.  **Test:** Footer tiene clases sticky y responsive

### Paso 2: Implementación Footer (GREEN)
1.  **Crear:** `components/Footer.tsx`
2.  **Implementar:** Estructura de 3 columnas con Tailwind CSS
3.  **Implementar:** Links funcionales (LinkedIn, mailto:)
4.  **Implementar:** Responsive design (desktop 3 cols → mobile 1 col)

### Paso 3: Tests Páginas Legales (RED)
1.  **Test:** Crear tests para páginas `/legal/aviso-legal` y `/legal/privacidad`
2.  **Test:** Páginas contienen contenido GDPR mínimo
3.  **Test:** Headers y estructura correcta

### Paso 4: Implementación Páginas Legales (GREEN)
1.  **Crear:** `app/legal/aviso-legal/page.tsx`
2.  **Crear:** `app/legal/privacidad/page.tsx`
3.  **Implementar:** Contenido plantilla GDPR España estándar

### Paso 5: Integración Layout (GREEN)
1.  **Modificar:** `app/layout.tsx` para incluir Footer
2.  **Verificar:** Footer sticky al final de páginas

### Paso 6: Refactor & Validación (REFACTOR)
1.  **Refactor:** Optimizar estilos Tailwind si es necesario
2.  **Validar:** Tests E2E si aplica
3.  **Verificar:** Responsive funciona correctamente

## 6. Instrucciones de Respuesta
1.  Itera siguiendo el ciclo RED-GREEN-REFACTOR.
2.  Usa Next.js 16 App Router estructura existente.
3.  Mantén consistencia con el estilo Shadcn/ui del proyecto.
4.  Al finalizar, **genera obligatoriamente el informe**:
    * Ruta: `docs/issues/FJG-42-footer-politicas-legales-gdpr-basicas/FJG-42-informe-implementacion.md`
    * Contenido: Resumen de cambios, Tests ejecutados, Decisiones técnicas.

## 7. Contexto Técnico Específico
* **Framework:** Next.js 16 con App Router
* **Styling:** Tailwind CSS v4, estilo Shadcn/ui existente
* **Testing:** Vitest + Testing Library (estructura ya configurada)
* **Links requeridos:**
  * LinkedIn: [Tu URL LinkedIn personalizada]
  * Email: [Tu email profesional]
* **Copyright:** "© 2025 Francisco García" (usar nombre real del freelancer)

---
**Nota del Manager:** Mantén la Navaja de Ockham. Si el footer puede implementarse sin nuevos paquetes o abstracciones complejas, hazlo simple.