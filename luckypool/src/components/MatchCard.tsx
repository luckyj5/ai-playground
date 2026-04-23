import { Link } from 'react-router-dom';
import type { Match, Player } from '../types';
import { Avatar } from './Avatar';
import { DisciplineBadge } from './DisciplineBadge';

export function MatchCard({
  match,
  playerA,
  playerB,
  tournamentName,
}: {
  match: Match;
  playerA?: Player;
  playerB?: Player;
  tournamentName?: string;
}) {
  const winnerA = match.winnerId && match.winnerId === playerA?.id;
  const winnerB = match.winnerId && match.winnerId === playerB?.id;
  return (
    <Link
      to={`/matches/${match.id}`}
      className="card block p-4 transition-colors hover:border-cue-accent/40"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DisciplineBadge discipline={match.discipline} />
          <span className="chip">Race to {match.raceTo}</span>
          <span className="chip">{match.roundLabel}</span>
        </div>
        <StatusPill status={match.status} />
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <PlayerLine player={playerA} winner={!!winnerA} />
        <div className="flex items-center gap-2 font-mono text-2xl text-chalk">
          <span className={winnerA ? 'text-cue-accent' : ''}>{match.scoreA}</span>
          <span className="text-chalk-muted">–</span>
          <span className={winnerB ? 'text-cue-accent' : ''}>{match.scoreB}</span>
        </div>
        <PlayerLine player={playerB} winner={!!winnerB} align="right" />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-chalk-muted">
        <span>{tournamentName}</span>
        <span>
          {match.table ? `${match.table} · ` : ''}
          {match.scheduledAt
            ? new Date(match.scheduledAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : 'TBD'}
        </span>
      </div>
    </Link>
  );
}

function PlayerLine({
  player,
  winner,
  align = 'left',
}: {
  player?: Player;
  winner?: boolean;
  align?: 'left' | 'right';
}) {
  const justify = align === 'right' ? 'justify-end text-right' : '';
  if (!player) {
    return (
      <div className={`flex items-center gap-2 text-chalk-muted ${justify}`}>
        {align === 'right' ? null : <Avatar name="?" hue={0} size={32} />}
        <span className="text-sm italic">TBD</span>
        {align === 'right' ? <Avatar name="?" hue={0} size={32} /> : null}
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-2 ${justify}`}>
      {align === 'right' ? null : (
        <Avatar name={player.name} hue={player.avatarHue} size={32} />
      )}
      <div className={align === 'right' ? 'text-right' : ''}>
        <div
          className={`text-sm font-medium ${
            winner ? 'text-cue-accent' : 'text-chalk'
          }`}
        >
          {player.name}
        </div>
        <div className="text-xs text-chalk-muted">{player.country}</div>
      </div>
      {align === 'right' ? (
        <Avatar name={player.name} hue={player.avatarHue} size={32} />
      ) : null}
    </div>
  );
}

export function StatusPill({ status }: { status: Match['status'] }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-400/40 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-300">
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-red-400" />
        LIVE
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="chip text-chalk-muted">Final</span>
    );
  }
  return <span className="chip">Scheduled</span>;
}
