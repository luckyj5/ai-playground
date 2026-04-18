import { useState } from 'react';
import { ValueBanner } from '../components/ValueBanner';

type Kernel = 'python' | 'spark' | 'sql' | 'r';

type Cell = {
  id: string;
  kernel: Kernel;
  source: string;
  result: string;
  status: 'idle' | 'running' | 'done';
  durationMs: number;
};

const KERNELS: { key: Kernel; label: string; accent: string }[] = [
  { key: 'python', label: 'Python 3.11', accent: 'text-emerald-300' },
  { key: 'spark', label: 'PySpark 3.5', accent: 'text-orange-300' },
  { key: 'sql', label: 'Athena SQL', accent: 'text-sky-300' },
  { key: 'r', label: 'R 4.3', accent: 'text-purple-300' },
];

const initialCells: Cell[] = [
  {
    id: 'c1',
    kernel: 'sql',
    source:
      "-- governed SQL against the Unified Studio catalog\nSELECT region, SUM(amount) AS revenue\nFROM gdc.sales\nWHERE date >= DATE '2025-01-01'\nGROUP BY region\nORDER BY revenue DESC;",
    result:
      'region | revenue\n-------+----------\nNA     | 9,412,380\nEU     | 5,120,900\nAPAC   | 3,880,140\nLATAM  |   920,110',
    status: 'done',
    durationMs: 420,
  },
  {
    id: 'c2',
    kernel: 'spark',
    source:
      "# Large join on S3 + Redshift via the same dataframe API\ndf = (spark.read.table('gdc.sales')\n        .join(spark.read.table('gdc.customers'), 'customer_id')\n        .filter(col('date') >= '2025-01-01')\n        .groupBy('region', 'product')\n        .agg(sum('amount').alias('revenue')))\ndf.show(5)",
    result:
      '+------+-----------+-----------+\n|region|product    |revenue    |\n+------+-----------+-----------+\n|NA    |ML Platform|4,120,000.0|\n|NA    |Analytics  |3,290,380.0|\n|EU    |Analytics  |2,140,500.0|\n|APAC  |ML Platform|1,610,220.0|\n|NA    |Data Lake  |2,002,000.0|\n+------+-----------+-----------+',
    status: 'done',
    durationMs: 1_810,
  },
  {
    id: 'c3',
    kernel: 'python',
    source:
      "# Feature engineering in pandas on the same dataset\nimport pandas as pd\nfeatures = df.toPandas()\nfeatures['revenue_log'] = features['revenue'].apply(lambda x: round(pd.np.log1p(x), 3))\nfeatures.head()",
    result:
      '   region  product      revenue  revenue_log\n0  NA      ML Platform  4120000.0  15.231\n1  NA      Analytics    3290380.0  15.007\n2  EU      Analytics    2140500.0  14.577\n3  APAC    ML Platform  1610220.0  14.292\n4  NA      Data Lake    2002000.0  14.510',
    status: 'done',
    durationMs: 380,
  },
];

export function PolyNotebook() {
  const [cells, setCells] = useState<Cell[]>(initialCells);

  const setKernel = (id: string, kernel: Kernel) =>
    setCells((cs) => cs.map((c) => (c.id === id ? { ...c, kernel } : c)));

  const setSource = (id: string, source: string) =>
    setCells((cs) => cs.map((c) => (c.id === id ? { ...c, source } : c)));

  const runCell = (id: string) => {
    setCells((cs) => cs.map((c) => (c.id === id ? { ...c, status: 'running' } : c)));
    window.setTimeout(() => {
      setCells((cs) =>
        cs.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'done',
                durationMs: Math.floor(300 + Math.random() * 1500),
              }
            : c,
        ),
      );
    }, 600);
  };

  const runAll = () => cells.forEach((c) => runCell(c.id));

  const addCell = (kernel: Kernel) =>
    setCells((cs) => [
      ...cs,
      {
        id: `c${cs.length + 1}-${Date.now()}`,
        kernel,
        source: kernel === 'sql' ? '-- new SQL cell\nSELECT 1;' : '# new cell\n',
        result: '',
        status: 'idle',
        durationMs: 0,
      },
    ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-title">Poly-compute notebook</h1>
          <p className="section-sub mt-1 max-w-3xl">
            One notebook. Per-cell kernel choice. The same governed dataset flows from SQL to Spark
            to Python — no exports, no re-authentication, no context loss.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={() => addCell('python')}>
            + Python
          </button>
          <button className="btn-ghost" onClick={() => addCell('spark')}>
            + Spark
          </button>
          <button className="btn-ghost" onClick={() => addCell('sql')}>
            + SQL
          </button>
          <button data-testid="run-all" className="btn-primary" onClick={runAll}>
            ▶ Run all
          </button>
        </div>
      </div>

      <div className="card p-3">
        <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="chip">notebooks/revenue_story.ipynb</span>
            <span className="chip">Project: quarterly-review</span>
            <span className="chip border-emerald-400/40 text-emerald-300">Governed dataset</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>auto-saved</span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-3">
          {cells.map((cell, idx) => (
            <div key={cell.id} className="rounded-lg border border-white/10 bg-white/[0.03]">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-slate-400">In [{idx + 1}]</span>
                  <select
                    data-testid={`kernel-${cell.id}`}
                    value={cell.kernel}
                    onChange={(e) => setKernel(cell.id, e.target.value as Kernel)}
                    className="rounded-md border border-white/10 bg-aws-slate/80 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-aws-accent/40"
                  >
                    {KERNELS.map((k) => (
                      <option key={k.key} value={k.key}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`chip ${
                      KERNELS.find((k) => k.key === cell.kernel)?.accent ?? ''
                    }`}
                  >
                    per-cell kernel
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    {cell.status === 'running'
                      ? 'running…'
                      : cell.status === 'done'
                        ? `${cell.durationMs}ms`
                        : 'idle'}
                  </span>
                  <button className="btn-ghost px-2 py-1" onClick={() => runCell(cell.id)}>
                    ▶ Run
                  </button>
                </div>
              </div>
              <textarea
                value={cell.source}
                onChange={(e) => setSource(cell.id, e.target.value)}
                rows={Math.max(4, cell.source.split('\n').length)}
                className="block w-full resize-y bg-transparent px-4 py-3 font-mono text-[12.5px] leading-relaxed text-slate-100 outline-none"
              />
              {cell.result && (
                <pre className="max-h-56 overflow-auto border-t border-white/10 bg-black/30 px-4 py-3 font-mono text-[12px] leading-relaxed text-slate-300">
{cell.status === 'running' ? 'Executing on managed compute…' : cell.result}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>

      <ValueBanner
        points={[
          'Per-cell kernels',
          'Shared governed data',
          'No CSV handoffs',
          '2.5x less context switching',
        ]}
      />
    </div>
  );
}
