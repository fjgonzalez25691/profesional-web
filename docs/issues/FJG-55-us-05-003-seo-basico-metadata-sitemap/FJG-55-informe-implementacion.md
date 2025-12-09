# Informe de implementación FJG-55

## Cambios
- Metadata completa reproducida en `app/layout.tsx` incluyendo `metadataBase`, título optimizado, descripción, keywords long-tail, OG/Twitter cards y configuración `robots`.
- Script JSON-LD de tipo `ProfessionalService` inyectado en el `<head>` del layout para cumplir el CA4.
- Sitemap dinámico con las cuatro rutas requeridas (`/`, `/calculadora-roi`, `/legal/aviso-legal`, `/legal/privacidad`) en `app/sitemap.ts`.
- `public/robots.txt` con `Allow: /` y referencia al sitemap, y placeholder PNG 1200×630 (`og-image.png`) para los metadatos gráficos.
- Añadidos tests: `__tests__/metadata.test.ts` (Vitest) y `__tests__/e2e/seo.spec.ts` (Playwright) que validan metadata, sitemap, robots.txt y JSON-LD.

## Pruebas ejecutadas
- `npm run test -- metadata` (Vitest).

## Pendientes / Observaciones
- Ejecutar `npm run test:e2e` para validar los escenarios Playwright (se agregó el archivo pero no se ejecutó en este entorno).
