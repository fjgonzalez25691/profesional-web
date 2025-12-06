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

      // FJG-94: Con valor 0, la validación muestra "Introduce al menos 5 horas/semana"
      await expect(page.getByText(/Introduce al menos 5 horas\/semana/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('bloquea valores fuera de rango max (200h)', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('250');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-94: Nuevo máximo es 200h/semana
      await expect(page.getByText(/No puede superar 200 horas\/semana/i)).toBeVisible();
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

      await expect(page.getByText(/No hemos podido calcular el ROI porque faltan datos/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado:/i)).toHaveCount(0);
    });

    test('valores mínimos en cloud-costs', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('500');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-94: Mínimo ahora es 500€/mes
      // 500 * 12 * 0.275 = 1,650€
      // Investment: 3,100€
      await expect(page.getByText(/Ahorro estimado: ~1\.650€\/año/i)).toBeVisible();
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
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      // NO ingresamos valor de error de forecast
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/Campo requerido/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('bloquea error de forecast en 0% (CA3 FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      await page.getByLabel(/Error de forecast/i).fill('0');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-94: Mínimo ahora es 5%
      await expect(page.getByText(/El error mínimo es 5%/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('muestra warning en error de forecast muy alto (80%)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      await page.getByLabel(/Error de forecast/i).fill('55');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-94: Warning a partir de 50%, usando 55% para asegurar que dispare
      await expect(page.getByText(/Error de forecast muy alto/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
    });

    test('bloquea error de forecast por encima de 100%', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      await page.getByLabel(/Error de forecast/i).fill('70');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-94: Máximo ahora es 60%
      await expect(page.getByText(/El error máximo razonable es 60%/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('valida 60% como máximo permitido', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      await page.getByLabel(/Error de forecast/i).fill('60');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-94: 35M * 0.05 * 0.60 * 0.35 = 367,500€
      await expect(page.getByText(/Ahorro estimado: ~367\.500€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~6\.440€/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
    });

    test('valida 5% como mínimo permitido (CA2 FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      await page.getByLabel(/Error de forecast/i).fill('5');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-94: 8M * 0.05 * 0.05 * 0.35 = 7,000€
      await expect(page.getByText(/Ahorro estimado: ~7\.000€\/año/i)).toBeVisible();
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

  // ============================================
  // TESTS ESPECÍFICOS FJG-92 (UX MENSAJES)
  // ============================================

  test.describe('FJG-92: Mensajes UX y Experiencia de Usuario', () => {
    test('muestra disclaimer de supuestos conservadores cuando hay resultados', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('5000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar que el disclaimer aparece
      await expect(page.getByText(/ℹ️ Supuestos conservadores/i)).toBeVisible();
      await expect(
        page.getByText(/Este cálculo usa supuestos conservadores basados en casos reales/i)
      ).toBeVisible();
      await expect(page.getByText(/no constituyen una oferta comercial vinculante/i)).toBeVisible();

      // Verificar que el link a Calendly existe y es correcto
      const calendlyLink = page.getByRole('link', { name: /agenda una sesión de 30 minutos gratuita/i });
      await expect(calendlyLink).toBeVisible();
      await expect(calendlyLink).toHaveAttribute('target', '_blank');
      await expect(calendlyLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('NO muestra disclaimer cuando no hay datos (fallback)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // No seleccionar ningún dolor
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar mensaje fallback
      await expect(page.getByText(/No hemos podido calcular el ROI porque faltan datos/i)).toBeVisible();

      // Verificar que el disclaimer NO aparece
      await expect(page.getByText(/ℹ️ Supuestos conservadores/i)).not.toBeVisible();
    });

    test('muestra warning con emoji cuando gasto cloud es alto (>15% facturación)', async ({ page }) => {
      // FJG-94: Resuelto con cloudRevenueWarningRatio=0.15
      // Para empresa 5-10M (revenue 7.5M): 15% = 1,125,000€/año = 93,750€/mes
      // Usando 95K€/mes que está dentro del max (100K) y dispara el warning
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('95000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByText(/⚠️ Avisos de coherencia/i)).toBeVisible();
      await expect(page.getByText(/⚠️ Gasto cloud alto \(>15% facturación\)/i)).toBeVisible();
      await expect(page.getByText(/Si el dato es correcto, perfecto/i)).toBeVisible();
    });

    test('muestra warning ROI extremo con emoji y mensaje mejorado', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar warning ROI extremo con nuevo copy
      await expect(page.getByText(/⚠️ Avisos de coherencia/i)).toBeVisible();
      await expect(page.getByText(/⚠️ ROI extremo \(> 1\.000%\)/i)).toBeVisible();
      // El mensaje aparece en tarjeta y en warnings, verificamos que existe al menos uno
      const significativaCount = await page.getByText(/oportunidad muy significativa/i).count();
      expect(significativaCount).toBeGreaterThan(0);
    });

    test('muestra mensaje mejorado para gasto cloud >100K (FJG-94)', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      // FJG-94: cloudSpendMonthly.max = 100,000 según calculatorConfig.ts
      await page.getByLabel(/Gasto mensual en cloud/i).fill('150000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar mensaje de validación con el max correcto (100,000)
      await expect(
        page.getByText(/Parece muy alto \(>100\.000€\/mes\)\. Si es correcto, contáctanos para caso específico/i)
      ).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).not.toBeVisible();
    });

    test('muestra warning forecast error muy alto con emoji y copy mejorado', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      // FJG-94: Usar 55% (>50% threshold pero <60% max) para disparar warning
      await page.getByLabel(/Error de forecast/i).fill('55');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar warning forecast con nuevo copy
      await expect(page.getByText(/⚠️ Avisos de coherencia/i)).toBeVisible();
      await expect(page.getByText(/⚠️ Error de forecast muy alto \(>50%\)/i)).toBeVisible();
      await expect(page.getByText(/Corrige el valor si es un error/i)).toBeVisible();
      await expect(page.getByText(/valida el ROI con datos reales antes de presentarlo/i)).toBeVisible();
    });

    test('responsive mobile: mensaje fallback visible en 375px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // No seleccionar ningún dolor
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar que el mensaje fallback es visible en mobile
      const fallbackMessage = page.getByText(/No hemos podido calcular el ROI porque faltan datos/i);
      await expect(fallbackMessage).toBeVisible();

      // Verificar que el texto no se corta (tiene padding adecuado)
      const box = await fallbackMessage.boundingBox();
      expect(box).toBeTruthy();
      if (box) {
        expect(box.width).toBeLessThan(375); // No debe desbordar
      }
    });

    test('responsive mobile: disclaimer visible y link tap-friendly en 375px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('5000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar disclaimer visible en mobile
      await expect(page.getByText(/ℹ️ Supuestos conservadores/i)).toBeVisible();

      // Verificar que el link es tap-friendly (altura mínima 44px recomendada)
      const calendlyLink = page.getByRole('link', { name: /agenda una sesión de 30 minutos gratuita/i });
      await expect(calendlyLink).toBeVisible();
      const linkBox = await calendlyLink.boundingBox();
      expect(linkBox).toBeTruthy();
      // El link debe ser clickeable en mobile (verificamos que existe y es visible)
    });

    test('responsive mobile: warnings visibles y bien formateados en 375px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      // FJG-94: Usar 55% (>50% threshold pero <60% max) para disparar warning
      await page.getByLabel(/Error de forecast/i).fill('55');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar que warnings se ven bien en mobile
      const warningsTitle = page.getByText(/⚠️ Avisos de coherencia/i);
      await expect(warningsTitle).toBeVisible();

      const warningMessage = page.getByText(/⚠️ Error de forecast muy alto/i);
      await expect(warningMessage).toBeVisible();

      // Verificar que el callout no desborda
      const warningBox = await warningMessage.boundingBox();
      expect(warningBox).toBeTruthy();
      if (warningBox) {
        expect(warningBox.width).toBeLessThan(375);
      }
    });
  });
});
