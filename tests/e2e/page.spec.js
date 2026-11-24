import { expect, test } from '@playwright/test';

const ROOT_VARS = {
  '--bg': '#0c0d0f',
  '--bg2': '#121316',
  '--panel': '#17181c',
  '--panel2': '#1d1e23',
  '--line': '#2a2b31',
  '--line2': '#35363e',
  '--text': '#f2efe6',
  '--muted': '#a8a49a',
  '--muted2': '#7d7a72',
  '--gold': '#c9a227',
  '--gold2': '#e8c85a',
  '--gold-dim': 'rgba(201, 162, 39, .14)',
  '--green': '#3ecf7a',
  '--red': '#ff6b5e',
  '--radius': '14px',
};

const columns = (page, selector) =>
  page.locator(selector).evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);

test('TC-1 (AC-1): language, title, favicon and viewport meta', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle("Don't Break in Public, the ebook series for AI-built SaaS");

  const icon = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(icon).toMatch(/^data:/);

  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).toContain('viewport-fit=cover');
});

test('TC-2 (AC-2): sections are in the source order', async ({ page }) => {
  await page.goto('/');

  const order = await page
    .locator('main > [data-section]')
    .evaluateAll((sections) => sections.map((section) => section.getAttribute('data-section')));

  expect(order).toEqual([
    'hero',
    'proof',
    'diagnostic',
    'problem',
    'format',
    'ebooks',
    'audience',
    'instructor',
    'faq',
    'final-cta',
  ]);

  await expect(page.locator('.site-header')).toBeVisible();
  await expect(page.locator('.site-footer')).toBeVisible();
});

test('TC-3 (AC-2): hero, conference card and proof strip copy is exact', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.hero .pill')).toHaveText("Don't Break in Public, 7 short ebooks");
  await expect(page.locator('.hero h1')).toHaveText('Without these tests, your SaaS can break in production');
  await expect(page.locator('.hero-lead').nth(0)).toHaveText(
    "You built fast with AI, and that's great. The problem is that the agent hands over the code and says it's done, but nobody checked that it actually works. These ebooks show the 7 tests that separate a calm launch from a launch spent putting out fires.",
  );
  await expect(page.locator('.hero-lead').nth(1)).toHaveText(
    'Short, direct ebooks for people who build with an agent, Cursor, Claude, Copilot or any LLM, and want to validate their own product without becoming a QA expert.',
  );

  await expect(page.locator('.cta-box-title')).toHaveText('Find out where your SaaS can break');
  await expect(page.locator('.cta-box-text')).toHaveText(
    'Answer 7 questions, one for each test in the ebooks, and see your score from 0 to 14, your uncovered areas and the ebooks to read first for your case.',
  );
  await expect(page.locator('.cta-note')).toHaveText(
    'It takes about 1 minute. Your result appears on screen, with the status of each area.',
  );

  const card = page.locator('.conf-card');
  await expect(card).toHaveAttribute('aria-label', 'Example of a pre-launch test check');
  await expect(page.locator('.conf-label')).toHaveText('PRE-LAUNCH CHECK');
  await expect(page.locator('.conf-badge')).toHaveText('STRAIGHT FROM THE EBOOKS');

  await expect(page.locator('.conf-row .conf-text strong')).toHaveText([
    'Login and session',
    'Payment and checkout',
    'Saving data',
    'Access permissions',
    'Main flow, end to end',
  ]);
  await expect(page.locator('.conf-row .conf-text')).toHaveText([
    'Login and sessionUsers sign in, sign out and come back without losing access',
    'Payment and checkoutA declined card still charges the customer, a classic new SaaS bug',
    'Saving dataWhat the user saves is still there after a page refresh',
    "Access permissionsOne customer can see another customer's data",
    'Main flow, end to endSign up, use and payment, in the order the customer does them',
  ]);
  await expect(page.locator('.conf-foot')).toHaveText(
    '2 failures found before launch COST: $0 in lost customers',
  );

  await expect(page.locator('.proof-num')).toHaveText(['10+ years', '3 days → 24h', '98%', 'CTFL 2026']);
  await expect(page.locator('.proof-text')).toHaveText([
    'in IT, from development to software quality',
    'was the cut in bug triage time, with a standardized process and bug reports',
    'on-time deliveries over the last 6 months, verifying software that cannot ship with errors',
    'international software testing certification, ISTQB',
  ]);
});

