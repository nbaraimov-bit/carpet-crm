import "./AnimatedBubbles.css";

export default function AnimatedBubbles() {
  const bubbles = [
    { size: 58, top: "28%", left: "82%", delay: "0s" },
    { size: 42, top: "34%", left: "78%", delay: "1s" },
    { size: 34, top: "40%", left: "84%", delay: "2s" },
    { size: 22, top: "46%", left: "80%", delay: "3s" },
    { size: 16, top: "50%", left: "86%", delay: "4s" },
    { size: 12, top: "44%", left: "76%", delay: "5s" }
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