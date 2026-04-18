import { NAV_META, NAV_ORDER, type NavKey } from '../data/mock';

type Props = {
  active: NavKey;
  onChange: (key: NavKey) => void;
  onStartTour: () => void;
  tourRunning: boolean;
};

export function Sidebar({ active, onChange, onStartTour, tourRunning }: Props) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-aws-mist/80 p-4 backdrop-blur">
      <div className="mb-6 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-aws-orange/20 text-aws-orange shadow-glow">
          <span className="text-lg font-bold">S</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">SMUS Demo</div>
          <div className="text-[11px] text-slate-400">Unified Studio Enablement</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ORDER.map((key) => {
          const meta = NAV_META[key];
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              data-testid={`nav-${key}`}
              className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <span className="text-base text-aws-accent">{meta.icon}</span>
              <span className="flex-1 text-left">
                <span className="block font-medium">{meta.title}</span>
                <span className="block text-[11px] text-slate-400">{meta.subtitle}</span>
              </span>
              <span className="kbd">{meta.shortcut}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 space-y-3">
        <button
          onClick={onStartTour}
          className={`w-full ${tourRunning ? 'btn-ghost' : 'btn-orange'}`}
        >
          {tourRunning ? '■ Stop tour' : '▶ Play guided tour'}
        </button>
        <div className="rounded-md border border-white/10 bg-white/5 p-3 text-[11px] text-slate-400">
          <div className="mb-1 font-medium text-slate-200">Shortcuts</div>
          <div className="flex items-center justify-between">
            <span>Sections</span>
            <span>
              <span className="kbd">1</span>–<span className="kbd">8</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Next / prev</span>
            <span>
              <span className="kbd">→</span> <span className="kbd">←</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Toggle tour</span>
            <span>
              <span className="kbd">T</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
