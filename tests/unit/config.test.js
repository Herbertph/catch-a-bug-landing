import { describe, expect, it } from 'vitest';
import * as config from '../../src/config.js';

describe('config', () => {
  it('AC-5: ships both MailerLite IDs empty in the repository', () => {
    expect({ ...config }).toEqual({ MAILERLITE_ACCOUNT_ID: '', MAILERLITE_FORM_ID: '' });
  });
});
