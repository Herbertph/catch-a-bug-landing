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

test('AC-1: the build emits index.html and no privacy page', () => {
  expect(existsSync('dist/index.html')).toBe(true);
  expect(readdirSync('dist')).not.toContain('privacidade.html');
});

test('AC-2: no offer, price, checkout, privacy or MailerLite text on the page or any quiz screen', async ({ page }) => {
  await page.goto('/');
  await expectNoForbidden(page, 'page');

  await openQuiz(page);
  for (let question = 1; question <= 7; question += 1) {
    await expectNoForbidden(page, `question ${question}`);
    await answerAll(page, [2]);
  }
  await expectNoForbidden(page, 'e-mail screen');

  await fillEmail(page, 'ana@site.com');
  await page.getByRole('button', { name: 'Ver meu diagnóstico' }).click();
  await expect(page.getByText('SEU DIAGNÓSTICO')).toBeVisible();
  await expectNoForbidden(page, 'result screen');
});

test('AC-3: FAQ item 3 has the PDF question and answer', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Quando o curso lança e quanto vai custar?' });
  await trigger.click();
  await expect(page.locator('#faq-3')).toHaveText(
    'O curso está em produção e será lançado quando estiver completo, com data e preço publicados aqui. Enquanto isso, o diagnóstico já mostra quais áreas do seu SaaS precisam de atenção primeiro.',
    { useInnerText: true },
  );
});

test('AC-4: the footer has the PDF texts and no link', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.locator('p').first()).toHaveText('UNFLAKY, Quality Lab, Herbert Parasio');
  await expect(footer.locator('p').nth(1)).toHaveText(
    'Mini curso em produção. Conteúdo baseado em experiência real de QA, sem resultados financeiros prometidos ou inventados.',
    { useInnerText: true },
  );
  await expect(footer.locator('a')).toHaveCount(0);
});

test('AC-5: the e-mail screen shows only the note below the form', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);
  const form = page.locator('.phone-screen form');
  const after = await form.evaluate((el) => {
    const texts = [];
    for (let node = el.nextElementSibling; node; node = node.nextElementSibling) texts.push(node.textContent.trim());
    return texts;
  });
  expect(after).toEqual(['Seu resultado aparece na tela assim que você confirmar.']);
  await expect(page.locator('.phone-screen a')).toHaveCount(0);
});

test('AC-6: submitting a valid e-mail makes no network request and shows the result at once', async ({ page }) => {
  await page.goto('/');
  await reachEmail(page);
  await fillEmail(page, 'ana@site.com');

  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.getByRole('button', { name: 'Ver meu diagnóstico' }).click();
  await expect(page.getByText('SEU DIAGNÓSTICO')).toBeVisible({ timeout: 1000 });

  expect(requests).toEqual([]);
});

test('AC-7: the only gold button on the result is "Ver as aulas do curso", redo is ghost', async ({ page }) => {
  await page.goto('/');
  await reachResult(page, Array(7).fill(2));

  const gold = page.locator('.phone-screen .btn-gold');
  await expect(gold).toHaveCount(1);
  await expect(gold).toHaveText('Ver as aulas do curso');
  await expect(page.getByRole('button', { name: 'Refazer o diagnóstico' })).toHaveClass(/btn-ghost/);
  await expect(page.locator('#oferta')).toHaveCount(0);
});

test('AC-8: #aulas ends with the 3 curriculum footer items and no price or purchase link', async ({ page }) => {
  await page.goto('/');
  const lessons = page.locator('#aulas');
  await expect(lessons.locator('.course-foot li')).toHaveText([
    '8 aulas, introdução mais os 7 testes',
    'Em cada aula, o prompt pronto e a conferência manual',
    'Feito para quem constrói com IA, sem base em QA',
  ]);
  const last = await lessons.locator('.wrap').evaluate((el) => el.lastElementChild.className);
  expect(last).toBe('course-foot');
  await expect(lessons.locator('a, .course-price, .course-offer')).toHaveCount(0);
});
