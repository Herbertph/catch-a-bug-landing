// vite-plugin-singlefile cannot inline a chunk shared by several entries, so each page is its own build
// into the same dist/ (the first one empties it).
import { build } from 'vite';

const PAGES = ['index.html', 'privacy.html', 'terms.html', 'refund.html'];

for (const [index, page] of PAGES.entries()) {
  await build({
    logLevel: 'warn',
    build: { emptyOutDir: index === 0, rollupOptions: { input: page } },
  });
}
