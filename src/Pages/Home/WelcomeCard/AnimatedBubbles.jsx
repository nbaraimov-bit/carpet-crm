import "./AnimatedBubbles.css";

export default function AnimatedBubbles() {
  const bubbles = [

    { size: 58, top: "12%", left: "72%", delay: "0s" },
    { size: 42, top: "22%", left: "79%", delay: "1s" },
    { size: 34, top: "34%", left: "75%", delay: "2s" },
    { size: 22, top: "48%", left: "70%", delay: "3s" },
    { size: 16, top: "58%", left: "73%", delay: "4s" },
    { size: 12, top: "68%", left: "77%", delay: "5s" }

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