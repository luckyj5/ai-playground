type Props = {
  points: string[];
};

export function ValueBanner({ points }: Props) {
  return (
    <div className="card flex flex-wrap items-center gap-3 px-4 py-2 text-xs text-slate-300">
      <span className="font-medium text-aws-orange">Value unlocked</span>
      {points.map((p) => (
        <span key={p} className="chip">
          {p}
        </span>
      ))}
    </div>
  );
}
