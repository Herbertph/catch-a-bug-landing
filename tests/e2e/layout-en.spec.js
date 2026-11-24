import { expect, test } from '@playwright/test';
import { reachResult } from './helpers.js';

test('AC-14: result rows keep EBOOK NN on one line at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await reachResult(page, [0, 1, 2, 0, 1, 2, 0]);
  const tags = page.locator('.area-ebook');
  await expect(tags).toHaveCount(7);
  for (const height of await tags.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().height))) {
    expect(height).toBeLessThan(24);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
