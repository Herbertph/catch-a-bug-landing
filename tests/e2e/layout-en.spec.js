import { expect, test } from '@playwright/test';
import { reachResult } from './helpers.js';

test('TC-215 (AC-14): result rows keep EBOOK NN on one line at 320px', async ({ page }) => {
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

const WIDTHS = [320, 390, 620, 621, 900, 901, 1280, 1920];

// An element cuts its text when it clips overflow and its content is wider or taller than its box.
function layoutProblems(root) {
  return root.evaluate((scope) => {
    const problems = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth) problems.push(`horizontal scroll ${doc.scrollWidth} > ${doc.clientWidth}`);
    for (const element of scope.querySelectorAll('*')) {
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const hasText = [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim());
      if (!hasText) continue;
      const clipsX = style.overflowX !== 'visible' || style.textOverflow === 'ellipsis';
      const clipsY = style.overflowY !== 'visible' || Number(style.webkitLineClamp) > 0;
      const label = `${element.tagName.toLowerCase()}.${element.className} "${element.textContent.trim().slice(0, 30)}"`;
      if (clipsX && element.scrollWidth > element.clientWidth + 1) problems.push(`cut horizontally: ${label}`);
      if (clipsY && element.scrollHeight > element.clientHeight + 1) problems.push(`cut vertically: ${label}`);
      const box = element.getBoundingClientRect();
      if (box.width > 0 && (box.right > doc.clientWidth + 1 || box.left < -1)) problems.push(`outside viewport: ${label}`);
    }
    return problems;
  });
}

for (const width of WIDTHS) {
  test(`TC-214 (AC-14): no horizontal scroll and no cut text on the page and the result at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await layoutProblems(page.locator('body'))).toEqual([]);
    // Accordions keep one item open, so open each item in turn and check its body.
    const toggles = page.locator('.accordion .acc-trigger');
    for (let index = 0; index < (await toggles.count()); index += 1) {
      const toggle = toggles.nth(index);
      if ((await toggle.getAttribute('aria-expanded')) === 'false') await toggle.click();
      const panel = toggle.locator('xpath=ancestor::div[contains(@class, "acc-item")][1]');
      expect(await layoutProblems(panel), await toggle.innerText()).toEqual([]);
    }

    await page.goto('/');
    await reachResult(page, [0, 1, 2, 0, 1, 2, 0]);
    expect(await layoutProblems(page.locator('.phone-screen'))).toEqual([]);
  });
}
