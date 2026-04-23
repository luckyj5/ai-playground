import { Link } from 'react-router-dom';
import { players, venues } from '../data/mock';
import { useMatches, useTournaments } from '../data/store';
import { MatchCard } from '../components/MatchCard';
import { TournamentCard } from '../components/TournamentCard';
import { DisciplineBadge } from '../components/DisciplineBadge';
import { Rack } from '../components/Rack';
import { Avatar } from '../components/Avatar';
import type { Discipline } from '../types';
import { globalStats, topByDiscipline } from '../data/stats';
import { GLOBAL_QUICKFIRE, formatMs, useQuickfire } from '../data/quickfire';

export default function Home() {
  const [tournaments] = useTournaments();
  const [matches] = useMatches();
  const { record } = useQuickfire();
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
  const tops = topByDiscipline();
  const stats = globalStats();
  const globalBest = GLOBAL_QUICKFIRE[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-cue-accent/20 bg-noir-gradient px-6 py-14 shadow-table md:px-14 md:py-24">
        <div className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full bg-cue-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-felt-500/15 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="section-eyebrow">The LuckyPool Tour</span>
            <span className="h-px w-10 bg-cue-accent/50" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <DisciplineBadge discipline="8-ball" />
            <DisciplineBadge discipline="9-ball" />
            <DisciplineBadge discipline="snooker" />
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-chalk md:text-7xl">
            Bringing cue sports{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              online
            </span>
            .
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-chalk-muted">
            LuckyPool is the tournament platform for 8-ball, 9-ball and snooker.
            Build brackets, live-score matches, track your stats and connect
            with players and rooms around the world.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/builder" className="btn-primary">
              Create a tournament
            </Link>
            <Link to="/play" className="btn-ghost">
              Play the daily rack →
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

      {/* Disciplines showcase with rack visualizations */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Three disciplines, three racks</h2>
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

      {/* Play CTA banner */}
      <section className="mt-16">
        <div className="card relative overflow-hidden border-cue-accent/30 p-0">
          <div className="pointer-events-none absolute inset-0 bg-noir-gradient opacity-80" />
          <div className="pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-cue-accent/20 blur-3xl" />
          <div className="relative grid gap-8 p-8 md:grid-cols-[minmax(0,1fr)_1.2fr] md:p-10">
            <div className="self-center">
              <div className="section-eyebrow">Arcade · free to play</div>
              <h3 className="mt-2 font-display text-4xl text-chalk md:text-5xl">
                9-Ball{' '}
                <span className="bg-gold-gradient bg-clip-text text-transparent">
                  Quickfire
                </span>
              </h3>
              <p className="mt-3 max-w-md text-chalk-muted">
                Click 1 through 9 in order as fast as you can. First click
                starts the clock. Beat your best and see how you stack against
                the pros.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/play" className="btn-primary">
                  Play now
                </Link>
                <Link to="/leaderboard" className="btn-ghost">
                  View leaderboard
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-6 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider text-chalk-muted">
                    Your best
                  </div>
                  <div className="font-mono text-2xl tabular-nums text-cue-accent">
                    {record.bestMs === null ? '—' : formatMs(record.bestMs)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-chalk-muted">
                    Global best
                  </div>
                  <div className="font-mono text-2xl tabular-nums text-chalk">
                    {formatMs(globalBest.ms)}
                  </div>
                  <div className="text-xs text-chalk-muted">{globalBest.player}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Link to="/play" aria-label="Play 9-Ball Quickfire">
                <Rack discipline="9-ball" className="w-full drop-shadow-2xl" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global stats */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Global pulse</h2>
            <p className="section-sub">
              Numbers from across the tour. Something to compare against over
              your morning coffee.
            </p>
          </div>
          <Link
            to="/leaderboard"
            className="text-sm text-cue-accent hover:underline"
          >
            Full leaderboard →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.key} className="card p-4">
              <div className="text-xs uppercase tracking-wider text-chalk-muted">
                {s.label}
              </div>
              <div className="mt-1 font-display text-3xl text-cue-accent">
                {s.value}
              </div>
              {s.caption ? (
                <div className="mt-1 text-xs text-chalk-muted">{s.caption}</div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Top 3 by discipline */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(['8-ball', '9-ball', 'snooker'] as Discipline[]).map((d) => (
            <div key={d} className="card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DisciplineBadge discipline={d} />
                  <span className="text-xs uppercase tracking-wider text-chalk-muted">
                    Top 3
                  </span>
                </div>
                <Link
                  to="/leaderboard"
                  className="text-xs text-cue-accent hover:underline"
                >
                  More →
                </Link>
              </div>
              <ol className="mt-4 space-y-2">
                {tops[d].map((r, i) => (
                  <li
                    key={r.player.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 font-mono text-xs text-chalk-muted">
                        {i + 1}
                      </span>
                      <Avatar name={r.player.name} hue={r.player.avatarHue} size={26} />
                      <Link
                        to={`/players/${r.player.id}`}
                        className="hover:text-cue-accent"
                      >
                        {r.player.name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-chalk">{r.rating}</span>
                      <span
                        className={`text-xs ${
                          r.weekDelta > 0
                            ? 'text-green-400'
                            : r.weekDelta < 0
                              ? 'text-red-400'
                              : 'text-chalk-muted'
                        }`}
                      >
                        {r.weekDelta > 0 ? '+' : ''}
                        {r.weekDelta}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
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
  discipline: Discipline;
  title: string;
  blurb: string;
  bullets: string[];
}) {
  return (
    <div className="card card-hover overflow-hidden p-0">
      <div className="relative border-b border-chalk/10 bg-black/30 p-3">
        <Rack discipline={discipline} className="w-full" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-chalk">{title}</h3>
          <DisciplineBadge discipline={discipline} />
        </div>
        <p className="mt-2 text-sm text-chalk-muted">{blurb}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-chalk/85">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-cue-accent" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
