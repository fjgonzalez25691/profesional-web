# FJG-99: Sistema de Temas + Exploración 2 Paletas (Switch)

## Context from Linear

**Issue:** https://linear.app/fjgaparicio/issue/FJG-99/us-02-005-sistema-de-temas-exploracion-de-2-paletas-switch-de-colores

**Branch:** `fjgonzalez25691-fjg-99-us-02-005-sistema-de-temas-exploracion-de-2-paletas-switch`

**Descripción:**
Como Fran, quiero disponer de un sistema de temas con dos paletas (Olive híbrida y Navy) y un switch para alternar entre ellas sin tocar código, para explorar qué combinación se alinea mejor con mi posicionamiento antes de fijar una opción por defecto.

## Objetivo

Implementar un sistema de temas con:
1. **Dos paletas definidas:** Olive híbrida y Navy
2. **Switch funcional:** Alternar entre paletas sin editar código
3. **Persistencia:** La elección no se pierde al recargar
4. **Impacto visual claro:** Al menos en Hero y una sección de contenido
5. **Decisión provisional documentada:** Comentario en issue con paleta preferida + motivos

## Paletas Definidas

### Paleta Olive Híbrida
```css
/* Primarios */
--primary-950: #0e1210;
--primary-900: #181d1a;
--primary-800: #222b24;
--primary-700: #2e3d34;
--primary-600: #3a4f42;
--primary-500: #465a3a;
--primary-400: #55704a;
--primary-300: #678b5a;

/* Acentos Oro/ROI */
--accent-gold-500: #d4af37;
--accent-gold-400: #fbbf24;

/* Acentos Teal */
--accent-teal-500: #00a8a8;
--accent-teal-400: #00d4d4;

/* Acento Sage */
--accent-sage: #9ccc65;

/* Superficies */
--surface-950: #121610;
--surface-900: #1c231e;
--surface-800: #272f2a;
--surface-700: #39423b;

/* Texto */
--text-primary: #f0f5f0;
--text-secondary: #cdd4cb;
--text-muted: #9aa89a;
```

### Paleta Navy
```css
/* Primarios */
--primary-950: #020617;
--primary-900: #0a1929;
--primary-800: #0f2744;
--primary-700: #1a3a5c;
--primary-600: #1e4976;
--primary-500: #005f73;
--primary-400: #0a7a8f;
--primary-300: #0097a7;

/* Acentos Teal/Cian */
--accent-500: #00bcd4;
--accent-400: #00d4ff;
--accent-300: #26c6da;

/* Acentos Oro */
--gold-500: #f59e0b;
--gold-400: #fbbf24;

/* Superficies */
--surface-950: #0f172a;
--surface-900: #1e293b;
--surface-800: #334155;
--surface-700: #475569;
--surface-50: #f8fafc;

/* Texto */
--text-primary: #f8fafc;
--text-secondary: #cbd5e1;
--text-muted: #94a3b8;
```

## Nota Técnica CRÍTICA: Tailwind CSS v4.x

**⚠️ ADVERTENCIA:** Este proyecto usa Tailwind CSS v4.x. Las variables CSS y el sistema de temas se implementan de forma diferente a v3.

**Reglas obligatorias:**
1. NO usar `theme()` de v3 sin verificar compatibilidad v4
2. NO asumir que patrones de v3 funcionan sin revisar docs v4
3. Declarar variables CSS custom properties en `@theme` (v4)
4. Usar `var(--nombre)` para consumir tokens
5. Verificar que clases Tailwind se generan correctamente con las custom properties

**Referencias:**
- Tailwind v4 docs: https://tailwindcss.com/blog/tailwindcss-v4-alpha
- CSS variables en v4: https://tailwindcss.com/docs/customizing-colors#using-css-variables

## Plan TDD (Paso a Paso)

### Fase 1: Setup del Sistema de Temas

#### Test 1.1: Definir tokens CSS para ambas paletas
**RED:**
```typescript
// __tests__/theme.test.ts
describe('Theme System', () => {
  it('should define olive theme tokens', () => {
    const root = document.documentElement;
    root.dataset.theme = 'olive';
    
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-500');
    expect(primaryColor.trim()).toBe('#465a3a');
  });

  it('should define navy theme tokens', () => {
    const root = document.documentElement;
    root.dataset.theme = 'navy';
    
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary-500');
    expect(primaryColor.trim()).toBe('#005f73');
  });
});
```

