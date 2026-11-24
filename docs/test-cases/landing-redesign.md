# Test cases: landing-redesign

Spec: `docs/specs/landing-redesign.md`. Baseline criteria (B-AC-1 to B-AC-42) keep their existing TC-1 to TC-63
tests in `tests/e2e/` (those test names say `AC-n` but mean the baseline B-AC-n). New criteria use TC-101 and up, so
TC-1nn verifies AC-n of this spec.

## Traceability

| AC | Test cases | Status |
| --- | --- | --- |
| AC-1 | TC-101 | Pass |
| AC-2 | TC-102 | Pass |
| AC-3 | TC-103 | Pass |
| AC-4 | TC-104 | Pass |
| AC-5 | TC-105 | Pass |
| AC-6 | TC-106 | Pass |
| AC-7 | TC-107 | Pass |
| AC-8 | TC-108 | Pass |
| AC-9 | TC-109 (desktop, mobile) | Pass |
| AC-10 | TC-110 (desktop, mobile) | Pass |
| AC-11 | TC-111 | Pass |
| AC-12 | TC-112 | Pass |
| AC-13 | TC-113 (desktop, mobile), TC-120 (manual) | Pass |
| AC-14 | TC-114 | Pass |
| AC-15 | TC-115 | Pass |
| AC-16 | TC-116 | Pass |
| AC-17 | TC-117 | Pass |
| AC-18 | TC-118 | Pass |
| AC-19 | TC-119 | Pass |

### TC-101: the build emits index.html and the artwork, and no privacy page
- **Acceptance criterion:** AC-1
- **Priority:** high
- **Type:** functional
- **Preconditions:** `npm run build` has run
- **Test data:** none
- **Steps:**
  1. List `dist/`.
- **Expected result:** `index.html` and `bg-cave.webp` exist; `privacidade.html` does not.
- **Automated by:** `tests/e2e/pdf-restore.spec.js` › `TC-101 (AC-1): the build emits index.html and no privacy page`
- **Status:** Pass

### TC-102: no offer, price, checkout, privacy or MailerLite text anywhere
- **Acceptance criterion:** AC-2
- **Priority:** high
- **Type:** negative
- **Preconditions:** page loaded
- **Test data:** `Quero o curso`, `R$ 9,90`, `Kiwify`, `Paddle`, `garantia`, `Política de privacidade`, `PRÓXIMO PASSO`, `mailerlite`
- **Steps:**
  1. Read the page text and attributes.
  2. Walk every quiz screen up to the result and read their text and attributes.
- **Expected result:** none of the strings appear.
- **Automated by:** `tests/e2e/pdf-restore.spec.js` › `TC-102 (AC-2): no offer, price, checkout, privacy or MailerLite text on the page or any quiz screen`
- **Status:** Pass

### TC-103: FAQ item 3 has the PDF question and answer
- **Acceptance criterion:** AC-3
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** §27 text
- **Steps:**
  1. Open FAQ item 3.
- **Expected result:** question `Quando o curso lança e quanto vai custar?`, answer exactly §27.
- **Automated by:** `tests/e2e/pdf-restore.spec.js` › `TC-103 (AC-3): FAQ item 3 has the PDF question and answer`
- **Status:** Pass

### TC-104: footer texts are the PDF texts, with no link
- **Acceptance criterion:** AC-4
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** §28 text
- **Steps:**
  1. Read the footer left and right texts and look for links.
- **Expected result:** exact §28 texts, no `<a>` in the footer.
- **Automated by:** `tests/e2e/pdf-restore.spec.js` › `TC-104 (AC-4): the footer has the PDF texts and no link`
- **Status:** Pass

### TC-105: the e-mail screen shows only the §16 note
- **Acceptance criterion:** AC-5
- **Priority:** medium
- **Type:** functional
- **Preconditions:** quiz answered up to the e-mail screen
- **Test data:** none
- **Steps:**
  1. Read the text below the form.
- **Expected result:** only `Seu resultado aparece na tela assim que você confirmar.`, no privacy notice or link.
- **Automated by:** `tests/e2e/pdf-restore.spec.js` › `TC-105 (AC-5): the e-mail screen shows only the note below the form`
- **Status:** Pass

### TC-106: a valid e-mail submit makes no network request
- **Acceptance criterion:** AC-6
- **Priority:** high
- **Type:** security
- **Preconditions:** e-mail screen
- **Test data:** `ana@site.com`
- **Steps:**
  1. Record requests, submit the e-mail.
- **Expected result:** zero requests between submit and the result screen; the result shows at once.
- **Automated by:** `tests/e2e/pdf-restore.spec.js` › `TC-106 (AC-6): submitting a valid e-mail makes no network request and shows the result at once`
- **Status:** Pass

