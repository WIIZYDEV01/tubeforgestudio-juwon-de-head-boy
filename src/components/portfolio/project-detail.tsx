"use client";

import Link from "next/link";
import { useState } from "react";
import { Poster } from "@/components/portfolio/poster";
import { PreviewModal } from "@/components/portfolio/preview-modal";
import { Badge, Section, Skeleton } from "@/components/ui/misc";
import { buttonClass } from "@/components/ui/button";
import { useContent } from "@/hooks/content-provider";
import { useFavorites } from "@/hooks/use-favorites";
import { useMediaUrl } from "@/hooks/use-media-url";

export function Featured() {
  const { ready, publishedProjects } = useContent();
  const project = publishedProjects.find((item) => item.featured) ?? publishedProjects[0];
  const mediaUrl = useMediaUrl(project?.mediaId);
  const [open, setOpen] = useState(false);
  if (!ready) {
    return (
      <Section>
        <Skeleton className="aspect-[16/8]" />
      </Section>
    );
  }
  if (!project) return null;
  return (
    <Section>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Featured</p>
      <div className="mt-6 grid items-center gap-8 lg:grid-cols-2">
        <Poster motif={project.motif} title={project.title} kicker={project.category} badge={project.kind === "concept" ? "Concept" : "Client work"} mediaUrl={mediaUrl} />
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{project.category}</Badge>
            <Badge tone="accent">{project.kind === "concept" ? "Concept project" : "Commissioned"}</Badge>
          </div>
          <h2 className="mt-4 font-display text-5xl uppercase leading-[0.9] sm:text-6xl">{project.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{project.description}</p>
          <p className="mt-4 text-sm text-ink">{project.services.join(" · ")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className={buttonClass()} onClick={() => setOpen(true)}>
              Preview
            </button>
            <Link href={`/portfolio/${project.slug}`} className={buttonClass("secondary")}>
              Project details
            </Link>
          </div>
        </div>
      </div>
      <PreviewModal project={open ? project : null} onClose={() => setOpen(false)} />
    </Section>
  );
}

export function ProjectDetail({ slug }: { slug: string }) {
  const { ready, publishedProjects, publishedCaseStudies } = useContent();
  const project = publishedProjects.find((item) => item.slug === slug);
  const mediaUrl = useMediaUrl(project?.mediaId);
  const { has, toggle } = useFavorites();
  const [open, setOpen] = useState(false);
  const related = publishedProjects.filter((item) => item.category === project?.category && item.id !== project?.id).slice(0, 3);
  const studies = publishedCaseStudies.filter((item) => item.projectSlug === slug);

  if (!ready) return <Section><Skeleton className="aspect-video" /></Section>;
  if (!project) {
    return (
      <Section>
        <h1 className="font-display text-5xl uppercase">Project not in the catalog</h1>
        <p className="mt-4 max-w-xl text-muted">It may be unpublished, renamed, or stored only in another browser.</p>
        <Link href="/portfolio" className={buttonClass("primary", "md", "mt-6")}>
          Back to portfolio
        </Link>
      </Section>
    );
  }

  return (
    <article>
      <Section>
        <Poster motif={project.motif} title={project.title} kicker={project.category} badge={project.kind === "concept" ? "Concept" : "Client work"} mediaUrl={mediaUrl} />
        <div className="mt-8 flex flex-wrap gap-2">
          <Badge>{project.format}</Badge>
          {project.duration ? <Badge>{project.duration}</Badge> : null}
          <Badge>{project.year}</Badge>
          <Badge tone="accent">{project.kind === "concept" ? "Concept project" : "Commissioned"}</Badge>
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[0.9] sm:text-7xl">{project.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" className={buttonClass()} onClick={() => setOpen(true)}>
            Preview
          </button>
          <button type="button" className={buttonClass("secondary")} aria-pressed={has(project.id)} onClick={() => toggle(project.id)}>
            {has(project.id) ? "Saved" : "Save"}
          </button>
        </div>
      </Section>
      <Section tone="raised">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-3xl uppercase">About this piece</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted">{project.description}</p>
            {project.kind === "concept" ? (
              <p className="mt-4 border border-line bg-card p-4 text-sm text-ink">
                Concept project. No client is attached, and no performance result is claimed.
              </p>
            ) : (
              <p className="mt-4 text-sm text-ink">Client: {project.clientLabel || "Named in the studio desk."}</p>
            )}
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="label">Services delivered</dt>
              <dd>{project.services.join(", ") || "Not listed"}</dd>
            </div>
            <div>
              <dt className="label">Format</dt>
              <dd>{project.format}</dd>
            </div>
            <div>
              <dt className="label">Duration</dt>
              <dd>{project.duration || "Not set"}</dd>
            </div>
          </dl>
        </div>
        {studies.length > 0 ? (
          <div className="mt-12">
            <h2 className="font-display text-3xl uppercase">Case studies</h2>
            <ul className="mt-4 space-y-2">
              {studies.map((study) => (
                <li key={study.id}>
                  <Link className="text-accent" href={`/case-studies/${study.slug}`}>
                    {study.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>
      {related.length > 0 ? (
        <Section>
          <h2 className="font-display text-4xl uppercase">Related</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/portfolio/${item.slug}`} className="border border-line">
                <Poster motif={item.motif} title={item.title} badge={item.kind === "concept" ? "Concept" : "Client"} />
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
      <PreviewModal project={open ? project : null} onClose={() => setOpen(false)} />
    </article>
  );
}
