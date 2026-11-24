import { expect, test } from '@playwright/test';
import { answerAll, fillEmail, openQuiz, reachEmail, reachResult } from './helpers.js';

// Whole-word terms, so the tool name "Cursor" does not count as "curso".
const FORBIDDEN_WORDS = ['aula', 'curso', 'você', 'waitlist', 'lesson', 'course'];
const FORBIDDEN_TEXT = ['—', '–', '’', 'Fazer o diagnóstico', 'diagnóstico', 'notify me', 'reserve your spot', 'early access'];

const pageContent = (page) =>
  page.evaluate(() => {
    const attributes = [...document.querySelectorAll('*')].flatMap((el) =>
      [...el.attributes].map((attribute) => attribute.value),
    );
    return [document.body.innerText, document.title, ...attributes].join('\n');
  });

const expectEnglishOnly = async (page, where) => {
  const content = await pageContent(page);
  for (const text of FORBIDDEN_TEXT) expect(content, `${text} on ${where}`).not.toContain(text);
  for (const word of FORBIDDEN_WORDS) {
    expect(content, `${word} on ${where}`).not.toMatch(new RegExp(`(^|[^\\p{L}])${word}([^\\p{L}]|$)`, 'iu'));
  }
};

test('TC-203 (AC-3): no dashes, curly apostrophes, pt-BR words or waitlist wording on the page or any quiz screen', async ({ page }) => {
  await page.goto('/');
  await expectEnglishOnly(page, 'page');

  await openQuiz(page);
  for (let question = 1; question <= 7; question += 1) {
    await expectEnglishOnly(page, `question ${question}`);
    await answerAll(page, [2]);
  }
  await expectEnglishOnly(page, 'email screen');
  await fillEmail(page, 'ana@');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expectEnglishOnly(page, 'email error');

  for (const answers of [Array(7).fill(2), [0, 0, 0, 1, 2, 2, 2], Array(7).fill(0)]) {
    await page.goto('/');
    await reachResult(page, answers);
    await expectEnglishOnly(page, `result ${answers.join('')}`);
  }
});

test('TC-204 (AC-4): every "Take the diagnostic" button opens the quiz on question 1 in English', async ({ page }) => {
  await page.goto('/');
  const buttons = page.locator('button[data-open-quiz]');
  await expect(buttons).toHaveText(Array(5).fill('Take the diagnostic'));

  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const count = await buttons.count();
    for (let index = 0; index < count; index += 1) {
      const button = buttons.nth(index);
      if (!(await button.isVisible())) continue;
      await button.click();
      await expect(page.getByRole('dialog', { name: 'Quick diagnostic, 7 questions' })).toBeVisible();
      await expect(page.locator('.quiz-area')).toHaveText('AREA 1 OF 7, LOGIN AND SESSION');
      await expect(page.locator('.quiz-count')).toHaveText('Question 1 of 7');
      await page.getByRole('button', { name: 'Close the diagnostic' }).click();
      await expect(page.locator('#quiz-modal')).toBeHidden();
    }
  }
});

test("TC-205 (AC-5): question 7 reads \"See what's missing\" and leads to the email screen", async ({ page }) => {
  await page.goto('/');
  await openQuiz(page);
  await answerAll(page, Array(6).fill(0));
  await page.locator('.quiz-option').first().click();
  await expect(page.locator('.quiz-next')).toHaveText("See what's missing");
  await page.locator('.quiz-next').click();
  await expect(page.getByLabel('Your email to see the diagnostic')).toBeVisible();
});

test('TC-206 (AC-6): an invalid email shows the EN error and a valid one shows the result with no request', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);

  await fillEmail(page, 'ana@');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.locator('.email-error')).toHaveText('Please check the email you typed, something seems to be missing.');
  await expect(page.getByLabel('Your email to see the diagnostic')).toBeFocused();

  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await fillEmail(page, 'ana@site.com');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.getByText('YOUR DIAGNOSTIC')).toBeVisible({ timeout: 1000 });
  expect(requests).toEqual([]);
});

test('TC-209 (AC-9): answers 2,1,0,2,1,0,2 give score 8 with EBOOK labels and the exact priority list', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, [0, 1, 2, 0, 1, 2, 0]);

  await expect(page.locator('.result-points')).toHaveText('8/14');
  await expect(page.locator('.result-band-title')).toHaveText('Partial base, open gaps');
  await expect(page.locator('.result-area .area-ebook')).toHaveText(
    ['01', '02', '03', '04', '05', '06', '07'].map((n) => `EBOOK ${n}`),
  );
  await expect(page.locator('.result-priority')).toContainText(
    'Ebook 02 (Payment and checkout), Ebook 03 (Saving and data loss), Ebook 05 (Main flow, end to end), Ebook 06 (Errors and edge cases).',
  );
});

test('TC-213 (AC-13): the EN anchors exist, the logo links to #top and the pt-BR anchors are gone', async ({ page }) => {
  await page.goto('/');
  for (const id of ['top', 'diagnostic', 'ebooks']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  for (const id of ['topo', 'diagnostico', 'aulas']) await expect(page.locator(`#${id}`)).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Unflaky, Quality Lab' })).toHaveAttribute('href', '#top');
});
