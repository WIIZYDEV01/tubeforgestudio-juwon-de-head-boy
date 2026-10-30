import Link from "next/link";
import { SectionFilm } from "@/components/animations/section-film";
import { Wordmark } from "@/components/layout/wordmark";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen">
      <SectionFilm name="empty" fixed />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-20">
      <Wordmark />
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">404</p>
      <h1 className="mt-3 font-display text-6xl uppercase leading-[0.9] sm:text-7xl">This frame is empty.</h1>
      <p className="mt-4 max-w-md text-muted">The page is not part of the studio site. The catalog and the desk are still where you left them.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonClass()}>
          Home
        </Link>
        <Link href="/portfolio" className={buttonClass("secondary")}>
          Portfolio
        </Link>
      </div>
      </div>
    </div>
  );
}
