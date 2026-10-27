const CATEGORIES = ['Space', 'Animals', 'Plants', 'Human body', 'Earth & matter', 'Oceans'];

const SCREENS = [
  { src: '/screens/04-board.png', title: 'The board', text: 'Six categories, two questions at each of 200, 400 and 600 points.' },
  { src: '/screens/06-helpers.png', title: 'Helpers', text: '50/50, Two tries, The pit and Call a friend, once per team.' },
  { src: '/screens/09-winner.png', title: 'The winner', text: 'Final scores, confetti, and straight into another round.' },
];

export default function Home() {
  return (
    <main className="wrap">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Science &amp; Nature trivia</p>
          <h1>Science Challenge</h1>
          <p className="lede">
            A game-show quiz for two teams or one player. Pick kids or adults, then race through 36 new
            questions across six categories. Questions don’t repeat until you have seen them all.
          </p>
          <div className="actions">
            <a className="play" href="/play">
              Play now
              <span aria-hidden="true">▶</span>
            </a>
            <a className="ghost" href="https://github.com/alishamali7-dot/Science-Nature-Trivia" target="_blank" rel="noopener">
              Source on GitHub
            </a>
          </div>
          <ul className="chips" aria-label="Categories">
            {CATEGORIES.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div className="phone hero-phone">
          <img src="/screens/01-start.png" alt="The game's start screen" width="390" height="844" />
        </div>
      </section>

      <section className="how">
        <h2>How to play</h2>
        <ol>
          <li><strong>Set up.</strong> One player or two teams, kids or adults, and your team names.</li>
          <li><strong>Pick a question.</strong> 200 is easy, 400 is medium, 600 is hard. Kids get easy and medium only, with more time.</li>
          <li><strong>Answer before time runs out.</strong> Each team can use every helper once.</li>
          <li><strong>Highest score wins</strong> once all 36 questions are played.</li>
        </ol>
      </section>

      <section className="screens">
        <h2>Inside the game</h2>
        <div className="grid">
          {SCREENS.map((s) => (
            <figure key={s.src}>
              <div className="phone"><img src={s.src} alt={s.title} width="390" height="844" loading="lazy" /></div>
              <figcaption><strong>{s.title}</strong><span>{s.text}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer>
        Questions from <a href="https://the-trivia-api.com" target="_blank" rel="noopener">The Trivia API</a> (CC BY-NC 4.0).
        Also playable on phones with Expo Go.
      </footer>
    </main>
  );
}
