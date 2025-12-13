# FJG-103: Footer mejorado + CTA final (v0, sin menú lateral)

**Issue Linear:** https://linear.app/fjgaparicio/issue/FJG-103  
**Rol:** Developer  
**Prioridad:** Media  
**Estimación:** 1 Story Point  
**Dependencias:** FJG-99 (Tema), FJG-100 (Header), FJG-102 (Espaciado/microinteracciones)

---

## Contexto

La landing actual no tiene una última oportunidad de conversión antes del footer, y el footer existente es básico. Esta issue añade:
1. **CTA final:** Sección dedicada antes del footer con mensaje claro y botón de conversión
2. **Footer reorganizado:** Bloques claros (Contacto, Legal, Social) con información útil

**Se mantiene decisión:** NO menú lateral. Navegación = Header + Footer mejorado.

**v0 = iteración básica:** No se busca textos/links definitivos, solo estructura funcional y legible.

---

## Criterios de Aceptación (desde Linear)

```gherkin
Given que el usuario llega al final de la landing
When ve la sección de CTA final
Then tiene clara oportunidad de conversión antes del footer
And el footer muestra contacto, legal y canales principales
And en móvil el footer es legible sin roturas
And hay comentario indicando qué es provisional
And Fran aprueba visualmente
```

**CA Flexibles:**
- Sección CTA final diferenciada del contenido anterior
- Footer con bloques claros: Contacto, Legal, Social/Enlaces
- Móvil legible (no perfecto, solo no roto)
- Documentado qué es provisional para futuras iteraciones
- Aprobación visual de Fran

---

## Definition of Done (DoD)

1. Usuario tiene última oportunidad de conversión (CTA final) y acceso a contacto/legal
2. Footer sin problemas evidentes de usabilidad (scroll, clicks, legibilidad)
3. Comentario documentando partes v0 que pueden cambiar
4. Aprobación visual de estética

---

## Plan de Implementación (TDD)

### Fase 1: Análisis de Footer Actual (10 min)

**Acción:**
1. Leer componente `Footer.tsx` existente (si existe)
2. Identificar qué tiene actualmente
3. Documentar en `AUDIT_FOOTER.md` (temporal):
   - Estructura actual
   - Información que falta (contacto, legal, social)
   - Propuesta de bloques para v0

**Salida esperada:**
- Documento con análisis de estado actual y propuesta de estructura

**Tests:**
- N/A (fase de análisis)

---

### Fase 2: Diseñar Estructura CTA Final + Footer (15 min)

**Acción:**
1. Diseñar sección `FinalCTA` con:
   - Headline atractivo
   - Texto breve de valor
   - Botón principal (Calendly)
   - Background destacado (surface-900 o similar)
2. Diseñar Footer con 3 bloques:
   - **Contacto:** Email, teléfono (provisional si no definitivo)
   - **Legal:** Política privacidad, Avisos legales, Cookies
   - **Social/Enlaces:** LinkedIn, GitHub, Calendly
3. Documentar decisiones en `FOOTER_STRUCTURE.md` (temporal)

**Ejemplo de estructura:**

```tsx
// FinalCTA.tsx
<section className="py-16 md:py-20 bg-surface-900">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <h2>¿Listo para reducir costes y automatizar?</h2>
    <p>Agenda tu diagnóstico gratuito ahora</p>
    <Button>Agendar diagnóstico</Button>
  </div>
</section>

// Footer.tsx
<footer className="bg-surface-950 py-12">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
    <div>Contacto</div>
    <div>Legal</div>
    <div>Social</div>
  </div>
  <div className="border-t border-surface-800 mt-8 pt-8">
    <p>© 2025 Fran J. González</p>
  </div>
</footer>
```

**Tests:**
- N/A (fase de diseño)

---

### Fase 3: Implementar Componente FinalCTA (30 min)

**Acción:**
1. Crear `components/FinalCTA.tsx`
2. Implementar diseño con tokens de tema
3. Integrar botón Calendly reutilizando lógica existente
4. Añadir microinteracciones básicas (hover en botón)

