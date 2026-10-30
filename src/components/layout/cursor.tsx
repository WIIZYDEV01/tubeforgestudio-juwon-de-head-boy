"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    document.body.dataset.cursor = "on";
    const node = dot.current;
    const onMove = (event: PointerEvent) => {
      if (!node) return;
      node.style.transform = `translate3d(${event.clientX - 6}px, ${event.clientY - 6}px, 0)`;
      node.style.opacity = "1";
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      delete document.body.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] size-3 rounded-full bg-accent opacity-0"
    />
  );
}
