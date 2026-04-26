import { players } from './mock';
import type { Player, Discipline } from '../types';

// Deterministic pseudo-random 0..1 from a string. Used so seeded "global" W/L
// and week deltas stay stable across renders and reloads without a backend.
function hash01(s: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export type RankRow = {
  player: Player;
  rating: number;
  weekDelta: number; // points up/down this week
  wins: number;
  losses: number;
  streak: number; // + wins in a row, - losses
  discipline: Discipline | 'all';
};

export function leaderboard(discipline: Discipline | 'all'): RankRow[] {
  const pool = players.filter(
    (p) => discipline === 'all' || p.disciplines.includes(discipline),
  );
  return pool
    .map((p) => {
      const r1 = hash01(p.id, 1);
      const r2 = hash01(p.id, 2);
      const r3 = hash01(p.id, 3);
      return {
        player: p,
        rating: p.rating,
        weekDelta: Math.round((r1 - 0.45) * 24),
        wins: 18 + Math.round(r2 * 20),
        losses: 4 + Math.round(r3 * 12),
        streak: Math.round((r2 - 0.4) * 12),
        discipline,
      } satisfies RankRow;
    })
    .sort((a, b) => b.rating - a.rating);
}

export type GlobalStat = {
  key: string;
  label: string;
  value: string;
  caption?: string;
};

export function globalStats(): GlobalStat[] {
  return [
    {
      key: 'frames',
      label: 'Frames played this week',
      value: '1,247',
      caption: '+18% week over week',
    },
    {
      key: 'break',
      label: 'Longest break',
      value: '147',
      caption: "Ronnie O'Sullivan · Crucible Masters",
    },
    {
      key: 'hill',
      label: 'Matches decided on the hill',
      value: '312',
      caption: '26% of all completed matches',
    },
    {
      key: 'streak',
      label: 'Hottest streak',
      value: 'W8',
      caption: 'Joshua Filler · 9-Ball',
    },
  ];
}

// For home mini-leaderboard ticker.
export function topByDiscipline(): Record<Discipline, RankRow[]> {
  return {
    '8-ball': leaderboard('8-ball').slice(0, 3),
    '9-ball': leaderboard('9-ball').slice(0, 3),
    snooker: leaderboard('snooker').slice(0, 3),
  };
}
