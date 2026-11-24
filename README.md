# catch-a-bug-landing

Landing page for the Unflaky mini course "Teste Antes de Lançar", with a 7-question diagnostic quiz inside a
phone-shaped modal, over a dark gothic cave background. Static page, pt-BR copy, no backend, no lead capture and no
checkout.

- `npm ci` installs dependencies.
- `npm run dev` starts the Vite dev server.
- `npm run build` writes the self-contained `dist/index.html`.
- `npm test` runs the Vitest unit tests.
- `npm run test:e2e` builds and runs the Playwright tests (desktop 1280×800 and mobile 390×844). The first run needs
  `npx playwright install chromium`.

The current spec is [`docs/specs/landing-redesign.md`](docs/specs/landing-redesign.md); the exact copy source is
[`docs/reference/landing-page-source-pt-br.md`](docs/reference/landing-page-source-pt-br.md).
Stack, commands, structure and design tokens are documented in [`CLAUDE.md`](CLAUDE.md).

Status: in development.
