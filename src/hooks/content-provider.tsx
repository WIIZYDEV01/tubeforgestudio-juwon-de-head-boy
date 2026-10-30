"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { openContentStore, type ContentStore } from "@/lib/db/store";
import { defaultSettings } from "@/data/seed";
import {
  caseStudySchema,
  comparisonSchema,
  faqSchema,
  formatZodError,
  inquirySchema,
  projectSchema,
  serviceSchema,
  settingsSchema,
  statisticSchema,
  testimonialSchema,
  type ActivityEvent,
  type BackupFile,
  type CaseStudy,
  type ComparisonItem,
  type FaqItem,
  type Inquiry,
  type MediaMeta,
  type PortfolioProject,
  type ServiceItem,
  type SiteSettings,
  type Statistic,
  type Testimonial,
} from "@/lib/validation/schemas";
import { revokeAllMediaUrls, revokeMediaUrl } from "@/lib/media-cache";
import { explainStorageError, nowIso } from "@/lib/utils";

type ContentValue = {
  ready: boolean;
  persistent: boolean;
  warning: string | null;
  projects: PortfolioProject[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  caseStudies: CaseStudy[];
  statistics: Statistic[];
  inquiries: Inquiry[];
  comparisons: ComparisonItem[];
  activity: ActivityEvent[];
  media: MediaMeta[];
  settings: SiteSettings;
  publishedProjects: PortfolioProject[];
  publishedServices: ServiceItem[];
  publishedTestimonials: Testimonial[];
  publishedFaqs: FaqItem[];
  publishedCaseStudies: CaseStudy[];
  publishedComparisons: ComparisonItem[];
  saveProject: (project: PortfolioProject) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveService: (item: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveTestimonial: (item: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  saveFaq: (item: FaqItem) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  saveCaseStudy: (item: CaseStudy) => Promise<void>;
  deleteCaseStudy: (id: string) => Promise<void>;
  saveStatistic: (item: Statistic) => Promise<void>;
  deleteStatistic: (id: string) => Promise<void>;
  saveInquiry: (item: Inquiry) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  saveComparison: (item: ComparisonItem) => Promise<void>;
  deleteComparison: (id: string) => Promise<void>;
  saveSettings: (settings: SiteSettings) => Promise<void>;
  saveMedia: (file: File) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  readMediaBlob: (id: string) => Promise<Blob | null>;
  exportBackup: () => Promise<BackupFile>;
  importBackup: (raw: unknown) => Promise<void>;
  resetSample: () => Promise<void>;
};

const ContentContext = createContext<ContentValue | null>(null);

function byOrder<T extends { order: number; title?: string; question?: string; label?: string }>(a: T, b: T) {
  return a.order - b.order || (a.title ?? a.question ?? a.label ?? "").localeCompare(b.title ?? b.question ?? b.label ?? "");
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ContentStore | null>(null);
  const seq = useRef(0);
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [media, setMedia] = useState<MediaMeta[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  const apply = useCallback((data: Awaited<ReturnType<ContentStore["load"]>>) => {
    setProjects(data.projects);
    setServices(data.services);
    setTestimonials(data.testimonials);
    setFaqs(data.faqs);
    setCaseStudies(data.caseStudies);
    setStatistics(data.statistics);
    setInquiries(data.inquiries);
    setComparisons(data.comparisons);
    setActivity(data.activity);
    setMedia(data.media);
    setSettings(data.settings);
    setWarning(
      data.dropped > 0
        ? "Some stored records were skipped because they did not match the catalog format."
        : null,
    );
  }, []);

  const refresh = useCallback(async () => {
    const store = storeRef.current;
    if (!store) return;
    const token = ++seq.current;
    const data = await store.load();
    if (token !== seq.current) return;
    apply(data);
  }, [apply]);

  useEffect(() => {
    let active = true;
    void openContentStore()
      .then(async ({ store, persistent: canPersist }) => {
        if (!active) return;
        storeRef.current = store;
        setPersistent(canPersist);
        const data = await store.load();
        if (!active) return;
        apply(data);
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setPersistent(false);
        setWarning("The catalog could not be opened. Showing nothing until you reload.");
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, [apply]);

  const requireStore = useCallback(() => {
    const store = storeRef.current;
    if (!store) throw new Error("Storage is not ready yet.");
    return store;
  }, []);

  const guard = useCallback(async (work: () => Promise<void>) => {
    try {
      await work();
      await refresh();
    } catch (error) {
      throw new Error(explainStorageError(error));
    }
  }, [refresh]);

  const saveProject = useCallback(async (project: PortfolioProject) => {
    const next = { ...project, updatedAt: nowIso(), createdAt: project.createdAt || nowIso() };
    const parsed = projectSchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().put("projects", parsed.data, `Saved project “${parsed.data.title}”.`);
    });
  }, [guard, requireStore]);

  const deleteProject = useCallback(async (id: string) => {
    const title = projects.find((item) => item.id === id)?.title ?? "project";
    await guard(async () => {
      await requireStore().remove("projects", id, `Deleted project “${title}”.`);
    });
  }, [guard, projects, requireStore]);

  const saveService = useCallback(async (item: ServiceItem) => {
    const next = { ...item, updatedAt: nowIso(), createdAt: item.createdAt || nowIso() };
    const parsed = serviceSchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().put("services", parsed.data, `Saved service “${parsed.data.title}”.`);
    });
  }, [guard, requireStore]);

  const deleteService = useCallback(async (id: string) => {
    const title = services.find((item) => item.id === id)?.title ?? "service";
    await guard(async () => {
      await requireStore().remove("services", id, `Deleted service “${title}”.`);
    });
  }, [guard, services, requireStore]);

  const saveTestimonial = useCallback(async (item: Testimonial) => {
    const next = { ...item, updatedAt: nowIso(), createdAt: item.createdAt || nowIso() };
    const parsed = testimonialSchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().put("testimonials", parsed.data, `Saved testimonial for “${parsed.data.name}”.`);
    });
  }, [guard, requireStore]);

  const deleteTestimonial = useCallback(async (id: string) => {
    await guard(async () => {
      await requireStore().remove("testimonials", id, "Deleted a testimonial.");
    });
  }, [guard, requireStore]);

  const saveFaq = useCallback(async (item: FaqItem) => {
    const next = { ...item, updatedAt: nowIso(), createdAt: item.createdAt || nowIso() };
    const parsed = faqSchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().put("faqs", parsed.data, "Saved an FAQ.");
    });
  }, [guard, requireStore]);

  const deleteFaq = useCallback(async (id: string) => {
    await guard(async () => {
      await requireStore().remove("faqs", id, "Deleted an FAQ.");
    });
  }, [guard, requireStore]);

  const saveCaseStudy = useCallback(async (item: CaseStudy) => {
    const next = { ...item, updatedAt: nowIso(), createdAt: item.createdAt || nowIso() };
    const parsed = caseStudySchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().put("caseStudies", parsed.data, `Saved case study “${parsed.data.title}”.`);
    });
  }, [guard, requireStore]);

  const deleteCaseStudy = useCallback(async (id: string) => {
    const title = caseStudies.find((item) => item.id === id)?.title ?? "case study";
    await guard(async () => {
      await requireStore().remove("caseStudies", id, `Deleted case study “${title}”.`);
    });
  }, [caseStudies, guard, requireStore]);

  const saveStatistic = useCallback(async (item: Statistic) => {
    const next = { ...item, updatedAt: nowIso(), createdAt: item.createdAt || nowIso() };
    const parsed = statisticSchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().put("statistics", parsed.data, `Saved statistic “${parsed.data.label}”.`);
    });
  }, [guard, requireStore]);

  const deleteStatistic = useCallback(async (id: string) => {
    await guard(async () => {
      await requireStore().remove("statistics", id, "Deleted a statistic.");
    });
  }, [guard, requireStore]);

  const saveInquiry = useCallback(async (item: Inquiry) => {
    const next = { ...item, updatedAt: nowIso(), createdAt: item.createdAt || nowIso() };
    const parsed = inquirySchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().put("inquiries", parsed.data, `Saved inquiry from ${parsed.data.fullName}.`);
    });
  }, [guard, requireStore]);

  const deleteInquiry = useCallback(async (id: string) => {
    await guard(async () => {
      await requireStore().remove("inquiries", id, "Deleted an inquiry.");
    });
  }, [guard, requireStore]);

  const saveComparison = useCallback(async (item: ComparisonItem) => {
    const next = { ...item, updatedAt: nowIso(), createdAt: item.createdAt || nowIso() };
    const parsed = comparisonSchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().put("comparisons", parsed.data, `Saved comparison “${parsed.data.title}”.`);
    });
  }, [guard, requireStore]);

  const deleteComparison = useCallback(async (id: string) => {
    await guard(async () => {
      await requireStore().remove("comparisons", id, "Deleted a comparison.");
    });
  }, [guard, requireStore]);

  const saveSettings = useCallback(async (next: SiteSettings) => {
    const parsed = settingsSchema.safeParse(next);
    if (!parsed.success) throw new Error(formatZodError(parsed.error));
    await guard(async () => {
      await requireStore().saveSettings(parsed.data, "Updated website settings.");
    });
  }, [guard, requireStore]);

  const saveMedia = useCallback(async (file: File) => {
    if (file.size > 12 * 1024 * 1024) {
      throw new Error("Keep uploads under 12 MB so this browser can store them.");
    }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      throw new Error("Upload an image or a video.");
    }
    const record = {
      id: `media_${crypto.randomUUID()}`,
      name: file.name || "upload",
      type: file.type || "application/octet-stream",
      size: file.size,
      createdAt: nowIso(),
      blob: file,
    };
    await guard(async () => {
      await requireStore().putMedia(record, `Uploaded “${record.name}”.`);
    });
  }, [guard, requireStore]);

  const deleteMedia = useCallback(async (id: string) => {
    const name = media.find((item) => item.id === id)?.name ?? "file";
    revokeMediaUrl(id);
    await guard(async () => {
      await requireStore().deleteMedia(id, `Removed “${name}”.`);
    });
  }, [guard, media, requireStore]);

  const readMediaBlob = useCallback(async (id: string) => {
    const record = await storeRef.current?.getMedia(id);
    return record?.blob ?? null;
  }, []);

  const exportBackup = useCallback(async () => requireStore().exportBackup(), [requireStore]);

  const importBackup = useCallback(async (raw: unknown) => {
    await guard(async () => {
      revokeAllMediaUrls();
      await requireStore().importBackup(raw);
    });
  }, [guard, requireStore]);

  const resetSample = useCallback(async () => {
    await guard(async () => {
      revokeAllMediaUrls();
      await requireStore().resetSample();
    });
  }, [guard, requireStore]);

  const publishedProjects = useMemo(
    () =>
      projects
        .filter((item) => item.published)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title)),
    [projects],
  );
  const publishedServices = useMemo(() => services.filter((item) => item.published).sort(byOrder), [services]);
  const publishedTestimonials = useMemo(
    () => testimonials.filter((item) => item.published).sort(byOrder),
    [testimonials],
  );
  const publishedFaqs = useMemo(() => faqs.filter((item) => item.published).sort(byOrder), [faqs]);
  const publishedCaseStudies = useMemo(
    () => caseStudies.filter((item) => item.published).sort(byOrder),
    [caseStudies],
  );
  const publishedComparisons = useMemo(
    () => comparisons.filter((item) => item.published).sort(byOrder),
    [comparisons],
  );

  const value: ContentValue = {
    ready,
    persistent,
    warning,
    projects,
    services,
    testimonials,
    faqs,
    caseStudies,
    statistics: [...statistics].sort(byOrder),
    inquiries,
    comparisons,
    activity: [...activity].sort((a, b) => b.at.localeCompare(a.at)),
    media: [...media].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    settings,
    publishedProjects,
    publishedServices,
    publishedTestimonials,
    publishedFaqs,
    publishedCaseStudies,
    publishedComparisons,
    saveProject,
    deleteProject,
    saveService,
    deleteService,
    saveTestimonial,
    deleteTestimonial,
    saveFaq,
    deleteFaq,
    saveCaseStudy,
    deleteCaseStudy,
    saveStatistic,
    deleteStatistic,
    saveInquiry,
    deleteInquiry,
    saveComparison,
    deleteComparison,
    saveSettings,
    saveMedia,
    deleteMedia,
    readMediaBlob,
    exportBackup,
    importBackup,
    resetSample,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within ContentProvider.");
  return context;
}
