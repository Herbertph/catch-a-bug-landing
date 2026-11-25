# catch-a-bug-landing

English landing page for "Don't Break in Public", a series of 7 ebooks by Unflaky, with a 7-question diagnostic
quiz inside a phone-shaped modal, over a dark gothic cave background. Static site, no backend and no
checkout yet. The diagnostic email goes to MailerLite (IDs in `src/config.js`, empty until set), and
`privacy.html`, `terms.html` and `refund.html` hold the legal pages.

- `npm ci` installs dependencies.
- `npm run dev` starts the Vite dev server.
- `npm run build` writes the four self-contained pages and the background image to `dist/`.
- `npm test` runs the Vitest unit tests.
- `npm run test:e2e` builds and runs the Playwright tests (desktop 1280×800 and mobile 390×844). The first run needs
  `npx playwright install chromium`.

The current spec is [`docs/specs/lead-capture-and-legal.md`](docs/specs/lead-capture-and-legal.md); the exact copy
sources are [`docs/reference/landing-copy-en.md`](docs/reference/landing-copy-en.md) and
[`docs/reference/legal-copy-en.md`](docs/reference/legal-copy-en.md). Structure and behavior follow the PDF
transcription in [`docs/reference/landing-page-source-pt-br.md`](docs/reference/landing-page-source-pt-br.md).
Stack, commands, structure and design tokens are documented in [`CLAUDE.md`](CLAUDE.md).

Status: in development.
