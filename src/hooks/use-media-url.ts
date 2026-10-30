"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/hooks/content-provider";
import { cachedMediaUrl, rememberMediaUrl } from "@/lib/media-cache";

export function useMediaUrl(id?: string) {
  const { readMediaBlob, ready } = useContent();
  const [url, setUrl] = useState<string | null>(id ? cachedMediaUrl(id) : null);

  useEffect(() => {
    if (!id) {
      setUrl(null);
      return;
    }
    const cached = cachedMediaUrl(id);
    if (cached) {
      setUrl(cached);
      return;
    }
    if (!ready) return;
    let active = true;
    void readMediaBlob(id).then((blob) => {
      if (!active) return;
      if (!blob) {
        setUrl(null);
        return;
      }
      setUrl(rememberMediaUrl(id, URL.createObjectURL(blob)));
    });
    return () => {
      active = false;
    };
  }, [id, ready, readMediaBlob]);

  return url;
}
