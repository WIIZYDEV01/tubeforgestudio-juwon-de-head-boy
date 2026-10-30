"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceIcon } from "@/components/icons";
import { Reveal } from "@/components/animations/reveal";
import { buttonClass } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState, SearchField, Section, SectionHeading, Skeleton } from "@/components/ui/misc";
import { useContent } from "@/hooks/content-provider";
import type { ServiceItem } from "@/types/content";

export function ServiceBoard({ density = "compact" }: { density?: "compact" | "full" }) {
  const router = useRouter();
  const { ready, publishedServices } = useContent();
  const [active, setActive] = useState<ServiceItem | null>(null);
  const [query, setQuery] = useState("");
  const services = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return publishedServices;
    return publishedServices.filter((service) => `${service.title} ${service.description} ${service.deliverables.join(" ")}`.toLowerCase().includes(needle));
  }, [publishedServices, query]);

  useEffect(() => {
    if (density !== "full" || !ready) return;
    const id = window.location.hash.replace("#", "");
    if (!id.startsWith("service-")) return;
    const match = publishedServices.find((service) => `service-${service.slug}` === id);
    if (!match) return;
    setActive(match);
    document.getElementById(id)?.scrollIntoView({ block: "center" });
  }, [density, publishedServices, ready]);

  return (
    <Section id="services" tone={density === "full" ? "studio" : "raised"} film={density === "full" ? "orbit" : "pulse"}>
      <SectionHeading
        eyebrow="Services"
        title="Twelve ways a channel gets made."
        body="Each service can stand alone or sit inside a full automation system. Deliverables describe the work product, not a completed client job."
      />
      <div className="mb-6 max-w-md">
        <SearchField label="Search services" value={query} onChange={setQuery} onClear={() => setQuery("")} placeholder="Search services" />
      </div>
      {!ready ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-56" />
          ))}
        </div>
      ) : publishedServices.length === 0 ? (
        <EmptyState title="No services published." body="Add a service in the studio desk and mark it published to show it here." />
      ) : services.length === 0 ? (
        <EmptyState title="No matching service." body="Try another word, or clear the search." />
      ) : (
        <div className={density === "full" ? "space-y-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
          {services.map((service, index) => (
            <Reveal key={service.id} delay={Math.min(index * 0.04, 0.24)}>
              <article id={`service-${service.slug}`} className="flex h-full scroll-mt-28 flex-col border border-line bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <ServiceIcon name={service.icon} className="text-accent" />
                  <span className="font-mono text-[11px] text-muted">{String(service.order).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl uppercase leading-none">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
                {density === "full" ? (
                  <ul className="mt-4 space-y-2 text-sm text-ink">
                    {service.deliverables.map((item) => (
                      <li key={item} className="border-t border-line pt-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {density === "full" ? (
                    <button type="button" className={buttonClass("secondary", "sm")} onClick={() => setActive(service)}>
                      Learn more
                    </button>
                  ) : (
                    <Link href={`/services#service-${service.slug}`} className={buttonClass("secondary", "sm")}>
                      Learn more
                    </Link>
                  )}
                  <Link href={`/contact?service=${service.slug}#inquiry`} className={buttonClass("ghost", "sm", "border border-line")}>
                    Start with this
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
      <Dialog open={Boolean(active)} title={active?.title ?? "Service"} description={active?.description} onClose={() => setActive(null)}>
        {active ? (
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Deliverables</h3>
            <ul className="mt-3 space-y-2">
              {active.deliverables.map((item) => (
                <li key={item} className="border-t border-line py-2 text-sm">
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={buttonClass("primary", "md", "mt-6")}
              onClick={() => router.push(`/contact?service=${active.slug}#inquiry`)}
            >
              Start a project
            </button>
          </div>
        ) : null}
      </Dialog>
    </Section>
  );
}
