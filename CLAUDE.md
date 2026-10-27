# Science Challenge · تحدّي العلوم

A bilingual (Arabic / English) Science & Nature trivia game for phones, built with Expo (React Native) and played in Expo Go.
It follows the سين جيم format: a board of categories, each with 6 questions (2 × 200, 2 × 400, 2 × 600),
teams taking turns, and once-per-team helpers. Also read `AGENTS.md` (Expo's own notes: check the versioned docs, use `npx expo install`).

## Run and check

```bash
npx expo start              # scan the QR code with Expo Go (same Wi-Fi); add --tunnel if the phone can't find the laptop
npx expo start --web        # quick check in a browser
node game.check.js          # game rules + question bank shape; must print "OK" before every commit
```

Before committing, also confirm it bundles: `npx expo export --platform android --output-dir <temp dir>`.

## Where things live

| File | What it holds |
|---|---|
| `App.js` | All screens (start → setup → board → question → end) and game state, including Undo history |
| `questions.js` | `CATEGORIES` and `QUESTIONS.kids` / `QUESTIONS.adults`. Each question: category, points, question, correct, wrong[3], every text as `{ ar, en }` |
| `game.js` | Pure rules: answer order, 50/50, scoring (incl. the pit), winner. Covered by `game.check.js` |
| `strings.js` | Every UI string in `ar` and `en`, plus `dirFor(lang)` for right-to-left layout |
| `theme.js` | Colors, fonts, easing curve, time per age group |
| `components/` | Reusable pieces: `Bezel` (glass double-frame card), `PrimaryButton`, `AnswerButton`, `QuestionCard`, `CategoryCard`, `TeamScores`, `GameBar` (undo/restart), `Lifeline`, `OptionCard`, `TimerBar`, `LangToggle`, `Illustration` (category art), `Icon` (thin-line icons), `Backdrop` (glows), `Motion` (FadeIn, Float, usePop, useShake), `Confetti` |
| `design/` | The design canvas prototype source and the SVG art. Live canvas: https://claude.ai/artifact/5wnrqUW2GWmrHRM7wikQYe |

## Built to grow — how to extend

- **Add a category:** add an entry to `CATEGORIES` (id, art, color, name), add its art to `ART` in `components/Illustration.js`, then add 6 questions (2 × 200, 400, 600) for **each** age group. The board lays itself out two cards per row for any count, and `game.check.js` fails if a category is missing questions. Past ~8 categories the board will need to scroll on small phones; re-check fit.
- **Add questions / swap the source (Tuesday: questions from the internet; Thursday: AI questions):** keep the same question shape and points, and replace only `questions.js` (or what fills it). Nothing else reads question data directly.
- **Add an age group:** add a key to `QUESTIONS`, a time to `TIME` in `theme.js`, and an `OptionCard` on the setup screen.
- **Add a language:** add a block to `STRINGS` with the same keys, add that language's field to every `{ ar, en }` text, and make `dirFor` know whether it is right-to-left.
- **More than two teams:** `TeamScores`, scoring and Undo already handle any count; add colors to `colors.teams`, more name inputs on setup, and a team-count choice.
- **New helper (lifeline):** add it to the `helpers` list in `App.js`, its icon in `HELPER_ICONS` and `Icon.js`, its strings, and its effect in `takeLifeline` (and in `scoreAnswer` if it changes scoring).

## Design system (keep it consistent)

- Look: "night game show". Background `#07070D` with two soft glows (`Backdrop`); content sits in double-bezel glass cards (`Bezel`); buttons are pills with the arrow in its own circle; icons are thin lines (1.6 stroke).
- Colors come from `theme.js` only. Violet `accent`, gold for points, green `right`, red `wrong`, one color per team.
- Fonts: Thmanyah Sans for UI, Thmanyah Serif Display for big titles. Custom fonts choose weight by family name, never `fontWeight`.
- Motion uses the spring curve `EASE` from `theme.js`; animate only transform and opacity.

## Rules that bite

- **Thmanyah font license:** it forbids redistributing the font files, and the GitHub repo is public. The files in `assets/fonts/` are git-ignored on purpose. Never commit them. A fresh clone must copy the `.otf` files in from the official Thmanyah package before it can run.
- **Arabic text:** never use `letterSpacing` or `textTransform` on Arabic; keep line height ≥ 1.5 for body text; use `؟` and `،`. A leading `+` before a number flips in Arabic ("600+"), so phrase points without the sign (see `right` in `strings.js`).
- **Right-to-left:** take layout direction from `dirFor(lang)` (`dir.row`, `dir.text`); don't hard-code `row` or `left`/`right` for content. `I18nManager.isRTL` is `undefined` on web, so it's read as `!!I18nManager.isRTL`.
- **Fit every screen:** nothing may be cut off. Check at 390×844 and 375×667 (iPhone SE), in both languages, including a question with a helper message showing and the answered state. Short screens (`height < 760`) use the compact sizes already wired in.
- Undo history stores a snapshot when a question **opens** and commits it when the question is **answered**; anything new that changes game state must be included in that snapshot.

## Course checklist (where this stands)

- Core / Extra / Boss features are in, except: shuffled answer order (answers use a fixed order per question in `game.js`) and the Vercel web deploy.
- Not done yet: connect and push to the GitHub `trivia-app` repo (needs the SSH address), and test on a real phone in Expo Go (needs `npx expo login`).
