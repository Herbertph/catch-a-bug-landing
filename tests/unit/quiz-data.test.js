import { describe, expect, it } from 'vitest';
import { AREAS, BANDS, EMAIL_COPY, OPTIONS, QUESTIONS_COPY, RESULT_COPY, STATUS } from '../../src/quiz-data.js';

const strings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
};

describe('quiz data', () => {
  it('has the 7 areas with their ebook numbers, questions and hints', () => {
    expect(AREAS).toHaveLength(7);
    expect(AREAS.map((entry) => entry.ebook)).toEqual(['01', '02', '03', '04', '05', '06', '07']);
    for (const entry of AREAS) {
      expect(entry.area.length).toBeGreaterThan(0);
      expect(entry.question.length).toBeGreaterThan(0);
      expect(entry.hint.length).toBeGreaterThan(0);
    }
  });

  it('has the 3 options in order with 2, 1 and 0 points', () => {
    expect(OPTIONS.map((option) => option.label)).toEqual([
      "Yes, I've really tested this",
      'I only tested the normal path, no errors',
      "I've never tested this",
    ]);
    expect(OPTIONS.map((option) => option.points)).toEqual([2, 1, 0]);
  });

  it('has the 3 bands with exact limits', () => {
    expect(BANDS.map(({ min, max }) => [min, max])).toEqual([
      [0, 4],
      [5, 9],
      [10, 14],
    ]);
    expect(BANDS.map((band) => band.title)).toEqual([
      'Launch at risk',
      'Partial base, open gaps',
      'Almost ready, close the gaps',
    ]);
  });

  it('uses the three status labels in lowercase', () => {
    expect(STATUS[2].label).toBe('checked');
    expect(STATUS[1].label).toBe('partial');
    expect(STATUS[0].label).toBe('uncovered');
  });

  it('has the exact quiz, e-mail and result strings', () => {
    expect(QUESTIONS_COPY.counter(3)).toBe('Question 3 of 7');
    expect(QUESTIONS_COPY.last).toBe("See what's missing");
    expect(EMAIL_COPY.error).toBe('Please check the email you typed, something seems to be missing.');
    expect(EMAIL_COPY.label).toBe('Your email to see the diagnostic');
    expect(RESULT_COPY.priorityIntro).toBe('Your priority ebooks');
    expect(RESULT_COPY.redoButton).toBe('Retake the diagnostic');
  });

  it('never uses an em dash or an en dash', () => {
    const all = strings([AREAS, BANDS, OPTIONS, STATUS, EMAIL_COPY, RESULT_COPY]);
    for (const text of all) {
      expect(text).not.toMatch(/[\u2013\u2014]/);
    }
  });
});
