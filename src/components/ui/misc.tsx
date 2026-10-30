import { SectionFilm, type FilmName } from "@/components/animations/section-film";
import { cn } from "@/lib/utils";

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] left-1/2 z-30 hidden -translate-x-1/2 whitespace-nowrap border border-line bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink group-focus-within:block group-hover:block"
      >
        {label}
      </span>
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("bg-line/80 motion-safe:animate-pulse", className)} />;
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-line bg-studio-2 px-6 py-16 text-center">
      <h3 className="font-display text-3xl uppercase tracking-tight">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">{body}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Wrap({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12", className)}>{children}</div>;
}

export function Section({
  id,
  tone = "studio",
  film,
  className,
  children,
}: {
  id?: string;
  tone?: "studio" | "raised";
  film: FilmName;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative isolate overflow-hidden py-20 sm:py-24 lg:py-28", tone === "raised" && "bg-studio-2", className)}>
      <SectionFilm name={film} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-studio/25 via-transparent to-studio/40" />
      <div className="relative z-10">
        <Wrap>{children}</Wrap>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-6xl">{title}</h2>
        {body ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{body}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "line" }: { children: React.ReactNode; tone?: "line" | "accent" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
        tone === "accent" && "border-accent/50 text-accent",
        tone === "warn" && "border-accent bg-accent text-accent-ink",
        tone === "line" && "border-line text-muted",
      )}
    >
      {children}
    </span>
  );
}