**Código esperado:**

```tsx
"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onCtaClick?: () => void;
}

export default function FinalCTA({ onCtaClick }: FinalCTAProps) {
  return (
    <section 
      id="final-cta"
      className="py-16 md:py-20 bg-surface-900 scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
          ¿Listo para reducir costes cloud y automatizar procesos?
        </h2>
        <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Agenda tu diagnóstico gratuito de 30 minutos. Identificamos oportunidades de ahorro y automatización en tu stack tecnológico.
        </p>
        <Button
          size="lg"
          onClick={onCtaClick}
          className="bg-accent-gold-500 text-primary-950 text-lg font-semibold transition-all duration-300 hover:bg-accent-gold-400 hover:scale-105 focus:ring-2 focus:ring-accent-gold-400 focus:ring-offset-2 focus:ring-offset-surface-900"
        >
          Agendar diagnóstico gratuito
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
```

**Decisiones técnicas:**
- `bg-surface-900`: Destacar visualmente vs secciones anteriores
- Tokens de tema para consistencia (text-text-primary, etc.)
- Microinteracción básica: hover:scale-105, transition-all
- Reutilizar estilos de CTA de Hero para coherencia

**Tests:**
1. **Unit test:** `__tests__/components/FinalCTA.test.tsx`
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import FinalCTA from '@/components/FinalCTA';

   describe('FinalCTA', () => {
     it('renderiza headline y descripción', () => {
       render(<FinalCTA />);
       
       expect(screen.getByText(/reducir costes cloud/i)).toBeInTheDocument();
       expect(screen.getByText(/diagnóstico gratuito/i)).toBeInTheDocument();
     });

     it('renderiza botón CTA', () => {
       render(<FinalCTA />);
       
       const button = screen.getByRole('button', { name: /agendar diagnóstico/i });
       expect(button).toBeInTheDocument();
     });

     it('llama a onCtaClick cuando se hace click', () => {
       const handleClick = jest.fn();
       render(<FinalCTA onCtaClick={handleClick} />);
       
       const button = screen.getByRole('button', { name: /agendar diagnóstico/i });
       fireEvent.click(button);
       
       expect(handleClick).toHaveBeenCalledTimes(1);
     });

     it('tiene clases de transición para microinteracción', () => {
       render(<FinalCTA />);
       
       const button = screen.getByRole('button');
       expect(button).toHaveClass('transition-all');
       expect(button).toHaveClass('hover:scale-105');
     });
   });
   ```

2. **E2E test:** `__tests__/e2e/final-cta.spec.ts`
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('FinalCTA', () => {
     test('sección visible al final de la landing', async ({ page }) => {
       await page.goto('/');
       
       const finalCta = page.locator('#final-cta');
       await finalCta.scrollIntoViewIfNeeded();
       await expect(finalCta).toBeVisible();
     });

     test('botón responde al hover', async ({ page }) => {
       await page.goto('/');
       
       const button = page.getByRole('button', { name: /agendar diagnóstico gratuito/i });
       await button.scrollIntoViewIfNeeded();
       await expect(button).toBeVisible();
       
       await button.hover();
       await page.waitForTimeout(350);
       
       // Verificar que tiene clases de hover
       const classes = await button.getAttribute('class');
       expect(classes).toContain('hover:scale-105');
     });

     test('CTA visible en ambas paletas', async ({ page }) => {
       for (const theme of ['olive', 'navy']) {
         await page.goto('/');
         await page.evaluate((t) => localStorage.setItem('theme', t), theme);
         await page.reload();
         
         const finalCta = page.locator('#final-cta');
         await finalCta.scrollIntoViewIfNeeded();
         await expect(finalCta).toBeVisible();
         
         const bg = await finalCta.evaluate(el => getComputedStyle(el).backgroundColor);
         expect(bg).not.toBe('rgba(0, 0, 0, 0)'); // No transparente
       }
     });
   });
   ```

**Resultado esperado:**
- Componente FinalCTA funcional con microinteracciones
- Tests unitarios y E2E pasando

---

