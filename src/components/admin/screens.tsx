"use client";

import { CrudPage } from "@/components/admin/crud-page";
import { CheckField, NumberField, SelectField, TextField } from "@/components/admin/fields";
import { CATEGORIES, INQUIRY_STATUSES, SERVICE_ICONS } from "@/data/options";
import { motifs } from "@/data/motifs";
import { useContent } from "@/hooks/content-provider";
import {
  caseStudyFormSchema,
  comparisonFormSchema,
  faqFormSchema,
  inquiryAdminSchema,
  projectFormSchema,
  serviceFormSchema,
  statisticFormSchema,
  testimonialFormSchema,
  type CaseStudy,
  type CaseStudyFormValues,
  type ComparisonFormValues,
  type ComparisonItem,
  type FaqFormValues,
  type FaqItem,
  type Inquiry,
  type InquiryAdminValues,
  type MediaMeta,
  type PortfolioProject,
  type ProjectFormValues,
  type ServiceFormValues,
  type ServiceItem,
  type Statistic,
  type StatisticFormValues,
  type Testimonial,
  type TestimonialFormValues,
} from "@/lib/validation/schemas";
import { createId, linesToList, listToLines, nowIso, uniqueSlug } from "@/lib/utils";

function choices(values: readonly string[]) {
  return values.map((value) => ({ label: value, value }));
}

function mediaChoices(media: MediaMeta[], kind: "image" | "video", empty: string) {
  return [
    { label: empty, value: "" },
    ...media
      .filter((item) => item.type.startsWith(`${kind}/`))
      .map((item) => ({ label: item.name, value: item.id })),
  ];
}

const motifOptions = motifs.map((motif) => ({ label: motif.label, value: motif.id }));

function Loading() {
  return <p className="text-sm text-muted">Loading catalog…</p>;
}

export function PortfolioAdmin() {
  const { ready, projects, media, saveProject, deleteProject } = useContent();
  if (!ready) return <Loading />;
  const categories = [...new Set<string>([...CATEGORIES, ...projects.map((project) => project.category)])];
  return (
    <CrudPage<ProjectFormValues, PortfolioProject>
      title="Portfolio"
      noun="project"
      intro="Concept projects stay labelled on the public site. Mark commissioned only for real client work you are allowed to show."
      items={projects}
      schema={projectFormSchema}
      searchText={(item) => `${item.title} ${item.category} ${item.summary} ${item.kind}`}
      filters={[
        { id: "concept", label: "Concept", test: (item) => item.kind === "concept" },
        { id: "commissioned", label: "Commissioned", test: (item) => item.kind === "commissioned" },
        { id: "hidden", label: "Unpublished", test: (item) => !item.published },
      ]}
      columns={[
        { header: "Title", cell: (item) => item.title },
        { header: "Category", cell: (item) => item.category },
        { header: "Kind", cell: (item) => item.kind },
        { header: "Published", cell: (item) => (item.published ? "Yes" : "No") },
      ]}
      emptyTitle="No projects"
      emptyBody="Add a project to show it on the public catalog."
      detail={(item) => [
        { label: "Title", value: item.title },
        { label: "Slug", value: item.slug },
        { label: "Category", value: item.category },
        { label: "Kind", value: item.kind },
        { label: "Client", value: item.clientLabel || "None" },
        { label: "Summary", value: item.summary },
        { label: "Description", value: item.description },
        { label: "Services", value: item.services.join(", ") },
      ]}
      toForm={(item) =>
        item
          ? { ...item, services: listToLines(item.services) }
          : {
              title: "",
              slug: "",
              category: "Long-form",
              summary: "",
              description: "",
              format: "Long-form",
              services: "",
              duration: "",
              motif: "forge",
              featured: false,
              kind: "concept",
              clientLabel: "",
              mediaId: "",
              videoId: "",
              year: "2026",
              published: true,
            }
      }
      toItem={(values, existing, all) => ({
        id: existing?.id ?? createId("prj"),
        slug: uniqueSlug(values.slug, values.title, all, existing?.id),
        title: values.title,
        category: values.category,
        summary: values.summary,
        description: values.description,
        format: values.format,
        services: linesToList(values.services),
        duration: values.duration,
        motif: values.motif,
        featured: values.featured,
        kind: values.kind,
        clientLabel: values.clientLabel,
        mediaId: values.mediaId,
        videoId: values.videoId,
        year: values.year,
        published: values.published,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      })}
      onSave={saveProject}
      onDelete={(item) => deleteProject(item.id)}
    >
      {(form) => (
        <>
          <TextField form={form} name="title" label="Title" />
          <TextField form={form} name="slug" label="Slug" hint="Leave blank to build it from the title." />
          <SelectField form={form} name="category" label="Category" options={choices(categories)} />
          <SelectField form={form} name="kind" label="Kind" options={[{ label: "Concept", value: "concept" }, { label: "Commissioned", value: "commissioned" }]} />
          <TextField form={form} name="clientLabel" label="Client name" hint="Required only for commissioned work." />
          <TextField form={form} name="format" label="Format" />
          <TextField form={form} name="duration" label="Duration" hint="Example: 18:40. Leave blank if it does not apply." />
          <TextField form={form} name="year" label="Year" />
          <SelectField form={form} name="motif" label="Poster motif" options={motifOptions} />
          <SelectField form={form} name="mediaId" label="Image override" options={mediaChoices(media, "image", "Use poster motif")} />
          <SelectField form={form} name="videoId" label="Preview video" options={mediaChoices(media, "video", "No video file")} />
          <TextField className="md:col-span-2" form={form} name="summary" label="Summary" area />
          <TextField className="md:col-span-2" form={form} name="description" label="Description" area />
          <TextField className="md:col-span-2" form={form} name="services" label="Services delivered" area hint="One service per line." />
          <CheckField form={form} name="featured" label="Featured on the home page" />
          <CheckField form={form} name="published" label="Published on the public site" />
        </>
      )}
    </CrudPage>
  );
}

