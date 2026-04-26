import type { Match, Player, Tournament, Venue } from '../types';

export const venues: Venue[] = [
  {
    id: 'v-crucible',
    name: 'The Crucible Room',
    city: 'Sheffield',
    country: 'UK',
    tables: 12,
    disciplines: ['snooker', '8-ball'],
  },
  {
    id: 'v-derby',
    name: 'Derby City Billiards',
    city: 'Louisville, KY',
    country: 'USA',
    tables: 24,
    disciplines: ['9-ball', '8-ball'],
  },
  {
    id: 'v-manila',
    name: 'Manila Pool Palace',
    city: 'Manila',
    country: 'Philippines',
    tables: 16,
    disciplines: ['9-ball', '8-ball'],
  },
  {
    id: 'v-tokyo',
    name: 'Shinjuku Cue Club',
    city: 'Tokyo',
    country: 'Japan',
    tables: 8,
    disciplines: ['9-ball', 'snooker'],
  },
];

export const players: Player[] = [
  {
    id: 'p-earl',
    name: 'Earl "The Pearl" Strickland',
    handle: 'earl_pearl',
    country: 'USA',
    avatarHue: 18,
    rating: 812,
    disciplines: ['9-ball', '8-ball'],
    hometown: 'Greensboro, NC',
    bio: 'Five-time US Open 9-Ball champion known for a ruthless break and long-distance pots.',
  },
  {
    id: 'p-efren',
    name: 'Efren "Bata" Reyes',
    handle: 'the_magician',
    country: 'Philippines',
    avatarHue: 200,
    rating: 835,
    disciplines: ['9-ball', '8-ball'],
    hometown: 'Pampanga',
    bio: 'The Magician. Inventive safety play and creative kicks that redefined the modern game.',
  },
  {
    id: 'p-ouschan',
    name: 'Jasmin Ouschan',
    handle: 'jasmin_o',
    country: 'Austria',
    avatarHue: 320,
    rating: 792,
    disciplines: ['9-ball', '8-ball'],
    hometown: 'Klagenfurt',
    bio: 'Multiple world champion across disciplines with a signature stroke and stone-cold nerve.',
  },
  {
    id: 'p-filler',
    name: 'Joshua Filler',
    handle: 'filler_killer',
    country: 'Germany',
    avatarHue: 145,
    rating: 826,
    disciplines: ['9-ball'],
    hometown: 'Bad Laasphe',
    bio: 'Youngest Mosconi Cup MVP. Aggressive pattern play and a lightning-fast rhythm.',
  },
  {
    id: 'p-shaw',
    name: 'Jayson Shaw',
    handle: 'eagle_eye',
    country: 'Scotland',
    avatarHue: 50,
    rating: 818,
    disciplines: ['9-ball'],
    hometown: 'Glasgow',
    bio: 'High-run machine with one of the most explosive breaks on tour.',
  },
  {
    id: 'p-osullivan',
    name: "Ronnie O'Sullivan",
    handle: 'the_rocket',
    country: 'England',
    avatarHue: 0,
    rating: 898,
    disciplines: ['snooker'],
    hometown: 'Chigwell',
    bio: 'The Rocket. Seven-time World Snooker Champion and generational talent.',
  },
  {
    id: 'p-trump',
    name: 'Judd Trump',
    handle: 'ace_in_the_pack',
    country: 'England',
    avatarHue: 220,
    rating: 880,
    disciplines: ['snooker'],
    hometown: 'Bristol',
    bio: 'Flamboyant, attacking snooker with a preference for long pots and risk-reward patterns.',
  },
  {
    id: 'p-selby',
    name: 'Mark Selby',
    handle: 'jester_leicester',
    country: 'England',
    avatarHue: 270,
    rating: 873,
    disciplines: ['snooker'],
    hometown: 'Leicester',
    bio: 'The Jester from Leicester. Tactical grinder who wears opponents down match-to-match.',
  },
  {
    id: 'p-gorst',
    name: 'Fedor Gorst',
    handle: 'fedor_g',
    country: 'USA',
    avatarHue: 100,
    rating: 830,
    disciplines: ['9-ball', '8-ball'],
    hometown: 'Brooklyn, NY',
    bio: 'World 9-Ball and 10-Ball champion with a silky stroke and deep positional discipline.',
  },
  {
    id: 'p-siming',
    name: 'Chen Siming',
    handle: 'siming_c',
    country: 'China',
    avatarHue: 340,
    rating: 805,
    disciplines: ['9-ball'],
    hometown: 'Heilongjiang',
    bio: 'Multi-discipline world champion. Machine-like fundamentals across rotation games.',
  },
  {
    id: 'p-immonen',
    name: 'Mika Immonen',
    handle: 'iceman',
    country: 'Finland',
    avatarHue: 180,
    rating: 780,
    disciplines: ['9-ball', '8-ball'],
    hometown: 'Helsinki',
    bio: 'The Iceman. Former World Pool Master and clinical closer on the hill.',
  },
  {
    id: 'p-archer',
    name: 'Johnny Archer',
    handle: 'the_scorpion',
    country: 'USA',
    avatarHue: 12,
    rating: 774,
    disciplines: ['9-ball', '8-ball'],
    hometown: 'Twin City, GA',
    bio: 'The Scorpion. Mosconi Cup veteran with a championship pedigree across formats.',
  },
  {
    id: 'p-williams',
    name: 'Mark Williams',
    handle: 'welsh_potting',
    country: 'Wales',
    avatarHue: 130,
    rating: 865,
    disciplines: ['snooker'],
    hometown: 'Cwm',
    bio: 'Three-time world snooker champion with one of the best long pots in the history of the game.',
  },
  {
    id: 'p-robertson',
    name: 'Neil Robertson',
    handle: 'thunder_down_under',
    country: 'Australia',
    avatarHue: 35,
    rating: 860,
    disciplines: ['snooker'],
    hometown: 'Melbourne',
    bio: 'Thunder from Down Under. Only Australian world snooker champion of the modern era.',
  },
  {
    id: 'p-higgins',
    name: 'John Higgins',
    handle: 'wizard_of_wishaw',
    country: 'Scotland',
    avatarHue: 210,
    rating: 862,
    disciplines: ['snooker'],
    hometown: 'Wishaw',
    bio: 'The Wizard of Wishaw. Tactical genius with four world titles and a relentless safety game.',
  },
  {
    id: 'p-souquet',
    name: 'Ralf Souquet',
    handle: 'the_kaiser',
    country: 'Germany',
    avatarHue: 60,
    rating: 770,
    disciplines: ['9-ball', '8-ball'],
    hometown: 'Hanau',
    bio: 'The Kaiser. Meticulous pre-shot routine and decades of major titles.',
  },
];

