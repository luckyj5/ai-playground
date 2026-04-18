import { BEFORE_AFTER_ROWS } from '../data/mock';
import { ValueBanner } from '../components/ValueBanner';

export function BeforeAfter() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Before vs After SMUS</h1>
        <p className="section-sub mt-1 max-w-3xl">
          The same workflow, side-by-side. Each row is a measurable lift we can quote on a customer
          call.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 border-b border-white/10 bg-white/5 text-[11px] uppercase tracking-wider text-slate-400">
          <div className="col-span-3 px-4 py-3">Dimension</div>
          <div className="col-span-4 px-4 py-3">Before SMUS</div>
          <div className="col-span-4 px-4 py-3">After SMUS</div>
          <div className="col-span-1 px-4 py-3 text-right">Lift</div>
        </div>
        {BEFORE_AFTER_ROWS.map((r, i) => (
          <div
            key={r.dimension}
            className={`grid grid-cols-12 items-center border-b border-white/5 text-sm animate-slide-up ${
              i % 2 === 0 ? 'bg-white/[0.02]' : ''
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="col-span-3 px-4 py-3 font-medium text-white">{r.dimension}</div>
            <div className="col-span-4 px-4 py-3 text-red-200">
              <span className="mr-2">✕</span>
              {r.before}
            </div>
            <div className="col-span-4 px-4 py-3 text-emerald-200">
              <span className="mr-2">✓</span>
              {r.after}
            </div>
            <div className="col-span-1 px-4 py-3 text-right">
              <span className="chip border-aws-orange/40 bg-aws-orange/10 text-aws-orange">
                {r.lift}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="stat">
          <div className="text-xs uppercase tracking-wider text-slate-400">Time to insight</div>
          <div className="mt-1 text-3xl font-semibold text-white">-72%</div>
          <div className="mt-1 text-xs text-slate-400">Access + query + notebook combined</div>
        </div>
        <div className="stat">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Tools per workflow
          </div>
          <div className="mt-1 text-3xl font-semibold text-white">5+ → 1</div>
          <div className="mt-1 text-xs text-slate-400">One identity, one project, one UI</div>
        </div>
        <div className="stat">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Audit coverage
          </div>
          <div className="mt-1 text-3xl font-semibold text-white">100%</div>
          <div className="mt-1 text-xs text-slate-400">Every query + share is logged</div>
        </div>
      </div>

      <ValueBanner
        points={[
          '3x productivity verified in pilots',
          'Governance without tickets',
          'Zero re-work ML handoff',
        ]}
      />
    </div>
  );
}
