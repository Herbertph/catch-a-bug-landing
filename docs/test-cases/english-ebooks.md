# Test cases: english-ebooks

Spec: `docs/specs/english-ebooks.md`. Copy source: `docs/reference/landing-copy-en.md` (EN-§N).

New test cases are TC-2nn. Where an existing test (TC-1 to TC-63, adapted to English by the developer) already
verifies a criterion, it is listed as is. Baseline and redesign criteria keep their own tests
(`docs/test-cases/landing-redesign.md`).

## Traceability

| AC | Test cases | Status |
| --- | --- | --- |
| AC-1 | TC-1 | Pass |
| AC-2 | TC-2, TC-3, TC-4, TC-5, TC-51, TC-54 | Pass |
| AC-3 | TC-203, TC-6 | Pass |
| AC-4 | TC-204 | Pass |
| AC-5 | TC-205 | Pass |
| AC-6 | TC-206 | Pass |
| AC-7 | TC-43 | Pass |
| AC-8 | TC-44 | Pass |
| AC-9 | TC-209, TC-47 | Pass |
| AC-10 | TC-48, TC-49 | Pass |
| AC-11 | TC-50, TC-52 | Pass |
| AC-12 | TC-53 | Pass |
| AC-13 | TC-213 | Pass |
| AC-14 | TC-214 (8 widths), TC-215, TC-121, TC-113, TC-116 | Pass |
| AC-15 | TC-216, `tests/unit/quiz-data.test.js` | Pass |

### TC-1: language and title
- **Acceptance criterion:** AC-1
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Read `<html lang>` and the document title.
- **Expected result:** `en` and `Don't Break in Public, the ebook series for AI-built SaaS`.
- **Automated by:** `tests/e2e/page.spec.js` › `TC-1 (AC-1): language, title, favicon and viewport meta`
- **Status:** Pass

### TC-2 to TC-5, TC-51, TC-54: every EN-§ text is on the page exactly
- **Acceptance criterion:** AC-2
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded; accordion items opened for TC-51 and TC-54
- **Test data:** EN-§ texts
- **Steps:**
  1. Compare section order, hero, card, proof strip, headings, leads, cards, steps, audience, instructor, FAQ answers, ebook bodies and tags with EN-§.
- **Expected result:** each text present exactly.
- **Automated by:** `tests/e2e/page.spec.js` › TC-2 to TC-5; `tests/e2e/accordion.spec.js` › TC-51, TC-54
- **Status:** Pass

### TC-203: no dashes, curly apostrophes, pt-BR words or waitlist wording
- **Acceptance criterion:** AC-3
- **Priority:** high
- **Type:** negative
- **Preconditions:** page loaded
- **Test data:** `—`, `–`, `’`, `aula`, `curso`, `Fazer o diagnóstico`, `diagnóstico`, `você`, `waitlist`, `notify me`, `reserve your spot`, `early access`, `lesson`, `course`; results for scores 0, 7 and 14
- **Steps:**
  1. Search the page text and attributes, then every quiz screen including the error and the three results.
- **Expected result:** none of the strings appear.
- **Automated by:** `tests/e2e/english.spec.js` › `TC-203 (AC-3): no dashes, curly apostrophes, pt-BR words or waitlist wording on the page or any quiz screen`
- **Status:** Pass

### TC-204: every "Take the diagnostic" button opens question 1 in English
- **Acceptance criterion:** AC-4
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded (mobile bar on mobile width)
- **Test data:** header, hero, diagnostic section, final CTA, mobile bar buttons
- **Steps:**
  1. Click each button.
- **Expected result:** `AREA 1 OF 7, LOGIN AND SESSION`, `Question 1 of 7`, EN question and hint.
- **Automated by:** `tests/e2e/english.spec.js` › `TC-204 (AC-4): every "Take the diagnostic" button opens the quiz on question 1 in English`
- **Status:** Pass

