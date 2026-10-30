import type { Metadata } from "next";
import { Gallery } from "@/components/portfolio/gallery";
import { Section, SectionHeading } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Projects you saved in this browser on TubeForgeStudio.",
  alternates: { canonical: "/favorites" },
};

export default function FavoritesPage() {
  return (
    <Section>
      <SectionHeading eyebrow="Favorites" title="Saved on this device." body="Favorites live in this browser. They are not an account and they do not sync." />
      <Gallery heading={false} favoritesOnlyDefault />
    </Section>
  );
}
