import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { measure } from './contrast-helpers.js';
import { reachEmail } from './helpers.js';

const WIDTHS = [320, 390, 900, 1280];
const PAGES = ['privacy.html', 'terms.html', 'refund.html'];

const horizontalOverflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

async function axeContrast(page, include) {
  const builder = new AxeBuilder({ page }).withRules(['color-contrast']);
  if (include) builder.include(include);
  const results = await builder.analyze();
  return results.violations.flatMap((violation) => violation.nodes.map((node) => node.target.join(' ')));
}

for (const width of WIDTHS) {
  for (const path of PAGES) {
    test(`TC-313 (AC-13): ${path} at ${width}px has no horizontal scroll and every text reaches WCAG AA`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`/${path}`);
      await page.evaluate(() => document.fonts.ready);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      expect(await axeContrast(page)).toEqual([]);
      const { failures } = await measure(page);
      expect(failures).toEqual([]);
    });
  }

  test(`TC-313 (AC-13): the email screen with the consent notice at ${width}px fits and passes contrast`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await reachEmail(page);
    const consent = page.locator('.email-consent');
    await expect(consent).toBeVisible();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    const fits = await consent.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const screen = element.closest('.phone-screen').getBoundingClientRect();
      return element.scrollWidth <= element.clientWidth && box.left >= screen.left && box.right <= screen.right;
    });
    expect(fits).toBe(true);
    expect(await axeContrast(page, '.phone-screen')).toEqual([]);
  });
}
