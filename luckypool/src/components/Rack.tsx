import { useId, type ReactElement } from 'react';
import { BALL_COLORS } from './PoolBall';

type Discipline = '8-ball' | '9-ball' | 'snooker';

// Render a pocketed felt table with a discipline-appropriate rack, as SVG so
// it scales crisply at any card size.
export function Rack({
  discipline,
  className = '',
  ariaLabel,
}: {
  discipline: Discipline;
  className?: string;
  ariaLabel?: string;
}) {
  const uid = useId().replace(/:/g, '');
  // Table inner playing area is 400x200; outer viewBox adds rail + pocket room.
  const W = 440;
  const H = 240;
  const inner = { x: 20, y: 20, w: 400, h: 200 };
  const isSnooker = discipline === 'snooker';
  const feltColor = isSnooker ? '#0E3B2B' : '#0F5A2A';
  const feltHighlight = isSnooker ? '#155B44' : '#1F7F3F';
  const railColor = '#2B1810';
  const railHighlight = '#4a2a1a';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={
        ariaLabel ??
        (discipline === '8-ball'
          ? '8-ball rack on a pool table'
          : discipline === '9-ball'
            ? '9-ball rack on a pool table'
            : 'snooker break on a snooker table')
      }
    >
      <defs>
        <linearGradient id={`rail-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={railHighlight} />
          <stop offset="50%" stopColor={railColor} />
          <stop offset="100%" stopColor="#150A06" />
        </linearGradient>
        <radialGradient id={`felt-${uid}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={feltHighlight} />
          <stop offset="100%" stopColor={feltColor} />
        </radialGradient>
        <radialGradient id={`shine-${uid}`} cx="30%" cy="24%" r="22%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={`body-${uid}`} cx="35%" cy="30%" r="72%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </radialGradient>
      </defs>
      {/* Rail */}
      <rect x="0" y="0" width={W} height={H} rx="22" ry="22" fill={`url(#rail-${uid})`} />
      {/* Felt */}
      <rect
        x={inner.x}
        y={inner.y}
        width={inner.w}
        height={inner.h}
        rx="10"
        ry="10"
        fill={`url(#felt-${uid})`}
      />
      {/* Inner rail shadow */}
      <rect
        x={inner.x}
        y={inner.y}
        width={inner.w}
        height={inner.h}
        rx="10"
        ry="10"
        fill="none"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="3"
      />
      {/* Pockets */}
      {[
        [inner.x + 4, inner.y + 4],
        [inner.x + inner.w / 2, inner.y + 2],
        [inner.x + inner.w - 4, inner.y + 4],
        [inner.x + 4, inner.y + inner.h - 4],
        [inner.x + inner.w / 2, inner.y + inner.h - 2],
        [inner.x + inner.w - 4, inner.y + inner.h - 4],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 1 || i === 4 ? 8 : 10} fill="#000" />
      ))}
      {/* Baulk line + spots for snooker */}
      {isSnooker ? (
        <>
          <line
            x1={inner.x + inner.w * 0.22}
            y1={inner.y + 10}
            x2={inner.x + inner.w * 0.22}
            y2={inner.y + inner.h - 10}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />
          <circle
            cx={inner.x + inner.w * 0.22}
            cy={inner.y + inner.h / 2}
            r="22"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
          />
        </>
      ) : null}
      {/* Discipline-specific rack. Apex (1-ball) sits on the foot spot at
          ~3/4 of the table length and points toward the cue ball on the
          breaking side (left). Triangle/diamond expands toward the foot rail. */}
      {discipline === '8-ball' ? (
        <EightBallRack uid={uid} apex={{ x: inner.x + inner.w * 0.62, y: inner.y + inner.h / 2 }} />
      ) : discipline === '9-ball' ? (
        <NineBallRack uid={uid} apex={{ x: inner.x + inner.w * 0.62, y: inner.y + inner.h / 2 }} />
      ) : (
        <SnookerBreak uid={uid} inner={inner} />
      )}
    </svg>
  );
}

