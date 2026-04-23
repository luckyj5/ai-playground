import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { players } from '../data/mock';
import { Avatar } from '../components/Avatar';
import { DisciplineBadge } from '../components/DisciplineBadge';
import type { Discipline } from '../types';

export default function Players() {
  const [q, setQ] = useState('');
  const [discipline, setDiscipline] = useState<Discipline | 'all'>('all');

  const list = useMemo(() => {
    return players
      .filter((p) => {
        if (
          discipline !== 'all' &&
          !p.disciplines.includes(discipline)
        )
          return false;
        if (q) {
          const needle = q.toLowerCase();
          return (
            p.name.toLowerCase().includes(needle) ||
            p.handle.toLowerCase().includes(needle) ||
            p.country.toLowerCase().includes(needle)
          );
        }
        return true;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [q, discipline]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="section-title">Players</h1>
      <p className="section-sub">
        Profiles, ratings and disciplines from across the LuckyPool network.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          className="input max-w-xs"
          placeholder="Search players, handles, countries…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-1 rounded-md border border-chalk/10 bg-chalk/[0.05] p-1">
          <button
            onClick={() => setDiscipline('all')}
            className={`rounded px-2.5 py-1 text-xs ${
              discipline === 'all'
                ? 'bg-cue text-ink'
                : 'text-chalk/70 hover:bg-chalk/[0.05]'
            }`}
          >
            All
          </button>
          {(['8-ball', '9-ball', 'snooker'] as Discipline[]).map((d) => (
            <button
              key={d}
              onClick={() => setDiscipline(d)}
              className={`rounded px-2.5 py-1 text-xs ${
                discipline === d
                  ? 'bg-cue text-ink'
                  : 'text-chalk/70 hover:bg-chalk/[0.05]'
              }`}
            >
              {d === '8-ball' ? '8-Ball' : d === '9-ball' ? '9-Ball' : 'Snooker'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link
            key={p.id}
            to={`/players/${p.id}`}
            className="card flex items-center gap-4 p-4 transition-colors hover:border-cue-accent/40"
          >
            <Avatar name={p.name} hue={p.avatarHue} size={56} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="text-xs text-chalk-muted">
                    @{p.handle} · {p.country}
                  </div>
                </div>
                <div className="font-mono text-lg text-cue-accent">
                  {p.rating}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.disciplines.map((d) => (
                  <DisciplineBadge key={d} discipline={d} />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