test('TC-4 (AC-2): section headings, leads and instructor card copy are exact', async ({ page }) => {
  await page.goto('/');

  const diagnostic = page.locator('[data-section="diagnostic"]');
  await expect(diagnostic.locator('.eyebrow')).toHaveText('Quick diagnostic');
  await expect(diagnostic.locator('h2')).toHaveText('Find out, in 1 minute, where your SaaS can break');
  await expect(diagnostic.locator('.section-lead')).toHaveText(
    '7 questions, one for each test in the ebooks. At the end, you leave your email and see on screen your score, your uncovered areas and which ebooks tackle exactly your risk.',
  );
  await expect(diagnostic.locator('.diag-copy h3')).toHaveText('Is your SaaS ready for its first real customer?');
  await expect(diagnostic.locator('.diag-copy p')).toHaveText(
    'The diagnostic opens right here, in a small phone-shaped window. You answer the 7 questions, leave your email and see the full result without leaving this page.',
  );

  const problem = page.locator('[data-section="problem"]');
  await expect(problem.locator('h2')).toHaveText('Vibe coding sped up building. Checking fell behind.');
  await expect(problem.locator('.tag')).toHaveText(['WITHOUT TESTING', 'WITH THE 7 TESTS']);
  await expect(problem.locator('.card h3')).toHaveText(['Your customer finds the bug', 'You find the bug, first']);

  const format = page.locator('[data-section="format"]');
  await expect(format.locator('h2')).toHaveText('Not QA theory. A working playbook.');
  await expect(format.locator('.step-num')).toHaveText(['STEP 1', 'STEP 2', 'STEP 3', 'STEP 4']);
  await expect(format.locator('.card h3')).toHaveText([
    "Where you're working",
    'Why test it',
    'The ready-made prompt',
    'The manual check',
  ]);

  const ebooks = page.locator('[data-section="ebooks"]');
  await expect(ebooks.locator('h2')).toHaveText('7 ebooks, one for each test');
  await expect(ebooks.locator('.ebook-foot')).toHaveText(
    '7 ebooks, one for each test In every ebook, the ready-made prompt and the manual check Made for people who build with AI, no QA background needed',
  );

  const audience = page.locator('[data-section="audience"]');
  await expect(audience.locator('h2')).toHaveText('Made for founders who build, not for people studying QA');
  await expect(audience.locator('.card h3')).toHaveText(['These ebooks are for you if', "They're not for you if"]);

  const instructor = page.locator('[data-section="instructor"]');
  await expect(instructor.locator('h2')).toHaveText('Real authority, no made-up numbers');
  await expect(instructor.locator('.instructor-name')).toHaveText('Herbert Parasio');
  await expect(instructor.locator('.instructor-role')).toHaveText('SQA Team Lead, BMM Test Labs, Canada');
  await expect(instructor.locator('.instructor-list li')).toHaveCount(5);
  await expect(instructor.locator('blockquote')).toHaveText(
    "I won't make up numbers to look like an authority. What I have is the work, and that's what's in these ebooks.",
  );

  const faq = page.locator('[data-section="faq"]');
  await expect(faq.locator('h2')).toHaveText('Your questions, answered');

  const finalCta = page.locator('[data-section="final-cta"]');
  await expect(finalCta.locator('h2')).toHaveText("Your next launch doesn't have to be a bet");
  await expect(finalCta.locator('p:not(.eyebrow)')).toHaveText(
    'Take the diagnostic, 7 questions in about 1 minute, and see your score, your uncovered areas and the ebooks that tackle exactly your risk. Better you find the bug now than your first customer finds it for you.',
  );

  await expect(page.locator('.footer-inner p')).toHaveText([
    'UNFLAKY, Quality Lab, Herbert Parasio',
    'Ebook series in production. Content based on real QA experience, with no financial results promised or invented.',
  ]);
});

