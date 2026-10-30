"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { EmptyState, Section, SectionHeading, Skeleton } from "@/components/ui/misc";
import { useContent } from "@/hooks/content-provider";
import { cn } from "@/lib/utils";

export function FaqList({ embedded = false }: { embedded?: boolean }) {
  const { ready, publishedFaqs } = useContent();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const body = (
    <>
      {!embedded ? (
        <SectionHeading eyebrow="FAQ" title="Straight answers." body="Process, labelling, and what the inquiry form actually does." />
      ) : (
        <SectionHeading eyebrow="FAQ" title="Before you write." />
      )}
      {!ready ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : publishedFaqs.length === 0 ? (
        <EmptyState title="No questions published." body="Add FAQ entries in the studio desk." />
      ) : (
        <div className="border-t border-line">
          {publishedFaqs.map((faq) => {
            const expanded = open === faq.id;
            return (
              <div key={faq.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={expanded}
                    aria-controls={`faq-${faq.id}`}
                    onClick={() => setOpen(expanded ? null : faq.id)}
                  >
                    <span className="font-display text-2xl uppercase leading-none sm:text-3xl">{faq.question}</span>
                    <Plus size={18} className={cn("shrink-0 transition-transform", expanded && "rotate-45")} />
                  </button>
                </h3>
                <div
                  id={`faq-${faq.id}`}
                  aria-hidden={!expanded}
                  className={cn("grid", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]", !reduce && "transition-[grid-template-rows] duration-300")}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
  if (embedded) {
    return (
      <Section id="faq" tone="raised" film="signal">
        {body}
      </Section>
    );
  }
  return <Section film="still">{body}</Section>;
}
