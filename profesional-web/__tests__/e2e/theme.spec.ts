import { test, expect } from '@playwright/test';

test.describe('Theme System', () => {
  test('should load with default theme olive', async ({ page }) => {
    await page.goto('/');

    // Check default theme is olive (based on script default)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'olive');
  });

  test('should NOT show theme toggle on public page', async ({ page }) => {
    await page.goto('/');
    
    // Theme toggle should NOT be visible on public pages
    const toggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(toggle).not.toBeVisible();
  });

  test('should allow toggling theme and persist in localStorage', async ({ page }) => {
    // Authenticate to access admin dashboard
    await page.goto('/admin');

    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill(process.env.ADMIN_PASSWORD || 'nueva_password_segura_2025');
      await page.getByRole('button', { name: /Acceder/i }).click();
      await page.waitForLoadState('networkidle');
    }

    // Verify default theme is olive
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'olive');

    // Find and click theme toggle
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');
    await expect(toggleButton).toBeVisible();

    // Toggle to navy
    await toggleButton.click();
    await page.waitForTimeout(300); // Wait for theme to apply

    // Verify theme changed to navy
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'navy');

    // Verify localStorage persistence
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('navy');

    // Toggle back to olive
    await toggleButton.click();
    await page.waitForTimeout(300);

    // Verify theme changed back to olive
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'olive');

    // Verify localStorage updated
    const storedThemeAfter = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedThemeAfter).toBe('olive');

    // Reload page to verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Theme should still be olive after reload
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'olive');
  });
});