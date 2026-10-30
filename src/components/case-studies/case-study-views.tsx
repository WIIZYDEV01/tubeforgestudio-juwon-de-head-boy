"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Poster } from "@/components/portfolio/poster";
import { Dialog } from "@/components/ui/dialog";
import { Badge, EmptyState, SearchField, Section, SectionHeading, Skeleton } from "@/components/ui/misc";
import { buttonClass } from "@/components/ui/button";
import { useContent } from "@/hooks/content-provider";
import type { CaseStudy } from "@/types/content";

function GalleryLightbox({
  study,
  index,
  onClose,
  setIndex,
}: {
  study: CaseStudy | null;
  index: number | null;
  onClose: () => void;
  setIndex: (index: number) => void;
}) {
  const motifs = study?.galleryMotifs ?? [];
  const motif = index != null ? motifs[index] : null;
  return (
    <Dialog open={index != null && Boolean(motif)} title={study?.title ?? "Frame"} onClose={onClose} className="max-w-5xl">
      {study && motif ? (
        <div>
          <Poster motif={motif} title={study.title} kicker={study.industry} badge={study.kind === "concept" ? "Concept" : "Client"} />
          <div className="mt-4 flex gap-2">
            <button type="button" className="grid size-11 place-items-center border border-line" aria-label="Previous frame" onClick={() => setIndex((index! - 1 + motifs.length) % motifs.length)}>
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="grid size-11 place-items-center border border-line" aria-label="Next frame" onClick={() => setIndex((index! + 1) % motifs.length)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}

export function CaseStudyList() {
  const { ready, publishedCaseStudies } = useContent();
  const [query, setQuery] = useState("");
  const studies = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return publishedCaseStudies;
    return publishedCaseStudies.filter((study) => `${study.title} ${study.industry} ${study.brief}`.toLowerCase().includes(needle));
  }, [publishedCaseStudies, query]);
  return (
    <Section film="harbor">
      <SectionHeading
        eyebrow="Case studies"
        title="The work, unpacked."
        body="These studies explain a brief, a constraint, and a production path. Concept studies do not invent results."
      />
      <div className="mb-6 max-w-md">
        <SearchField label="Search case studies" value={query} onChange={setQuery} onClear={() => setQuery("")} placeholder="Search studies" />
      </div>
      {!ready ? <Skeleton className="h-64" /> : null}
      {ready && publishedCaseStudies.length === 0 ? <EmptyState title="No case studies published." body="Add one in the studio desk." /> : null}
      {ready && publishedCaseStudies.length > 0 && studies.length === 0 ? <EmptyState title="No matching study." body="Try another word, or clear the search." /> : null}
      <div className="space-y-6">
        {studies.map((study) => (
          <article key={study.id} className="grid gap-4 border border-line bg-card lg:grid-cols-[1.1fr_0.9fr]">
            <Poster motif={study.galleryMotifs[0] ?? "forge"} title={study.title} kicker={study.industry} badge={study.kind === "concept" ? "Concept" : "Client"} />
            <div className="p-5">
              <Badge tone="accent">{study.kind === "concept" ? "Concept case study" : "Commissioned"}</Badge>
              <h2 className="mt-4 font-display text-4xl uppercase leading-none">{study.title}</h2>
              <p className="mt-2 text-sm text-muted">{study.industry}</p>
              <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted">{study.brief}</p>
              <Link href={`/case-studies/${study.slug}`} className={buttonClass("primary", "sm", "mt-5")}>
                Read the study
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function CasePreview() {
  const { ready, publishedCaseStudies } = useContent();
  return (
    <Section film="atlas">
      <SectionHeading
        eyebrow="Case studies"
        title="How a piece is thought through."
        action={
          <Link href="/case-studies" className={buttonClass("secondary")}>
            All studies
          </Link>
        }
      />
      {!ready ? <Skeleton className="h-48" /> : null}
      <div className="grid gap-4 lg:grid-cols-3">
        {publishedCaseStudies.slice(0, 3).map((study) => (
          <Link key={study.id} href={`/case-studies/${study.slug}`} className="border border-line bg-card">
            <Poster motif={study.galleryMotifs[0] ?? "forge"} title={study.title} badge="Concept" />
            <div className="p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{study.industry}</p>
              <h3 className="mt-2 font-display text-2xl uppercase">{study.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function CaseStudyDetail({ slug }: { slug: string }) {
  const { ready, publishedCaseStudies, publishedProjects } = useContent();
  const study = publishedCaseStudies.find((item) => item.slug === slug);
  const [frame, setFrame] = useState<number | null>(null);
  const linked = publishedProjects.find((item) => item.slug === study?.projectSlug);
  const related = publishedProjects.filter((item) => study?.relatedSlugs.includes(item.slug));

  if (!ready) return <Section film="harbor"><Skeleton className="h-80" /></Section>;
  if (!study) {
    return (
      <Section film="harbor">
        <h1 className="font-display text-5xl uppercase">Study not found</h1>
        <Link href="/case-studies" className={buttonClass("primary", "md", "mt-6")}>
          All studies
        </Link>
      </Section>
    );
  }

  return (
    <article>
      <Section film="harbor">
        <Badge tone="accent">{study.kind === "concept" ? "Concept case study" : "Commissioned"}</Badge>
        <h1 className="mt-4 max-w-4xl font-display text-5xl uppercase leading-[0.9] sm:text-7xl">{study.title}</h1>
        <p className="mt-4 text-muted">{study.industry}</p>
      </Section>
      <Section tone="raised" film="salt">
        <div className="grid gap-8">
          {[
            ["Brief", study.brief],
            ["Challenge", study.challenge],
            ["Strategy", study.strategy],
          ].map(([label, text]) => (
            <section key={label}>
              <h2 className="font-display text-3xl uppercase">{label}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{text}</p>
            </section>
          ))}
          <section>
            <h2 className="font-display text-3xl uppercase">Production process</h2>
            <ol className="mt-4 space-y-3">
              {study.process.map((step, index) => (
                <li key={step} className="grid grid-cols-[3rem_1fr] gap-3 border-t border-line pt-3 text-sm">
                  <span className="font-mono text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="font-display text-3xl uppercase">Deliverables</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {study.deliverables.map((item) => (
                <li key={item} className="border border-line px-3 py-3 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-3xl uppercase">Results</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{study.resultsNote}</p>
          </section>
          <section>
            <h2 className="font-display text-3xl uppercase">Visual evidence</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {study.galleryMotifs.map((motif, index) => (
                <button key={`${motif}-${index}`} type="button" className="text-left" onClick={() => setFrame(index)} aria-label={`Open frame ${index + 1}`}>
                  <Poster motif={motif} title={study.title} badge={study.kind === "concept" ? "Concept" : "Client"} />
                </button>
              ))}
            </div>
          </section>
          {linked ? (
            <p>
              Portfolio piece:{" "}
              <Link className="text-accent" href={`/portfolio/${linked.slug}`}>
                {linked.title}
              </Link>
            </p>
          ) : null}
          {related.length > 0 ? (
            <section>
              <h2 className="font-display text-3xl uppercase">Related projects</h2>
              <ul className="mt-3 space-y-2">
                {related.map((project) => (
                  <li key={project.id}>
                    <Link href={`/portfolio/${project.slug}`}>{project.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </Section>
      <GalleryLightbox study={study} index={frame} onClose={() => setFrame(null)} setIndex={setFrame} />
    </article>
  );
}