### Fase 4: Implementar Footer Reorganizado (40 min)

**Acción:**
1. Modificar o crear `components/Footer.tsx`
2. Estructura de 3 columnas en desktop, apilado en mobile
3. Bloques: Contacto, Legal, Social
4. Copyright y año dinámico

**Código esperado:**

```tsx
import Link from 'next/link';
import { Mail, Linkedin, Github, Calendar } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-950 py-12 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Bloque 1: Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">
              Contacto
            </h3>
            <div className="space-y-3">
              <a 
                href="mailto:fran@fjgonzalez.com"
                className="flex items-center gap-2 text-text-secondary hover:text-accent-teal-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>fran@fjgonzalez.com</span>
              </a>
              <p className="text-sm text-text-muted">
                Consultoría en optimización cloud y automatización
              </p>
            </div>
          </div>

          {/* Bloque 2: Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/politica-privacidad"
                  className="text-text-secondary hover:text-accent-teal-400 transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link 
                  href="/aviso-legal"
                  className="text-text-secondary hover:text-accent-teal-400 transition-colors"
                >
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies"
                  className="text-text-secondary hover:text-accent-teal-400 transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Bloque 3: Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">
              Sígueme
            </h3>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/fjgonzalez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-teal-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/fjgonzalez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-teal-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://calendly.com/fjgonzalez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-teal-400 transition-colors"
                aria-label="Calendly"
              >
                <Calendar className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm text-text-muted mt-4">
              Conéctate conmigo en LinkedIn o agenda una llamada
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-surface-800 pt-8">
          <p className="text-center text-sm text-text-muted">
            © {currentYear} Fran J. González. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Decisiones técnicas:**
- Grid responsive: 1 columna mobile, 3 desktop
- Tokens de tema para colores
- Iconos Lucide para contacto y social
- Enlaces legales preparados (páginas se crean después)
- Hover con transition-colors suave
- Año dinámico con `new Date().getFullYear()`

**Notas provisionales v0:**
- Email: `fran@fjgonzalez.com` (provisional, cambiar si es otro)
- URLs social: Provisionales, ajustar a URLs reales de Fran
- Enlaces legales apuntan a `/politica-privacidad`, etc. (páginas vacías inicialmente)

**Tests:**
1. **Unit test:** `__tests__/components/Footer.test.tsx`
   ```typescript
   import { render, screen } from '@testing-library/react';
   import Footer from '@/components/Footer';

   describe('Footer', () => {
     it('renderiza bloque de contacto', () => {
       render(<Footer />);
       
       expect(screen.getByText('Contacto')).toBeInTheDocument();
       expect(screen.getByText(/fran@fjgonzalez.com/i)).toBeInTheDocument();
     });

     it('renderiza bloque legal con 3 enlaces', () => {
       render(<Footer />);
       
       expect(screen.getByText('Legal')).toBeInTheDocument();
       expect(screen.getByText('Política de Privacidad')).toBeInTheDocument();
       expect(screen.getByText('Aviso Legal')).toBeInTheDocument();
       expect(screen.getByText('Política de Cookies')).toBeInTheDocument();
     });

     it('renderiza bloque social con iconos', () => {
       render(<Footer />);
       
       expect(screen.getByText('Sígueme')).toBeInTheDocument();
       expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
       expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
       expect(screen.getByLabelText('Calendly')).toBeInTheDocument();
     });

     it('muestra copyright con año actual', () => {
       render(<Footer />);
       
       const year = new Date().getFullYear();
       expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
     });

     it('enlaces legales tienen href correcto', () => {
       render(<Footer />);
       
       const privacyLink = screen.getByText('Política de Privacidad');
       expect(privacyLink.closest('a')).toHaveAttribute('href', '/politica-privacidad');
     });
   });
   ```

2. **E2E test:** `__tests__/e2e/footer.spec.ts`
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Footer', () => {
     test('footer visible al final de la página', async ({ page }) => {
       await page.goto('/');
       
       const footer = page.locator('footer');
       await footer.scrollIntoViewIfNeeded();
       await expect(footer).toBeVisible();
     });

     test('3 bloques visibles en desktop', async ({ page }) => {
       await page.setViewportSize({ width: 1280, height: 720 });
       await page.goto('/');
       
       await expect(page.getByText('Contacto')).toBeVisible();
       await expect(page.getByText('Legal')).toBeVisible();
       await expect(page.getByText('Sígueme')).toBeVisible();
     });

     test('enlaces sociales funcionan', async ({ page }) => {
       await page.goto('/');
       
       const linkedinLink = page.getByLabelText('LinkedIn');
       await expect(linkedinLink).toHaveAttribute('href', /linkedin/);
       await expect(linkedinLink).toHaveAttribute('target', '_blank');
     });

     test('footer legible en mobile', async ({ page }) => {
       await page.setViewportSize({ width: 375, height: 667 });
       await page.goto('/');
       
       const footer = page.locator('footer');
       await footer.scrollIntoViewIfNeeded();
       await expect(footer).toBeVisible();
       
       // Verificar que no hay scroll horizontal
       const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
       const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
       expect(scrollWidth).toBe(clientWidth);
     });

     test('hover en enlaces cambia color', async ({ page }) => {
       await page.goto('/');
       
       const privacyLink = page.getByText('Política de Privacidad');
       await privacyLink.scrollIntoViewIfNeeded();
       
       await privacyLink.hover();
       await page.waitForTimeout(200);
       
       const classes = await privacyLink.getAttribute('class');
       expect(classes).toContain('hover:text-accent-teal-400');
     });
   });
   ```

