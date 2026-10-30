import type { Metadata } from "next";
import { ContactBand } from "@/components/contact/contact-band";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a TubeForgeStudio project. Inquiries are saved in this browser. No email is sent.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ContactBand page />
  );
}
