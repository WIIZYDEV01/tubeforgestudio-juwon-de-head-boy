"use client";

import { Mail } from "lucide-react";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { Section, SectionHeading } from "@/components/ui/misc";
import { useContent } from "@/hooks/content-provider";
import { whatsappHref } from "@/lib/utils";

export function ContactBand({ page = false }: { page?: boolean }) {
  const { settings } = useContent();
  const whatsapp = whatsappHref(settings.whatsapp);
  const sampleMail = settings.email.endsWith("@example.com");
  const copy = (
    <>
      <SectionHeading
        eyebrow="Contact"
        title={page ? "Start a project." : "Tell us what the channel needs."}
        body="The form keeps your inquiry on this device. Use email or WhatsApp only after those addresses are set to real ones in the studio desk."
      />
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4 text-sm text-muted">
          <p className="flex items-center gap-2 text-ink">
            <Mail size={16} className="text-accent" />
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </p>
          {sampleMail ? <p>That address is a sample. example.com does not deliver mail.</p> : null}
          {whatsapp ? (
            <p>
              <a className="text-ink underline decoration-accent underline-offset-4" href={whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </p>
          ) : (
            <p>WhatsApp is not configured.</p>
          )}
          <p>Studio desk inquiries stay in this browser. There is no server and no sent-mail confirmation.</p>
        </div>
        <InquiryForm />
      </div>
    </>
  );
  if (page) return <div className="py-12 sm:py-16">{copy}</div>;
  return (
    <Section id="contact">
      {copy}
    </Section>
  );
}
