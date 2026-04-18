import { ValueBanner } from '../components/ValueBanner';

const stats = [
  { label: 'Productivity lift', value: '3x', sub: 'Across data + ML teams' },
  { label: 'Time to first query', value: '10 min', sub: 'From days on legacy stack' },
  { label: 'Tool switches / workflow', value: '1', sub: 'Down from 5+' },
  { label: 'Governance', value: '100%', sub: 'Audited by default' },
];

const pillars = [
  {
    title: 'Unified access',
    body: 'Governed Data Catalog replaces IAM+Glue ticket queues. Request access, inherit row/column policies.',
    icon: '▣',
  },
  {
    title: 'AI-assisted analytics',
    body: 'NL → SQL, auto-explanations, reusable governed views. Analysts ship insights in minutes.',
    icon: '⌕',
  },
  {
    title: 'Poly-compute notebooks',
    body: 'One notebook, per-cell kernels (Python, Spark, SQL, R). Mix prep, analytics, and ML without exporting CSVs.',
    icon: '⎔',
  },
  {
    title: 'End-to-end project',
    body: 'Datasets, notebooks, models, endpoints and dashboards share the same project, identity, and lineage.',
    icon: '❖',
  },
];

export function Overview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-title">SageMaker Unified Studio — 3x the throughput</h1>
          <p className="section-sub mt-1 max-w-3xl">
            SMUS is the single home for data, analytics, and ML on AWS. This demo walks through the
            moments where it collapses friction — from access requests and query authoring to
            multi-runtime notebooks and model handoff.
          </p>
        </div>
        <span className="chip border-aws-orange/40 bg-aws-orange/10 text-aws-orange">
          Interview-ready enablement
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <div className="text-xs uppercase tracking-wider text-slate-400">{s.label}</div>
            <div className="mt-1 text-3xl font-semibold text-white">{s.value}</div>
            <div className="mt-1 text-xs text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      <ValueBanner
        points={[
          '3x developer + DS productivity',
          'Reduced context switching',
          'Faster data-to-insight',
          'Centralized governance',
        ]}
      />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">What changes with SMUS</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title} className="card card-hover p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-aws-accent/15 text-aws-accent">
                  {p.icon}
                </span>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
              </div>
              <p className="text-sm text-slate-300">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-2 text-base font-semibold text-white">Narrative arc for this demo</h2>
        <ol className="grid list-decimal grid-cols-1 gap-2 pl-6 text-sm text-slate-300 md:grid-cols-2">
          <li>Start with the <em>Data Access &amp; Governance</em> pain (Before/After toggle).</li>
          <li>Show the <em>AI Query Editor</em> turning NL into governed SQL.</li>
          <li>Open the <em>Poly-compute Notebook</em> — switch kernels per cell.</li>
          <li>Use the <em>Data Notebook</em> to go from dataset → ML-ready feature frame.</li>
          <li>Zoom out to the <em>Unified Workflow</em> and quantify the 3x.</li>
          <li>Wrap with the <em>Before vs After</em> table and the <em>Architecture</em> map.</li>
        </ol>
      </div>
    </div>
  );
}
