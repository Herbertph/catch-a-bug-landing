import { expect, test } from '@playwright/test';
import { fillEmail, mockMailerLite, parseBody, reachEmail, reachResult, submitEmail, useConfig } from './helpers.js';

const ENDPOINT = 'https://assets.mailerlite.com/jsonp/100200/forms/300400/subscribe';

// Answer indexes: 0 gives 2 points, 1 gives 1 point, 2 gives 0 points.
const MIXED = [0, 1, 2, 0, 1, 2, 0];

test('AC-1: a valid submit sends exactly one lead with email, score, band and open areas', async ({ page }) => {
  await useConfig(page);
  const requests = await mockMailerLite(page);
  await page.goto('/');
  await reachResult(page, MIXED, 'ana@site.com');

  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0].url).toBe(ENDPOINT);
  const body = parseBody(requests[0]);
  expect(body.get('fields[email]')).toBe('ana@site.com');
  expect(body.get('fields[quiz_score]')).toBe('8');
  expect(body.get('fields[quiz_band]')).toBe('Partial base, open gaps');
  expect(body.get('fields[quiz_open_areas]')).toBe(
    'Payment and checkout, Saving and data loss, Main flow, end to end, Errors and edge cases',
  );
  expect(body.get('ml-submit')).toBe('1');
  expect(body.get('anticsrf')).toBe('true');
});

test('AC-2: all first options send 14, the top band and no open areas', async ({ page }) => {
  await useConfig(page);
  const requests = await mockMailerLite(page);
  await page.goto('/');
  await reachResult(page, Array(7).fill(0));

  await expect.poll(() => requests.length).toBe(1);
  const body = parseBody(requests[0]);
  expect(body.get('fields[quiz_score]')).toBe('14');
  expect(body.get('fields[quiz_band]')).toBe('Almost ready, close the gaps');
  expect(body.get('fields[quiz_open_areas]')).toBe('');
});

test('AC-2: all last options send 0, the risk band and the 7 areas in ebook order', async ({ page }) => {
  await useConfig(page);
  const requests = await mockMailerLite(page);
  await page.goto('/');
  await reachResult(page, Array(7).fill(2));

  await expect.poll(() => requests.length).toBe(1);
  const body = parseBody(requests[0]);
  expect(body.get('fields[quiz_score]')).toBe('0');
  expect(body.get('fields[quiz_band]')).toBe('Launch at risk');
  expect(body.get('fields[quiz_open_areas]')).toBe(
    'Login and session, Payment and checkout, Saving and data loss, Permissions and access, Main flow, end to end, Errors and edge cases, Mobile and browsers',
  );
});

test('AC-3: an invalid email sends nothing', async ({ page }) => {
  await useConfig(page);
  const requests = await mockMailerLite(page);
  await page.goto('/');
  await reachEmail(page);

  for (const value of ['', 'ana', 'ana@', 'ana@site']) {
    await submitEmail(page, value);
    await expect(page.locator('.email-error')).toBeVisible();
  }
  await page.waitForTimeout(300);
  expect(requests).toEqual([]);
});

for (const [name, options] of [
  ['HTTP 500', { status: 500 }],
  ['an aborted request', { abort: true }],
  ['a request that hangs', { hang: true }],
]) {
  test(`AC-4: with ${name}, the result shows at once and page code logs no error`, async ({ page }) => {
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && !/Failed to load resource/.test(message.text())) errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await useConfig(page);
    const requests = await mockMailerLite(page, options);
    await page.goto('/');
    await reachEmail(page);
    await fillEmail(page, 'ana@site.com');
    await page.getByRole('button', { name: 'Show my diagnostic' }).click();

    await expect(page.getByText('YOUR DIAGNOSTIC', { exact: true })).toBeVisible({ timeout: 1000 });
    await expect.poll(() => requests.length).toBe(1);
    await page.waitForTimeout(options.hang ? 10_000 : 500);
    await expect(page.locator('.email-error')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test('AC-5: with the committed empty config, a valid submit makes no request', async ({ page }) => {
  const requests = await mockMailerLite(page);
  await page.goto('/');
  await reachEmail(page);
  const all = [];
  page.on('request', (request) => all.push(request.url()));
  await submitEmail(page, 'ana@site.com');

  await expect(page.getByText('YOUR DIAGNOSTIC', { exact: true })).toBeVisible();
  await page.waitForTimeout(300);
  expect(requests).toEqual([]);
  expect(all).toEqual([]);
});

test('AC-8: the consent notice and privacy link sit above the note on the email screen', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);

  const consent = page.locator('.email-consent');
  await expect(consent).toHaveText(
    'By continuing, you agree to receive emails from Unflaky about your diagnostic and the ebooks. You can unsubscribe at any time. Privacy policy',
  );
  const link = consent.getByRole('link', { name: 'Privacy policy' });
  await expect(link).toHaveAttribute('href', 'privacy.html');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener');

  const consentBox = await consent.boundingBox();
  const noteBox = await page.locator('.email-note').boundingBox();
  expect(consentBox.y).toBeLessThan(noteBox.y);
});
