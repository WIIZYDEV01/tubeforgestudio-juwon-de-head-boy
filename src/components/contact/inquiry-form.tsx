"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { BUDGETS } from "@/data/options";
import { inquiryFormSchema, type InquiryFormValues } from "@/lib/validation/schemas";
import { createId, nowIso, whatsappHref } from "@/lib/utils";
import { useContent } from "@/hooks/content-provider";
import { useToast } from "@/components/ui/toast";
import { buttonClass } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/misc";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-danger" role="alert">
      {message}
    </p>
  );
}

function InquiryFields() {
  const params = useSearchParams();
  const { ready, publishedServices, settings, inquiries, saveInquiry } = useContent();
  const toast = useToast();
  const [savedId, setSavedId] = useState<string | null>(null);
  const preset = params.get("service") ?? "";
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      businessName: "",
      service: "",
      budget: "",
      description: "",
      deliveryDate: "",
    },
  });

  useEffect(() => {
    const match = publishedServices.find((service) => service.slug === preset);
    if (match) form.setValue("service", match.title);
  }, [preset, publishedServices, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const duplicate = inquiries.some(
      (item) =>
        item.email.toLowerCase() === values.email.toLowerCase() &&
        item.description === values.description &&
        Date.now() - new Date(item.createdAt).getTime() < 60_000,
    );
    if (duplicate) {
      toast.error("This inquiry was just saved.");
      return;
    }
    const id = createId("inq");
    try {
      await saveInquiry({
        id,
        ...values,
        status: "new",
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
      setSavedId(id);
      form.reset();
      toast.success("Inquiry saved in this browser.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The inquiry could not be saved.");
    }
  });

  if (!ready) return <Skeleton className="h-96" />;

  if (savedId) {
    const mail = settings.email;
    const whatsapp = whatsappHref(settings.whatsapp);
    const sampleMail = mail.endsWith("@example.com");
    return (
      <div className="border border-line bg-card p-6" role="status">
        <h3 className="font-display text-3xl uppercase">Inquiry saved on this device.</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          No email was sent. This website has no mail service connected. The note stays in this browser, where the studio desk can read it. Reference {savedId}.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className={buttonClass("secondary")} onClick={() => setSavedId(null)}>
            Write another inquiry
          </button>
          {whatsapp ? (
            <a className={buttonClass("primary")} href={whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          ) : null}
          <a className={buttonClass("secondary")} href={`mailto:${mail}`}>
            Email {mail}
          </a>
        </div>
        {sampleMail ? <p className="mt-3 text-xs text-muted">The email address is a sample on example.com. Update it in the studio desk before relying on it.</p> : null}
        {!whatsapp ? <p className="mt-3 text-xs text-muted">No WhatsApp number is set. Add one in the studio desk if you want a chat link.</p> : null}
      </div>
    );
  }

  const options = ["Not sure yet", ...publishedServices.map((service) => service.title)];

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      <label>
        <span className="label">Full name</span>
        <input className="field" autoComplete="name" aria-invalid={Boolean(form.formState.errors.fullName)} {...form.register("fullName")} />
        <FieldError message={form.formState.errors.fullName?.message} />
      </label>
      <label>
        <span className="label">Email</span>
        <input className="field" type="email" autoComplete="email" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </label>
      <label>
        <span className="label">Business or channel name</span>
        <input className="field" aria-invalid={Boolean(form.formState.errors.businessName)} {...form.register("businessName")} />
        <FieldError message={form.formState.errors.businessName?.message} />
      </label>
      <label>
        <span className="label">Required service</span>
        <select className="field" aria-invalid={Boolean(form.formState.errors.service)} {...form.register("service")}>
          <option value="">Choose a service</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError message={form.formState.errors.service?.message} />
      </label>
      <label>
        <span className="label">Project budget</span>
        <select className="field" aria-invalid={Boolean(form.formState.errors.budget)} {...form.register("budget")}>
          <option value="">Choose a range</option>
          {BUDGETS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError message={form.formState.errors.budget?.message} />
      </label>
      <label>
        <span className="label">Preferred delivery date</span>
        <input className="field" type="date" {...form.register("deliveryDate")} />
        <FieldError message={form.formState.errors.deliveryDate?.message} />
      </label>
      <label>
        <span className="label">Project description</span>
        <textarea className="field min-h-32" aria-invalid={Boolean(form.formState.errors.description)} {...form.register("description")} />
        <FieldError message={form.formState.errors.description?.message} />
      </label>
      <p className="text-xs leading-relaxed text-muted">Submitting stores the inquiry in this browser. It does not send an email.</p>
      <button className={buttonClass()} type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : "Save inquiry"}
      </button>
    </form>
  );
}

export function InquiryForm() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <InquiryFields />
    </Suspense>
  );
}
