# FJG-41: Modal Calendly Flotante 2 Clics - PROMPT REVISIÓN

**Fecha**: 2 diciembre 2025, 19:45  
**Agent Reviewer**: Criterios de validación  
**Issue**: FJG-41 - Modal Calendly Flotante  
**Developer Implementation**: Pendiente revisión

---

## 🔍 CRITERIOS DE REVISIÓN MANDATORY

### 📋 Functional Requirements Checklist

#### ✅ Core Functionality
- [ ] **FloatingCalendlyButton (CTA)**:
  - [ ] Desktop: `fixed top-6 right-6` (sticky)
  - [ ] Mobile: `fixed bottom-4` centered
  - [ ] Texto "Diagnóstico 30 min" visible
  - [ ] Click abre modal Calendly existente
  - [ ] z-index suficiente para estar sobre todo contenido
  - [ ] Estados hover/focus implementados

- [ ] **Radix Dialog Modal**:
  - [ ] Migrado de modal custom a Radix UI Dialog
  - [ ] react-calendly InlineWidget integrado
  - [ ] Backdrop semitransparente (no blur)
  - [ ] Scroll página bloqueado cuando abierto
  - [ ] ESC key cierra modal
  - [ ] Click outside cierra modal

#### ✅ Responsive Design
- [ ] **Desktop (≥768px)**: CTA `top-6 right-6`, modal centrado
- [ ] **Mobile (<768px)**: CTA `bottom-4` centered, modal full-screen adaptativo
- [ ] **Tablet (768px-1024px)**: Comportamiento intermedio
- [ ] FAB no interfiere con scroll o contenido

#### ✅ Accessibility (WCAG 2.1 AA)
- [ ] **Focus Management**:
  - [ ] FAB recibe focus con Tab navigation
  - [ ] Modal abre con focus trap activado
  - [ ] Al cerrar modal, focus vuelve a FAB
  - [ ] Orden de tabulación lógico

- [ ] **ARIA Implementation**:
  - [ ] FAB tiene `aria-label="Agendar cita"` o similar
  - [ ] Modal tiene `role="dialog"` y `aria-modal="true"`
  - [ ] Modal tiene `aria-labelledby` con título
  - [ ] FAB tiene estados `aria-expanded` si aplica

- [ ] **Keyboard Support**:
  - [ ] FAB activable con Enter y Space
  - [ ] ESC cierra modal desde cualquier elemento interno
  - [ ] Tab navigation funciona dentro del modal
  - [ ] No focus trapping cuando modal cerrado

### 🧪 Testing Requirements Validation

#### ✅ Unit Tests (Vitest)
- [ ] **FloatingCalendlyButton Tests**:
  - [ ] Renderiza con props correctas
  - [ ] onClick callback ejecuta correctamente
  - [ ] Estilos responsive aplicados
  - [ ] ARIA attributes correctos

- [ ] **CalendlyModal Enhanced Tests**:
  - [ ] Backdrop blur CSS presente
  - [ ] Animaciones CSS definidas
  - [ ] Focus management funciona
  - [ ] ESC y click outside handlers

- [ ] **Integration Tests**:
  - [ ] FAB + Modal flow completo
  - [ ] Estado `isOpen` se maneja correctamente
  - [ ] No multiple modals simultáneos

#### ✅ Component API Design
```typescript
// FloatingCalendlyButton.tsx - VALIDAR INTERFACE
interface FloatingCalendlyButtonProps {
  onClick: () => void;
  className?: string;
  'aria-label'?: string;
}

// CalendlyModal.tsx - VALIDAR MEJORAS  
interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoFocus?: boolean; // NUEVO
  showBackdrop?: boolean; // NUEVO
}
```

### 🎨 Design System Compliance

#### ✅ Visual Design
- [ ] **FAB Styling**:
  - [ ] Usa colores del design system (`bg-primary`, `text-primary-foreground`)
  - [ ] Shadow elevation apropiada (`shadow-lg`)
  - [ ] Border radius consistente (`rounded-full`)
  - [ ] Transitions smooth (`transition-all duration-200`)

- [ ] **Modal Styling**:
  - [ ] Backdrop: `bg-black/50 backdrop-blur-sm`
  - [ ] Container responsive: `max-w-4xl max-h-[90vh]`
  - [ ] Padding/margin consistente con design system

