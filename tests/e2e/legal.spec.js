import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { answerAll, fillEmail, openQuiz, reachResult } from './helpers.js';

const EMAIL = 'herbert.parasio@gmail.com';

// The legal copy is read from its source of truth, so the pages are checked letter by letter against it.
const source = readFileSync('docs/reference/legal-copy-en.md', 'utf8');

const legalSection = (heading) => {
  const start = source.indexOf(`## ${heading}`);
  const end = source.indexOf('\n## ', start + 1);
  const text = source.slice(start, end === -1 ? undefined : end).replace(/\s+/g, ' ');
  const one = (label) => text.match(new RegExp(`${label}:? \`([^\`]+)\``))[1];
  return {
    title: one('Tab title'),
    h1: one('H1'),
    intro: one('Intro'),
    h2s: [...text.matchAll(/- H2 `([^`]+)`/g)].map((match) => match[1]),
    paragraphs: [...text.matchAll(/- `([^`]+)`/g)].map((match) => match[1].replaceAll('{EMAIL}', EMAIL)),
  };
};

const PAGES = [
  ['privacy.html', legalSection('LEGAL-§4')],
  ['terms.html', legalSection('LEGAL-§5')],
  ['refund.html', legalSection('LEGAL-§6')],
];

const FOOTER_LINKS = [
  ['Terms of service', 'terms.html', "Terms of service, Don't Break in Public"],
  ['Refund policy', 'refund.html', "Refund policy, Don't Break in Public"],
  ['Privacy policy', 'privacy.html', "Privacy policy, Don't Break in Public"],
];

const ALL_PAGES = ['/', ...PAGES.map(([file]) => `/${file}`)];

test('AC-9: dist has the four pages and the background image, and each loads cleanly', async ({ page }) => {
  for (const file of ['index.html', 'privacy.html', 'terms.html', 'refund.html', 'bg-cave.webp']) {
    expect(existsSync(`dist/${file}`), file).toBe(true);
  }

  for (const path of ALL_PAGES) {
    const errors = [];
    const failed = [];
    const onConsole = (message) => {
      if (message.type() === 'error' && !/fonts\.(googleapis|gstatic)\.com/.test(message.text())) errors.push(message.text());
    };
    const onFailed = (request) => {
      if (!/fonts\.(googleapis|gstatic)\.com/.test(request.url())) failed.push(request.url());
    };
    page.on('console', onConsole);
    page.on('requestfailed', onFailed);
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    page.off('console', onConsole);
    page.off('requestfailed', onFailed);
    expect(errors, path).toEqual([]);
    expect(failed, path).toEqual([]);
  }
});

for (const [file, copy] of PAGES) {
  test(`AC-10: ${file} has the exact LEGAL copy, mailto links and links back to the landing page`, async ({ page }) => {
    await page.goto(`/${file}`);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(copy.title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(copy.h1);
    await expect(page.locator('.legal-updated')).toHaveText('Last updated: November 24, 2026');
    await expect(page.locator('.legal-intro')).toHaveText(copy.intro);
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(copy.h2s);
    await expect(page.locator('.legal-section p')).toHaveText(copy.paragraphs);

    const mailto = page.locator(`a[href="mailto:${EMAIL}"]`);
    const mentions = copy.paragraphs.join(' ').split(EMAIL).length - 1;
    await expect(mailto).toHaveCount(mentions);
    if (mentions) await expect(mailto.first()).toHaveText(EMAIL);

    await expect(page.getByRole('link', { name: 'Unflaky, Quality Lab' })).toHaveAttribute('href', 'index.html');
    await page.getByRole('link', { name: "Back to Don't Break in Public" }).click();
    await expect(page).toHaveURL(/\/(index\.html)?$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Without these tests, your SaaS can break in production',
    );
  });
}

for (const path of ALL_PAGES) {
  test(`AC-11: the footer of ${path} links to the three legal pages`, async ({ page }) => {
    for (const [name, href, title] of FOOTER_LINKS) {
      await page.goto(path);
      const link = page.locator('.site-footer').getByRole('link', { name, exact: true });
      await expect(link).toHaveAttribute('href', href);
      await link.click();
      await expect(page).toHaveTitle(title);
    }
  });
}

const content = (page) =>
  page.evaluate(() => {
    const attributes = [...document.querySelectorAll('*')].flatMap((el) => [...el.attributes].map((a) => a.value));
    return [document.body.innerText, document.title, ...attributes].join('\n');
  });

const expectClean = async (page, where) => {
  const text = await content(page);
  expect(text, where).not.toMatch(/[–—’]/);
  expect(text.toLowerCase(), where).not.toMatch(/waitlist|wait list|notify me|join the list|reserve your spot|early access/);
  const dollars = text.replace(/COST: \$0 in lost customers/g, '');
  expect(dollars, where).not.toContain('$');
};

test('AC-12: no dashes, curly apostrophes, waitlist wording or prices on any page or quiz screen', async ({ page }) => {
  for (const path of ALL_PAGES) {
    await page.goto(path);
    await expectClean(page, path);
  }

  await page.goto('/');
  expect(await content(page)).not.toContain(EMAIL);
  await openQuiz(page);
  for (let question = 1; question <= 7; question += 1) {
    await expectClean(page, `question ${question}`);
    await answerAll(page, [1]);
  }
  await expectClean(page, 'email screen');
  await fillEmail(page, 'ana@');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expectClean(page, 'email error');

  await page.goto('/');
  await reachResult(page, [0, 1, 2, 0, 1, 2, 0]);
  await expectClean(page, 'result');
  expect(await content(page)).not.toContain(EMAIL);
});
