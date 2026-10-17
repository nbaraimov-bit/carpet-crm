import "./SakuraPetals.css";
import petal from "../Assets/sakura-petal.svg";

const petals = [
  { left: "7%", delay: "0.4s", duration: "9s", scale: 0.9 },
  { left: "22%", delay: "2.1s", duration: "12s", scale: 1.1 },
  { left: "39%", delay: "1.3s", duration: "10s", scale: 0.8 },
  { left: "54%", delay: "3.2s", duration: "13s", scale: 1.2 },
  { left: "69%", delay: "0.8s", duration: "11s", scale: 1 },
  { left: "83%", delay: "2.7s", duration: "9.5s", scale: 0.85 },
  { left: "94%", delay: "1.8s", duration: "12.5s", scale: 1.15 },
];

export default function SakuraPetals() {

  return (
    <div className="petals-container">
      {petals.map((petalStyle, index) => (
        <span
          key={index}
          className="petal"
          style={{
            left: petalStyle.left,
            animationDelay: petalStyle.delay,
            animationDuration: petalStyle.duration,
            transform: `scale(${petalStyle.scale})`,
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
