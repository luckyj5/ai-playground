import { Link, useParams } from 'react-router-dom';
import { useMatches, useTournaments } from '../data/store';
import { getPlayer, getVenue, players } from '../data/mock';
import { DisciplineBadge } from '../components/DisciplineBadge';
import { StatusChip } from '../components/TournamentCard';
import { prettyFormat } from '../lib/format';
import { Bracket } from '../components/Bracket';
import { MatchCard } from '../components/MatchCard';
import { buildSingleElimBracket } from '../lib/bracket';
import { Avatar } from '../components/Avatar';

export default function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const [tournaments] = useTournaments();
  const [matches] = useMatches();
  const tournament = tournaments.find((t) => t.id === id);

  if (!tournament) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="section-title">Tournament not found</h1>
        <Link to="/tournaments" className="mt-6 inline-block btn-primary">
          Back to tournaments
        </Link>
      </div>
    );
  }

  const venue = getVenue(tournament.venueId);
  const tMatches = matches.filter((m) => m.tournamentId === tournament.id);
  const bracket = buildSingleElimBracket(tMatches, getPlayer);
  const roster = tournament.playerIds
    .map((pid) => players.find((p) => p.id === pid))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12"
        style={{
          background: `linear-gradient(135deg, hsl(${tournament.bannerHue} 60% 25%) 0%, hsl(${
            (tournament.bannerHue + 40) % 360
          } 60% 18%) 60%, #041A0D 100%)`,
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <DisciplineBadge discipline={tournament.discipline} />
          <StatusChip status={tournament.status} />
          <span className="chip">{prettyFormat(tournament.format)}</span>
          <span className="chip">Race to {tournament.raceTo}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-5xl">
          {tournament.name}
        </h1>
        <p className="mt-3 max-w-3xl text-chalk/80">{tournament.description}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <InfoStat label="Venue" value={`${venue?.name ?? 'TBD'}`} sub={venue?.city} />
          <InfoStat
            label="Dates"
            value={new Date(tournament.startDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
            sub={
              tournament.endDate
                ? `through ${new Date(tournament.endDate).toLocaleDateString(
                    undefined,
                    { month: 'short', day: 'numeric', year: 'numeric' },
                  )}`
                : undefined
            }
          />
          <InfoStat
            label="Prize pool"
            value={`$${tournament.prizePool.toLocaleString()}`}
            sub={
              tournament.entryFee
                ? `Entry $${tournament.entryFee}`
                : 'Invitational'
            }
          />
          <InfoStat
            label="Field"
            value={`${tournament.playerIds.length} players`}
            sub={`${tMatches.length} matches`}
          />
        </div>
      </div>

      {/* Bracket */}
      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title">Bracket</h2>
          {tournament.status === 'registering' && (
            <span className="chip">Draw not yet generated</span>
          )}
        </div>
        <Bracket rounds={bracket} />
      </section>

      {/* Matches */}
      <section className="mt-12">
        <h2 className="section-title mb-4">Matches</h2>
        {tMatches.length === 0 ? (
          <div className="card p-8 text-center text-chalk/60">
            Matches will appear once the bracket is drawn.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {tMatches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                playerA={getPlayer(m.playerAId)}
                playerB={getPlayer(m.playerBId)}
                tournamentName={tournament.name}
              />
            ))}
          </div>
        )}
      </section>

      {/* Players */}
      <section className="mt-12">
        <h2 className="section-title mb-4">Field</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {roster.map((p) =>
            p ? (
              <Link
                key={p.id}
                to={`/players/${p.id}`}
                className="card flex items-center gap-3 p-3 transition-colors hover:border-cue-accent/40"
              >
                <Avatar name={p.name} hue={p.avatarHue} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-chalk/50">
                    {p.country} · Rating {p.rating}
                  </div>
                </div>
              </Link>
            ) : null,
          )}
        </div>
      </section>
    </div>
  );
}

function InfoStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur">
      <div className="text-[10px] uppercase tracking-widest text-chalk/50">
        {label}
      </div>
      <div className="mt-1 font-display text-xl text-chalk">{value}</div>
      {sub && <div className="text-xs text-chalk/50">{sub}</div>}
    </div>
  );
}
