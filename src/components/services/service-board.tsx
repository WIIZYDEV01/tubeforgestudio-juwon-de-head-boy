"use client";

import Link from "next/link";
import { useState } from "react";
import { ServiceIcon } from "@/components/icons";
import { Reveal } from "@/components/animations/reveal";
import { buttonClass } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState, Section, SectionHeading, Skeleton } from "@/components/ui/misc";
import { useContent } from "@/hooks/content-provider";
import type { ServiceItem } from "@/types/content";

export function ServiceBoard({ density = "compact" }: { density?: "compact" | "full" }) {
  const { ready, publishedServices } = useContent();
  const [active, setActive] = useState<ServiceItem | null>(null);

  return (
    <Section id="services" tone={density === "full" ? "studio" : "raised"} film={density === "full" ? "orbit" : "pulse"}>
      <SectionHeading
        eyebrow="Services"
        title="Twelve ways a channel gets made."
        body="Each service can stand alone or sit inside a full automation system. Deliverables describe the work product, not a completed client job."
      />
      {!ready ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-56" />
          ))}
        </div>
      ) : publishedServices.length === 0 ? (
        <EmptyState title="No services published." body="Add a service in the studio desk and mark it published to show it here." />
      ) : (
        <div className={density === "full" ? "space-y-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
          {publishedServices.map((service, index) => (
            <Reveal key={service.id} delay={Math.min(index * 0.04, 0.24)}>
              <article className="flex h-full flex-col border border-line bg-card p-5">
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
                  <button type="button" className={buttonClass("secondary", "sm")} onClick={() => setActive(service)}>
                    Learn more
                  </button>
                  <Link href={`/contact?service=${service.slug}`} className={buttonClass("ghost", "sm", "border border-line")}>
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
            <Link href={`/contact?service=${active.slug}`} className={buttonClass("primary", "md", "mt-6")} onClick={() => setActive(null)}>
              Start a project
            </Link>
          </div>
        ) : null}
      </Dialog>
    </Section>
  );
}
