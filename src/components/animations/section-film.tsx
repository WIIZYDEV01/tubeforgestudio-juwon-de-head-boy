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
    const gap = Math.max(name === "signal" ? 46 : 28, h / 22);
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
    const span = Math.max(420, h / 4);
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
    const cols = 16;
    const rows = 9;
    const gapX = w / cols;
    const gapY = h / rows;
    for (let col = 0; col <= cols; col += 1) {
      for (let row = 0; row <= rows; row += 1) {
        const wave = 0.5 + 0.5 * Math.sin(t * 1.6 - col * 0.35 - row * 0.35);
        ctx.fillStyle = `rgba(${ACCENT}, ${0.15 + wave * 0.7})`;
        ctx.beginPath();
        ctx.arc(col * gapX, row * gapY, gapX * (0.04 + wave * 0.05), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  if (name === "salt" || name === "still") {
    ctx.strokeStyle = `rgba(${ACCENT}, 0.55)`;
    const span = Math.max(240, h / 6);
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

  paintCrew(ctx, w, h, t);
}

function paintCrew(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const ground = h - 6;
  for (let i = 0; i < 5; i += 1) {
    const speed = 28 + (i % 3) * 10;
    const x = ((t * speed + i * 210) % (w + 160)) - 80;
    drawPerson(ctx, x, ground, 1.05, t * 5.2 + i, i % 2 === 0);
  }
}

function drawPerson(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, phase: number, lead: boolean) {
  const swing = Math.sin(phase) * 8 * scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = lead ? "rgba(255,107,36,0.78)" : "rgba(245,245,245,0.42)";
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, -50, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-8, -42);
  ctx.lineTo(8, -42);
  ctx.lineTo(6, -22);
  ctx.lineTo(-6, -22);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-2, -36);
  ctx.lineTo(-14 - swing * 0.15, -24 + swing * 0.2);
  ctx.moveTo(2, -36);
  ctx.lineTo(14 + swing * 0.15, -24 - swing * 0.2);
  ctx.moveTo(-1, -22);
  ctx.lineTo(-8 + swing, 0);
  ctx.moveTo(1, -22);
  ctx.lineTo(8 - swing, 0);
  ctx.stroke();
  ctx.restore();
}

type FilmJob = { ratio: number; paint: (time: number) => void };

const jobs = new Map<number, FilmJob>();
let jobSeq = 0;
let rafId = 0;
let lastPaint = 0;

function wakeFilms() {
  if (rafId || document.hidden) return;
  rafId = window.requestAnimationFrame(pumpFilms);
}

function pumpFilms(time: number) {
  rafId = 0;
  if (document.hidden) return;
  let active: FilmJob | undefined;
  for (const job of jobs.values()) {
    if (job.ratio <= 0) continue;
    if (!active || job.ratio > active.ratio) active = job;
  }
  if (!active) return;
  if (time - lastPaint > 100) {
    lastPaint = time;
    active.paint(time);
  }
  rafId = window.requestAnimationFrame(pumpFilms);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) wakeFilms();
  });
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
    const host = canvas.parentElement;
    const id = ++jobSeq;
    let width = 1;
    let height = 1;
    let shown = false;

    const measure = () => {
      const rect = (fixed ? canvas : host)?.getBoundingClientRect();
      width = Math.max(1, Math.floor(fixed ? window.innerWidth : rect?.width || 1));
      height = Math.max(1, Math.floor(fixed ? window.innerHeight : rect?.height || 1));
      const scale = Math.min(1, 720 / width, 405 / height);
      const nextWidth = Math.max(1, Math.floor(width * scale));
      const nextHeight = Math.max(1, Math.floor(height * scale));
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
    };

    const paintFrame = (time: number) => {
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      paint(ctx, width, height, time, name);
    };

    jobs.set(id, { ratio: 0, paint: paintFrame });

    const show = (ratio: number) => {
      const job = jobs.get(id);
      if (!job) return;
      job.ratio = ratio;
      if (ratio > 0.05) {
        if (!shown) {
          shown = true;
          measure();
          paintFrame(performance.now());
        }
        if (!reduce) wakeFilms();
      } else {
        shown = false;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        show(entry?.isIntersecting ? entry.intersectionRatio : 0);
      },
      { threshold: [0, 0.05, 0.25, 0.5, 0.8] },
    );
    const watched = fixed ? canvas : host;
    if (watched) observer.observe(watched);

    const onResize = () => {
      measure();
      if (shown || reduce) paintFrame(lastPaint);
    };
    const resize = new ResizeObserver(onResize);
    if (host) resize.observe(host);
    if (fixed) window.addEventListener("resize", onResize);
    measure();
    if (reduce || fixed) {
      show(1);
      if (reduce) paintFrame(0);
    }

    return () => {
      jobs.delete(id);
      observer.disconnect();
      resize.disconnect();
      if (fixed) window.removeEventListener("resize", onResize);
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