test('TC-5 (AC-2): card, step, audience, instructor and FAQ copy is exact', async ({ page }) => {
  await page.goto('/');

  const problem = page.locator('[data-section="problem"]');
  await expect(problem.locator('.eyebrow')).toHaveText('The problem');
  await expect(problem.locator('.section-lead')).toHaveText(
    'Today any founder can put a SaaS together in weeks. But speed without testing creates a new kind of bug, the bug nobody saw because nobody looked.',
  );
  await expect(problem.locator('.card > p:not(.tag)')).toHaveText([
    "The agent says it's done, you publish, and the first real payment fails, the first customer loses the data they saved, or worse, sees another customer's data. The fix comes after the damage, in a hurry, with the customer already doubting the product.",
    'You run a short, methodical check on the areas that really break a SaaS. Every failure shows up on your screen, in a test environment, with time to ask the agent for a fix and check again. Launching becomes a decision, not a bet.',
  ]);

  const format = page.locator('[data-section="format"]');
  await expect(format.locator('.eyebrow')).toHaveText('How each ebook works');
  await expect(format.locator('.section-lead')).toHaveText(
    'Each of the 7 ebooks follows the same format, so you can apply it to your product the same day, even without writing code by hand.',
  );
  await expect(format.locator('.card-step > p:not(.step-num)')).toHaveText([
    'Which area of your SaaS the test covers, payment, login, data, permissions, and where the risk lives in it.',
    'What breaks if this area fails, in founder terms, a lost sale, lost data, a lost customer.',
    'A complete prompt to paste into your agent and ask it to implement or fix the test, without you needing to know how to code it.',
    "A short step by step, on screen, so you can confirm yourself that it worked. Because the agent says it did it, but you're the one who validates it.",
  ]);

  const ebooks = page.locator('[data-section="ebooks"]');
  await expect(ebooks.locator('.eyebrow')).toHaveText('The ebooks');
  await expect(ebooks.locator('.section-lead')).toHaveText(
    'Tap an ebook to see what it covers. Short, no fluff, and each one ends with the check done on your own product.',
  );

  const audience = page.locator('[data-section="audience"]');
  await expect(audience.locator('.eyebrow')).toHaveText("Who it's for");
  await expect(audience.locator('.card-yes .check-list li')).toHaveText([
    "You're building a SaaS with AI, vibe coding or a coding agent",
    "You're going to launch, or already have, with nobody testing but you",
    'Your biggest fear is breaking in production in front of your first customers',
    'You want a short checking method to repeat on every launch',
  ]);
  await expect(audience.locator('.card-no .check-list li')).toHaveText([
    'You want a complete QA education or certification prep',
    "You're looking for advanced test automation and code frameworks",
    'Your product already has a dedicated quality team',
    "You want a promise of financial results, there's none here",
  ]);

  const instructor = page.locator('[data-section="instructor"]');
  await expect(instructor.locator('.eyebrow')).toHaveText('Who wrote it');
  await expect(instructor.locator('.section-lead')).toHaveText(
    "You'll see products out there sold with revenue screenshots and promises of results. Here the credibility is different, it's real work, verifiable, done every day.",
  );
  await expect(instructor.locator('.instructor-list li')).toHaveText([
    'QA Team Lead at a testing lab in Canada, on software that cannot ship with errors',
    '95% pass rate on the first verification of the products tested over the last 6 months',
    'Cut a bug triage from 3 days to under 24 hours',
    'CTFL certified, ISTQB, 2026',
    'More than 10 years in IT, from full stack developer to QA lead',
  ]);
  await expect(instructor.locator('.instructor-text p')).toHaveText([
    "I work testing software that cannot ship with errors. At the lab where I lead QA, every product goes through a rigorous verification before any release, and every problem found goes back to the people who built it to fix, with the process running until it's right.",
    "That's the eye missing from SaaS built with AI. It's not a lack of code, the agent ships code all day long. It's a lack of someone checking what matters, in the right order, before the customer does. That method, simplified for people who aren't in QA, is exactly what became these 7 ebooks.",
    "None of this is textbook theory. It's the same prioritizing and checking mindset I use at work, translated for people who build alone, with an agent, and need to launch without fear.",
  ]);

  await expect(page.locator('[data-section="faq"] .eyebrow')).toHaveText('FAQ');
  await expect(page.locator('.final-cta .eyebrow')).toHaveText('Quick diagnostic');
});

test('TC-6 (AC-3): no em dash or en dash in the rendered page, attributes or quiz screens', async ({ page }) => {
  await page.goto('/');
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  expect(html).not.toMatch(/[\u2013\u2014]/);

  await page.locator('button[data-open-quiz]:visible').first().click();
  for (let i = 0; i < 7; i += 1) {
    const quizText = await page.locator('.quiz').innerText();
    expect(quizText).not.toMatch(/[\u2013\u2014]/);
    await page.locator('.quiz-option').first().click();
    await page.locator('.quiz-next').click();
  }
  await page.getByLabel('Your email to see the diagnostic').fill('ana@site.com');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.getByText('YOUR DIAGNOSTIC')).toBeVisible();
  const resultHtml = await page.evaluate(() => document.documentElement.outerHTML);
  expect(resultHtml).not.toMatch(/[\u2013\u2014]/);
});

