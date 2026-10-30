"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Poster } from "@/components/portfolio/poster";
import { Badge } from "@/components/ui/misc";
import { buttonClass } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { useMediaUrl } from "@/hooks/use-media-url";
import type { PortfolioProject } from "@/types/content";

export function ProjectCard({
  project,
  onPreview,
}: {
  project: PortfolioProject;
  onPreview: (project: PortfolioProject) => void;
}) {
  const mediaUrl = useMediaUrl(project.mediaId);
  const { has, toggle } = useFavorites();
  const saved = has(project.id);

  return (
    <article className="group flex h-full flex-col border border-line bg-card transition-colors duration-300 hover:border-accent/70">
      <button type="button" className="block w-full text-left" onClick={() => onPreview(project)} aria-label={`Preview ${project.title}`}>
        <div className="overflow-hidden">
          <Poster
            motif={project.motif}
            title={project.title}
            kicker={project.category}
            badge={project.kind === "concept" ? "Concept" : "Client work"}
            mediaUrl={mediaUrl}
            className="transition-transform duration-700 motion-safe:group-hover:scale-[1.03]"
          />
        </div>
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{project.category}</Badge>
          <Badge tone={project.kind === "concept" ? "accent" : "warn"}>{project.kind === "concept" ? "Concept project" : "Commissioned"}</Badge>
        </div>
        <h3 className="mt-3 font-display text-2xl uppercase leading-none tracking-tight">{project.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</p>
        <dl className="mt-4 space-y-1 text-xs text-muted">
          <div className="flex justify-between gap-3">
            <dt>Format</dt>
            <dd className="text-right text-ink">{project.format}</dd>
          </div>
          {project.duration ? (
            <div className="flex justify-between gap-3">
              <dt>Duration</dt>
              <dd className="text-ink">{project.duration}</dd>
            </div>
          ) : null}
          <div>
            <dt className="sr-only">Services</dt>
            <dd className="line-clamp-2">{project.services.join(" · ")}</dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <button type="button" className={buttonClass("secondary", "sm")} onClick={() => onPreview(project)}>
            Preview
          </button>
          <Link href={`/portfolio/${project.slug}`} className={buttonClass("primary", "sm")}>
            Details
          </Link>
          <button
            type="button"
            className={buttonClass("ghost", "sm", "border border-line")}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${project.title} from favorites` : `Save ${project.title} to favorites`}
            onClick={() => toggle(project.id)}
          >
            <Heart size={14} className={saved ? "fill-accent text-accent" : ""} />
          </button>
        </div>
      </div>
    </article>
  );
}
