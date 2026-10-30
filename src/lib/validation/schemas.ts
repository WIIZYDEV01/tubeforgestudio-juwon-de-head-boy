import { z } from "zod";

const iso = z.string().min(4);

export const projectSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  format: z.string().min(1),
  services: z.array(z.string()),
  duration: z.string(),
  motif: z.string().min(1),
  featured: z.boolean(),
  kind: z.enum(["concept", "commissioned"]),
  clientLabel: z.string(),
  mediaId: z.string(),
  videoId: z.string(),
  year: z.string(),
  published: z.boolean(),
  createdAt: iso,
  updatedAt: iso,
});

export const serviceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  deliverables: z.array(z.string()),
  icon: z.string().min(1),
  order: z.number(),
  published: z.boolean(),
  createdAt: iso,
  updatedAt: iso,
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  name: z.string().min(1),
  projectType: z.string().min(1),
  rating: z.number().min(0).max(5),
  placeholder: z.boolean(),
  mediaId: z.string(),
  order: z.number(),
  published: z.boolean(),
  createdAt: iso,
  updatedAt: iso,
});

export const faqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number(),
  published: z.boolean(),
  createdAt: iso,
  updatedAt: iso,
});

export const caseStudySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  industry: z.string().min(1),
  brief: z.string().min(1),
  challenge: z.string().min(1),
  strategy: z.string().min(1),
  process: z.array(z.string()),
  deliverables: z.array(z.string()),
  resultsNote: z.string().min(1),
  kind: z.enum(["concept", "commissioned"]),
  projectSlug: z.string(),
  relatedSlugs: z.array(z.string()),
  galleryMotifs: z.array(z.string()),
  order: z.number(),
  published: z.boolean(),
  createdAt: iso,
  updatedAt: iso,
});

export const statisticSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.number().min(0),
  suffix: z.string(),
  sample: z.boolean(),
  note: z.string(),
  order: z.number(),
  createdAt: iso,
  updatedAt: iso,
});

export const inquirySchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  businessName: z.string().min(1),
  service: z.string().min(1),
  budget: z.string(),
  description: z.string().min(1),
  deliveryDate: z.string(),
  status: z.enum(["new", "reviewed", "archived"]),
  createdAt: iso,
  updatedAt: iso,
});

export const comparisonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  explanation: z.string().min(1),
  beforeMotif: z.string().min(1),
  afterMotif: z.string().min(1),
  beforeMediaId: z.string(),
  afterMediaId: z.string(),
  order: z.number(),
  published: z.boolean(),
  createdAt: iso,
  updatedAt: iso,
});

export const settingsSchema = z.object({
  studioName: z.string().trim().min(2, "Enter the studio name."),
  email: z.string().trim().email("Enter a valid email address."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9]*$/, "Use digits only, with the country code and no spaces.")
    .refine((value) => value === "" || (value.length >= 8 && value.length <= 15), "Use 8 to 15 digits, or leave the field blank."),
  heroHeadline: z.string().trim().min(8, "The headline is too short."),
  heroDescription: z.string().trim().min(20, "The description is too short."),
  adminPin: z.string().min(4, "Use at least 4 characters. This is only a local demonstration PIN."),
});

export const activitySchema = z.object({
  id: z.string().min(1),
  message: z.string().min(1),
  at: iso,
});

export const mediaMetaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  size: z.number().nonnegative(),
  createdAt: iso,
});

export const backupMediaSchema = mediaMetaSchema.extend({
  dataUrl: z.string().startsWith("data:"),
});

export const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string().min(4),
  projects: z.array(projectSchema),
  services: z.array(serviceSchema),
  testimonials: z.array(testimonialSchema),
  faqs: z.array(faqSchema),
  caseStudies: z.array(caseStudySchema),
  statistics: z.array(statisticSchema),
  inquiries: z.array(inquirySchema),
  comparisons: z.array(comparisonSchema),
  settings: settingsSchema,
  activity: z.array(activitySchema),
  media: z.array(backupMediaSchema),
});

export const projectFormSchema = z
  .object({
    title: z.string().trim().min(2, "Enter a title."),
    slug: z
      .string()
      .trim()
      .regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
    category: z.string().trim().min(1, "Choose a category."),
    summary: z.string().trim().min(12, "Add a short summary."),
    description: z.string().trim().min(24, "Add a project description."),
    format: z.string().trim().min(2, "Name the format."),
    services: z.string().trim().min(2, "List at least one service, one per line."),
    duration: z.string(),
    motif: z.string().min(1, "Choose a poster motif."),
    featured: z.boolean(),
    kind: z.enum(["concept", "commissioned"]),
    clientLabel: z.string(),
    mediaId: z.string(),
    videoId: z.string(),
    year: z.string().trim().min(4, "Enter a year."),
    published: z.boolean(),
  })
  .refine((value) => value.kind === "concept" || value.clientLabel.trim().length > 1, {
    message: "Name the client for commissioned work, or keep this as a concept.",
    path: ["clientLabel"],
  });

