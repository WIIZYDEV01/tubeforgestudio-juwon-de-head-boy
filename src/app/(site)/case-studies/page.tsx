import type { Metadata } from "next";
import { CaseStudyList } from "@/components/case-studies/case-study-views";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Concept case studies from TubeForgeStudio. Results are published only when they are verified.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return <CaseStudyList />;
}
