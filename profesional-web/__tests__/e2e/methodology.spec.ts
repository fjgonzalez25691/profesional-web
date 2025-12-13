import { test, expect } from '@playwright/test';

test.describe('Sección Metodología', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('muestra las 3 fases y badge de simplicidad en desktop', async ({ page }) => {
    const section = page.locator('section#methodology');
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByRole('heading', { level: 2, name: /Cómo Trabajo: 3 Fases Enfocadas en P&L/i })).toBeVisible();
    await expect(section.getByRole('heading', { level: 3, name: /Fase 1: Auditoría Express 48h/i })).toBeVisible();
    await expect(section.getByRole('heading', { level: 3, name: /Fase 2: Roadmap Priorizado ROI/i })).toBeVisible();
    await expect(section.getByRole('heading', { level: 3, name: /Fase 3: Implementación Supervisada/i })).toBeVisible();
    await expect(section.getByText('Simplicidad', { exact: true })).toBeVisible();
    const viewportWidth = page.viewportSize()?.width ?? 1280;
    if (viewportWidth >= 768) {
      await expect(section.getByTestId('methodology-timeline-desktop')).toBeVisible();
    } else {
      await expect(section.getByTestId('methodology-timeline-mobile')).toBeVisible();
    }
  });

  test('adapta a mobile con cards verticales', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const section = page.locator('section#methodology');
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByRole('heading', { level: 3, name: /Fase 1: Auditoría Express 48h/i })).toBeVisible();
    await expect(section.getByRole('heading', { level: 3, name: /Fase 2: Roadmap Priorizado ROI/i })).toBeVisible();
    await expect(section.getByRole('heading', { level: 3, name: /Fase 3: Implementación Supervisada/i })).toBeVisible();
    await expect(section.getByTestId('methodology-timeline-mobile')).toBeVisible();
  });

  test('muestra entregables por fase', async ({ page }) => {
    const section = page.locator('section#methodology');
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByText(/Report 1 página con 3 quick wins/i)).toBeVisible();
    await expect(section.getByText(/Roadmap con inversión\/ahorro cada item/i)).toBeVisible();
    await expect(section.getByText(/Si no reduces >20% → no cobro/i)).toBeVisible();
  });
});
