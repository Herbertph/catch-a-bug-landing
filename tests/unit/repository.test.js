import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SKIP = new Set(['node_modules', '.git', 'docs', 'test-results', 'playwright-report']);
const SELF = join('tests', 'unit', 'repository.test.js');

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });

const isText = (path) => /\.(js|json|html|css|md|yml)$/.test(path);

describe('repository guard', () => {
  it('has no checkout module yet (Paddle comes in its own spec)', () => {
    expect(existsSync('src/checkout.js')).toBe(false);
  });

  it('TC-306 (AC-6): no MailerLite API key or token in the source, the build or the repository', () => {
    // docs/ is skipped because the specs name these patterns to forbid them.
    const all = files('.').filter((path) => isText(path) && path !== SELF);
    for (const path of all) {
      expect(readFileSync(path, 'utf8'), path).not.toMatch(/api_key|apiKey|Bearer|connect\.mailerlite\.com\/api/);
    }
  });
});
