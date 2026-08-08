import "./AnimatedBubbles.css";

export default function AnimatedBubbles() {
  const bubbles = [
  { size: 45, top: "18%", left: "78%", delay: "0s" },
  { size: 32, top: "11%", left: "68%", delay: "1.2s" },
  { size: 20, top: "33%", left: "85%", delay: "0.5s" },
  { size: 15, top: "30%", left: "75%", delay: "1.2s" },
  { size: 22, top: "38%", left: "76%", delay: "0.5s" },
  { size: 21, top: "44%", left: "70%", delay: "0.7s" },
];

  return (
    <div className="bubble-layer">
      {bubbles.map((bubble, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            animationDelay: bubble.delay
          }}
        />
      ))}
    </div>
  );
}