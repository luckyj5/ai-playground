// Real-world ranking snapshots used by the /leaderboard "World" tab.
//
// Sources / inspiration:
// - 9-ball / 8-ball pro: WPA & Matchroom Nineball Tour standings
// - Snooker: World Snooker Tour two-year ranking
// - BCAPL / CSI USA: BCA Pool League national singles championships
// - California: aggregated CSI California Open / state-tour results
//
// The numeric ratings are illustrative — not live-fetched from any
// federation API. Replace with a fetch() once you wire up a backend.

export type RealRanking = {
  rank: number;
  player: string;
  country: string; // ISO-3166 alpha-2 (or US-state code for state lists)
  region?: string; // city / state / nation (display-friendly)
  points: number;
  delta?: number; // week-over-week rank change (positive = climbing)
  notes?: string;
};

export type RealBoard = {
  id: string;
  label: string;
  scope: string;
  source: string;
  asOf: string; // ISO date the snapshot was captured
  unit: string; // e.g. "WPA pts" / "World Snooker £"
  rows: RealRanking[];
};

// ---------------------------------------------------------------------------
// WPA / Matchroom Nineball Tour — World 9-Ball Rankings
// ---------------------------------------------------------------------------
const WPA_9BALL: RealRanking[] = [
  { rank: 1, player: 'Fedor Gorst', country: 'US', points: 18250, delta: 0 },
  { rank: 2, player: 'Joshua Filler', country: 'DE', points: 17480, delta: 1 },
  { rank: 3, player: 'Francisco Sanchez Ruiz', country: 'ES', points: 16120, delta: -1 },
  { rank: 4, player: 'Aloysius Yapp', country: 'SG', points: 15280, delta: 2 },
  { rank: 5, player: 'Albin Ouschan', country: 'AT', points: 14760, delta: -1 },
  { rank: 6, player: 'Carlo Biado', country: 'PH', points: 13940, delta: 0 },
  { rank: 7, player: 'Eklent Kaci', country: 'AL', points: 13120, delta: 3 },
  { rank: 8, player: 'Shane Van Boening', country: 'US', points: 12780, delta: -2 },
  { rank: 9, player: 'Mario He', country: 'AT', points: 12410, delta: 1 },
  { rank: 10, player: 'Jayson Shaw', country: 'GB', points: 11990, delta: -1 },
  { rank: 11, player: 'Ko Pin-yi', country: 'TW', points: 11650, delta: 0 },
  { rank: 12, player: 'Wiktor Zieliński', country: 'PL', points: 11340, delta: 4 },
  { rank: 13, player: 'Mickey Krause', country: 'DK', points: 10980, delta: -2 },
  { rank: 14, player: 'Robbie Capito', country: 'HK', points: 10620, delta: 1 },
  { rank: 15, player: 'Wu Kun-lin', country: 'TW', points: 10210, delta: -3 },
];

// ---------------------------------------------------------------------------
// WPA — World 8-Ball Rankings (smaller circuit, Mosconi-anchored)
// ---------------------------------------------------------------------------
const WPA_8BALL: RealRanking[] = [
  { rank: 1, player: 'Shane Van Boening', country: 'US', points: 9420, delta: 0 },
  { rank: 2, player: 'Joshua Filler', country: 'DE', points: 9180, delta: 1 },
  { rank: 3, player: 'Albin Ouschan', country: 'AT', points: 8760, delta: -1 },
  { rank: 4, player: 'Skyler Woodward', country: 'US', points: 8410, delta: 2 },
  { rank: 5, player: 'Tyler Styer', country: 'US', points: 7990, delta: 0 },
  { rank: 6, player: 'Mario He', country: 'AT', points: 7720, delta: -2 },
  { rank: 7, player: 'Francisco Sanchez Ruiz', country: 'ES', points: 7480, delta: 1 },
  { rank: 8, player: 'Eklent Kaci', country: 'AL', points: 7210, delta: 3 },
  { rank: 9, player: 'Klenti Kaçi', country: 'AL', points: 6940, delta: 0 },
  { rank: 10, player: 'David Alcaide', country: 'ES', points: 6610, delta: -2 },
  { rank: 11, player: 'Dimitri Jungo', country: 'CH', points: 6320, delta: 1 },
  { rank: 12, player: 'Mateusz Sniegocki', country: 'PL', points: 6080, delta: -1 },
];

// ---------------------------------------------------------------------------
// World Snooker Tour — two-year ranking list (prize money in £k)
// ---------------------------------------------------------------------------
const WORLD_SNOOKER: RealRanking[] = [
  { rank: 1, player: 'Judd Trump', country: 'GB', points: 1840, delta: 0, notes: 'England' },
  { rank: 2, player: "Ronnie O'Sullivan", country: 'GB', points: 1620, delta: 0, notes: 'England' },
  { rank: 3, player: 'Mark Allen', country: 'GB', points: 1380, delta: 1, notes: 'N. Ireland' },
  { rank: 4, player: 'Mark Williams', country: 'GB', points: 1260, delta: -1, notes: 'Wales' },
  { rank: 5, player: 'Kyren Wilson', country: 'GB', points: 1180, delta: 0, notes: 'England' },
  { rank: 6, player: 'Ali Carter', country: 'GB', points: 1040, delta: 2, notes: 'England' },
  { rank: 7, player: 'Shaun Murphy', country: 'GB', points: 980, delta: -1, notes: 'England' },
  { rank: 8, player: 'John Higgins', country: 'GB', points: 920, delta: 0, notes: 'Scotland' },
  { rank: 9, player: 'Neil Robertson', country: 'AU', points: 870, delta: 1, notes: 'Australia' },
  { rank: 10, player: 'Zhao Xintong', country: 'CN', points: 820, delta: 4 },
  { rank: 11, player: 'Si Jiahui', country: 'CN', points: 780, delta: 0 },
  { rank: 12, player: 'Ding Junhui', country: 'CN', points: 740, delta: -2 },
  { rank: 13, player: 'Mark Selby', country: 'GB', points: 710, delta: -3, notes: 'England' },
  { rank: 14, player: 'Stuart Bingham', country: 'GB', points: 670, delta: 0, notes: 'England' },
  { rank: 15, player: 'Luca Brecel', country: 'BE', points: 640, delta: 1 },
];

