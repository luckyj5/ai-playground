import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTournaments } from '../data/store';
import { TournamentCard } from '../components/TournamentCard';
import type { Discipline, Tournament } from '../types';

const disciplines: Discipline[] = ['8-ball', '9-ball', 'snooker'];
const statuses: Tournament['status'][] = [
  'live',
  'registering',
  'upcoming',
  'completed',
];

export default function Tournaments() {
  const [tournaments] = useTournaments();
  const [q, setQ] = useState('');
  const [discipline, setDiscipline] = useState<Discipline | 'all'>('all');
  const [status, setStatus] = useState<Tournament['status'] | 'all'>('all');

  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      if (discipline !== 'all' && t.discipline !== discipline) return false;
      if (status !== 'all' && t.status !== status) return false;
      if (q && !t.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tournaments, q, discipline, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Tournaments</h1>
          <p className="section-sub">
            Explore active, upcoming and past events across 8-ball, 9-ball
            and snooker.
          </p>
        </div>
        <Link to="/builder" className="btn-primary">
          Create tournament
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          className="input max-w-xs"
          placeholder="Search tournaments…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1">
          <FilterBtn
            active={discipline === 'all'}
            onClick={() => setDiscipline('all')}
          >
            All games
          </FilterBtn>
          {disciplines.map((d) => (
            <FilterBtn
              key={d}
              active={discipline === d}
              onClick={() => setDiscipline(d)}
            >
              {d === '8-ball' ? '8-Ball' : d === '9-ball' ? '9-Ball' : 'Snooker'}
            </FilterBtn>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1">
          <FilterBtn active={status === 'all'} onClick={() => setStatus('all')}>
            All status
          </FilterBtn>
          {statuses.map((s) => (
            <FilterBtn
              key={s}
              active={status === s}
              onClick={() => setStatus(s)}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </FilterBtn>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TournamentCard key={t.id} tournament={t} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full card p-10 text-center text-chalk/60">
            No tournaments match those filters.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-2.5 py-1 text-xs transition-colors ${
        active
          ? 'bg-cue text-ink'
          : 'text-chalk/70 hover:bg-white/5 hover:text-chalk'
      }`}
    >
      {children}
    </button>
  );
}
