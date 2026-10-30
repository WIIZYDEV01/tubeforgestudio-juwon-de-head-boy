export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function createId(prefix: string) {
  const rand =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${rand}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "item";
}

export function uniqueSlug(
  preferred: string,
  title: string,
  existing: { id: string; slug: string }[],
  currentId?: string,
) {
  const base = slugify(preferred || title);
  const taken = new Set(existing.filter((item) => item.id !== currentId).map((item) => item.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function linesToList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToLines(list: string[]) {
  return list.join("\n");
}

export function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function explainStorageError(error: unknown) {
  if (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  ) {
    return "This browser is out of storage space. Export a backup, then remove some uploaded media.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "The change could not be saved in this browser.";
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function phoneLabel(value: string) {
  const digits = phoneDigits(value);
  return digits ? `+${digits}` : "";
}

export function telHref(value: string) {
  const digits = phoneDigits(value);
  if (digits.length < 8) return null;
  return `tel:+${digits}`;
}

export function whatsappHref(value: string) {
  const digits = phoneDigits(value);
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}`;
}
