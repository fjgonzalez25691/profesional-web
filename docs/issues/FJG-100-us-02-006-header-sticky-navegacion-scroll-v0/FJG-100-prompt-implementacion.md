# FJG-100: Header Sticky + Navegación con Scroll (v0, Integrado con Tema)

## Context from Linear

**Issue:** https://linear.app/fjgaparicio/issue/FJG-100/us-02-006-header-sticky-navegacion-con-scroll-v0-integrado-con-tema-de

**Branch:** `fjgonzalez25691-fjg-100-us-02-006-header-sticky-navegacion-con-scroll-v0-integrado`

**Descripción:**
Como Fran, administrador y propietario de la web, quiero que el header se mantenga visible y me permita navegar con claridad entre las secciones clave, para orientarme fácilmente, no perder el contexto mientras leo y poder ir rápido a lo que me interesa sin que la UI parezca un experimento a medias.

## Objetivo

Implementar una primera versión (v0) del header fijo con navegación que:

1. **Mejore la orientación del usuario**
2. **Se integre con el sistema de temas de color** definido en FJG-99/US-02-005 (paleta activa)
3. **No busque todavía un comportamiento perfecto** de scroll spy ni todos los detalles visuales cerrados

## Contexto Técnico: Integración con Sistema de Temas (FJG-99)

El header debe respetar la **paleta activa** del sistema de temas:

- **Tokens CSS disponibles:**
  - Fondos: `--surface-950`, `--surface-900`, `--surface-800`, `--surface-700`
  - Texto: `--text-primary`, `--text-secondary`, `--text-muted`
  - Primarios: `--primary-500`, `--primary-600`, `--primary-700`
  - Acentos: `--accent-teal-500`, `--accent-teal-400`, `--accent-gold-500`, `--accent-gold-400`

- **Paletas disponibles:**
  - **Olive Híbrida** (por defecto): Green/sage tones con gold accents
  - **Navy**: Blue/teal tones con cyan accents

- **Mecanismo de cambio:**
  - Atributo `data-theme="olive|navy"` en `<html>`
  - Tokens CSS definidos en `app/globals.css`
  - Hook `useTheme` disponible si se necesita estado en React

## Alcance

- [x] El header permanece visible (sticky) al hacer scroll
- [x] La navegación permite saltar a las secciones principales mediante scroll suave
- [x] En móvil existe un menú desplegable sencillo que no rompe el layout
- [x] El header utiliza los colores del **tema activo** para fondo, texto y CTA principal
- [x] Se deja abierta la posibilidad de afinar scroll spy y microinteracciones en historias posteriores

## Criterios de Aceptación (de Linear)

1. ✅ Al hacer scroll, el header sigue visible y legible, sin solaparse de forma grave con el contenido
2. ✅ Los enlaces del header llevan a las secciones correctas mediante scroll (el scroll spy no tiene por qué ser perfecto)
3. ✅ En móvil se puede abrir y cerrar el menú sin comportamientos rotos
4. ✅ El esquema de color del header es coherente con la paleta activa (no colores "huérfanos")

## Definition of Done (de Linear)

1. ✅ El header es sticky y la navegación principal funciona en desktop y móvil sin romper layout
2. ✅ El header utiliza los tokens de color del tema activo de forma coherente
3. ✅ Se ha verificado que el header se ve correctamente con ambas paletas (Olive/Navy)
4. ✅ Existe un comentario en la issue indicando:
   - Qué aspectos se dejan para futura iteración
   - Si se hicieron ajustes en tokens de color para legibilidad

## Plan TDD (Paso a Paso)

### Fase 1: Componente Header Básico

#### Test 1.1: Header renderiza con estructura básica
**RED:**
```typescript
// __tests__/components/Header.test.tsx
describe('Header Component', () => {
  it('should render header with navigation', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    render(<Header />);
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Casos/i)).toBeInTheDocument();
    expect(screen.getByText(/Metodología/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });
});
```

**GREEN:**
- Crear `components/Header.tsx`
- Estructura básica: `<header>` con `<nav>` y links
- Links a secciones: `#hero`, `#cases`, `#methodology`, `#contact`

**REFACTOR:**
- Extraer lista de links a constante
- Añadir tipos TypeScript

#### Test 1.2: Header usa tokens del tema activo
**RED:**
```typescript
it('should use theme tokens for styling', () => {
  render(<Header />);
  const header = screen.getByRole('banner');
  
  // Verificar que usa clases con tokens de tema
  expect(header.className).toMatch(/bg-surface-|text-text-/);
});
```

**GREEN:**
- Aplicar tokens CSS:
  - Background: `bg-surface-950` o `bg-surface-900/95`
  - Texto: `text-text-primary`
  - Border: `border-surface-700`

**REFACTOR:**
- Documentar qué tokens se usan y por qué