**GREEN:**
- Crear archivo `app/globals.css` o modificar el existente
- Definir `@theme` para ambas paletas según Tailwind v4.x
- Implementar sistema `[data-theme="olive"]` y `[data-theme="navy"]` en `:root`

**REFACTOR:**
- Organizar tokens por categoría (primarios, acentos, superficies, texto)
- Documentar en comentarios la estructura

#### Test 1.2: Hook de React para gestión de tema
**RED:**
```typescript
// __tests__/useTheme.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default theme as olive', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('olive');
  });

  it('should toggle theme from olive to navy', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('navy');
    });
    
    expect(result.current.theme).toBe('navy');
  });

  it('should persist theme in localStorage', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('navy');
    });
    
    expect(localStorage.getItem('theme')).toBe('navy');
  });

  it('should apply theme to document element', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('navy');
    });
    
    expect(document.documentElement.dataset.theme).toBe('navy');
  });
});
```

**GREEN:**
- Crear `hooks/useTheme.ts`
- Implementar lógica de estado local + localStorage
- Aplicar `data-theme` a `document.documentElement`

**REFACTOR:**
- Agregar TypeScript types: `type Theme = 'olive' | 'navy'`
- Añadir función helper para leer tema inicial de localStorage

### Fase 2: Componente Switch de Tema

#### Test 2.1: Componente ThemeToggle UI
**RED:**
```typescript
// __tests__/components/ThemeToggle.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';

describe('ThemeToggle Component', () => {
  it('should render toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show current theme label', () => {
    render(<ThemeToggle />);
    expect(screen.getByText(/olive|navy/i)).toBeInTheDocument();
  });

  it('should change theme on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    
    const initialTheme = document.documentElement.dataset.theme;
    fireEvent.click(button);
    const newTheme = document.documentElement.dataset.theme;
    
    expect(newTheme).not.toBe(initialTheme);
  });
});
```

**GREEN:**
- Crear `components/ThemeToggle.tsx`
- Usar hook `useTheme`
- Implementar botón con icono/label
- Añadir estilos con Tailwind

**REFACTOR:**
- Hacer accesible (aria-label, role)
- Añadir animación de transición suave
- Responsive (mobile-friendly)

#### Test 2.2: Visibilidad del Switch (SOLO Admin Dashboard)
**RED:**
```typescript
it('should be visible only in admin dashboard', () => {
  // Simular autenticación en /admin
  render(<AdminPage />);
  
  const toggle = screen.getByRole('button', { name: /theme|tema/i });
  expect(toggle).toBeVisible();
});

it('should NOT be visible in public pages', () => {
  render(<HomePage />);
  
  const toggle = screen.queryByRole('button', { name: /theme|tema/i });
  expect(toggle).not.toBeInTheDocument();
});
```

**GREEN:**
- Colocar `<ThemeToggle />` SOLO en `app/admin/page.tsx` (dashboard admin)
- NO incluirlo en `app/layout.tsx` ni páginas públicas
- Posicionamiento: dentro del dashboard admin (no fixed global)

**REFACTOR:**
- Hacer visualmente integrado en el diseño del dashboard
- Añadir label claro: "Testing paleta de colores"

### Fase 3: Integración en Admin Dashboard

#### Test 3.1: ThemeToggle solo en Admin
**RED:**
```typescript
// __tests__/app/admin/page.test.tsx
it('should render ThemeToggle in admin dashboard', () => {
  render(<AdminDashboard />);
  
  expect(screen.getByRole('button', { name: /theme|tema/i })).toBeInTheDocument();
});

it('should NOT render in public layout', () => {
  render(<RootLayout><HomePage /></RootLayout>);
  
  expect(screen.queryByRole('button', { name: /theme|tema/i })).not.toBeInTheDocument();
});
```

**GREEN:**
- Modificar `app/admin/page.tsx` (dashboard admin)
- Agregar `<ThemeToggle />` dentro del dashboard (no en layout global)
- Inicializar tema por defecto ('olive') con script inline en `app/layout.tsx`

