import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/admin-gate";

export const metadata: Metadata = {
  title: "Studio desk",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted">Opening the desk…</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
