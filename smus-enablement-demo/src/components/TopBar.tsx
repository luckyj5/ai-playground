import { NAV_META, NAV_ORDER, type NavKey } from '../data/mock';

type Props = {
  active: NavKey;
  onChange: (key: NavKey) => void;
  tourRunning: boolean;
};

export function TopBar({ active, onChange, tourRunning }: Props) {
  const meta = NAV_META[active];
  const idx = NAV_ORDER.indexOf(active);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-aws-mist/60 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>SageMaker Unified Studio</span>
          <span>/</span>
          <span className="text-slate-200">Enablement demo</span>
          <span>/</span>
          <span className="text-white">{meta.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {tourRunning && (
          <span className="chip animate-pulse-soft border-aws-orange/40 bg-aws-orange/10 text-aws-orange">
            ● Guided tour running
          </span>
        )}
        <span className="chip">3x productivity · unified governance</span>
        <button
          className="btn-ghost"
          disabled={idx === 0}
          onClick={() => onChange(NAV_ORDER[Math.max(0, idx - 1)])}
        >
          ←
        </button>
        <button
          className="btn-primary"
          disabled={idx === NAV_ORDER.length - 1}
          onClick={() => onChange(NAV_ORDER[Math.min(NAV_ORDER.length - 1, idx + 1)])}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
