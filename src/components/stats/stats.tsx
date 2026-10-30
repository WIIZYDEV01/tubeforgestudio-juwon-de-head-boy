"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Section, SectionHeading, Badge } from "@/components/ui/misc";
import { useContent } from "@/hooks/content-provider";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setDisplay(Math.round(value * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value, reduce]);

  return <span ref={ref}>{display.toLocaleString("en-US")}</span>;
}

export function Stats() {
  const { ready, statistics } = useContent();
  const ordered = [...statistics].sort((a, b) => a.order - b.order);

  return (
    <Section id="stats" tone="raised">
      <SectionHeading
        eyebrow="Studio statistics"
        title="Numbers, only when they are real."
        body="The figures below start as labelled samples so the layout can be reviewed. They are not a record of completed client work. Edit them in the studio desk, and clear the sample flag only when a number is true."
      />
      {!ready ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-40 bg-line/70" />)}</div> : null}
      {ready && ordered.length === 0 ? <p className="text-muted">No statistics have been entered.</p> : null}
      {ready ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ordered.map((stat) => (
            <article key={stat.id} className="border border-line bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{stat.label}</p>
                {stat.sample ? <Badge tone="warn">Sample</Badge> : <Badge tone="accent">Verified</Badge>}
              </div>
              <p className="mt-6 font-display text-6xl leading-none tracking-tight">
                <Counter value={stat.value} />
                {stat.suffix}
              </p>
              {stat.note ? <p className="mt-4 text-xs leading-relaxed text-muted">{stat.note}</p> : null}
            </article>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
