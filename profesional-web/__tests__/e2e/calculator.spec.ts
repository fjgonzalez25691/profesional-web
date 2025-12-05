import { test, expect } from '@playwright/test';

test.describe('Calculadora ROI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculadora');
  });

  // ============================================
  // TESTS POR DOLOR (Pain Points)
  // ============================================

  test.describe('Pain: Cloud Costs', () => {
    test('calcula ROI para cloud-costs con 8500€/mes', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 8500 * 12 * 0.35 = 35,700€
      await expect(page.getByText(/Ahorro estimado: ~35\.700€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
      await expect(page.getByText(/Recibe análisis completo/i)).toBeVisible();
    });

    test('calcula ROI para cloud-costs con 15000€/mes', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('15000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 15000 * 12 * 0.35 = 63,000€
      await expect(page.getByText(/Ahorro estimado: ~63\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });

    test('valida campo requerido en cloud-costs', async ({ page }) => {
      await page.getByRole('button', { name: /Siguiente/i }).click();
      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Campo requerido/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado/i)).not.toBeVisible();
    });
  });

  test.describe('Pain: Manual Processes', () => {
    test('calcula ROI para manual-processes con 20h/semana', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('20');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 20 * 52 * 25 * 0.7 = 18,200€
      await expect(page.getByText(/Ahorro estimado: ~18\.200€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~4\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 3 meses/i)).toBeVisible();
    });

    test('calcula ROI para manual-processes con 35h/semana', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('35');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 35 * 52 * 25 * 0.7 = 31,850€
      await expect(page.getByText(/Ahorro estimado: ~31\.850€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~4\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 2 meses/i)).toBeVisible();
    });
  });

  test.describe('Pain: Forecasting', () => {
    test('calcula ROI para forecasting con 30% error', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('30');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 20M * 0.08 * 0.30 * 0.5 = 240,000€
      await expect(page.getByText(/Ahorro estimado: ~240\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 0 meses/i)).toBeVisible();
    });

    test('calcula ROI para forecasting con 18% error', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('18');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 20M * 0.08 * 0.18 * 0.5 = 144,000€
      await expect(page.getByText(/Ahorro estimado: ~144\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 0 meses/i)).toBeVisible();
    });

    test('calcula ROI para forecasting con 10% error', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('10');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 20M * 0.08 * 0.10 * 0.5 = 80,000€
      await expect(page.getByText(/Ahorro estimado: ~80\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });
  });

  test.describe('Pain: Inventory', () => {
    test('calcula ROI para inventory (sin datos adicionales)', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 1M * 0.12 * 0.4 = 48,000€
      await expect(page.getByText(/Ahorro estimado: ~48\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });

    test('calcula ROI para inventory sector retail grande', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 1M * 0.12 * 0.4 = 48,000€ (mismo cálculo independiente de tamaño)
      await expect(page.getByText(/Ahorro estimado: ~48\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });
  });

  // ============================================
  // TESTS POR SECTOR
  // ============================================

  test.describe('Por Sector', () => {
    test('Industrial + forecasting', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('30');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Ahorro estimado: ~240\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
    });

    test('Logística + manual-processes', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('35');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Ahorro estimado: ~31\.850€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~4\.800€/i)).toBeVisible();
    });

    test('Retail + inventory', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Ahorro estimado: ~48\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
    });

    test('Otro + cloud-costs', async ({ page }) => {
      await page.locator('label:has-text("Otro")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('5000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 5000 * 12 * 0.35 = 21,000€
      await expect(page.getByText(/Ahorro estimado: ~21\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
    });
  });

  // ============================================
  // TESTS POR TAMAÑO DE EMPRESA
  // ============================================

  test.describe('Por Tamaño de Empresa', () => {
    test('5-10M empresa pequeña', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('3000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 3000 * 12 * 0.35 = 12,600€
      await expect(page.getByText(/Ahorro estimado: ~12\.600€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
    });

    test('10-25M empresa mediana', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Ahorro estimado: ~35\.700€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
    });

    test('25-50M empresa mediana-grande', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('15000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Ahorro estimado: ~63\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
    });

    test('50M+ empresa grande', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('25000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 25000 * 12 * 0.35 = 105,000€
      await expect(page.getByText(/Ahorro estimado: ~105\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
    });
  });

  // ============================================
  // TESTS DE COMBINACIONES MÚLTIPLES
  // ============================================

  test.describe('Combinaciones Múltiples de Dolores', () => {
    test('cloud-costs + manual-processes', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('20');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Cloud: 35,700€ + Manual: 18,200€ = 53,900€
      // Investment: 3,200€ + 4,800€ = 8,000€
      await expect(page.getByText(/Ahorro estimado: ~53\.900€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~8\.000€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 2 meses/i)).toBeVisible();
    });

    test('forecasting + inventory', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('15');
      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Forecasting: 120,000€ + Inventory: 48,000€ = 168,000€
      // Investment: 5,800€ + 5,800€ = 11,600€
      await expect(page.getByText(/Ahorro estimado: ~168\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~11\.600€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });

    test('cloud-costs + manual-processes + forecasting', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('10000');
      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('25');
      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('20');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Cloud: 42,000€ + Manual: 22,750€ + Forecasting: 160,000€ = 224,750€
      // Investment: 3,200€ + 4,800€ + 5,800€ = 13,800€
      await expect(page.getByText(/Ahorro estimado: ~224\.750€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~13\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });

    test('todos los dolores combinados', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('20000');
      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('40');
      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('25');
      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Cloud: 84,000€ + Manual: 36,400€ + Forecasting: 200,000€ + Inventory: 48,000€ = 368,400€
      // Investment: 3,200€ + 4,800€ + 5,800€ + 5,800€ = 19,600€
      await expect(page.getByText(/Ahorro estimado: ~368\.400€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~19\.600€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });
  });

  // ============================================
  // TESTS DE VALIDACIÓN Y EDGE CASES
  // ============================================

  test.describe('Validaciones y Edge Cases', () => {
    test('no seleccionar ningún dolor no muestra resultados', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // No seleccionar ningún dolor
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // No debería mostrar resultados válidos (valores en 0 o N/A)
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Ahorro estimado: ~0€');
      expect(pageContent).toContain('Inversión: ~0€');
    });

    test('valores mínimos en cloud-costs', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('100');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 100 * 12 * 0.35 = 420€
      await expect(page.getByText(/Ahorro estimado: ~420€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.200€/i)).toBeVisible();
    });

    test('valores altos en manual-processes', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('80');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 80 * 52 * 25 * 0.7 = 72,800€
      await expect(page.getByText(/Ahorro estimado: ~72\.800€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~4\.800€/i)).toBeVisible();
    });

    test('error de forecasting muy bajo (5%)', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('5');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 20M * 0.08 * 0.05 * 0.5 = 40,000€
      await expect(page.getByText(/Ahorro estimado: ~40\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
    });

    test('error de forecasting muy alto (50%)', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('50');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 20M * 0.08 * 0.50 * 0.5 = 400,000€
      await expect(page.getByText(/Ahorro estimado: ~400\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.800€/i)).toBeVisible();
    });
  });
});
