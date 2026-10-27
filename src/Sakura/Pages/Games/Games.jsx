import "./Games.css";

const games = [
  {
    id: "block-puzzle",
    title: "Block Puzzle",
    description: "Bloklarni joylashtiring va doskani to‘ldiring.",
    artwork: "blocks",
  },
  {
    id: "bubble-shooter",
    title: "Bubble Shooter",
    description: "Rangli pufaklarni moslab, nishonga oling.",
    artwork: "bubbles",
  },
];

function GameArtwork({ type }) {
  if (type === "bubbles") {
    return (
      <svg viewBox="0 0 180 140" aria-hidden="true" focusable="false">
        <circle className="game-art-bubble bubble-one" cx="52" cy="48" r="20" />
        <circle className="game-art-bubble bubble-two" cx="91" cy="36" r="21" />
        <circle className="game-art-bubble bubble-three" cx="130" cy="51" r="19" />
        <circle className="game-art-bubble bubble-four" cx="73" cy="82" r="19" />
        <circle className="game-art-bubble bubble-five" cx="111" cy="83" r="20" />
        <path className="game-art-launcher" d="M90 126 73 103a22 22 0 0 1 34 0L90 126Z" />
        <circle className="game-art-shot" cx="90" cy="105" r="9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 140" aria-hidden="true" focusable="false">
      <rect className="game-art-block block-a" x="37" y="28" width="31" height="31" rx="8" />
      <rect className="game-art-block block-b" x="71" y="28" width="31" height="31" rx="8" />
      <rect className="game-art-block block-c" x="105" y="28" width="31" height="31" rx="8" />
      <rect className="game-art-block block-d" x="37" y="62" width="31" height="31" rx="8" />
      <rect className="game-art-block block-e" x="71" y="62" width="31" height="31" rx="8" />
      <rect className="game-art-block block-f" x="105" y="62" width="31" height="31" rx="8" />
      <rect className="game-art-block block-g" x="54" y="96" width="31" height="31" rx="8" />
      <rect className="game-art-block block-h" x="88" y="96" width="31" height="31" rx="8" />
    </svg>
  );
}

export default function Games() {
  return (
    <main className="mini-games-page" aria-labelledby="mini-games-title">
      <header className="mini-games-header">
        <span className="mini-games-eyebrow">SAKURA · DAM OLISH</span>
        <h1 id="mini-games-title">Mini o‘yinlar</h1>
        <p>Qisqa tanaffus qiling va sevimli o‘yiningizni tanlang.</p>
      </header>

      <section className="mini-games-list" aria-label="O‘yinlar ro‘yxati">
        {games.map((game, index) => (
          <article className={`mini-game-card mini-game-card--${game.artwork}`} key={game.id}>
            <div className="mini-game-art">
              <span className="mini-game-number">0{index + 1}</span>
              <GameArtwork type={game.artwork} />
            </div>

            <div className="mini-game-info">
              <span className="mini-game-status">
                <i aria-hidden="true" />
                Tez orada
              </span>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <button className="mini-game-button" type="button" disabled>
                Tez orada
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
