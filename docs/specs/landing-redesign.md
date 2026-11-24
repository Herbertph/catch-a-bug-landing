# Spec: Landing page "Teste Antes de Lançar", redesign with the cave background

- Status: ready for development
- Branch: `feature/landing-redesign`
- Source of truth for copy and behavior: `docs/reference/landing-page-source-pt-br.md` (verbatim transcription of
  `especificacao-landing-page-teste-antes-de-lancar.pdf`, sections referenced as §N).
- Baseline code: repository `Herbertph/curso-qa` at commit `5b45243` (local clone `C:\Users\herbe\projects\curso-qa`).
- Baseline spec (still applies, see FR-1): `docs/reference/baseline-spec-curso-qa.md` (AC-1 to AC-42 there are
  referenced here as **B-AC-n**).
- Background artwork: `docs/reference/background-cave.png` (941×1672, portrait, 2.4 MB), provided by Herbert on
  2026-11-24.

## Context

`curso-qa` holds the first version of the landing page for the Unflaky mini course "Teste Antes de Lançar". It is a
dark, gold-accented page whose core is a 7-question diagnostic in a phone-shaped modal. Founders who build SaaS with AI
take the diagnostic and see their score and the lessons that fit their risk.

`catch-a-bug-landing` is the redesign of that page. The copy, the quiz flow and the behavior stay as the PDF specifies.
The new visual layer is Herbert's dark gothic cave artwork, used as the page background. Herbert's rule
(2026-11-24): **in the end, the page must follow the current PDF.** `curso-qa` later added things the PDF does not
have: MailerLite lead capture, a Kiwify offer with a price, a privacy page, and FAQ and footer changes. Those are
removed here. A checkout (Paddle, per Herbert) is a separate future feature (see Out of scope).

## Scope

### In scope
- Import the `curso-qa` codebase (page, styles, modules, tests, CI, Vite single-file build) as the starting point.
- Restore everything to the PDF: no lead capture, no offer, no price, no checkout, no privacy page; FAQ item 3 and the
  footer text back to the exact PDF copy.
- Visual redesign: the cave artwork as a fixed full-page background, a dark overlay for legibility, and translucent
  surfaces so the art shows through.
- Optimized background image shipped as a separate file next to `index.html`.
- `CLAUDE.md` and `README.md` for this repository.

### Out of scope
- Paddle checkout or any purchase button, price or offer (future feature, once Herbert shares the Paddle details).
- Sending the e-mail anywhere (MailerLite or other). The PDF (§16) says the e-mail is only validated and shown.
- Publishing or hosting the page.
- Any copy change, new section, new animation or parallax effect.
- The phrase "Catch a bug" anywhere on the page. The repository name is internal.

## Functional requirements

- **FR-1 Baseline behavior.** All requirements of the baseline spec (its FR-1 to FR-16, including the FR-16 8px grid
  and Refactoring UI token system) still apply, unless this spec changes them. Every B-AC must still pass, except
  where an AC below replaces it.
- **FR-2 Import.** Copy the `curso-qa` working tree at `5b45243` into this repository: `index.html`, `src/`, `tests/`,
  `playwright.config.js`, `vite.config.js`, `package.json`, `package-lock.json`, `.github/workflows/ci.yml`. Do not
  copy `node_modules/`, `dist/`, `test-results/` or `.git/`. Rename the package to `catch-a-bug-landing`. The
  `curso-qa` docs (specs, test cases, reports) are not copied. The baseline spec is already in `docs/reference/`.
- **FR-3 No lead capture.** Remove `src/lead.js`, the MailerLite request, `buildLead`, and the related config keys,
  tests, helpers and CLAUDE.md notes. Submitting a valid e-mail makes **no network request** (B-AC-27 applies again as
  written).
- **FR-4 No offer and no checkout.** Remove the result-screen offer block (`#oferta`), the `Quero o curso` controls
  (result screen and `#aulas`), the price line, `src/checkout.js` and `CHECKOUT_URL`. If `src/config.js` ends up
  empty, remove it and the `window.__TEST_CONFIG__` override. The result screen goes back to the PDF (§18):
  `Ver as aulas do curso` is the gold primary button and `Refazer o diagnóstico` is the ghost button.
- **FR-5 No privacy page.** Remove `privacidade.html`, `src/privacy.js`, `vite.privacy.config.js`, the privacy notice
  under the e-mail form and the footer privacy link. The build goes back to a single pass that emits a single
  `dist/index.html`.
- **FR-6 PDF copy restored.** FAQ item 3 and the footer right text match §27 and §28 exactly. The e-mail screen shows
  only the §16 texts.
