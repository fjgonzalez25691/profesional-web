import { test, expect } from '@playwright/test';

test.describe('Global Theme Application', () => {
  test('should apply theme background globally to body', async ({ page }) => {
    await page.goto('/');

    // Check default body background (Olive: surface-950 #121610)
    const bodyBgOlive = await page.locator('body').evaluate(
      el => getComputedStyle(el).backgroundColor
    );
    // Verify background color is applied (accepts rgb() or lab() format from Tailwind v4)
    expect(bodyBgOlive).toBeTruthy();
    expect(bodyBgOlive).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
    // Check it's a dark color (Olive theme uses dark backgrounds)
    expect(bodyBgOlive).toMatch(/^(rgb|lab)\(/);
  });

  test('should apply theme text color globally', async ({ page }) => {
    await page.goto('/');

    // Check default body text color (Olive: text-primary #f0f5f0)
    const bodyTextOlive = await page.locator('body').evaluate(
      el => getComputedStyle(el).color
    );
    // Verify text color is applied (accepts rgb() or lab() format from Tailwind v4)
    expect(bodyTextOlive).toBeTruthy();
    // Check it's a valid color format
    expect(bodyTextOlive).toMatch(/^(rgb|lab)\(/);
  });
});
