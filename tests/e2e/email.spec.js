import { expect, test } from '@playwright/test';
import { fillEmail, reachEmail, reachResult, submitEmail } from './helpers.js';

const ERROR = 'Please check the email you typed, something seems to be missing.';
const INVALID = ['', '   ', 'ana', 'ana@', '@site.com', 'ana@site', 'ana@site.c', 'ana silva@site.com', 'ana@@site.com'];

test('TC-37 (AC-24): the e-mail screen shows the exact copy and field attributes', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);

  await expect(page.locator('.quiz-area')).toHaveText('YOUR RESULT IS READY');
  await expect(page.locator('.quiz-count')).toHaveText('Just your email left');
  await expect(page.locator('.quiz-question')).toHaveText('Where should I show you the diagnostic?');
  await expect(page.locator('.quiz-hint')).toHaveText(
    'Leave your email to see your full score, with your uncovered areas and the ebooks to read first for your case.',
  );

  const field = page.getByLabel('Your email to see the diagnostic');
  await expect(field).toHaveAttribute('type', 'email');
  await expect(field).toHaveAttribute('autocomplete', 'email');
  await expect(field).toHaveAttribute('placeholder', 'your best email');

  await expect(page.getByRole('button', { name: 'Show my diagnostic' })).toBeVisible();
  await expect(page.locator('.email-note')).toHaveText('Your result appears on screen as soon as you confirm.');
});

test('TC-38 (AC-25): every invalid e-mail shows the exact error, focuses the field and shows no result', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);

  const field = page.getByLabel('Your email to see the diagnostic');
  const error = page.locator('.email-error');

  for (const value of INVALID) {
    await fillEmail(page, value);
    await page.getByRole('button', { name: 'Show my diagnostic' }).click();

    await expect(error, `error for ${JSON.stringify(value)}`).toBeVisible();
    await expect(error).toHaveText(ERROR);
    await expect(field).toBeFocused();
    await expect(page.getByText('YOUR DIAGNOSTIC')).toHaveCount(0);
  }
});

test('TC-39 (AC-26): a valid e-mail clears the error and shows the result immediately', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);

  await fillEmail(page, 'ana');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.locator('.email-error')).toBeVisible();

  await fillEmail(page, 'ana@site.com');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();

  await expect(page.locator('.email-error')).toHaveCount(0);
  await expect(page.getByText('YOUR DIAGNOSTIC')).toBeVisible();
  await expect(page.locator('.quiz-email')).toHaveText('ana@site.com');
});

test('TC-40 (AC-26): accepts a plus and subdomain e-mail', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, Array(7).fill(2), 'a.b+c@sub.dominio.com.br');
  await expect(page.locator('.quiz-email')).toHaveText('a.b+c@sub.dominio.com.br');
});

test('TC-41 (AC-27): the e-mail is never sent over the network', async ({ page }) => {
  const requests = [];
  page.on('request', (request) => {
    requests.push(`${request.url()} ${request.postData() ?? ''}`);
  });

  await page.goto('/');
  await reachEmail(page);
  await fillEmail(page, 'ana@site.com');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.getByText('YOUR DIAGNOSTIC')).toBeVisible();

  expect(requests.filter((request) => request.includes('ana@site.com'))).toEqual([]);
});

test('TC-42 (AC-27): e-mail markup is rendered as text, not HTML', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);

  await submitEmail(page, '<b>x</b>@a.bc');

  await expect(page.getByText('YOUR DIAGNOSTIC')).toBeVisible();
  await expect(page.locator('.quiz-email')).toHaveText('<b>x</b>@a.bc');
  await expect(page.locator('.quiz-email *')).toHaveCount(0);
});

test('TC-63 (AC-24): a very long e-mail does not overflow the result header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const longEmail = `${'a'.repeat(120)}@${'b'.repeat(60)}.com`;
  await reachResult(page, Array(7).fill(0), longEmail);

  await expect(page.locator('.quiz-email')).toHaveText(longEmail);
  const screenOverflow = await page.locator('.phone-screen').evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(screenOverflow).toBeLessThanOrEqual(0);
  const docOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(docOverflow).toBeLessThanOrEqual(0);
});
