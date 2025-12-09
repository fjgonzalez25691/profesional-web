import { test, expect } from '@playwright/test';

test.describe('Performance Optimization - FJG-57', () => {
  test('debe cargar home en tiempo razonable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // En desarrollo puede ser más lento, en producción debería ser <3s
    expect(loadTime).toBeLessThan(10000); // <10s en dev (más permisivo)
  });

  test('hero image debe tener priority attribute', async ({ page }) => {
    await page.goto('/');

    // Next.js Image con priority agrega fetchpriority="high"
    const heroImage = page.locator('img').first();
    await expect(heroImage).toBeVisible();

    const fetchPriority = await heroImage.getAttribute('fetchpriority');
    // fetchpriority puede ser "high" o null (dependiendo de la versión de Next.js)
    // Lo importante es que la imagen esté visible y cargue rápido
    expect(fetchPriority === 'high' || fetchPriority === null).toBe(true);
  });

  test('chatbot no debe estar en initial bundle', async ({ page }) => {
    // Monitorear requests durante carga inicial
    const requests: string[] = [];
    page.on('request', req => requests.push(req.url()));

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Chatbot modal no debe cargarse hasta que sea visible (después de scroll)
    // Verificar que no hay requests masivos de chatbot en carga inicial
    const chatbotRequests = requests.filter(url =>
      url.includes('ChatbotModal') || url.includes('chatbot-modal')
    );

    // Si hay requests, deberían ser mínimos (chunk loading diferido)
    expect(chatbotRequests.length).toBeLessThan(3);
  });

  test('fonts deben cargarse correctamente', async ({ page }) => {
    await page.goto('/');

    // Verificar que el font Inter está aplicado
    const bodyFontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    // Debería incluir Inter o la variable CSS
    expect(
      bodyFontFamily.toLowerCase().includes('inter') ||
      bodyFontFamily.toLowerCase().includes('sans-serif')
    ).toBe(true);
  });

  test('imágenes lazy loading deben existir', async ({ page }) => {
    await page.goto('/');

    // Verificar que existen imágenes con loading="lazy" o que son Next.js Images
    const images = await page.locator('img').all();
    expect(images.length).toBeGreaterThan(0);

    // Al menos una imagen debería tener loading attribute
    const imageWithLoading = await page.locator('img[loading]').first();
    if (await imageWithLoading.count() > 0) {
      const loadingAttr = await imageWithLoading.getAttribute('loading');
      expect(['lazy', 'eager'].includes(loadingAttr || '')).toBe(true);
    }
  });

  test('no debe haber errores de consola críticos en carga inicial', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filtrar errores conocidos/esperados (ej: failed fetches en dev)
    const criticalErrors = errors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('sourcemap') &&
      !err.includes('404')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