export function ServicesAdmin() {
  const { ready, services, saveService, deleteService } = useContent();
  if (!ready) return <Loading />;
  return (
    <CrudPage<ServiceFormValues, ServiceItem>
      title="Services"
      noun="service"
      intro="These are the offers shown on the public site. Deliverables describe the work product."
      items={[...services].sort((a, b) => a.order - b.order)}
      schema={serviceFormSchema}
      searchText={(item) => `${item.title} ${item.description}`}
      columns={[
        { header: "Title", cell: (item) => item.title },
        { header: "Order", cell: (item) => item.order },
        { header: "Published", cell: (item) => (item.published ? "Yes" : "No") },
      ]}
      emptyTitle="No services"
      emptyBody="Add a service to show it on the site."
      detail={(item) => [
        { label: "Title", value: item.title },
        { label: "Description", value: item.description },
        { label: "Deliverables", value: item.deliverables.join(", ") },
      ]}
      toForm={(item) =>
        item
          ? { ...item, deliverables: listToLines(item.deliverables) }
          : { title: "", slug: "", description: "", deliverables: "", icon: "Clapperboard", order: services.length + 1, published: true }
      }
      toItem={(values, existing, all) => ({
        id: existing?.id ?? createId("srv"),
        slug: uniqueSlug(values.slug, values.title, all, existing?.id),
        title: values.title,
        description: values.description,
        deliverables: linesToList(values.deliverables),
        icon: values.icon,
        order: values.order,
        published: values.published,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      })}
      onSave={saveService}
      onDelete={(item) => deleteService(item.id)}
    >
      {(form) => (
        <>
          <TextField form={form} name="title" label="Title" />
          <TextField form={form} name="slug" label="Slug" />
          <SelectField form={form} name="icon" label="Icon" options={choices(SERVICE_ICONS)} />
          <NumberField form={form} name="order" label="Order" />
          <TextField className="md:col-span-2" form={form} name="description" label="Description" area />
          <TextField className="md:col-span-2" form={form} name="deliverables" label="Deliverables" area hint="One per line." />
          <CheckField form={form} name="published" label="Published" />
        </>
      )}
    </CrudPage>
  );
}

