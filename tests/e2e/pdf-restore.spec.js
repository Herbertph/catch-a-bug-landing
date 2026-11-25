import { existsSync, readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { answerAll, fillEmail, openQuiz, reachEmail, reachResult } from './helpers.js';

const FORBIDDEN = [
  'Quero o curso',
  'R$ 9,90',
  'Kiwify',
  'Paddle',
  'garantia',
  'Política de privacidade',
  'PRÓXIMO PASSO',
  'mailerlite',
  'waitlist',
  'wait list',
  'notify me',
  'join the list',
  'reserve your spot',
  'early access',
];

// Rendered text plus every attribute value of the page, lowercased.
const pageContent = (page) =>
  page.evaluate(() => {
    const attributes = [...document.querySelectorAll('*')].flatMap((el) =>
      [...el.attributes].map((attribute) => attribute.value),
    );
    return [document.body.innerText, ...attributes].join('\n').toLowerCase();
  });

const expectNoForbidden = async (page, where) => {
  const content = await pageContent(page);
  for (const term of FORBIDDEN) expect(content, `${term} on ${where}`).not.toContain(term.toLowerCase());
};

test('TC-101 (AC-1): the build emits index.html and no pt-BR privacy page', () => {
  expect(existsSync('dist/index.html')).toBe(true);
  expect(readdirSync('dist')).not.toContain('privacidade.html');
});

test('TC-102 (AC-2): no offer, price, checkout, privacy or MailerLite text on the page or any quiz screen', async ({ page }) => {
  await page.goto('/');
  await expectNoForbidden(page, 'page');

  await openQuiz(page);
  for (let question = 1; question <= 7; question += 1) {
    await expectNoForbidden(page, `question ${question}`);
    await answerAll(page, [2]);
  }
  await expectNoForbidden(page, 'e-mail screen');

  await fillEmail(page, 'ana@site.com');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.getByText('YOUR DIAGNOSTIC', { exact: true })).toBeVisible();
  await expectNoForbidden(page, 'result screen');
});

test('TC-103 (AC-3): FAQ item 3 has the PDF question and answer', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'When do the ebooks launch and how much will they cost?' });
  await trigger.click();
  await expect(page.locator('#faq-3')).toHaveText(
    'The ebooks are in production and will launch when the series is complete, with date and price published here. Meanwhile, the diagnostic already shows which areas of your SaaS need attention first.',
    { useInnerText: true },
  );
});

test('TC-104 (AC-4, lead-capture AC-11): the footer has the PDF texts and only the three legal links', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.locator('p').first()).toHaveText('UNFLAKY, Quality Lab, Herbert Parasio');
  await expect(footer.locator('p').nth(1)).toHaveText(
    'Ebook series in production. Content based on real QA experience, with no financial results promised or invented.',
    { useInnerText: true },
  );
  await expect(footer.locator('a')).toHaveText(['Terms of service', 'Refund policy', 'Privacy policy']);
});

test('TC-105 (AC-5, lead-capture AC-8): below the form there are only the consent notice and the note', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);
  const form = page.locator('.phone-screen form');
  const after = await form.evaluate((el) => {
    const texts = [];
    for (let node = el.nextElementSibling; node; node = node.nextElementSibling) texts.push(node.textContent.trim());
    return texts;
  });
  expect(after).toEqual([
    'By continuing, you agree to receive emails from Unflaky about your diagnostic and the ebooks. You can unsubscribe at any time. Privacy policy',
    'Your result appears on screen as soon as you confirm.',
  ]);
  await expect(page.locator('.phone-screen a')).toHaveCount(1);
});

test('TC-106 (AC-6, lead-capture AC-5): with the committed empty config, a valid e-mail makes no network request and shows the result at once', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);
  await fillEmail(page, 'ana@site.com');

  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.getByText('YOUR DIAGNOSTIC', { exact: true })).toBeVisible({ timeout: 1000 });

  expect(requests).toEqual([]);
});

test('TC-107 (AC-7): the only gold button on the result is "See the ebooks", redo is ghost', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, Array(7).fill(2));

  const gold = page.locator('.phone-screen .btn-gold');
  await expect(gold).toHaveCount(1);
  await expect(gold).toHaveText('See the ebooks');
  await expect(page.getByRole('button', { name: 'Retake the diagnostic' })).toHaveClass(/btn-ghost/);
  await expect(page.locator('#oferta')).toHaveCount(0);
});

test('TC-108 (AC-8): #ebooks ends with the 3 footer items and no price or purchase link', async ({ page }) => {
  await page.goto('/');
  const ebooks = page.locator('#ebooks');
  await expect(ebooks.locator('.ebook-foot li')).toHaveText([
    '7 ebooks, one for each test',
    'In every ebook, the ready-made prompt and the manual check',
    'Made for people who build with AI, no QA background needed',
  ]);
  const last = await ebooks.locator('.wrap').evaluate((el) => el.lastElementChild.className);
  expect(last).toBe('ebook-foot');
  await expect(ebooks.locator('a, .course-price, .course-offer, .ebook-price')).toHaveCount(0);
});
