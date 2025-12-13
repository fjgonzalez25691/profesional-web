# Mejoras Identificadas para v2 - Espaciado y Microinteracciones

**Versión actual:** v0 (básica funcional)
**Fecha identificación:** 13 de diciembre de 2025
**Contexto:** FJG-102 - Primera iteración de mejora de espaciado y microinteracciones

---

## 🎯 Puntos Identificados para Refinado v2

### 1. **Animaciones de Entrada (Scroll Reveal)**

**Descripción:**
Las cards y secciones podrían aparecer con animaciones suaves al hacer scroll y entrar en el viewport.

**Ejemplo deseado:**
- Cards de CaseGrid con fade-in + slide-up al scrollear
- PainPoints con stagger animation (aparecen secuencialmente)
- Efecto sutil que mejora percepción de fluidez

**Por qué NO se hace en v0:**
- Requiere librería adicional (Framer Motion, AOS, o IntersectionObserver custom)
- Añade complejidad JavaScript innecesaria para MVP
- Riesgo de over-engineering si no se ajusta correctamente

**Prioridad:** Media
**Esfuerzo estimado:** 2-3 horas
**Dependencias:** Decisión sobre librería de animación (Framer Motion preferido)

**Código de referencia (futuro):**
```tsx
// Ejemplo con Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  <Card>...</Card>
</motion.div>
```

---

### 2. **Indicador Visual de Sección Activa en Header**

**Descripción:**
Highlight dinámico en la navegación del Header que indica en qué sección está actualmente el usuario.

**Ejemplo deseado:**
- Barra inferior o cambio de color en link de navegación activo
- Smooth scroll con IntersectionObserver
- Feedback visual que ayuda a orientación del usuario

**Por qué NO se hace en v0:**
- Header sticky ya implementado en FJG-100, cambios requieren regresión testing
- Requiere lógica JavaScript adicional (IntersectionObserver + state)
- No es crítico para percepción de "cuidado profesional" en v0

**Prioridad:** Baja
**Esfuerzo estimado:** 1-2 horas
**Dependencias:** Revisar implementación actual de Header (FJG-100)

**Código de referencia (futuro):**
```tsx
// Hook personalizado para detectar sección activa
const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observar secciones...
  }, []);

  return activeSection;
};
```

---

### 3. **Espaciado Fino en Footer**

**Descripción:**
Revisar grid interno del Footer, alineación de links y espaciado entre columnas.

**Problemas identificados:**
- Footer actual tiene diseño básico sin gaps explícitos
- Columnas de links podrían tener mejor alineación vertical
- Padding vertical (`py-8`) funciona, pero interno puede mejorar

**Por qué NO se hace en v0:**
- Footer no es sección crítica para conversión en landing
- Espaciado actual es funcional, no genera roturas
- Requiere análisis específico de UX que escapa alcance v0

**Prioridad:** Baja
**Esfuerzo estimado:** 30-45 minutos
**Dependencias:** Ninguna

**Cambios sugeridos (futuro):**
```tsx
// Footer mejorado v2
<footer className="... py-8">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="space-y-3">
        {/* Links con spacing consistente */}
      </div>
    </div>
  </div>
</footer>
```

---

### 4. **Hover States en Badges y Labels Informativos**

**Descripción:**
Evaluar si badges de sector, categorías y labels necesitan feedback visual al hover.

**Pregunta abierta:**
- ¿Es necesario hover en elementos puramente informativos (no clicables)?
- Ejemplo: Badge "Logística" en CaseGrid, categoría "Procesos manuales" en PainPoints

**Por qué NO se decide en v0:**
- Badges actuales NO son interactivos (no tienen onClick)
- Añadir hover sin acción puede confundir al usuario
- Decisión de UX que requiere feedback de Fran tras v0

**Prioridad:** Por definir
**Esfuerzo estimado:** 15-20 minutos (si se decide hacerlo)
**Dependencias:** Feedback visual de v0 con Fran

