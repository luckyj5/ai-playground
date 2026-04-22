import type { Match, Player } from '../types';

// Nearest power of two >= n
export function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

export function labelForRound(totalRounds: number, round: number): string {
  const remaining = totalRounds - round + 1;
  if (remaining === 1) return 'Final';
  if (remaining === 2) return 'Semifinal';
  if (remaining === 3) return 'Quarterfinal';
  if (remaining === 4) return 'Round of 16';
  if (remaining === 5) return 'Round of 32';
  return `Round ${round}`;
}

export type BracketNode = {
  id: string;
  round: number;
  roundLabel: string;
  playerA?: Player;
  playerB?: Player;
  scoreA: number;
  scoreB: number;
  status: Match['status'];
  winnerId?: string;
  raceTo: number;
  match?: Match;
};

export type BracketRound = {
  round: number;
  label: string;
  matches: BracketNode[];
};

export function buildSingleElimBracket(
  matches: Match[],
  playerLookup: (id: string | undefined) => Player | undefined,
): BracketRound[] {
  if (matches.length === 0) return [];
  const byRound = new Map<number, Match[]>();
  for (const m of matches) {
    const list = byRound.get(m.round) ?? [];
    list.push(m);
    byRound.set(m.round, list);
  }
  const rounds = [...byRound.keys()].sort((a, b) => a - b);
  const totalRounds = rounds.length;
  return rounds.map((r) => {
    const ms = byRound.get(r)!;
    return {
      round: r,
      label: labelForRound(totalRounds, r),
      matches: ms.map((m) => ({
        id: m.id,
        round: m.round,
        roundLabel: m.roundLabel,
        playerA: playerLookup(m.playerAId),
        playerB: playerLookup(m.playerBId),
        scoreA: m.scoreA,
        scoreB: m.scoreB,
        status: m.status,
        winnerId: m.winnerId,
        raceTo: m.raceTo,
        match: m,
      })),
    };
  });
}

// Generate an empty bracket skeleton for N players.
export function generateSkeletonMatches(
  tournamentId: string,
  playerIds: string[],
  raceTo: number,
  discipline: Match['discipline'],
): Match[] {
  const size = Math.max(2, nextPow2(playerIds.length));
  const padded = [...playerIds];
  while (padded.length < size) padded.push(''); // byes
  const totalRounds = Math.log2(size);
  const out: Match[] = [];

  // Round 1 from paired slots (1 vs N, 2 vs N-1, etc.)
  const seeds = seedOrder(size);
  const r1: Match[] = [];
  for (let i = 0; i < size / 2; i++) {
    const aSeed = seeds[i * 2];
    const bSeed = seeds[i * 2 + 1];
    const aId = padded[aSeed - 1] || undefined;
    const bId = padded[bSeed - 1] || undefined;
    r1.push({
      id: `${tournamentId}-r1-m${i + 1}`,
      tournamentId,
      round: 1,
      roundLabel: labelForRound(totalRounds, 1),
      playerAId: aId,
      playerBId: bId,
      scoreA: 0,
      scoreB: 0,
      raceTo,
      discipline,
      status: 'scheduled',
    });
  }
  out.push(...r1);

  // Subsequent rounds — empty placeholders
  let prev = r1;
  for (let r = 2; r <= totalRounds; r++) {
    const next: Match[] = [];
    for (let i = 0; i < prev.length / 2; i++) {
      next.push({
        id: `${tournamentId}-r${r}-m${i + 1}`,
        tournamentId,
        round: r,
        roundLabel: labelForRound(totalRounds, r),
        scoreA: 0,
        scoreB: 0,
        raceTo,
        discipline,
        status: 'scheduled',
      });
    }
    out.push(...next);
    prev = next;
  }
  return out;
}

// Standard bracket seeding: 1,16,8,9,5,12,4,13,6,11,3,14,7,10,2,15 for N=16
function seedOrder(size: number): number[] {
  let rounds: number[][] = [[1, 2]];
  while (rounds[0].length < size) {
    const next: number[][] = [];
    const len = rounds[0].length * 2;
    for (const pair of rounds) {
      const [a, b] = pair;
      next.push([a, len + 1 - a]);
      next.push([b, len + 1 - b]);
    }
    rounds = next;
  }
  return rounds.flat();
}
