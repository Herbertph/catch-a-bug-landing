import { expect } from '@playwright/test';

export const OPTION_LABELS = [
  "Yes, I've really tested this",
  'I only tested the normal path, no errors',
  "I've never tested this",
];

export async function openQuiz(page) {
  await page.locator('button[data-open-quiz]:visible').first().click();
  await expect(page.getByRole('dialog', { name: 'Quick diagnostic, 7 questions' })).toBeVisible();
}

export async function selectOption(page, index) {
  await page.locator('.quiz-option').nth(index).click();
}

export async function goNext(page) {
  await page.locator('.quiz-next').click();
}

export async function answer(page, index) {
  await selectOption(page, index);
  await goNext(page);
}

export async function answerAll(page, answers) {
  for (const index of answers) {
    await answer(page, index);
  }
}

export async function fillEmail(page, value) {
  await page.getByLabel('Your email to see the diagnostic').fill(value);
}

export async function submitEmail(page, value) {
  await fillEmail(page, value);
  await page.getByRole('button', { name: 'Show my diagnostic' }).click();
}

export async function reachEmail(page, answers = Array(7).fill(0)) {
  await openQuiz(page);
  await answerAll(page, answers);
  await expect(page.getByLabel('Your email to see the diagnostic')).toBeVisible();
}

export async function reachResult(page, answers = Array(7).fill(0), email = 'ana@site.com') {
  await reachEmail(page, answers);
  await submitEmail(page, email);
  await expect(page.getByText('YOUR DIAGNOSTIC')).toBeVisible();
}

export async function closeQuiz(page) {
  await page.locator('.modal-close').click();
  await expect(page.locator('#quiz-modal')).toBeHidden();
}