**Resultado esperado:**
- Footer reorganizado con 3 bloques claros
- Tests unitarios y E2E pasando
- Legible en mobile sin roturas

---

### Fase 5: Integrar FinalCTA y Footer en Layout (15 min)

**Acción:**
1. Modificar `app/page.tsx` para añadir `<FinalCTA />` antes del footer
2. Verificar que Footer ya está integrado en `app/layout.tsx` o añadirlo
3. Conectar lógica de Calendly al botón de FinalCTA

**Cambios en `app/page.tsx`:**

```tsx
import FinalCTA from "@/components/FinalCTA";
// ... otros imports

export default function Home() {
  const { isCalendlyOpen, openCalendly, closeCalendly } = useCalendly();

  return (
    <main>
      <Hero onCtaClick={openCalendly} />
      <PainPoints />
      <CaseGrid onCtaClick={(caseId, utm) => openCalendly()} />
      <MethodologySection />
      <TechStackDiagram />
      
      {/* CTA Final antes del footer */}
      <FinalCTA onCtaClick={openCalendly} />
      
      <CalendlyModal 
        isOpen={isCalendlyOpen}
        onClose={closeCalendly}
      />
    </main>
  );
}
```

**Verificar en `app/layout.tsx`:**
```tsx
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

**Tests:**
1. **E2E test:** `__tests__/e2e/page-structure.spec.ts`
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Estructura completa de página', () => {
     test('secciones en orden correcto', async ({ page }) => {
       await page.goto('/');
       
       // Verificar orden de secciones
       const sections = await page.locator('section, footer').all();
       const ids = await Promise.all(
         sections.map(s => s.getAttribute('id').catch(() => 'footer'))
       );
       
       expect(ids).toContain('hero');
       expect(ids).toContain('pain-points');
       expect(ids).toContain('cases');
       expect(ids).toContain('final-cta');
       
       // FinalCTA debe estar antes del footer
       const finalCtaIndex = ids.indexOf('final-cta');
       const footerIndex = ids.indexOf('footer');
       expect(finalCtaIndex).toBeLessThan(footerIndex);
     });

     test('usuario puede scrollear hasta el final sin problemas', async ({ page }) => {
       await page.goto('/');
       
       // Scroll hasta el footer
       const footer = page.locator('footer');
       await footer.scrollIntoViewIfNeeded();
       await expect(footer).toBeVisible();
       
       // Verificar que FinalCTA es visible antes del footer
       const finalCta = page.locator('#final-cta');
       await expect(finalCta).toBeVisible();
     });
   });
   ```

