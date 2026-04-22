export function Avatar({
  name,
  hue = 200,
  size = 40,
}: {
  name: string;
  hue?: number;
  size?: number;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.replace(/[^A-Za-z]/g, '')[0])
    .filter(Boolean)
    .join('')
    .toUpperCase();
  const bg = `hsl(${hue} 55% 32%)`;
  const ring = `hsl(${hue} 70% 50% / 0.5)`;
  return (
    <span
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 25%, hsl(${hue} 70% 55%) 0%, ${bg} 65%)`,
        boxShadow: `0 0 0 2px ${ring}`,
      }}
      className="inline-flex items-center justify-center rounded-full font-semibold text-chalk"
    >
      <span style={{ fontSize: size * 0.38 }}>{initials || '?'}</span>
    </span>
  );
}
