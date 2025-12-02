# TAREA DE IMPLEMENTACIÓN: FJG-39

**Rol:** Agent Developer (Ver `.prompts/ROLES.md`)
**Objetivo:** US-02-002: Sección Dolores Cuantificados

## 0. Constitución (OBLIGATORIO)
Antes de escribir código, confirma que has leído:
1.  `.prompts/CONSTITUCION.md`.
2.  `docs/ESTADO_PROYECTO.md`.
3.  La issue FJG-39 (Vía MCP).

## 1. Objetivo Funcional
**Como** gerente con problemas operativos  
**Quiero** ver reflejados mis dolores con números  
**Para** sentir que entiendes mi situación

**Impacto Negocio:** Identificación emocional visitante. Dolor cuantificado → CEO se reconoce y sigue leyendo. **Impacto "Conversión" (22%) vía reducción bounce rate + aumento scroll depth**.

## 2. Criterios de Aceptación (CA)
* [ ] **CA-1:** Sección visible tras hero section
* [ ] **CA-2:** Exactamente 3 bullets de dolores cuantificados:
  - Procesos manuales: "2-4 h/día picando facturas/albaranes" 
  - Factura cloud: "AWS/Azure subió >30% sin explicación"
  - Forecasting: "Previsiones Excel fallan 20-30%"
* [ ] **CA-3:** Cada bullet con icono ❌ 
* [ ] **CA-4:** Texto lenguaje P&L (no técnico)
* [ ] **CA-5:** Título sección "¿Te pasa esto?"

## 3. Definición de Hecho (DoD)
* [ ] **DoD-1:** Sección visible tras hero
* [ ] **DoD-2:** 3 bullets hardcoded (no CMS S1)
* [ ] **DoD-3:** Componente `<PainPoints>` creado
* [ ] **DoD-4:** Test `pain-points.spec.ts` PASANDO
* [ ] **DoD-5:** Fondo gris #F9FAFB para contraste
* [ ] **DoD-6:** Mobile sin scroll horizontal

## 4. Archivos Afectados
**Crear (Imprescindible):**
* `profesional-web/components/PainPoints.tsx`: Componente sección dolores
* `profesional-web/__tests__/components/pain-points.spec.ts`: Tests unitarios

**Modificar:**
* `profesional-web/app/page.tsx`: Incluir PainPoints tras Hero

## 5. Plan TDD (Definido por el Manager)
Ejecuta estos pasos en orden:

### Paso 1: Tests PainPoints Component (RED)
1.  **Test 1:** Crear `__tests__/components/pain-points.spec.ts`
2.  **Test:** Renderiza título "¿Te pasa esto?"
3.  **Test:** Renderiza exactamente 3 bullets de dolor
4.  **Test:** Cada bullet contiene icono ❌
5.  **Test:** Textos específicos de cada dolor (procesos, cloud, forecasting)

### Paso 2: Implementación PainPoints (GREEN)
1.  **Crear:** `components/PainPoints.tsx`
2.  **Implementar:** Estructura con título + 3 bullets
3.  **Implementar:** Iconos ❌ (usar Lucide React X icon)
4.  **Implementar:** Fondo gris #F9FAFB
5.  **Implementar:** Responsive design sin scroll horizontal

### Paso 3: Integración en Landing (GREEN)
1.  **Modificar:** `app/page.tsx` para incluir PainPoints
2.  **Posicionar:** Inmediatamente después del Hero
3.  **Verificar:** Orden correcto Hero → PainPoints

### Paso 4: Validación Responsive (REFACTOR)
1.  **Verificar:** Mobile responsive sin scroll horizontal
2.  **Ajustar:** Espaciado y tipografía según Shadcn/ui
3.  **Validar:** Contraste adecuado con fondo gris

## 6. Especificaciones de Diseño

### 6.1 Contenido Exacto (Hardcoded S1)
```tsx
const painPoints = [
  {
    id: 1,
    text: "2-4 h/día picando facturas/albaranes",
    category: "Procesos manuales"
  },
  {
    id: 2, 
    text: "AWS/Azure subió >30% sin explicación",
    category: "Factura cloud"
  },
  {
    id: 3,
    text: "Previsiones Excel fallan 20-30%", 
    category: "Forecasting"
  }
];
```

### 6.2 Estilos y Layout
```tsx
// Fondo específico
backgroundColor: '#F9FAFB'

// Iconos
import { X } from 'lucide-react'

// Responsive
- Desktop: 3 columnas o lista vertical
- Mobile: 1 columna, sin overflow horizontal
```

### 6.3 Estructura HTML
```tsx
<section className="bg-[#F9FAFB] py-16">
  <div className="container mx-auto px-4">
    <h2>¿Te pasa esto?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {painPoints.map(point => (
        <div key={point.id}>
          <X className="text-red-500" />
          <p>{point.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

## 7. Instrucciones de Respuesta
1.  Itera siguiendo el ciclo RED-GREEN-REFACTOR.
2.  Mantén consistencia con Shadcn/ui y Tailwind CSS v4.
3.  Usa Next.js 16 App Router estructura existente.
4.  Al finalizar, **genera obligatoriamente el informe**:
    * Ruta: `docs/issues/FJG-39-seccion-dolores-cuantificados/FJG-39-informe-implementacion.md`
    * Contenido: Resumen de cambios, Tests ejecutados, Decisiones técnicas.

## 8. Contexto Técnico Específico
* **Framework:** Next.js 16 con App Router
* **Styling:** Tailwind CSS v4, estilo Shadcn/ui existente
* **Testing:** Vitest + Testing Library (estructura ya configurada)
* **Iconos:** Lucide React (ya instalado)
* **Responsive:** Mobile-first approach
* **Lenguaje:** P&L business language, no técnico

---
**Nota del Manager:** Esta es una sección de alta conversión. Mantén el texto exacto y la cuantificación específica para máximo impacto emocional.