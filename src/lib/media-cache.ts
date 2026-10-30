const cache = new Map<string, string>();

export function rememberMediaUrl(id: string, url: string) {
  cache.set(id, url);
  return url;
}

export function cachedMediaUrl(id: string) {
  return cache.get(id) ?? null;
}

export function revokeMediaUrl(id: string) {
  const url = cache.get(id);
  if (url) URL.revokeObjectURL(url);
  cache.delete(id);
}

export function revokeAllMediaUrls() {
  for (const url of cache.values()) URL.revokeObjectURL(url);
  cache.clear();
}
