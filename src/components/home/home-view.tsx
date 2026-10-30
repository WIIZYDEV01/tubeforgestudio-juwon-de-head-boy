"use client";

import { CasePreview } from "@/components/case-studies/case-study-views";
import { CompareSection } from "@/components/compare/compare-section";
import { ContactBand } from "@/components/contact/contact-band";
import { FaqList } from "@/components/faq/faq-list";
import { Hero } from "@/components/hero/hero";
import { Featured } from "@/components/portfolio/project-detail";
import { Gallery } from "@/components/portfolio/gallery";
import { ServiceBoard } from "@/components/services/service-board";
import { Stats } from "@/components/stats/stats";
import { Testimonials } from "@/components/testimonials/testimonials";
import { Section } from "@/components/ui/misc";
import { Workflow } from "@/components/workflow/workflow";

export function HomeView() {
  return (
    <>
      <Hero />
      <Stats />
      <Featured />
      <Section id="work" film="scan">
        <Gallery limit={6} />
      </Section>
      <ServiceBoard />
      <CompareSection />
      <Workflow />
      <CasePreview />
      <Testimonials />
      <FaqList embedded />
      <ContactBand />
    </>
  );
}
