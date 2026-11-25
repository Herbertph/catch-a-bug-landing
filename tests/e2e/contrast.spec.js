import { expect, test } from '@playwright/test';
import { measure } from './contrast-helpers.js';

const VIEWPORTS = [
  [390, 844],
  [1280, 800],
  [1920, 1080],
  [320, 800],
  [900, 900],
];

for (const [width, height] of VIEWPORTS) {
  test(`TC-121 (AC-13): every text over the artwork reaches WCAG AA at ${width}x${height}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = reject;
          image.src = './bg-cave.webp';
        }),
    );

    const { failures, measured, total } = await measure(page);
    expect(measured, 'texts measured').toBeGreaterThan(total * 0.9);
    expect(failures).toEqual([]);
  });
}