- **FR-7 Background artwork.** The cave artwork is the background of the whole page, fixed to the viewport (it does
  not scroll with the content), covering it (`cover`) and centered. On portrait phones it shows almost whole; on
  landscape desktops it is cropped around the center (the bridge and the towers). It is purely decorative: hidden from
  assistive technology and not an `<img>` with alt text. Use a fixed-position layer, not `background-attachment: fixed`,
  because iOS Safari ignores it. While the image loads, or if it fails to load, the page shows the plain `--bg` color
  and stays fully usable.
- **FR-8 Legibility overlay.** A dark overlay sits between the artwork and the content, so every text keeps at least
  WCAG AA contrast (4.5:1 for body text, 3:1 for text 24px and up or 18.66px bold and up), measured against the
  darkest content color over the brightest part of the artwork. The overlay may be a gradient (lighter where there is
  no text), but the hero, panels and body text must stay readable.
- **FR-9 Translucent surfaces.** Section backgrounds that the PDF fills with `--bg` or `--bg2` (proof strip, final CTA,
  footer) become translucent so the artwork shows through. Panels and cards (`--panel`, `--panel2`) become slightly
  translucent, with an optional backdrop blur. Use new tokens (for example `--surface-glass`, `--panel-glass`). The 15
  §5 variables keep their exact names and values (B-AC-5). Header and mobile sticky bar keep their §5 translucent
  backgrounds and blur.
- **FR-10 Modal unchanged.** The quiz modal (backdrop `rgba(4,4,6,.78)`, phone frame `#050506`, screen `--panel`)
  stays opaque and unchanged, so the quiz reads exactly as before.
- **FR-11 Image delivery.** Convert the artwork to WebP (AVIF optional with WebP fallback), no larger than 300 KB, at
  least 941 px wide, without visible banding in the dark gradients. Ship it as a separate file in the build output
  (for example `dist/assets/bg-cave.webp` or `dist/bg-cave.webp`), referenced with a relative path so the page works
  from a sub-path. Do not inline it as base64 in `index.html`. Keep the original PNG only in `docs/reference/`. §31
  ("no external images") is read as "no third-party image hosts". The artwork is a first-party file shipped with the
  page.
- **FR-12 Design tokens.** New styles use the existing token system. `tests/unit/tokens.test.js` keeps passing:
  colors such as overlay and glass surfaces are tokens, not raw values in component rules.
- **FR-13 Reduced motion and performance.** No motion is added. Scrolling does not repaint the background on every
  frame (fixed layer with `will-change` or `transform` as needed). Total page weight, excluding fonts, stays under
  500 KB.

## Acceptance criteria

All baseline criteria B-AC-1 to B-AC-42 apply. The ones below are new or replace a baseline criterion.

### Restored to the PDF
- **AC-1** Given the built `dist/`, when I list it, then it contains `index.html` and the background image (plus
  optional assets), and no `privacidade.html`.
- **AC-2** Given the page is loaded, when I search the rendered text and attributes of the page and of every quiz
  screen, then none of these appear: `Quero o curso`, `R$ 9,90`, `Kiwify`, `Paddle`, `garantia`,
  `Política de privacidade`, `PRÓXIMO PASSO`, `mailerlite`.
- **AC-3** Given the FAQ, when I open item 3, then the question is `Quando o curso lança e quanto vai custar?` and the
  answer is exactly the §27 text.
- **AC-4** Given the footer, then the left text is `UNFLAKY, Quality Lab, Herbert Parasio` and the right text is
  exactly `Mini curso em produção. Conteúdo baseado em experiência real de QA, sem resultados financeiros prometidos ou inventados.`
  with no link.
- **AC-5** Given the e-mail screen, then below the form there is only the note
  `Seu resultado aparece na tela assim que você confirmar.` and no privacy notice or link.
