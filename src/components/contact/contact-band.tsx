"use client";

import { Mail, Phone } from "lucide-react";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { Section, SectionHeading } from "@/components/ui/misc";
import { useContent } from "@/hooks/content-provider";
import { phoneLabel, telHref, whatsappHref } from "@/lib/utils";

export function ContactBand({ page = false }: { page?: boolean }) {
  const { settings } = useContent();
  const whatsapp = whatsappHref(settings.whatsapp);
  const call = telHref(settings.whatsapp);
  const phone = phoneLabel(settings.whatsapp);
  const sampleMail = settings.email.endsWith("@example.com");
  const copy = (
    <>
      <SectionHeading
        eyebrow="Contact"
        title={page ? "Start a project." : "Tell us what the channel needs."}
        body="The form keeps a copy of your inquiry on this device. It does not send email. Use the address, phone, or WhatsApp below when you want a reply."
      />
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4 text-sm text-muted">
          <p className="flex items-center gap-2 text-ink">
            <Mail size={16} className="text-accent" />
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </p>
          {sampleMail ? <p>That address is a sample. example.com does not deliver mail.</p> : null}
          {call ? (
            <p className="flex items-center gap-2 text-ink">
              <Phone size={16} className="text-accent" />
              <a href={call}>{phone}</a>
            </p>
          ) : (
            <p>No phone number is set.</p>
          )}
          {whatsapp ? (
            <p>
              <a className="text-ink underline decoration-accent underline-offset-4" href={whatsapp} target="_blank" rel="noreferrer">
                WhatsApp {phone}
              </a>
            </p>
          ) : (
            <p>WhatsApp is not configured.</p>
          )}
          <p>Studio desk inquiries stay in this browser. There is no server and no sent-mail confirmation.</p>
        </div>
        <div id="inquiry" className="scroll-mt-28">
          <InquiryForm />
        </div>
      </div>
    </>
  );
  if (page) return <Section film="ink">{copy}</Section>;
  return (
    <Section id="contact" film="forge">
      {copy}
    </Section>
  );
}
