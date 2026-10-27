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
| `trivia.js` | Live questions from The Trivia API. **The app is English only for now** (`lang` is fixed to `'en'` in `App.js` and the language toggle is hidden) because no API serves Arabic questions; Arabic strings and built-in questions are kept for later. `TAGS` maps each category to API topic tags; `DIFFICULTY` maps points to difficulty (kids: easy/medium/medium, adults: easy/medium/hard). One request per category (the API allows 20 per 5 s); short pools borrow the nearest difficulty, then fall back to the built-in question. Offline = built-in deck |
| `game.js` | Pure rules: answer order, 50/50, scoring (incl. the pit), winner. Covered by `game.check.js` |
| `strings.js` | Every UI string in `ar` and `en`, plus `dirFor(lang)` for right-to-left layout |
| `theme.js` | Colors, fonts, easing curve, time per age group |
| `components/` | Primitives: `Txt` (all text), `Tap` (all presses + haptics), `haptics`, `useLayout` (phone/short/tablet). Pieces: `Bezel` (glass double-frame card), `PrimaryButton`, `AnswerButton`, `QuestionCard`, `CategoryCard`, `TeamScores`, `GameBar` (undo/restart), `Lifeline`, `OptionCard`, `TimerBar`, `LangToggle`, `Illustration` (category art), `Icon` (thin-line icons), `Backdrop` (glows), `Motion` (FadeIn, Float, usePop, useShake), `Confetti` |
| `design/` | The design canvas prototype source and the SVG art. Live canvas: https://claude.ai/artifact/5wnrqUW2GWmrHRM7wikQYe |

## Built to grow — how to extend

- **Add a category:** add an entry to `CATEGORIES` (id, art, color, name), add its art to `ART` in `components/Illustration.js`, then add 6 questions (2 × 200, 400, 600) for **each** age group. The board lays itself out two cards per row for any count, and `game.check.js` fails if a category is missing questions. Past ~8 categories the board will need to scroll on small phones; re-check fit.
- **Add questions / swap the source (Tuesday: questions from the internet; Thursday: AI questions):** keep the same question shape and points, and replace only `questions.js` (or what fills it). Nothing else reads question data directly.
- **Add an age group:** add a key to `QUESTIONS`, a time to `TIME` in `theme.js`, and an `OptionCard` on the setup screen.
- **Add a language:** add a block to `STRINGS` with the same keys, add that language's field to every `{ ar, en }` text, and make `dirFor` know whether it is right-to-left.
- **More than two teams:** `TeamScores`, scoring and Undo already handle any count; add colors to `colors.teams`, more name inputs on setup, and a team-count choice.
- **New helper (lifeline):** add it to the `helpers` list in `App.js`, its icon in `HELPER_ICONS` and `Icon.js`, its strings, and its effect in `takeLifeline` (and in `scoreAnswer` if it changes scoring).

## Design system (keep it consistent)

Product truth lives in `PRODUCT.md` (users, platform, what must be kept). The canvas shows every screen on phone and iPad.

- Look: "night game show". Background `#07070D` with two soft glows (`Backdrop`); content sits in double-bezel glass cards (`Bezel`); buttons are pills with the arrow in its own circle; icons are thin lines (1.6 stroke).
- **Tokens live in `theme.js` only**: `colors`, `space` (4-pt grid), `radius`, `type` (named text styles), `motion`, `EASE`/`EASE_OUT`. No raw hex, font sizes or spacing in screens.
- **Text goes through `Txt`** (`variant` from `type`, `color` from `colors`). Custom fonts choose weight by family name, never `fontWeight`.
- **Everything tappable goes through `Tap`**: scale-down on press-in, optional `haptic` ('tap' | 'select' | 'heavy' | 'success' | 'error' from `components/haptics.js`). One haptic per action, always with a visual.
- **Motion is Reanimated** (`components/Motion.js`): runs on the UI thread and respects reduce-motion. One authored moment per screen (answers rising in, the right-answer pop, winner confetti); don't add entrances to everything.
- **Screen sizes** come from `components/useLayout.js`: `short` phones get compact sizes; `wide` (tablet) gets a centered 560 column, big board cards (2 per row portrait, 3 landscape), and the question block centered with helpers under the answers. Safe-area insets come from `react-native-safe-area-context`.

## Rules that bite

- **Thmanyah font license:** it forbids redistributing the font files, and the GitHub repo is public. The files in `assets/fonts/` are git-ignored on purpose. Never commit them. A fresh clone must copy the `.otf` files in from the official Thmanyah package before it can run.
- **Arabic text:** never use `letterSpacing` or `textTransform` on Arabic; keep line height ≥ 1.5 for body text; use `؟` and `،`. A leading `+` before a number flips in Arabic ("600+"), so phrase points without the sign (see `right` in `strings.js`).
- **Right-to-left:** take layout direction from `dirFor(lang)` (`dir.row`, `dir.text`); don't hard-code `row` or `left`/`right` for content. `I18nManager.isRTL` is `undefined` on web, so it's read as `!!I18nManager.isRTL`.
- **Bottom safe zone:** every screen's main button rests at the bottom inside the same zone, `bottomSafe` in `App.js` (the home-indicator inset or 16px, plus 24px; 16px on short phones). Measured gap from the bottom edge must be the same on every screen (40px on 390×844 web, 32px on 375×667). Never pin a button to the edge or float it mid-screen.
- **Fit every screen:** nothing may be cut off. Check at 390×844 and 375×667 (iPhone SE), in both languages, including a question with a helper message showing and the answered state. Short screens (`height < 760`) use the compact sizes already wired in.
- **Back** (`goBack` in `App.js`, also Android's system Back): setup → start, board → setup (game kept; setup offers "continue" while players and age are unchanged), unanswered question → board as if never opened (its helpers come back), answered question → same as Next, results → board (which then offers "see score"). During a game the top bar shows Back + Undo/Restart; language is switched from setup.
- Undo history stores a snapshot when a question **opens** and commits it when the question is **answered**; anything new that changes game state must be included in that snapshot.

## Course checklist (where this stands)

- Core / Extra / Boss features are in, except: shuffled answer order (answers use a fixed order per question in `game.js`) and the Vercel web deploy.
- Not done yet: connect and push to the GitHub `trivia-app` repo (needs the SSH address), and test on a real phone in Expo Go (needs `npx expo login`).
