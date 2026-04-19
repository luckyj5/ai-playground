import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50/60 dark:border-ink-700 dark:bg-ink-900/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg text-ink-900 dark:text-ink-50">
          ScentSense<span className="text-accent-deep dark:text-accent">.ai</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500 dark:text-ink-300">
          <Link href="/recommend" className="hover:text-ink-900 dark:hover:text-accent">
            Get your scent
          </Link>
          <Link href="/privacy" className="hover:text-ink-900 dark:hover:text-accent">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink-900 dark:hover:text-accent">
            Terms
          </Link>
          <a
            href="mailto:hello@scentsense.ai"
            className="hover:text-ink-900 dark:hover:text-accent"
          >
            hello@scentsense.ai
          </a>
          <span>© {new Date().getFullYear()} ScentSense AI</span>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-6 pb-6 text-xs text-ink-400 dark:text-ink-500">
        Affiliate disclosure: some links may earn us a small commission at no
        cost to you. It keeps the concierge running.
      </p>
    </footer>
  );
}
