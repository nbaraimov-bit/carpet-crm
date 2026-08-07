import "./AnimatedBubbles.css";

export default function AnimatedBubbles() {
  const bubbles = [
    { size: 60, top: "15%", left: "72%", delay: "0s" },
    { size: 48, top: "42%", left: "82%", delay: "1.2s" },
    { size: 32, top: "26%", left: "60%", delay: "2.5s" },
    { size: 22, top: "58%", left: "70%", delay: "3.4s" },
    { size: 16, top: "33%", left: "90%", delay: "4.5s" },
    { size: 12, top: "48%", left: "55%", delay: "5.1s" }
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