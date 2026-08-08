import "./AnimatedBubbles.css";

export default function AnimatedBubbles() {
  const bubbles = [
  { size: 52, top: "38%", left: "78%", delay: "0s" },
  { size: 38, top: "43%", left: "84%", delay: "1.2s" },
  { size: 28, top: "48%", left: "74%", delay: "2.4s" },
  { size: 21, top: "52%", left: "88%", delay: "3.5s" },
  { size: 16, top: "55%", left: "80%", delay: "4.5s" },
  { size: 11, top: "50%", left: "70%", delay: "5.5s" }
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