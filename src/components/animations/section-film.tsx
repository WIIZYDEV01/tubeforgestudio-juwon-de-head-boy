"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FILM_NAMES = [
  "ember",
  "ledger",
  "dusk",
  "scan",
  "orbit",
  "split",
  "pulse",
  "salt",
  "grain",
  "signal",
  "forge",
  "reels",
  "atlas",
  "still",
  "harbor",
  "ink",
  "empty",
  "drift",
] as const;

export type FilmName = (typeof FILM_NAMES)[number];

const ACCENT = "255, 107, 36";

function paint(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, name: FilmName) {
  const t = time / 1000;
  ctx.clearRect(0, 0, w, h);

  if (name === "ember" || name === "ink" || name === "empty") {
    const spots = name === "empty" ? 1 : 3;
    for (let i = 0; i < spots; i += 1) {
      const x = w * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * (0.15 + i * 0.07) + i)));
      const y = h * (0.25 + 0.5 * (0.5 + 0.5 * Math.cos(t * (0.12 + i * 0.05) + i * 1.7)));
      const radius = Math.max(w, h) * (name === "ink" ? 0.28 : 0.42);
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, `rgba(${ACCENT}, ${name === "empty" ? 0.16 : 0.22})`);
      glow.addColorStop(1, `rgba(${ACCENT}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }
  }

  if (name === "ledger" || name === "signal") {
    ctx.strokeStyle = `rgba(${ACCENT}, 0.28)`;
    const gap = name === "signal" ? 46 : 28;
    const travel = (t * (name === "signal" ? 36 : 18)) % gap;
    for (let y = -gap + travel; y < h + gap; y += gap) {
      ctx.globalAlpha = name === "signal" && Math.floor(y / gap) % 4 !== 0 ? 0.15 : 0.7;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + Math.sin(t + y * 0.01) * (name === "signal" ? 8 : 0));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (name === "dusk" || name === "harbor") {
    const y = h * (0.15 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.2)));
    const band = ctx.createLinearGradient(0, y - h * 0.2, 0, y + h * 0.25);
    band.addColorStop(0, "rgba(255,107,36,0)");
    band.addColorStop(0.5, name === "harbor" ? "rgba(245,245,245,0.06)" : "rgba(255,107,36,0.16)");
    band.addColorStop(1, "rgba(255,107,36,0)");
    ctx.fillStyle = band;
    ctx.fillRect(0, 0, w, h);
    if (name === "harbor") {
      ctx.strokeStyle = "rgba(255,107,36,0.25)";
      for (let i = 0; i < 5; i += 1) {
        const x = ((i + 1) / 6) * w + Math.sin(t * 0.3 + i) * 12;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    }
  }

  if (name === "scan" || name === "split") {
    const x = ((t * 0.08) % 1) * w;
    ctx.fillStyle = "rgba(255,107,36,0.14)";
    ctx.fillRect(x, 0, name === "split" ? w * 0.5 : 2, h);
    ctx.strokeStyle = "rgba(245,245,245,0.08)";
    for (let tick = 0; tick < w; tick += 36) {
      ctx.beginPath();
      ctx.moveTo(tick, h * 0.5);
      ctx.lineTo(tick, h * 0.5 + (tick % 72 === 0 ? 18 : 8));
      ctx.stroke();
    }
  }

  if (name === "orbit" || name === "atlas") {
    ctx.strokeStyle = `rgba(${ACCENT}, 0.7)`;
    ctx.lineWidth = 1.25;
    const span = 420;
    const clusters = Math.max(1, Math.ceil(h / span));
    const rings = name === "atlas" ? 4 : 3;
    for (let cluster = 0; cluster < clusters; cluster += 1) {
      const cy = (cluster + 0.45) * span;
      for (let i = 0; i < rings; i += 1) {
        ctx.beginPath();
        ctx.ellipse(w * (name === "atlas" ? 0.62 : 0.72), cy, 90 + i * 70, 36 + i * 22, t * (name === "atlas" ? 0.08 : 0.18) + i, 0, Math.PI * 1.7);
        ctx.stroke();
      }
    }
  }

  if (name === "reels") {
    const gap = 72;
    const travel = (t * 24) % gap;
    ctx.fillStyle = "rgba(255,107,36,0.55)";
    for (let x = -gap + travel; x < w + gap; x += gap) ctx.fillRect(x, 0, 2, h);
  }

  if (name === "pulse") {
    const gap = 56;
    for (let x = 0; x < w + gap; x += gap) {
      for (let y = 0; y < h + gap; y += gap) {
        const wave = 0.5 + 0.5 * Math.sin(t * 1.6 - x * 0.02 - y * 0.02);
        ctx.fillStyle = `rgba(${ACCENT}, ${0.15 + wave * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + wave * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  if (name === "salt" || name === "still") {
    ctx.strokeStyle = `rgba(${ACCENT}, 0.55)`;
    const span = 240;
    const bands = Math.max(1, Math.ceil(h / span));
    for (let band = 0; band < bands; band += 1) {
      const base = (band + 0.5) * span;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = base + Math.sin(x * 0.012 + t * (name === "still" ? 0.45 : 0.9) + band) * 28;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  if (name === "drift") {
    const x = ((t * 0.06) % 1) * (w + w * 0.4) - w * 0.2;
    const wash = ctx.createLinearGradient(x, 0, x + w * 0.35, h);
    wash.addColorStop(0, "rgba(255,107,36,0)");
    wash.addColorStop(0.5, "rgba(255,107,36,0.2)");
    wash.addColorStop(1, "rgba(245,245,245,0)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w, h);
  }

  if (name === "grain" || name === "forge") {
    const count = name === "forge" ? 48 : 70;
    for (let i = 0; i < count; i += 1) {
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const nx = seed - Math.floor(seed);
      const ny = Math.abs(Math.sin(i * 78.233));
      const y = name === "forge" ? ((ny * h - t * (20 + (i % 5) * 8)) % h + h) % h : ny * h;
      const x = (nx * w + (name === "grain" ? Math.sin(t + i) * 6 : 0) + w) % w;
      ctx.fillStyle = `rgba(${i % 4 === 0 ? ACCENT : "245,245,245"}, ${name === "forge" ? 0.55 : 0.28})`;
      ctx.fillRect(x, y, name === "forge" ? 2 : 1.5, name === "forge" ? 6 : 1.5);
    }
  }
}

export function SectionFilm({
  name,
  quiet = false,
  fixed = false,
}: {
  name: FilmName;
  quiet?: boolean;
  fixed?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let frame = 0;
    let visible = true;
    const host = canvas.parentElement;

    const draw = (time: number) => {
      const rect = (fixed ? canvas : host)?.getBoundingClientRect();
      const width = Math.max(1, Math.floor(fixed ? window.innerWidth : rect?.width || 1));
      const height = Math.max(1, Math.floor(fixed ? window.innerHeight : rect?.height || 1));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextWidth = Math.floor(width * dpr);
      const nextHeight = Math.floor(height * dpr);
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(ctx, width, height, time, name);
    };

    const loop = (time: number) => {
      if (visible) draw(time);
      frame = window.requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    if (host && !fixed) observer.observe(host);
    if (reduce) {
      draw(0);
      return () => observer.disconnect();
    }
    frame = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [fixed, name, reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none h-full w-full", fixed ? "fixed inset-0 z-0" : "absolute inset-0", quiet && "opacity-50")}
    />
  );
}

export function filmForAdmin(pathname: string): FilmName {
  if (pathname.startsWith("/admin/portfolio")) return "reels";
  if (pathname.startsWith("/admin/services")) return "orbit";
  if (pathname.startsWith("/admin/testimonials")) return "grain";
  if (pathname.startsWith("/admin/faqs")) return "signal";
  if (pathname.startsWith("/admin/case-studies")) return "atlas";
  if (pathname.startsWith("/admin/comparisons")) return "split";
  if (pathname.startsWith("/admin/inquiries")) return "forge";
  if (pathname.startsWith("/admin/statistics")) return "ledger";
  if (pathname.startsWith("/admin/media")) return "scan";
  if (pathname.startsWith("/admin/settings")) return "ink";
  return "ember";
}
