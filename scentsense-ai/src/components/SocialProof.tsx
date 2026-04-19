const quotes = [
  {
    q: "I stopped buying blind. ScentSense called my winter date scent first try.",
    a: "— Early access user",
  },
  {
    q: "Finally, perfume advice that actually reads the room.",
    a: "— Perfume Twitter",
  },
  {
    q: "Like having a stylist who only works on scent.",
    a: "— Beta tester",
  },
];

const logos = ["DIOR", "CHANEL", "TOM FORD", "CREED", "HERMÈS", "YSL"];

export default function SocialProof() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="card-muted">
        <div className="grid gap-8 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.q} className="flex flex-col gap-4">
              <blockquote className="font-display text-xl leading-snug text-ink-900 dark:text-ink-50">
                &ldquo;{q.q}&rdquo;
              </blockquote>
              <figcaption className="text-sm text-ink-500 dark:text-ink-300">
                {q.a}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 border-t border-ink-100 pt-8 dark:border-ink-700">
          <p className="eyebrow">Curated from houses including</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm tracking-[0.22em] text-ink-500 dark:text-ink-300">
            {logos.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
