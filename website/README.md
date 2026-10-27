# Science Challenge website

Next.js site for the Science Challenge trivia game. `/` is the home page; `/play` is the game.

The game is not rewritten here: `public/play` holds the web build of the Expo app one folder up,
so phone and web always run the same code. After changing the app, rebuild it into this site
(from the app folder, in PowerShell), then deploy from this folder:

```powershell
$env:EXPO_BASE_URL = '/play'; npx expo export --platform web --output-dir website/public/play; Remove-Item Env:EXPO_BASE_URL
cd website; npx vercel deploy --prod
```

Live at https://science-challenge-psi.vercel.app (Vercel project `science-challenge`).

The web build uses Google Fonts (Readex Pro, Playfair Display) instead of Thmanyah, whose license
forbids redistributing the font files.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
