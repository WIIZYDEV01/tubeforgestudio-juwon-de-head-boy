"use client";

import { useState } from "react";
import { CompareSlider } from "@/components/compare/compare-slider";
import { Reveal } from "@/components/animations/reveal";
import { EmptyState, Section, SectionHeading, Skeleton } from "@/components/ui/misc";
import { useContent } from "@/hooks/content-provider";
import { cn } from "@/lib/utils";

export function CompareSection() {
  const { ready, publishedComparisons } = useContent();
  const [active, setActive] = useState(0);
  const current = publishedComparisons[active] ?? publishedComparisons[0];

  return (
    <Section id="compare">
      <SectionHeading
        eyebrow="Thumbnail studies"
        title="Before the frame, and after it."
        body="These comparisons are concept demonstrations of thumbnail redesign. They are not measured client tests."
      />
      {!ready ? (
        <Skeleton className="aspect-video" />
      ) : !current ? (
        <EmptyState title="No studies published." body="Add a before-and-after study in the studio desk to show it here." />
      ) : (
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="flex flex-wrap gap-2">
                {publishedComparisons.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === current.id}
                    className={cn("border px-3 py-2 text-sm", item.id === current.id ? "border-accent text-accent" : "border-line text-muted")}
                    onClick={() => setActive(index)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <h3 className="mt-6 font-display text-4xl uppercase leading-none">{current.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{current.explanation}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Drag the handle, or use the arrow keys.</p>
            </div>
            <CompareSlider
              title={current.title}
              beforeMotif={current.beforeMotif}
              afterMotif={current.afterMotif}
              beforeMediaId={current.beforeMediaId}
              afterMediaId={current.afterMediaId}
            />
          </div>
        </Reveal>
      )}
    </Section>
  );
}
