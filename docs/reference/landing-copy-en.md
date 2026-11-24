# Page copy, English: "Don't Break in Public"

> **Source of truth for every page text** from `feature/english-ebooks` on. It replaces the pt-BR copy of
> `landing-page-source-pt-br.md`. That file is still the source for structure, layout, measurements, colors and
> behavior (§N below match its section numbers). Copy every line in a code span letter by letter: case, punctuation,
> and the straight apostrophe `'` (U+0027, never `’`).
>
> Product: **Don't Break in Public**, a series of **7 ebooks**, one for each test area of the diagnostic. There are no
> lessons, no course and no introduction lesson. Language: US English. Written by the analyst on 2026-11-24 from the
> approved pt-BR copy, for Herbert's review in the pull request.

Rules that still apply (§3): no em dash `—` or en dash `–` anywhere (use a comma); no invented numbers, revenue,
testimonials, students, scarcity, deadlines or financial promises; the instructor verifies and sends problems back,
never "approves" or "certifies" products; no waitlist anywhere (§29).

## §2 Document

- `<html lang="en">`
- Tab title: `Don't Break in Public, the ebook series for AI-built SaaS`

## §7 Header

- Logo link (to `#top`) accessible name: `Unflaky, Quality Lab`. Visible lines: `UNFLAKY` / `QUALITY LAB`.
- Header button: `Take the diagnostic`

## §8 Hero

- Pill: `Don't Break in Public, 7 short ebooks`
- H1: `Without these tests, your SaaS can break in production`. The gold part is `can break in production`.
- Paragraph 1: `You built fast with AI, and that's great. The problem is that the agent hands over the code and says
  it's done, but nobody checked that it actually works. These ebooks show the 7 tests that separate a calm launch
  from a launch spent putting out fires.` The phrase in the main text color is
  `nobody checked that it actually works`.
- Paragraph 2: `Short, direct ebooks for people who build with an agent, Cursor, Claude, Copilot or any LLM, and want
  to validate their own product without becoming a QA expert.`
- CTA box title: `Find out where your SaaS can break`
- CTA box text: `Answer 7 questions, one for each test in the ebooks, and see your score from 0 to 14, your uncovered
  areas and the ebooks to read first for your case.`
- Big button: `Take the diagnostic`
- Note: `It takes about 1 minute. Your result appears on screen, with the status of each area.`

## §9 Pre-launch check card

- Card accessible name: `Example of a pre-launch test check`
- Header label: `PRE-LAUNCH CHECK`
- Badge: `STRAIGHT FROM THE EBOOKS`
- Rows (status, title, explanation):
  1. check: `Login and session`, `Users sign in, sign out and come back without losing access`
  2. x: `Payment and checkout`, `A declined card still charges the customer, a classic new SaaS bug`
  3. check: `Saving data`, `What the user saves is still there after a page refresh`
  4. x: `Access permissions`, `One customer can see another customer's data`
  5. pending: `Main flow, end to end`, `Sign up, use and payment, in the order the customer does them`
- Footer left: `2 failures found before launch`, with the word `before` in mono.
- Footer right (mono, light gold): `COST: $0 in lost customers`

## §10 Proof strip

| Number | Text |
| --- | --- |
| `10+ years` | `in IT, from development to software quality` |
| `3 days → 24h` | `was the cut in bug triage time, with a standardized process and bug reports` |
| `98%` | `on-time deliveries over the last 6 months, verifying software that cannot ship with errors` |
| `CTFL 2026` | `international software testing certification, ISTQB` |

The symbols `+`, `→`, `%` and `2026` stay in light gold, as in the current page.

## §11 Diagnostic section (anchor `#diagnostic`)

- Eyebrow: `Quick diagnostic`
- H2: `Find out, in 1 minute, where your SaaS can break`
- Paragraph: `7 questions, one for each test in the ebooks. At the end, you leave your email and see on screen your
  score, your uncovered areas and which ebooks tackle exactly your risk.`
- CTA box title: `Is your SaaS ready for its first real customer?`
- CTA box text: `The diagnostic opens right here, in a small phone-shaped window. You answer the 7 questions, leave your
  email and see the full result without leaving this page.`
- Button: `Take the diagnostic`

## §12 Modal

- Dialog accessible name: `Quick diagnostic, 7 questions`
- Close button accessible name: `Close the diagnostic`

## §13 to §15 Questions

- Top left (mono, gold, uppercase): `AREA N OF 7, <AREA NAME IN UPPERCASE>`
- Counter: `Question N of 7`
- Buttons: `Back`, `Continue`; on question 7 the primary button reads `See what's missing`.

