"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="fixed bottom-5 left-5 z-40 grid size-11 place-items-center border border-line bg-studio text-ink"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
    >
      <ArrowUp size={16} />
    </button>
  );
}
