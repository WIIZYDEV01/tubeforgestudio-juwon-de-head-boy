import type { Metadata } from "next";
import { Gallery } from "@/components/portfolio/gallery";
import { Section } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Concept projects and commissioned work from TubeForgeStudio, with concept pieces clearly labelled.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <Section film="reels">
      <Gallery heading />
    </Section>
  );
}
