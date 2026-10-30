"use client";

import { useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { Poster } from "@/components/portfolio/poster";
import { useMediaUrl } from "@/hooks/use-media-url";

export function CompareSlider({
  title,
  beforeMotif,
  afterMotif,
  beforeMediaId,
  afterMediaId,
}: {
  title: string;
  beforeMotif: string;
  afterMotif: string;
  beforeMediaId?: string;
  afterMediaId?: string;
}) {
  const beforeUrl = useMediaUrl(beforeMediaId);
  const afterUrl = useMediaUrl(afterMediaId);
  const [position, setPosition] = useState(56);
  const drag = useRef(false);
  const frame = useRef<HTMLDivElement>(null);

  const update = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  return (
    <div>
      <div
        ref={frame}
        className="relative aspect-video touch-none select-none overflow-hidden border border-line bg-black"
        onPointerDown={(event) => {
          drag.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          update(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          update(event.clientX);
        }}
        onPointerUp={() => {
          drag.current = false;
        }}
        onPointerCancel={() => {
          drag.current = false;
        }}
      >
        <Poster motif={afterMotif} title={title} badge="After" mediaUrl={afterUrl} className="absolute inset-0 h-full" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Poster motif={beforeMotif} title={title} badge="Before" treatment="flat" mediaUrl={beforeUrl} className="h-full" />
        </div>
        <button
          type="button"
          role="slider"
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)} percent before`}
          className="absolute inset-y-0 z-10 w-11 -translate-x-1/2"
          style={{ left: `${position}%` }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              setPosition((value) => Math.max(0, value - 4));
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              setPosition((value) => Math.min(100, value + 4));
            }
          }}
        >
          <span className="mx-auto block h-full w-px bg-white" />
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center border border-white bg-studio text-ink">
            <ChevronsLeftRight size={16} />
          </span>
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="border border-line px-3 py-2 text-xs uppercase tracking-wider" onClick={() => setPosition(100)}>
          Show before
        </button>
        <button type="button" className="border border-line px-3 py-2 text-xs uppercase tracking-wider" onClick={() => setPosition(0)}>
          Show after
        </button>
      </div>
    </div>
  );
}
