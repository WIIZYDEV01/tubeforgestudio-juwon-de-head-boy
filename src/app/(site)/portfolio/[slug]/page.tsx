import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectDetail } from "@/components/portfolio/project-detail";
import Loading from "../../loading";

export const metadata: Metadata = {
  title: "Project",
  description: "A TubeForgeStudio portfolio project, labelled as concept work or commissioned work.",
};

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectBody params={params} />
    </Suspense>
  );
}

async function ProjectBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} />;
}