### TC-107: result buttons follow §18
- **Acceptance criterion:** AC-7
- **Priority:** medium
- **Type:** functional
- **Preconditions:** result screen
- **Test data:** all first options
- **Steps:**
  1. Inspect the result buttons.
- **Expected result:** `Ver as aulas do curso` is the only gold button, `Refazer o diagnóstico` is ghost.
- **Automated by:** `tests/e2e/pdf-restore.spec.js` › `TC-107 (AC-7): the only gold button on the result is "Ver as aulas do curso", redo is ghost`
- **Status:** Pass

### TC-108: #aulas ends with the §23 footer items, no price or purchase link
- **Acceptance criterion:** AC-8
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** §23 items
- **Steps:**
  1. Read the end of `#aulas`.
- **Expected result:** the 3 §23 items, no price line, no purchase link.
- **Automated by:** `tests/e2e/pdf-restore.spec.js` › `TC-108 (AC-8): #aulas ends with the 3 curriculum footer items and no price or purchase link`
- **Status:** Pass

### TC-109: a decorative fixed layer shows the artwork over the whole viewport
- **Acceptance criterion:** AC-9
- **Priority:** high
- **Type:** functional / accessibility
- **Preconditions:** viewport 1280×800 and 390×844
- **Test data:** none
- **Steps:**
  1. Load the page and wait for `bg-cave.webp` (HTTP 200).
  2. Read the computed style of `body::before`.
- **Expected result:** `position: fixed`, `inset: 0`, `z-index: -1`, background image `bg-cave.webp` with `cover`, and no `<img>` for the artwork (CSS only, outside the accessibility tree).
- **Automated by:** `tests/e2e/background.spec.js` › `TC-109 (AC-9): a decorative CSS layer with the cave artwork covers the viewport`
- **Status:** Pass

### TC-110: the layer stays fixed while scrolling
- **Acceptance criterion:** AC-10
- **Priority:** medium
- **Type:** functional
- **Preconditions:** viewport 1280×800 and 390×844
- **Test data:** scroll to half and to the full height
- **Steps:**
  1. Scroll to the middle, then to the bottom; read the layer style each time.
- **Expected result:** still `fixed` with `inset: 0`.
- **Automated by:** `tests/e2e/background.spec.js` › `TC-110 (AC-10): the background layer stays fixed while scrolling to the middle and the bottom`
- **Status:** Pass

### TC-111: the page works and falls back to --bg when the artwork fails
- **Acceptance criterion:** AC-11
- **Priority:** high
- **Type:** negative
- **Preconditions:** request for `**/bg-cave.webp` aborted
- **Test data:** answers all 0, `ana@site.com`
- **Steps:**
  1. Load the page; read the body background; run axe `color-contrast`.
  2. Complete the quiz.
- **Expected result:** body background `rgb(12, 13, 15)`, no contrast violation, result screen shown, no page console errors.
- **Automated by:** `tests/e2e/background.spec.js` › `TC-111 (AC-11): without the artwork the page falls back to --bg and the quiz works end to end`
- **Status:** Pass

### TC-112: the artwork is a WebP of at most 300 KB, referenced relatively, not inlined
- **Acceptance criterion:** AC-12
- **Priority:** high
- **Type:** boundary
- **Preconditions:** `npm run build` has run
- **Test data:** `dist/bg-cave.webp` (94,814 bytes on this run)
- **Steps:**
  1. Read the file magic bytes and size.
  2. Search `dist/index.html` for `data:image/` and the artwork URL.
- **Expected result:** `RIFF....WEBP`, size ≤ 307,200 bytes, no `data:image/`, `url('./bg-cave.webp')`.
- **Automated by:** `tests/e2e/background.spec.js` › `TC-112 (AC-12): the built artwork is a WebP of at most 300 KB and is not inlined`
- **Status:** Pass

### TC-113: axe finds no color-contrast violation with the artwork loaded
- **Acceptance criterion:** AC-13
- **Priority:** high
- **Type:** accessibility
- **Preconditions:** viewport 1280×800 and 390×844, artwork loaded, modal closed
- **Test data:** axe rule `color-contrast`
- **Steps:**
  1. Run axe.
- **Expected result:** no violations.
- **Automated by:** `tests/e2e/background.spec.js` › `TC-113 (AC-13): no axe color-contrast violations with the artwork loaded`
- **Status:** Pass. Note: axe reports the hero, conference card and final CTA texts as `incomplete` (`bgGradient`), so it does not measure them; TC-120 covers that gap manually.

