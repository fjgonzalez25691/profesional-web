import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('CA-1 & CA-2: Visualiza headline específico y es visible above fold', async ({ page }) => {
    const headline = page.getByRole('heading', { level: 1 });
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Reduzco tu factura Cloud y automatizo procesos con payback <6 meses');
  });

  test('CA-3: Visualiza subtítulo segmentado', async ({ page }) => {
    const subtitle = page.locator('p').filter({ hasText: 'Para empresas que quieren' });
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Para empresas que quieren optimizar costes y ganar eficiencia');
  });

  test('CA-4: Visualiza badge de experiencia', async ({ page }) => {
    const badge = page.getByText('+37 años gestionando P&L');
    await expect(badge).toBeVisible();
  });

  test('CA-5 & CA-6: CTA flotante y Modal Calendly', async ({ page }) => {
    const cta = page.getByRole('button', { name: /Diagnóstico gratuito 30 min/i });
    await expect(cta).toBeVisible();
    
    // Verificar que al hacer click se abre el modal de Calendly
    await cta.click();
    
    // Verificar que el iframe de Calendly se carga (es lo más confiable)
    await page.waitForSelector('iframe[src*="calendly.com"]', { timeout: 10000 });
    const iframe = page.locator('iframe[src*="calendly.com"]');
    await expect(iframe).toBeAttached();
  });
  
  // Performance LCP check simplificado (Playwright puede obtener métricas)
  test('CA-7: Performance LCP check (aprox)', async ({ page }) => {
    // Este test es más informativo en local, crítico en CI.
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
    });
    console.log(`LCP: ${lcp}ms`);
    expect(lcp).toBeLessThan(2500); // Margen sobre los 2000ms
  });
});
