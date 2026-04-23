import { venues } from '../data/mock';
import { DisciplineBadge } from '../components/DisciplineBadge';

export default function Venues() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="section-title">Partner venues</h1>
      <p className="section-sub">
        Rooms that live-stream matches, run tablet scoring and host
        LuckyPool events.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((v) => (
          <div key={v.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl">{v.name}</h3>
                <div className="text-sm text-chalk-muted">
                  {v.city}, {v.country}
                </div>
              </div>
              <div className="rounded-md border border-chalk/10 bg-chalk/[0.05] px-2 py-1 text-center">
                <div className="font-mono text-lg text-cue-accent">
                  {v.tables}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-chalk-muted">
                  tables
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {v.disciplines.map((d) => (
                <DisciplineBadge key={d} discipline={d} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
