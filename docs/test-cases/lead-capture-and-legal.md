# Test cases: lead-capture-and-legal

Spec: `docs/specs/lead-capture-and-legal.md`. Legal copy: `docs/reference/legal-copy-en.md` (LEGAL-§N).
Test cases are TC-3nn; TC-3nn with nn ≤ 14 verifies AC-nn. MailerLite is always intercepted
(`mockMailerLite`); no test calls the real service.

## Traceability

| AC | Test cases | Status |
| --- | --- | --- |
| AC-1 | TC-301, TC-321, TC-322 | Pass |
| AC-2 | TC-302 (all first, all last) | Pass |
| AC-3 | TC-303 | Pass |
| AC-4 | TC-304 (HTTP 500, abort, 10 s hang) | Pass |
| AC-5 | TC-305, TC-106 | Pass |
| AC-6 | TC-306 | Pass |
| AC-7 | TC-307 (mixed, all 2, all 0, boundaries 4, 5, 9, 10) | Pass |
| AC-8 | TC-308, TC-323 | Pass |
| AC-9 | TC-309 | Pass |
| AC-10 | TC-310 (privacy, terms, refund) | Pass |
| AC-11 | TC-311 (4 pages) | Pass |
| AC-12 | TC-312 | Pass |
| AC-13 | TC-313 (3 legal pages and the email screen × 320, 390, 900, 1280) | Pass |
| AC-14 | TC-314 (full existing suite) | Pass |

### TC-301: a valid submit sends exactly one lead with the right fields
- **Acceptance criterion:** AC-1
- **Priority:** high
- **Type:** functional
- **Preconditions:** test config with IDs `100200` / `300400`; MailerLite mocked
- **Test data:** answers 2,1,0,2,1,0,2 (option indexes 0,1,2,0,1,2,0); `ana@site.com`
- **Steps:**
  1. Complete the quiz and submit the email.
- **Expected result:** one POST to `https://assets.mailerlite.com/jsonp/100200/forms/300400/subscribe` with `fields[email]=ana@site.com`, `fields[quiz_score]=8`, `fields[quiz_band]=Partial base, open gaps`, `fields[quiz_open_areas]=Payment and checkout, Saving and data loss, Main flow, end to end, Errors and edge cases`, `ml-submit=1`, `anticsrf=true`.
- **Automated by:** `tests/e2e/lead.spec.js` › `TC-301 (AC-1): a valid submit sends exactly one lead with email, score, band and open areas`
- **Status:** Pass

### TC-302: score, band and open areas at both extremes
- **Acceptance criterion:** AC-2
- **Priority:** high
- **Type:** boundary
- **Preconditions:** as TC-301
- **Test data:** all first options; all last options
- **Steps:**
  1. Complete the quiz with each data set and submit `ana@site.com`.
- **Expected result:** `14` / `Almost ready, close the gaps` / empty; `0` / `Launch at risk` / the 7 areas in ebook order.
- **Automated by:** `tests/e2e/lead.spec.js` › both `TC-302 (AC-2): ...` tests
- **Status:** Pass

### TC-303: an invalid email sends nothing
- **Acceptance criterion:** AC-3
- **Priority:** high
- **Type:** negative
- **Preconditions:** as TC-301
- **Test data:** invalid email
- **Steps:**
  1. Submit the invalid email.
- **Expected result:** error shown, zero requests.
- **Automated by:** `tests/e2e/lead.spec.js` › `TC-303 (AC-3): an invalid email sends nothing`
- **Status:** Pass

### TC-304: a failing endpoint never blocks or breaks the result
- **Acceptance criterion:** AC-4
- **Priority:** high
- **Type:** negative
- **Preconditions:** MailerLite mocked to return 500, to abort, or to hang
- **Test data:** `ana@site.com`
- **Steps:**
  1. Submit a valid email under each failure mode.
- **Expected result:** result at once, no visible error, no `console.error`, uncaught exception or unhandled rejection from page code.
- **Automated by:** `tests/e2e/lead.spec.js` › `TC-304 (AC-4): with <mode>, the result shows at once and page code logs no error`
- **Status:** Pass

