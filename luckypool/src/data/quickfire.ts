import { useCallback, useSyncExternalStore } from 'react';

// localStorage-backed best-time store for the 9-Ball Quickfire game.
// Kept separate from the tournaments/matches store because the surface area
// is small and the update pattern is different (append-only history).

export type QuickfireRecord = {
  bestMs: number | null;
  plays: number;
  history: Array<{ ms: number; at: string; wrong: number }>;
};

const KEY = 'luckypool.quickfire.v1';
const INITIAL: QuickfireRecord = { bestMs: null, plays: 0, history: [] };

function load(): QuickfireRecord {
  if (typeof window === 'undefined') return INITIAL;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as QuickfireRecord;
    return {
      bestMs: parsed.bestMs ?? null,
      plays: parsed.plays ?? 0,
      history: Array.isArray(parsed.history) ? parsed.history.slice(-20) : [],
    };
  } catch {
    return INITIAL;
  }
}

function save(value: QuickfireRecord) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

let snapshot: QuickfireRecord | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): QuickfireRecord {
  if (snapshot === null) snapshot = load();
  return snapshot;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function commit(next: QuickfireRecord) {
  snapshot = next;
  save(next);
  for (const l of listeners) l();
}

export function useQuickfire(): {
  record: QuickfireRecord;
  submit: (ms: number, wrong: number) => { improved: boolean; delta: number | null };
  reset: () => void;
} {
  const record = useSyncExternalStore(subscribe, getSnapshot, () => INITIAL);
  const submit = useCallback((ms: number, wrong: number) => {
    const prev = getSnapshot();
    const improved = prev.bestMs === null || ms < prev.bestMs;
    const delta = prev.bestMs === null ? null : ms - prev.bestMs;
    const next: QuickfireRecord = {
      bestMs: improved ? ms : prev.bestMs,
      plays: prev.plays + 1,
      history: [...prev.history, { ms, at: new Date().toISOString(), wrong }].slice(-20),
    };
    commit(next);
    return { improved, delta };
  }, []);
  const reset = useCallback(() => commit(INITIAL), []);
  return { record, submit, reset };
}

// Seeded "global" leaderboard so the user has something to chase. These are
// fictional but deliberately tight so a good run can crack the top 5.
export const GLOBAL_QUICKFIRE: Array<{
  player: string;
  country: string;
  ms: number;
  at: string;
}> = [
  { player: 'Joshua Filler', country: 'DE', ms: 5820, at: '2026-04-19' },
  { player: 'Jayson Shaw', country: 'GB', ms: 5960, at: '2026-04-18' },
  { player: 'Fedor Gorst', country: 'US', ms: 6110, at: '2026-04-21' },
  { player: 'Chen Siming', country: 'CN', ms: 6380, at: '2026-04-20' },
  { player: 'Efren Reyes', country: 'PH', ms: 6520, at: '2026-04-17' },
  { player: 'Jasmin Ouschan', country: 'AT', ms: 6740, at: '2026-04-21' },
  { player: 'Mika Immonen', country: 'FI', ms: 6980, at: '2026-04-16' },
  { player: 'Johnny Archer', country: 'US', ms: 7210, at: '2026-04-15' },
  { player: 'Ralf Souquet', country: 'DE', ms: 7440, at: '2026-04-14' },
  { player: 'Earl Strickland', country: 'US', ms: 7680, at: '2026-04-13' },
];

export function formatMs(ms: number): string {
  if (ms < 60_000) return `${(ms / 1000).toFixed(2)}s`;
  const m = Math.floor(ms / 60_000);
  const s = ((ms % 60_000) / 1000).toFixed(2);
  return `${m}m ${s}s`;
}