#### ✅ Performance Validation
- [ ] **Bundle Impact**:
  - [ ] No dependencias pesadas añadidas
  - [ ] Tree shaking friendly exports
  - [ ] CSS optimizado (no estilos redundantes)

- [ ] **Runtime Performance**:
  - [ ] Animaciones no causan layout thrashing
  - [ ] Event listeners se cleanup correctamente
  - [ ] No memory leaks en mount/unmount

### 🔌 Integration Validation

#### ✅ Page Integration (app/page.tsx)
- [ ] **Import correctos**:
  - [ ] FloatingCalendlyButton importado
  - [ ] No conflictos con imports existentes

- [ ] **State Management**:
  - [ ] `isModalOpen` state compartido entre CTA hero y FAB
  - [ ] No estado duplicado o conflictivo
  - [ ] Props passing correcto

- [ ] **Layout Impact**:
  - [ ] FAB no afecta layout de página
  - [ ] z-index no conflicta con otros elementos
  - [ ] No scroll blocking issues

#### ✅ Backwards Compatibility
- [ ] **Existing Functionality**:
  - [ ] CTA Hero button sigue funcionando
  - [ ] Modal existente mantiene todas las features
  - [ ] No breaking changes en props/API

### 🚫 REJECTION CRITERIA

#### ❌ Automatic Rejection If:
1. **Tests fallan**: Cualquier test unitario o de integración falla
2. **Accessibility incompleta**: Falta focus management o ARIA
3. **Responsive roto**: No funciona en mobile o desktop
4. **Performance issues**: Animaciones jittery o bundle size >50KB extra
5. **Integration broken**: Hero CTA deja de funcionar
6. **Missing components**: FloatingCalendlyButton no implementado

#### ⚠️ Review Required If:
1. **Design deviations**: Cambios al design system sin justificación
2. **API changes**: Modificaciones a CalendlyModal interface
3. **Testing coverage**: <90% coverage en nuevos componentes
4. **Accessibility edge cases**: Comportamiento inusual pero no roto

### 📊 Success Metrics Validation

#### ✅ User Experience
- [ ] **2-click flow**: FAB → Modal abierto (máximo 2 interacciones)
- [ ] **Intuitive positioning**: FAB no interfiere con contenido
- [ ] **Clear affordances**: Usuario entiende que FAB es clickeable
- [ ] **Smooth interactions**: No lag o jitter en animaciones

#### ✅ Technical Excellence
- [ ] **Code quality**: TypeScript strict, ESLint clean
- [ ] **Component composition**: Props interface clean y extensible
- [ ] **Performance**: No CLS, smooth 60fps animations
- [ ] **Maintainability**: Código documentado y testeable

---

## 🎯 VALIDATION WORKFLOW

### 1. **Code Review** (5 min)
- Scan component interfaces y props
- Verify integration en app/page.tsx
- Check imports y exports

### 2. **Testing Execution** (10 min)
```bash
npm test                    # Unit tests
npm run test:integration   # Integration tests
npm run dev               # Manual testing
```

### 3. **Accessibility Audit** (5 min)
- Tab navigation manual test
- ESC key behavior
- Screen reader compatibility (si disponible)

### 4. **Responsive Testing** (5 min)
- Desktop (1920x1080)
- Mobile (375x667)  
- Tablet (768x1024)

### 5. **Performance Check** (3 min)
- Bundle size impact
- Animation smoothness
- No console errors

---

## ✅ APPROVAL CRITERIA

**APPROVE SI:**
- ✅ Todos los tests pasan (Unit + Integration)
- ✅ Accessibility checklist 100% completo
- ✅ Responsive design funciona en 3 breakpoints
- ✅ FAB + Modal flow 2-click demostrado
- ✅ No breaking changes en funcionalidad existente

**REQUEST CHANGES SI:**
- ⚠️ Tests fallan pero son fixables
- ⚠️ Accessibility 80%+ pero falta algún detalle
- ⚠️ Performance acceptable pero mejorable
- ⚠️ Design minor deviations

**REJECT SI:**
- ❌ Funcionalidad core no implementada
- ❌ Breaking changes sin justificación
- ❌ Tests <70% passing
- ❌ Accessibility major issues

---

**Agent Reviewer** 🔍  
*Checklist ready for validation*