// ---------------------------------------------------------------------------
// BCAPL / CSI USA National Singles Rankings (Open division)
// ---------------------------------------------------------------------------
const BCA_USA: RealRanking[] = [
  { rank: 1, player: 'Shane Van Boening', country: 'US', region: 'South Dakota', points: 4820, delta: 0 },
  { rank: 2, player: 'Skyler Woodward', country: 'US', region: 'Kentucky', points: 4610, delta: 0 },
  { rank: 3, player: 'Tyler Styer', country: 'US', region: 'California', points: 4380, delta: 1 },
  { rank: 4, player: 'Billy Thorpe', country: 'US', region: 'Ohio', points: 4150, delta: -1 },
  { rank: 5, player: 'Tony Robles', country: 'US', region: 'New York', points: 3940, delta: 0 },
  { rank: 6, player: 'Brandon Shuff', country: 'US', region: 'Virginia', points: 3760, delta: 2 },
  { rank: 7, player: 'Mike Dechaine', country: 'US', region: 'Maine', points: 3580, delta: -1 },
  { rank: 8, player: 'Mike Davis', country: 'US', region: 'Florida', points: 3420, delta: -1 },
  { rank: 9, player: 'Corey Deuel', country: 'US', region: 'Pennsylvania', points: 3280, delta: 0 },
  { rank: 10, player: 'Dennis Hatch', country: 'US', region: 'New York', points: 3120, delta: 1 },
  { rank: 11, player: 'Justin Bergman', country: 'US', region: 'Illinois', points: 2980, delta: -1 },
  { rank: 12, player: 'Oscar Dominguez', country: 'US', region: 'California', points: 2860, delta: 0 },
  { rank: 13, player: 'Rodney Morris', country: 'US', region: 'California', points: 2740, delta: 2 },
  { rank: 14, player: 'Earl Strickland', country: 'US', region: 'North Carolina', points: 2610, delta: 0 },
  { rank: 15, player: 'Jeremy Sossei', country: 'US', region: 'Connecticut', points: 2480, delta: -1 },
];

// ---------------------------------------------------------------------------
// California State Singles — aggregated CSI California Open + state tour
// ---------------------------------------------------------------------------
const CA_STATE: RealRanking[] = [
  { rank: 1, player: 'Tyler Styer', country: 'US', region: 'Sacramento', points: 1820, delta: 0 },
  { rank: 2, player: 'Oscar Dominguez', country: 'US', region: 'Burbank', points: 1690, delta: 1 },
  { rank: 3, player: 'Max Eberle', country: 'US', region: 'Los Angeles', points: 1580, delta: -1 },
  { rank: 4, player: 'Hunter Lombardo', country: 'US', region: 'Los Angeles', points: 1440, delta: 0 },
  { rank: 5, player: 'Ernesto Dominguez', country: 'US', region: 'Los Angeles', points: 1320, delta: 2 },
  { rank: 6, player: 'Marc Vidal', country: 'US', region: 'San Diego', points: 1240, delta: -1 },
  { rank: 7, player: 'Amar Kang', country: 'US', region: 'Bay Area', points: 1160, delta: -1 },
  { rank: 8, player: 'Jaime Lara', country: 'US', region: 'Riverside', points: 1080, delta: 1 },
  { rank: 9, player: 'Stevie Moore', country: 'US', region: 'Sacramento', points: 1010, delta: 0 },
  { rank: 10, player: 'Joey Tate', country: 'US', region: 'Bakersfield', points: 940, delta: 2 },
  { rank: 11, player: 'Manny Perez', country: 'US', region: 'San Jose', points: 880, delta: -2 },
  { rank: 12, player: 'Robert Newkirk', country: 'US', region: 'Long Beach', points: 820, delta: 0 },
];

export const REAL_BOARDS: RealBoard[] = [
  {
    id: 'wpa-9ball',
    label: 'WPA · 9-Ball',
    scope: 'World',
    source: 'WPA / Matchroom Nineball Tour',
    asOf: '2026-04-15',
    unit: 'WPA pts',
    rows: WPA_9BALL,
  },
  {
    id: 'wpa-8ball',
    label: 'WPA · 8-Ball',
    scope: 'World',
    source: 'WPA Predator 8-Ball Tour',
    asOf: '2026-04-15',
    unit: 'WPA pts',
    rows: WPA_8BALL,
  },
  {
    id: 'world-snooker',
    label: 'World Snooker',
    scope: 'World',
    source: 'World Snooker Tour 2-yr ranking',
    asOf: '2026-04-15',
    unit: '£k earnings',
    rows: WORLD_SNOOKER,
  },
  {
    id: 'bca-usa',
    label: 'BCA · USA',
    scope: 'United States',
    source: 'BCAPL / CSI USA National Singles',
    asOf: '2026-04-15',
    unit: 'CSI pts',
    rows: BCA_USA,
  },
  {
    id: 'ca-state',
    label: 'BCA · California',
    scope: 'California state',
    source: 'CSI California Open + state tour',
    asOf: '2026-04-15',
    unit: 'CSI pts',
    rows: CA_STATE,
  },
];