| # | Area | Ebook | Question | Hint |
| --- | --- | --- | --- | --- |
| 1 | `Login and session` | 01 | `Have you tested what happens when a user types the wrong password, asks to recover their account or has their session expire?` | `The happy login doesn't count, the trouble lives in the errors and the way back.` |
| 2 | `Payment and checkout` | 02 | `Have you simulated a declined card in your checkout to see what happens to the charge and to the customer's access?` | `A failed payment is where new SaaS most often charges wrong or gives access without payment.` |
| 3 | `Saving and data loss` | 03 | `After saving something in your SaaS, have you refreshed the page, closed everything and come back to check it was still there?` | `Data that disappears without warning is the bug customers forgive the least.` |
| 4 | `Permissions and access` | 04 | `Have you tried to reach another account's data, by changing the page address or by signing in as a regular user to a restricted area?` | `The most common leak isn't a hack, it's a permission nobody tested.` |
| 5 | `Main flow, end to end` | 05 | `Have you gone through the full journey as a new customer, sign up, first use and payment, without skipping a step?` | `Testing screen by screen hides the bug that lives between the screens.` |
| 6 | `Errors and edge cases` | 06 | `Have you submitted empty forms, double clicked the pay button or simulated the internet dropping in the middle of a submit?` | `Your users will do all of this, the question is how your SaaS responds.` |
| 7 | `Mobile and browsers` | 07 | `Have you opened your SaaS on a phone and in a browser other than yours to check it works the same way?` | `Your customer doesn't use your computer, your browser or your internet connection.` |

Options, same for all 7 questions, in this order:

| Option | Points | Status |
| --- | --- | --- |
| `Yes, I've really tested this` | 2 | `checked` |
| `I only tested the normal path, no errors` | 1 | `partial` |
| `I've never tested this` | 0 | `uncovered` |

## §16 Email screen

- Top left (mono, gold): `YOUR RESULT IS READY`
- Top right: `Just your email left`
- Title: `Where should I show you the diagnostic?`
- Text: `Leave your email to see your full score, with your uncovered areas and the ebooks to read first for your case.`
- Field accessible name: `Your email to see the diagnostic`
- Placeholder: `your best email`
- Button: `Show my diagnostic`
- Note: `Your result appears on screen as soon as you confirm.`
- Error: `Please check the email you typed, something seems to be missing.`

## §17 and §18 Result screen

- Top left (mono, gold): `YOUR DIAGNOSTIC`. Top right: the typed email.
- Score: `N` then `/14`.
- Bands:

| Points | Title | Text |
| --- | --- | --- |
| 0 to 4 | `Launch at risk` | `Most of the critical areas have never been checked. If a customer finds these bugs before you do, they find them all at once.` |
| 5 to 9 | `Partial base, open gaps` | `You check the normal path, but errors, edge cases and permissions are still uncovered, and that's where SaaS breaks.` |
| 10 to 14 | `Almost ready, close the gaps` | `Your checking base is good. What's missing is turning it into a method, so you repeat the full check on every launch.` |

- Area row: status icon, `<Area name>` in bold followed by the lowercase status label (`checked`, `partial`,
  `uncovered`), and on the right, mono gold uppercase, `EBOOK NN` (for example `EBOOK 01`).
- Priority paragraph, when some area has fewer than 2 points: `Your priority ebooks: Ebook 01 (Login and session),
  Ebook 02 (Payment and checkout). These are exactly the areas the ebooks break down, each with a ready-made prompt
  and a manual check.` The list holds every area below 2 points, in ebook order, as `Ebook NN (Area name)`, joined by
  `, `, then a period. `Your priority ebooks` is bold in the main text color.
- Priority paragraph, when no area is below 2 points: `No uncovered areas. In the ebooks, what you gain is the
  complete method and the release checklist to repeat this on every launch.` `No uncovered areas` is bold in the
  main text color.
- Gold button: `See the ebooks` (closes the modal and scrolls to `#ebooks`).
- Ghost button: `Retake the diagnostic`
- Note: `Keep your uncovered areas, they become your checking plan before your next launch.`

## §19 The problem

- Eyebrow: `The problem`
- H2: `Vibe coding sped up building. Checking fell behind.`
- Paragraph: `Today any founder can put a SaaS together in weeks. But speed without testing creates a new kind of bug,
  the bug nobody saw because nobody looked.`
- Red card tag: `WITHOUT TESTING`. Title: `Your customer finds the bug`. Text: `The agent says it's done, you publish,
  and the first real payment fails, the first customer loses the data they saved, or worse, sees another customer's
  data. The fix comes after the damage, in a hurry, with the customer already doubting the product.`