### TC-305: committed empty config sends nothing
- **Acceptance criterion:** AC-5
- **Priority:** high
- **Type:** functional
- **Preconditions:** no test config
- **Test data:** `ana@site.com`
- **Steps:**
  1. Record all requests, submit a valid email.
- **Expected result:** no request, result shown.
- **Automated by:** `tests/e2e/lead.spec.js` › `TC-305 (AC-5): ...`; `tests/e2e/pdf-restore.spec.js` › `TC-106 (AC-6, lead-capture AC-5): ...`
- **Status:** Pass

### TC-306: no MailerLite API key or token anywhere
- **Acceptance criterion:** AC-6
- **Priority:** high
- **Type:** security
- **Preconditions:** build done
- **Test data:** `api_key`, `apiKey`, `Bearer`, `connect.mailerlite.com/api`
- **Steps:**
  1. Search source, `dist/` and the repository.
- **Expected result:** no match.
- **Automated by:** `tests/unit/repository.test.js` › `TC-306 (AC-6): no MailerLite API key or token in the source, the build or the repository`
- **Status:** Pass

### TC-307: buildLead for mixed, extreme and boundary answers
- **Acceptance criterion:** AC-7
- **Priority:** high
- **Type:** boundary
- **Preconditions:** none (unit)
- **Test data:** mixed answers with a padded email; all 2; all 0; totals 4, 5, 9, 10
- **Steps:**
  1. Call `buildLead`.
- **Expected result:** trimmed email; scores and bands per the band limits (4 risk, 5 and 9 partial, 10 top); open areas in ebook order.
- **Automated by:** `tests/unit/scoring.test.js` › `TC-307 (AC-7): ...` and the band boundary cases in `describe('buildLead')`
- **Status:** Pass

### TC-308: consent notice and privacy link above the note
- **Acceptance criterion:** AC-8
- **Priority:** high
- **Type:** functional
- **Preconditions:** email screen
- **Test data:** LEGAL-§1
- **Steps:**
  1. Read the notice, its position and the link attributes.
- **Expected result:** exact LEGAL-§1 text above `Your result appears on screen as soon as you confirm.`; link `Privacy policy` to `privacy.html`, `target="_blank"`, `rel="noopener"`.
- **Automated by:** `tests/e2e/lead.spec.js` › `TC-308 (AC-8): the consent notice and privacy link sit above the note on the email screen`
- **Status:** Pass

### TC-309: dist has the four pages and they load cleanly
- **Acceptance criterion:** AC-9
- **Priority:** high
- **Type:** functional
- **Preconditions:** build done
- **Test data:** none
- **Steps:**
  1. List `dist/`, load each page.
- **Expected result:** `index.html`, `privacy.html`, `terms.html`, `refund.html`, `bg-cave.webp`; no console error, no failed request except fonts.
- **Automated by:** `tests/e2e/legal.spec.js` › `TC-309 (AC-9): ...`
- **Status:** Pass

### TC-310: legal pages have the exact LEGAL copy and links
- **Acceptance criterion:** AC-10
- **Priority:** high
- **Type:** functional
- **Preconditions:** each legal page loaded
- **Test data:** LEGAL-§3 to §6
- **Steps:**
  1. Read `lang`, title, H1, date, every H2 and paragraph, the email link, the logo and back link.
- **Expected result:** all exact; `mailto:herbert.parasio@gmail.com`; logo and back link go to the landing page.
- **Automated by:** `tests/e2e/legal.spec.js` › `TC-310 (AC-10): <file> has the exact LEGAL copy, mailto links and links back to the landing page`
- **Status:** Pass

### TC-311: every footer links to the three legal pages
- **Acceptance criterion:** AC-11
- **Priority:** medium
- **Type:** functional
- **Preconditions:** each of the 4 pages loaded
- **Test data:** none
- **Steps:**
  1. Click each footer link.
