import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";

const links = [
  ["Portfolio", "/portfolio"],
  ["Services", "/services"],
  ["Case studies", "/case-studies"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Favorites", "/favorites"],
  ["Studio desk", "/admin"],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-studio">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:px-12">
        <div>
          <Wordmark />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            A YouTube automation studio portfolio. Concept projects on this site are labelled as concepts. Sample figures are not client results.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="Footer">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-muted hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line px-5 py-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:px-8">
        TubeForgeStudio · Local catalog · No mail service connected
      </div>
    </footer>
  );
}
