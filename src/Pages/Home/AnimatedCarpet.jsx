import "./AnimatedCarpet.css";

export default function AnimatedCarpet() {
  return (
    <div className="carpet-container">

      <div className="carpet-glow"></div>

      <div className="carpet-shadow"></div>

      <div className="carpet">

        {/* Hozircha vaqtinchalik */}
        <img
          src="/carpet.png"
          alt="carpet"
          className="carpet-image"
        />

      </div>

    </div>
  );
}