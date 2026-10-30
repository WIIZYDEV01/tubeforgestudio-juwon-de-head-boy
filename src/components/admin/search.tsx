"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SearchContext = createContext<{ query: string; setQuery: (value: string) => void } | null>(null);

export function AdminSearchProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  useEffect(() => setQuery(""), [pathname]);
  return <SearchContext.Provider value={{ query, setQuery }}>{children}</SearchContext.Provider>;
}

export function useAdminQuery() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("Search is only available in the studio desk.");
  return context;
}