**Resultado esperado:**
- FinalCTA integrado antes del footer
- Footer visible al final
- Lógica Calendly conectada

---

### Fase 6: Crear Páginas Legales Placeholder (20 min)

**Acción:**
1. Crear páginas básicas para enlaces legales
2. Contenido placeholder (se mejorará después)
3. Layout consistente con tema

**Crear archivos:**

**`app/politica-privacidad/page.tsx`:**
```tsx
export default function PoliticaPrivacidad() {
  return (
    <main className="min-h-screen bg-surface-950 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-text-primary">
          Política de Privacidad
        </h1>
        <div className="prose prose-invert max-w-none text-text-secondary">
          <p>
            Esta página está en construcción. Aquí se detallará cómo
            manejamos tus datos personales según GDPR.
          </p>
          <p className="text-text-muted italic mt-4">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Política de Privacidad | Fran J. González",
  description: "Información sobre el tratamiento de datos personales"
};
```

**`app/aviso-legal/page.tsx`:**
```tsx
export default function AvisoLegal() {
  return (
    <main className="min-h-screen bg-surface-950 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-text-primary">
          Aviso Legal
        </h1>
        <div className="prose prose-invert max-w-none text-text-secondary">
          <p>
            Esta página está en construcción. Aquí se detallará la
            información legal del sitio web.
          </p>
          <p className="text-text-muted italic mt-4">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Aviso Legal | Fran J. González",
  description: "Información legal del sitio web"
};
```

**`app/cookies/page.tsx`:**
```tsx
export default function Cookies() {
  return (
    <main className="min-h-screen bg-surface-950 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-text-primary">
          Política de Cookies
        </h1>
        <div className="prose prose-invert max-w-none text-text-secondary">
          <p>
            Esta página está en construcción. Aquí se detallará el uso
            de cookies en este sitio web.
          </p>
          <p className="text-text-muted italic mt-4">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Política de Cookies | Fran J. González",
  description: "Información sobre el uso de cookies"
};
```

**Nota v0:** Estas páginas son placeholder. Contenido real se completará en issue posterior dedicada a legal/GDPR.

**Tests:**
1. **E2E test:** `__tests__/e2e/legal-pages.spec.ts`
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Páginas legales', () => {
     const pages = [
       { path: '/politica-privacidad', title: 'Política de Privacidad' },
       { path: '/aviso-legal', title: 'Aviso Legal' },
       { path: '/cookies', title: 'Política de Cookies' }
     ];

     pages.forEach(({ path, title }) => {
       test(`${title} existe y es accesible`, async ({ page }) => {
         await page.goto(path);
         
         await expect(page.getByRole('heading', { name: title })).toBeVisible();
         expect(page.url()).toContain(path);
       });

       test(`${title} tiene metadata correcta`, async ({ page }) => {
         await page.goto(path);
         
         const pageTitle = await page.title();
         expect(pageTitle).toContain(title);
       });
     });

     test('enlaces del footer llevan a páginas correctas', async ({ page }) => {
       await page.goto('/');
       
       await page.getByText('Política de Privacidad').click();
       await expect(page).toHaveURL('/politica-privacidad');
       
       await page.goBack();
       
       await page.getByText('Aviso Legal').click();
       await expect(page).toHaveURL('/aviso-legal');
     });
   });
   ```

**Resultado esperado:**
- Páginas legales placeholder accesibles
- Enlaces del footer funcionando
- Tests E2E pasando

---

### Fase 7: Verificación Responsiveness y Tests (20 min)

**Acción:**
1. Ejecutar todos los tests
2. Verificar visualmente en mobile y desktop
3. Verificar ambas paletas (Olive y Navy)

**Comandos:**
```bash
cd profesional-web

# Tests unitarios
npm run test -- FinalCTA.test.tsx
npm run test -- Footer.test.tsx

# Tests E2E
npm run test:e2e -- final-cta.spec.ts
npm run test:e2e -- footer.spec.ts
npm run test:e2e -- page-structure.spec.ts
npm run test:e2e -- legal-pages.spec.ts