// Shared ball renderer that doesn't wrap its own svg (for composition inside
// the table SVG). `n=0` + `cue` renders the cue ball.
function Ball({
  cx,
  cy,
  r,
  n,
  cue,
  uid,
}: {
  cx: number;
  cy: number;
  r: number;
  n?: number;
  cue?: boolean;
  uid: string;
}) {
  const color = cue ? '#F8F6ED' : (BALL_COLORS[n ?? 0] ?? '#F8F6ED');
  const stripe = !cue && (n ?? 0) >= 9 && (n ?? 0) <= 15;
  const clip = `ball-clip-${uid}-${n ?? 'cue'}-${Math.round(cx)}-${Math.round(cy)}`;
  return (
    <g>
      {stripe ? (
        <>
          <defs>
            <clipPath id={clip}>
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <circle cx={cx} cy={cy} r={r} fill="#F8F6ED" />
            <rect x={cx - r} y={cy - r * 0.45} width={r * 2} height={r * 0.9} fill={color} />
          </g>
        </>
      ) : (
        <circle cx={cx} cy={cy} r={r} fill={color} />
      )}
      {!cue && n !== undefined && n > 0 ? (
        <>
          <circle cx={cx} cy={cy} r={r * 0.42} fill="#F8F6ED" />
          <text
            x={cx}
            y={cy + r * 0.18}
            textAnchor="middle"
            fontFamily="Inter, Arial, sans-serif"
            fontWeight={900}
            fontSize={r * 0.65}
            fill="#0A0A0A"
          >
            {n}
          </text>
        </>
      ) : null}
      <circle cx={cx} cy={cy} r={r} fill={`url(#body-${uid})`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#shine-${uid})`} />
    </g>
  );
}

// Standard 8-ball rack: 5 columns running from apex (left, 1-ball on the
// foot spot) to the base row of 5 (right, against the foot rail).
// 8 sits in the middle of column 2 (3rd column). Corners of the base row
// are one solid (7) and one stripe (9) — opposite-corner rule.
const EIGHT_BALL_COLS: number[][] = [
  [1],
  [11, 5],
  [2, 8, 10],
  [4, 12, 6, 13],
  [7, 14, 3, 15, 9],
];

function EightBallRack({ uid, apex }: { uid: string; apex: { x: number; y: number } }) {
  const r = 11;
  const dx = r * 1.8; // column-to-column spacing (rack tightening)
  const dy = r * 2 + 0.5; // ball-to-ball within a column
  const balls: ReactElement[] = [];
  EIGHT_BALL_COLS.forEach((col, i) => {
    const x = apex.x + i * dx;
    const offset = (col.length - 1) / 2;
    col.forEach((n, j) => {
      const y = apex.y + (j - offset) * dy;
      balls.push(<Ball key={`${i}-${j}`} uid={uid} cx={x} cy={y} r={r} n={n} />);
    });
  });
  // Cue ball roughly on the head spot (~1/4 across), aimed at the rack apex.
  balls.unshift(
    <Ball key="cue" uid={uid} cx={apex.x - 150} cy={apex.y} r={r} cue />,
  );
  return <g>{balls}</g>;
}

// 9-ball diamond rack viewed from above: apex (1) on the foot spot at
// left, 9 in the middle column, 2-8 around. Columns: 1 / 2,3 / 4,9,5 / 6,7 / 8.
const NINE_BALL_COLS: number[][] = [[1], [2, 3], [4, 9, 5], [6, 7], [8]];

function NineBallRack({ uid, apex }: { uid: string; apex: { x: number; y: number } }) {
  const r = 12;
  const dx = r * 1.8;
  const dy = r * 2 + 0.5;
  const balls: ReactElement[] = [];
  NINE_BALL_COLS.forEach((col, i) => {
    const x = apex.x + i * dx;
    const offset = (col.length - 1) / 2;
    col.forEach((n, j) => {
      const y = apex.y + (j - offset) * dy;
      balls.push(<Ball key={`${i}-${j}`} uid={uid} cx={x} cy={y} r={r} n={n} />);
    });
  });
  balls.unshift(
    <Ball key="cue" uid={uid} cx={apex.x - 150} cy={apex.y} r={r} cue />,
  );
  return <g>{balls}</g>;
}

// Snooker initial break: 15 reds in a tight triangle behind pink, plus the
// 6 colors on their spots (yellow/green/brown on baulk, blue center, pink
// in front of reds, black behind).
function SnookerBreak({
  uid,
  inner,
}: {
  uid: string;
  inner: { x: number; y: number; w: number; h: number };
}) {
  const r = 7;
  const dx = r * 2 + 0.4;
  const dy = r * 1.85;
  const redApex = { x: inner.x + inner.w * 0.72, y: inner.y + inner.h / 2 };
  const reds: ReactElement[] = [];
  for (let i = 0; i < 5; i++) {
    const count = i + 1;
    const x = redApex.x + i * dx;
    const offset = (count - 1) / 2;
    for (let j = 0; j < count; j++) {
      const y = redApex.y + (j - offset) * dy;
      reds.push(
        <circle
          key={`r-${i}-${j}`}
          cx={x}
          cy={y}
          r={r}
          fill="#C8102E"
        />,
      );
      reds.push(
        <circle
          key={`rs-${i}-${j}`}
          cx={x}
          cy={y}
          r={r}
          fill={`url(#body-${uid})`}
        />,
      );
      reds.push(
        <circle
          key={`rh-${i}-${j}`}
          cx={x}
          cy={y}
          r={r}
          fill={`url(#shine-${uid})`}
        />,
      );
    }
  }
  // Colors on spots
  const baulkX = inner.x + inner.w * 0.22;
  const centerY = inner.y + inner.h / 2;
  const colors = [
    { cx: baulkX, cy: centerY - 22, color: '#2F9C4C' }, // green
    { cx: baulkX, cy: centerY + 22, color: '#F2C82F' }, // yellow
    { cx: baulkX, cy: centerY, color: '#8C4A26' }, // brown
    { cx: inner.x + inner.w / 2, cy: centerY, color: '#1F57B3' }, // blue
    { cx: redApex.x - 18, cy: centerY, color: '#E7679A' }, // pink
    { cx: inner.x + inner.w - 30, cy: centerY, color: '#111' }, // black
  ];
  // Cue ball in the D
  return (
    <g>
      {reds}
      {colors.map((c, i) => (
        <g key={`c-${i}`}>
          <circle cx={c.cx} cy={c.cy} r={r} fill={c.color} />
          <circle cx={c.cx} cy={c.cy} r={r} fill={`url(#body-${uid})`} />
          <circle cx={c.cx} cy={c.cy} r={r} fill={`url(#shine-${uid})`} />
        </g>
      ))}
      <circle cx={baulkX - 18} cy={centerY} r={r} fill="#F8F6ED" />
      <circle cx={baulkX - 18} cy={centerY} r={r} fill={`url(#body-${uid})`} />
      <circle cx={baulkX - 18} cy={centerY} r={r} fill={`url(#shine-${uid})`} />
    </g>
  );
}
