"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { Section, Skeleton } from "@/components/ui/misc";

const lines = [
  "We build YouTube channels that keep people watching.",
  "It starts with the niche, the audience, and a script people can stay with.",
  "Then the edit, the thumbnail, and a title that still reads at a glance.",
  "We also keep the channel moving: the backlog, the upload, and the next film.",
  "The catalog you are browsing is concept work until your own project is added.",
];

export function StudioHost() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [photoReady, setPhotoReady] = useState(false);
  const line = lines[index] ?? lines[0];

  useEffect(() => {
    if (reduce || !playing) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % lines.length), 4200);
    return () => window.clearInterval(id);
  }, [playing, reduce]);

  return (
    <Section film="ink">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Studio host</p>
      <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(220px,320px)_minmax(0,1fr)]">
        <figure className="relative overflow-hidden border border-line bg-card">
          {photoReady ? null : <Skeleton className="absolute inset-0 z-10 aspect-[3/4]" />}
          <img
            src="/studio-host.jpg"
            alt="Studio host, a young man in a charcoal shirt, looking just off camera as he introduces the studio."
            width={960}
            height={1280}
            decoding="async"
            className="aspect-[3/4] w-full object-cover object-[center_18%] motion-safe:animate-ken"
            onLoad={() => setPhotoReady(true)}
          />
        </figure>
        <div>
          <h2 className="font-display text-4xl uppercase leading-[0.9] sm:text-6xl">What the studio does.</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Every line is written on screen. This is an introduction, not a client review and not a recorded voice.
          </p>
          <p className="mt-8 min-h-28 border-l-2 border-accent bg-card px-4 py-4 font-display text-2xl uppercase leading-tight sm:min-h-32 sm:text-4xl" aria-live="polite">
            {line}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="grid size-11 place-items-center border border-line"
              aria-pressed={playing}
              aria-label={playing ? "Pause the introduction" : "Play the introduction"}
              onClick={() => setPlaying((value) => !value)}
            >
              {playing && !reduce ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button type="button" className="min-h-11 border border-line px-3 text-sm" onClick={() => setIndex((current) => (current - 1 + lines.length) % lines.length)}>
              Previous line
            </button>
            <button type="button" className="min-h-11 border border-line px-3 text-sm" onClick={() => setIndex((current) => (current + 1) % lines.length)}>
              Next line
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {String(index + 1).padStart(2, "0")} / {String(lines.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
