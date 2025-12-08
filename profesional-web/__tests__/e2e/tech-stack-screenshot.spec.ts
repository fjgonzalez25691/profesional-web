import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const screenshotsDir = path.resolve(
  __dirname,
  '..',
  '..',
  'docs',
  'issues',
  'FJG-54-us-05-002-diagrama-arquitectura-tech-stack-svg-estatico',
  'screenshots',
);

test.beforeAll(() => {
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
});

test('captura sección tech stack', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.locator('section#tech-stack').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { level: 2, name: /Stack Tecnológico Transparente/i })).toBeVisible();

  const fileName = `tech-stack-${testInfo.project.name.replace(/\s+/g, '-').toLowerCase()}.png`;
  await page.screenshot({
    path: path.join(screenshotsDir, fileName),
    fullPage: true,
  });
});
