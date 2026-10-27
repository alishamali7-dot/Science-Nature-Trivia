# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Adults and children playing together or alone: families and friends passing one phone or tablet between two teams, kids playing the easier set, adults the harder one. Must work on every phone size and on tablets.

## Product Purpose

Science Challenge (تحدّي العلوم) is a Science & Nature trivia game. Success: a group can set up a game in seconds, always know whose turn it is and the score, and finish a full board without confusion or anything cut off on screen.

## Positioning

A science-only take on the سين جيم format: a board of 6 categories with 6 questions each (two each of 200, 400, 600), four multiple-choice answers per question, teams taking turns, and once-per-team helpers (50/50, two tries, the pit, call a friend). Fully bilingual Arabic/English with Arabic first.

## Operating Context

Played in Expo Go during gatherings; one device is handed between teams. Question source is hardcoded today; a course roadmap swaps it for questions from the internet (Tuesday) and AI-written questions (Thursday) without changing the screens.

## Capabilities and Constraints

- Expo SDK 58, React Native, plain JavaScript; runs in Expo Go.
- Modes: one player or two named teams. Age groups: kids (30 s per question) and adults (15 s).
- Undo the last answered question; restart with confirmation.
- Every screen must fit without clipping at small phones (375×667) up to tablets, in both languages.
- Questions shape is fixed (category, points, question, correct, 3 wrong, each `{ ar, en }`), checked by `game.check.js`.

## Brand Commitments

Confirmed by the user to keep: Thmanyah font (license forbids committing the font files), the سين جيم board and helpers, Arabic + English with the language switch, and the dark night game-show look.

## Evidence on Hand

72 written questions in `questions.js`; SVG category art in `components/Illustration.js` and `design/art/`. No testimonials, ratings, or store presence; do not invent any.

## Product Principles

1. Whose turn and the score are always visible.
2. One thumb, one tap: big targets, actions within reach.
3. Arabic is first-class, never a translation afterthought.
4. Fair play: every action can be undone, nothing destructive without a confirm.
5. Kids and adults both: friendly, never childish.

## Accessibility & Inclusion

Large touch targets (≥44 pt), colour never the only signal (✓/✗ icons and letters), reduced-motion respected, readable contrast on the dark background.
