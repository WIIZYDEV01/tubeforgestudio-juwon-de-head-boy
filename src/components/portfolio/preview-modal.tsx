"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Poster } from "@/components/portfolio/poster";
import { Dialog } from "@/components/ui/dialog";
import { buttonClass } from "@/components/ui/button";
import { Badge } from "@/components/ui/misc";
import { useFavorites } from "@/hooks/use-favorites";
import { useMediaUrl } from "@/hooks/use-media-url";
import type { PortfolioProject } from "@/types/content";

export function PreviewModal({ project, onClose }: { project: PortfolioProject | null; onClose: () => void }) {
  const imageUrl = useMediaUrl(project?.mediaId);
  const videoUrl = useMediaUrl(project?.videoId);
  const { has, toggle } = useFavorites();
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => setPlaying(false), [project?.id]);

  return (
    <Dialog open={Boolean(project)} title={project?.title ?? "Preview"} description={project?.summary} onClose={onClose} className="max-w-4xl">
      {project ? (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge>{project.category}</Badge>
            <Badge tone="accent">{project.kind === "concept" ? "Concept project" : "Commissioned"}</Badge>
            {project.duration ? <Badge>{project.duration}</Badge> : null}
          </div>
          {videoUrl ? (
            <video key={videoUrl} className="aspect-video w-full bg-black" controls src={videoUrl} poster={imageUrl ?? undefined}>
              Your browser cannot play this video.
            </video>
          ) : (
            <div>
              <div className={playing && !reduce ? "[&_svg]:animate-ken [&_img]:animate-ken" : undefined}>
                <Poster motif={project.motif} title={project.title} kicker={project.format} badge={project.kind === "concept" ? "Concept" : "Client"} mediaUrl={imageUrl} />
              </div>
              <p className="mt-3 text-sm text-muted">
                {reduce
                  ? "No video file is attached. Motion preview is off because this device asks for reduced motion."
                  : "No video file is attached. Play runs a camera move across the poster. Upload a video in the studio desk to replace it."}
              </p>
              {reduce ? null : (
                <button type="button" className={buttonClass("secondary", "sm", "mt-3")} aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                  {playing ? "Pause preview" : "Play preview"}
                </button>
              )}
            </div>
          )}
          <p className="mt-4 text-sm leading-relaxed text-muted">{project.description}</p>
          <p className="mt-3 text-sm text-ink">Services: {project.services.join(", ") || "Not listed"}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={`/portfolio/${project.slug}`} className={buttonClass()} onClick={onClose}>
              Project details
            </Link>
            <button type="button" className={buttonClass("secondary")} aria-pressed={has(project.id)} onClick={() => toggle(project.id)}>
              {has(project.id) ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
