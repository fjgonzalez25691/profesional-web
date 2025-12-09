import { test, expect } from "@playwright/test";

test.describe("SEO básico", () => {
  test("metadata en el head y robots meta", async ({ page }) => {
    await page.goto("/");

    const title = await page.title();
    expect(title).toContain("Francisco García");
    expect(title).toContain("Reducción Cloud");

    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDescription).toContain("Reduzco factura cloud");
    expect(metaDescription).toContain("30-70%");

    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toContain("Reducción Cloud");

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toContain("/og-image.png");

    const robotsMeta = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robotsMeta).toContain("index");
    expect(robotsMeta).toContain("follow");
  });

  test("sitemap.xml expone las URLs requeridas", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain("xml");

    const content = await response?.text();
    expect(content).toContain("<?xml");
    expect(content).toContain("<urlset");
    expect(content).toContain("https://fjgaparicio.es");
    // Calculadora movida a /admin/calculadora (no indexada)
    expect(content).not.toContain("/calculadora-roi");
    expect(content).toContain("/legal/aviso-legal");
    expect(content).toContain("/legal/privacidad");

    const urlCount = (content?.match(/<loc>/g) || []).length;
    expect(urlCount).toBeGreaterThanOrEqual(4);
  });

  test("robots.txt permite crawling y referencia al sitemap", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);

    const text = await response?.text();
    expect(text).toContain("User-agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain("Sitemap: https://fjgaparicio.es/sitemap.xml");
  });

  test("JSON-LD Schema.org está presente en el head", async ({ page }) => {
    await page.goto("/");
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(jsonLd).toBeTruthy();

    const schema = JSON.parse(jsonLd!);
    expect(schema["@type"]).toBe("ProfessionalService");
    expect(schema.name).toContain("Francisco García");
    expect(schema.url).toBe("https://fjgaparicio.es");
  });
});