# Levantar servidor para verificación manual
npm run dev
```

**Checklist de verificación manual:**
- [ ] FinalCTA visible antes del footer
- [ ] Footer con 3 bloques claros en desktop
- [ ] Footer apilado correctamente en mobile
- [ ] Enlaces legales funcionan (aunque sean placeholder)
- [ ] Iconos social visibles y con hover
- [ ] Sin roturas de layout en mobile (320px, 375px, 414px)
- [ ] Sin scroll horizontal en mobile
- [ ] Ambas paletas (Olive y Navy) se ven bien
- [ ] Botón FinalCTA abre Calendly correctamente

**Tests adicionales:**
1. **Test de regresión visual:**
   ```typescript
   test('Screenshot completo con FinalCTA y Footer', async ({ page }) => {
     await page.goto('/');
     await page.waitForLoadState('networkidle');
     
     await expect(page).toHaveScreenshot('landing-with-footer-v0.png', {
       fullPage: true,
       maxDiffPixels: 100
     });
   });
   ```

**Resultado esperado:**
- Todos los tests pasando
- Sin regresiones visuales
- Responsiveness OK

---

### Fase 8: Documentar Decisiones v0 y Mejoras Futuras (15 min)

**Acción:**
1. Crear `FJG-103-informe-implementacion.md`
2. Documentar decisiones tomadas
3. Listar qué es provisional y qué mejorar en v2
4. Comentar en Linear con resumen

**Estructura del informe:**
```markdown
# Informe de Implementación FJG-103

## Resumen Ejecutivo
- CTA Final añadido antes del footer con botón Calendly
- Footer reorganizado en 3 bloques: Contacto, Legal, Social
- Páginas legales placeholder creadas
- Sin problemas de usabilidad en mobile/desktop

## Cambios Realizados

### FinalCTA
- Componente nuevo: FinalCTA.tsx
- Headline y texto de valor
- Botón con microinteracciones (hover, focus)
- Integrado antes del footer en page.tsx

### Footer
- 3 bloques: Contacto, Legal, Social
- Grid responsive (1 col mobile, 3 desktop)
- Enlaces legales preparados
- Iconos social con hover
- Copyright con año dinámico

### Páginas Legales
- /politica-privacidad (placeholder)
- /aviso-legal (placeholder)
- /cookies (placeholder)
- Contenido real pendiente para issue posterior

## Tests
- Unit tests: FinalCTA, Footer ✅
- E2E tests: final-cta, footer, page-structure, legal-pages ✅
- Responsiveness: Mobile y desktop OK ✅

## Decisiones v0 (Provisionales)

1. **Email de contacto:** fran@fjgonzalez.com
   - Verificar si es correcto o cambiar
   
2. **URLs sociales:** Provisionales
   - LinkedIn: https://linkedin.com/in/fjgonzalez
   - GitHub: https://github.com/fjgonzalez
   - Calendly: https://calendly.com/fjgonzalez
   - Actualizar con URLs reales de Fran

3. **Texto FinalCTA:** Genérico
   - "¿Listo para reducir costes cloud y automatizar?"
   - Puede ajustarse para ser más específico al público objetivo

4. **Páginas legales:** Solo placeholder
   - Requieren redacción completa con asesoría legal
   - Marcar como pendiente en issue posterior

## Mejoras Futuras (v2)

1. **Newsletter signup:** Añadir formulario de suscripción en footer
2. **Testimonios en FinalCTA:** Añadir quote breve de cliente
3. **Mapa del sitio:** Añadir bloque con sitemap en footer
4. **Redes sociales adicionales:** Twitter/X, YouTube si aplica
5. **Footer sticky en mobile:** Evaluar si ayuda a conversión
6. **Contenido legal real:** Redactar políticas completas con asesor legal
```

**Comentario Linear:**
```
✅ FJG-103 v0 completado