export const tournaments: Tournament[] = [
  {
    id: 't-world9',
    name: 'LuckyPool World 9-Ball Open 2026',
    discipline: '9-ball',
    format: 'double-elim',
    raceTo: 11,
    status: 'live',
    startDate: '2026-05-14',
    endDate: '2026-05-19',
    venueId: 'v-manila',
    playerIds: [
      'p-efren',
      'p-filler',
      'p-shaw',
      'p-gorst',
      'p-siming',
      'p-earl',
      'p-immonen',
      'p-archer',
    ],
    entryFee: 500,
    prizePool: 250000,
    description:
      'The flagship rotation event of the LuckyPool season. 128-player field reduced to a double-elimination final 8 streamed live with commentary.',
    bannerHue: 210,
  },
  {
    id: 't-crucible-snk',
    name: 'LuckyPool Masters Snooker Invitational',
    discipline: 'snooker',
    format: 'single-elim',
    raceTo: 6,
    status: 'upcoming',
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    venueId: 'v-crucible',
    playerIds: [
      'p-osullivan',
      'p-trump',
      'p-selby',
      'p-williams',
      'p-robertson',
      'p-higgins',
      'p-ouschan',
      'p-siming',
    ],
    entryFee: 0,
    prizePool: 180000,
    description:
      'Invitational snooker showdown at The Crucible Room. Best-of-11 frames from the quarterfinals onward, best-of-19 for the final.',
    bannerHue: 0,
  },
  {
    id: 't-derby8',
    name: 'Derby City 8-Ball Classic',
    discipline: '8-ball',
    format: 'single-elim',
    raceTo: 7,
    status: 'registering',
    startDate: '2026-07-02',
    endDate: '2026-07-04',
    venueId: 'v-derby',
    playerIds: [
      'p-earl',
      'p-gorst',
      'p-immonen',
      'p-archer',
      'p-souquet',
      'p-ouschan',
    ],
    entryFee: 150,
    prizePool: 20000,
    description:
      'Open 8-ball classic. Race-to-7 throughout, with tablet scoring at every table and live TV displays in the arena.',
    bannerHue: 145,
  },
  {
    id: 't-tokyo-9',
    name: 'Tokyo Neon 9-Ball Cup',
    discipline: '9-ball',
    format: 'round-robin',
    raceTo: 7,
    status: 'completed',
    startDate: '2026-02-10',
    endDate: '2026-02-12',
    venueId: 'v-tokyo',
    playerIds: ['p-filler', 'p-shaw', 'p-gorst', 'p-immonen'],
    entryFee: 250,
    prizePool: 40000,
    description:
      'Four-player round-robin exhibition. Every player meets every other player; tiebreaks decided by match points then games won.',
    bannerHue: 300,
  },
];

