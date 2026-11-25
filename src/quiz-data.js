// Single source for every quiz string and every quiz number (copy: landing-copy-en.md EN-§13 to §18).

export const OPTIONS = [
  { label: "Yes, I've really tested this", points: 2 },
  { label: 'I only tested the normal path, no errors', points: 1 },
  { label: "I've never tested this", points: 0 },
];

export const AREAS = [
  {
    area: 'Login and session',
    ebook: '01',
    question:
      'Have you tested what happens when a user types the wrong password, asks to recover their account or has their session expire?',
    hint: "The happy login doesn't count, the trouble lives in the errors and the way back.",
  },
  {
    area: 'Payment and checkout',
    ebook: '02',
    question:
      "Have you simulated a declined card in your checkout to see what happens to the charge and to the customer's access?",
    hint: 'A failed payment is where new SaaS most often charges wrong or gives access without payment.',
  },
  {
    area: 'Saving and data loss',
    ebook: '03',
    question:
      'After saving something in your SaaS, have you refreshed the page, closed everything and come back to check it was still there?',
    hint: 'Data that disappears without warning is the bug customers forgive the least.',
  },
  {
    area: 'Permissions and access',
    ebook: '04',
    question:
      "Have you tried to reach another account's data, by changing the page address or by signing in as a regular user to a restricted area?",
    hint: "The most common leak isn't a hack, it's a permission nobody tested.",
  },
  {
    area: 'Main flow, end to end',
    ebook: '05',
    question:
      'Have you gone through the full journey as a new customer, sign up, first use and payment, without skipping a step?',
    hint: 'Testing screen by screen hides the bug that lives between the screens.',
  },
  {
    area: 'Errors and edge cases',
    ebook: '06',
    question:
      'Have you submitted empty forms, double clicked the pay button or simulated the internet dropping in the middle of a submit?',
    hint: 'Your users will do all of this, the question is how your SaaS responds.',
  },
  {
    area: 'Mobile and browsers',
    ebook: '07',
    question:
      'Have you opened your SaaS on a phone and in a browser other than yours to check it works the same way?',
    hint: "Your customer doesn't use your computer, your browser or your internet connection.",
  },
];

export const BANDS = [
  {
    min: 0,
    max: 4,
    title: 'Launch at risk',
    text: 'Most of the critical areas have never been checked. If a customer finds these bugs before you do, they find them all at once.',
  },
  {
    min: 5,
    max: 9,
    title: 'Partial base, open gaps',
    text: "You check the normal path, but errors, edge cases and permissions are still uncovered, and that's where SaaS breaks.",
  },
  {
    min: 10,
    max: 14,
    title: 'Almost ready, close the gaps',
    text: "Your checking base is good. What's missing is turning it into a method, so you repeat the full check on every launch.",
  },
];

export const STATUS = {
  2: { label: 'checked', icon: 'check' },
  1: { label: 'partial', icon: 'dot' },
  0: { label: 'uncovered', icon: 'x' },
};

export const QUESTIONS_COPY = {
  areaLabel: 'AREA',
  ofSeven: 'OF 7',
  counter: (n) => `Question ${n} of 7`,
  back: 'Back',
  next: 'Continue',
  last: "See what's missing",
  optionsLabel: 'Answers',
};

export const EMAIL_COPY = {
  eyebrow: 'YOUR RESULT IS READY',
  counter: 'Just your email left',
  title: 'Where should I show you the diagnostic?',
  text: 'Leave your email to see your full score, with your uncovered areas and the ebooks to read first for your case.',
  label: 'Your email to see the diagnostic',
  placeholder: 'your best email',
  button: 'Show my diagnostic',
  note: 'Your result appears on screen as soon as you confirm.',
  consent:
    'By continuing, you agree to receive emails from Unflaky about your diagnostic and the ebooks. You can unsubscribe at any time.',
  privacyLink: 'Privacy policy',
  error: 'Please check the email you typed, something seems to be missing.',
};

export const RESULT_COPY = {
  eyebrow: 'YOUR DIAGNOSTIC',
  ebookLabel: 'EBOOK',
  priorityIntro: 'Your priority ebooks',
  priorityOutro: 'These are exactly the areas the ebooks break down, each with a ready-made prompt and a manual check.',
  noneTitle: 'No uncovered areas',
  noneText: 'In the ebooks, what you gain is the complete method and the release checklist to repeat this on every launch.',
  ebooksButton: 'See the ebooks',
  redoButton: 'Retake the diagnostic',
  note: 'Keep your uncovered areas, they become your checking plan before your next launch.',
};
