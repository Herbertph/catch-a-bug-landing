import { expect, test } from '@playwright/test';
import { answer, goNext, openQuiz, selectOption } from './helpers.js';

const AREAS = [
  {
    area: 'LOGIN AND SESSION',
    question:
      'Have you tested what happens when a user types the wrong password, asks to recover their account or has their session expire?',
    hint: "The happy login doesn't count, the trouble lives in the errors and the way back.",
  },
  {
    area: 'PAYMENT AND CHECKOUT',
    question:
      "Have you simulated a declined card in your checkout to see what happens to the charge and to the customer's access?",
    hint: 'A failed payment is where new SaaS most often charges wrong or gives access without payment.',
  },
  {
    area: 'SAVING AND DATA LOSS',
    question:
      'After saving something in your SaaS, have you refreshed the page, closed everything and come back to check it was still there?',
    hint: 'Data that disappears without warning is the bug customers forgive the least.',
  },
  {
    area: 'PERMISSIONS AND ACCESS',
    question:
      "Have you tried to reach another account's data, by changing the page address or by signing in as a regular user to a restricted area?",
    hint: "The most common leak isn't a hack, it's a permission nobody tested.",
  },
  {
    area: 'MAIN FLOW, END TO END',
    question:
      'Have you gone through the full journey as a new customer, sign up, first use and payment, without skipping a step?',
    hint: 'Testing screen by screen hides the bug that lives between the screens.',
  },
  {
    area: 'ERRORS AND EDGE CASES',
    question:
      'Have you submitted empty forms, double clicked the pay button or simulated the internet dropping in the middle of a submit?',
    hint: 'Your users will do all of this, the question is how your SaaS responds.',
  },
  {
    area: 'MOBILE AND BROWSERS',
    question:
      'Have you opened your SaaS on a phone and in a browser other than yours to check it works the same way?',
    hint: "Your customer doesn't use your computer, your browser or your internet connection.",
  },
];

const OPTIONS = [
  "Yes, I've really tested this",
  'I only tested the normal path, no errors',
  "I've never tested this",
];

const progressRatio = (page) =>
  page.locator('.progress').evaluate((track) => {
    const fill = track.querySelector('.progress-fill');
    return (fill.getBoundingClientRect().width / track.clientWidth) * 100;
  });

test('TC-28 (AC-16): every question shows the exact area, counter, question, hint and options', async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);

  for (let index = 0; index < AREAS.length; index += 1) {
    const entry = AREAS[index];
    await expect(page.locator('.quiz-area')).toHaveText(`AREA ${index + 1} OF 7, ${entry.area}`);
    await expect(page.locator('.quiz-count')).toHaveText(`Question ${index + 1} of 7`);
    await expect(page.locator('.quiz-question')).toHaveText(entry.question);
    await expect(page.locator('.quiz-hint')).toHaveText(entry.hint);
    await expect(page.locator('.quiz-option')).toHaveText(OPTIONS);

    if (index < AREAS.length - 1) {
      await selectOption(page, 0);
      await goNext(page);
    }
  }
});

test('TC-29 (AC-17): Continuar is disabled and does not advance without a selected option', async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);

  const next = page.locator('.quiz-next');
  await expect(next).toBeDisabled();
  await next.evaluate((button) => button.click());
  await expect(page.locator('.quiz-count')).toHaveText('Question 1 of 7');
});

test('TC-30 (AC-18): only the last selected option stays pressed and enables Continuar', async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);

  const options = page.locator('.quiz-option');
  await options.nth(1).click();
  await options.nth(2).click();

  await expect(options.nth(1)).toHaveAttribute('aria-pressed', 'false');
  await expect(options.nth(2)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.quiz-next')).toBeEnabled();
});

test('TC-31 (AC-19): Voltar is invisible on question 1 but keeps the Continuar position', async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);

  const back = page.locator('.quiz-back');
  await expect(back).toHaveCSS('visibility', 'hidden');
  const firstPosition = await page.locator('.quiz-next').boundingBox();

  await selectOption(page, 0);
  await goNext(page);

  await expect(back).toHaveCSS('visibility', 'visible');
  const secondPosition = await page.locator('.quiz-next').boundingBox();
  expect(secondPosition.x).toBeCloseTo(firstPosition.x, 0);
});

test('TC-32 (AC-20): going back keeps the previous answer selected and Continuar enabled', async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);

  await selectOption(page, 1);
  await goNext(page);
  await page.locator('.quiz-back').click();

  await expect(page.locator('.quiz-count')).toHaveText('Question 1 of 7');
  await expect(page.locator('.quiz-option').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.quiz-next')).toBeEnabled();
});

test('TC-33 (AC-21): the progress bar follows (N-1)/7 and reaches 100% on the e-mail screen', async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);

  expect(await progressRatio(page)).toBeCloseTo(0, 0);

  await selectOption(page, 0);
  await goNext(page);
  expect(await progressRatio(page)).toBeCloseTo(14.3, 0);

  for (let index = 2; index < 7; index += 1) {
    await selectOption(page, 0);
    await goNext(page);
  }
  expect(await progressRatio(page)).toBeCloseTo(85.7, 0);

  await selectOption(page, 0);
  await goNext(page);
  await expect(page.getByLabel('Your email to see the diagnostic')).toBeVisible();
  expect(await progressRatio(page)).toBeCloseTo(100, 0);
});

test('TC-34 (AC-22): question 7 reads "Ver o que falta" and leads to the e-mail screen', async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);

  for (let index = 0; index < 6; index += 1) {
    await selectOption(page, 0);
    await goNext(page);
  }

  const next = page.locator('.quiz-next');
  await expect(next).toHaveText("See what's missing");
  await selectOption(page, 0);
  await next.click();

  await expect(page.getByLabel('Your email to see the diagnostic')).toBeVisible();
  await expect(page.getByText('YOUR DIAGNOSTIC', { exact: true })).toHaveCount(0);
});

test('TC-35 (AC-23): the phone screen scrolls back to the top on every screen change', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 500 });
  await page.goto('/');
  await openQuiz(page);

  const screen = page.locator('.phone-screen');
  await screen.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  expect(await screen.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);

  await selectOption(page, 0);
  await goNext(page);

  expect(await screen.evaluate((el) => el.scrollTop)).toBe(0);
});

test('TC-36 (AC-23): the phone screen scrolls back to the top on the e-mail and result screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 400 });
  await page.goto('/');
  await openQuiz(page);

  for (let index = 0; index < 6; index += 1) {
    await selectOption(page, 0);
    await goNext(page);
  }
  await selectOption(page, 0);

  const screen = page.locator('.phone-screen');
  await screen.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  expect(await screen.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);

  await page.locator('.quiz-next').click();
  await expect(page.getByLabel('Your email to see the diagnostic')).toBeVisible();
  expect(await screen.evaluate((el) => el.scrollTop)).toBe(0);

  await screen.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  expect(await screen.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);

  await page.getByLabel('Your email to see the diagnostic').fill('ana@site.com');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.getByText('YOUR DIAGNOSTIC', { exact: true })).toBeVisible();
  expect(await screen.evaluate((el) => el.scrollTop)).toBe(0);
});