- **AC-6** (replaces the baseline's MailerLite behavior) Given I submit a valid e-mail, then no network request of
  any kind is made between the submit and the result screen, and the result appears at once.
- **AC-7** Given the result screen, then the only gold (primary) button is `Ver as aulas do curso`, and
  `Refazer o diagnóstico` is a ghost button. Both behave as in B-AC-32 and B-AC-33.
- **AC-8** Given the `#aulas` section, then it ends with the 3 curriculum footer items of §23 and has no price line or
  purchase link.

### Background and legibility
- **AC-9** Given desktop (1280×800) and mobile (390×844), when the page loads, then a decorative background layer
  showing the cave artwork covers the whole viewport, and it has `aria-hidden="true"` or is a CSS background
  (absent from the accessibility tree).
- **AC-10** Given the page is scrolled to the middle and to the bottom, then the background layer stays in the same
  viewport position (fixed), on desktop and mobile.
- **AC-11** Given the background image request is blocked or fails, when the page loads, then the page background is
  `--bg` (`#0c0d0f`), every section is readable, there are no console errors from page code, and the quiz works end to
  end.
- **AC-12** Given the built background image, then it is a WebP (or AVIF with WebP fallback) file of at most
  300 KB, and `dist/index.html` contains no `data:image/` URI other than the empty favicon.
- **AC-13** Given desktop and mobile, when an automated contrast check (for example axe-core `color-contrast`) runs
  on the page with the modal closed, then there are no contrast violations. The check runs with the artwork loaded.
- **AC-14** Given the proof strip, the problem/format/audience/instructor cards, the course accordion, the FAQ and the
  final CTA, then their computed background colors have alpha below 1 (translucent), and the header and mobile sticky
  bar keep the §5 values (`rgba(12,13,15,.92)` and `rgba(18,19,22,.97)`).
- **AC-15** Given the quiz modal is open, then the backdrop, phone frame and phone screen computed backgrounds equal
  the §5/§12 values (`rgba(4,4,6,.78)`, `#050506`, `--panel`), unchanged by the redesign.
- **AC-16** Given widths 320, 390, 620, 621, 900, 901 and 1280px, then there is no horizontal scroll and the
  background still covers the viewport, with no empty band at the bottom or the sides (also check 1920×1080).
- **AC-17** Given `prefers-reduced-motion: reduce`, then the background has no animation or transition.

### Build and repository
- **AC-18** Given a clean clone, when I run `npm ci`, `npm run build`, `npm test` and `npm run test:e2e`, then all
  pass, and CI runs the same steps on the pull request.
- **AC-19** Given the repository, then `src/` has no `lead.js`, `checkout.js` or `privacy.js`, there is no
  `vite.privacy.config.js`, and no test references MailerLite, the checkout or the privacy page.

## Assumptions to confirm (Herbert)

1. **Baseline assumptions carry over.** These keep the `curso-qa` decisions: the gold part of the H1, the highlighted
   hero phrase, the lesson tags, and the 8px grid rounding of PDF pixel values.
2. **Paddle comes later.** The PDF has no price or checkout, so this version has none. Paddle will be its own feature
   once Herbert shares the product and price details. That feature will also need a privacy notice if the e-mail
   starts being stored.
3. **Lead capture removed.** Following the PDF, the e-mail is not sent to MailerLite. The `curso-qa` code stays in that
   repository if we want to bring it back.
4. **Gold stays the action color.** The artwork's warm lantern glow is close to the gold, so the §5 palette is kept.
5. **Background crop on desktop.** Center crop. If Herbert prefers another focal point (for example the lanterns on
   the right), it is a one-line change in `background-position`.

## Technical notes

- **Where it fits:** the fixed layer is best a single element right after `<body>` (or a `body::before`), with
  `position: fixed; inset: 0; z-index: -1`, the artwork as `background-image` (`cover`, `center`), and the overlay
  as a second background layer (gradient) or a `::after`. `body` keeps `background-color: var(--bg)` as the
  fallback.
- **Glass tokens:** for example `--surface-glass: rgba(12,13,15,.72)` for full-width bands and
  `--panel-glass: rgba(23,24,28,.86)` for cards. Tune the alpha until AC-13 passes. If you use `backdrop-filter`,
  keep a solid fallback through `@supports`.
- **Image pipeline:** convert once and commit the optimized file (for example `public/bg-cave.webp`, which Vite copies
  as-is). With `vite-plugin-singlefile`, set it up so the file is **not** inlined (files in `public/` are not
  processed). Reference it with a relative URL.
- **Tests to adapt:** remove `lead*.spec.js`, `offer.spec.js`, `privacy.spec.js`, `tests/unit/lead.test.js` and
  `tests/unit/config.test.js`, and the MailerLite mocking in `tests/e2e/helpers.js`. Re-check `email.spec.js`,
  `result.spec.js` and `page.spec.js` against the PDF copy. Contrast: add `@axe-core/playwright` as a dev dependency.

### Ordered tasks (Senior Dev, then Front-End Dev)
1. **Senior Dev:** import `curso-qa@5b45243` per FR-2. Rename the package. Run build and tests to confirm the
   baseline is green in this repository.
2. **Senior Dev:** remove lead capture, offer, checkout, config and privacy page (FR-3 to FR-6), with their tests.
   Return to a single-pass build. Add tests for AC-1 to AC-8 and AC-19.
3. **Senior Dev:** write `CLAUDE.md` (stack, commands, structure, design tokens, the "follow the PDF" rule) and
   `README.md`.
4. **Front-End Dev:** image pipeline (FR-11, AC-12). Fixed background layer and overlay (FR-7, FR-8). Glass surfaces
   (FR-9). Keep the modal unchanged (FR-10).
5. **Front-End Dev:** tune the overlay and glass alpha until the axe contrast check is clean (AC-13). Check the
   breakpoints, 1920×1080 and the fallback without the image (AC-9 to AC-17). Add the e2e tests for them.
6. Both: build, unit and e2e green locally. No em dash or en dash and no waitlist wording (B-AC-3, B-AC-4).