### Fase 2: Comportamiento Sticky

#### Test 2.1: Header se mantiene fijo al hacer scroll
**RED:**
```typescript
// __tests__/e2e/header.spec.ts (Playwright)
test('header stays visible on scroll', async ({ page }) => {
  await page.goto('/');
  
  // Verificar header visible inicialmente
  const header = page.locator('header[role="banner"]');
  await expect(header).toBeVisible();
  
  // Scroll down
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(300);
  
  // Header sigue visible
  await expect(header).toBeVisible();
});
```

**GREEN:**
- Añadir clase `sticky top-0` al header
- Añadir z-index alto: `z-50`
- Añadir backdrop blur para mejor legibilidad: `backdrop-blur-md`

**REFACTOR:**
- Ajustar opacidad del backdrop si es necesario
- Verificar que no solapa contenido de forma grave

### Fase 3: Navegación con Scroll Suave

#### Test 3.1: Click en link hace scroll a sección
**RED:**
```typescript
test('clicking navigation link scrolls to section', async ({ page }) => {
  await page.goto('/');
  
  // Click en "Casos"
  await page.click('a[href="#cases"]');
  await page.waitForTimeout(500);
  
  // Verificar que la sección está visible
  const casesSection = page.locator('#cases');
  await expect(casesSection).toBeInViewport();
});
```

**GREEN:**
- Añadir `scroll-behavior: smooth` a `html` en `globals.css`
- Links con `href="#section-id"`
- Asegurar que cada sección principal tiene `id` correspondiente:
  - Hero: `id="hero"`
  - PainPoints: `id="pain-points"`
  - CaseGrid: `id="cases"`
  - MethodologySection: `id="methodology"`
  - Footer: `id="contact"`

**REFACTOR:**
- Ajustar offset si el header solapa el inicio de la sección
- Considerar `scroll-margin-top` en secciones

#### Test 3.2: CTA principal en header funciona
**RED:**
```typescript
it('should render CTA button', () => {
  render(<Header />);
  const ctaButton = screen.getByRole('button', { name: /Agendar/i });
  expect(ctaButton).toBeInTheDocument();
});

test('CTA button opens Calendly modal', async ({ page }) => {
  await page.goto('/');
  
  // Click en CTA del header
  await page.click('header button:has-text("Agendar")');
  await page.waitForTimeout(300);
  
  // Verificar que modal se abre
  await expect(page.locator('[data-testid="calendly-modal"]')).toBeVisible();
});
```

**GREEN:**
- Añadir botón CTA en header
- Integrar con `<CalendlyModal />` existente
- Usar tokens de tema para el botón:
  - Background: `bg-accent-teal-500`
  - Hover: `hover:bg-accent-teal-400`
  - Text: `text-text-primary`

**REFACTOR:**
- Asegurar que el botón es accesible (aria-label)

### Fase 4: Menú Móvil

#### Test 4.1: Menú hamburguesa en móvil
**RED:**
```typescript
test('mobile menu toggles on hamburger click', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Menu cerrado inicialmente
  const mobileNav = page.locator('[data-testid="mobile-nav"]');
  await expect(mobileNav).toBeHidden();
  
  // Click en hamburger
  await page.click('[aria-label="Toggle menu"]');
  await page.waitForTimeout(300);
  
  // Menu abierto
  await expect(mobileNav).toBeVisible();
  
  // Click de nuevo para cerrar
  await page.click('[aria-label="Toggle menu"]');
  await page.waitForTimeout(300);
  
  // Menu cerrado
  await expect(mobileNav).toBeHidden();
});
```

**GREEN:**
- Añadir botón hamburguesa visible solo en móvil: `md:hidden`
- Estado local para controlar apertura: `useState<boolean>(false)`
- Renderizar nav móvil condicionalmente
- Nav móvil:
  - Fondo: `bg-surface-900`
  - Animación simple: `transition-transform duration-300`
  - Posición: `absolute` o `fixed`

**REFACTOR:**
- Añadir icono hamburguesa (SVG o caracteres Unicode)
- Cerrar menú al hacer click en un link
- Asegurar que no hay scroll del body cuando el menú está abierto

#### Test 4.2: Links móviles funcionan
**RED:**
```typescript
test('mobile nav links navigate correctly', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Abrir menú
  await page.click('[aria-label="Toggle menu"]');
  
  // Click en link
  await page.click('[data-testid="mobile-nav"] a[href="#cases"]');
  await page.waitForTimeout(500);
  
  // Verificar scroll + menú cerrado
  await expect(page.locator('#cases')).toBeInViewport();
  await expect(page.locator('[data-testid="mobile-nav"]')).toBeHidden();
});
```

**GREEN:**
- Handler `onClick` en links móviles que cierra el menú
- Mismo comportamiento de scroll suave que desktop

