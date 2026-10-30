import type { Metadata } from "next";
import { ServiceBoard } from "@/components/services/service-board";

export const metadata: Metadata = {
  title: "Services",
  description: "YouTube automation, research, scripts, voiceover, editing, thumbnails, SEO, and publishing from TubeForgeStudio.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServiceBoard density="full" />;
}
