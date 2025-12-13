import { test, expect } from '@playwright/test';

test.describe('Header sticky navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header stays visible while scrolling', async ({ page }) => {
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header).toBeVisible();
  });

  test('desktop navigation links scroll to sections', async ({ page, viewport }) => {
    // Skip test on mobile viewports
    test.skip(!viewport || viewport.width < 768, 'Desktop navigation is hidden on mobile');

    await page.getByRole('link', { name: /Casos/i }).click();
    await page.waitForTimeout(300);

    await expect(page).toHaveURL(/#cases/);
    await expect(page.locator('#cases')).toBeVisible();
  });

  test('mobile menu toggles and closes after navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const toggle = page.getByLabel('Abrir menú');
    await toggle.click();

    const mobileNav = page.getByTestId('mobile-nav');
    await expect(mobileNav).toBeVisible();

    await page.getByTestId('mobile-nav').getByRole('link', { name: /Metodología/i }).click();
    await page.waitForTimeout(300);

    await expect(page).toHaveURL(/#methodology/);
    await expect(mobileNav).toBeHidden();
  });
});
