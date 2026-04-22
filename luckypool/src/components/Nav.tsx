import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/matches', label: 'Matches' },
  { to: '/players', label: 'Players' },
  { to: '/venues', label: 'Venues' },
  { to: '/builder', label: 'Tournament Builder' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wide text-chalk">
              Lucky<span className="text-cue-accent">Pool</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-chalk/40">
              Pool · Snooker · Tournaments
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-chalk'
                    : 'text-chalk/70 hover:bg-white/5 hover:text-chalk'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/builder" className="btn-primary hidden md:inline-flex">
          Create tournament
        </Link>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap gap-1 px-2 pb-2 md:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `rounded-md px-2.5 py-1 text-xs transition-colors ${
                isActive
                  ? 'bg-white/10 text-chalk'
                  : 'text-chalk/70 hover:bg-white/5'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-cue-accent text-ink shadow-cue">
      <span className="absolute inset-1 rounded-full bg-chalk" />
      <span className="relative font-display font-bold">8</span>
    </span>
  );
}
