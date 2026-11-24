# Review: landing-redesign

- **Verdict:** APPROVED
- **Commit reviewed:** a1788b8 (first review at b05b0b9: CHANGES REQUESTED, #1)
- **Spec:** docs/specs/landing-redesign.md
- **Build and tests (run by the reviewer at a1788b8):** `npm run build` → ok (`dist/index.html` 72.8 KB, `dist/bg-cave.webp` 94.8 KB); `npm test` → 41/41 pass; `npm run test:e2e` → 88/88 pass. TC-121 was also run against the `b05b0b9` styles in a separate worktree, where it fails as expected.
- **QA report:** agrees with my run.

## Requirements coverage
| AC | Implemented in | Tested by | Status |
| --- | --- | --- | --- |
| AC-1 | `package.json` build, `public/bg-cave.webp` | TC-101, TC-112 | OK |
| AC-2 | `index.html`, `src/quiz.js`, `src/quiz-data.js` | TC-102 | OK |
| AC-3 | `index.html` FAQ 3 | TC-103 | OK |
| AC-4 | `index.html` footer | TC-104 | OK |
| AC-5 | `src/quiz.js` e-mail screen | TC-105 | OK |
| AC-6 | `src/quiz.js` (no `sendLead`) | TC-106 | OK |
| AC-7 | `src/quiz.js` result actions | TC-107 | OK |
| AC-8 | `index.html` `#aulas` | TC-108 | OK |
| AC-9 | `src/styles.css` `body::before` | TC-109 | OK |
| AC-10 | `src/styles.css` `body::before` | TC-110 | OK |
| AC-11 | `body` `--bg` fallback | TC-111 | OK |
| AC-12 | `public/bg-cave.webp`, `vite.config.js` `base: './'` | TC-112 | OK |
| AC-13 / FR-8 | `--bg-overlay`, glass tokens, `--footer-glass` | TC-113 (axe), TC-121 (pixels, 5 viewports) | OK |
| AC-14 | glass tokens in `src/styles.css` | TC-114 | OK (footer not listed in AC-14, see R-2) |
| AC-15 | modal styles unchanged | TC-115 | OK |
| AC-16 | `body::before` `cover` | TC-116 | OK (style check, not pixels) |
| AC-17 | no animation added | TC-117 | OK |
| AC-18 | `.github/workflows/ci.yml` | TC-118, local run | OK |
| AC-19 | removed modules | TC-119 | OK |

## Blockers
- R-1 (#1): Body text over the cave artwork fell below WCAG AA contrast (FR-8). Verified fixed in `0036af0`, and TC-121 covers it.

## Should fix
- R-2 (spec question): the footer is `rgba(12,13,15,.97)` (`--footer-glass`), while FR-9 asks for a translucent footer, so the artwork barely shows there. `src/styles.css:47`, `src/styles.css:991`. The Analyst and Herbert should decide whether .97 is acceptable or the footer text color must change instead.
- R-3 (spec question): `.cta-note` moved from `--muted2` to `--muted` to reach AA. The PDF names `--muted2` for that note (`docs/reference/landing-page-source-pt-br.md:149`). This is a deliberate deviation from the PDF that needs Herbert's approval. `--muted2` fails AA on `--panel` even without the artwork.

## Suggestions
- R-4: `--bg-art: url('/bg-cave.webp')` is root-absolute in the source and becomes relative only through Vite's `base: './'`. Writing `./bg-cave.webp` would make dev and build match. `src/styles.css:42`
- R-5: There is no `-webkit-backdrop-filter`, so Safari 17 and older get the near-solid fallback. `src/styles.css`, `@supports` block
- R-6: TC-121 takes about 1 minute per project. If CI time matters, run it only in the desktop project, because it sets its own viewports. `tests/e2e/contrast.spec.js:124`

## Not reviewed
- WebP banding (FR-11) beyond one mobile screenshot, and real Safari/iOS behavior (only Chromium was run).
- The imported baseline (`5bef08a`, a copy of `curso-qa@5b45243`) was not re-reviewed line by line. The review covered `b842923` onward.