### TC-205: question 7 button reads "See what's missing"
- **Acceptance criterion:** AC-5
- **Priority:** medium
- **Type:** functional
- **Preconditions:** question 7 with an option selected
- **Test data:** none
- **Steps:**
  1. Read the primary button and click it.
- **Expected result:** `See what's missing`, then the email screen.
- **Automated by:** `tests/e2e/english.spec.js` › `TC-205 (AC-5): question 7 reads "See what's missing" and leads to the email screen`
- **Status:** Pass

### TC-206: invalid email error and valid submit without a request
- **Acceptance criterion:** AC-6
- **Priority:** high
- **Type:** negative / security
- **Preconditions:** email screen
- **Test data:** `ana@`, `ana@site.com`
- **Steps:**
  1. Submit `ana@`.
  2. Submit `ana@site.com` while recording requests.
- **Expected result:** `Please check the email you typed, something seems to be missing.` with focus on the field; then the result at once and no request.
- **Automated by:** `tests/e2e/english.spec.js` › `TC-206 (AC-6): an invalid email shows the EN error and a valid one shows the result with no request`
- **Status:** Pass

### TC-43: all first options give 14/14
- **Acceptance criterion:** AC-7
- **Priority:** high
- **Type:** boundary
- **Preconditions:** quiz open
- **Test data:** answers 0,0,0,0,0,0,0
- **Steps:**
  1. Complete the quiz.
- **Expected result:** `14` `/14`, `Almost ready, close the gaps`, 7 rows `checked`, paragraph starting `No uncovered areas.`
- **Automated by:** `tests/e2e/result.spec.js` › `TC-43 (AC-28): all first options give 14/14, the top band and every area conferido`
- **Status:** Pass (test name still says "conferido"; the assertions are in English)

### TC-44: all last options give 0/14
- **Acceptance criterion:** AC-8
- **Priority:** high
- **Type:** boundary
- **Preconditions:** quiz open
- **Test data:** answers 2,2,2,2,2,2,2
- **Steps:**
  1. Complete the quiz.
- **Expected result:** `0` `/14`, `Launch at risk`, 7 rows `uncovered`, the full priority paragraph of AC-8.
- **Automated by:** `tests/e2e/result.spec.js` › `TC-44 (AC-29): all last options give 0/14, the risk band and every area descoberto`
- **Status:** Pass (test name still says "descoberto"; the assertions are in English)

### TC-209: mixed answers give score 8 and the exact priority list
- **Acceptance criterion:** AC-9
- **Priority:** high
- **Type:** functional
- **Preconditions:** quiz open
- **Test data:** answers 2,1,0,2,1,0,2
- **Steps:**
  1. Complete the quiz and read the rows, labels, band and priority list.
- **Expected result:** statuses per AC-9, `EBOOK 01` to `EBOOK 07`, `Partial base, open gaps`, priority list Ebook 02, 03, 05, 06.
- **Automated by:** `tests/e2e/english.spec.js` › `TC-209 (AC-9): answers 2,1,0,2,1,0,2 give score 8 with EBOOK labels and the exact priority list`
- **Status:** Pass

### TC-48 and TC-49: result buttons
- **Acceptance criterion:** AC-10
- **Priority:** medium
- **Type:** functional
- **Preconditions:** result screen
- **Test data:** none
- **Steps:**
  1. Click `See the ebooks`.
  2. Reach the result again and click `Retake the diagnostic`.
- **Expected result:** modal closes and `#ebooks` is in view; retake keeps the modal open on question 1 with no answer.
- **Automated by:** `tests/e2e/modal.spec.js` › TC-48, TC-49
- **Status:** Pass

### TC-50 and TC-52: ebooks accordion
- **Acceptance criterion:** AC-11
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Count items and read titles; check Ebook 01 open.
  2. Open Ebook 04, click it again.
- **Expected result:** 7 items 01 to 07, no introduction item; Ebook 04 closes Ebook 01; second click closes all.
- **Automated by:** `tests/e2e/accordion.spec.js` › TC-50, TC-52
- **Status:** Pass

