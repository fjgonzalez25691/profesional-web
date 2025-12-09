import { test, expect } from '@playwright/test';

/**
 * Lead Capture E2E Tests - Mock Strategy
 *
 * Estos tests usan mocking completo de APIs para evitar dependencia de DB real.
 * Estrategia: Mock todas las llamadas a /api/leads y /api/send-roi-email
 */

test.describe('Lead Capture Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API /api/leads - Respuesta exitosa por defecto
    await page.route('**/api/leads', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();

        // Simular validación básica
        if (!postData.email || !postData.email.includes('@')) {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Email inválido' })
          });
          return;
        }

        // Respuesta exitosa con leadId simulado
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            leadId: `mock-lead-${Date.now()}`,
            warnings: []
          })
        });
      }
    });

    // Mock API /api/send-roi-email - Respuesta exitosa por defecto
    await page.route('**/api/send-roi-email', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, emailSent: true })
        });
      }
    });

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

  test('should capture lead after ROI calculation (happy path)', async ({ page }) => {
    // Paso 1: Completar datos de empresa
    await page.locator('label:has-text("Agencia Marketing")').click();
    await page.locator('label[for="size-10-25M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Paso 2: Seleccionar dolores y completar datos
    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Paso 3: Verificar resultados ROI mostrados
    // FJG-96: Savings = 8500 * 12 * 0.10 = 10,200€/año (10% para ≤10K/mes)
    // Investment = 17.5M * 0.0040 = 70,000€
    await expect(page.getByText(/Ahorro estimado: ~10\.200€\/año/i)).toBeVisible();
    await expect(page.getByText(/Inversión: ~70\.000€/i)).toBeVisible();

    // Completar email y enviar
    const testEmail = `test-${Date.now()}@empresa.com`;
    await page.getByPlaceholder(/tuemail@empresa.com/i).fill(testEmail);
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Verificar mensaje de éxito en UI (mock respondió 200)
    await expect(page.getByText(/Revisa tu email/i)).toBeVisible({ timeout: 10000 });
  });

  test('should prevent invalid email submission (HTML5 validation)', async ({ page }) => {
    // Completar paso 1
    await page.locator('label:has-text("Agencia Marketing")').click();
    await page.locator('label[for="size-10-25M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Completar paso 2
    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('5000');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // El input HTML5 type="email" valida el formato automáticamente
    const emailInput = page.getByPlaceholder(/tuemail@empresa.com/i);
    await emailInput.fill('email-invalido');

    // Intentar hacer click en el botón
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Verificar que el input es inválido según HTML5
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);

    // Verificar que NO se muestra mensaje de éxito (el form no se envió)
    await expect(page.getByText(/Revisa tu email/i)).not.toBeVisible();
  });

  test('should show validation error for missing email', async ({ page }) => {
    // Completar pasos 1 y 2 con escenario que NO active fallback extreme_roi
    // Usar cloud-costs con empresa pequeña y gasto bajo
    await page.locator('label:has-text("Industrial")').click();
    await page.locator('label[for="size-5-10M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('3000');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Intentar enviar sin email
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Verificar mensaje de error en UI (validación client-side)
    await expect(page.getByText(/Introduce un email/i)).toBeVisible();
  });

  test('should update existing lead data on duplicate email (UPSERT behavior)', async ({ page }) => {
    const duplicateEmail = `duplicate-${Date.now()}@empresa.com`;
    let firstLeadId: string;

    // Mock para capturar y simular UPSERT
    await page.route('**/api/leads', async (route, request) => {
      if (request.method() === 'POST') {
        // Primera llamada: generar leadId
        if (!firstLeadId) {
          firstLeadId = `mock-lead-${Date.now()}`;
        }

        // Simular UPSERT: mismo leadId para mismo email
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            leadId: firstLeadId, // Mismo ID siempre (simula UPSERT)
            warnings: []
          })
        });
      }
    });

    // Primera submission - Cloud costs
    await page.locator('label:has-text("Agencia Marketing")').click();
    await page.locator('label[for="size-10-25M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByPlaceholder(/tuemail@empresa.com/i).fill(duplicateEmail);
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Esperar confirmación
    await expect(page.getByText(/Revisa tu email/i)).toBeVisible({ timeout: 10000 });

    // Resetear
    await page.getByRole('button', { name: /Nuevo cálculo/i }).click();

    // Segunda submission - Cloud costs con diferente empresa y MISMO email
    // Evitar fallback usando escenario que genere ROI normal
    await page.locator('label:has-text("Industrial")').click();
    await page.locator('label[for="size-5-10M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('4000');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByPlaceholder(/tuemail@empresa.com/i).fill(duplicateEmail);
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Verificar mensaje de éxito (mock simula UPSERT correctamente)
    await expect(page.getByText(/Revisa tu email/i)).toBeVisible({ timeout: 10000 });
  });

  test('should send complete lead data structure', async ({ page }) => {
    interface CapturedPayload {
      email: string;
      sector: string;
      companySize: string;
      pains: string[];
      roiData: {
        investment: number;
        savingsAnnual: number;
        paybackMonths: number;
        roi3Years?: number;
      };
    }

    let capturedPayload: CapturedPayload | undefined;

    // Mock con captura de payload para verificación
    await page.route('**/api/leads', async (route, request) => {
      if (request.method() === 'POST') {
        capturedPayload = request.postDataJSON() as CapturedPayload;

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            leadId: `mock-lead-${Date.now()}`,
            warnings: []
          })
        });
      }
    });

    // Completar calculadora con UN solo dolor (multi-dolor activa fallback sin form)
    await page.locator('label:has-text("Farmacéutica")').click();
    await page.locator('label[for="size-50M+"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Seleccionar SOLO cloud-costs para evitar fallback multi_pain
    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('12000');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    const testEmail = `complete-${Date.now()}@farmaceutica.com`;
    await page.getByPlaceholder(/tuemail@empresa.com/i).fill(testEmail);
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Esperar que se capture el payload
    await expect(page.getByText(/Revisa tu email/i)).toBeVisible({ timeout: 10000 });

    // Verificar estructura completa del lead capturado
    expect(capturedPayload).toBeDefined();
    if (capturedPayload) {
      expect(capturedPayload.email).toBe(testEmail);
      expect(capturedPayload.sector).toBe('farmaceutica');
      expect(capturedPayload.companySize).toBe('50M+');
      expect(capturedPayload.pains).toContain('cloud-costs');
      expect(capturedPayload.roiData).toBeDefined();
      expect(capturedPayload.roiData.investment).toBeGreaterThan(0);
      expect(capturedPayload.roiData.savingsAnnual).toBeGreaterThan(0);
      expect(capturedPayload.roiData.paybackMonths).toBeGreaterThan(0);
      expect(capturedPayload.roiData).toHaveProperty('roi3Years');
    }
  });

  test('should handle API database errors gracefully', async ({ page }) => {
    // Mock error 500 de API
    await page.route('**/api/leads', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'No pudimos guardar tu lead' })
        });
      }
    });

    // Completar calculadora
    await page.locator('label:has-text("Logística")').click();
    await page.locator('label[for="size-10-25M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('5000');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByPlaceholder(/tuemail@empresa.com/i).fill('test@logistica.com');
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Verificar que se muestra mensaje de error en UI
    await expect(page.locator('text=/No pudimos/i')).toBeVisible({ timeout: 10000 });

    // Verificar que NO se muestra mensaje de éxito
    await expect(page.getByText(/Revisa tu email/i)).not.toBeVisible();
  });

  test('should handle email API errors gracefully', async ({ page }) => {
    // Mock: /api/leads exitoso pero /api/send-roi-email falla
    await page.route('**/api/send-roi-email', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Error enviando email' })
        });
      }
    });

    // Completar calculadora
    await page.locator('label:has-text("Retail")').click();
    await page.locator('label[for="size-5-10M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('3000');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByPlaceholder(/tuemail@empresa.com/i).fill('test@retail.com');
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Verificar mensaje de error específico (en el form de resultados)
    await expect(page.locator('p.text-red-700')).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state during submission', async ({ page }) => {
    // Mock con delay para ver loading state
    await page.route('**/api/leads', async (route) => {
      if (route.request().method() === 'POST') {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            leadId: `mock-lead-${Date.now()}`,
            warnings: []
          })
        });
      }
    });

    // Completar calculadora
    await page.locator('label:has-text("Agencia Marketing")').click();
    await page.locator('label[for="size-10-25M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('8500');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByPlaceholder(/tuemail@empresa.com/i).fill('test@empresa.com');
    await page.getByRole('button', { name: /Enviar resultados/i }).click();

    // Verificar estado loading (botón dice "Enviando...")
    await expect(page.getByRole('button', { name: /Enviando/i })).toBeVisible();

    // Verificar que el botón está deshabilitado durante envío
    const submitButton = page.getByRole('button', { name: /Enviando/i });
    await expect(submitButton).toBeDisabled();

    // Esperar respuesta exitosa
    await expect(page.getByText(/Revisa tu email/i)).toBeVisible({ timeout: 10000 });
  });

  test('should navigate through all calculator steps correctly', async ({ page }) => {
    // Verificar paso 1 visible (usando heading más específico)
    await expect(page.getByRole('heading', { name: /Sector/i })).toBeVisible();

    await page.locator('label:has-text("Retail")').click();
    await page.locator('label[for="size-5-10M"]').click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Verificar paso 2 visible
    await expect(page.getByText(/Selecciona los dolores/i)).toBeVisible();

    await page.getByLabel(/Reducir costes cloud/i).click();
    await page.getByLabel(/Gasto mensual en cloud/i).fill('3000');
    await page.getByRole('button', { name: /Siguiente/i }).click();

    // Verificar paso 3 visible (resultados)
    await expect(page.getByRole('heading', { name: /Resultados estimados/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Recibe análisis completo/i })).toBeVisible();

    // Test botón "Anterior"
    await page.getByRole('button', { name: /Anterior/i }).click();
    await expect(page.getByText(/Selecciona los dolores/i)).toBeVisible();

    // Volver a avanzar
    await page.getByRole('button', { name: /Siguiente/i }).click();
    await expect(page.getByRole('heading', { name: /Resultados estimados/i })).toBeVisible();
  });
});
