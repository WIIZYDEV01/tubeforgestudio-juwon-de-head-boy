import type { Metadata } from "next";
import { FaqList } from "@/components/faq/faq-list";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions about TubeForgeStudio services, concept projects, and how inquiries are stored.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return <FaqList />;
}
