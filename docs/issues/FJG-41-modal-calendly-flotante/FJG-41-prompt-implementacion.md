# FJG-41: Modal Calendly Flotante 2 Clics

**Fecha**: 2 diciembre 2025, 19:45  
**Agent Manager**: Iniciando implementación  
**Tipo**: Feature Implementation  
**Sprint**: Sprint 1 - "Tarjeta de Visita P&L"

---

## 📋 PROMPT PARA AGENT DEVELOPER

### 🎯 Objetivo
Implementar modal de Calendly flotante que mejore la experiencia de conversión con máximo 2 clics desde cualquier punto de la landing.

### 🔧 Especificaciones Técnicas

#### Modal Component con Radix UI
```typescript
// CalendlyModal.tsx - MIGRAR A RADIX UI
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoFocus?: boolean;
}
```

#### CTA Flotante Positioning (CORREGIDO según Linear)
1. **Floating CTA Button**:
   - **Desktop**: `fixed top-6 right-6` (sticky position)
   - **Mobile**: `fixed bottom-4 left-1/2 transform -translate-x-1/2` (bottom-center)
   - Texto: "Diagnóstico 30 min"
   - Responsive breakpoints específicos
   - z-index alto para estar sobre todo

2. **React-Calendly Integration**:
   - Instalar librería: `npm install react-calendly`
   - Usar componente `InlineWidget` dentro del modal
   - URL Calendly desde environment variable
   - Analytics events: `calendly_opened`, `calendly_booking_completed`

3. **Radix Dialog Requirements**:
   - Migrar modal existente a Radix UI Dialog
   - Accessibility automática (a11y)
   - Backdrop overlay oscuro semitransparente
   - Scroll página bloqueado cuando modal abierto
   - Cierre: [X], [ESC], clic fuera

3. **Accessibility (WCAG 2.1 AA)**:
   - ARIA labels correctos
   - Focus management completo
   - Keyboard navigation
   - Screen reader compatibility

4. **Performance**:
   - Lazy loading del iframe Calendly
   - Preload opcional en hover
   - Minimize layout shift

### 🎨 Design System Integration

#### CTA Styling (CORREGIDO según Linear)
```css
/* Desktop: Top-right sticky */
.calendly-cta-desktop {
  @apply fixed top-6 right-6 z-50;
  @apply bg-primary text-primary-foreground;
  @apply px-4 py-2 rounded-lg shadow-lg;
  @apply hidden md:flex items-center gap-2;
  @apply transition-all duration-200;
  @apply hover:scale-105 hover:shadow-xl;
}

/* Mobile: Bottom-center */
.calendly-cta-mobile {
  @apply fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50;
  @apply bg-primary text-primary-foreground;
  @apply px-6 py-3 rounded-full shadow-lg;
  @apply flex md:hidden items-center gap-2;
  @apply transition-all duration-200;
}
```

#### Radix Dialog Styling  
- Backdrop: `bg-black/50` (semitransparente)
- Container: `max-w-4xl max-h-[90vh]` responsive
- React-Calendly InlineWidget integrado

### 🧪 Testing Requirements

#### Unit Tests (CORREGIDO)
- [ ] FloatingCalendlyButton rendering en ambas posiciones
- [ ] Responsive behavior: desktop top-right, mobile bottom-center
- [ ] Radix Dialog integration functional
- [ ] React-calendly InlineWidget carga correctamente
- [ ] Analytics events: calendly_opened, calendly_booking_completed

#### Integration Tests
- [ ] FAB → Modal flow completo
- [ ] Multiple modal instances prevention
- [ ] Focus management en apertura/cierre
- [ ] Responsive behavior

#### E2E Tests (Playwright)
- [ ] User journey: FAB click → Calendly load → Schedule
- [ ] Mobile/Desktop responsive
- [ ] Performance metrics (CLS, LCP)

### 📱 Responsive Behavior

#### Desktop (≥768px)
- CTA top-right sticky: `fixed top-6 right-6`
- Modal centrado con Radix Dialog
- React-Calendly InlineWidget full size

#### Mobile (<768px)
- CTA bottom-center: `fixed bottom-4` centered
- Modal full-screen con padding mínimo
- InlineWidget optimizado mobile

#### Tablet (768px-1024px)
- FAB tamaño medio
- Modal adaptativo
- Consider orientation changes

### 🔌 Integration Points

#### Existing Components
```typescript
// app/page.tsx - ACTUALIZAR
import FloatingCalendlyButton from '@/components/FloatingCalendlyButton';

// Añadir FAB después del modal existente
<CalendlyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
<FloatingCalendlyButton onClick={() => setIsModalOpen(true)} />
```

#### Analytics Integration (CORREGIDO según Linear)
- Install react-calendly: `npm install react-calendly`
- Track CTA clicks: `calendly_opened`
- Track booking completions: `calendly_booking_completed` 
- Use environment variable for Calendly URL

### ⚡ Implementation Priority

#### Phase 1 (Core)
1. FloatingCalendlyButton component
2. Modal accessibility improvements  
3. Basic animations y UX

#### Phase 2 (Enhancement)
1. Advanced animations
2. Performance optimizations
3. Analytics events

#### Phase 3 (Polish)
1. Advanced responsive behavior
2. Micro-interactions
3. Error handling

### 🎯 Success Criteria

#### Functional
- [x] Modal existente funciona
- [ ] FAB funcional y accesible
- [ ] 2-click flow: FAB → Calendly form
- [ ] Modal dismissible (ESC, click outside)
- [ ] Focus management correcto

#### Performance  
- [ ] FAB no afecta CLS
- [ ] Modal animaciones smooth (60fps)
- [ ] Calendly iframe lazy loading

#### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation 100%
- [ ] Screen reader friendly

#### UX
- [ ] Intuitive FAB positioning
- [ ] Clear call-to-action
- [ ] No user confusion with existing CTA

---

## 🚀 INSTRUCCIONES ESPECÍFICAS

### Agent Developer Execution
1. **Analyizar código existente**: CalendlyModal.tsx, app/page.tsx
2. **Crear FloatingCalendlyButton**: Nuevo componente con FAB
3. **Mejorar CalendlyModal**: Accessibility + animations  
4. **Integrar en página**: Update app/page.tsx
5. **Testing completo**: Unit + Integration tests
6. **Documentation**: Component documentation

### Code Quality Standards
- TypeScript strict mode
- ESLint + Prettier compliance  
- Component composition over complex props
- Performance-first mindset
- Accessibility-first design

### Git Workflow
- Commits pequeños y descriptivos
- Tests pasando en cada commit
- Conventional commit messages
- Branch: `fjgonzalez25691-fjg-41-us-02-004-modal-calendly-flotante-2-clics`

---

**Agent Manager** 🎯  
*Ready for Agent Developer implementation*