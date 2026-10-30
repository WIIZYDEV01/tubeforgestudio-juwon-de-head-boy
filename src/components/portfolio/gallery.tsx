"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/portfolio/project-card";
import { PreviewModal } from "@/components/portfolio/preview-modal";
import { EmptyState, SearchField, SectionHeading, Skeleton } from "@/components/ui/misc";
import { buttonClass } from "@/components/ui/button";
import { CATEGORIES } from "@/data/options";
import { useContent } from "@/hooks/content-provider";
import { useFavorites } from "@/hooks/use-favorites";
import type { PortfolioProject } from "@/types/content";
import { cn } from "@/lib/utils";

export function Gallery({
  limit,
  heading = true,
  favoritesOnlyDefault = false,
}: {
  limit?: number;
  heading?: boolean;
  favoritesOnlyDefault?: boolean;
}) {
  const { ready, publishedProjects } = useContent();
  const { has } = useFavorites();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(favoritesOnlyDefault);
  const [sort, setSort] = useState<"featured" | "title" | "year">("featured");
  const [preview, setPreview] = useState<PortfolioProject | null>(null);

  const categories = useMemo(() => {
    const present = new Set(publishedProjects.map((project) => project.category));
    return ["All", ...CATEGORIES.filter((item) => present.has(item)), ...[...present].filter((item) => !CATEGORIES.includes(item as (typeof CATEGORIES)[number]))];
  }, [publishedProjects]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = publishedProjects.filter((project) => {
      if (category !== "All" && project.category !== category) return false;
      if (favoritesOnly && !has(project.id)) return false;
      if (!needle) return true;
      const haystack = [project.title, project.summary, project.description, project.category, project.format, project.services.join(" "), project.duration]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
    const sorted = [...matched];
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "year") sorted.sort((a, b) => String(b.year).localeCompare(String(a.year)));
    if (sort === "featured") sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [publishedProjects, category, query, favoritesOnly, has, sort]);

  const visible = typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      {heading ? (
        <SectionHeading
          eyebrow="Portfolio"
          title="Work with the seams showing."
          body="This is the catalog a buyer opens. Seeded pieces are concept drawings, not photos or video files. Commissioned work appears here after you add it in the studio desk and mark it as client work."
          action={
            limit ? (
              <Link href="/portfolio" className={buttonClass("secondary")}>
                Full catalog
              </Link>
            ) : null
          }
        />
      ) : null}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full lg:max-w-md">
          <SearchField label="Search projects" value={query} onChange={setQuery} onClear={() => setQuery("")} placeholder="Search titles, niches, services" />
        </div>
        <div className="w-full lg:w-48 lg:shrink-0">
          <label className="search-field">
            <span className="sr-only">Sort projects</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as "featured" | "title" | "year")}>
              <option value="featured">Featured first</option>
              <option value="title">Title</option>
              <option value="year">Year</option>
            </select>
          </label>
        </div>
        <button type="button" className={cn("min-h-12 border px-3 text-sm", favoritesOnly ? "border-accent text-accent" : "border-line")} aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly((value) => !value)}>
          Favorites only
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted lg:ml-auto">{visible.length} showing</p>
      </div>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1" role="toolbar" aria-label="Filter by category">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            className={cn("shrink-0 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em]", category === item ? "border-accent bg-accent text-accent-ink" : "border-line text-muted")}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: limit ?? 6 }, (_, index) => (
            <Skeleton key={index} className="aspect-[4/5]" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="Nothing in this cut."
          body="No published project matches the current search or filter. Clear them, or add a project in the studio desk."
          action={
            <button
              type="button"
              className={buttonClass("secondary")}
              onClick={() => {
                setQuery("");
                setCategory("All");
                setFavoritesOnly(false);
              }}
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} onPreview={setPreview} />
          ))}
        </div>
      )}
      <PreviewModal project={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
