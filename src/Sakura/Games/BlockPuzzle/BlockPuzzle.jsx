import "./BlockPuzzle.css";

export default function BlockPuzzle({ onBack }) {
  return (
    <main className="block-puzzle-page" aria-labelledby="block-puzzle-title">
      <header className="block-puzzle-header">
        <button
          className="block-puzzle-back"
          type="button"
          onClick={onBack}
          aria-label="Mini o‘yinlarga qaytish"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div>
          <span className="block-puzzle-eyebrow">MINI O‘YINLAR</span>
          <h1 id="block-puzzle-title">Block Puzzle</h1>
        </div>
      </header>

      <section className="block-puzzle-placeholder" aria-live="polite">
        <div className="block-puzzle-preview" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <h2>O‘yin ekrani tayyor</h2>
        <p>Block Puzzle mexanikasi keyinroq qo‘shiladi.</p>
      </section>
    </main>
  );
}
