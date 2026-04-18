import { useMemo, useState } from 'react';
import { WORKFLOW_STEPS } from '../data/mock';
import { ValueBanner } from '../components/ValueBanner';

export function UnifiedWorkflow() {
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState<'before' | 'after'>('after');

  const totalBefore = useMemo(
    () => WORKFLOW_STEPS.reduce((a, s) => a + s.minutesBefore, 0),
    [],
  );
  const totalAfter = useMemo(
    () => WORKFLOW_STEPS.reduce((a, s) => a + s.minutesAfter, 0),
    [],
  );

  const speedup = (totalBefore / totalAfter).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-title">Unified Studio workflow</h1>
          <p className="section-sub mt-1 max-w-3xl">
            The same project spans data access, SQL exploration, notebook prep, training, and
            deployment. Click a step to see what SMUS replaces.
          </p>
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-white/10 bg-white/5 text-sm">
          <button
            className={`px-4 py-2 ${
              mode === 'before' ? 'bg-aws-orange text-aws-night' : 'text-slate-300 hover:bg-white/10'
            }`}
            onClick={() => setMode('before')}
          >
            Before SMUS
          </button>
          <button
            className={`px-4 py-2 ${
              mode === 'after' ? 'bg-aws-accent text-aws-night' : 'text-slate-300 hover:bg-white/10'
            }`}
            onClick={() => setMode('after')}
          >
            After SMUS
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            <span className="mr-3 font-semibold text-white">End-to-end workflow</span>
            <span className="text-slate-400">
              Data → Query → Notebook → Training → Deploy
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-xs uppercase tracking-wider text-slate-400">
              Total wall-clock
            </div>
            <div>
              <span className="text-red-300">{totalBefore} min before</span>
              <span className="mx-2 text-slate-500">→</span>
              <span className="text-emerald-300">{totalAfter} min after</span>
            </div>
            <span className="chip border-aws-orange/40 bg-aws-orange/10 text-aws-orange">
              {speedup}x faster
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-7 mx-4 h-px bg-white/10" />
          <div className="relative grid grid-cols-1 gap-3 md:grid-cols-5">
            {WORKFLOW_STEPS.map((s, i) => {
              const active = i === current;
              const mins = mode === 'before' ? s.minutesBefore : s.minutesAfter;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrent(i)}
                  className={`relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition ${
                    active
                      ? 'border-aws-accent/60 bg-aws-accent/10 shadow-glow'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-aws-night text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <span
                      className={`chip ${
                        mode === 'after'
                          ? 'border-emerald-400/40 text-emerald-300'
                          : 'border-red-400/40 text-red-300'
                      }`}
                    >
                      {mins}m
                    </span>
                  </div>
                  <div className="font-medium text-white">{s.title}</div>
                  <div className="text-[11px] text-slate-400">{s.tool}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              Step {current + 1}: {WORKFLOW_STEPS[current].title}
            </h3>
            <span className="chip">{WORKFLOW_STEPS[current].tool}</span>
          </div>
          <p className="mt-2 text-sm text-slate-300">{WORKFLOW_STEPS[current].desc}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border border-red-400/20 bg-red-500/5 p-3">
              <div className="text-xs uppercase tracking-wider text-red-300">Before SMUS</div>
              <div className="mt-1 text-white">
                {WORKFLOW_STEPS[current].minutesBefore} minutes
              </div>
            </div>
            <div className="rounded-md border border-emerald-400/20 bg-emerald-500/5 p-3">
              <div className="text-xs uppercase tracking-wider text-emerald-300">With SMUS</div>
              <div className="mt-1 text-white">
                {WORKFLOW_STEPS[current].minutesAfter} minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      <ValueBanner
        points={[
          'Single project, single identity',
          'No tool switching',
          `${speedup}x faster end-to-end`,
          'Lineage + governance included',
        ]}
      />
    </div>
  );
}
