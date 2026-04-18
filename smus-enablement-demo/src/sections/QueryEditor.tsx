import { useMemo, useState } from 'react';
import { QUERY_EXAMPLES, type QueryExample } from '../data/mock';
import { ValueBanner } from '../components/ValueBanner';

function pickExample(prompt: string): QueryExample {
  const p = prompt.toLowerCase();
  if (p.includes('churn')) return QUERY_EXAMPLES[1];
  if (p.includes('average') || p.includes('aov') || p.includes('order value') || p.includes('product'))
    return QUERY_EXAMPLES[2];
  return QUERY_EXAMPLES[0];
}

export function QueryEditor() {
  const [prompt, setPrompt] = useState('Show top 10 customers by revenue last quarter');
  const [active, setActive] = useState<QueryExample | null>(QUERY_EXAMPLES[0]);
  const [generating, setGenerating] = useState(false);
  const [explainOpen, setExplainOpen] = useState(true);

  const canGenerate = prompt.trim().length > 0 && !generating;

  const onGenerate = () => {
    setGenerating(true);
    const picked = pickExample(prompt);
    setActive(null);
    window.setTimeout(() => {
      setActive(picked);
      setGenerating(false);
    }, 650);
  };

  const columns = useMemo(() => (active ? Object.keys(active.rows[0] ?? {}) : []), [active]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-title">AI Query Editor</h1>
          <p className="section-sub mt-1 max-w-3xl">
            Ask in natural language. SMUS grounds the query in the Governed Data Catalog, respects
            row/column policies, and explains its logic alongside the SQL.
          </p>
        </div>
        <span className="chip border-aws-accent/40 bg-aws-accent/10 text-aws-accent">
          Amazon Q · SMUS analytics
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="card p-5">
          <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
            Ask in natural language
          </label>
          <div className="flex items-start gap-2">
            <textarea
              data-testid="nl-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="flex-1 resize-none rounded-md border border-white/10 bg-aws-slate/70 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-aws-accent/60 focus:ring-2 focus:ring-aws-accent/30"
              placeholder="e.g. Show top 10 customers by revenue last quarter"
            />
            <button
              data-testid="generate-sql"
              className="btn-primary h-10 shrink-0"
              disabled={!canGenerate}
              onClick={onGenerate}
            >
              {generating ? 'Generating…' : '✨ Generate Query'}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Try:</span>
            {QUERY_EXAMPLES.map((q) => (
              <button
                key={q.id}
                className="chip cursor-pointer hover:border-aws-accent/50 hover:text-white"
                onClick={() => {
                  setPrompt(q.prompt);
                  setActive(q);
                }}
              >
                {q.prompt}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-slate-400">Generated SQL</div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="chip">Catalog: gdc.default</span>
                <span className="chip">Engine: Athena SQL</span>
              </div>
            </div>
            <pre
              data-testid="sql-output"
              className="max-h-[360px] overflow-auto rounded-md border border-white/10 bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed text-emerald-200"
            >
{active ? active.sql : '-- waiting for a prompt --'}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Preview results</h3>
              <span className="chip">Sampled · 10 rows</span>
            </div>
            {active ? (
              <div className="overflow-auto rounded-md border border-white/10">
                <table className="min-w-full text-xs">
                  <thead className="bg-white/5 text-slate-300">
                    <tr>
                      {columns.map((c) => (
                        <th key={c} className="px-3 py-2 text-left font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {active.rows.map((r, i) => (
                      <tr
                        key={i}
                        className="border-t border-white/5 odd:bg-white/[0.02] hover:bg-white/[0.05]"
                      >
                        {columns.map((c) => (
                          <td key={c} className="px-3 py-2 font-mono text-slate-200">
                            {typeof r[c] === 'number'
                              ? (r[c] as number).toLocaleString()
                              : (r[c] as string)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid h-32 place-items-center text-xs text-slate-500">
                Generate a query to preview results
              </div>
            )}
          </div>

          <div className="card p-5">
            <button
              className="mb-3 flex w-full items-center justify-between text-left"
              onClick={() => setExplainOpen((v) => !v)}
            >
              <h3 className="text-base font-semibold text-white">Explain this query</h3>
              <span className="chip">{explainOpen ? '▾' : '▸'}</span>
            </button>
            {explainOpen && active && (
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
                {active.explanation.map((e, i) => (
                  <li key={i} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    {e}
                  </li>
                ))}
              </ol>
            )}
            {explainOpen && !active && (
              <p className="text-xs text-slate-500">Generate a query first to see the explanation.</p>
            )}
          </div>
        </div>
      </div>

      <ValueBanner
        points={[
          'NL → governed SQL',
          'Auto-explanations',
          'Lineage preserved',
          '3x faster query authoring',
        ]}
      />
    </div>
  );
}
