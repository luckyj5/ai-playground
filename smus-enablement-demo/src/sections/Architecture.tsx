import { ValueBanner } from '../components/ValueBanner';

const layers = [
  {
    name: 'Experience',
    color: 'from-aws-accent/30 to-aws-accent/5',
    border: 'border-aws-accent/40',
    items: [
      'Unified Studio UI',
      'Projects & identity (IAM Identity Center)',
      'Query Editor · Notebook · Workflow builder',
      'Guided onboarding',
    ],
  },
  {
    name: 'AI & Assistance',
    color: 'from-fuchsia-400/20 to-fuchsia-400/5',
    border: 'border-fuchsia-400/40',
    items: [
      'Amazon Q Developer (NL → SQL, explain, fix)',
      'Auto-generated docs & lineage summaries',
      'Code suggestions across kernels',
    ],
  },
  {
    name: 'Governance',
    color: 'from-aws-orange/25 to-aws-orange/5',
    border: 'border-aws-orange/40',
    items: [
      'Governed Data Catalog (GDC)',
      'Domains · projects · subscriptions',
      'Row / column-level security, tag-based access',
      'Audit trail + lineage',
    ],
  },
  {
    name: 'Compute',
    color: 'from-emerald-400/20 to-emerald-400/5',
    border: 'border-emerald-400/40',
    items: [
      'Athena SQL · Redshift Serverless',
      'Glue / EMR Serverless (Spark)',
      'SageMaker Processing · Training · Endpoints',
      'Per-cell kernels (Python / Spark / SQL / R)',
    ],
  },
  {
    name: 'Data',
    color: 'from-sky-400/20 to-sky-400/5',
    border: 'border-sky-400/40',
    items: [
      'S3 (data lake)',
      'Redshift (warehouse)',
      'Iceberg + Lake Formation tables',
      '3rd-party sources via federated queries',
    ],
  },
];

export function Architecture() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Architecture view</h1>
        <p className="section-sub mt-1 max-w-3xl">
          SMUS is a thin, governed experience layer on top of the AWS analytics + ML stack. Teams
          see one product; under the hood they get the right engine per workload.
        </p>
      </div>

      <div className="space-y-3">
        {layers.map((l, i) => (
          <div
            key={l.name}
            className={`rounded-xl border bg-gradient-to-br ${l.color} ${l.border} animate-slide-up`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold text-white">{l.name}</h3>
              </div>
              <span className="chip">{l.items.length} capabilities</span>
            </div>
            <ul className="grid grid-cols-1 gap-2 p-4 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {l.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-white/10 bg-black/20 px-3 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-base font-semibold text-white">How it flows</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
          <span className="chip">Data domain owners publish</span>
          <span className="text-slate-500">→</span>
          <span className="chip border-aws-orange/40 bg-aws-orange/10 text-aws-orange">GDC</span>
          <span className="text-slate-500">→</span>
          <span className="chip">Consumer subscribes to a project</span>
          <span className="text-slate-500">→</span>
          <span className="chip border-aws-accent/40 bg-aws-accent/10 text-aws-accent">
            Unified Studio UI
          </span>
          <span className="text-slate-500">→</span>
          <span className="chip">Query · Notebook · Train</span>
          <span className="text-slate-500">→</span>
          <span className="chip border-emerald-400/40 bg-emerald-500/10 text-emerald-300">
            Shared artifacts + lineage
          </span>
        </div>
      </div>

      <ValueBanner
        points={[
          'One experience, many engines',
          'Governance + AI built in',
          'Fits existing AWS investments',
        ]}
      />
    </div>
  );
}
