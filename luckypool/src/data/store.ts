import { useCallback, useSyncExternalStore } from 'react';
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

// useSyncExternalStore needs a stable snapshot reference across reads that
// observe no change. We cache the last materialized value per key; reads
// only re-hydrate from localStorage on the first access after an external
// mutation.
const cache = new Map<string, unknown>();
const subscribers = new Set<() => void>();

function subscribe(listener: () => void) {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
}

function emitChange(key: string) {
  cache.delete(key);
  for (const l of subscribers) l();
}

function getOrLoad<T>(key: string, fallback: T): T {
  if (!cache.has(key)) cache.set(key, load<T>(key, fallback));
  return cache.get(key) as T;
}

// Server snapshot: used during SSR to avoid mismatches. We have no SSR here
// but useSyncExternalStore still requires the argument in some setups.
function getServerSnapshot<T>(fallback: T): () => T {
  return () => fallback;
}

export function useTournaments(): [
  Tournament[],
  (updater: (prev: Tournament[]) => Tournament[]) => void,
] {
  const state = useSyncExternalStore(
    subscribe,
    () => getOrLoad<Tournament[]>(TOURNEYS_KEY, seedTournaments),
    getServerSnapshot(seedTournaments),
  );
  const update = useCallback(
    (updater: (prev: Tournament[]) => Tournament[]) => {
      const prev = getOrLoad<Tournament[]>(TOURNEYS_KEY, seedTournaments);
      const next = updater(prev);
      cache.set(TOURNEYS_KEY, next);
      save(TOURNEYS_KEY, next);
      for (const l of subscribers) l();
    },
    [],
  );
  return [state, update];
}

export function useMatches(): [
  Match[],
  (updater: (prev: Match[]) => Match[]) => void,
] {
  const state = useSyncExternalStore(
    subscribe,
    () => getOrLoad<Match[]>(MATCHES_KEY, seedMatches),
    getServerSnapshot(seedMatches),
  );
  const update = useCallback(
    (updater: (prev: Match[]) => Match[]) => {
      const prev = getOrLoad<Match[]>(MATCHES_KEY, seedMatches);
      const next = updater(prev);
      cache.set(MATCHES_KEY, next);
      save(MATCHES_KEY, next);
      for (const l of subscribers) l();
    },
    [],
  );
  return [state, update];
}

export function resetAll() {
  save(TOURNEYS_KEY, seedTournaments);
  save(MATCHES_KEY, seedMatches);
  emitChange(TOURNEYS_KEY);
  emitChange(MATCHES_KEY);
}
