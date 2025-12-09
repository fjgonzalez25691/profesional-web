import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Performance Budgets - FJG-57', () => {
  it('debe tener hero image <150KB (optimizada)', () => {
    const heroImagePath = path.join(process.cwd(), 'public/hero-image.webp');

    if (fs.existsSync(heroImagePath)) {
      const stats = fs.statSync(heroImagePath);
      expect(stats.size).toBeLessThan(150 * 1024); // <150KB (razonable para hero moderna)
    } else {
      // Si no existe el archivo específico, verificar que existe alguna imagen hero
      const publicDir = path.join(process.cwd(), 'public');
      const files = fs.readdirSync(publicDir);
      const heroImages = files.filter(f => f.includes('hero') && (f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg')));

      expect(heroImages.length).toBeGreaterThan(0);

      // Verificar el tamaño de la primera imagen hero encontrada
      const heroImage = heroImages[0];
      const stats = fs.statSync(path.join(publicDir, heroImage));
      expect(stats.size).toBeLessThan(150 * 1024); // <150KB
    }
  });

  it('debe tener imágenes casos <50KB cada una (si existen)', () => {
    const casosDir = path.join(process.cwd(), 'public/casos');

    if (fs.existsSync(casosDir)) {
      const images = fs.readdirSync(casosDir).filter(f =>
        f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg')
      );

      if (images.length > 0) {
        images.forEach(img => {
          const stats = fs.statSync(path.join(casosDir, img));
          expect(stats.size).toBeLessThan(50 * 1024); // <50KB
        });
      } else {
        // Si no hay imágenes, el test pasa (no es un error)
        expect(images.length).toBe(0);
      }
    } else {
      // Si no existe el directorio, el test pasa (no es obligatorio tener imágenes de casos)
      expect(true).toBe(true);
    }
  });

  it('debe tener bundle analyzer configurado', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // Verificar que existe el script build:analyze
    expect(packageJson.scripts).toHaveProperty('build:analyze');
    expect(packageJson.scripts['build:analyze']).toContain('ANALYZE=true');

    // Verificar que @next/bundle-analyzer está instalado
    expect(packageJson.devDependencies).toHaveProperty('@next/bundle-analyzer');
  });

  it('debe tener revalidate configurado en páginas legales', () => {
    const avisoLegalPath = path.join(process.cwd(), 'app/legal/aviso-legal/page.tsx');
    const privacidadPath = path.join(process.cwd(), 'app/legal/privacidad/page.tsx');

    if (fs.existsSync(avisoLegalPath)) {
      const content = fs.readFileSync(avisoLegalPath, 'utf-8');
      expect(content).toContain('export const revalidate');
    }

    if (fs.existsSync(privacidadPath)) {
      const content = fs.readFileSync(privacidadPath, 'utf-8');
      expect(content).toContain('export const revalidate');
    }
  });

  it('debe tener Lighthouse CI workflow configurado', () => {
    const lighthousePath = path.join(process.cwd(), '../.github/workflows/lighthouse.yml');

    if (fs.existsSync(lighthousePath)) {
      const content = fs.readFileSync(lighthousePath, 'utf-8');
      expect(content).toContain('Lighthouse CI');
      expect(content).toContain('treosh/lighthouse-ci-action');
    } else {
      throw new Error('Lighthouse CI workflow no existe en .github/workflows/lighthouse.yml');
    }
  });
});
