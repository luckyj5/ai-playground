import { Link, useParams } from 'react-router-dom';
import { useMatches, useTournaments } from '../data/store';
import { getPlayer } from '../data/mock';
import { DisciplineBadge } from '../components/DisciplineBadge';
import { StatusPill } from '../components/MatchCard';
import { Avatar } from '../components/Avatar';

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const [matches, setMatches] = useMatches();
  const [tournaments] = useTournaments();
  const match = matches.find((m) => m.id === id);
  if (!match) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="section-title">Match not found</h1>
        <Link to="/matches" className="mt-6 inline-block btn-primary">
          Back to matches
        </Link>
      </div>
    );
  }
  const tournament = tournaments.find((t) => t.id === match.tournamentId);
  const playerA = getPlayer(match.playerAId);
  const playerB = getPlayer(match.playerBId);

  const adjust = (slot: 'A' | 'B', delta: number) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== match.id) return m;
        const nextA = slot === 'A' ? Math.max(0, m.scoreA + delta) : m.scoreA;
        const nextB = slot === 'B' ? Math.max(0, m.scoreB + delta) : m.scoreB;
        let status = m.status;
        let winnerId = m.winnerId;
        if (nextA >= m.raceTo && nextA > nextB) {
          status = 'completed';
          winnerId = m.playerAId;
        } else if (nextB >= m.raceTo && nextB > nextA) {
          status = 'completed';
          winnerId = m.playerBId;
        } else if (status === 'completed') {
          status = 'live';
          winnerId = undefined;
        } else if (status === 'scheduled' && (nextA > 0 || nextB > 0)) {
          status = 'live';
        }
        return { ...m, scoreA: nextA, scoreB: nextB, status, winnerId };
      }),
    );
  };

  const resetScores = () => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === match.id
          ? { ...m, scoreA: 0, scoreB: 0, status: 'scheduled', winnerId: undefined }
          : m,
      ),
    );
  };

  const target = match.raceTo;
  const pctA = Math.min(100, (match.scoreA / target) * 100);
  const pctB = Math.min(100, (match.scoreB / target) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to={tournament ? `/tournaments/${tournament.id}` : '/matches'}
        className="text-sm text-chalk/60 hover:text-chalk"
      >
        ← {tournament?.name ?? 'Back'}
      </Link>

      <div className="card mt-4 p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <DisciplineBadge discipline={match.discipline} />
          <StatusPill status={match.status} />
          <span className="chip">{match.roundLabel}</span>
          <span className="chip">Race to {match.raceTo}</span>
          {match.table && <span className="chip">{match.table}</span>}
        </div>

        <div className="mt-8 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <PlayerBlock
            player={playerA}
            score={match.scoreA}
            pct={pctA}
            winner={match.winnerId === playerA?.id}
            onPlus={() => adjust('A', 1)}
            onMinus={() => adjust('A', -1)}
          />
          <div className="flex flex-col items-center text-chalk/40">
            <span className="font-mono text-xs uppercase tracking-widest">
              vs
            </span>
            <span className="mt-2 font-display text-5xl text-chalk">
              {match.scoreA}
              <span className="mx-2 text-chalk/30">–</span>
              {match.scoreB}
            </span>
            <span className="mt-1 text-xs">First to {target}</span>
          </div>
          <PlayerBlock
            align="right"
            player={playerB}
            score={match.scoreB}
            pct={pctB}
            winner={match.winnerId === playerB?.id}
            onPlus={() => adjust('B', 1)}
            onMinus={() => adjust('B', -1)}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-chalk/50">
            Tablet-style scoring. Changes persist locally in your browser —
            refresh to come back to the same state. Hit <em>Reset</em> to
            replay.
          </div>
          <button onClick={resetScores} className="btn-ghost">
            Reset match
          </button>
        </div>
      </div>

      <div className="mt-6 text-xs text-chalk/50">
        Scheduled:{' '}
        {match.scheduledAt
          ? new Date(match.scheduledAt).toLocaleString()
          : 'TBD'}
      </div>
    </div>
  );
}

function PlayerBlock({
  player,
  score,
  pct,
  winner,
  align = 'left',
  onPlus,
  onMinus,
}: {
  player?: ReturnType<typeof getPlayer>;
  score: number;
  pct: number;
  winner: boolean;
  align?: 'left' | 'right';
  onPlus: () => void;
  onMinus: () => void;
}) {
  const justify = align === 'right' ? 'items-end text-right' : '';
  return (
    <div className={`flex flex-col gap-4 ${justify}`}>
      <div
        className={`flex items-center gap-3 ${
          align === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        <Avatar
          name={player?.name ?? '?'}
          hue={player?.avatarHue ?? 200}
          size={56}
        />
        <div className={align === 'right' ? 'text-right' : ''}>
          <div
            className={`font-display text-xl ${
              winner ? 'text-cue-accent' : 'text-chalk'
            }`}
          >
            {player?.name ?? 'TBD'}
          </div>
          <div className="text-xs text-chalk/50">
            {player?.country}
            {player?.rating ? ` · Rating ${player.rating}` : ''}
          </div>
        </div>
      </div>
      <div className="w-full max-w-xs">
        <div className="mb-1 flex items-center justify-between text-xs text-chalk/60">
          <span>Progress to {score}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cue-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-ghost" onClick={onMinus} aria-label="Decrement">
          −
        </button>
        <button
          className="btn-primary"
          onClick={onPlus}
          aria-label="Increment"
        >
          + Add game
        </button>
      </div>
    </div>
  );
}
