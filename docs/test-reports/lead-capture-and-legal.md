# Test report: lead-capture-and-legal

- Branch: `feature/lead-capture-and-legal`, tested at `ab53c03`
- Spec: `docs/specs/lead-capture-and-legal.md`
- Test cases: `docs/test-cases/lead-capture-and-legal.md`
- Date: 2026-11-24

## Verdict: PASS

## Counts

- Build: pass (4 pages and `bg-cave.webp` in `dist/`)
- Unit (Vitest): 54/54 pass
- End to end (Playwright, desktop + mobile): 140/140 pass (137 before QA plus 3 exploratory tests)
- Flaky tests: none
- Issues opened: none

## Traceability

| AC | TC | Result |
| --- | --- | --- |
| AC-1 | TC-301, TC-321, TC-322 | Pass |
| AC-2 | TC-302 | Pass |
| AC-3 | TC-303 | Pass |
| AC-4 | TC-304 | Pass |
| AC-5 | TC-305, TC-106 | Pass |
| AC-6 | TC-306 | Pass |
| AC-7 | TC-307 | Pass |
| AC-8 | TC-308, TC-323 | Pass |
| AC-9 | TC-309 | Pass |
| AC-10 | TC-310 | Pass |
| AC-11 | TC-311 | Pass |
| AC-12 | TC-312 | Pass |
| AC-13 | TC-313 | Pass |
| AC-14 | TC-314 | Pass |

## Exploratory session

Fast double submit (one lead only), padded email with `+`, `&` and `=` (trimmed and correctly encoded), and the
privacy link from the modal (new tab, no `window.opener`, typed email kept). All pass; added as TC-321 to TC-323.

## Code and security review (`git diff main...HEAD`)

No defects. Checked: user input only through `textContent`; the email is form-encoded with `URLSearchParams`; the
request is `no-cors`, fire and forget, with an abort timeout and every failure swallowed; no API key or token in
source or build; `herbert.parasio@gmail.com` is absent from `dist/index.html`; the privacy link uses
`rel="noopener"`. Suggestions, not filed:

- `src/config.js` reads `window.__TEST_CONFIG__` in production. Only the account and form IDs can be changed and the
  host is fixed, and setting it already requires script execution on the page, so the risk is low. A build-time
  flag (for example `import.meta.env.MODE !== 'production'`) would remove the test hook from the shipped page.
- `src/lead.js` `leadEndpoint` interpolates the IDs without `encodeURIComponent`. Harmless with numeric IDs.
- The public embedded-form endpoint can be called by anyone (bots). Double opt-in, which `CLAUDE.md` asks Herbert to
  turn on, is the mitigation.

## Spec issues

None.
