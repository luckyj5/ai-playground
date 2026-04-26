import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useId } from 'react';
import { BALL_COLORS } from '../components/PoolBall';
import { GLOBAL_QUICKFIRE, formatMs, useQuickfire } from '../data/quickfire';

// 9-Ball Quickfire: click balls 1 through 9 in order on a felt table as
// quickly as possible. Timer starts on the first correct click; a miss (any
// ball out of sequence or an empty area) costs 500ms. Best time is persisted
// to localStorage and ranked against a seeded global leaderboard so players
// always have something to chase.

// Table layout sized in SVG user units; rendered responsive via viewBox.
const TABLE = { W: 880, H: 440 };
const PLAY = { x: 40, y: 40, w: 800, h: 360 };
const BALL_R = 22;

// Deterministic PRNG so a given `seed` always produces the same scatter.
// This way a "Replay same rack" button is possible and the recording stays
// reproducible during testing.
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6D2B79F5) >>> 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function scatter(seed: number): Array<{ n: number; x: number; y: number }> {
  const rand = mulberry32(seed);
  const placed: Array<{ n: number; x: number; y: number }> = [];
  for (let n = 1; n <= 9; n++) {
    // Rejection-sample until a spot is at least 2.4r away from all others.
    for (let attempt = 0; attempt < 400; attempt++) {
      const x = PLAY.x + BALL_R + rand() * (PLAY.w - BALL_R * 2);
      const y = PLAY.y + BALL_R + rand() * (PLAY.h - BALL_R * 2);
      const ok = placed.every(
        (p) => (p.x - x) ** 2 + (p.y - y) ** 2 > (BALL_R * 2.4) ** 2,
      );
      if (ok) {
        placed.push({ n, x, y });
        break;
      }
    }
  }
  return placed;
}

