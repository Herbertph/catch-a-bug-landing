# catch-a-bug-landing

https://drive.google.com/file/d/1jO2r9agtZciTZsUcOzhwfUsLu5lByXTf/view?usp=drivesdk

English landing page for "Don't Break in Public", a series of 7 ebooks by Unflaky, with the 7-question diagnostic
quiz in a phone-shaped modal. Redesign of `curso-qa` (imported at `5b45243`) with Herbert's cave artwork as the background. Built with a multi-agent pipeline: requirements analyst → developer → tester → pull request.
A human reviews and merges every PR.

## The rule: follow the PDF

The page is in English only. Every text comes letter by letter from `docs/reference/landing-copy-en.md` (EN-§N),
with the straight apostrophe `'` and no em or en dash. Structure, layout, measurements, colors and behavior still
follow the PDF, transcribed in `docs/reference/landing-page-source-pt-br.md` (§N). Legal page copy and the consent notice come letter by letter from
`docs/reference/legal-copy-en.md` (LEGAL-§N). A valid email submit sends the lead to MailerLite (see below) and the
result never waits for it. `privacy.html`, `terms.html` and `refund.html` are linked from every footer. Still no
price, offer or checkout until the Paddle spec. `herbert.parasio@gmail.com` appears only on the legal pages.
Anything the PDF does not have needs a spec first. The phrase "Catch a bug" never appears on the page (the repository name is internal).
Baseline spec, still valid: `docs/reference/baseline-spec-curso-qa.md` (B-AC-n). Specs:
`docs/specs/landing-redesign.md`, `docs/specs/english-ebooks.md` and `docs/specs/lead-capture-and-legal.md`
(current). Anchors: `#top`, `#diagnostic`,
`#ebooks`.

## Stack

- **Vite 8 + vanilla JavaScript (ES modules)**, no framework.
- **`vite-plugin-singlefile`**: `npm run build` (`scripts/build.js`) runs one Vite build per page and emits
  self-contained `dist/index.html`, `privacy.html`, `terms.html` and `refund.html` with CSS and JS inlined, plus
  `dist/bg-cave.webp`. One build per page, because the plugin cannot inline a chunk shared by several entries.
  Fonts stay on Google Fonts (Archivo and IBM Plex Mono).
- **Vitest** for unit tests of the pure logic (`tests/unit`).
- **Playwright** (Chromium) for end-to-end tests, with two projects: `desktop` (1280×800) and `mobile` (390×844).
  Tests run against `vite preview` of the built file on `127.0.0.1:4173`, never on the Lamp port 4545.
- **GitHub Actions** (`.github/workflows/ci.yml`): install, build, unit tests and end-to-end tests on every pull
  request and on pushes to `main`.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | install dependencies |
| `npm run dev` | Vite dev server |
| `npm run build` | build the four single-file pages into `dist/` |
| `npm run preview` | preview the built file (Vite default port 4173) |
| `npm run serve:e2e` | preview the built file on `127.0.0.1:4173` for Playwright |
| `npm test` | run Vitest unit tests |
| `npm run test:e2e` | build, then run the Playwright suite (desktop + mobile) |
| `npx playwright test --project=desktop` | run only the desktop project (server must be built) |

First local end-to-end run needs the browser: `npx playwright install chromium`.

## Structure

- `index.html`: all static markup and copy, including the quiz block inside `#diagnostic` and the modal shell.
- `src/styles.css`: design tokens and all styles.
- `src/quiz-data.js`: the 7 areas (each with its ebook number), the 3 options, the 3 bands and every quiz/result string (single source of copy).
- `src/scoring.js`: pure functions (`totalScore`, `bandFor`, `statusFor`, `priorityAreas`, `formatPriorityList`,
  `isValidEmail`, `pointsFor`), no DOM.
- `src/quiz.js`: quiz state machine and screen rendering (all text via `textContent`).
- `src/modal.js`: modal open/close, focus, scroll lock and the three close methods.
- `src/accordion.js`: course and FAQ accordions (one open at a time, `aria-expanded` in sync).
- `src/main.js`: moves the quiz into the phone screen and wires every `[data-open-quiz]` button.
- `src/config.js`: public MailerLite account and form IDs (empty in the repository).
- `src/lead.js`: fire-and-forget MailerLite subscribe request (`sendLead`), 8 s timeout, silent on failure.
- `privacy.html`, `terms.html`, `refund.html`: static legal pages; `src/legal.js` only loads the styles.
- `scripts/build.js`: one single-file Vite build per page.
- `tests/unit/`: Vitest tests (scoring, quiz copy, design tokens, repository guard).
- `tests/e2e/`: Playwright acceptance tests, named after their AC-n.
- `docs/reference/`: PDF transcription, baseline spec and the original cave artwork (PNG).
- `docs/specs/`: feature specs written by the requirements analyst.
- `docs/test-cases/`: test cases (TC-n, with steps and expected results) written by the tester.
- `docs/test-reports/`: test reports written by the tester.
- Bugs found in testing are filed as GitHub issues labeled `bug` and `severity: *`. Fix commits reference the issue
  (`fix: ... (#12)`), and PRs close them with `Fixes #12`.

## Lead capture (MailerLite)

- On a valid submit, `src/quiz.js` shows the result, then calls `sendLead(email, answers)`. The lead comes from the
  pure `buildLead` in `src/scoring.js`: `email` (trimmed), `quiz_score` (0 to 14), `quiz_band` (band title) and
  `quiz_open_areas` (areas below 2 points, in ebook order, joined by `, `).
