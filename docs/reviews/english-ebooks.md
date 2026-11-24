# Review: english-ebooks

- **Verdict:** APPROVED
- **Commit reviewed:** d32efb0
- **Spec:** docs/specs/english-ebooks.md (copy: docs/reference/landing-copy-en.md)
- **Build and tests (run by the reviewer):** `npm ci` → ok; `npm run build` → ok; `npm test` → 41/41 pass; `npm run test:e2e` → 103/103 pass. Two independent checks on the built page: (1) every code span of `landing-copy-en.md` (256) was searched in the rendered page (all panels unhidden, text and attributes) and in `src/quiz-data.js`. The only spans not found are notation (`N`, `<Area name>`, `EBOOK NN`, anchors, forbidden characters) or strings composed at runtime, and those composed strings matched the copy exactly on the 0 and 14 results. (2) At 320px with a 66-character email, the result screen has no overflow.
- **QA report:** agrees with my run. Its header names `bb2df49`, while TC-214 was added in `d32efb0` (see R-3).

## Requirements coverage
| AC | Implemented in | Tested by | Status |
| --- | --- | --- | --- |
| AC-1 | `index.html` `lang`, `<title>` | TC-1 | OK |
| AC-2 | `index.html`, `src/quiz-data.js` | TC-2 to TC-5, TC-51, TC-54 (+ reviewer span check) | OK |
| AC-3 | whole page and quiz | TC-203, TC-6 | OK |
| AC-4 | `src/quiz-data.js` `QUESTIONS_COPY`, `AREAS` | TC-204 | OK |
| AC-5 | `QUESTIONS_COPY.last` | TC-205 | OK |
| AC-6 | `EMAIL_COPY.error`, `src/quiz.js` | TC-206 | OK |
| AC-7 | `BANDS`, `RESULT_COPY.none*` | TC-43 | OK |
| AC-8 | `formatPriorityList`, `RESULT_COPY.priority*` | TC-44 | OK |
| AC-9 | `src/quiz.js` area rows, `src/scoring.js` | TC-209, TC-47 | OK |
| AC-10 | `src/main.js` `onSeeEbooks` → `#ebooks` | TC-48, TC-49 | OK |
| AC-11 | `index.html` 7-item accordion | TC-50, TC-52 | OK |
| AC-12 | `index.html` FAQ | TC-53 | OK |
| AC-13 | `index.html` ids, logo `href="#top"` | TC-213 | OK |
| AC-14 | `src/styles.css` `.area-ebook { white-space: nowrap }` | TC-214 (8 widths), TC-215, TC-121, TC-113, TC-116 | OK |
| AC-15 | `src/scoring.js`, `src/quiz-data.js` | TC-216, `tests/unit/quiz-data.test.js` | OK |

## Blockers
None.

## Should fix
- R-1: `CLAUDE.md:111` (Conventions) still says "The page copy is pt-BR and must be copied letter by letter from the source document". That contradicts "The rule" at the top of the same file. Agents read this file, so the contradiction can send the next change back to pt-BR copy.
- R-2: `README.md:3-4` still describes the "Teste Antes de Lançar" mini course with "pt-BR copy". It is the public description of the repository.

## Suggestions
- R-3: The QA report header (`docs/test-reports/english-ebooks.md:3`) should name the commit the counts come from (`d32efb0`, not `bb2df49`).
- R-4: TC-43 and TC-44 names still say "conferido" and "descoberto" (`tests/e2e/result.spec.js:6`, `:24`).
- R-5: The quiz options group `aria-label` (`Answers`, `src/quiz-data.js` `QUESTIONS_COPY.optionsLabel`) is not in `landing-copy-en.md` and no test asserts it. Add it to the copy file so the source of truth stays complete.

## Not reviewed
- Wording quality of the English copy itself: Herbert reviews it in the PR (spec assumption 1).
- Real Safari/iOS behavior (only Chromium was run).