**REFACTOR:**
- Extraer lógica de navegación a función reutilizable

### Fase 5: Integración con Layout

#### Test 5.1: Header se integra en layout sin romper
**RED:**
```typescript
test('header does not break page layout', async ({ page }) => {
  await page.goto('/');
  
  // Verificar que todas las secciones son visibles
  await expect(page.locator('#hero')).toBeVisible();
  await expect(page.locator('#pain-points')).toBeVisible();
  await expect(page.locator('#cases')).toBeVisible();
});
```

**GREEN:**
- Integrar `<Header />` en `app/layout.tsx` antes de `{children}`
- Asegurar que el header no solapa el contenido de forma grave

**REFACTOR:**
- Ajustar `padding-top` del contenido si es necesario

### Fase 6: Verificación de Paletas

#### Test 6.1: Header legible en ambas paletas
**RED:**
```typescript
test('header is readable in olive theme', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.dataset.theme = 'olive');
  
  const header = page.locator('header');
  const bgColor = await header.evaluate(el => getComputedStyle(el).backgroundColor);
  const textColor = await header.evaluate(el => getComputedStyle(el).color);
  
  // Verificar que no son transparentes ni idénticos
  expect(bgColor).toBeTruthy();
  expect(textColor).toBeTruthy();
  expect(bgColor).not.toBe(textColor);
});

test('header is readable in navy theme', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.dataset.theme = 'navy');
  
  const header = page.locator('header');
  const bgColor = await header.evaluate(el => getComputedStyle(el).backgroundColor);
  const textColor = await header.evaluate(el => getComputedStyle(el).color);
  
  expect(bgColor).toBeTruthy();
  expect(textColor).toBeTruthy();
  expect(bgColor).not.toBe(textColor);
});
```

**GREEN:**
- Verificar visualmente el header con ambas paletas
- Si hay problemas de legibilidad:
  - Ajustar tokens: ej. usar `--surface-900` en lugar de `--surface-950`
  - Añadir backdrop blur más fuerte
  - Aumentar opacidad del fondo

**REFACTOR:**
- Documentar ajustes realizados para legibilidad

### Fase 7: Documentación de Iteraciones Futuras

**Acción Final (no test):**
- Al terminar la implementación, añadir comentario en Linear FJG-100:
  - **Aspectos para futura iteración:**
    - Scroll spy activo (highlight del link correspondiente a la sección visible)
    - Animaciones de entrada/salida del header al scroll
    - Transiciones de color más suaves entre temas
    - Ajustes de offset precisos para cada sección
    - Estados de hover más elaborados
  - **Ajustes de tokens realizados:**
    - (Listar cualquier cambio en tokens CSS para mejorar legibilidad del header)

## Archivos a Modificar/Crear

**Nuevos:**
- `components/Header.tsx` (componente header sticky)
- `__tests__/components/Header.test.tsx` (tests unitarios)
- `__tests__/e2e/header.spec.ts` (tests E2E navegación y sticky)

**Modificados:**
- `app/layout.tsx` (integrar Header)
- `app/globals.css` (añadir `scroll-behavior: smooth`, ajustar tokens si necesario)
- `components/Hero.tsx` (añadir `id="hero"` si no existe)
- `components/PainPoints.tsx` (añadir `id="pain-points"` si no existe)
- `components/CaseGrid.tsx` (añadir `id="cases"` si no existe)
- `components/MethodologySection.tsx` (añadir `id="methodology"` si no existe)
- `components/Footer.tsx` (añadir `id="contact"` si no existe)

## Notas Importantes

1. **Versión v0 (MVP):** No buscar perfección en scroll spy ni microinteracciones. Objetivo: funcionalidad básica + coherencia visual con temas.

2. **Tokens CSS:** Usar SIEMPRE los tokens del sistema de temas (FJG-99). NO hardcodear colores.

3. **Simplicidad (Navaja de Ockham):** Evitar librerías externas para scroll spy en esta v0. Usar solo CSS y JavaScript vanilla si es necesario.

4. **Mobile First:** El menú móvil debe ser funcional pero simple. No buscar animaciones complejas en esta iteración.

5. **Accesibilidad básica:** Asegurar que:
   - El header tiene `role="banner"`
   - La nav tiene `role="navigation"`
   - El botón hamburguesa tiene `aria-label="Toggle menu"`
   - Los links tienen texto descriptivo

6. **Human-in-the-loop:** Si encuentras conflicto entre este prompt y Linear, PARAR y preguntar a Fran.

## Output Esperado

Al finalizar, genera el archivo `FJG-100-informe-implementacion.md` en esta carpeta con:
- Lista de archivos modificados/creados
- Resultado de tests (unitarios + E2E)
- Screenshots o descripción visual del header en ambas paletas
- Lista de aspectos dejados para futura iteración
- Documentación de ajustes de tokens (si los hubo)
