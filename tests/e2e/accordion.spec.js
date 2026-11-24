import { expect, test } from '@playwright/test';

const EBOOK_TITLES = [
  'Login and session',
  'Payment and checkout',
  'Saving and data loss',
  'Permissions and access',
  'Main flow, end to end',
  'Errors and edge cases',
  'Mobile, browsers and the launch',
];

const EBOOK_SUBTITLES = [
  "If users can't get in, nothing else matters",
  'The area where a bug becomes a loss on the spot',
  'Users trust that what they saved will still be there',
  'A customer must never see what belongs to another',
  "The full journey, in the customer's order",
  "Your users will do everything you didn't imagine",
  'Check where your customers really use it',
];

const EBOOK_BODIES = [
  "Login is the front door of your SaaS, and a broken door doesn't show up in your quick test, it shows up for a customer at 10 p.m. on a Sunday. You check sign up, login, logout, password recovery, expiring sessions and what happens when a user tries to sign in twice or with the wrong password.",
  'Approved payment, declined payment, renewing subscription, cancelled subscription, refund. You test the whole money path, including the card that fails, because errors are exactly where new SaaS charge wrong, give access without payment or lock out people who paid.',
  'Create, edit, delete and reload. You check that everything a user saves survives a page refresh, closing and coming back, editing twice and deleting by accident. Losing customer data is the least forgiven bug, and one of the simplest to prevent.',
  "The most common leak in a SaaS built fast isn't a hack, it's a permission nobody tested, changing a number in the URL and opening someone else's account. You learn to test user roles, admin access and isolation between accounts, the way a professional tester does.",
  'Testing screen by screen hides the bug that lives between the screens. In this ebook you walk the whole journey as a new customer, sign up, first use, payment and final result, and find where the experience breaks along the way.',
  'Empty field, giant text, double click on the pay button, internet dropping in the middle of a submit. You test how your SaaS behaves when something goes wrong, so it answers with a clear message instead of a broken screen or a double charge.',
  'Your customer opens it on a phone, in the browser they already use, with the internet connection they have. In the final ebook you check responsive layout, the main browsers and perceived speed, and build your release checklist, the checking ritual to repeat on every launch from now on.',
];

const EBOOK_TAGS = [
  ['AREA, AUTHENTICATION', 'PROMPTS INCLUDED', 'MANUAL CHECKLIST'],
  ['AREA, REVENUE', 'PROMPTS INCLUDED', 'MANUAL CHECKLIST'],
  ['AREA, DATA', 'PROMPTS INCLUDED', 'MANUAL CHECKLIST'],
  ['AREA, BASIC SECURITY', 'PROMPTS INCLUDED', 'MANUAL CHECKLIST'],
  ['AREA, CUSTOMER JOURNEY', 'PROMPTS INCLUDED', 'MANUAL CHECKLIST'],
  ['AREA, RESILIENCE', 'PROMPTS INCLUDED', 'MANUAL CHECKLIST'],
  ['AREA, FINAL EXPERIENCE', 'PROMPTS INCLUDED', 'RELEASE CHECKLIST'],
];

const FAQ_QUESTIONS = [
  'Do I need to know how to code to use the ebooks?',
  'Do they work with the tool I use?',
  'When do the ebooks launch and how much will they cost?',
  'Is the diagnostic free?',
  "I've already launched my SaaS. Does this still make sense?",
];

const FAQ_ANSWERS = [
  'No. The ebooks were designed for people who build with an agent. In each one, the ready-made prompt does the technical part with your LLM, and the manual check happens on screen, clicking and watching, without writing code.',
  "Yes. The prompts and checks don't depend on a specific tool. They work with Cursor, Claude, Copilot, ChatGPT and any other agent or LLM you already use to build your SaaS.",
  'The ebooks are in production and will launch when the series is complete, with date and price published here. Meanwhile, the diagnostic already shows which areas of your SaaS need attention first.',
  "Yes. It's 7 questions, it takes about 1 minute, and the result appears on screen with your score from 0 to 14 and the status of each area. We ask for your email before showing the result, that's all.",
  'It does, maybe even more. The 7 tests become a checking ritual for every new version, every new feature and every fix the agent delivers. A launched product breaks in an update the same way it breaks at launch.',
];

test('TC-50 (AC-11): the ebooks accordion has the 7 exact ebooks and Ebook 01 is open', async ({ page }) => {
  await page.goto('/');

  const triggers = page.locator('.ebook-accordion .acc-trigger');
  await expect(triggers).toHaveCount(7);
  await expect(page.locator('.ebook-accordion .acc-num')).toHaveText(['01', '02', '03', '04', '05', '06', '07']);
  await expect(page.locator('.ebook-accordion .acc-title')).toHaveText(EBOOK_TITLES);
  await expect(page.locator('.ebook-accordion .acc-sub')).toHaveText(EBOOK_SUBTITLES);

  await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#ebook-01')).toBeVisible();
  await expect(page.locator('#ebook-01 p')).toHaveText(EBOOK_BODIES[0]);

  for (let index = 1; index < 7; index += 1) {
    await expect(triggers.nth(index)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`#ebook-0${index + 1}`)).toBeHidden();
  }
});

test('TC-52 (AC-11): opening Ebook 04 closes Ebook 01 and clicking it again closes everything', async ({ page }) => {
  await page.goto('/');

  const triggers = page.locator('.ebook-accordion .acc-trigger');
  await triggers.nth(3).click();

  await expect(triggers.nth(3)).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#ebook-04')).toBeVisible();
  await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#ebook-01')).toBeHidden();

  await triggers.nth(3).click();
  await expect(triggers.nth(3)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#ebook-04')).toBeHidden();

  const expanded = await triggers.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-expanded')));
  expect(expanded).toEqual(Array(7).fill('false'));
});

test('TC-53 (AC-12): the FAQ has the 5 exact questions, all closed, one open at a time', async ({ page }) => {
  await page.goto('/');

  const triggers = page.locator('.faq-accordion .acc-trigger');
  await expect(triggers).toHaveCount(5);
  await expect(page.locator('.faq-accordion .acc-title')).toHaveText(FAQ_QUESTIONS);

  for (let index = 0; index < 5; index += 1) {
    await expect(triggers.nth(index)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`#faq-${index + 1}`)).toBeHidden();
  }

  await triggers.nth(0).click();
  await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-1')).toBeVisible();
  await expect(page.locator('#faq-1 p')).toHaveText(FAQ_ANSWERS[0]);

  await triggers.nth(1).click();
  await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-2')).toBeVisible();
  await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq-1')).toBeHidden();

  await triggers.nth(1).click();
  await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq-2')).toBeHidden();
});

test('TC-51 (AC-2): every ebook body and tag is exact, and the first tag is the gold one', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.ebook-accordion .acc-panel p')).toHaveText(EBOOK_BODIES);
  for (let index = 0; index < EBOOK_TAGS.length; index += 1) {
    const tags = page.locator(`#ebook-0${index + 1} .tag`);
    await expect(tags).toHaveText(EBOOK_TAGS[index]);
    await expect(tags.first()).toHaveClass(/tag-gold/);
    await expect(page.locator(`#ebook-0${index + 1} .tag-gold`)).toHaveCount(1);
  }
});

test('TC-54 (AC-2): every FAQ answer is exact', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.faq-accordion .acc-panel p')).toHaveText(FAQ_ANSWERS);
});