export const matches: Match[] = (() => {
  // World 9-Ball: 8-player single-elim-style draw for demo (upper bracket)
  const mk = (
    id: string,
    tournamentId: string,
    round: number,
    roundLabel: string,
    playerAId: string | undefined,
    playerBId: string | undefined,
    raceTo: number,
    discipline: Match['discipline'],
    scoreA = 0,
    scoreB = 0,
    status: Match['status'] = 'scheduled',
    table?: string,
    scheduledAt?: string,
  ): Match => ({
    id,
    tournamentId,
    round,
    roundLabel,
    playerAId,
    playerBId,
    raceTo,
    discipline,
    scoreA,
    scoreB,
    status,
    winnerId:
      status === 'completed'
        ? scoreA > scoreB
          ? playerAId
          : playerBId
        : undefined,
    table,
    scheduledAt,
  });

  const w9: Match[] = [
    // Quarterfinals
    mk('m-w9-qf1', 't-world9', 1, 'Quarterfinal', 'p-efren', 'p-archer', 11, '9-ball', 11, 8, 'completed', 'Table 1', '2026-05-14T18:00:00Z'),
    mk('m-w9-qf2', 't-world9', 1, 'Quarterfinal', 'p-filler', 'p-immonen', 11, '9-ball', 11, 6, 'completed', 'Table 2', '2026-05-14T18:00:00Z'),
    mk('m-w9-qf3', 't-world9', 1, 'Quarterfinal', 'p-shaw', 'p-earl', 11, '9-ball', 9, 7, 'live', 'Table 3', '2026-05-14T21:00:00Z'),
    mk('m-w9-qf4', 't-world9', 1, 'Quarterfinal', 'p-gorst', 'p-siming', 11, '9-ball', 0, 0, 'scheduled', 'Table 4', '2026-05-14T22:30:00Z'),
    // Semifinals
    mk('m-w9-sf1', 't-world9', 2, 'Semifinal', 'p-efren', 'p-filler', 11, '9-ball', 0, 0, 'scheduled', 'Arena', '2026-05-17T19:00:00Z'),
    mk('m-w9-sf2', 't-world9', 2, 'Semifinal', undefined, undefined, 11, '9-ball', 0, 0, 'scheduled', 'Arena', '2026-05-17T21:00:00Z'),
    // Final
    mk('m-w9-f', 't-world9', 3, 'Final', undefined, undefined, 13, '9-ball', 0, 0, 'scheduled', 'Arena', '2026-05-19T20:00:00Z'),
  ];

  // Snooker invitational (all scheduled)
  const snk: Match[] = [
    mk('m-snk-qf1', 't-crucible-snk', 1, 'Quarterfinal', 'p-osullivan', 'p-higgins', 6, 'snooker', 0, 0, 'scheduled', 'Table A', '2026-06-08T14:00:00Z'),
    mk('m-snk-qf2', 't-crucible-snk', 1, 'Quarterfinal', 'p-trump', 'p-williams', 6, 'snooker', 0, 0, 'scheduled', 'Table B', '2026-06-08T19:00:00Z'),
    mk('m-snk-qf3', 't-crucible-snk', 1, 'Quarterfinal', 'p-selby', 'p-robertson', 6, 'snooker', 0, 0, 'scheduled', 'Table A', '2026-06-09T14:00:00Z'),
    mk('m-snk-qf4', 't-crucible-snk', 1, 'Quarterfinal', 'p-ouschan', 'p-siming', 6, 'snooker', 0, 0, 'scheduled', 'Table B', '2026-06-09T19:00:00Z'),
    mk('m-snk-sf1', 't-crucible-snk', 2, 'Semifinal', undefined, undefined, 6, 'snooker', 0, 0, 'scheduled', 'Arena', '2026-06-11T14:00:00Z'),
    mk('m-snk-sf2', 't-crucible-snk', 2, 'Semifinal', undefined, undefined, 6, 'snooker', 0, 0, 'scheduled', 'Arena', '2026-06-11T19:00:00Z'),
    mk('m-snk-f', 't-crucible-snk', 3, 'Final', undefined, undefined, 10, 'snooker', 0, 0, 'scheduled', 'Arena', '2026-06-12T19:00:00Z'),
  ];

  // Derby 8-ball (registering, no matches yet) — leave empty.

  // Tokyo round-robin (completed)
  const tyo: Match[] = [
    mk('m-tyo-1', 't-tokyo-9', 1, 'Round 1', 'p-filler', 'p-shaw', 7, '9-ball', 7, 5, 'completed', 'Table 1', '2026-02-10T10:00:00Z'),
    mk('m-tyo-2', 't-tokyo-9', 1, 'Round 1', 'p-gorst', 'p-immonen', 7, '9-ball', 7, 4, 'completed', 'Table 2', '2026-02-10T10:00:00Z'),
    mk('m-tyo-3', 't-tokyo-9', 2, 'Round 2', 'p-filler', 'p-gorst', 7, '9-ball', 5, 7, 'completed', 'Table 1', '2026-02-11T10:00:00Z'),
    mk('m-tyo-4', 't-tokyo-9', 2, 'Round 2', 'p-shaw', 'p-immonen', 7, '9-ball', 7, 3, 'completed', 'Table 2', '2026-02-11T10:00:00Z'),
    mk('m-tyo-5', 't-tokyo-9', 3, 'Round 3', 'p-filler', 'p-immonen', 7, '9-ball', 7, 2, 'completed', 'Table 1', '2026-02-12T10:00:00Z'),
    mk('m-tyo-6', 't-tokyo-9', 3, 'Round 3', 'p-shaw', 'p-gorst', 7, '9-ball', 6, 7, 'completed', 'Table 2', '2026-02-12T10:00:00Z'),
  ];

  return [...w9, ...snk, ...tyo];
})();

export function getPlayer(id: string | undefined): Player | undefined {
  if (!id) return undefined;
  return players.find((p) => p.id === id);
}

export function getVenue(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}

export function getTournament(id: string): Tournament | undefined {
  return tournaments.find((t) => t.id === id);
}
