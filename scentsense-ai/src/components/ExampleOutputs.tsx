const examples = [
  {
    tag: "Summer · Work · Fresh",
    headline: "Quietly magnetic, nine-to-five.",
    picks: [
      { name: "Bleu de Chanel EDP", reason: "Citrus lift, sandalwood spine." },
      { name: "Acqua di Giò Profumo", reason: "Sea air with a serious suit." },
    ],
  },
  {
    tag: "Winter · Date · Bold",
    headline: "Candlelight, in a bottle.",
    picks: [
      { name: "Tom Ford Tobacco Vanille", reason: "Close-range warmth." },
      { name: "YSL La Nuit de L'Homme", reason: "Spiced and soft-spoken." },
    ],
  },
  {
    tag: "Humid · Casual · Relaxed",
    headline: "Effortless, like you tried for five seconds.",
    picks: [
      {
        name: "Jo Malone Wood Sage & Sea Salt",
        reason: "Breezy, skin-close.",
      },
      { name: "Byredo Gypsy Water", reason: "Pine needles after rain." },
    ],
  },
];

export default function ExampleOutputs() {
  return (
    <section id="examples" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Example outputs</span>
          <h2 className="display mt-3 text-4xl text-ink-900 dark:text-ink-50 sm:text-5xl">
            Context in.
            <br />
            Presence out.
          </h2>
        </div>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {examples.map((ex) => (
          <article key={ex.tag} className="card-muted">
            <span className="eyebrow">{ex.tag}</span>
            <h3 className="mt-3 font-display text-2xl text-ink-900 dark:text-ink-50">
              {ex.headline}
            </h3>
            <ul className="mt-4 space-y-3">
              {ex.picks.map((p) => (
                <li
                  key={p.name}
                  className="rounded-2xl border border-ink-100 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/50"
                >
                  <p className="font-medium text-ink-900 dark:text-ink-50">
                    {p.name}
                  </p>
                  <p className="text-sm text-ink-600 dark:text-ink-200">
                    {p.reason}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
