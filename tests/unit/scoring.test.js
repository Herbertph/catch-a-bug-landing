import { describe, expect, it } from 'vitest';
import {
  buildLead,
  bandFor,
  formatPriorityList,
  isValidEmail,
  pointsFor,
  priorityAreas,
  statusFor,
  totalScore,
} from '../../src/scoring.js';

const all = (points) => Array(7).fill(points);

describe('totalScore', () => {
  it('sums the 7 answers, 0 to 14', () => {
    expect(totalScore(all(2))).toBe(14);
    expect(totalScore(all(0))).toBe(0);
    expect(totalScore([2, 1, 0, 2, 1, 0, 2])).toBe(8);
  });

  it('counts an unanswered question as zero', () => {
    expect(totalScore([2, null, 1, undefined, 2, 2, 2])).toBe(9);
  });
});

describe('pointsFor', () => {
  it('maps option order to 2, 1 and 0 points', () => {
    expect(pointsFor(0)).toBe(2);
    expect(pointsFor(1)).toBe(1);
    expect(pointsFor(2)).toBe(0);
  });
});

describe('bandFor', () => {
  it.each([
    [0, 'Launch at risk'],
    [4, 'Launch at risk'],
    [5, 'Partial base, open gaps'],
    [9, 'Partial base, open gaps'],
    [10, 'Almost ready, close the gaps'],
    [14, 'Almost ready, close the gaps'],
  ])('score %i belongs to "%s"', (score, title) => {
    expect(bandFor(score).title).toBe(title);
  });
});

describe('statusFor', () => {
  it('maps 2, 1 and 0 points to the three statuses', () => {
    expect(statusFor(2)).toEqual({ label: 'checked', icon: 'check' });
    expect(statusFor(1)).toEqual({ label: 'partial', icon: 'dot' });
    expect(statusFor(0)).toEqual({ label: 'uncovered', icon: 'x' });
  });
});

describe('priorityAreas', () => {
  it('returns no area when every answer has 2 points', () => {
    expect(priorityAreas(all(2))).toEqual([]);
  });

  it('lists every area below 2 points in ebook order', () => {
    const areas = priorityAreas(all(0));
    expect(areas).toHaveLength(7);
    expect(areas[0]).toEqual({ ebook: '01', area: 'Login and session' });
    expect(areas[6]).toEqual({ ebook: '07', area: 'Mobile and browsers' });
  });

  it('includes partial answers and keeps question order', () => {
    const areas = priorityAreas([2, 1, 0, 2, 1, 0, 2]);
    expect(areas.map((item) => item.ebook)).toEqual(['02', '03', '05', '06']);
  });
});

describe('formatPriorityList', () => {
  it('TC-216 (AC-15): formats areas as Ebook NN (Area), comma separated', () => {
    expect(
      formatPriorityList([
        { ebook: '01', area: 'Login and session' },
        { ebook: '02', area: 'Payment and checkout' },
      ]),
    ).toBe('Ebook 01 (Login and session), Ebook 02 (Payment and checkout)');
  });

  it('returns an empty string for no areas', () => {
    expect(formatPriorityList([])).toBe('');
  });
});

describe('isValidEmail', () => {
  it.each(['ana@site.com', 'a.b+c@sub.dominio.com.br'])('accepts %s', (value) => {
    expect(isValidEmail(value)).toBe(true);
  });

  it.each([
    '',
    '   ',
    'ana',
    'ana@',
    '@site.com',
    'ana@site',
    'ana@site.c',
    'ana silva@site.com',
    'ana@@site.com',
  ])('rejects %j', (value) => {
    expect(isValidEmail(value)).toBe(false);
  });
});

describe('buildLead', () => {
  it('TC-307 (AC-7): trims the email and returns score, band and open areas for mixed answers', () => {
    expect(buildLead('  ana@site.com  ', [2, 1, 0, 2, 1, 0, 2])).toEqual({
      email: 'ana@site.com',
      quiz_score: 8,
      quiz_band: 'Partial base, open gaps',
      quiz_open_areas: 'Payment and checkout, Saving and data loss, Main flow, end to end, Errors and edge cases',
    });
  });

  it('TC-307 (AC-7): all 2 points give 14, the top band and no open areas', () => {
    expect(buildLead('ana@site.com', Array(7).fill(2))).toMatchObject({
      quiz_score: 14,
      quiz_band: 'Almost ready, close the gaps',
      quiz_open_areas: '',
    });
  });

  it('TC-307 (AC-7): all 0 points give 0, the risk band and the 7 areas in ebook order', () => {
    expect(buildLead('ana@site.com', Array(7).fill(0))).toMatchObject({
      quiz_score: 0,
      quiz_band: 'Launch at risk',
      quiz_open_areas:
        'Login and session, Payment and checkout, Saving and data loss, Permissions and access, Main flow, end to end, Errors and edge cases, Mobile and browsers',
    });
  });

  it.each([
    [[2, 2, 0, 0, 0, 0, 0], 4, 'Launch at risk'],
    [[2, 2, 1, 0, 0, 0, 0], 5, 'Partial base, open gaps'],
    [[2, 2, 2, 2, 1, 0, 0], 9, 'Partial base, open gaps'],
    [[2, 2, 2, 2, 2, 0, 0], 10, 'Almost ready, close the gaps'],
  ])('AC-7: band boundary %j gives score %i and "%s"', (answers, score, band) => {
    expect(buildLead('ana@site.com', answers)).toMatchObject({ quiz_score: score, quiz_band: band });
  });
});
