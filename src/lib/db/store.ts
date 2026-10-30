import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { createSeedSnapshot, type SeedSnapshot } from "@/data/seed";
import {
  activitySchema,
  backupSchema,
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
import { createId, nowIso } from "@/lib/utils";
import type { z } from "zod";

const DB_NAME = "tubeforgestudio";
const DB_VERSION = 1;

export type MediaRecord = MediaMeta & { blob: Blob };

export type LoadedContent = {
  projects: PortfolioProject[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  caseStudies: CaseStudy[];
  statistics: Statistic[];
  inquiries: Inquiry[];
  comparisons: ComparisonItem[];
  settings: SiteSettings;
  activity: ActivityEvent[];
  media: MediaMeta[];
  dropped: number;
};

type MetaRecord = { id: "settings"; settings: SiteSettings };

interface ForgeDB {
  projects: PortfolioProject;
  services: ServiceItem;
  testimonials: Testimonial;
  faqs: FaqItem;
  caseStudies: CaseStudy;
  statistics: Statistic;
  inquiries: Inquiry;
  comparisons: ComparisonItem;
  activity: ActivityEvent;
  media: MediaRecord;
  meta: MetaRecord;
}

type EntityName = "projects" | "services" | "testimonials" | "faqs" | "caseStudies" | "statistics" | "inquiries" | "comparisons";

const ENTITY_NAMES: EntityName[] = [
  "projects",
  "services",
  "testimonials",
  "faqs",
  "caseStudies",
  "statistics",
  "inquiries",
  "comparisons",
];

export type ContentStore = {
  load(): Promise<LoadedContent>;
  put<K extends EntityName>(store: K, value: ForgeDB[K], message: string): Promise<void>;
  remove(store: EntityName, id: string, message: string): Promise<void>;
  saveSettings(settings: SiteSettings, message: string): Promise<void>;
  getMedia(id: string): Promise<MediaRecord | null>;
  putMedia(record: MediaRecord, message: string): Promise<void>;
  deleteMedia(id: string, message: string): Promise<void>;
  exportBackup(): Promise<BackupFile>;
  importBackup(raw: unknown): Promise<void>;
  resetSample(): Promise<void>;
};

function parseList<T>(schema: z.ZodType<T>, value: unknown): { items: T[]; dropped: number } {
  if (!Array.isArray(value)) return { items: [], dropped: 0 };
  const items: T[] = [];
  let dropped = 0;
  for (const entry of value) {
    const parsed = schema.safeParse(entry);
    if (parsed.success) items.push(parsed.data);
    else dropped += 1;
  }
  return { items, dropped };
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("A media file could not be prepared for export."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string) {
  const [header, data] = dataUrl.split(",");
  if (!header || !data) throw new Error("A media file in the backup is incomplete.");
  const type = /data:(.*?);base64/.exec(header)?.[1] || "application/octet-stream";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}

function memoryFrom(seed: SeedSnapshot): LoadedContent {
  return {
    ...seed,
    inquiries: [],
    media: [],
    dropped: 0,
  };
}

function createMemoryStore(): ContentStore {
  let data = memoryFrom(createSeedSnapshot());
  const blobs = new Map<string, MediaRecord>();

  const touch = () => {
    data = { ...data };
  };

  return {
    async load() {
      return {
        ...data,
        media: [...blobs.values()].map(({ id, name, type, size, createdAt }) => ({ id, name, type, size, createdAt })),
      };
    },
    async put(store, value, message) {
      const list = data[store] as { id: string }[];
      const next = list.some((item) => item.id === value.id)
        ? list.map((item) => (item.id === value.id ? value : item))
        : [...list, value];
      data = { ...data, [store]: next, activity: [{ id: createId("act"), message, at: nowIso() }, ...data.activity].slice(0, 120) };
      touch();
    },
    async remove(store, id, message) {
      const list = (data[store] as { id: string }[]).filter((item) => item.id !== id);
      data = { ...data, [store]: list, activity: [{ id: createId("act"), message, at: nowIso() }, ...data.activity].slice(0, 120) };
    },
    async saveSettings(settings, message) {
      data = { ...data, settings, activity: [{ id: createId("act"), message, at: nowIso() }, ...data.activity].slice(0, 120) };
    },
    async getMedia(id) {
      return blobs.get(id) ?? null;
    },
    async putMedia(record, message) {
      blobs.set(record.id, record);
      data = { ...data, activity: [{ id: createId("act"), message, at: nowIso() }, ...data.activity].slice(0, 120) };
    },
    async deleteMedia(id, message) {
      blobs.delete(id);
      data = { ...data, activity: [{ id: createId("act"), message, at: nowIso() }, ...data.activity].slice(0, 120) };
    },
    async exportBackup() {
      const media = await Promise.all(
        [...blobs.values()].map(async (record) => ({
          id: record.id,
          name: record.name,
          type: record.type,
          size: record.size,
          createdAt: record.createdAt,
          dataUrl: await blobToDataUrl(record.blob),
        })),
      );
      return backupSchema.parse({
        version: 1,
        exportedAt: nowIso(),
        projects: data.projects,
        services: data.services,
        testimonials: data.testimonials,
        faqs: data.faqs,
        caseStudies: data.caseStudies,
        statistics: data.statistics,
        inquiries: data.inquiries,
        comparisons: data.comparisons,
        settings: data.settings,
        activity: data.activity,
        media,
      });
    },
    async importBackup(raw) {
      const parsed = backupSchema.safeParse(raw);
      if (!parsed.success) throw new Error(formatZodError(parsed.error));
      blobs.clear();
      for (const file of parsed.data.media) {
        blobs.set(file.id, {
          id: file.id,
          name: file.name,
          type: file.type,
          size: file.size,
          createdAt: file.createdAt,
          blob: dataUrlToBlob(file.dataUrl),
        });
      }
      data = {
        projects: parsed.data.projects,
        services: parsed.data.services,
        testimonials: parsed.data.testimonials,
        faqs: parsed.data.faqs,
        caseStudies: parsed.data.caseStudies,
        statistics: parsed.data.statistics,
        inquiries: parsed.data.inquiries,
        comparisons: parsed.data.comparisons,
        settings: parsed.data.settings,
        activity: [
          { id: createId("act"), message: "Backup restored in this browser.", at: nowIso() },
          ...parsed.data.activity,
        ].slice(0, 120),
        media: [],
        dropped: 0,
      };
    },
    async resetSample() {
      blobs.clear();
      data = memoryFrom(createSeedSnapshot());
    },
  };
}

type IDB = IDBPDatabase<ForgeSchema>;

interface ForgeSchema extends DBSchema {
  projects: { key: string; value: PortfolioProject };
  services: { key: string; value: ServiceItem };
  testimonials: { key: string; value: Testimonial };
  faqs: { key: string; value: FaqItem };
  caseStudies: { key: string; value: CaseStudy };
  statistics: { key: string; value: Statistic };
  inquiries: { key: string; value: Inquiry };
  comparisons: { key: string; value: ComparisonItem };
  activity: { key: string; value: ActivityEvent };
  media: { key: string; value: MediaRecord };
  meta: { key: string; value: MetaRecord };
}

const STORE_NAMES = [...ENTITY_NAMES, "activity", "media", "meta"] as const;

async function writeSeed(db: IDB) {
  const seed = createSeedSnapshot();
  const tx = db.transaction([...STORE_NAMES], "readwrite");
  for (const name of STORE_NAMES) tx.objectStore(name).clear();
  for (const item of seed.projects) tx.objectStore("projects").put(item);
  for (const item of seed.services) tx.objectStore("services").put(item);
  for (const item of seed.testimonials) tx.objectStore("testimonials").put(item);
  for (const item of seed.faqs) tx.objectStore("faqs").put(item);
  for (const item of seed.caseStudies) tx.objectStore("caseStudies").put(item);
  for (const item of seed.statistics) tx.objectStore("statistics").put(item);
  for (const item of seed.comparisons) tx.objectStore("comparisons").put(item);
  for (const item of seed.activity) tx.objectStore("activity").put(item);
  tx.objectStore("meta").put({ id: "settings", settings: seed.settings });
  await tx.done;
}

function createIdbStore(db: IDB): ContentStore {
  async function log(message: string) {
    await db.put("activity", { id: createId("act"), message, at: nowIso() });
    const all = await db.getAll("activity");
    if (all.length <= 120) return;
    const extra = [...all].sort((a, b) => a.at.localeCompare(b.at)).slice(0, all.length - 120);
    const tx = db.transaction("activity", "readwrite");
    for (const item of extra) tx.store.delete(item.id);
    await tx.done;
  }

  return {
    async load() {
      const [projects, services, testimonials, faqs, caseStudies, statistics, inquiries, comparisons, activity, media, meta] =
        await Promise.all([
          db.getAll("projects"),
          db.getAll("services"),
          db.getAll("testimonials"),
          db.getAll("faqs"),
          db.getAll("caseStudies"),
          db.getAll("statistics"),
          db.getAll("inquiries"),
          db.getAll("comparisons"),
          db.getAll("activity"),
          db.getAll("media"),
          db.get("meta", "settings"),
        ]);
      const parsed = {
        projects: parseList(projectSchema, projects),
        services: parseList(serviceSchema, services),
        testimonials: parseList(testimonialSchema, testimonials),
        faqs: parseList(faqSchema, faqs),
        caseStudies: parseList(caseStudySchema, caseStudies),
        statistics: parseList(statisticSchema, statistics),
        inquiries: parseList(inquirySchema, inquiries),
        comparisons: parseList(comparisonSchema, comparisons),
        activity: parseList(activitySchema, activity),
      };
      const settings = settingsSchema.safeParse(meta?.settings);
      const dropped = Object.values(parsed).reduce((sum, entry) => sum + entry.dropped, 0) + (settings.success ? 0 : 1);
      return {
        projects: parsed.projects.items,
        services: parsed.services.items,
        testimonials: parsed.testimonials.items,
        faqs: parsed.faqs.items,
        caseStudies: parsed.caseStudies.items,
        statistics: parsed.statistics.items,
        inquiries: parsed.inquiries.items,
        comparisons: parsed.comparisons.items,
        activity: parsed.activity.items,
        settings: settings.success ? settings.data : createSeedSnapshot().settings,
        media: media.map(({ id, name, type, size, createdAt }) => ({ id, name, type, size, createdAt })),
        dropped,
      };
    },
    async put(store, value, message) {
      await db.put(store, value);
      await log(message);
    },
    async remove(store, id, message) {
      await db.delete(store, id);
      await log(message);
    },
    async saveSettings(settings, message) {
      await db.put("meta", { id: "settings", settings });
      await log(message);
    },
    async getMedia(id) {
      return (await db.get("media", id)) ?? null;
    },
    async putMedia(record, message) {
      await db.put("media", record);
      await log(message);
    },
    async deleteMedia(id, message) {
      await db.delete("media", id);
      await log(message);
    },
    async exportBackup() {
      const loaded = await this.load();
      const records = await db.getAll("media");
      const media = await Promise.all(
        records.map(async (record) => ({
          id: record.id,
          name: record.name,
          type: record.type,
          size: record.size,
          createdAt: record.createdAt,
          dataUrl: await blobToDataUrl(record.blob),
        })),
      );
      return backupSchema.parse({
        version: 1,
        exportedAt: nowIso(),
        projects: loaded.projects,
        services: loaded.services,
        testimonials: loaded.testimonials,
        faqs: loaded.faqs,
        caseStudies: loaded.caseStudies,
        statistics: loaded.statistics,
        inquiries: loaded.inquiries,
        comparisons: loaded.comparisons,
        settings: loaded.settings,
        activity: loaded.activity,
        media,
      });
    },
    async importBackup(raw) {
      const parsed = backupSchema.safeParse(raw);
      if (!parsed.success) throw new Error(`The backup could not be read. ${formatZodError(parsed.error)}`);
      const tx = db.transaction([...STORE_NAMES], "readwrite");
      for (const name of STORE_NAMES) tx.objectStore(name).clear();
      for (const item of parsed.data.projects) tx.objectStore("projects").put(item);
      for (const item of parsed.data.services) tx.objectStore("services").put(item);
      for (const item of parsed.data.testimonials) tx.objectStore("testimonials").put(item);
      for (const item of parsed.data.faqs) tx.objectStore("faqs").put(item);
      for (const item of parsed.data.caseStudies) tx.objectStore("caseStudies").put(item);
      for (const item of parsed.data.statistics) tx.objectStore("statistics").put(item);
      for (const item of parsed.data.inquiries) tx.objectStore("inquiries").put(item);
      for (const item of parsed.data.comparisons) tx.objectStore("comparisons").put(item);
      for (const item of parsed.data.activity) tx.objectStore("activity").put(item);
      for (const file of parsed.data.media) {
        tx.objectStore("media").put({
          id: file.id,
          name: file.name,
          type: file.type,
          size: file.size,
          createdAt: file.createdAt,
          blob: dataUrlToBlob(file.dataUrl),
        });
      }
      tx.objectStore("meta").put({ id: "settings", settings: parsed.data.settings });
      tx.objectStore("activity").put({
        id: createId("act"),
        message: "Backup restored in this browser.",
        at: nowIso(),
      });
      await tx.done;
    },
    async resetSample() {
      await writeSeed(db);
    },
  };
}

export async function openContentStore(): Promise<{ store: ContentStore; persistent: boolean }> {
  try {
    if (typeof indexedDB === "undefined") throw new Error("IndexedDB is not available.");
    const db = await openDB<ForgeSchema>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        for (const name of STORE_NAMES) {
          if (!database.objectStoreNames.contains(name)) {
            database.createObjectStore(name, { keyPath: "id" });
          }
        }
      },
    });
    const existing = await db.get("meta", "settings");
    if (!existing) await writeSeed(db);
    return { store: createIdbStore(db), persistent: true };
  } catch {
    return { store: createMemoryStore(), persistent: false };
  }
}
