"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Poster } from "@/components/portfolio/poster";
import { buttonClass } from "@/components/ui/button";
import { useContent } from "@/hooks/content-provider";
import { useMediaUrl } from "@/hooks/use-media-url";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function Marquee() {
  const { ready, publishedServices } = useContent();
  const reduce = useReducedMotion();
  const items = publishedServices.map((service) => service.title);
  if (!ready) return <div className="h-14 border-y border-line" />;
  if (items.length === 0) return null;
  if (reduce) {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-line px-5 py-4">
        {items.map((item) => (
          <span key={item} className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {item}
          </span>
        ))}
      </div>
    );
  }
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line">
      <div className="animate-marquee flex w-max gap-10 py-4">
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {item}
            <span className="ml-10 text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Reel() {
  const { publishedProjects } = useContent();
  const reduce = useReducedMotion();
  const frames = useMemo(() => publishedProjects.slice(0, 5), [publishedProjects]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = frames[index] ?? frames[0];
  const mediaUrl = useMediaUrl(frame?.mediaId);

  useEffect(() => {
    if (!playing || reduce || frames.length < 2) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % frames.length), 3400);
    return () => window.clearInterval(id);
  }, [playing, reduce, frames.length]);

  if (!frame) return <div className="aspect-video border border-line bg-card" />;

  return (
    <div className="border border-line bg-black">
      <div className={cn("overflow-hidden", playing && "[&_svg]:motion-safe:animate-ken [&_img]:motion-safe:animate-ken")}>
        <Poster motif={frame.motif} title={frame.title} kicker={frame.category} badge="Concept" mediaUrl={mediaUrl} />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-studio px-3 py-2">
        <p className="mr-auto font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          Concept frames {String(index + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
        </p>
        <button type="button" className="grid size-10 place-items-center border border-line" aria-label="Previous frame" onClick={() => setIndex((current) => (current - 1 + frames.length) % frames.length)}>
          <SkipBack size={14} />
        </button>
        {reduce ? null : (
          <button type="button" className="grid size-10 place-items-center border border-line" aria-pressed={playing} aria-label={playing ? "Pause frames" : "Play frames"} onClick={() => setPlaying((value) => !value)}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
        )}
        <button type="button" className="grid size-10 place-items-center border border-line" aria-label="Next frame" onClick={() => setIndex((current) => (current + 1) % frames.length)}>
          <SkipForward size={14} />
        </button>
        <label className="sr-only" htmlFor="reel-scrub">
          Choose a concept frame
        </label>
        <input
          id="reel-scrub"
          className="h-1 w-24 accent-accent"
          type="range"
          min={0}
          max={Math.max(frames.length - 1, 0)}
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
        />
      </div>
    </div>
  );
}

export function Hero() {
  const { settings } = useContent();
  const reduce = useReducedMotion();
  const visual = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const { publishedProjects } = useContent();
  const floats = publishedProjects.slice(1, 4);
  const headline = settings.heroHeadline || site.headline;
  const stacked = headline.trim().toUpperCase() === site.headline;

  return (
    <section className="relative overflow-hidden">
      <div className="studio-grid animate-drift pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[1440px] items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">YouTube automation studio</p>
          {stacked ? (
            <h1 className="mt-5 font-display text-[clamp(2.7rem,7vw,6.4rem)] uppercase leading-[0.86] tracking-tight">
              <span className="block">We build</span>
              <span className="block">YouTube channels</span>
              <span className="block">that keep people</span>
              <span className="block text-accent">watching.</span>
            </h1>
          ) : (
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,6vw,5.5rem)] uppercase leading-[0.88] tracking-tight">{headline}</h1>
          )}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{settings.heroDescription || site.lede}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/portfolio" className={buttonClass("primary", "md", "w-full sm:w-auto")}>
              Explore Our Work
            </Link>
            <Link href="/contact" className={buttonClass("secondary", "md", "w-full sm:w-auto")}>
              Start a Project
            </Link>
          </div>
          <p className="mt-6 max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
            The reel is a set of concept frames. Sample projects on this site are marked concept until real work is added.
          </p>
        </div>
        <div
          ref={visual}
          className="relative"
          onMouseMove={(event) => {
            if (reduce) return;
            const rect = visual.current?.getBoundingClientRect();
            if (!rect) return;
            setShift({
              x: (event.clientX - rect.left) / rect.width - 0.5,
              y: (event.clientY - rect.top) / rect.height - 0.5,
            });
          }}
          onMouseLeave={() => setShift({ x: 0, y: 0 })}
        >
          <div className="lg:ml-[14%]" style={reduce ? undefined : { transform: `translate3d(${shift.x * 10}px, ${shift.y * 8}px, 0)` }}>
            <Reel />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 lg:mt-0">
            {floats.map((project, index) => (
              <div
                key={project.id}
                className={cn(
                  "border border-line shadow-[0_18px_40px_rgba(0,0,0,0.35)]",
                  index === 0 && "lg:absolute lg:left-0 lg:top-8 lg:w-[34%]",
                  index === 1 && "lg:absolute lg:bottom-16 lg:left-[4%] lg:w-[30%]",
                  index === 2 && "lg:absolute lg:right-0 lg:top-0 lg:w-[26%]",
                  !reduce && "animate-float",
                )}
                style={{ animationDelay: `${index * 0.8}s` }}
              >
                <Poster motif={project.motif} title={project.title} badge="Concept" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Marquee />
    </section>
  );
}
