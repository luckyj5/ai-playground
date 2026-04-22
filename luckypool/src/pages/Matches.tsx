import { useMemo, useState } from 'react';
import { MatchCard } from '../components/MatchCard';
import { getPlayer } from '../data/mock';
import { useMatches, useTournaments } from '../data/store';
import type { Match } from '../types';

type StatusFilter = Match['status'] | 'all';

export default function Matches() {
  const [matches] = useMatches();
  const [tournaments] = useTournaments();
  const [status, setStatus] = useState<StatusFilter>('all');
  const tournamentMap = useMemo(
    () => new Map(tournaments.map((t) => [t.id, t])),
    [tournaments],
  );

  const list = useMemo(() => {
    const filtered =
      status === 'all'
        ? matches
        : matches.filter((m) => m.status === status);
    return [...filtered].sort((a, b) => {
      const order = { live: 0, scheduled: 1, completed: 2 };
      if (a.status !== b.status) return order[a.status] - order[b.status];
      const at = a.scheduledAt ? Date.parse(a.scheduledAt) : 0;
      const bt = b.scheduledAt ? Date.parse(b.scheduledAt) : 0;
      return a.status === 'completed' ? bt - at : at - bt;
    });
  }, [matches, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="section-title">Matches</h1>
      <p className="section-sub">
        Every match streamed to the platform, across every tournament.
      </p>

      <div className="mt-6 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1">
        {(['all', 'live', 'scheduled', 'completed'] as StatusFilter[]).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded px-3 py-1 text-xs capitalize transition-colors ${
                status === s
                  ? 'bg-cue text-ink'
                  : 'text-chalk/70 hover:bg-white/5 hover:text-chalk'
              }`}
            >
              {s}
            </button>
          ),
        )}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {list.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            playerA={getPlayer(m.playerAId)}
            playerB={getPlayer(m.playerBId)}
            tournamentName={tournamentMap.get(m.tournamentId)?.name}
          />
        ))}
        {list.length === 0 && (
          <div className="col-span-full card p-10 text-center text-chalk/60">
            No matches match those filters.
          </div>
        )}
      </div>
    </div>
  );
}
