# Test report: english-ebooks

- Branch: `feature/english-ebooks`, tested at `bb2df49`
- Spec: `docs/specs/english-ebooks.md`
- Test cases: `docs/test-cases/english-ebooks.md`
- Date: 2026-11-24

## Verdict: PASS

## Counts

- Build: pass
- Unit (Vitest): 41/41 pass
- End to end (Playwright, desktop + mobile): 103/103 pass (95 before QA plus 8 new TC-214 tests)
- Flaky tests: none
- Issues opened: none

## Traceability

| AC | TC | Result |
| --- | --- | --- |
| AC-1 | TC-1 | Pass |
| AC-2 | TC-2 to TC-5, TC-51, TC-54 | Pass |
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
| AC-14 | TC-214, TC-215, TC-121, TC-113, TC-116 | Pass |
| AC-15 | TC-216, quiz-data unit tests | Pass |

## AC-14 verification

The developer's AC-14 test only covered the `EBOOK NN` label at 320px. QA added TC-214, run at all 8 widths of
AC-14: no horizontal scroll, no text outside the viewport and no clipped text, on the page, inside every ebook and
FAQ item (opened in turn) and on the result screen. All 8 pass. A mutation run (forcing `.acc-panel p` to clip)
made TC-214 fail as expected, so the check is real. Contrast: the pixel test (TC-121) and axe (TC-113) pass with the
English copy.

## Code review (`git diff main...HEAD`)

No defects. The JS changes are renames (`lesson` to `ebook`, `onSeeLessons` to `onSeeEbooks`, ids) and copy moved
to `quiz-data.js`; no `innerHTML`, user input still rendered with `textContent`. Suggestions, not filed:

- `CLAUDE.md`, Conventions: still says "The page copy is pt-BR and must be copied letter by letter from the source
  document", which contradicts "The rule" section (English only, from `landing-copy-en.md`).
- `tests/e2e/result.spec.js`: TC-43 and TC-44 names still say "conferido" and "descoberto" and cite baseline
  AC-28/AC-29; their assertions are English and match AC-7/AC-8 of this spec.
- Test names in this repo now mix baseline B-AC numbers and this spec's AC numbers under the same `AC-n` label.
  QA renamed the new tests of this spec to `TC-2nn (AC-n)`.

## Spec issues

None.
