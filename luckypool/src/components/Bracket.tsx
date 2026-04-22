import type { BracketRound } from '../lib/bracket';
import { Avatar } from './Avatar';
import { StatusPill } from './MatchCard';

export function Bracket({ rounds }: { rounds: BracketRound[] }) {
  if (rounds.length === 0) {
    return (
      <div className="card p-6 text-center text-chalk/60">
        Bracket will be generated once the draw is finalized.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <div
        className="flex gap-6 pb-4"
        style={{ minWidth: `${rounds.length * 260}px` }}
      >
        {rounds.map((r) => (
          <div key={r.round} className="flex w-[240px] flex-col">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-chalk/60">
              {r.label}
            </div>
            <div className="flex flex-1 flex-col justify-around gap-4">
              {r.matches.map((n) => (
                <div
                  key={n.id}
                  className="card p-3 animate-fade-in"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-chalk/40">
                      Race to {n.raceTo}
                    </span>
                    <StatusPill status={n.status} />
                  </div>
                  <BracketSlot
                    name={n.playerA?.name}
                    hue={n.playerA?.avatarHue}
                    score={n.scoreA}
                    winner={n.winnerId === n.playerA?.id && !!n.winnerId}
                  />
                  <BracketSlot
                    name={n.playerB?.name}
                    hue={n.playerB?.avatarHue}
                    score={n.scoreB}
                    winner={n.winnerId === n.playerB?.id && !!n.winnerId}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BracketSlot({
  name,
  hue,
  score,
  winner,
}: {
  name?: string;
  hue?: number;
  score: number;
  winner: boolean;
}) {
  return (
    <div
      className={`mt-1 flex items-center justify-between gap-2 rounded-md px-2 py-1.5 ${
        winner ? 'bg-cue-accent/10 text-cue-accent' : 'text-chalk/80'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Avatar name={name ?? '?'} hue={hue ?? 210} size={22} />
        <span className="truncate text-sm">{name ?? 'TBD'}</span>
      </div>
      <span className="font-mono text-sm">{score}</span>
    </div>
  );
}
