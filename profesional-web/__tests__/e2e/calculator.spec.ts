import { test, expect } from '@playwright/test';

test.describe('Calculadora ROI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculadora');
  });

  test('flujo cloud básico muestra resultados', async ({ page }) => {
    // Click on label text instead of hidden input for Agencia Marketing
    await page.locator('label:has-text("Agencia Marketing")').click();
    // Click on label for 10-25M size option
    await page.locator('label[for="size-10-25M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await expect(page.getByText(/Ahorro estimado: ~35\.700€\/año/i)).toBeVisible();
    await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
    await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    await expect(page.getByText(/Recibe análisis completo/i)).toBeVisible();
  });

  test('valida importe requerido en cloud', async ({ page }) => {
    await page.getByRole('button', { name: /Siguiente/i }).click();
    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await expect(page.getByText(/Campo requerido/i)).toBeVisible();
    await expect(page.getByText(/Ahorro estimado/i)).not.toBeVisible();
  });
});