**Opciones futuras:**
1. **No añadir hover:** Mantener badges como elementos estáticos
2. **Hover sutil sin scale:** Solo cambio de brillo/opacidad
3. **Hacer badges clicables:** Filtrar casos por sector (requiere lógica adicional)

---

### 5. **Microinteracciones Avanzadas en MethodologySection**

**Descripción:**
PhaseCards de metodología tienen layout de timeline complejo que podría beneficiarse de animaciones específicas.

**Mejoras sugeridas:**
- Hover en PhaseCard podría mostrar tooltip con más info
- Timeline visual animada (línea de progreso)
- Badge "Simplicidad" con pequeña animación al hover

**Por qué NO se hace en v0:**
- MethodologySection ya tiene diseño distintivo (timeline)
- Cambios requieren revisar toda la estructura del componente
- No es crítico para percepción de mejora v0

**Prioridad:** Baja
**Esfuerzo estimado:** 2-3 horas
**Dependencias:** Diseño UX de timeline mejorado

---

### 6. **Padding Horizontal en Mobile Extremo (<360px)**

**Descripción:**
Evaluar si viewports muy pequeños (<360px) necesitan padding reducido para maximizar contenido visible.

**Propuesta:**
```tsx
// Responsive padding más fino
className="px-4 sm:px-6 lg:px-8"
```

**Por qué NO se hace en v0:**
- Patrón actual `px-6` es seguro y funciona bien en mayoría de dispositivos
- Analytics NO muestran tráfico significativo en <360px
- Optimización prematura sin datos reales

**Prioridad:** Muy baja
**Esfuerzo estimado:** 30 minutos
**Dependencias:** Analytics de tamaños de viewport reales

---

### 7. **Transiciones en Cambio de Tema (Olive ↔ Navy)**

**Descripción:**
Actualmente el cambio de tema es instantáneo. Podría ser más suave con transición CSS.

**Ejemplo deseado:**
```css
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

**Por qué NO se hace en v0:**
- Tema implementado en FJG-99, cambios requieren regresión testing
- Transición global en `*` puede causar performance issues
- Toggle de tema NO es interacción frecuente (no justifica esfuerzo v0)

**Prioridad:** Baja
**Esfuerzo estimado:** 1 hora
**Dependencias:** Revisar implementación de tema (FJG-99)

---

## 📊 Resumen de Prioridades

| Mejora | Prioridad | Esfuerzo | Bloqueador | Decisión Fran Requerida |
|--------|-----------|----------|------------|-------------------------|
| 1. Scroll Reveal Animations | Media | 2-3h | Elección librería | No |
| 2. Header Active Indicator | Baja | 1-2h | Regresión Header | No |
| 3. Footer Spacing Fino | Baja | 30-45min | - | No |
| 4. Badges Hover | Por definir | 15-20min | - | **Sí** |
| 5. MethodologySection Advanced | Baja | 2-3h | Diseño UX | Sí |
| 6. Mobile Extreme Padding | Muy baja | 30min | Analytics | No |
| 7. Theme Transition | Baja | 1h | Regresión Tema | No |

---

## ✅ Decisión para v0

**Se dejan explícitamente para v2:**
- Todas las mejoras listadas arriba
- Cualquier animación scroll-based
- Cualquier refactor de componentes ya implementados (Header, Footer, Tema)

**Justificación:**
- v0 busca mejora perceptible, NO perfección pixel-perfect
- Simplicidad > complejidad (navaja de Ockham)
- Feedback de Fran en v0 guiará prioridades v2

---

## 📝 Próximos Pasos (Post-v0)

1. **Fran revisa v0 visualmente**
2. **Fran decide:**
   - ¿Qué mejora de v2 priorizar primero?
   - ¿Badges deben tener hover o no?
   - ¿Vale la pena invertir en scroll reveal animations?
3. **Se crea issue FJG-XXX para v2** con prioridades definidas

---

**Archivo creado en:** `MEJORAS_V2_SPACING_MICROINTERACTIONS.md`
**Mantener actualizado:** Sí (añadir nuevas ideas que surjan post-v0)
