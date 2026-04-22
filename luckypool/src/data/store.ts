import { useCallback, useEffect, useState } from 'react';
import { matches as seedMatches, tournaments as seedTournaments } from './mock';
import type { Match, Tournament } from '../types';

const TOURNEYS_KEY = 'luckypool.tournaments.v1';
const MATCHES_KEY = 'luckypool.matches.v1';

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

// Lightweight global event bus so multiple hooks stay in sync.
type Listener = () => void;
const listeners = new Set<Listener>();
function notify() {
  for (const l of listeners) l();
}

export function useTournaments(): [
  Tournament[],
  (updater: (prev: Tournament[]) => Tournament[]) => void,
] {
  const [state, setState] = useState<Tournament[]>(() =>
    load<Tournament[]>(TOURNEYS_KEY, seedTournaments),
  );
  useEffect(() => {
    const l = () => setState(load<Tournament[]>(TOURNEYS_KEY, seedTournaments));
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  const update = useCallback(
    (updater: (prev: Tournament[]) => Tournament[]) => {
      setState((prev) => {
        const next = updater(prev);
        save(TOURNEYS_KEY, next);
        notify();
        return next;
      });
    },
    [],
  );
  return [state, update];
}

export function useMatches(): [
  Match[],
  (updater: (prev: Match[]) => Match[]) => void,
] {
  const [state, setState] = useState<Match[]>(() =>
    load<Match[]>(MATCHES_KEY, seedMatches),
  );
  useEffect(() => {
    const l = () => setState(load<Match[]>(MATCHES_KEY, seedMatches));
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  const update = useCallback(
    (updater: (prev: Match[]) => Match[]) => {
      setState((prev) => {
        const next = updater(prev);
        save(MATCHES_KEY, next);
        notify();
        return next;
      });
    },
    [],
  );
  return [state, update];
}

export function resetAll() {
  save(TOURNEYS_KEY, seedTournaments);
  save(MATCHES_KEY, seedMatches);
  notify();
}