Cambios aplicados:
- CTA Final añadido antes del footer con botón Calendly
- Footer reorganizado en 3 bloques: Contacto, Legal, Social
- Páginas legales placeholder creadas (/politica-privacidad, /aviso-legal, /cookies)
- Grid responsive funcionando en mobile y desktop

Verificación:
- Tests unitarios y E2E pasando al 100%
- Sin roturas de layout en mobile
- Ambas paletas (Olive/Navy) coherentes
- Enlaces del footer funcionando

Decisiones v0 (provisionales):
- Email: fran@fjgonzalez.com (verificar)
- URLs social: provisionales, actualizar con URLs reales
- Texto FinalCTA: genérico, puede ajustarse
- Páginas legales: solo placeholder, requieren redacción completa

Mejoras futuras (v2):
1. Newsletter signup en footer
2. Testimonios en FinalCTA
3. Mapa del sitio en footer
4. Contenido legal real con asesoría

Requiere OK visual de Fran para aprobar definitivamente.
```

**Tests:**
- N/A (fase de documentación)

---

## Comandos de Ejecución

```bash
# Levantar servidor de desarrollo
cd profesional-web
npm run dev

# Ejecutar tests unitarios
npm run test -- FinalCTA.test.tsx
npm run test -- Footer.test.tsx

# Ejecutar tests E2E
npm run test:e2e -- final-cta.spec.ts
npm run test:e2e -- footer.spec.ts
npm run test:e2e -- page-structure.spec.ts
npm run test:e2e -- legal-pages.spec.ts

# Ejecutar todos los tests
npm run test
npm run test:e2e

# Linter
npm run lint

# TypeScript check
npm run type-check
```

---

## Criterios de Finalización

- [ ] Componente FinalCTA creado y funcional
- [ ] Footer reorganizado con 3 bloques
- [ ] FinalCTA integrado antes del footer
- [ ] Footer integrado en layout
- [ ] Páginas legales placeholder creadas
- [ ] Enlaces del footer funcionando
- [ ] Tests unitarios pasando
- [ ] Tests E2E pasando
- [ ] Sin roturas de layout en mobile
- [ ] Sin scroll horizontal en mobile
- [ ] Ambas paletas funcionan correctamente
- [ ] Botón FinalCTA abre Calendly
- [ ] Informe de implementación completo
- [ ] Comentario en Linear con v0 y v2 plan
- [ ] OK visual de Fran

---

## Notas Importantes

1. **v0 = estructura básica:** Textos y URLs son provisionales, ajustar después.

2. **Páginas legales = placeholder:** Contenido real requiere redacción con asesor legal, fuera de alcance v0.

3. **Simplicidad primero:** No añadir newsletter, formularios complejos o features no solicitadas.

4. **Accesibilidad obligatoria:** Enlaces con aria-label, hover visible, navegación por teclado.

5. **Tests obligatorios:** Sin tests pasando, no se aprueba.

6. **CA flexible = "que Fran le guste":** El OK visual es el criterio final.

7. **Sin menú lateral:** Se mantiene decisión de navegación Header + Footer únicamente.

---

## Entregables

1. `AUDIT_FOOTER.md` (temporal, puede borrarse)
2. `FOOTER_STRUCTURE.md` (temporal, puede borrarse)
3. Componentes nuevos:
   - `components/FinalCTA.tsx`
   - `components/Footer.tsx` (modificado o nuevo)
4. Páginas nuevas:
   - `app/politica-privacidad/page.tsx`
   - `app/aviso-legal/page.tsx`
   - `app/cookies/page.tsx`
5. Tests nuevos:
   - `__tests__/components/FinalCTA.test.tsx`
   - `__tests__/components/Footer.test.tsx`
   - `__tests__/e2e/final-cta.spec.ts`
   - `__tests__/e2e/footer.spec.ts`
   - `__tests__/e2e/page-structure.spec.ts`
   - `__tests__/e2e/legal-pages.spec.ts`
6. `FJG-103-informe-implementacion.md`
7. Comentario en Linear con resumen

---

**¿Dudas o bloqueos?**  
Consultar con Agent Manager o Fran antes de tomar decisiones que cambien el alcance v0.