- **Expected result:** `Terms of service`, `Refund policy`, `Privacy policy` open the right page.
- **Automated by:** `tests/e2e/legal.spec.js` › `TC-311 (AC-11): the footer of <path> links to the three legal pages`
- **Status:** Pass

### TC-312: content rules on all pages and quiz screens
- **Acceptance criterion:** AC-12
- **Priority:** medium
- **Type:** negative
- **Preconditions:** all pages and quiz screens
- **Test data:** `—`, `–`, `’`, waitlist wording, `$`, `herbert.parasio@gmail.com`
- **Steps:**
  1. Search text and attributes.
- **Expected result:** none, except `COST: $0 in lost customers`; the email is absent from the landing page (also checked in `dist/index.html`: 0 matches).
- **Automated by:** `tests/e2e/legal.spec.js` › `TC-312 (AC-12): ...`
- **Status:** Pass

### TC-313: layout and contrast of the legal pages and the email screen
- **Acceptance criterion:** AC-13
- **Priority:** high
- **Type:** accessibility / boundary
- **Preconditions:** none
- **Test data:** widths 320, 390, 900, 1280
- **Steps:**
  1. For each legal page: check horizontal overflow, run axe `color-contrast` and the pixel contrast measurement.
  2. For the email screen: check overflow, that the notice fits, and contrast.
- **Expected result:** no overflow, no contrast failure.
- **Automated by:** `tests/e2e/legal-layout.spec.js` › `TC-313 (AC-13): ...` (16 tests)
- **Status:** Pass

### TC-314: existing suites still pass
- **Acceptance criterion:** AC-14
- **Priority:** high
- **Type:** functional
- **Preconditions:** build done
- **Test data:** none
- **Steps:**
  1. Run `npm test` and `npx playwright test`.
- **Expected result:** all pass; the old "no request on submit" checks run with the empty config (TC-106).
- **Automated by:** full suite
- **Status:** Pass

### TC-321: a fast double submit sends one lead
- **Acceptance criterion:** AC-1 (exploratory)
- **Priority:** medium
- **Type:** negative
- **Preconditions:** as TC-301
- **Test data:** `ana@site.com`, double click on `Show my diagnostic`
- **Steps:**
  1. Double-click the submit button.
- **Expected result:** result shown, exactly one request.
- **Automated by:** `tests/e2e/lead-explore.spec.js` › `TC-321 (AC-1): a fast double submit still sends exactly one lead`
- **Status:** Pass

### TC-322: padded email with special characters
- **Acceptance criterion:** AC-1 (exploratory)
- **Priority:** medium
- **Type:** boundary / security
- **Preconditions:** as TC-301
- **Test data:** `  ana+test&x=1@site.com  `
- **Steps:**
  1. Submit and read `fields[email]` from the body.
- **Expected result:** `ana+test&x=1@site.com` exactly (trimmed; `+`, `&`, `=` not breaking the form encoding).
- **Automated by:** `tests/e2e/lead-explore.spec.js` › `TC-322 (AC-1): surrounding spaces are trimmed and special characters survive the form encoding`
- **Status:** Pass

### TC-323: the privacy link does not lose the quiz
- **Acceptance criterion:** AC-8 (exploratory)
- **Priority:** medium
- **Type:** functional / security
- **Preconditions:** email screen with an email typed
- **Test data:** `ana@site.com`
- **Steps:**
  1. Click `Privacy policy` in the modal.
- **Expected result:** privacy page opens in a new tab with no `window.opener`; the quiz keeps the typed email.
- **Automated by:** `tests/e2e/lead-explore.spec.js` › `TC-323 (AC-8): opening the privacy link keeps the quiz on the email screen`
- **Status:** Pass

## Not covered

- The real MailerLite endpoint and field names (spec: tests never call the service). Herbert should submit once
  after the IDs are set and check the subscriber in MailerLite.
- The 8 s client timeout is tested with a hang longer than the result check, not by waiting the full 8 s.
- Retaking the diagnostic and submitting again sends a second lead; the spec does not say otherwise.
