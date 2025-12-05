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

      // 8500 * 12 * 0.275 = 28,050€
      // Investment: 2500 + (600 * 1.2) = 3,220€
      await expect(page.getByText(/Ahorro estimado: ~28\.050€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.220€/i)).toBeVisible();
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

      // 15000 * 12 * 0.275 = 49,500€
      // Investment: 2500 + (600 * 1.6) = 3,460€
      await expect(page.getByText(/Ahorro estimado: ~49\.500€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.460€/i)).toBeVisible();
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

      // FJG-88: 20 * 52 * 25 * 0.5 = 13,000€ (reducido de 70% a 50%)
      // Investment: 3600 + (1000 * 1) = 4,600€
      await expect(page.getByText(/Ahorro estimado: ~13\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~4\.600€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 4 meses/i)).toBeVisible();
    });

    test('calcula ROI para manual-processes con 35h/semana', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('35');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-88: 35 * 52 * 25 * 0.5 = 22,750€ (reducido de 70% a 50%)
      // Investment: 3600 + (1000 * 1.2) = 4,800€
      await expect(page.getByText(/Ahorro estimado: ~22\.750€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~4\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 3 meses/i)).toBeVisible();
    });

    test('calcula ROI para manual-processes con 40h/semana (CA2)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('40');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-88 CA2: Orden de magnitud razonable para pyme
      // 40 * 52 * 25 * 0.5 = 26,000€
      // Investment: 3600 + (1000 * 1.2) = 4,800€
      await expect(page.getByText(/Ahorro estimado: ~26\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~4\.800€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 2 meses/i)).toBeVisible();
    });

    test('valida campo requerido en manual-processes', async ({ page }) => {
      await page.getByRole('button', { name: /Siguiente/i }).click();
      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Campo requerido/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado/i)).not.toBeVisible();
    });

    test('valida campo requerido con valor 0', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('0');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Con valor 0, la validación debería tratarlo como valor inválido (campo requerido o fuera de rango)
      const hasRequiredError = await page.getByText(/Campo requerido/i).isVisible().catch(() => false);
      const hasRangeError = await page.getByText(/horas manuales semanales deben estar entre/i).isVisible().catch(() => false);
      expect(hasRequiredError || hasRangeError).toBeTruthy();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('bloquea valores fuera de rango max (200h)', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('200');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/horas manuales semanales deben estar entre/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
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

      // 17.5M * 0.05 * 0.30 * 0.35 = 91,875€
      // Investment: 4200 + (1400 * 1.2) = 5,880€
      await expect(page.getByText(/Ahorro estimado: ~91\.875€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.880€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });

    test('calcula ROI para forecasting con 18% error', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('18');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 35M * 0.05 * 0.18 * 0.35 = 110,250€
      // Investment: 4200 + (1400 * 1.6) = 6,440€
      await expect(page.getByText(/Ahorro estimado: ~110\.250€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~6\.440€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 1 mes/i)).toBeVisible();
    });

    test('calcula ROI para forecasting con 10% error', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('10');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 8M * 0.05 * 0.10 * 0.35 = 14,000€
      // Investment: 4200 + (1400 * 1) = 5,600€
      await expect(page.getByText(/Ahorro estimado: ~14\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.600€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 5 meses/i)).toBeVisible();
    });
  });

  test.describe('Pain: Inventory', () => {
    test('calcula ROI para inventory (sin datos adicionales)', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 1.2M * 0.10 * 0.30 = 36,000€
      // Investment: 4200 + (1400 * 1.2) = 5,880€
      await expect(page.getByText(/Ahorro estimado: ~36\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.880€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 2 meses/i)).toBeVisible();
    });

    test('calcula ROI para inventory sector retail grande', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 6M * 0.10 * 0.30 = 180,000€
      // Investment: 4200 + (1400 * 2) = 7,000€
      await expect(page.getByText(/Ahorro estimado: ~180\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~7\.000€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 0 meses/i)).toBeVisible();
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

      // 35M * 0.05 * 0.30 * 0.35 = 183,750€
      await expect(page.getByText(/Ahorro estimado: ~183\.750€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~6\.440€/i)).toBeVisible();
    });

    test('Logística + manual-processes', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('35');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-88: 35 * 52 * 25 * 0.5 = 22,750€
      await expect(page.getByText(/Ahorro estimado: ~22\.750€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~4\.600€/i)).toBeVisible();
    });

    test('Retail + inventory', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 1.2M * 0.10 * 0.30 = 36,000€
      await expect(page.getByText(/Ahorro estimado: ~36\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.880€/i)).toBeVisible();
    });

    test('Otro + cloud-costs', async ({ page }) => {
      await page.locator('label:has-text("Otro")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('5000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 5000 * 12 * 0.275 = 16,500€
      await expect(page.getByText(/Ahorro estimado: ~16\.500€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.220€/i)).toBeVisible();
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

      // 3000 * 12 * 0.275 = 9,900€
      // Investment: 2500 + (600 * 1) = 3,100€
      await expect(page.getByText(/Ahorro estimado: ~9\.900€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.100€/i)).toBeVisible();
    });

    test('10-25M empresa mediana', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 8500 * 12 * 0.275 = 28,050€
      await expect(page.getByText(/Ahorro estimado: ~28\.050€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.220€/i)).toBeVisible();
    });

    test('25-50M empresa mediana-grande', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('15000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 15000 * 12 * 0.275 = 49,500€
      await expect(page.getByText(/Ahorro estimado: ~49\.500€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.460€/i)).toBeVisible();
    });

    test('50M+ empresa grande', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('25000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 25000 * 12 * 0.275 = 82,500€
      // Investment: 2500 + (600 * 2) = 3,700€
      await expect(page.getByText(/Ahorro estimado: ~82\.500€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.700€/i)).toBeVisible();
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

      // Cloud: 28,050€ + Manual (FJG-88): 20*52*25*0.5 = 13,000€ = 41,050€
      // Investment: 3,220€ + 4,800€ = 8,020€
      await expect(page.getByText(/Ahorro estimado: ~41\.050€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~8\.020€/i)).toBeVisible();
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

      // Forecasting: 17.5M * 0.05 * 0.15 * 0.35 = 45,938€
      // Inventory: 1.2M * 0.10 * 0.30 = 36,000€
      // Total: 81,938€
      // Investment: 5,880€ + 5,880€ = 11,760€
      await expect(page.getByText(/Ahorro estimado: ~81\.938€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~11\.760€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 2 meses/i)).toBeVisible();
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

      // Cloud: 10000 * 12 * 0.275 = 33,000€
      // Manual (FJG-88): 25 * 52 * 25 * 0.5 = 16,250€
      // Forecasting: 35M * 0.05 * 0.20 * 0.35 = 122,500€
      // Total: 171,750€
      // Investment: 3,460€ + 5,200€ + 6,440€ = 15,100€
      await expect(page.getByText(/Ahorro estimado: ~171\.750€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~15\.100€/i)).toBeVisible();
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

      // Cloud: 20000 * 12 * 0.275 = 66,000€
      // Manual (FJG-88): 40 * 52 * 25 * 0.5 = 26,000€
      // Forecasting: 60M * 0.05 * 0.25 * 0.35 = 262,500€
      // Inventory: 6M * 0.10 * 0.30 = 180,000€
      // Total: 534,500€
      // Investment: 3,700€ + 5,600€ + 7,000€ + 7,000€ = 23,300€
      await expect(page.getByText(/Ahorro estimado: ~534\.500€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~23\.300€/i)).toBeVisible();
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

      // 100 * 12 * 0.275 = 330€
      // Investment: 3,100€
      await expect(page.getByText(/Ahorro estimado: ~330€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~3\.100€/i)).toBeVisible();
    });

    test('valores altos en manual-processes', async ({ page }) => {
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('80');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-88: 80 * 52 * 25 * 0.5 = 52,000€
      // Investment: 3600 + (1000 * 2) = 5,600€
      await expect(page.getByText(/Ahorro estimado: ~52\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.600€/i)).toBeVisible();
    });

    test('requiere error de forecast cuando se selecciona el dolor (FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for=\"size-10-25M\"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      // NO ingresamos valor de error de forecast
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Campo requerido/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('bloquea error de forecast en 0% (CA3 FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for=\"size-10-25M\"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('0');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/El error de forecast debe estar entre 1% y 79%/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('bloquea error de forecast en 80% (CA3 FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for=\"size-10-25M\"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('80');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/El error de forecast debe estar entre 1% y 79%/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('bloquea error de forecast en 85% (CA2 FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for=\"size-10-25M\"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('85');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/El error de forecast debe estar entre 1% y 79%/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('valida 79% como máximo permitido (CA2 FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('79');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 35M * 0.05 * 0.79 * 0.35 = 483,875€
      await expect(page.getByText(/Ahorro estimado: ~483\.875€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~6\.440€/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
    });

    test('valida 1% como mínimo permitido (CA2 FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('1');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 8M * 0.05 * 0.01 * 0.35 = 1,400€
      await expect(page.getByText(/Ahorro estimado: ~1\.400€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.600€/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
    });

    test('error de forecasting muy bajo (5%)', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('5');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 17.5M * 0.05 * 0.05 * 0.35 = 15,312€
      await expect(page.getByText(/Ahorro estimado: ~15\.312€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~5\.880€/i)).toBeVisible();
    });

    test('error de forecasting muy alto (50%)', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('50');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // 60M * 0.05 * 0.50 * 0.35 = 525,000€
      await expect(page.getByText(/Ahorro estimado: ~525\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~7\.000€/i)).toBeVisible();
    });
  });
});