export const serviceFormSchema = z.object({
  title: z.string().trim().min(2, "Enter a service title."),
  slug: z
    .string()
    .trim()
    .regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  description: z.string().trim().min(16, "Describe the service."),
  deliverables: z.string().trim().min(2, "List at least one deliverable, one per line."),
  icon: z.string().min(1, "Choose an icon."),
  order: z.number({ invalid_type_error: "Enter a sort order." }),
  published: z.boolean(),
});

export const testimonialFormSchema = z
  .object({
    quote: z.string().trim().min(12, "Enter the review text."),
    name: z.string().trim().min(2, "Enter a name."),
    projectType: z.string().trim().min(2, "Enter a project type."),
    rating: z.number({ invalid_type_error: "Enter a rating." }).min(0).max(5),
    placeholder: z.boolean(),
    mediaId: z.string(),
    order: z.number({ invalid_type_error: "Enter a sort order." }),
    published: z.boolean(),
  })
  .refine((value) => value.placeholder || (value.rating >= 1 && value.rating <= 5), {
    message: "Choose a rating from 1 to 5, or mark this as a placeholder.",
    path: ["rating"],
  });

export const faqFormSchema = z.object({
  question: z.string().trim().min(8, "Enter a question."),
  answer: z.string().trim().min(12, "Enter an answer."),
  order: z.number({ invalid_type_error: "Enter a sort order." }),
  published: z.boolean(),
});

export const caseStudyFormSchema = z.object({
  title: z.string().trim().min(2, "Enter a title."),
  slug: z
    .string()
    .trim()
    .regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  industry: z.string().trim().min(2, "Enter an industry."),
  brief: z.string().trim().min(16, "Write the project brief."),
  challenge: z.string().trim().min(16, "Describe the challenge."),
  strategy: z.string().trim().min(16, "Describe the strategy."),
  process: z.string().trim().min(8, "List the production steps, one per line."),
  deliverables: z.string().trim().min(2, "List the deliverables, one per line."),
  resultsNote: z.string().trim().min(12, "Write a results note. Say so if none are published."),
  kind: z.enum(["concept", "commissioned"]),
  projectSlug: z.string(),
  relatedSlugs: z.string(),
  galleryMotifs: z.string().trim().min(2, "List at least one motif id, one per line."),
  order: z.number({ invalid_type_error: "Enter a sort order." }),
  published: z.boolean(),
});

export const statisticFormSchema = z.object({
  label: z.string().trim().min(2, "Enter a label."),
  value: z.number({ invalid_type_error: "Enter a number." }).min(0, "Use zero or a positive number."),
  suffix: z.string(),
  sample: z.boolean(),
  note: z.string(),
  order: z.number({ invalid_type_error: "Enter a sort order." }),
});

export const inquiryFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  businessName: z.string().trim().min(2, "Enter a business or channel name."),
  service: z.string().trim().min(1, "Choose a service."),
  budget: z.string().trim().min(1, "Choose a budget range."),
  description: z.string().trim().min(20, "Describe the project in at least 20 characters."),
  deliveryDate: z
    .string()
    .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), "Choose a valid date."),
});

export const inquiryAdminSchema = inquiryFormSchema.extend({
  status: z.enum(["new", "reviewed", "archived"]),
});

export const comparisonFormSchema = z.object({
  title: z.string().trim().min(2, "Enter a title."),
  explanation: z.string().trim().min(16, "Explain the comparison."),
  beforeMotif: z.string().min(1),
  afterMotif: z.string().min(1),
  beforeMediaId: z.string(),
  afterMediaId: z.string(),
  order: z.number({ invalid_type_error: "Enter a sort order." }),
  published: z.boolean(),
});

export const settingsFormSchema = settingsSchema;

export function formatZodError(error: z.ZodError) {
  return error.issues
    .slice(0, 4)
    .map((issue) => `${issue.path.join(".") || "item"}: ${issue.message}`)
    .join(" ");
}

export type PortfolioProject = z.infer<typeof projectSchema>;
export type ServiceItem = z.infer<typeof serviceSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type FaqItem = z.infer<typeof faqSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Statistic = z.infer<typeof statisticSchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
export type ComparisonItem = z.infer<typeof comparisonSchema>;
export type SiteSettings = z.infer<typeof settingsSchema>;
export type ActivityEvent = z.infer<typeof activitySchema>;
export type MediaMeta = z.infer<typeof mediaMetaSchema>;
export type BackupFile = z.infer<typeof backupSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;
export type FaqFormValues = z.infer<typeof faqFormSchema>;
export type CaseStudyFormValues = z.infer<typeof caseStudyFormSchema>;
export type StatisticFormValues = z.infer<typeof statisticFormSchema>;
export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
export type InquiryAdminValues = z.infer<typeof inquiryAdminSchema>;
export type ComparisonFormValues = z.infer<typeof comparisonFormSchema>;
