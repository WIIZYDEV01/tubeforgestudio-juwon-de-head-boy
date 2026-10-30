"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";

const KEY = "tfs-favorites";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const { error } = useToast();
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(read());
    setReady(true);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
        setIds(next);
      } catch {
        error("This browser did not store the favorite.");
      }
    },
    [error, ids],
  );

  return { ids, ready, has, toggle };
}
