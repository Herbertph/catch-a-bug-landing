# Spec: Lead capture in MailerLite and legal pages

- Status: ready for development
- Branch: `feature/lead-capture-and-legal`
- Builds on: `docs/specs/english-ebooks.md` (merged in PR #3), `docs/specs/landing-redesign.md` and the baseline
  spec `docs/reference/baseline-spec-curso-qa.md`. Their rules still apply, except the "no lead capture, no privacy
  page" rule, which this spec replaces (Herbert's request, 2026-11-24).
- Copy sources: `docs/reference/landing-copy-en.md` (page) and `docs/reference/legal-copy-en.md` (LEGAL-§N, new).
- Prior art: `curso-qa` shipped the same MailerLite mechanism (`src/lead.js`, `src/config.js`,
  `window.__TEST_CONFIG__`, `mockMailerLite` in `tests/e2e/helpers.js`). It was removed here in `b842923`. Its parent
  `5bef08a` holds the code to bring back. The `curso-qa` spec is
  `C:\Users\herbe\projects\curso-qa\docs\specs\lead-capture-and-offer.md` (FR-1 to FR-4, AC-1 to AC-7).

## Context

Herbert is getting the site ready to sell "Don't Break in Public" (7 ebooks) to an international audience. This is
the first of three steps:

1. **This spec:** save every diagnostic email in his MailerLite account, with the result, and publish the legal pages
   (privacy, terms, refund) that the email capture and Paddle's seller review need.
2. Next: Paddle checkout and the offer ($30 bundle). Waits for Herbert's Paddle account.
3. Next: ebook delivery after purchase.

The site is already deployed on Vercel from this repository. Herbert's own domain arrives next week. Nothing in this
spec depends on the domain.

## Scope

### In scope
- Send the lead to MailerLite on a valid email submit: email, score, band and the uncovered or partial areas.
- Consent notice with a `Privacy policy` link on the email screen.
- Three pages: `privacy.html`, `terms.html`, `refund.html`, with the copy of `legal-copy-en.md`.
- Footer links to the three pages on every page.
- Config for the MailerLite IDs. They stay empty until Herbert provides them.
- Update the `CLAUDE.md` rules and `README.md`.

### Out of scope
- Paddle, prices, the offer, the "$70 to $30" display, FAQ 3 and footer "in production" text (next spec).
- Ebook delivery and MailerLite automations (Herbert configures them in MailerLite).
- Analytics, tracking pixels, a cookie banner. None are needed: the site sets no cookies.
- The custom domain and Vercel settings.

## Functional requirements

- **FR-1 Config.** `src/config.js` exports `MAILERLITE_ACCOUNT_ID` and `MAILERLITE_FORM_ID`, both empty strings in
  the repository. Tests override them through `window.__TEST_CONFIG__` (Playwright `addInitScript`), as in `curso-qa`.
  These are public IDs from MailerLite's embed code. No API key or token ever goes in the page or the repository.
- **FR-2 Lead payload.** A pure `buildLead(email, answers)` returns `email` (trimmed), `quiz_score` (0 to 14),
  `quiz_band` (EN band title), and `quiz_open_areas` (EN names of areas with fewer than 2 points, in ebook order,
  joined by `, `; empty string when none).
- **FR-3 Send.** On a valid submit, send once to MailerLite's public embedded-form subscribe endpoint, as in
  `curso-qa`: `POST https://assets.mailerlite.com/jsonp/<ACCOUNT_ID>/forms/<FORM_ID>/subscribe`, `mode: 'no-cors'`,
  form-urlencoded, with `fields[email]`, `fields[quiz_score]`, `fields[quiz_band]`, `fields[quiz_open_areas]`,
  `ml-submit=1` and `anticsrf=true`. Check the endpoint and field names against MailerLite's current embed code, and
  write them in `CLAUDE.md`. If either ID is empty, send nothing.
- **FR-4 Never block the result.** The result shows immediately. The request is fire and forget, with an 8 s timeout,
  and every failure is silent: no visible error and no console error from page code.
- **FR-5 Consent notice.** The email screen shows the LEGAL-§1 sentence and the `Privacy policy` link (new tab, so the
  quiz is not lost), above the existing note.
- **FR-6 Legal pages.** `privacy.html`, `terms.html` and `refund.html` per LEGAL-§3 to §6, built into `dist/` next to
  `index.html`. Each is self-contained or shares assets in a way that works from any static host and from Vercel at
  the site root. They reuse the design tokens and the header and footer look. Text width stays readable (about
  `--size-content`).
- **FR-7 Footer links.** Every page's footer shows `Terms of service`, `Refund policy` and `Privacy policy`
  (LEGAL-§2).
- **FR-8 Content rules.** No em or en dash and no curly apostrophe on any page. No waitlist wording. No price
  anywhere yet. The email address `herbert.parasio@gmail.com` appears only on the legal pages.
- **FR-9 Docs.** `CLAUDE.md`: replace "no lead capture ... no privacy page" with the new rules (MailerLite lead on
  submit; legal pages; still no price or checkout until the Paddle spec), and document config, endpoint, test override
  and the MailerLite setup steps for Herbert. Update `README.md`.

## Acceptance criteria

Tests intercept MailerLite with Playwright routing and **never call the real service**.

- **AC-1** Given the MailerLite IDs are set (test config) and answers 2,1,0,2,1,0,2, when I submit `ana@site.com`,
  then exactly one request goes to `https://assets.mailerlite.com/jsonp/<id>/forms/<id>/subscribe` with
  `fields[email]=ana@site.com`, `fields[quiz_score]=8`, `fields[quiz_band]=Partial base, open gaps` and
  `fields[quiz_open_areas]=Payment and checkout, Saving and data loss, Main flow, end to end, Errors and edge cases`.
- **AC-2** Given all first options, then `quiz_score` is `14`, `quiz_band` is `Almost ready, close the gaps` and
  `quiz_open_areas` is empty. Given all last options, then `quiz_score` is `0`, the band is `Launch at risk` and
  `quiz_open_areas` lists the 7 areas in ebook order.
- **AC-3** Given an invalid email is submitted, then no request is sent.
- **AC-4** Given the endpoint returns HTTP 500, is aborted, or hangs for 10 s, when I submit a valid email, then the
  result appears at once, no error is shown, and page code logs no `console.error`, uncaught exception or unhandled
  rejection. The browser's own `Failed to load resource` line is accepted.
- **AC-5** Given the committed config (empty IDs), when I submit a valid email, then no network request is made and
  the result appears.
- **AC-6** Given the source, `dist/` and the repository, then no MailerLite API key or token exists (`api_key`,
  `apiKey`, `Bearer`, `connect.mailerlite.com/api`).
- **AC-7** Unit: `buildLead` returns the trimmed email and the correct score, band and open-areas string for all-2,
  all-0 and mixed answers, and for the band boundaries 4, 5, 9 and 10.
- **AC-8** Given the email screen, then the exact LEGAL-§1 notice is visible above
  `Your result appears on screen as soon as you confirm.`, with a link named `Privacy policy` to `privacy.html` and
  `target="_blank"` with `rel="noopener"`.
- **AC-9** Given `dist/`, then it contains `index.html`, `privacy.html`, `terms.html`, `refund.html` and the
  background image, and each page loads with no console error and no failed request other than fonts.
- **AC-10** Given each legal page, then it has `lang="en"`, the exact tab title, H1, `Last updated: November 24, 2026`
  and every H2 and paragraph of its LEGAL section. `herbert.parasio@gmail.com` is a `mailto:` link. The logo and the
  `Back to Don't Break in Public` link go to the landing page.
- **AC-11** Given the landing page and the three legal pages, then each footer has the links `Terms of service`,
  `Refund policy` and `Privacy policy`, and each link opens the right page.
- **AC-12** Given all four pages and every quiz screen, then no `—`, `–` or `’` appears, no waitlist wording appears,
  no `$` price appears (the `COST: $0 in lost customers` card text is the only `$`), and the landing page does not
  contain `herbert.parasio@gmail.com`.
- **AC-13** Given widths 320, 390, 900 and 1280px, then the legal pages and the email screen with the notice have no
  horizontal scroll and pass the automated contrast check.
- **AC-14** Given the existing acceptance suites, then they still pass. The old "no network request on submit" checks
  (redesign AC-6, english-ebooks AC-6) now run with the committed empty config (AC-5 here). Update them, don't delete
  coverage.

## Assumptions to confirm (Herbert)

1. **Refund window: 14 days**, full refund, no questions asked. You did not answer this one, so I used my
   recommendation.
2. **Legal text** is a plain-language draft, not legal advice. It names Paddle as Merchant of Record, as Paddle
   requires, even before the checkout exists.
3. **Double opt-in** is switched on by you in MailerLite (form settings). The page cannot do it.
4. **Areas sent to MailerLite** are those with fewer than 2 points (partial or uncovered), the same rule as the
   priority ebooks.
5. The FAQ answer `We ask for your email before showing the result, that's all.` stays.

## What Herbert does in MailerLite (goes into the PR "How to check it yourself")

1. Create three custom fields: `quiz_score` (number), `quiz_band` (text), `quiz_open_areas` (text).
2. Create an embedded form linked to a group (for example "Diagnostic"), with those fields and double opt-in on.
3. Send the form's embed code to the analyst, who puts the account ID and form ID in `src/config.js`.

## Technical notes

- Bring back from `5bef08a`: `src/lead.js`, `src/config.js`, `buildLead` (adapt to EN), the e2e helpers `useConfig`
  and `mockMailerLite`, `tests/unit/lead.test.js` and `config.test.js`, and the lead e2e specs (EN strings). Do not
  bring back the offer, checkout or `CHECKOUT_URL`.
- Multi-page build: `curso-qa` used a two-pass build (`vite.privacy.config.js`, `emptyOutDir: false`) because
  `vite-plugin-singlefile` cannot inline a shared chunk. With three legal pages and no JS on them, one option is
  static HTML pages that get their CSS inlined by the same mechanism. Choose the simplest approach that passes AC-9.
- Legal page copy has no dynamic parts. Write it straight in the HTML.

### Ordered tasks
1. **Senior Dev:** config, `buildLead`, `lead.js`, wire it to the valid submit; unit tests (AC-1 to AC-7).
2. **Senior Dev:** the three legal pages and the build; footer links; consent notice (AC-8 to AC-12).
3. **Senior Dev:** update existing tests (AC-14), `CLAUDE.md` and `README.md`.
4. **Front-End Dev:** legal page layout and readability, the notice on the email screen in the phone frame, and the
   footer link row at every breakpoint (AC-13).
