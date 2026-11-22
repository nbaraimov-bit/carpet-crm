import { useMemo, useState } from "react";
import "./BubbleShooter.css";

const COLORS = ["#ff668e", "#a970ff", "#42d8d0", "#ffc451", "#64a9ff"];
const R = 18;
const STEP_Y = 32;
const COLS = 9;
const ROWS = 12;
const WIDTH = 400;
const LAUNCH_Y = 478;

function makeBoard() {
  return Array.from({ length: 6 }, (_, row) => Array.from({ length: COLS }, (_, col) =>
    (row < 4 || Math.random() > .28) ? COLORS[(Math.floor(col / 2) + row + Math.floor(Math.random() * 2)) % COLORS.length] : null
  ));
}

function center(row, col) { return { x: 40 + col * 40 + (row % 2) * 20, y: 28 + row * STEP_Y }; }

function neighbors(row, col) {
  const shifts = row % 2 ? [[0,-1],[0,1],[-1,0],[-1,1],[1,0],[1,1]] : [[0,-1],[0,1],[-1,-1],[-1,0],[1,-1],[1,0]];
  return shifts.map(([dr, dc]) => [row + dr, col + dc]).filter(([r,c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS);
}

function groupAt(board, startRow, startCol) {
  const color = board[startRow]?.[startCol];
  if (!color) return [];
  const queue = [[startRow, startCol]], seen = new Set([`${startRow}:${startCol}`]);
  for (let i = 0; i < queue.length; i += 1) for (const [r,c] of neighbors(...queue[i])) {
    const key = `${r}:${c}`;
    if (!seen.has(key) && board[r]?.[c] === color) { seen.add(key); queue.push([r,c]); }
  }
  return queue;
}

function floatingBubbles(board) {
  const attached = new Set(), queue = [];
  board[0]?.forEach((bubble, col) => { if (bubble) { queue.push([0,col]); attached.add(`0:${col}`); } });
  for (let i = 0; i < queue.length; i += 1) for (const [r,c] of neighbors(...queue[i])) {
    const key = `${r}:${c}`;
    if (board[r]?.[c] && !attached.has(key)) { attached.add(key); queue.push([r,c]); }
  }
  return board.flatMap((row,r) => row.map((bubble,c) => bubble && !attached.has(`${r}:${c}`) ? [r,c] : null).filter(Boolean));
}

export default function BubbleShooter({ onBack }) {
  const [board, setBoard] = useState(makeBoard);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [aim, setAim] = useState({ x: WIDTH / 2, y: 200 });
  const [current, setCurrent] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);
  const next = useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], [shots]);

  function shoot(event) {
    if (gameOver) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const target = { x: ((event.clientX - rect.left) / rect.width) * WIDTH, y: ((event.clientY - rect.top) / rect.height) * 520 };
    setAim(target);
    let dx = target.x - WIDTH / 2, dy = target.y - LAUNCH_Y;
    if (dy > -30) dy = -30;
    const length = Math.hypot(dx, dy) || 1; dx /= length; dy /= length;
    let x = WIDTH / 2, y = LAUNCH_Y;
    for (let step = 0; step < 180; step += 1) {
      x += dx * 4; y += dy * 4;
      if (x < R || x > WIDTH - R) dx *= -1;
      x = Math.max(R, Math.min(WIDTH - R, x));
      if (y < R + 5) break;
      const hit = board.some((row, r) => row.some((bubble, c) => {
        if (!bubble) return false; const p = center(r,c); return Math.hypot(p.x - x, p.y - y) < R * 2 - 1;
      }));
      if (hit) break;
    }
    let best = null, distance = Infinity;
    for (let r = 0; r < ROWS; r += 1) for (let c = 0; c < COLS; c += 1) {
      if (board[r][c]) continue;
      const p = center(r,c), d = Math.hypot(p.x - x, p.y - y);
      if (d < distance) { distance = d; best = [r,c]; }
    }
    if (!best) return;
    const updated = board.map(row => row.slice()); updated[best[0]][best[1]] = current;
    const matched = groupAt(updated, ...best);
    let cleared = [];
    if (matched.length >= 3) {
      matched.forEach(([r,c]) => { updated[r][c] = null; });
      cleared = floatingBubbles(updated);
      cleared.forEach(([r,c]) => { updated[r][c] = null; });
      setScore(value => value + matched.length * 10 + cleared.length * 20);
    }
    const remaining = updated.some(row => row.some(Boolean));
    const nextShots = shots + 1;
    setBoard(updated); setShots(nextShots); setCurrent(next);
    if (!remaining) { setWon(true); setGameOver(true); }
    else if (nextShots % 6 === 0) {
      const pushed = [Array.from({ length: COLS }, () => Math.random() > .35 ? COLORS[Math.floor(Math.random() * COLORS.length)] : null), ...updated.slice(0, ROWS - 1)];
      setBoard(pushed);
      if (pushed[ROWS - 1].some(Boolean)) setGameOver(true);
    }
  }

  function restart() { setBoard(makeBoard()); setScore(0); setShots(0); setGameOver(false); setWon(false); setCurrent(COLORS[Math.floor(Math.random() * COLORS.length)]); }

  return <main className="bubble-page">
    <header className="bubble-header"><button className="bubble-back" onClick={onBack} aria-label="O‘yinlar ro‘yxatiga qaytish">‹</button><div><span>SAKURA · MINI O‘YIN</span><h1>Bubble Shooter</h1></div><button className="bubble-restart" onClick={restart}>Qayta</button></header>
    <div className="bubble-score"><span>BALL</span><strong>{score}</strong><span>OTISH: {shots}</span></div>
    <section className="bubble-stage" aria-label="Pufaklar maydoni">
      <svg viewBox="0 0 400 520" role="application" aria-label="Nishonni belgilash va pufak otish" onPointerMove={event => { if (!gameOver) { const rect = event.currentTarget.getBoundingClientRect(); setAim({ x: (event.clientX-rect.left)/rect.width*WIDTH, y:(event.clientY-rect.top)/rect.height*520 }); } }} onPointerDown={shoot}>
        <defs>{COLORS.map((color,i)=><radialGradient id={`bubble-shine-${i}`} key={color} cx="32%" cy="25%"><stop stopColor="white" stopOpacity=".75"/><stop offset=".3" stopColor={color}/><stop offset="1" stopColor={color}/></radialGradient>)}</defs>
        {board.map((row,r)=>row.map((color,c)=>color&&<circle key={`${r}-${c}`} cx={center(r,c).x} cy={center(r,c).y} r={R-1} fill={`url(#bubble-shine-${COLORS.indexOf(color)})`} stroke="white" strokeOpacity=".38" strokeWidth="1.5"/>))}
        <line x1="200" y1={LAUNCH_Y-24} x2={aim.x} y2={Math.max(80,aim.y)} className="bubble-aim" strokeDasharray="5 7"/>
        <path d="M174 499a27 27 0 0 1 52 0Z" fill="#ed82ad" stroke="#ffd7e5" strokeWidth="2"/><circle cx="200" cy={LAUNCH_Y} r="17" fill={`url(#bubble-shine-${COLORS.indexOf(current)})`} stroke="white" strokeOpacity=".5" strokeWidth="2"/>
        <line x1="12" y1="425" x2="388" y2="425" stroke="#ff91b4" strokeOpacity=".5" strokeDasharray="6 6"/>
        {gameOver&&<g><rect x="36" y="205" width="328" height="116" rx="22" fill="#17142d" stroke="#ef6c9c" strokeWidth="2"/><text x="200" y="251" textAnchor="middle" className="bubble-result">{won?"Ajoyib! Maydon tozalandi":"O‘yin tugadi"}</text><text x="200" y="281" textAnchor="middle" className="bubble-result-score">Ball: {score} · Qayta boshlash uchun «Qayta»ni bosing</text></g>}
      </svg>
    </section>
    <div className="bubble-instructions"><span className="bubble-next" style={{"--next-color":next}}/><p><strong>Navbatdagi rang</strong><br/>Mos rangli 3 yoki undan ko‘p pufakni birlashtiring.</p><span className="bubble-hint">Nishonga teging</span></div>
  </main>;
}
