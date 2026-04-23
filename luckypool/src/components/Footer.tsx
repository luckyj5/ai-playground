export function Footer() {
  return (
    <footer className="mt-24 border-t border-chalk/10 bg-ink/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="font-display text-lg text-chalk">
            Lucky<span className="text-cue-accent">Pool</span>
          </div>
          <p className="mt-2 text-sm text-chalk-muted">
            Bringing cue sports online. Tournaments, live scoring, leagues
            and player profiles — for 8-ball, 9-ball and snooker.
          </p>
        </div>
        <FooterCol
          title="Play"
          items={['8-Ball', '9-Ball', 'Snooker', 'Leagues', 'Exhibitions']}
        />
        <FooterCol
          title="Operate"
          items={[
            'Tournament Builder',
            'Live Scoring',
            'TV Display',
            'Streaming Overlays',
            'Tablet Scoring',
          ]}
        />
        <FooterCol
          title="Company"
          items={['About', 'Pricing', 'Careers', 'Press', 'Contact']}
        />
      </div>
      <div className="border-t border-chalk/10 py-4 text-center text-xs text-chalk-muted">
        © {new Date().getFullYear()} LuckyPool · Demo build — not a real
        service.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-chalk-muted">
        {title}
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-chalk/70">
        {items.map((i) => (
          <li key={i} className="hover:text-chalk">
            <a href="#">{i}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