export function TestimonialsAdmin() {
  const { ready, testimonials, media, saveTestimonial, deleteTestimonial } = useContent();
  if (!ready) return <Loading />;
  return (
    <CrudPage<TestimonialFormValues, Testimonial>
      title="Testimonials"
      noun="testimonial"
      intro="Placeholder slides are labelled on the public site and do not show a star rating. Turn the placeholder off only for a review you have permission to publish."
      items={testimonials}
      schema={testimonialFormSchema}
      searchText={(item) => `${item.name} ${item.quote} ${item.projectType}`}
      filters={[{ id: "placeholder", label: "Placeholders", test: (item) => item.placeholder }]}
      columns={[
        { header: "Name", cell: (item) => item.name },
        { header: "Type", cell: (item) => item.projectType },
        { header: "Placeholder", cell: (item) => (item.placeholder ? "Yes" : "No") },
      ]}
      emptyTitle="No testimonials"
      emptyBody="Add a placeholder or a permitted review."
      detail={(item) => [
        { label: "Name", value: item.name },
        { label: "Quote", value: item.quote },
        { label: "Placeholder", value: item.placeholder ? "Yes" : "No" },
      ]}
      toForm={(item) =>
        item ?? {
          quote: "",
          name: "",
          projectType: "",
          rating: 0,
          placeholder: true,
          mediaId: "",
          order: testimonials.length + 1,
          published: true,
        }
      }
      toItem={(values, existing) => ({
        id: existing?.id ?? createId("tst"),
        ...values,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      })}
      onSave={saveTestimonial}
      onDelete={(item) => deleteTestimonial(item.id)}
    >
      {(form) => (
        <>
          <TextField form={form} name="name" label="Name" />
          <TextField form={form} name="projectType" label="Project type" />
          <NumberField form={form} name="rating" label="Rating" hint="1 to 5. Hidden while this is a placeholder." />
          <NumberField form={form} name="order" label="Order" />
          <SelectField form={form} name="mediaId" label="Portrait" options={mediaChoices(media, "image", "Monogram")} />
          <TextField className="md:col-span-2" form={form} name="quote" label="Review text" area />
          <CheckField form={form} name="placeholder" label="Placeholder — not a customer review" />
          <CheckField form={form} name="published" label="Published" />
        </>
      )}
    </CrudPage>
  );
}

export function FaqAdmin() {
  const { ready, faqs, saveFaq, deleteFaq } = useContent();
  if (!ready) return <Loading />;
  return (
    <CrudPage<FaqFormValues, FaqItem>
      title="FAQs"
      noun="FAQ"
      intro="Answers appear in the accordion on the home page and on the FAQ page."
      items={[...faqs].sort((a, b) => a.order - b.order)}
      schema={faqFormSchema}
      searchText={(item) => `${item.question} ${item.answer}`}
      columns={[
        { header: "Question", cell: (item) => item.question },
        { header: "Order", cell: (item) => item.order },
      ]}
      emptyTitle="No questions"
      emptyBody="Add a question and answer."
      detail={(item) => [
        { label: "Question", value: item.question },
        { label: "Answer", value: item.answer },
      ]}
      toForm={(item) => item ?? { question: "", answer: "", order: faqs.length + 1, published: true }}
      toItem={(values, existing) => ({
        id: existing?.id ?? createId("faq"),
        ...values,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      })}
      onSave={saveFaq}
      onDelete={(item) => deleteFaq(item.id)}
    >
      {(form) => (
        <>
          <TextField className="md:col-span-2" form={form} name="question" label="Question" />
          <TextField className="md:col-span-2" form={form} name="answer" label="Answer" area />
          <NumberField form={form} name="order" label="Order" />
          <CheckField form={form} name="published" label="Published" />
        </>
      )}
    </CrudPage>
  );
}

