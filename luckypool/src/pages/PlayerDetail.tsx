import { Link, useParams } from 'react-router-dom';
import { players, getPlayer } from '../data/mock';
import { useMatches, useTournaments } from '../data/store';
import { Avatar } from '../components/Avatar';
import { DisciplineBadge } from '../components/DisciplineBadge';
import { MatchCard } from '../components/MatchCard';

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const [matches] = useMatches();
  const [tournaments] = useTournaments();
  const player = players.find((p) => p.id === id);
  if (!player) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="section-title">Player not found</h1>
        <Link to="/players" className="mt-6 inline-block btn-primary">
          Back to players
        </Link>
      </div>
    );
  }
  const tournamentMap = new Map(tournaments.map((t) => [t.id, t]));
  const myMatches = matches.filter(
    (m) => m.playerAId === player.id || m.playerBId === player.id,
  );
  const completed = myMatches.filter((m) => m.status === 'completed');
  const wins = completed.filter((m) => m.winnerId === player.id).length;
  const losses = completed.length - wins;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/players" className="text-sm text-chalk/60 hover:text-chalk">
        ← All players
      </Link>

      <div className="card mt-4 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-10">
        <Avatar name={player.name} hue={player.avatarHue} size={120} />
        <div className="flex-1">
          <h1 className="font-display text-3xl md:text-4xl">{player.name}</h1>
          <div className="mt-1 text-chalk/60">
            @{player.handle} · {player.hometown}, {player.country}
          </div>
          <p className="mt-4 max-w-2xl text-chalk/80">{player.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {player.disciplines.map((d) => (
              <DisciplineBadge key={d} discipline={d} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:w-72">
          <Stat label="Rating" value={player.rating.toString()} />
          <Stat label="Wins" value={wins.toString()} />
          <Stat label="Losses" value={losses.toString()} />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="section-title mb-4">Matches</h2>
        {myMatches.length === 0 ? (
          <div className="card p-8 text-center text-chalk/60">
            No matches on record yet.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {myMatches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                playerA={getPlayer(m.playerAId)}
                playerB={getPlayer(m.playerBId)}
                tournamentName={tournamentMap.get(m.tournamentId)?.name}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-chalk/50">
        {label}
      </div>
      <div className="font-display text-2xl text-cue-accent">{value}</div>
    </div>
  );
}
