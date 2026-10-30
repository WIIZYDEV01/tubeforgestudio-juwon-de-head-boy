"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBodyLock, useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  className,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  useBodyLock(open);
  useFocusTrap(ref, open && mounted);

  useEffect(() => setMounted(true), []);
  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/75 p-4" onMouseDown={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "mx-auto my-6 w-full max-w-3xl border border-line bg-studio-2 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-7",
          className,
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="font-display text-3xl uppercase leading-none tracking-tight">
              {title}
            </h2>
            {description ? <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{description}</p> : null}
          </div>
          <button type="button" data-close="true" className="grid size-11 place-items-center border border-line" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
