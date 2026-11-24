# Test report: landing-redesign

## Retest at `0036af0` (2026-11-24)

- Verdict: **PASS**
- #1 (review blocker): Body text over the cave artwork falls below WCAG AA contrast (FR-8): **verified fixed**. TC-121 (`tests/e2e/contrast.spec.js`, 5 viewports) passes.
- Build pass, unit 41/41, e2e 88/88, no flaky tests.
- Correction to the first run below: the first run passed AC-13 on a visual check only and missed #1, which the Reviewer found by pixel measurement. TC-121 now closes that gap.
- Spec question for the Analyst: the footer is now `rgba(12,13,15,.97)` (`--footer-glass`). FR-9 asks for a translucent footer; .97 is technically translucent but the artwork barely shows. AC-14 does not list the footer, so this is not a defect.

## First run

- Branch: `feature/landing-redesign`, tested at `4f8228f`
- Spec: `docs/specs/landing-redesign.md`
- Test cases: `docs/test-cases/landing-redesign.md`
- Date: 2026-11-24

## Verdict: PASS

## Counts

- Build: pass (`dist/index.html` 72.8 KB, `dist/bg-cave.webp` 94.8 KB)
- Unit (Vitest): 41/41 pass
- End to end (Playwright, desktop + mobile projects): 83/83 pass
- New test cases: 20 (TC-101 to TC-120), 20 pass, 0 fail, 0 blocked
- Flaky tests: none

## Traceability

| AC | TC | Result |
| --- | --- | --- |
| AC-1 | TC-101 | Pass |
| AC-2 | TC-102 | Pass |
| AC-3 | TC-103 | Pass |
| AC-4 | TC-104 | Pass |
| AC-5 | TC-105 | Pass |
| AC-6 | TC-106 | Pass |
| AC-7 | TC-107 | Pass |
| AC-8 | TC-108 | Pass |
| AC-9 | TC-109 | Pass |
| AC-10 | TC-110 | Pass |
| AC-11 | TC-111 | Pass |
| AC-12 | TC-112 | Pass |
| AC-13 | TC-113, TC-120 | Pass |
| AC-14 | TC-114 | Pass |
| AC-15 | TC-115 | Pass |
| AC-16 | TC-116 | Pass |
| AC-17 | TC-117 | Pass |
| AC-18 | TC-118 | Pass |
| AC-19 | TC-119 | Pass |

## Issues opened

None.

## Contrast check on the hero (requested by the Front-End Dev)

axe `color-contrast` reports no violations, but it marks 30 nodes as `incomplete` with `bgGradient` on desktop: the
hero pill, the H1, both hero leads, the CTA box, every conference card row and the final CTA texts. So the automated
AC-13 test does not actually measure those texts. A visual review of the 1280×800 first viewport (TC-120) shows all
hero text clearly readable: the overlay and the glass card keep the lantern glow behind the H1 well below the text.
A pixel-sampling measurement of every text against the artwork was started but could not be completed in this
session (the tool run was blocked), so FR-8 is verified by eye, not by number.

## Code review (`git diff main...HEAD`, background commits)

No defects. Suggestions, not filed:

- `tests/e2e/background.spec.js`: TC-113 passes as long as axe has no violations, even when it cannot judge a node.
  Consider also asserting a ceiling on `incomplete` nodes, or adding a pixel-sampled contrast check, so a lighter
  overlay cannot slip through.
- `src/styles.css`: `--bg-art: url('/bg-cave.webp')` is an absolute path in the source and only becomes `./` through
  Vite's `base: './'`. It works in the build (TC-112), but `npm run dev` from a sub-path would differ. A comment would help.
- `backdrop-filter` has no `-webkit-` prefix; Safari 17 and older fall to the near-solid fallback (`--panel-glass-solid`),
  which is safe but loses the glass look there.
- TC-116 checks overflow and the layer style, not pixels; `cover` guarantees coverage, so this is acceptable.
- Test names for this spec's ACs were renamed to `TC-1nn (AC-n)` so they no longer read like the baseline TC-n (B-AC-n) names.

## Spec issues

- Baseline e2e tests still say `AC-n` in their names while meaning B-AC-n of the baseline spec. Not a defect, but
  readers can confuse them with this spec's AC-n.
