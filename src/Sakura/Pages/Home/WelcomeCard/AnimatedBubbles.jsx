import "./AnimatedBubbles.css";
import bubbler from  "../Assets/bubble.svg"

export default function AnimatedBubbles() {
  const bubbles = [
  { size: 45, top: "18%", left: "78%", delay: "0s" },
  { size: 32, top: "11%", left: "68%", delay: "1.2s" },
  { size: 20, top: "33%", left: "85%", delay: "0.5s" },
  { size: 15, top: "30%", left: "75%", delay: "1.2s" },
  { size: 22, top: "41%", left: "76%", delay: "0.5s" },
  { size: 21, top: "48%", left: "70%", delay: "0.7s" },

  { size: 15, top: "40%", left: "45%", delay: "0.7s" },
  { size: 17, top: "45%", left: "35%", delay: "0.6s" },
  { size: 7, top: "38%", left: "32%", delay: "0.5s" },
  { size: 5, top: "50%", left: "26%", delay: "0.3s" },
  { size: 2, top: "42%", left: "42%", delay: "0.4s" },
];

  return (
    <div className="bubble-layer">
      {bubbles.map((bubble, i) => (
        <img
          src={bubbler}
          className="bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            animationDelay: bubble.delay,
          }}
        />
      ))}
    </div>
  );
}