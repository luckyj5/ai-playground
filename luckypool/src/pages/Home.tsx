import { Link } from 'react-router-dom';
import { players, venues } from '../data/mock';
import { useMatches, useTournaments } from '../data/store';
import { MatchCard } from '../components/MatchCard';
import { TournamentCard } from '../components/TournamentCard';
import { DisciplineBadge } from '../components/DisciplineBadge';

export default function Home() {
  const [tournaments] = useTournaments();
  const [matches] = useMatches();
  const liveOrUpcomingMatches = matches
    .filter((m) => m.status === 'live' || m.status === 'scheduled')
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'live' ? -1 : 1;
      const at = a.scheduledAt ? Date.parse(a.scheduledAt) : Infinity;
      const bt = b.scheduledAt ? Date.parse(b.scheduledAt) : Infinity;
      return at - bt;
    })
    .slice(0, 4);

  const featured = [...tournaments]
    .sort((a, b) => {
      const order = { live: 0, registering: 1, upcoming: 2, completed: 3 };
      return order[a.status] - order[b.status];
    })
    .slice(0, 3);

  const tournamentMap = new Map(tournaments.map((t) => [t.id, t]));
  const playerMap = new Map(players.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-felt-gradient px-6 py-12 shadow-table md:px-12 md:py-20">
        <div className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full bg-cue-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-felt-300/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <DisciplineBadge discipline="8-ball" />
            <DisciplineBadge discipline="9-ball" />
            <DisciplineBadge discipline="snooker" />
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight text-chalk md:text-6xl">
            Bringing cue sports{' '}
            <span className="text-cue-accent">online</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-chalk/80">
            LuckyPool is the tournament platform for 8-ball, 9-ball and
            snooker. Build brackets, live-score matches, track your stats
            and connect with players and rooms around the world.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/builder" className="btn-primary">
              Create a tournament
            </Link>
            <Link to="/tournaments" className="btn-ghost">
              Browse tournaments
            </Link>
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 text-chalk">
            <HeroStat k={tournaments.length.toString()} v="Active tournaments" />
            <HeroStat k={players.length.toString()} v="Pros on the platform" />
            <HeroStat k={venues.length.toString()} v="Partner venues" />
          </dl>
        </div>
      </section>

      {/* Disciplines */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Three disciplines, one platform</h2>
            <p className="section-sub">
              Purpose-built scoring and bracket logic for each game.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <DisciplineCard
            discipline="8-ball"
            title="8-Ball"
            blurb="Call-shot or amateur rules, handicap-friendly race formats, and group (stripes/solids) tracking."
            bullets={[
              'Race to N game tracking',
              'BCA / APA rule presets',
              'Handicap-adjusted scoring',
            ]}
          />
          <DisciplineCard
            discipline="9-ball"
            title="9-Ball"
            blurb="Rotation scoring with break-and-run tracking, break stats, and world-standard referee rules."
            bullets={[
              'Race to games, alternate / winner break',
              'Break-and-run detection',
              'WPA world-standard ruleset',
            ]}
          />
          <DisciplineCard
            discipline="snooker"
            title="Snooker"
            blurb="Frame-by-frame scoring with break building, fouls, free ball and re-rack support."
            bullets={[
              'Best-of-N frames',
              'Break builder with century detection',
              'Fouls, free ball, respot black',
            ]}
          />
        </div>
      </section>

      {/* Featured tournaments */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Featured tournaments</h2>
            <p className="section-sub">
              Live brackets and upcoming events from around the world.
            </p>
          </div>
          <Link
            to="/tournaments"
            className="text-sm text-cue-accent hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featured.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </section>

      {/* Live & upcoming matches */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Live & upcoming matches</h2>
            <p className="section-sub">
              Scores stream from tablet scoring at every partner table.
            </p>
          </div>
          <Link
            to="/matches"
            className="text-sm text-cue-accent hover:underline"
          >
            All matches →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {liveOrUpcomingMatches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              playerA={playerMap.get(m.playerAId ?? '')}
              playerB={playerMap.get(m.playerBId ?? '')}
              tournamentName={tournamentMap.get(m.tournamentId)?.name}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function HeroStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-display text-3xl text-cue-accent">{k}</dt>
      <dd className="text-sm text-chalk/70">{v}</dd>
    </div>
  );
}

function DisciplineCard({
  discipline,
  title,
  blurb,
  bullets,
}: {
  discipline: 'snooker' | '8-ball' | '9-ball';
  title: string;
  blurb: string;
  bullets: string[];
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-chalk">{title}</h3>
        <DisciplineBadge discipline={discipline} />
      </div>
      <p className="mt-2 text-sm text-chalk/70">{blurb}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-chalk/80">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-cue-accent" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