**REFACTOR:**
- Script inline en layout para evitar flash (leer localStorage antes de render)
- Documentar que el switch es privado (solo admin/testing)

### Fase 4: Aplicación Visual de Temas a TODA la Web

**⚠️ IMPORTANTE:** Los tokens de tema deben aplicarse a TODOS los componentes y páginas, no solo a Hero. El cambio de paleta debe ser global, coherente y visible en toda la experiencia del usuario.

#### Test 4.1: Cambio visual global en toda la web
**RED:**
```typescript
// __tests__/e2e/theme.spec.ts (Playwright)
test('all sections change color on theme switch', async ({ page }) => {
  await page.goto('/');
  
  // Capturar colores iniciales de múltiples secciones
  const heroBg = await page.locator('section[data-testid="hero"]').evaluate(
    el => getComputedStyle(el).backgroundColor
  );
  
  const painPointBg = await page.locator('[data-testid="pain-points"]').evaluate(
    el => getComputedStyle(el).backgroundColor
  );
  
  const footerBg = await page.locator('footer').evaluate(
    el => getComputedStyle(el).backgroundColor
  );
  
  // Cambiar a navy
  await page.click('[data-testid="theme-toggle"]');
  
  // Verificar que TODAS las secciones cambiaron
  const newHeroBg = await page.locator('section[data-testid="hero"]').evaluate(
    el => getComputedStyle(el).backgroundColor
  );
  expect(heroBg).not.toBe(newHeroBg);
  
  const newPainPointBg = await page.locator('[data-testid="pain-points"]').evaluate(
    el => getComputedStyle(el).backgroundColor
  );
  expect(painPointBg).not.toBe(newPainPointBg);
  
  const newFooterBg = await page.locator('footer').evaluate(
    el => getComputedStyle(el).backgroundColor
  );
  expect(footerBg).not.toBe(newFooterBg);
});
```

**GREEN:**
- Modificar **TODOS** los componentes para usar tokens CSS:
  - `components/Hero.tsx`
  - `components/PainPoints.tsx`
  - `components/CaseGrid.tsx`
  - `components/ROICalculator.tsx`
  - `components/Footer.tsx`
  - `components/ChatBot.tsx`
  - `components/CalendlyModal.tsx`
  - `app/calculadora/page.tsx`
  - `app/admin/page.tsx`
  - Cualquier otro componente con colores hardcodeados

- Reemplazar **TODOS** los colores hardcodeados por tokens CSS:
  - `bg-[#0e1210]` → `bg-[var(--primary-950)]` o clase Tailwind con token
  - `text-[#d4af37]` → `text-[var(--accent-gold-500)]`
  - `border-[#465a3a]` → `border-[var(--primary-500)]`
  - etc.

**REFACTOR:**
- Crear patrón consistente de uso de tokens en todos los componentes
- Documentar qué token usar para cada tipo de elemento (backgrounds, text, borders, accents)

#### Test 4.2: Consistencia visual entre componentes
**RED:**
```typescript
test('all components use consistent theme tokens', async ({ page }) => {
  await page.goto('/');
  
  // Cambiar a navy
  await page.click('[data-testid="theme-toggle"]');
  
  // Verificar que no hay elementos con colores hardcodeados (todos usan tokens)
  const allElements = await page.locator('*').all();
  
  // Este test falla si hay elementos que no responden al cambio de tema
  // (porque tienen colores hardcodeados en lugar de tokens)
});
```

**GREEN:**
- Revisar sistemáticamente cada componente
- Asegurar que NO queden colores hardcodeados
- Todos los elementos visuales deben usar tokens CSS

**REFACTOR:**
- Crear guía de uso de tokens (cuál usar para qué)
- Documentar el mapeo de colores antiguos → tokens nuevos

### Fase 5: Persistencia y Estado Global

#### Test 5.1: Tema persiste tras reload
**RED:**
```typescript
// __tests__/e2e/theme-persistence.spec.ts
test('theme persists after page reload', async ({ page }) => {
  await page.goto('/');
  
  // Cambiar a navy
  await page.click('[data-testid="theme-toggle"]');
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('navy');
  
  // Reload
  await page.reload();
  
  // Verificar que sigue siendo navy
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('navy');
});
```