### TC-53: FAQ
- **Acceptance criterion:** AC-12
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** EN-§27 questions
- **Steps:**
  1. Read the 5 questions, check all closed, open two in turn.
- **Expected result:** exact questions, all closed on load, one open at a time.
- **Automated by:** `tests/e2e/accordion.spec.js` › `TC-53 (AC-12): the FAQ has the 5 exact questions, all closed, one open at a time`
- **Status:** Pass

### TC-213: EN anchors
- **Acceptance criterion:** AC-13
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Look up `#top`, `#diagnostic`, `#ebooks`, the logo href and the old pt-BR ids.
- **Expected result:** new ids exist, logo links to `#top`, no `topo`, `diagnostico` or `aulas`.
- **Automated by:** `tests/e2e/english.spec.js` › `TC-213 (AC-13): the EN anchors exist, the logo links to #top and the pt-BR anchors are gone`
- **Status:** Pass

### TC-214: no horizontal scroll and no cut text at every width, page and result
- **Acceptance criterion:** AC-14
- **Priority:** high
- **Type:** boundary
- **Preconditions:** page loaded, fonts ready
- **Test data:** widths 320, 390, 620, 621, 900, 901, 1280, 1920 (height 900); result with answers 0,1,2,0,1,2,0
- **Steps:**
  1. Check the page: no `scrollWidth > clientWidth`, no text element outside the viewport, no element that clips (`overflow` not visible, ellipsis, line clamp) with content larger than its box.
  2. Open each ebook and FAQ item in turn and run the same check on it.
  3. Reach the result and run the check on the phone screen.
- **Expected result:** no problem found at any width.
- **Automated by:** `tests/e2e/layout-en.spec.js` › `TC-214 (AC-14): no horizontal scroll and no cut text on the page and the result at <width>px`
- **Status:** Pass. The check was proven to fail when `.acc-panel p` is forced to clip (mutation run, not committed).

### TC-215: EBOOK NN stays on one line at 320px
- **Acceptance criterion:** AC-14
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** result screen at 320×800
- **Test data:** answers 0,1,2,0,1,2,0
- **Steps:**
  1. Measure the height of each `.area-ebook`.
- **Expected result:** each under 24px (one line), no horizontal scroll.
- **Automated by:** `tests/e2e/layout-en.spec.js` › `TC-215 (AC-14): result rows keep EBOOK NN on one line at 320px`
- **Status:** Pass

### TC-121, TC-113, TC-116: contrast and coverage with the English copy
- **Acceptance criterion:** AC-14
- **Priority:** high
- **Type:** accessibility
- **Preconditions:** artwork loaded
- **Test data:** see `docs/test-cases/landing-redesign.md`
- **Steps:**
  1. Run the redesign contrast (pixel and axe) and coverage tests on the English page.
- **Expected result:** all pass.
- **Automated by:** `tests/e2e/contrast.spec.js`, `tests/e2e/background.spec.js`
- **Status:** Pass

### TC-216: formatPriorityList and EN quiz data
- **Acceptance criterion:** AC-15
- **Priority:** medium
- **Type:** functional
- **Preconditions:** none (unit)
- **Test data:** areas Login and session, Payment and checkout
- **Steps:**
  1. Call `formatPriorityList`; read `quiz-data` strings.
- **Expected result:** `Ebook 01 (Login and session), Ebook 02 (Payment and checkout)`; EN-§13 to §18 strings.
- **Automated by:** `tests/unit/scoring.test.js` › `TC-216 (AC-15): formats areas as Ebook NN (Area), comma separated`; `tests/unit/quiz-data.test.js`
- **Status:** Pass

## Not covered

- The pixel contrast test (TC-121) runs at 320, 390, 900, 1280 and 1920, not at 620, 621 and 901; axe runs at 390
  and 1280. The colors and the overlay did not change in this feature, only the text, so the risk is low.
- Text cut by overlap (one element covering another without clipping) is not detected by TC-214.
- Wording quality of the English copy: Herbert reviews it in the PR (spec assumption 1).
