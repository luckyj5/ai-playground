import { Link } from 'react-router-dom';
import type { Tournament } from '../types';
import { getVenue } from '../data/mock';
import { prettyFormat } from '../lib/format';
import { DisciplineBadge } from './DisciplineBadge';

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const venue = getVenue(tournament.venueId);
  const start = new Date(tournament.startDate);
  const end = tournament.endDate ? new Date(tournament.endDate) : undefined;
  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className="card group block overflow-hidden transition-colors hover:border-cue-accent/40"
    >
      <div
        className="h-24 w-full"
        style={{
          background: `linear-gradient(135deg, hsl(${tournament.bannerHue} 60% 30%) 0%, hsl(${
            (tournament.bannerHue + 40) % 360
          } 70% 22%) 60%, #0B1410 100%)`,
        }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <DisciplineBadge discipline={tournament.discipline} />
          <StatusChip status={tournament.status} />
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug text-chalk group-hover:text-cue-accent">
          {tournament.name}
        </h3>
        <div className="mt-1 text-xs text-chalk-muted">
          {venue?.name} · {venue?.city}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-chalk/70">
          <Stat label="Format" value={prettyFormat(tournament.format)} />
          <Stat label="Race" value={`To ${tournament.raceTo}`} />
          <Stat
            label="Prize"
            value={`$${tournament.prizePool.toLocaleString()}`}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-chalk-muted">
          <span>
            {start.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {end
              ? ` – ${end.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}`
              : ''}
          </span>
          <span>{tournament.playerIds.length} players</span>
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-chalk/10 bg-ink-soft/60 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-chalk-muted">
        {label}
      </div>
      <div className="text-sm text-chalk">{value}</div>
    </div>
  );
}

export function StatusChip({ status }: { status: Tournament['status'] }) {
  const map: Record<Tournament['status'], string> = {
    upcoming: 'border-chalk/15 bg-chalk/[0.05] text-chalk/70',
    registering: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    live: 'border-red-400/40 bg-red-500/10 text-red-300',
    completed: 'border-chalk/10 bg-ink-soft/70 text-chalk-muted',
  };
  const label: Record<Tournament['status'], string> = {
    upcoming: 'Upcoming',
    registering: 'Registering',
    live: 'Live',
    completed: 'Completed',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {status === 'live' && (
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-red-400" />
      )}
      {label[status]}
    </span>
  );
}

