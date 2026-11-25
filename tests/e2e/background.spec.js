import { readFileSync, statSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { answerAll, openQuiz, submitEmail } from './helpers.js';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};

function backgroundLayer(page) {
  return page.evaluate(() => {
    const style = getComputedStyle(document.body, '::before');
    return {
      position: style.position,
      inset: [style.top, style.right, style.bottom, style.left],
      image: style.backgroundImage,
      size: style.backgroundSize,
      zIndex: style.zIndex,
      animation: style.animationName,
      transition: style.transitionDuration,
    };
  });
}

function waitForArtwork(page) {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = './bg-cave.webp';
      }),
  );
}

function alpha(color) {
  const parts = color.match(/rgba?\(([^)]+)\)/)[1].split(',');
  return parts.length === 4 ? Number(parts[3]) : 1;
}

async function contrastViolations(page) {
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  return results.violations.flatMap((violation) => violation.nodes.map((node) => node.target.join(' ')));
}

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`${name} ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test('TC-109 (AC-9): a decorative CSS layer with the cave artwork covers the viewport', async ({ page }) => {
      const artwork = page.waitForResponse((response) => response.url().endsWith('/bg-cave.webp'));
      await page.goto('/');
      expect((await artwork).status()).toBe(200);

      const layer = await backgroundLayer(page);
      expect(layer.position).toBe('fixed');
      expect(layer.inset).toEqual(['0px', '0px', '0px', '0px']);
      expect(layer.zIndex).toBe('-1');
      expect(layer.image).toContain('bg-cave.webp');
      expect(layer.size).toContain('cover');
      await expect(page.locator('img[src*="bg-cave"]')).toHaveCount(0);
    });

    test('TC-110 (AC-10): the background layer stays fixed while scrolling to the middle and the bottom', async ({ page }) => {
      await page.goto('/');
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (const y of [height / 2, height]) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
        const layer = await backgroundLayer(page);
        expect(layer.position).toBe('fixed');
        expect(layer.inset).toEqual(['0px', '0px', '0px', '0px']);
      }
    });

    test('TC-113 (AC-13): no axe color-contrast violations with the artwork loaded', async ({ page }) => {
      await page.goto('/');
      await waitForArtwork(page);
      expect(await contrastViolations(page)).toEqual([]);
    });
  });
}

test('TC-111 (AC-11): without the artwork the page falls back to --bg and the quiz works end to end', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource')) errors.push(message.text());
  });
  await page.route('**/bg-cave.webp', (route) => route.abort());

  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(12, 13, 15)');
  expect(await contrastViolations(page)).toEqual([]);

  await openQuiz(page);
  await answerAll(page, Array(7).fill(0));
  await submitEmail(page, 'ana@site.com');
  await expect(page.getByText('YOUR DIAGNOSTIC', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('TC-112 (AC-12): the built artwork is a WebP of at most 300 KB and is not inlined', () => {
  const file = new URL('../../dist/bg-cave.webp', import.meta.url);
  const bytes = readFileSync(file);
  expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF');
  expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP');
  expect(statSync(file).size).toBeLessThanOrEqual(300 * 1024);

  const html = readFileSync(new URL('../../dist/index.html', import.meta.url), 'utf8');
  expect(html).not.toContain('data:image/');
  expect(html).toContain("url('./bg-cave.webp')");
});

test('TC-114 (AC-14): sections and panels are translucent, header and sticky bar keep the §5 values', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.mobile);
  await page.goto('/');
  const colors = await page.evaluate(() => {
    const color = (selector) => getComputedStyle(document.querySelector(selector)).backgroundColor;
    return {
      proof: color('.proof'),
      card: color('.card'),
      accordion: color('.accordion'),
      faq: color('.faq-accordion'),
      instructor: color('.instructor'),
      finalCta: color('.final-cta'),
      header: color('.site-header'),
      mobileBar: color('.mobile-bar'),
    };
  });
  for (const key of ['proof', 'card', 'accordion', 'faq', 'instructor', 'finalCta']) {
    expect(alpha(colors[key]), key).toBeLessThan(1);
  }
  expect(colors.header).toBe('rgba(12, 13, 15, 0.92)');
  expect(colors.mobileBar).toBe('rgba(18, 19, 22, 0.97)');
});

test('TC-115 (AC-15): the quiz modal keeps its opaque §5 colors', async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);
  const colors = await page.evaluate(() => ({
    backdrop: getComputedStyle(document.querySelector('.quiz-modal')).backgroundColor,
    frame: getComputedStyle(document.querySelector('.phone-frame')).backgroundColor,
    screen: getComputedStyle(document.querySelector('.phone-screen')).backgroundColor,
  }));
  expect(colors).toEqual({ backdrop: 'rgba(4, 4, 6, 0.78)', frame: 'rgb(5, 5, 6)', screen: 'rgb(23, 24, 28)' });
});

test('TC-116 (AC-16): no horizontal scroll and the background covers the viewport at every breakpoint', async ({ page }) => {
  await page.goto('/');
  const sizes = [[320, 800], [390, 844], [620, 900], [621, 900], [900, 900], [901, 900], [1280, 800], [1920, 1080]];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const result = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;inset:0;pointer-events:none';
      document.body.append(probe);
      const viewport = probe.getBoundingClientRect();
      probe.remove();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        viewport: [viewport.width, viewport.height],
        window: [window.innerWidth, window.innerHeight],
      };
    });
    expect(result.scrollWidth, `width ${width}`).toBeLessThanOrEqual(result.clientWidth);
    expect(result.viewport, `width ${width}`).toEqual([result.clientWidth, result.window[1]]);
    const layer = await backgroundLayer(page);
    expect(layer.inset).toEqual(['0px', '0px', '0px', '0px']);
    expect(layer.size).toContain('cover');
  }
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('TC-117 (AC-17): the background has no animation or transition', async ({ page }) => {
    await page.goto('/');
    const layer = await backgroundLayer(page);
    expect(layer.animation).toBe('none');
    expect(layer.transition).toBe('0s');
  });
});
