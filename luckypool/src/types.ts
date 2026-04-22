export type Discipline = '8-ball' | '9-ball' | 'snooker';

export type TournamentFormat =
  | 'single-elim'
  | 'double-elim'
  | 'round-robin'
  | 'swiss';

export type TournamentStatus =
  | 'upcoming'
  | 'registering'
  | 'live'
  | 'completed';

export type Player = {
  id: string;
  name: string;
  handle: string;
  country: string;
  avatarHue: number;
  rating: number;
  disciplines: Discipline[];
  hometown: string;
  bio: string;
};

export type Venue = {
  id: string;
  name: string;
  city: string;
  country: string;
  tables: number;
  disciplines: Discipline[];
};

export type MatchStatus = 'scheduled' | 'live' | 'completed';

export type Match = {
  id: string;
  tournamentId: string;
  round: number;
  roundLabel: string;
  table?: string;
  discipline: Discipline;
  raceTo: number;
  playerAId?: string;
  playerBId?: string;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  scheduledAt?: string;
  winnerId?: string;
  // For double-elim / bracket linking
  nextMatchId?: string;
  nextMatchSlot?: 'A' | 'B';
};

export type Tournament = {
  id: string;
  name: string;
  discipline: Discipline;
  format: TournamentFormat;
  raceTo: number;
  status: TournamentStatus;
  startDate: string;
  endDate?: string;
  venueId: string;
  playerIds: string[];
  entryFee: number;
  prizePool: number;
  description: string;
  bannerHue: number;
};

export type NewTournamentDraft = {
  name: string;
  discipline: Discipline;
  format: TournamentFormat;
  raceTo: number;
  startDate: string;
  venueId: string;
  entryFee: number;
  prizePool: number;
  description: string;
  playerIds: string[];
};
