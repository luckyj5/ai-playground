import type { Discipline } from '../types';

const styles: Record<Discipline, { label: string; cls: string; dot: string }> = {
  '8-ball': {
    label: '8-Ball',
    cls: 'bg-ink/60 text-chalk border-chalk/20',
    dot: 'bg-chalk',
  },
  '9-ball': {
    label: '9-Ball',
    cls: 'bg-yellow-900/30 text-cue-accent border-cue-accent/30',
    dot: 'bg-cue-accent',
  },
  snooker: {
    label: 'Snooker',
    cls: 'bg-red-900/30 text-red-300 border-red-400/30',
    dot: 'bg-red-400',
  },
};

export function DisciplineBadge({
  discipline,
  className = '',
}: {
  discipline: Discipline;
  className?: string;
}) {
  const s = styles[discipline];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls} ${className}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
