import { useState } from 'react';
import { ValueBanner } from '../components/ValueBanner';
import { Tooltip } from '../components/Tooltip';

const beforeSteps = [
  { t: 'Day 0', title: 'File access ticket', detail: 'Data consumer files a Jira for a table in Lake Formation.' },
  { t: 'Day 1–2', title: 'IAM back-and-forth', detail: 'Platform team debates blast radius, scopes roles per account.' },
  { t: 'Day 3', title: 'Glue + LF wiring', detail: 'New IAM role, Glue DB grant, Lake Formation tag-based access.' },
  { t: 'Day 4', title: 'Schema drift', detail: 'Column renamed since ticket was filed — back to step 1.' },
  { t: 'Day 5+', title: 'Still waiting…', detail: 'Revenue review is tomorrow, consumer finally gets read access.' },
];

const afterSteps = [
  { t: '0:00', title: 'Search GDC', detail: 'Find "sales" in the Governed Data Catalog, see owner + SLA + lineage.' },
  { t: '0:02', title: 'Request access', detail: 'One-click subscribe; approver gets a scoped request with purpose.' },
  { t: '0:05', title: 'Policies inherited', detail: 'Row/column-level security applied automatically from the domain.' },
  { t: '0:08', title: 'Query in editor', detail: 'Open AI Query Editor — `gdc.sales` auto-suggests, lineage visible.' },
  { t: '0:10', title: 'Shared governed view', detail: 'Publish as `gdc.sales_top_customers` with audit trail.' },
];

const painStack = [
  'Athena console',
  'Redshift query editor',
  'Glue Data Brew',
  'EMR Studio',
  'SageMaker Studio',
  'QuickSight',
  'Jupyter on EC2',
  'IAM + Lake Formation',
];

export function DataAccess() {
  const [mode, setMode] = useState<'before' | 'after'>('before');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-title">Data access &amp; governance</h1>
          <p className="section-sub mt-1 max-w-3xl">
            The Governed Data Catalog (GDC) replaces the ticket-IAM-Glue-Lake-Formation chain with a
            self-serve, policy-inheriting access layer.
          </p>
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-white/10 bg-white/5 text-sm">
          <button
            data-testid="toggle-before"
            className={`px-4 py-2 transition ${
              mode === 'before' ? 'bg-aws-orange text-aws-night' : 'text-slate-300 hover:bg-white/10'
            }`}
            onClick={() => setMode('before')}
          >
            Before SMUS
          </button>
          <button
            data-testid="toggle-after"
            className={`px-4 py-2 transition ${
              mode === 'after' ? 'bg-aws-accent text-aws-night' : 'text-slate-300 hover:bg-white/10'
            }`}
            onClick={() => setMode('after')}
          >
            After SMUS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              {mode === 'before' ? 'Legacy access flow' : 'SMUS GDC flow'}
            </h2>
            <span
              className={`chip ${
                mode === 'before'
                  ? 'border-red-400/30 text-red-300'
                  : 'border-emerald-400/30 text-emerald-300'
              }`}
            >
              {mode === 'before' ? '~5 business days' : '~10 minutes'}
            </span>
          </div>

          <ol className="space-y-3">
            {(mode === 'before' ? beforeSteps : afterSteps).map((s, i) => (
              <li
                key={s.title}
                className="animate-slide-up rounded-lg border border-white/10 bg-white/[0.03] p-3"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-xs ${
                      mode === 'before' ? 'text-red-300' : 'text-emerald-300'
                    }`}
                  >
                    {s.t}
                  </span>
                  <span className="font-medium text-white">{s.title}</span>
                </div>
                <div className="mt-1 text-xs text-slate-400">{s.detail}</div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="mb-2 text-base font-semibold text-white">Tool sprawl</h3>
            <p className="mb-3 text-sm text-slate-400">
              Before SMUS, data teams jump across 5–8 consoles per workflow.
            </p>
            <div className="flex flex-wrap gap-2">
              {painStack.map((t) => (
                <span
                  key={t}
                  className={`chip transition ${
                    mode === 'before'
                      ? 'border-red-400/30 bg-red-500/10 text-red-200'
                      : 'opacity-40 line-through'
                  }`}
                >
                  {t}
                </span>
              ))}
              <span
                className={`chip transition ${
                  mode === 'after'
                    ? 'border-aws-accent/40 bg-aws-accent/15 text-white'
                    : 'opacity-40'
                }`}
              >
                SageMaker Unified Studio
              </span>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 text-base font-semibold text-white">What GDC adds</h3>
            <ul className="grid grid-cols-1 gap-2 text-sm text-slate-300 sm:grid-cols-2">
              <li>
                <Tooltip label="A single domain catalog spans Lake Formation, Redshift, and S3 tables.">
                  <span className="chip cursor-help">Single catalog across stores</span>
                </Tooltip>
              </li>
              <li>
                <Tooltip label="Row + column-level policies inherited from the domain — no per-query masking code.">
                  <span className="chip cursor-help">Row / column masking</span>
                </Tooltip>
              </li>
              <li>
                <Tooltip label="Every query, subscription, and share is logged with purpose + approver.">
                  <span className="chip cursor-help">Audited by default</span>
                </Tooltip>
              </li>
              <li>
                <Tooltip label="Lineage graph spans ingest → governed view → notebook → model → dashboard.">
                  <span className="chip cursor-help">End-to-end lineage</span>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ValueBanner
        points={[
          'Access in minutes, not days',
          'Governance without tickets',
          'One catalog across Redshift + S3',
          'Lineage + audit included',
        ]}
      />
    </div>
  );
}
