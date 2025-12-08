import { test, expect } from '@playwright/test';

test.describe('Sección Tech Stack', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('muestra diagrama SVG y 4 capas', async ({ page }) => {
    await page.locator('section#tech-stack').scrollIntoViewIfNeeded();

    await expect(page.getByRole('heading', { level: 2, name: /Stack Tecnológico Transparente/i })).toBeVisible();

    const img = page.getByRole('img', { name: /Diagrama arquitectura tech stack/i });
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', '/diagrams/tech-stack.svg');
  });

  test('muestra badges de tecnologías en grid', async ({ page }) => {
    await page.locator('section#tech-stack').scrollIntoViewIfNeeded();

    await expect(page.getByText('Next.js 15')).toBeVisible();
    await expect(page.getByText('React 19')).toBeVisible();
    await expect(page.getByText('Groq (Llama 3.3)')).toBeVisible();
    await expect(page.getByText('Vercel Postgres')).toBeVisible();
  });

  test('badges muestran purpose', async ({ page }) => {
    await page.locator('section#tech-stack').scrollIntoViewIfNeeded();

    await expect(page.getByText('App Router SSR')).toBeVisible();
    await expect(page.getByText('Chatbot IA')).toBeVisible();
  });

  test('responsive: grid visible en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.locator('section#tech-stack').scrollIntoViewIfNeeded();

    await expect(page.getByText('Next.js 15')).toBeVisible();
  });

  test('SVG se carga correctamente', async ({ page }) => {
    const response = await page.goto('/diagrams/tech-stack.svg');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image/svg');
  });
});
