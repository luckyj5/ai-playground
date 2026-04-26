import { useId } from 'react';

// Canonical billiard-ball color palette (solids 1-7, 8-ball, stripes 9-15).
// Stripes reuse the solid color and layer a white band top & bottom.
// eslint-disable-next-line react-refresh/only-export-components
export const BALL_COLORS: Record<number, string> = {
  1: '#EFC13B', // yellow
  2: '#1D4E9E', // blue
  3: '#D93A2B', // red
  4: '#5E2D86', // purple
  5: '#E6782F', // orange
  6: '#1F7F3F', // green
  7: '#73161C', // maroon
  8: '#0A0A0A', // black
  9: '#EFC13B',
  10: '#1D4E9E',
  11: '#D93A2B',
  12: '#5E2D86',
  13: '#E6782F',
  14: '#1F7F3F',
  15: '#73161C',
};

export function PoolBall({
  number,
  size = 28,
  className = '',
  dimmed = false,
  highlight = false,
  cueBall = false,
}: {
  number?: number;
  size?: number;
  className?: string;
  dimmed?: boolean;
  highlight?: boolean;
  cueBall?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const n = number ?? 0;
  const color = cueBall ? '#F8F6ED' : (BALL_COLORS[n] ?? '#F8F6ED');
  const stripe = !cueBall && n >= 9 && n <= 15;
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`${dimmed ? 'opacity-40 saturate-50' : ''} ${
        highlight ? 'drop-shadow-[0_0_8px_rgba(240,199,94,0.85)]' : ''
      } ${className}`}
    >
      <defs>
        <radialGradient id={`body-${uid}`} cx="35%" cy="30%" r="72%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
        </radialGradient>
        <radialGradient id={`shine-${uid}`} cx="30%" cy="24%" r="22%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <clipPath id={`clip-${uid}`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>
      {stripe ? (
        <g clipPath={`url(#clip-${uid})`}>
          <rect x="0" y="0" width="64" height="64" fill="#F8F6ED" />
          <rect x="0" y="18" width="64" height="28" fill={color} />
        </g>
      ) : (
        <circle cx="32" cy="32" r="30" fill={color} />
      )}
      {!cueBall && n > 0 ? (
        <>
          <circle cx="32" cy="32" r="11" fill="#F8F6ED" />
          <text
            x="32"
            y="36.5"
            textAnchor="middle"
            fontFamily="Inter, Arial, sans-serif"
            fontWeight={900}
            fontSize={13}
            fill="#0A0A0A"
          >
            {n}
          </text>
        </>
      ) : null}
      <circle cx="32" cy="32" r="30" fill={`url(#body-${uid})`} />
      <circle cx="32" cy="32" r="30" fill={`url(#shine-${uid})`} />
    </svg>
  );
}

// Solid red "red" used in snooker racks. No number disc.
export function SnookerBall({
  color,
  size = 20,
  className = '',
}: {
  color: string;
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}>
      <defs>
        <radialGradient id={`snk-body-${uid}`} cx="35%" cy="30%" r="72%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
        </radialGradient>
        <radialGradient id={`snk-shine-${uid}`} cx="30%" cy="22%" r="22%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={color} />
      <circle cx="32" cy="32" r="30" fill={`url(#snk-body-${uid})`} />
      <circle cx="32" cy="32" r="30" fill={`url(#snk-shine-${uid})`} />
    </svg>
  );
}

// Small inline 8-ball used as the brand logo mark.
export function EightBallLogo({ size = 36 }: { size?: number }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 64 64" width={size} height={size}>
      <defs>
        <radialGradient id={`logo-body-${uid}`} cx="35%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#5a5a60" />
          <stop offset="45%" stopColor="#15161a" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <radialGradient id={`logo-shine-${uid}`} cx="30%" cy="24%" r="24%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={`logo-disc-${uid}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFFDF4" />
          <stop offset="100%" stopColor="#D7D2BE" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#logo-body-${uid})`} />
      <circle cx="32" cy="32" r="12.5" fill={`url(#logo-disc-${uid})`} />
      <text
        x="32"
        y="37.5"
        textAnchor="middle"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight={900}
        fontSize={15}
        fill="#050505"
      >
        8
      </text>
      <circle cx="32" cy="32" r="30" fill={`url(#logo-shine-${uid})`} />
    </svg>
  );
}
