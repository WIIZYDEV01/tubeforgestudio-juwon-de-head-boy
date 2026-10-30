"use client";

import Link from "next/link";
import { SectionFilm } from "@/components/animations/section-film";
import { buttonClass } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="relative min-h-screen">
      <SectionFilm name="ledger" fixed />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Something broke</p>
      <h1 className="mt-3 font-display text-5xl uppercase">The page could not finish loading.</h1>
      <p className="mt-4 text-muted">Try again. If storage is blocked, the sample catalog can still be browsed after a reload.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className={buttonClass()} onClick={reset}>
          Try again
        </button>
        <Link href="/" className={buttonClass("secondary")}>
          Home
        </Link>
      </div>
      </div>
    </div>
  );
}
