import { expect, test } from '@playwright/test';
import { reachResult } from './helpers.js';

const EBOOK_LABELS = ['EBOOK 01', 'EBOOK 02', 'EBOOK 03', 'EBOOK 04', 'EBOOK 05', 'EBOOK 06', 'EBOOK 07'];

test('TC-43 (AC-28): all first options give 14/14, the top band and every area conferido', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, Array(7).fill(0), 'ana@site.com');

  await expect(page.locator('.result-points')).toHaveText('14/14');
  await expect(page.locator('.result-band-title')).toHaveText('Almost ready, close the gaps');
  await expect(page.locator('.result-band-text')).toHaveText(
    "Your checking base is good. What's missing is turning it into a method, so you repeat the full check on every launch.",
  );
  await expect(page.locator('.result-area .area-status')).toHaveText(Array(7).fill('checked'));
  await expect(page.locator('.result-priority')).toHaveText(
    'No uncovered areas. In the ebooks, what you gain is the complete method and the release checklist to repeat this on every launch.',
  );
  await expect(page.locator('.result-note')).toHaveText(
    'Keep your uncovered areas, they become your checking plan before your next launch.',
  );
});

test('TC-44 (AC-29): all last options give 0/14, the risk band and every area descoberto', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, Array(7).fill(2));

  await expect(page.locator('.result-points')).toHaveText('0/14');
  await expect(page.locator('.result-band-title')).toHaveText('Launch at risk');
  await expect(page.locator('.result-band-text')).toHaveText(
    'Most of the critical areas have never been checked. If a customer finds these bugs before you do, they find them all at once.',
  );
  await expect(page.locator('.result-area .area-status')).toHaveText(Array(7).fill('uncovered'));
  await expect(page.locator('.result-priority')).toHaveText(
    'Your priority ebooks: Ebook 01 (Login and session), Ebook 02 (Payment and checkout), Ebook 03 (Saving and data loss), Ebook 04 (Permissions and access), Ebook 05 (Main flow, end to end), Ebook 06 (Errors and edge cases), Ebook 07 (Mobile and browsers). These are exactly the areas the ebooks break down, each with a ready-made prompt and a manual check.',
  );
});

test('TC-45 (AC-30): a total of 4 stays in the risk band', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, [0, 0, 2, 2, 2, 2, 2]);
  await expect(page.locator('.result-points')).toHaveText('4/14');
  await expect(page.locator('.result-band-title')).toHaveText('Launch at risk');
});

test('TC-46 (AC-30): a total of 10 enters the top band', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, [0, 0, 0, 0, 1, 1, 2]);
  await expect(page.locator('.result-points')).toHaveText('10/14');
  await expect(page.locator('.result-band-title')).toHaveText('Almost ready, close the gaps');
});

test('TC-47 (AC-31): mixed answers show each area status, its ebook and only the weak areas as priority', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, [0, 1, 2, 0, 1, 2, 0]);

  await expect(page.locator('.result-points')).toHaveText('8/14');
  await expect(page.locator('.result-area .area-name')).toHaveText([
    'Login and session',
    'Payment and checkout',
    'Saving and data loss',
    'Permissions and access',
    'Main flow, end to end',
    'Errors and edge cases',
    'Mobile and browsers',
  ]);
  await expect(page.locator('.result-area .area-status')).toHaveText([
    'checked',
    'partial',
    'uncovered',
    'checked',
    'partial',
    'uncovered',
    'checked',
  ]);
  await expect(page.locator('.result-area .area-ebook')).toHaveText(EBOOK_LABELS);
  await expect(page.locator('.result-priority')).toHaveText(
    'Your priority ebooks: Ebook 02 (Payment and checkout), Ebook 03 (Saving and data loss), Ebook 05 (Main flow, end to end), Ebook 06 (Errors and edge cases). These are exactly the areas the ebooks break down, each with a ready-made prompt and a manual check.',
  );
});