- Green card tag: `WITH THE 7 TESTS`. Title: `You find the bug, first`. Text: `You run a short, methodical check on the
  areas that really break a SaaS. Every failure shows up on your screen, in a test environment, with time to ask
  the agent for a fix and check again. Launching becomes a decision, not a bet.`

## §20 How each ebook works

- Eyebrow: `How each ebook works`
- H2: `Not QA theory. A working playbook.`
- Paragraph: `Each of the 7 ebooks follows the same format, so you can apply it to your product the same day, even
  without writing code by hand.`

| Step | Title | Text |
| --- | --- | --- |
| `STEP 1` | `Where you're working` | `Which area of your SaaS the test covers, payment, login, data, permissions, and where the risk lives in it.` |
| `STEP 2` | `Why test it` | `What breaks if this area fails, in founder terms, a lost sale, lost data, a lost customer.` |
| `STEP 3` | `The ready-made prompt` | `A complete prompt to paste into your agent and ask it to implement or fix the test, without you needing to know how to code it.` |
| `STEP 4` | `The manual check` | `A short step by step, on screen, so you can confirm yourself that it worked. Because the agent says it did it, but you're the one who validates it.` |

## §21 to §23 The ebooks (anchor `#ebooks`)

- Eyebrow: `The ebooks`
- H2: `7 ebooks, one for each test`
- Paragraph: `Tap an ebook to see what it covers. Short, no fluff, and each one ends with the check done on your own
  product.`
- Accordion: 7 items (no introduction). **Ebook 01 is open on load**; the other 6 start closed. Number box shows
  `01` to `07`. Tags: the first one of each ebook is the gold one.

| # | Title | Subtitle | Body | Tags |
| --- | --- | --- | --- | --- |
| 01 | `Login and session` | `If users can't get in, nothing else matters` | `Login is the front door of your SaaS, and a broken door doesn't show up in your quick test, it shows up for a customer at 10 p.m. on a Sunday. You check sign up, login, logout, password recovery, expiring sessions and what happens when a user tries to sign in twice or with the wrong password.` | `AREA, AUTHENTICATION` (gold), `PROMPTS INCLUDED`, `MANUAL CHECKLIST` |
| 02 | `Payment and checkout` | `The area where a bug becomes a loss on the spot` | `Approved payment, declined payment, renewing subscription, cancelled subscription, refund. You test the whole money path, including the card that fails, because errors are exactly where new SaaS charge wrong, give access without payment or lock out people who paid.` | `AREA, REVENUE` (gold), `PROMPTS INCLUDED`, `MANUAL CHECKLIST` |
| 03 | `Saving and data loss` | `Users trust that what they saved will still be there` | `Create, edit, delete and reload. You check that everything a user saves survives a page refresh, closing and coming back, editing twice and deleting by accident. Losing customer data is the least forgiven bug, and one of the simplest to prevent.` | `AREA, DATA` (gold), `PROMPTS INCLUDED`, `MANUAL CHECKLIST` |
| 04 | `Permissions and access` | `A customer must never see what belongs to another` | `The most common leak in a SaaS built fast isn't a hack, it's a permission nobody tested, changing a number in the URL and opening someone else's account. You learn to test user roles, admin access and isolation between accounts, the way a professional tester does.` | `AREA, BASIC SECURITY` (gold), `PROMPTS INCLUDED`, `MANUAL CHECKLIST` |
| 05 | `Main flow, end to end` | `The full journey, in the customer's order` | `Testing screen by screen hides the bug that lives between the screens. In this ebook you walk the whole journey as a new customer, sign up, first use, payment and final result, and find where the experience breaks along the way.` | `AREA, CUSTOMER JOURNEY` (gold), `PROMPTS INCLUDED`, `MANUAL CHECKLIST` |
| 06 | `Errors and edge cases` | `Your users will do everything you didn't imagine` | `Empty field, giant text, double click on the pay button, internet dropping in the middle of a submit. You test how your SaaS behaves when something goes wrong, so it answers with a clear message instead of a broken screen or a double charge.` | `AREA, RESILIENCE` (gold), `PROMPTS INCLUDED`, `MANUAL CHECKLIST` |
| 07 | `Mobile, browsers and the launch` | `Check where your customers really use it` | `Your customer opens it on a phone, in the browser they already use, with the internet connection they have. In the final ebook you check responsive layout, the main browsers and perceived speed, and build your release checklist, the checking ritual to repeat on every launch from now on.` | `AREA, FINAL EXPERIENCE` (gold), `PROMPTS INCLUDED`, `RELEASE CHECKLIST` |