**GREEN:**
- Ya implementado en `useTheme` con localStorage
- Verificar script inline en layout para evitar flash

**REFACTOR:**
- Añadir fallback si localStorage no disponible (ej: cookies)

### Fase 6: Documentación de Decisión Provisional

#### Acción Final (no test)
- Al terminar la implementación, probar ambas paletas en la web
- Evaluar:
  - Legibilidad
  - Alineación con posicionamiento P&L
  - Contraste y accesibilidad
  - Tono profesional vs startup
- Escribir comentario en Linear FJG-99 con:
  - Paleta preferida (provisional)
  - 2-3 motivos concretos
  - Dudas/mejoras para futuro

## Criterios de Aceptación (de Linear)

1. ✅ Existen dos paletas definidas y utilizables
2. ✅ Desde la web se puede cambiar entre paletas con el switch, sin editar código (switch en /admin)
3. ✅ Al cambiar de paleta se aprecia cambio claro y coherente en **TODA la web** (no solo hero y una sección)
4. ✅ Hay comentario en issue Linear con paleta preferida + motivos

## Definition of Done (de Linear)

1. ✅ Dos temas configurados, switch funciona sin romper layout
2. ✅ Implementación validada contra Tailwind CSS v4.x (no patrones obsoletos v3)
3. ✅ Existe comentario documentando decisión provisional sobre paleta por defecto

## Archivos a Modificar/Crear

**Nuevos:**
- `hooks/useTheme.ts` (hook de gestión de tema)
- `components/ThemeToggle.tsx` (switch UI)
- `__tests__/theme.test.ts` (tests unitarios tema)
- `__tests__/useTheme.test.ts` (tests hook)
- `__tests__/components/ThemeToggle.test.tsx` (tests componente)
- `__tests__/e2e/theme.spec.ts` (tests E2E cambio visual)
- `__tests__/e2e/theme-persistence.spec.ts` (tests E2E persistencia)

**Modificados:**
- `app/globals.css` (definir tokens CSS con @theme v4)
- `app/layout.tsx` (agregar script inline para inicialización tema, NO incluir ThemeToggle)
- `app/admin/page.tsx` (agregar ThemeToggle SOLO aquí - privado para testing + aplicar tokens)
- `app/calculadora/page.tsx` (aplicar tokens de tema)
- `components/Hero.tsx` (aplicar tokens de tema)
- `components/PainPoints.tsx` (aplicar tokens de tema)
- `components/CaseGrid.tsx` (aplicar tokens de tema)
- `components/ROICalculator.tsx` (aplicar tokens de tema)
- `components/Footer.tsx` (aplicar tokens de tema)
- `components/ChatBot.tsx` (aplicar tokens de tema)
- `components/CalendlyModal.tsx` (aplicar tokens de tema)
- **TODOS los componentes con colores hardcodeados** (aplicar tokens de tema)

## Notas Importantes

1. **Tailwind v4.x:** Verificar CADA paso contra docs oficiales v4. NO asumir que patrones v3 funcionan.
2. **Simplicidad:** Esta US es exploratoria. No over-engineer. El objetivo es tener 2 paletas funcionando y tomar una decisión, no crear un sistema enterprise de temas.
3. **Navaja de Ockham:** Si algo se puede hacer con CSS simple en lugar de Context API complejo, hazlo simple.
4. **Human-in-the-loop:** Si encuentras conflicto entre este prompt y lo que ves en el código, PARAR y preguntar a Fran.
5. **⚠️ ACCESO RESTRINGIDO:** El ThemeToggle debe estar SOLO en `/admin` dashboard. NO visible para clientes. Fran quiere testear paletas con personas de confianza antes de decidir. El switch es una herramienta privada de testing, no una feature pública.

## Output Esperado

Al finalizar, genera el archivo `FJG-99-informe-implementacion.md` en esta carpeta con:
- Lista de archivos modificados/creados
- Resultado de tests (unitarios + E2E)
- Screenshots o descripción del cambio visual
- Decisión provisional sobre paleta preferida (si ya la tienes)
