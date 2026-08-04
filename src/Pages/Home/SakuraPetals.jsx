import "./SakuraPetals.css";
import petal from "./Assets/sakura-petal.svg";

export default function SakuraPetals() {

  const petals = Array.from({ length: 7 });

  return (
    <div className="petals-container">
      {petals.map((_, index) => (
        <span
          key={index}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
            transform: `scale(${0.8 + Math.random() * 0.6})`,
          }}
        >
          <img
            src={petal}
            className="petal-img"
            alt=""
          />
        </span>
      ))}
    </div>
  );
}