export function CaseStudiesAdmin() {
  const { ready, caseStudies, projects, saveCaseStudy, deleteCaseStudy } = useContent();
  if (!ready) return <Loading />;
  const projectOptions = [{ label: "None", value: "" }, ...projects.map((project) => ({ label: project.title, value: project.slug }))];
  return (
    <CrudPage<CaseStudyFormValues, CaseStudy>
      title="Case studies"
      noun="case study"
      intro="Do not write results you cannot verify. Concept studies should say that no performance figures are published."
      items={caseStudies}
      schema={caseStudyFormSchema}
      searchText={(item) => `${item.title} ${item.industry} ${item.brief}`}
      columns={[
        { header: "Title", cell: (item) => item.title },
        { header: "Industry", cell: (item) => item.industry },
        { header: "Kind", cell: (item) => item.kind },
      ]}
      emptyTitle="No case studies"
      emptyBody="Add a study to publish a detail page."
      detail={(item) => [
        { label: "Title", value: item.title },
        { label: "Brief", value: item.brief },
        { label: "Results", value: item.resultsNote },
      ]}
      toForm={(item) =>
        item
          ? {
              ...item,
              process: listToLines(item.process),
              deliverables: listToLines(item.deliverables),
              relatedSlugs: listToLines(item.relatedSlugs),
              galleryMotifs: listToLines(item.galleryMotifs),
            }
          : {
              title: "",
              slug: "",
              industry: "",
              brief: "",
              challenge: "",
              strategy: "",
              process: "",
              deliverables: "",
              resultsNote: "No performance results are published.",
              kind: "concept",
              projectSlug: "",
              relatedSlugs: "",
              galleryMotifs: "forge",
              order: caseStudies.length + 1,
              published: true,
            }
      }
      toItem={(values, existing, all) => ({
        id: existing?.id ?? createId("case"),
        slug: uniqueSlug(values.slug, values.title, all, existing?.id),
        title: values.title,
        industry: values.industry,
        brief: values.brief,
        challenge: values.challenge,
        strategy: values.strategy,
        process: linesToList(values.process),
        deliverables: linesToList(values.deliverables),
        resultsNote: values.resultsNote,
        kind: values.kind,
        projectSlug: values.projectSlug,
        relatedSlugs: linesToList(values.relatedSlugs),
        galleryMotifs: linesToList(values.galleryMotifs),
        order: values.order,
        published: values.published,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      })}
      onSave={saveCaseStudy}
      onDelete={(item) => deleteCaseStudy(item.id)}
    >
      {(form) => (
        <>
          <TextField form={form} name="title" label="Title" />
          <TextField form={form} name="slug" label="Slug" />
          <TextField form={form} name="industry" label="Industry" />
          <SelectField form={form} name="kind" label="Kind" options={[{ label: "Concept", value: "concept" }, { label: "Commissioned", value: "commissioned" }]} />
          <SelectField form={form} name="projectSlug" label="Linked project" options={projectOptions} />
          <NumberField form={form} name="order" label="Order" />
          <TextField className="md:col-span-2" form={form} name="brief" label="Brief" area />
          <TextField className="md:col-span-2" form={form} name="challenge" label="Challenge" area />
          <TextField className="md:col-span-2" form={form} name="strategy" label="Strategy" area />
          <TextField className="md:col-span-2" form={form} name="process" label="Process" area hint="One step per line." />
          <TextField className="md:col-span-2" form={form} name="deliverables" label="Deliverables" area hint="One per line." />
          <TextField className="md:col-span-2" form={form} name="resultsNote" label="Results note" area hint="Do not enter analytics you cannot verify." />
          <TextField className="md:col-span-2" form={form} name="relatedSlugs" label="Related project slugs" area hint="One slug per line." />
          <TextField className="md:col-span-2" form={form} name="galleryMotifs" label="Gallery motif ids" area hint="One motif id per line, such as copper or salt." />
          <CheckField form={form} name="published" label="Published" />
        </>
      )}
    </CrudPage>
  );
}

export function ComparisonsAdmin() {
  const { ready, comparisons, media, saveComparison, deleteComparison } = useContent();
  if (!ready) return <Loading />;
  return (
    <CrudPage<ComparisonFormValues, ComparisonItem>
      title="Comparisons"
      noun="comparison"
      intro="Before-and-after studies for thumbnail redesigns. Say so in the explanation if the study is a concept."
      items={comparisons}
      schema={comparisonFormSchema}
      searchText={(item) => `${item.title} ${item.explanation}`}
      columns={[
        { header: "Title", cell: (item) => item.title },
        { header: "Order", cell: (item) => item.order },
      ]}
      emptyTitle="No comparisons"
      emptyBody="Add a study to show the slider on the site."
      detail={(item) => [
        { label: "Title", value: item.title },
        { label: "Explanation", value: item.explanation },
      ]}
      toForm={(item) =>
        item ?? {
          title: "",
          explanation: "",
          beforeMotif: "ledger",
          afterMotif: "copper",
          beforeMediaId: "",
          afterMediaId: "",
          order: comparisons.length + 1,
          published: true,
        }
      }
      toItem={(values, existing) => ({
        id: existing?.id ?? createId("cmp"),
        ...values,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      })}
      onSave={saveComparison}
      onDelete={(item) => deleteComparison(item.id)}
    >
      {(form) => (
        <>
          <TextField className="md:col-span-2" form={form} name="title" label="Title" />
          <TextField className="md:col-span-2" form={form} name="explanation" label="Explanation" area />
          <SelectField form={form} name="beforeMotif" label="Before motif" options={motifOptions} />
          <SelectField form={form} name="afterMotif" label="After motif" options={motifOptions} />
          <SelectField form={form} name="beforeMediaId" label="Before image" options={mediaChoices(media, "image", "Use motif")} />
          <SelectField form={form} name="afterMediaId" label="After image" options={mediaChoices(media, "image", "Use motif")} />
          <NumberField form={form} name="order" label="Order" />
          <CheckField form={form} name="published" label="Published" />
        </>
      )}
    </CrudPage>
  );
}

