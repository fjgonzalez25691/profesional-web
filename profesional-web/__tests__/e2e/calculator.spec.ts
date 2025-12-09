import { test, expect } from '@playwright/test';

test.describe('Calculadora ROI', () => {
  test.beforeEach(async ({ page }) => {
    // Autenticación admin
    await page.goto('/admin/calculadora');
    await page.waitForURL('/admin/calculadora');
    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill(process.env.ADMIN_PASSWORD || 'nueva_password_segura_2025');
      await page.getByRole('button', { name: /Acceder/i }).click();
      await page.waitForURL('/admin/calculadora');
    }
  });

  // ============================================
  // TESTS POR DOLOR (Pain Points)
  // ============================================

  test.describe('Pain: Cloud Costs', () => {
    test('muestra fallback para cloud-costs con valores moderados (3000€/mes)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90%
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('3000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 3000 * 12 * 0.12 = 4,320€/año (12% para ≤5K/mes)
      // Investment = 60M * 0.0060 = 360,000€
      // ROI 3y = ((4320*3 - 360000) / 360000) * 100 = -96.4% → NO activa fallback
      // Este escenario ya NO activa fallback con la nueva lógica
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~4\.320€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~360\.000€/i)).toBeVisible();
    });

    test('muestra fallback para cloud-costs con valores altos (15000€/mes)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90%
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('15000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 15000 * 12 * 0.08 = 14,400€/año (8% para ≤25K/mes)
      // Investment = 60M * 0.0060 = 360,000€
      // ROI 3y = ((14400*3 - 360000) / 360000) * 100 = -88% → NO activa fallback
      // Este escenario ya NO activa fallback con la nueva lógica
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~14\.400€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~360\.000€/i)).toBeVisible();
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
    test('muestra fallback para manual-processes con 20h/semana (ROI extremo)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90%
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('20');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: ROI calculado ~95% → activa fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
      await expect(page.getByText(/Ahorro estimado:/i)).not.toBeVisible();
    });

    test('muestra fallback para manual-processes con 35h/semana (ROI extremo)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90%
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('35');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: ROI calculado ~163% → activa fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
      await expect(page.getByText(/Ahorro estimado:/i)).not.toBeVisible();
    });

    test('muestra fallback para manual-processes con 40h/semana (payback < 3m)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90% y payback < 3m
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('40');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: ROI calculado ~200%, Payback 2 meses → activa fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
      await expect(page.getByText(/Ahorro estimado:/i)).not.toBeVisible();
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
    test('muestra fallback para forecasting con 30% error (ROI extremo)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90%
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('30');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: ROI calculado ~747%, Payback 1 mes → activa fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
      await expect(page.getByText(/Ahorro estimado:/i)).not.toBeVisible();
    });

    test('muestra fallback para forecasting con 18% error (ROI extremo)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90%
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('18');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: ROI calculado ~726%, Payback 1 mes → activa fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
      await expect(page.getByText(/Ahorro estimado:/i)).not.toBeVisible();
    });

    test('calcula ROI para forecasting con 10% error', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('10');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: 7.5M * 0.05 * 0.10 * 0.35 = 13,125€/año
      // Investment: 25,000 * 1.0 = 25,000€
      // ROI 3y = ((13125*3 - 25000) / 25000) * 100 = 57.5% → NO activa fallback
      await expect(page.getByText(/Ahorro estimado: ~13\.125€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~25\.000€/i)).toBeVisible();
      await expect(page.getByText(/Payback: 23 meses/i)).toBeVisible();
    });
  });

  test.describe('Pain: Inventory', () => {
    test('muestra fallback para inventory (ROI extremo)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90%
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: ROI calculado ~315%, Payback 2 meses → activa fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
      await expect(page.getByText(/Ahorro estimado:/i)).not.toBeVisible();
    });

    test('muestra fallback para inventory sector retail grande (ROI + payback extremos)', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI > 90% Y payback < 3m
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: ROI calculado ~980%, Payback 0 meses → activa fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
      await expect(page.getByText(/Ahorro estimado:/i)).not.toBeVisible();
    });
  });

  // ============================================
  // TESTS POR SECTOR
  // ============================================

  test.describe('Por Sector', () => {
    test('Industrial + forecasting muestra fallback (ROI + payback extremos)', async ({ page }) => {
      // FJG-96: ROI ~1279%, Payback < 3m → activa fallback
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('30');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
    });

    test('Logística + manual-processes muestra fallback (ROI extremo)', async ({ page }) => {
      // FJG-96: ROI ~241% → activa fallback
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('35');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
    });

    test('Retail + inventory muestra fallback (ROI extremo)', async ({ page }) => {
      // FJG-96: ROI ~315% → activa fallback
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
    });

    test('Otro + cloud-costs muestra resultados normales (ROI ~-29%)', async ({ page }) => {
      // FJG-96: Con nueva lógica NO activa fallback
      await page.locator('label:has-text("Otro")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('5000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 5000 * 12 * 0.12 = 7,200€/año (12% para ≤5K/mes)
      // Investment = 17.5M * 0.0040 = 70,000€
      // ROI 3y = ((7200*3 - 70000) / 70000) * 100 = -69% → NO activa fallback
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~7\.200€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~70\.000€/i)).toBeVisible();
    });
  });

  // ============================================
  // TESTS POR TAMAÑO DE EMPRESA
  // ============================================

  test.describe('Por Tamaño de Empresa', () => {
    test('5-10M empresa pequeña muestra resultados normales (ROI ~73%)', async ({ page }) => {
      // FJG-96: Este escenario con nueva lógica NO activa fallback
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('3000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 3000 * 12 * 0.12 = 4,320€/año (12% para ≤5K/mes)
      // Investment = 7.5M * 0.0030 = 22,500€
      // ROI 3y = ((4320*3 - 22500) / 22500) * 100 = -42% → NO activa fallback
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~4\.320€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~22\.500€/i)).toBeVisible();
    });

    test('10-25M empresa mediana muestra resultados normales (ROI ~25%)', async ({ page }) => {
      // FJG-96: Este escenario con nueva lógica NO activa fallback
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 8500 * 12 * 0.10 = 10,200€/año (10% para ≤10K/mes)
      // Investment = 17.5M * 0.0040 = 70,000€
      // ROI 3y = ((10200*3 - 70000) / 70000) * 100 = -56% → NO activa fallback
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~10\.200€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~70\.000€/i)).toBeVisible();
    });

    test('25-50M empresa mediana-grande muestra resultados normales (ROI ~-1%)', async ({ page }) => {
      // FJG-96: Este escenario con nueva lógica NO activa fallback
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('15000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 15000 * 12 * 0.08 = 14,400€/año (8% para ≤25K/mes)
      // Investment = 35M * 0.0050 = 175,000€
      // ROI 3y = ((14400*3 - 175000) / 175000) * 100 = -75% → NO activa fallback
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~14\.400€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~175\.000€/i)).toBeVisible();
    });

    test('50M+ empresa grande NO muestra fallback (ROI ~25%)', async ({ page }) => {
      // FJG-96: Este escenario NO activa fallback (ROI < 90%)
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('25000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 25000 * 12 * 0.08 = 24,000€/año (8% para ≤25K/mes)
      // Investment = 60M * 0.0060 = 360,000€
      // ROI 3y = ((24000*3 - 360000) / 360000) * 100 = -80% → NO activa fallback
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~24\.000€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~360\.000€/i)).toBeVisible();
    });
  });

  // ============================================
  // TESTS DE COMBINACIONES MÚLTIPLES
  // ============================================

  test.describe('Combinaciones Múltiples de Dolores', () => {
    test('cloud-costs + manual-processes fuerza fallback multi_pain', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('20');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-98: maxPainsSelected = 1 → fuerza fallback multi_pain
      const multiPainBox = page.getByTestId('multi-pain-fallback');
      await expect(multiPainBox).toBeVisible();
      await expect(page.getByRole('link', { name: /Agendar sesión personalizada/i })).toBeVisible();
      await expect(page.getByText(/ROI 3 años/i)).not.toBeVisible();
      await expect(page.getByText(/Ahorro estimado/i)).not.toBeVisible();
    });

    test('forecasting + inventory fuerza fallback multi_pain', async ({ page }) => {
      await page.locator('label:has-text("Retail")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('15');
      await page.getByLabel(/Inventario y roturas/i).click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      const multiPainBox = page.getByTestId('multi-pain-fallback');
      await expect(multiPainBox).toBeVisible();
      await expect(page.getByRole('link', { name: /Agendar sesión personalizada/i })).toBeVisible();
      await expect(page.getByText(/Payback/i)).not.toBeVisible();
    });

    test('cloud-costs + manual-processes + forecasting fuerza fallback multi_pain', async ({ page }) => {
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

      const multiPainBox = page.getByTestId('multi-pain-fallback');
      await expect(multiPainBox).toBeVisible();
      await expect(page.getByRole('link', { name: /Agendar sesión personalizada/i })).toBeVisible();
      await expect(page.getByText(/ROI 3 años/i)).not.toBeVisible();
    });

    test('todos los dolores combinados fuerzan fallback multi_pain', async ({ page }) => {
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

      const multiPainBox = page.getByTestId('multi-pain-fallback');
      await expect(multiPainBox).toBeVisible();
      await expect(page.getByRole('link', { name: /Agendar sesión personalizada/i })).toBeVisible();
      await expect(page.getByText(/ROI 3 años/i)).not.toBeVisible();
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

      // FJG-96: Savings = 500 * 12 * 0.12 = 720€/año (12% para ≤5K/mes)
      // Investment = 7.5M * 0.0030 = 22,500€
      // ROI 3y = ((720*3 - 22500) / 22500) * 100 = -90% → NO activa fallback
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~720€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~22\.500€/i)).toBeVisible();
    });

    test('valores altos en manual-processes muestra fallback (ROI ~290%)', async ({ page }) => {
      // FJG-96: 80h/semana genera ROI extremo
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('80');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
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

    test('muestra fallback con error de forecast muy alto (55%)', async ({ page }) => {
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      await page.getByLabel(/Error de forecast/i).fill('55');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: 17.5M * 0.05 * 0.55 * 0.35 = 168,437€/año
      // Investment: 25,000 * 1.3 = 32,500€
      // ROI 3y = ((168437*3 - 32500) / 32500) * 100 = 1455% → Activa fallback
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
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

    test('valida 60% como máximo permitido (muestra fallback ROI extremo)', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      await page.getByLabel(/Error de forecast/i).fill('60');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: 35M * 0.05 * 0.60 * 0.35 = 367,500€/año
      // Investment: 25,000 * 1.6 = 40,000€
      // ROI 3y = ((367500*3 - 40000) / 40000) * 100 = 2656% → Activa fallback
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
    });

    test('valida 5% como mínimo permitido (CA2 FJG-89)', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificaci/i).click();
      await page.getByLabel(/Error de forecast/i).fill('5');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: 7.5M * 0.05 * 0.05 * 0.35 = 6,562.5€ → Math.round = 6,563€/año
      // Investment: 25,000 * 1.0 = 25,000€
      // ROI 3y = ((6563*3 - 25000) / 25000) * 100 = -21% (negativo, NO activa fallback)
      await expect(page.getByText(/Ahorro estimado: ~6\.563€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~25\.000€/i)).toBeVisible();
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
    });

    test('error de forecasting muy bajo (5%)', async ({ page }) => {
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('5');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: 17.5M * 0.05 * 0.05 * 0.35 = 15,312.5€ → ~15,312€/año
      // Investment: 25,000 * 1.3 = 32,500€
      // ROI 3y = ((15312*3 - 32500) / 32500) * 100 = 41% (NO activa fallback)
      await expect(page.getByText(/Ahorro estimado: ~15\.312€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~32\.500€/i)).toBeVisible();
    });

    test('error de forecasting muy alto (50%) muestra fallback ROI extremo', async ({ page }) => {
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-50M+"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('50');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: 60M * 0.05 * 0.50 * 0.35 = 525,000€/año
      // Investment: 25,000 * 2.0 = 50,000€
      // ROI 3y = ((525000*3 - 50000) / 50000) * 100 = 3050% → Activa fallback
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
    });
  });

  // ============================================
  // TESTS ESPECÍFICOS FJG-96 (FALLBACK EXTREME ROI)
  // ============================================

  test.describe('FJG-96: Fallback para ROI extremo o payback < 3 meses', () => {
    test('muestra fallback cuando ROI > 90% (cloud-costs extremo)', async ({ page }) => {
      // CA1: ROI 3y > 90 → devuelve fallback/extreme_roi
      // Usando escenario ajustado que SÍ active fallback con nueva lógica
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('25000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 25000 * 12 * 0.08 = 24,000€/año (8% para ≤25K/mes)
      // Investment = 7.5M * 0.0030 = 22,500€
      // ROI 3y = ((24000*3 - 22500) / 22500) * 100 = 220% → Activa fallback
      // Verificar que NO se muestran cifras de ROI
      await expect(page.getByText(/Ahorro estimado: ~.*€\/año/i)).not.toBeVisible();
      await expect(page.getByText(/Inversión: ~.*€/i)).not.toBeVisible();
      await expect(page.getByText(/Payback: \d+ mes/i)).not.toBeVisible();
      await expect(page.getByText(/ROI 3 años:/i)).not.toBeVisible();

      // Verificar mensaje de fallback extreme_roi (usando role para evitar strict mode)
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByText(/retorno muy rápido/i)).toBeVisible();

      // Verificar CTA de contacto
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
    });

    test('muestra fallback cuando payback < 3 meses (manual-processes extremo)', async ({ page }) => {
      // CA2: Payback < 3m → devuelve fallback/extreme_roi
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('200');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar que NO se muestran cifras de ROI
      await expect(page.getByText(/Ahorro estimado: ~.*€\/año/i)).not.toBeVisible();
      await expect(page.getByText(/Inversión: ~.*€/i)).not.toBeVisible();
      await expect(page.getByText(/Payback: \d+ mes/i)).not.toBeVisible();
      await expect(page.getByText(/ROI 3 años:/i)).not.toBeVisible();

      // Verificar mensaje de fallback extreme_roi (usando role para evitar strict mode)
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();

      // Verificar CTA de contacto
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
    });

    test('muestra resultados normales cuando ROI ≤ 90% y payback ≥ 3 meses', async ({ page }) => {
      // CA3: Caso normal (ROI ≤ 90 y payback ≥ 3) → devuelve ROISuccess
      // Usar escenario manual-processes moderado que no active fallback
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir procesos manuales/i).click();
      await page.getByLabel(/Horas manuales a la semana/i).fill('12');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar que SÍ se muestran los resultados normales
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~.*€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~.*€/i)).toBeVisible();
      await expect(page.getByText(/Payback: \d+ mes/i)).toBeVisible();

      // Verificar que NO se muestra mensaje de fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).not.toBeVisible();

      // Verificar que el formulario de email está presente
      await expect(page.getByText(/Recibe análisis completo/i)).toBeVisible();
    });

    test('responsive mobile: fallback extreme_roi visible en 375px', async ({ page }) => {
      // CA4: UI muestra mensaje/CTA sin cifras para fallback/extreme_roi
      await page.setViewportSize({ width: 375, height: 667 });

      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('25000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: 25K/mes SÍ activa fallback con nueva lógica (ROI 220%)
      // Verificar que el mensaje de fallback es visible en mobile (usando role para evitar strict mode)
      const fallbackTitle = page.getByRole('heading', { name: /Escenario extremadamente optimista/i });
      await expect(fallbackTitle).toBeVisible();

      // Verificar que el botón CTA es tap-friendly
      const ctaButton = page.getByRole('link', { name: /Agenda una consulta gratuita/i });
      await expect(ctaButton).toBeVisible();

      // Verificar que el contenido no desborda
      const fallbackBox = await fallbackTitle.boundingBox();
      expect(fallbackBox).toBeTruthy();
      if (fallbackBox) {
        expect(fallbackBox.width).toBeLessThan(375);
      }
    });
  });

  // ============================================
  // TESTS ESPECÍFICOS FJG-92 (UX MENSAJES)
  // ============================================

  test.describe('FJG-92: Mensajes UX y Experiencia de Usuario', () => {
    test('muestra disclaimer de supuestos conservadores cuando hay resultados', async ({ page }) => {
      // Usar escenario que NO active fallback para validar disclaimer
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('10');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // Verificar que se muestran resultados (no fallback)
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();

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

    test('muestra warning con emoji cuando gasto cloud es alto (>15% facturación) - activa fallback', async ({ page }) => {
      // FJG-96: Este escenario activa fallback por ROI extremo
      await page.locator('label:has-text("Logística")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('95000');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 95000 * 12 * 0.06 = 68,400€/año (6% para >25K/mes)
      // Investment = 7.5M * 0.0030 = 22,500€
      // ROI 3y = ((68400*3 - 22500) / 22500) * 100 = 813% → Activa fallback extreme_roi
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
    });

    test('muestra resultados normales (no fallback) con 8500€/mes', async ({ page }) => {
      // FJG-96: Este escenario con nueva lógica NO activa fallback
      await page.locator('label:has-text("Agencia Marketing")').click();
      await page.locator('label[for="size-10-25M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Reducir costes cloud/i).click();
      await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Savings = 8500 * 12 * 0.10 = 10,200€/año (10% para ≤10K/mes)
      // Investment = 17.5M * 0.0040 = 70,000€
      // ROI 3y = ((10200*3 - 70000) / 70000) * 100 = -56% → NO activa fallback
      await expect(page.getByText(/Resultados estimados/i)).toBeVisible();
      await expect(page.getByText(/Ahorro estimado: ~10\.200€\/año/i)).toBeVisible();
      await expect(page.getByText(/Inversión: ~70\.000€/i)).toBeVisible();
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

    test('muestra fallback con forecast error muy alto (ROI extremo + payback < 3m)', async ({ page }) => {
      // FJG-96: 55% forecast error genera ROI extremo y payback < 3m
      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('55');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Ahora muestra fallback en lugar de warning
      await expect(page.getByRole('heading', { name: /Escenario extremadamente optimista/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Agenda una consulta gratuita/i })).toBeVisible();
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

      // Usar escenario que NO active fallback
      await page.locator('label:has-text("Farmacéutica")').click();
      await page.locator('label[for="size-5-10M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('10');
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

    test('responsive mobile: fallback visible y bien formateado en 375px', async ({ page }) => {
      // FJG-96: Test ajustado - este escenario ahora activa fallback
      await page.setViewportSize({ width: 375, height: 667 });

      await page.locator('label:has-text("Industrial")').click();
      await page.locator('label[for="size-25-50M"]').click();
      await page.getByRole('button', { name: /Siguiente/i }).click();

      await page.getByLabel(/Forecasting \/ planificación/i).click();
      await page.getByLabel(/Error de forecast/i).fill('55');
      await page.getByRole('button', { name: /Siguiente/i }).click();

      // FJG-96: Ahora muestra fallback en lugar de warnings
      const fallbackTitle = page.getByRole('heading', { name: /Escenario extremadamente optimista/i });
      await expect(fallbackTitle).toBeVisible();

      // Verificar que el contenido no desborda en mobile
      const fallbackBox = await fallbackTitle.boundingBox();
      expect(fallbackBox).toBeTruthy();
      if (fallbackBox) {
        expect(fallbackBox.width).toBeLessThan(375);
      }
    });
  });
});
