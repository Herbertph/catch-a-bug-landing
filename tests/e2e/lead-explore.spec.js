import { expect, test } from '@playwright/test';
import { fillEmail, mockMailerLite, parseBody, reachEmail, reachResult, useConfig } from './helpers.js';

// Exploratory cases outside the ACs of lead-capture-and-legal (QA).

test('TC-321 (AC-1): a fast double submit still sends exactly one lead', async ({ page }) => {
  await useConfig(page);
  const requests = await mockMailerLite(page);
  await page.goto('/');
  await reachEmail(page);
  await fillEmail(page, 'ana@site.com');
  await page.getByRole('button', { name: 'Show my diagnostic' }).dblclick();
  await expect(page.locator('.result-points')).toBeVisible();
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(1);
});

test('TC-322 (AC-1): surrounding spaces are trimmed and special characters survive the form encoding', async ({ page }) => {
  await useConfig(page);
  const requests = await mockMailerLite(page);
  await page.goto('/');
  await reachResult(page, Array(7).fill(0), '  ana+test&x=1@site.com  ');
  await expect.poll(() => requests.length).toBe(1);
  expect(parseBody(requests[0]).get('fields[email]')).toBe('ana+test&x=1@site.com');
});

test('TC-323 (AC-8): opening the privacy link keeps the quiz on the email screen', async ({ page, context }) => {
  await page.goto('/');
  await reachEmail(page);
  await fillEmail(page, 'ana@site.com');
  const [popup] = await Promise.all([context.waitForEvent('page'), page.getByRole('dialog').getByRole('link', { name: 'Privacy policy' }).click()]);
  await popup.waitForLoadState();
  expect(new URL(popup.url()).pathname).toMatch(/privacy\.html$/);
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  await expect(page.getByLabel('Your email to see the diagnostic')).toHaveValue('ana@site.com');
});
