import type { Metadata } from "next";
import { Suspense } from "react";
import { CaseStudyDetail } from "@/components/case-studies/case-study-views";
import Loading from "../../loading";

export const metadata: Metadata = {
  title: "Case study",
  description: "A TubeForgeStudio case study covering brief, challenge, strategy, process, and published results only.",
};

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <CaseStudyBody params={params} />
    </Suspense>
  );
}

async function CaseStudyBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CaseStudyDetail slug={slug} />;
}
