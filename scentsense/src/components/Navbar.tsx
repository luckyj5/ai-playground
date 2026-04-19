"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/60 bg-ink-50/70 backdrop-blur dark:border-ink-700/60 dark:bg-ink-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-ink-50 text-sm dark:bg-accent dark:text-ink-900">
            ✦
          </span>
          <span className="tracking-tight">
            ScentSense<span className="text-accent-deep dark:text-accent">.ai</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/#how-it-works" className="btn-ghost hidden sm:inline-flex">
            How it works
          </Link>
          <Link href="/#examples" className="btn-ghost hidden sm:inline-flex">
            Examples
          </Link>
          <ThemeToggle />
          <Link href="/recommend" className="btn-primary">
            Get your scent
          </Link>
        </nav>
      </div>
    </header>
  );
}