### TC-114: sections and panels are translucent, header and sticky bar keep §5
- **Acceptance criterion:** AC-14
- **Priority:** medium
- **Type:** functional
- **Preconditions:** viewport 390×844
- **Test data:** none
- **Steps:**
  1. Read the computed background of proof strip, card, accordion, FAQ, instructor, final CTA, header and sticky bar.
- **Expected result:** alpha < 1 for the first six; header `rgba(12, 13, 15, 0.92)`, sticky bar `rgba(18, 19, 22, 0.97)`.
- **Automated by:** `tests/e2e/background.spec.js` › `TC-114 (AC-14): sections and panels are translucent, header and sticky bar keep the §5 values`
- **Status:** Pass

### TC-115: the quiz modal keeps its opaque colors
- **Acceptance criterion:** AC-15
- **Priority:** medium
- **Type:** functional
- **Preconditions:** quiz modal open
- **Test data:** none
- **Steps:**
  1. Read backdrop, phone frame and phone screen backgrounds.
- **Expected result:** `rgba(4, 4, 6, 0.78)`, `rgb(5, 5, 6)`, `rgb(23, 24, 28)`.
- **Automated by:** `tests/e2e/background.spec.js` › `TC-115 (AC-15): the quiz modal keeps its opaque §5 colors`
- **Status:** Pass

### TC-116: no horizontal scroll and full coverage at every breakpoint
- **Acceptance criterion:** AC-16
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** page loaded, scrolled to the bottom
- **Test data:** widths 320, 390, 620, 621, 900, 901, 1280 and 1920×1080
- **Steps:**
  1. For each size, compare `scrollWidth` with `clientWidth` and read the layer style.
- **Expected result:** no horizontal overflow, layer `inset: 0` with `cover`.
- **Automated by:** `tests/e2e/background.spec.js` › `TC-116 (AC-16): no horizontal scroll and the background covers the viewport at every breakpoint`
- **Status:** Pass

### TC-117: no animation or transition on the background under reduced motion
- **Acceptance criterion:** AC-17
- **Priority:** low
- **Type:** accessibility
- **Preconditions:** `prefers-reduced-motion: reduce`
- **Test data:** none
- **Steps:**
  1. Read `animation-name` and `transition-duration` of `body::before`.
- **Expected result:** `none` and `0s`.
- **Automated by:** `tests/e2e/background.spec.js` › `TC-117 (AC-17): the background has no animation or transition`
- **Status:** Pass

### TC-118: build, unit and e2e pass and CI runs the same steps
- **Acceptance criterion:** AC-18
- **Priority:** high
- **Type:** functional
- **Preconditions:** working tree at the branch head
- **Test data:** none
- **Steps:**
  1. Run `npm run build`, `npm test`, `npm run test:e2e`.
  2. Read `.github/workflows/ci.yml`.
- **Expected result:** all pass; CI runs `npm ci`, build, unit and e2e.
- **Automated by:** manual run (see the test report) and `.github/workflows/ci.yml`
- **Status:** Pass

### TC-119: no lead, checkout or privacy code left in the repository
- **Acceptance criterion:** AC-19
- **Priority:** medium
- **Type:** negative
- **Preconditions:** repository checkout
- **Test data:** none
- **Steps:**
  1. Check `src/` and the test files.
- **Expected result:** no `lead.js`, `checkout.js`, `privacy.js`, `vite.privacy.config.js`, and no test references to them.
- **Automated by:** `tests/unit/repository.test.js` › `TC-119 (AC-19): lead capture, checkout and privacy page are gone`
- **Status:** Pass

### TC-120: the hero stays readable over the artwork on desktop (visual check)
- **Acceptance criterion:** AC-13 (FR-8)
- **Priority:** high
- **Type:** accessibility
- **Preconditions:** viewport 1280×800, artwork loaded, top of the page
- **Test data:** none
- **Steps:**
  1. Take a screenshot of the first viewport and inspect the hero pill, H1 (white and gold parts), both hero leads and the conference card.
- **Expected result:** every text is clearly readable; the lantern glow behind the H1 does not wash out any letter.
- **Automated by:** manual (screenshot review)
- **Status:** Pass

## Not covered

- Numeric contrast of each text over the brightest artwork pixel (FR-8 wording): axe cannot measure text over a
  background image, and a pixel-sampling script could not be completed in this session (the tool run was blocked).
  The footer text (`--muted2`, 14px) has the least margin: 4.53:1 on plain `--bg`, so it is the first place to check
  if the overlay is ever made lighter.
- iOS Safari behavior of the fixed layer and `backdrop-filter` (no WebKit project in Playwright here).
- Visible banding in the WebP gradients (FR-11) and total page weight (FR-13), judged by eye and by the file size
  (95 KB image + 73 KB HTML, well under 500 KB).
