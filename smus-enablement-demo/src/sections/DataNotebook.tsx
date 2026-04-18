import { useMemo, useState } from 'react';
import { mockCustomers } from '../data/mock';
import { ValueBanner } from '../components/ValueBanner';

type Op = 'filter' | 'groupby' | 'aggregate';

const DATASETS = [
  { id: 'gdc.customers', rows: 1_240, columns: 7, description: 'Governed customer master (PII masked).' },
  { id: 'gdc.sales', rows: 182_413, columns: 9, description: 'Sales fact table (last 36 months).' },
  { id: 'gdc.customer_events', rows: 982_104, columns: 6, description: 'Lifecycle events + churn flags.' },
  { id: 'marketing.campaign_touches', rows: 54_221, columns: 5, description: 'Outbound touches joined on customer_id.' },
];

export function DataNotebook() {
  const [selected, setSelected] = useState<string[]>(['gdc.customers']);
  const [region, setRegion] = useState<'ALL' | 'NA' | 'EU' | 'APAC'>('ALL');
  const [op, setOp] = useState<Op>('filter');
  const [dragOver, setDragOver] = useState(false);

  const filtered = useMemo(
    () => mockCustomers.filter((c) => region === 'ALL' || c.region === region),
    [region],
  );

  const grouped = useMemo(() => {
    const buckets = new Map<string, { region: string; revenue: number; customers: number }>();
    for (const c of filtered) {
      const b = buckets.get(c.region) ?? { region: c.region, revenue: 0, customers: 0 };
      b.revenue += c.revenue;
      b.customers += 1;
      buckets.set(c.region, b);
    }
    return [...buckets.values()].sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const addDataset = (id: string) => {
    if (!selected.includes(id)) setSelected((s) => [...s, id]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Data notebook</h1>
        <p className="section-sub mt-1 max-w-3xl">
          Drag governed datasets into the notebook, preview schemas, and chain transforms. The same
          frame is ML-ready for the next step — no re-auth, no re-ingest.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="card p-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Governed datasets</h3>
          <p className="mb-3 text-[11px] text-slate-400">
            Drag a tile onto the workspace to add it to the notebook.
          </p>
          <div className="space-y-2">
            {DATASETS.map((d) => (
              <div
                key={d.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', d.id)}
                onClick={() => addDataset(d.id)}
                className="cursor-grab rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs transition hover:border-aws-accent/40 hover:bg-white/[0.06] active:cursor-grabbing"
              >
                <div className="font-mono text-aws-accent">{d.id}</div>
                <div className="mt-1 text-slate-300">{d.description}</div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{d.rows.toLocaleString()} rows</span>
                  <span>·</span>
                  <span>{d.columns} cols</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const id = e.dataTransfer.getData('text/plain');
              if (id) addDataset(id);
            }}
            className={`card flex min-h-[84px] flex-wrap items-center gap-2 p-4 transition ${
              dragOver ? 'border-aws-accent/60 bg-aws-accent/10' : ''
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-slate-400">Workspace</span>
            {selected.length === 0 && (
              <span className="text-sm text-slate-400">Drop datasets here</span>
            )}
            {selected.map((id) => (
              <span
                key={id}
                className="chip border-aws-accent/40 bg-aws-accent/10 text-white"
              >
                {id}
                <button
                  className="ml-1 text-slate-400 hover:text-white"
                  onClick={() => setSelected((s) => s.filter((x) => x !== id))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h3 className="text-base font-semibold text-white">Preview · gdc.customers</h3>
              <span className="chip">Row-level security applied</span>
              <span className="chip">PII masked</span>
            </div>
            <div className="overflow-auto rounded-md border border-white/10">
              <table className="min-w-full text-xs">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    {Object.keys(mockCustomers[0]).map((c) => (
                      <th key={c} className="px-3 py-2 text-left font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockCustomers.slice(0, 8).map((r) => (
                    <tr
                      key={r.customer_id}
                      className="border-t border-white/5 odd:bg-white/[0.02]"
                    >
                      {Object.keys(mockCustomers[0]).map((c) => (
                        <td key={c} className="px-3 py-2 font-mono text-slate-200">
                          {typeof r[c as keyof typeof r] === 'number'
                            ? (r[c as keyof typeof r] as number).toLocaleString()
                            : (r[c as keyof typeof r] as string)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">Transform</h3>
              <div className="inline-flex overflow-hidden rounded-md border border-white/10 bg-white/5 text-xs">
                {(['filter', 'groupby', 'aggregate'] as Op[]).map((o) => (
                  <button
                    key={o}
                    className={`px-3 py-1.5 ${
                      op === o ? 'bg-aws-accent/25 text-white' : 'text-slate-300 hover:bg-white/10'
                    }`}
                    onClick={() => setOp(o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {op === 'filter' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-300">Region =</span>
                  {(['ALL', 'NA', 'EU', 'APAC'] as const).map((r) => (
                    <button
                      key={r}
                      className={`chip cursor-pointer ${
                        region === r
                          ? 'border-aws-accent/60 bg-aws-accent/15 text-white'
                          : 'hover:border-aws-accent/40'
                      }`}
                      onClick={() => setRegion(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <pre className="rounded-md border border-white/10 bg-black/30 p-3 font-mono text-[12px] text-emerald-200">
{`customers = gdc.read('customers')\nfiltered = customers[customers['region'] == '${region}']  # ${region === 'ALL' ? 'no filter' : 'one-liner'}`}
                </pre>
                <div className="text-xs text-slate-400">
                  {filtered.length} of {mockCustomers.length} rows after filter
                </div>
              </div>
            )}

            {op === 'groupby' && (
              <div className="space-y-3">
                <pre className="rounded-md border border-white/10 bg-black/30 p-3 font-mono text-[12px] text-emerald-200">
{`grouped = filtered.groupby('region').agg(revenue=('revenue','sum'),\n                                             customers=('customer_id','count'))`}
                </pre>
                <div className="overflow-auto rounded-md border border-white/10">
                  <table className="min-w-full text-xs">
                    <thead className="bg-white/5 text-slate-300">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">region</th>
                        <th className="px-3 py-2 text-left font-medium">customers</th>
                        <th className="px-3 py-2 text-left font-medium">revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped.map((g) => (
                        <tr
                          key={g.region}
                          className="border-t border-white/5 odd:bg-white/[0.02]"
                        >
                          <td className="px-3 py-2 font-mono text-slate-200">{g.region}</td>
                          <td className="px-3 py-2 font-mono text-slate-200">{g.customers}</td>
                          <td className="px-3 py-2 font-mono text-slate-200">
                            {g.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {op === 'aggregate' && (
              <div className="space-y-3">
                <pre className="rounded-md border border-white/10 bg-black/30 p-3 font-mono text-[12px] text-emerald-200">
{`summary = {\n  'total_revenue': filtered.revenue.sum(),\n  'avg_revenue':   round(filtered.revenue.mean(), 2),\n  'customers':     filtered.shape[0],\n}`}
                </pre>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="stat">
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                      Total revenue
                    </div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      $
                      {filtered
                        .reduce((acc, c) => acc + c.revenue, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                      Avg revenue
                    </div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      $
                      {(
                        filtered.reduce((acc, c) => acc + c.revenue, 0) /
                        Math.max(1, filtered.length)
                      ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="text-xs uppercase tracking-wider text-slate-400">Customers</div>
                    <div className="mt-1 text-xl font-semibold text-white">{filtered.length}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="mb-2 text-base font-semibold text-white">ML handoff</h3>
            <p className="text-sm text-slate-300">
              The resulting frame is already registered in the project. One click promotes it to a
              <span className="mx-1 rounded bg-aws-accent/15 px-1.5 text-aws-accent">
                Feature Group
              </span>
              — SageMaker Training jobs pick it up directly.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn-primary">→ Promote to Feature Group</button>
              <button className="btn-ghost">→ Attach to training job</button>
              <button className="btn-ghost">→ Share to project</button>
            </div>
          </div>
        </div>
      </div>

      <ValueBanner
        points={[
          'Drag-drop governed data',
          'Inline previews',
          'SQL + Python side by side',
          'Zero-copy ML handoff',
        ]}
      />
    </div>
  );
}
