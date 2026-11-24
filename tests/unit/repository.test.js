import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );

describe('TC-119 (AC-19): lead capture, checkout and privacy page are gone', () => {
  it('has no lead, checkout or privacy modules and no privacy build config', () => {
    for (const file of ['src/lead.js', 'src/checkout.js', 'src/privacy.js', 'vite.privacy.config.js']) {
      expect(existsSync(file), file).toBe(false);
    }
  });

  it('has no test that references MailerLite, the checkout or the privacy page', () => {
    // These two files assert the absence of those terms, so they name them.
    const guards = [join('tests', 'unit', 'repository.test.js'), join('tests', 'e2e', 'pdf-restore.spec.js')];
    for (const file of files('tests').filter((name) => !guards.includes(name))) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/mailerlite|checkout\.js|CHECKOUT_URL|privacidade|privacy/i);
    }
  });
});