test('TC-7 (AC-4): no waitlist wording, no e-mail field and no form outside the quiz modal', async ({ page }) => {
  await page.goto('/');
  const body = await page.locator('body').innerText();
  for (const wording of ['waitlist', 'wait list', 'notify me', 'join the list', 'reserve your spot', 'early access']) {
    expect(body.toLowerCase()).not.toContain(wording);
  }

  const outsideForms = await page.evaluate(
    () => document.querySelectorAll('main form, footer form, header form, main input[type="email"], footer input[type="email"]').length,
  );
  expect(outsideForms).toBe(0);
});

test('TC-8 (AC-5): the 15 source variables and both Google Fonts are loaded', async ({ page }) => {
  await page.goto('/');

  const values = await page.evaluate(
    (names) => {
      const style = getComputedStyle(document.documentElement);
      return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
    },
    Object.keys(ROOT_VARS),
  );
  expect(values).toEqual(ROOT_VARS);

  const fontLink = await page.locator('link[href*="fonts.googleapis.com/css2"]').getAttribute('href');
  expect(fontLink).toContain('Archivo');
  expect(fontLink).toContain('IBM+Plex+Mono');

  await expect(page.locator('link[rel="preconnect"][href="https://fonts.googleapis.com"]')).toHaveCount(1);
  await expect(page.locator('link[rel="preconnect"][href="https://fonts.gstatic.com"]')).toHaveCount(1);
});

test('TC-9 (AC-6): the shield SVG sits complete inside the header logo box', async ({ page }) => {
  await page.goto('/');

  const logo = page.locator('.logo');
  await expect(logo).toHaveAttribute('href', '#top');
  await expect(logo).toHaveAttribute('aria-label', 'Unflaky, Quality Lab');
  await expect(page.locator('.logo-name')).toHaveText('UNFLAKY');
  await expect(page.locator('.logo-sub')).toHaveText('QUALITY LAB');

  const box = await page.locator('.logo-box').boundingBox();
  const shield = await page.locator('.logo-shield').boundingBox();
  expect(box.width).toBeCloseTo(48, 0);
  expect(box.height).toBeCloseTo(48, 0);
  expect(shield.width).toBeCloseTo(32, 0);
  expect(shield.height).toBeCloseTo(32, 0);
  expect(shield.x).toBeGreaterThanOrEqual(box.x);
  expect(shield.y).toBeGreaterThanOrEqual(box.y);
  expect(shield.x + shield.width).toBeLessThanOrEqual(box.x + box.width);
  expect(shield.y + shield.height).toBeLessThanOrEqual(box.y + box.height);
});

