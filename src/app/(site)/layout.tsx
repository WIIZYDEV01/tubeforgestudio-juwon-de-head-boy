import { Suspense } from "react";
import { HeaderFallback, SiteHeader, SiteShell } from "@/components/layout/site-shell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      <SiteShell>{children}</SiteShell>
    </>
  );
}