export default function Play() {
  const uid = useId().replace(/:/g, '');
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));
  const [next, setNext] = useState(1);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [wrong, setWrong] = useState(0);
  const [penaltyMs, setPenaltyMs] = useState(0);
  const [flashWrong, setFlashWrong] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => performance.now());
  const tickRef = useRef<number | undefined>(undefined);
  const submittedRef = useRef(false);
  const { record, submit } = useQuickfire();

  const balls = useMemo(() => scatter(seed), [seed]);

  useEffect(() => {
    if (startedAt !== null && endedAt === null) {
      const loop = () => {
        setNow(performance.now());
        tickRef.current = requestAnimationFrame(loop);
      };
      tickRef.current = requestAnimationFrame(loop);
      return () => {
        if (tickRef.current) cancelAnimationFrame(tickRef.current);
      };
    }
  }, [startedAt, endedAt]);

  const elapsedMs =
    startedAt === null
      ? 0
      : (endedAt ?? now) - startedAt + penaltyMs;

  const finalMs = endedAt !== null ? elapsedMs : null;

  useEffect(() => {
    if (finalMs !== null && !submittedRef.current) {
      submittedRef.current = true;
      submit(finalMs, wrong);
    }
  }, [finalMs, wrong, submit]);

  const resetGame = () => {
    submittedRef.current = false;
    setSeed(Math.floor(Math.random() * 1e9));
    setNext(1);
    setStartedAt(null);
    setEndedAt(null);
    setWrong(0);
    setPenaltyMs(0);
    setFlashWrong(null);
  };

  const handleBall = (n: number) => {
    if (endedAt !== null) return;
    if (n === next) {
      // eslint-disable-next-line react-hooks/purity -- event handler, not render
      const t = performance.now();
      if (startedAt === null) setStartedAt(t);
      if (n === 9) {
        setNext(10); // sentinel past 9
        setEndedAt(t);
      } else {
        setNext(n + 1);
      }
    } else {
      setWrong((w) => w + 1);
      setPenaltyMs((p) => p + 500);
      setFlashWrong(n);
      setTimeout(() => setFlashWrong((f) => (f === n ? null : f)), 400);
    }
  };

  // Build ranked list with user's best inserted as "You".
  const rankedBoard = useMemo(() => {
    const board = [...GLOBAL_QUICKFIRE];
    if (record.bestMs !== null) {
      board.push({
        player: 'You',
        country: '—',
        ms: record.bestMs,
        at: new Date().toISOString().slice(0, 10),
      });
    }
    return board.sort((a, b) => a.ms - b.ms);
  }, [record.bestMs]);

  const youRank = rankedBoard.findIndex((r) => r.player === 'You');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="section-eyebrow">Arcade</div>
          <h1 className="section-title mt-1">9-Ball Quickfire</h1>
          <p className="section-sub">
            Click 1 → 9 in order. First click starts the clock. Every wrong
            hit adds a 0.5s penalty. Beat your best time and climb the
            global board.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatPill label="Your best" value={record.bestMs === null ? '—' : formatMs(record.bestMs)} accent />
          <StatPill label="Plays" value={record.plays.toString()} />
          <button onClick={resetGame} className="btn-ghost">
            New rack
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Table */}
        <div
          className="relative rounded-2xl shadow-table"
          data-testid="quickfire-table"
        >
          <svg
            viewBox={`0 0 ${TABLE.W} ${TABLE.H}`}
            className="w-full select-none"
            role="img"
            aria-label="9-Ball Quickfire table"
          >
            <defs>
              <linearGradient id={`rail-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a2a1a" />
                <stop offset="50%" stopColor="#2B1810" />
                <stop offset="100%" stopColor="#150A06" />
              </linearGradient>
              <radialGradient id={`felt-${uid}`} cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#1F7F3F" />
                <stop offset="100%" stopColor="#0F5A2A" />
              </radialGradient>
              <radialGradient id={`shine-${uid}`} cx="30%" cy="24%" r="22%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <radialGradient id={`body-${uid}`} cx="35%" cy="30%" r="72%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width={TABLE.W} height={TABLE.H} rx="28" fill={`url(#rail-${uid})`} />
            <rect x={PLAY.x} y={PLAY.y} width={PLAY.w} height={PLAY.h} rx="14" fill={`url(#felt-${uid})`} />
            <rect
              x={PLAY.x}
              y={PLAY.y}
              width={PLAY.w}
              height={PLAY.h}
              rx="14"
              fill="none"
              stroke="rgba(0,0,0,0.35)"
              strokeWidth="3"
            />
            {[
              [PLAY.x + 6, PLAY.y + 6],
              [PLAY.x + PLAY.w / 2, PLAY.y + 2],
              [PLAY.x + PLAY.w - 6, PLAY.y + 6],
              [PLAY.x + 6, PLAY.y + PLAY.h - 6],
              [PLAY.x + PLAY.w / 2, PLAY.y + PLAY.h - 2],
              [PLAY.x + PLAY.w - 6, PLAY.y + PLAY.h - 6],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i === 1 || i === 4 ? 14 : 18}
                fill="#000"
              />
            ))}

            {balls.map((b) => {
              const isTarget = b.n === next;
              const dimmed = b.n < next;
              const isStripe = b.n === 9;
              const color = BALL_COLORS[b.n];
              const wrongFlash = flashWrong === b.n;
              return (
                <g
                  key={b.n}
                  onClick={() => handleBall(b.n)}
                  style={{ cursor: dimmed ? 'default' : 'pointer' }}
                  aria-label={`Ball ${b.n}`}
                  data-testid={`ball-${b.n}`}
                  className={wrongFlash ? 'animate-pulse' : ''}
                  opacity={dimmed ? 0.35 : 1}
                >
                  {isTarget ? (
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r={BALL_R + 7}
                      fill="none"
                      stroke="#F0C75E"
                      strokeWidth="3"
                      className="animate-pulse-soft"
                    />
                  ) : null}
                  {isStripe ? (
                    <>
                      <clipPath id={`qfclip-${b.n}-${uid}`}>
                        <circle cx={b.x} cy={b.y} r={BALL_R} />
                      </clipPath>
                      <g clipPath={`url(#qfclip-${b.n}-${uid})`}>
                        <circle cx={b.x} cy={b.y} r={BALL_R} fill="#F8F6ED" />
                        <rect
                          x={b.x - BALL_R}
                          y={b.y - BALL_R * 0.45}
                          width={BALL_R * 2}
                          height={BALL_R * 0.9}
                          fill={color}
                        />
                      </g>
                    </>
                  ) : (
                    <circle cx={b.x} cy={b.y} r={BALL_R} fill={color} />
                  )}
                  <circle cx={b.x} cy={b.y} r={BALL_R * 0.42} fill="#F8F6ED" />
                  <text
                    x={b.x}
                    y={b.y + BALL_R * 0.18}
                    textAnchor="middle"
                    fontFamily="Inter, Arial, sans-serif"
                    fontWeight={900}
                    fontSize={BALL_R * 0.65}
                    fill="#0A0A0A"
                  >
                    {b.n}
                  </text>
                  <circle cx={b.x} cy={b.y} r={BALL_R} fill={`url(#body-${uid})`} />
                  <circle cx={b.x} cy={b.y} r={BALL_R} fill={`url(#shine-${uid})`} />
                  {wrongFlash ? (
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r={BALL_R + 10}
                      fill="none"
                      stroke="#ff6161"
                      strokeWidth="2"
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {/* HUD overlay */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-3 rounded-full border border-cue-accent/30 bg-ink/80 px-3 py-1 text-xs font-medium text-chalk backdrop-blur">
            <span className="text-cue-accent">Next</span>
            <span className="font-display text-lg leading-none">{next <= 9 ? next : '✓'}</span>
            <span className="h-4 w-px bg-chalk/20" />
            <span>Time</span>
            <span className="font-mono tabular-nums">{formatMs(Math.max(0, elapsedMs | 0))}</span>
            {wrong > 0 ? (
              <>
                <span className="h-4 w-px bg-chalk/20" />
                <span className="text-red-400">Misses {wrong}</span>
              </>
            ) : null}
          </div>

          {endedAt !== null ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink/75 backdrop-blur-sm">
              <div className="card border-cue-accent/40 p-6 text-center">
                <div className="section-eyebrow">Rack cleared</div>
                <div className="mt-2 font-display text-5xl text-cue-accent">
                  {formatMs(finalMs ?? 0)}
                </div>
                <div className="mt-1 text-sm text-chalk-muted">
                  {wrong} miss{wrong === 1 ? '' : 'es'} ·{' '}
                  {record.bestMs !== null && finalMs !== null && finalMs <= record.bestMs
                    ? 'New personal best'
                    : record.bestMs !== null
                      ? `Best ${formatMs(record.bestMs)}`
                      : 'First run'}
                </div>
                <button onClick={resetGame} className="btn-primary mt-4">
                  Play again
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Leaderboard sidebar */}
        <aside className="card p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-xl text-chalk">Quickfire board</h3>
            <Link to="/leaderboard" className="text-xs text-cue-accent hover:underline">
              Full board →
            </Link>
          </div>
          <ol className="mt-4 space-y-1.5">
            {rankedBoard.slice(0, 8).map((row, i) => {
              const isYou = row.player === 'You';
              return (
                <li
                  key={`${row.player}-${i}`}
                  className={`flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm ${
                    isYou
                      ? 'border border-cue-accent/50 bg-cue-accent/10 text-cue-accent'
                      : 'text-chalk'
                  }`}
                >
                  <span className="w-6 font-mono text-xs text-chalk-muted">
                    {i + 1}
                  </span>
                  <span className={`flex-1 truncate ${isYou ? 'font-semibold' : ''}`}>
                    {row.player} <span className="text-chalk-muted">· {row.country}</span>
                  </span>
                  <span className="font-mono tabular-nums">{formatMs(row.ms)}</span>
                </li>
              );
            })}
          </ol>
          {youRank >= 0 && youRank > 7 ? (
            <div className="mt-3 rounded-md border border-cue-accent/40 bg-cue-accent/10 p-2 text-xs text-cue-accent">
              You're ranked #{youRank + 1} globally. Keep going.
            </div>
          ) : null}
          <p className="mt-4 text-xs text-chalk-muted">
            Times persist to this browser only. Global times are exhibition
            seeds — closer you get to the top, the sharper your cue.
          </p>
        </aside>
      </div>
    </div>
  );
}

function StatPill({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-md border px-3 py-1.5 text-sm ${
        accent
          ? 'border-cue-accent/40 bg-cue-accent/10 text-cue-accent'
          : 'border-chalk/15 bg-ink-soft text-chalk'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="font-mono text-base tabular-nums">{value}</div>
    </div>
  );
}