test('TC-11 (AC-7): no console errors and no failed requests except optional Google Fonts', async ({ page }) => {
  const errors = [];
  const failed = [];

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => {
    if (!/fonts\.(googleapis|gstatic)\.com/.test(request.url())) failed.push(request.url());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const relevant = errors.filter(
    (text) => !/fonts\.(googleapis|gstatic)\.com|ERR_(NAME|CONNECTION|INTERNET|CERT|BLOCKED)/.test(text),
  );
  expect(relevant).toEqual([]);
  expect(failed).toEqual([]);
});

test('TC-55 (AC-37): no horizontal overflow and the layout breaks at 900px and 620px', async ({ page }) => {
  await page.goto('/');

  for (const width of [320, 390, 620, 621, 900, 901, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
  }

  await page.setViewportSize({ width: 901, height: 800 });
  expect(await columns(page, '.hero-grid')).toBe(2);
  expect(await columns(page, '.proof-grid')).toBe(4);
  expect(await columns(page, '[data-section="format"] .grid-4')).toBe(4);
  expect(await columns(page, '.instructor')).toBe(2);

  await page.setViewportSize({ width: 900, height: 800 });
  expect(await columns(page, '.hero-grid')).toBe(1);
  expect(await columns(page, '.proof-grid')).toBe(2);
  expect(await columns(page, '[data-section="format"] .grid-4')).toBe(2);
  expect(await columns(page, '.instructor')).toBe(1);
  expect(await columns(page, '[data-section="problem"] .grid-2')).toBe(2);

  await page.setViewportSize({ width: 621, height: 800 });
  expect(await columns(page, '[data-section="problem"] .grid-2')).toBe(2);
  expect(await columns(page, '[data-section="audience"] .grid-2')).toBe(2);

  await page.setViewportSize({ width: 620, height: 800 });
  expect(await columns(page, '[data-section="problem"] .grid-2')).toBe(1);
  expect(await columns(page, '[data-section="audience"] .grid-2')).toBe(1);
  expect(await columns(page, '[data-section="format"] .grid-4')).toBe(1);
});

test('TC-56 (AC-38): reduced motion turns smooth scrolling and the plus rotation off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const scrollBehavior = await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior);
  expect(scrollBehavior).toBe('auto');

  const plusTransition = await page.locator('.acc-plus').first().evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(plusTransition).toBe('0s');
});

test('TC-60 (AC-40): radii come from the token scale', async ({ page }) => {
  await page.goto('/');

  const radii = await page.evaluate(() => ({
    button: getComputedStyle(document.querySelector('.btn')).borderRadius,
    card: getComputedStyle(document.querySelector('.card')).borderRadius,
    logo: getComputedStyle(document.querySelector('.logo-box')).borderRadius,
  }));
  expect(radii).toEqual({ button: '8px', card: '16px', logo: '8px' });

  await page.locator('button[data-open-quiz]:visible').first().click();
  const phone = await page.locator('.phone-frame').evaluate((el) => getComputedStyle(el).borderRadius);
  expect(phone).toBe('40px');
});

test('TC-61 (AC-41): computed padding, margin and gap values belong to the spacing scale', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[data-open-quiz]:visible').first().click();
  for (let i = 0; i < 7; i += 1) {
    await page.locator('.quiz-option').first().click();
    await page.locator('.quiz-next').click();
  }
  await page.getByLabel('Your email to see the diagnostic').fill('ana@site.com');
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
  await expect(page.getByText('YOUR DIAGNOSTIC')).toBeVisible();

  const samples = await page.evaluate(() => {
    const selectors = [
      '.site-header .wrap',
      '.header-inner',
      '.logo',
      '.hero',
      '.hero h1',
      '.pill',
      '.cta-box',
      '.cta-box-title',
      '.conf-card',
      '.conf-head',
      '.conf-row',
      '.conf-foot',
      '.proof-item',
      '.section',
      '.section-head',
      '.diag-box',
      '.diag-copy h3',
      '.grid-2',
      '.card',
      '.card h3',
      '.tag',
      '.acc-trigger',
      '.acc-panel',
      '.instructor',
      '.instructor-card',
      '.check-list li',
      '.final-cta',
      '.footer-inner',
      '.phone-frame',
      '.quiz',
      '.quiz-top',
      '.quiz-question',
      '.quiz-hint',
      '.quiz-options',
      '.quiz-option',
      '.quiz-nav',
      '.progress',
      '.email-panel',
      '.email-row',
      '.result-head',
      '.result-areas',
      '.result-area',
      '.result-priority',
      '.result-actions',
      '.result-note',
    ];
    const properties = [
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'marginTop',
      'marginBottom',
      'gap',
      'rowGap',
      'columnGap',
    ];
    const out = [];
    for (const selector of selectors) {
      for (const node of document.querySelectorAll(selector)) {
        const style = getComputedStyle(node);
        for (const property of properties) {
          out.push({ selector, property, value: style[property] });
        }
      }
    }
    return out;
  });

  const allowed = new Set([0, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 96]);
  const offenders = samples.filter(({ value }) => {
    if (!value.endsWith('px')) return false;
    return !allowed.has(Number.parseFloat(value));
  });
  expect(offenders).toEqual([]);
});

test('TC-62 (AC-42): every font size comes from the type scale', async ({ page }) => {
  await page.goto('/');

  const sizes = await page.evaluate(() => {
    const out = [];
    for (const node of document.querySelectorAll('*')) {
      const size = getComputedStyle(node).fontSize;
      if (size.endsWith('px')) out.push({ tag: node.tagName, className: node.className, size });
    }
    return out;
  });

  const allowed = new Set([12, 14, 16, 18, 20, 24, 30, 36, 48, 60]);
  const offenders = sizes.filter(({ size }) => !allowed.has(Number.parseFloat(size)));
  expect(offenders).toEqual([]);
});