export function InquiriesAdmin() {
  const { ready, inquiries, saveInquiry, deleteInquiry } = useContent();
  if (!ready) return <Loading />;
  const ordered = [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <CrudPage<InquiryAdminValues, Inquiry>
      title="Inquiries"
      noun="inquiry"
      intro="Inquiries are saved in this browser. Nothing here was emailed."
      items={ordered}
      schema={inquiryAdminSchema}
      searchText={(item) => `${item.fullName} ${item.email} ${item.businessName} ${item.service} ${item.description}`}
      filters={INQUIRY_STATUSES.map((status) => ({ id: status, label: status, test: (item: Inquiry) => item.status === status }))}
      columns={[
        { header: "Name", cell: (item) => item.fullName },
        { header: "Service", cell: (item) => item.service },
        { header: "Status", cell: (item) => item.status },
      ]}
      emptyTitle="No inquiries"
      emptyBody="Messages from the contact form will appear here."
      detail={(item) => [
        { label: "Name", value: item.fullName },
        { label: "Email", value: item.email },
        { label: "Business", value: item.businessName },
        { label: "Service", value: item.service },
        { label: "Budget", value: item.budget || "Not set" },
        { label: "Date", value: item.deliveryDate || "Not set" },
        { label: "Description", value: item.description },
        { label: "Status", value: item.status },
      ]}
      toForm={(item) =>
        item ?? {
          fullName: "",
          email: "",
          businessName: "",
          service: "",
          budget: "Not sure yet",
          description: "",
          deliveryDate: "",
          status: "new",
        }
      }
      toItem={(values, existing) => ({
        id: existing?.id ?? createId("inq"),
        ...values,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      })}
      onSave={saveInquiry}
      onDelete={(item) => deleteInquiry(item.id)}
    >
      {(form) => (
        <>
          <TextField form={form} name="fullName" label="Full name" />
          <TextField form={form} name="email" label="Email" />
          <TextField form={form} name="businessName" label="Business or channel" />
          <TextField form={form} name="service" label="Service" />
          <TextField form={form} name="budget" label="Budget" />
          <TextField form={form} name="deliveryDate" label="Preferred date" hint="YYYY-MM-DD or blank." />
          <SelectField form={form} name="status" label="Status" options={choices(INQUIRY_STATUSES)} />
          <TextField className="md:col-span-2" form={form} name="description" label="Description" area />
        </>
      )}
    </CrudPage>
  );
}

export function StatisticsAdmin() {
  const { ready, statistics, saveStatistic, deleteStatistic } = useContent();
  if (!ready) return <Loading />;
  return (
    <CrudPage<StatisticFormValues, Statistic>
      title="Statistics"
      noun="statistic"
      intro="Clear the sample flag only when the number is a real studio record. Sample figures stay labelled on the public site."
      items={[...statistics].sort((a, b) => a.order - b.order)}
      schema={statisticFormSchema}
      searchText={(item) => `${item.label} ${item.note}`}
      columns={[
        { header: "Label", cell: (item) => item.label },
        { header: "Value", cell: (item) => item.value },
        { header: "Sample", cell: (item) => (item.sample ? "Yes" : "Verified") },
      ]}
      emptyTitle="No statistics"
      emptyBody="Add a figure to show it on the home page."
      detail={(item) => [
        { label: "Label", value: item.label },
        { label: "Value", value: `${item.value}${item.suffix}` },
        { label: "Note", value: item.note || "None" },
      ]}
      toForm={(item) => item ?? { label: "", value: 0, suffix: "", sample: true, note: "Sample figure for the layout. Not a verified studio record.", order: statistics.length + 1 }}
      toItem={(values, existing) => ({
        id: existing?.id ?? createId("stat"),
        ...values,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      })}
      onSave={saveStatistic}
      onDelete={(item) => deleteStatistic(item.id)}
    >
      {(form) => (
        <>
          <TextField form={form} name="label" label="Label" />
          <NumberField form={form} name="value" label="Value" />
          <TextField form={form} name="suffix" label="Suffix" hint="Optional, such as +." />
          <NumberField form={form} name="order" label="Order" />
          <TextField className="md:col-span-2" form={form} name="note" label="Note" area />
          <CheckField form={form} name="sample" label="Sample figure" hint="Leave this on until the number is true." />
        </>
      )}
    </CrudPage>
  );
}