- Request: `POST https://assets.mailerlite.com/jsonp/<ACCOUNT_ID>/forms/<FORM_ID>/subscribe`, `mode: 'no-cors'`,
  form-urlencoded, with `fields[email]`, `fields[quiz_score]`, `fields[quiz_band]`, `fields[quiz_open_areas]`,
  `ml-submit=1` and `anticsrf=true` (MailerLite's public embedded-form endpoint, same as `curso-qa`).
- `src/config.js` holds `MAILERLITE_ACCOUNT_ID` and `MAILERLITE_FORM_ID`, public IDs from the embed code. While
  either is empty, nothing is sent. Never put an API key or token in the page or the repository
  (`tests/unit/repository.test.js` guards it).
- Tests: `useConfig(page)` in `tests/e2e/helpers.js` sets `window.__TEST_CONFIG__` before the page loads, and
  `mockMailerLite(page)` intercepts the endpoint. Tests never call the real service.
- Setup for Herbert in MailerLite: create the custom fields `quiz_score` (number), `quiz_band` (text) and
  `quiz_open_areas` (text); create an embedded form linked to a group, with those fields and double opt-in on; send
  the embed code so the account ID and form ID go into `src/config.js`.

## Design system (FR-16): 8px grid and Refactoring UI

All spacing, sizes, radii, shadows and font sizes come from tokens in `:root` of `src/styles.css`. Component rules
must not use raw `px` values for spacing or sizing; the only exceptions are 1px to 3px borders, the 2px focus
outline and the 900px/620px breakpoints. `tests/unit/tokens.test.js` enforces this and that no component rule uses
a raw hex or `rgb()` color.

**Spacing and size scale (8px base, 4px half step):** `--space-1` 4px, `--space-2` 8px, `--space-3` 12px,
`--space-4` 16px, `--space-5` 24px, `--space-6` 32px, `--space-7` 40px, `--space-8` 48px, `--space-9` 56px,
`--space-10` 64px, `--space-11` 80px, `--space-12` 96px.

**Type scale:** `--font-xs` 12px, `--font-sm` 14px, `--font-base` 16px, `--font-md` 18px, `--font-lg` 20px,
`--font-xl` 24px, `--font-2xl` 30px, `--font-3xl` 36px, `--font-4xl` 48px, `--font-5xl` 60px. Line heights:
`--leading-tight` 1.02, `--leading-snug` 1.3, `--leading-body` 1.55.

**Radii:** `--radius-sm` 8px, `--radius-md` 16px, `--radius-lg` 24px, `--radius-xl` 32px,
`--radius-phone` 40px, `--radius-full` 999px.

**Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-lg` (light from above).

**Component sizes:** `--size-wrap` 1120px, `--size-content` 720px, `--size-content-wide` 760px,
`--size-content-sm` 640px, `--size-phone` 400px, `--size-phone-h` 800px, `--size-logo` 48px,
`--size-shield` 32px, `--size-icon` 24px, `--size-close` 32px, `--size-close-hit` 40px, `--size-notch-w` 96px,
`--size-notch-h` 24px, `--size-avatar` 64px, `--size-instructor-card` 320px, `--size-tap` 48px.

**Colors:** the 15 variables of spec §5 are kept with their exact names and values, including `--radius: 14px`
(required by AC-5). Components never use `--radius`; they use the radius scale. The extra fixed colors of §5
(`--on-gold`, `--phone-bg`, `--notch-bg`, `--backdrop`, `--header-bg`, `--bar-bg`) and the translucent variants
(`--gold-line`, `--green-dim`, `--red-dim`, `--gold-glow`, ...) are also tokens.

**Mapping decisions (source px to token), for QA and the Front-End Dev:**

- Logo box 44px → 48px and header button 44px → 48px (`--size-tap`). The shield 28px → 32px
  (`--size-shield`), with 4px inner padding, so it always fits whole inside the box. AC-6 still quotes 44px and
  28px; FR-16 supersedes those raw values.
- Close button 34px → 32px circle (`--size-close`) with a 40px hit area (`--size-close-hit`).
- Notch strip 38px → 40px; notch pill 96×20px → 96×24px.
- Phone frame 10px inner padding → 8px; inner screen radius 30px → 32px (`--radius-xl`).
- Big button 54px → 56px (`--space-9`); final CTA 70px → 80px (`--space-11`); footer bottom 90px → 96px.
- Section copy: 14/18/20px → 16px or 24px by context; 22/26/28px → 24px or 32px; 13/13.5px → 14px;
  15/15.5px → 16px; 16.5px → 16px; 19px → 20px; 22px → 24px; 56px → 60px.

## Conventions

- Everything in the repository is written in English: code, comments, docs, commit messages, PR descriptions.
  The page copy is English and must be copied letter by letter from `docs/reference/landing-copy-en.md`.
- Keep business logic in pure, testable functions, separate from UI code.
- Never render user input as HTML.
- Prefer accessible markup (labels, roles, `aria-*`). End-to-end tests locate elements with `getByRole`,
  `getByLabel` and `getByText` where possible.
- Name tests after behavior. Acceptance tests start with their criterion ID, for example `AC-2: rejects a blank title`.
- Commits follow Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`.
- Feature branches are named `feature/<slug>`, or keep the branch Claude Code created for a worktree session. Never
  commit to `main`.

## Definition of done

- Every acceptance criterion in the spec is covered by at least one test.
- Build, unit tests and end-to-end tests all pass.
- No unrelated changes in the diff.