- Footer of the list (3 items; highlights in the main text color in bold):
  - `7 ebooks, one for each test` (highlight: `7 ebooks`)
  - `In every ebook, the ready-made prompt and the manual check` (highlight: `the ready-made prompt and the manual check`)
  - `Made for people who build with AI, no QA background needed` (highlight: `no QA background needed`)

## §24 Who it's for

- Eyebrow: `Who it's for`
- H2: `Made for founders who build, not for people studying QA`
- Positive card title: `These ebooks are for you if`
  - `You're building a SaaS with AI, vibe coding or a coding agent`
  - `You're going to launch, or already have, with nobody testing but you`
  - `Your biggest fear is breaking in production in front of your first customers`
  - `You want a short checking method to repeat on every launch`
- Negative card title: `They're not for you if`
  - `You want a complete QA education or certification prep`
  - `You're looking for advanced test automation and code frameworks`
  - `Your product already has a dedicated quality team`
  - `You want a promise of financial results, there's none here`

## §25 and §26 Who wrote it

- Eyebrow: `Who wrote it`
- H2: `Real authority, no made-up numbers`
- Paragraph: `You'll see products out there sold with revenue screenshots and promises of results. Here the credibility
  is different, it's real work, verifiable, done every day.`
- Card: initials `HP`, name `Herbert Parasio`, role `SQA Team Lead, BMM Test Labs, Canada`. List:
  1. `QA Team Lead at a testing lab in Canada, on software that cannot ship with errors`
  2. `95% pass rate on the first verification of the products tested over the last 6 months`
  3. `Cut a bug triage from 3 days to under 24 hours`
  4. `CTFL certified, ISTQB, 2026`
  5. `More than 10 years in IT, from full stack developer to QA lead`
- Text, 3 paragraphs and a quote (highlights: the developer keeps the current highlighted phrases' equivalents):
  1. `I work testing software that cannot ship with errors. At the lab where I lead QA, every product goes through
     a rigorous verification before any release, and every problem found goes back to the people who built it to
     fix, with the process running until it's right.`
  2. `That's the eye missing from SaaS built with AI. It's not a lack of code, the agent ships code all day long.
     It's a lack of someone checking what matters, in the right order, before the customer does. That method,
     simplified for people who aren't in QA, is exactly what became these 7 ebooks.`
  3. `None of this is textbook theory. It's the same prioritizing and checking mindset I use at work, translated
     for people who build alone, with an agent, and need to launch without fear.`
  - Quote: `I won't make up numbers to look like an authority. What I have is the work, and that's what's in these
    ebooks.`

## §27 FAQ

- Eyebrow: `FAQ`
- H2: `Your questions, answered`

1. `Do I need to know how to code to use the ebooks?` / `No. The ebooks were designed for people who build with an
   agent. In each one, the ready-made prompt does the technical part with your LLM, and the manual check happens on
   screen, clicking and watching, without writing code.`
2. `Do they work with the tool I use?` / `Yes. The prompts and checks don't depend on a specific tool. They work
   with Cursor, Claude, Copilot, ChatGPT and any other agent or LLM you already use to build your SaaS.`
3. `When do the ebooks launch and how much will they cost?` / `The ebooks are in production and will launch when
   the series is complete, with date and price published here. Meanwhile, the diagnostic already shows which areas
   of your SaaS need attention first.`
4. `Is the diagnostic free?` / `Yes. It's 7 questions, it takes about 1 minute, and the result appears on screen
   with your score from 0 to 14 and the status of each area. We ask for your email before showing the result,
   that's all.`
5. `I've already launched my SaaS. Does this still make sense?` / `It does, maybe even more. The 7 tests become a
   checking ritual for every new version, every new feature and every fix the agent delivers. A launched product
   breaks in an update the same way it breaks at launch.`

## §28 Final CTA, footer and mobile bar

- Eyebrow: `Quick diagnostic`
- H2: `Your next launch doesn't have to be a bet`
- Paragraph: `Take the diagnostic, 7 questions in about 1 minute, and see your score, your uncovered areas and the
  ebooks that tackle exactly your risk. Better you find the bug now than your first customer finds it for you.`
- Button: `Take the diagnostic`
- Footer left: `UNFLAKY, Quality Lab, Herbert Parasio`
- Footer right: `Ebook series in production. Content based on real QA experience, with no financial results promised
  or invented.`
- Mobile bar button: `Take the diagnostic`

## §31 Anchors

`#top` (main content), `#diagnostic` (diagnostic section), `#ebooks` (ebooks section). The old pt-BR anchors
(`#topo`, `#diagnostico`, `#aulas`) are not kept: this page has never been published.
