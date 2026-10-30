"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge, EmptyState, Section, SectionHeading, Skeleton } from "@/components/ui/misc";
import { useContent } from "@/hooks/content-provider";
import { useMediaUrl } from "@/hooks/use-media-url";
import type { Testimonial } from "@/types/content";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-1" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={16} className={index < value ? "fill-accent text-accent" : "text-line"} />
      ))}
    </div>
  );
}

function Portrait({ item }: { item: Testimonial }) {
  const url = useMediaUrl(item.mediaId);
  if (url) return <img src={url} alt="" className="size-12 object-cover" />;
  return (
    <span className="grid size-12 place-items-center border border-line font-display text-lg" aria-hidden="true">
      {item.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function Testimonials() {
  const { ready, publishedTestimonials } = useContent();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = publishedTestimonials[index];

  useEffect(() => {
    if (index >= publishedTestimonials.length) setIndex(0);
  }, [index, publishedTestimonials.length]);

  useEffect(() => {
    if (reduce || paused || publishedTestimonials.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % publishedTestimonials.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [reduce, paused, publishedTestimonials.length]);

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Notes"
        title="Reviews, when they are real."
        body="Placeholder slides keep the carousel honest. They are not customer reviews. Publish a note only when you have permission to show it, and turn the placeholder flag off."
      />
      {!ready ? <Skeleton className="h-64" /> : null}
      {ready && !item ? <EmptyState title="No notes yet." body="Add a testimonial in the studio desk. Leave the placeholder flag on until it is a real review." /> : null}
      {item ? (
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <figure className="border border-line bg-card p-6 sm:p-10">
            {item.placeholder ? <Badge tone="warn">Placeholder — not a customer review</Badge> : <Stars value={item.rating} />}
            <blockquote className="mt-6 font-display text-3xl uppercase leading-[0.95] sm:text-5xl">“{item.quote}”</blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <Portrait item={item} />
              <div>
                <p className="text-sm">{item.name}</p>
                <p className="text-xs text-muted">{item.projectType}</p>
              </div>
            </figcaption>
          </figure>
          <div className="mt-4 flex items-center gap-2">
            <button type="button" className="grid size-11 place-items-center border border-line" aria-label="Previous note" onClick={() => setIndex((current) => (current - 1 + publishedTestimonials.length) % publishedTestimonials.length)}>
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="grid size-11 place-items-center border border-line" aria-label="Next note" onClick={() => setIndex((current) => (current + 1) % publishedTestimonials.length)}>
              <ChevronRight size={16} />
            </button>
            <div className="ml-2 flex gap-2">
              {publishedTestimonials.map((entry, entryIndex) => (
                <button
                  key={entry.id}
                  type="button"
                  aria-label={`Show note ${entryIndex + 1}`}
                  aria-current={entryIndex === index ? "true" : undefined}
                  className={`h-2 w-6 ${entryIndex === index ? "bg-accent" : "bg-line"}`}
                  onClick={() => setIndex(entryIndex)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
