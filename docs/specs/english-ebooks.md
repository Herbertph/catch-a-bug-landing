# Spec: English page for "Don't Break in Public", a series of 7 ebooks

- Status: ready for development
- Branch: `feature/english-ebooks`
- Builds on: `docs/specs/landing-redesign.md` (merged in PR #2) and the baseline spec
  `docs/reference/baseline-spec-curso-qa.md` (B-AC-n). Their layout, visual, quiz, modal, accessibility and
  responsive rules still apply.
- **New copy source of truth:** `docs/reference/landing-copy-en.md` (EN-§N). It replaces the pt-BR texts of
  `docs/reference/landing-page-source-pt-br.md`. That file still rules structure, measurements, colors and behavior.

## Context

Herbert will sell this product to an English-speaking audience (2026-11-24). Two facts change the page:

1. The page is in **English only**.
2. The product is **"Don't Break in Public"**, a series of **7 ebooks**, one for each test area of the diagnostic. It
   is not a course and there are no lessons. Lesson 00, the introduction, has no ebook, so it is removed.

## Scope

### In scope
- Every visible text, `title`, `aria-label`, placeholder and quiz string replaced by the English copy of
  `landing-copy-en.md`. `lang="en"`.
- Lessons become ebooks: 7 accordion items, the result rows show `EBOOK NN`, and the priority list uses
  `Ebook NN (Area name)`.
- Anchors renamed: `#top`, `#diagnostic`, `#ebooks`.
- Tests, test helpers and `CLAUDE.md` updated to the English copy and the ebook structure.

### Out of scope
- A language switcher or keeping the pt-BR version (it stays in `curso-qa`).
- Price, checkout (Paddle), e-mail capture: still none, as in the PDF.
- Any layout, color, background or behavior change other than what the ebook structure needs.
- Renaming CSS classes or JS identifiers that are not visible (for example `lesson` in `quiz-data.js` may become
  `ebook`, but it is not required).

## Functional requirements

- **FR-1 English copy.** Every text listed in `landing-copy-en.md` appears on the page exactly, letter by letter,
  including the straight apostrophe `'`. No pt-BR text remains anywhere on the page, in attributes or in quiz screens.
- **FR-2 Language and title.** `<html lang="en">`, tab title per EN-§2.
- **FR-3 Seven ebooks.** The content section (`#ebooks`) has 7 accordion items, Ebook 01 to Ebook 07, with the
  title, subtitle, body and tags of EN-§21 to §23. Ebook 01 is open on load. Only one item is open at a time, and
  `aria-expanded` stays in sync (same behavior as B-AC-34 and B-AC-35, with 7 items and Ebook 01 open by default).
  The first tag of each ebook is the gold one.
- **FR-4 Quiz in English.** Questions, hints, options, counters, buttons, email screen, error, bands, status labels
  (`checked`, `partial`, `uncovered`), area rows with `EBOOK NN`, priority paragraph and result buttons per EN-§13 to
  §18. The `See the ebooks` button closes the modal and scrolls to `#ebooks`.
- **FR-5 Scoring unchanged.** Points (2/1/0), total 0 to 14, band limits (0 to 4, 5 to 9, 10 to 14), status mapping,
  the priority rule (fewer than 2 points) and the email regex are unchanged. Only the strings change.
  `formatPriorityList` outputs `Ebook NN (Area name)` joined by `, `.
- **FR-6 Anchors.** Main content `#top` (logo link target), diagnostic section `#diagnostic`, ebooks section `#ebooks`.
- **FR-7 Content rules.** No em dash, no en dash and no curly apostrophe in page text or attributes. No waitlist
  wording in English (`waitlist`, `wait list`, `notify me`, `join the list`, `reserve your spot`, `early access`).
  No pt-BR words such as `aula`, `curso`, `diagnóstico`, `Fazer`.
- **FR-8 Layout holds.** English strings are shorter or longer than pt-BR ones. The layout must still pass the
  no-overflow, no-cut-text and contrast checks at every breakpoint (B-AC-37, AC-13 and AC-16 of the redesign).

## Acceptance criteria

All baseline and redesign criteria still apply with the English copy in place of the pt-BR copy. Where a test
asserts a pt-BR string, it asserts the EN equivalent. The criteria below are new or replace older ones.

- **AC-1** Given the page loads, then `<html lang="en">` and the tab title is
  `Don't Break in Public, the ebook series for AI-built SaaS`.
- **AC-2** Given the page loads, when I compare every text of `landing-copy-en.md` with the rendered page (sections,
  card, proof strip, FAQ answers after opening, ebook bodies after opening, footer, attributes), then each one is
  present exactly.
- **AC-3** Given the page and every quiz screen (7 questions, email screen, error, result for scores 0, 7 and 14),
  when I search the text and attributes, then none of these appear: `—`, `–`, `’`, `aula`, `curso`, `Fazer o
  diagnóstico`, `diagnóstico`, `você`, `waitlist`, `notify me`, `reserve your spot`, `early access`, `lesson`,
  `course`.
- **AC-4** Given any `Take the diagnostic` button (header, hero, diagnostic section, final CTA, mobile bar), when I
  click it, then the modal opens on question 1 showing `AREA 1 OF 7, LOGIN AND SESSION`, `Question 1 of 7` and the
  EN question and hint (replaces B-AC-8, B-AC-9, B-AC-16 strings).
- **AC-5** Given question 7 with an option selected, then the primary button reads `See what's missing`, and
  clicking it shows the email screen.
- **AC-6** Given the email screen, when I submit `ana@`, then the error
  `Please check the email you typed, something seems to be missing.` shows and focus returns to the field; with
  `ana@site.com` the result shows at once, with no network request.
- **AC-7** Given all first options, then the result shows `14` `/14`, the band `Almost ready, close the gaps`, all 7
  rows `checked`, and the paragraph starting `No uncovered areas.`
- **AC-8** Given all last options, then the result shows `0` `/14`, the band `Launch at risk`, all 7 rows
  `uncovered`, and the paragraph `Your priority ebooks: Ebook 01 (Login and session), Ebook 02 (Payment and
  checkout), Ebook 03 (Saving and data loss), Ebook 04 (Permissions and access), Ebook 05 (Main flow, end to end),
  Ebook 06 (Errors and edge cases), Ebook 07 (Mobile and browsers). These are exactly ...`
- **AC-9** Given answers 2,1,0,2,1,0,2, then the rows show checked, partial, uncovered, checked, partial, uncovered,
  checked, each with `EBOOK 01` to `EBOOK 07` on the right, the band is `Partial base, open gaps` (score 8), and the
  priority list is exactly `Ebook 02 (Payment and checkout), Ebook 03 (Saving and data loss), Ebook 05 (Main flow,
  end to end), Ebook 06 (Errors and edge cases)`.
- **AC-10** Given the result screen, when I click `See the ebooks`, then the modal closes and the `#ebooks` section is
  in view. When I click `Retake the diagnostic`, the modal stays open on question 1 with no answer selected.
- **AC-11** Given the page loads, then the ebooks accordion has exactly 7 items (`01` to `07`) with the EN titles and
  subtitles, Ebook 01 is open (`aria-expanded="true"`) and the other 6 are closed. Opening Ebook 04 closes Ebook 01;
  clicking Ebook 04 again closes it. There is no introduction item.
- **AC-12** Given the FAQ, then it has the 5 EN questions of EN-§27, all closed on load, and one open at a time.
- **AC-13** Given the page, then the elements with `id="top"`, `id="diagnostic"` and `id="ebooks"` exist, the logo
  links to `#top`, and no element has `id="topo"`, `id="diagnostico"` or `id="aulas"`.
- **AC-14** Given widths 320, 390, 620, 621, 900, 901, 1280 and 1920px, then there is no horizontal scroll, no text
  is cut, and the automated contrast checks stay clean with the English copy.
- **AC-15** Given unit tests, then `formatPriorityList` returns `Ebook 01 (Login and session), Ebook 02 (Payment and
  checkout)` for those two areas, and `quiz-data` exposes the EN strings of EN-§13 to §18 (questions, hints, options,
  bands, status labels).

## Assumptions to confirm (Herbert)

1. **English copy.** The analyst wrote `docs/reference/landing-copy-en.md` as natural US English, not a word-for-word
   translation. Herbert reviews it in the PR. Any wording change is a one-line fix.
2. **Product name capitalization:** `Don't Break in Public` (title case).
3. **The introduction lesson is gone.** The 7 ebooks match the 7 diagnostic areas. Ebook 07 keeps the release
   checklist ("Mobile, browsers and the launch").
4. **Check card badge:** `AO VIVO NA AULA` (live in class) has no ebook equivalent, so it becomes
   `STRAIGHT FROM THE EBOOKS`.
5. **Currency:** `COST: $0 in lost customers` (US dollars, no conversion needed for zero).
6. **The ebooks' language** is not mentioned on the page, so it does not block this work.

## Technical notes

- Copy lives in `index.html` (static sections) and `src/quiz-data.js` (quiz and result). `src/scoring.js`
  (`formatPriorityList`) and `src/quiz.js` (`AULA ${entry.lesson}`) build two strings that must become
  `Ebook NN (...)` and `EBOOK NN`. `src/main.js` scrolls to `aulas`, which becomes `ebooks`.
- The course accordion loses the `aula-00` item; panel ids can become `ebook-01` to `ebook-07`. Check the accordion
  init still opens the first item by default.
- Tests: every pt-BR string assertion in `tests/unit` and `tests/e2e` moves to EN. The redesign's
  `pdf-restore.spec.js` forbidden-word list is extended with the EN waitlist terms. Keep test IDs and names.
- `CLAUDE.md`: update "The rule: follow the PDF" to say copy comes from `landing-copy-en.md` and structure and behavior
  from the PDF.

### Ordered tasks
1. **Senior Dev:** `quiz-data.js`, `scoring.js` and `quiz.js` strings to EN and ebooks; unit tests (AC-15).
2. **Senior Dev:** `index.html` copy, `lang`, title, attributes, anchors, 7-item accordion; `main.js` scroll target.
3. **Senior Dev:** update every e2e assertion to EN; add AC-1 to AC-13; update `CLAUDE.md`.
4. **Front-End Dev:** visual pass with the new strings at every breakpoint (AC-14): headings, the proof strip,
   buttons, the check card, result rows with `EBOOK NN`, the mobile bar. Fix any wrapping or overflow without
   changing the copy.
