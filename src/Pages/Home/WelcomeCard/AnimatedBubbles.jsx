{/*import "./AnimatedBubbles.css";

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
}*/}

import "./AnimatedBubbles.css";

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
      {/* Gradient aniqlanmalari hamma pufakchalar uchun bir marta yuklanadi */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <radialGradient id="bubbleGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="70%" stopColor="rgba(196, 122, 255, 0.25)" />
            <stop offset="92%" stopColor="rgba(141, 43, 255, 0.65)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
          </radialGradient>
          <radialGradient id="highlightGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
        </defs>
      </svg>

      {/* Pufakchalarni rasmga o'xshatib aylantirib chiqish */}
      {bubbles.map((bubble, i) => (
        <svg
          key={i}
          className="magic-bubble"
          viewBox="0 0 100 100"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            top: bubble.top,
            left: bubble.left,
            animationDelay: bubble.delay,
          }}
        >
          {/* Asosiy shaffof aylana shari */}
          <circle cx="50" cy="50" r="47" fill="url(#bubbleGrad)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />
          {/* Tepadagi oq yorug'lik aksi (Highlight) */}
          <ellipse cx="35" cy="30" rx="12" ry="6" fill="url(#highlightGrad)" transform="rotate(-30 35 30)" />
          {/* Pastdagi mayda yorug'lik aksi */}
          <ellipse cx="65" cy="70" rx="8" ry="4" fill="url(#highlightGrad)" transform="rotate(35 65 70)" opacity="0.4" />
        </svg>
      ))}
    </div>
  );
}