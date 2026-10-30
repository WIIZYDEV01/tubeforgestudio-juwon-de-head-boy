import { useId } from "react";
import { getMotif, type MotifShape } from "@/data/motifs";
import { cn } from "@/lib/utils";

function Shape({ shape }: { shape: MotifShape }) {
  const opacity = shape.opacity ?? 1;
  if (shape.kind === "rect") {
    return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.width} opacity={opacity} />;
  }
  if (shape.kind === "circle") {
    return (
      <circle
        cx={shape.cx}
        cy={shape.cy}
        r={shape.r}
        fill={shape.fill ?? "none"}
        stroke={shape.stroke}
        strokeWidth={shape.width}
        opacity={opacity}
      />
    );
  }
  if (shape.kind === "ellipse") {
    return (
      <ellipse
        cx={shape.cx}
        cy={shape.cy}
        rx={shape.rx}
        ry={shape.ry}
        fill={shape.fill ?? "none"}
        stroke={shape.stroke}
        strokeWidth={shape.width}
        opacity={opacity}
      />
    );
  }
  if (shape.kind === "line") {
    return (
      <line
        x1={shape.x1}
        y1={shape.y1}
        x2={shape.x2}
        y2={shape.y2}
        stroke={shape.stroke}
        strokeWidth={shape.width ?? 2}
        opacity={opacity}
      />
    );
  }
  return (
    <path
      d={shape.d}
      fill={shape.fill ?? "none"}
      stroke={shape.stroke}
      strokeWidth={shape.width}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={opacity}
    />
  );
}

export function Poster({
  motif = "forge",
  title,
  kicker,
  badge,
  treatment = "graded",
  mediaUrl,
  className,
}: {
  motif?: string;
  title: string;
  kicker?: string;
  badge?: string;
  treatment?: "graded" | "flat";
  mediaUrl?: string | null;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const art = getMotif(motif);
  const flat = treatment === "flat";

  return (
    <div className={cn("relative aspect-video overflow-hidden bg-black", className)}>
      {mediaUrl ? (
        // Uploaded studio art. The title is rendered as text beside this frame.
        <img src={mediaUrl} alt="" className={cn("absolute inset-0 h-full w-full object-cover", flat && "saturate-0 contrast-75")} />
      ) : (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={cn("absolute inset-0 h-full w-full", flat && "saturate-[0.15] contrast-75")} aria-hidden="true">
          <defs>
            <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={art.from} />
              <stop offset="100%" stopColor={art.to} />
            </linearGradient>
            <radialGradient id={`${uid}-vig`} cx="50%" cy="40%" r="75%">
              <stop offset="55%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.62" />
            </radialGradient>
            <filter id={`${uid}-grain`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.28" />
              </feComponentTransfer>
            </filter>
          </defs>
          <rect width="1600" height="900" fill={`url(#${uid}-bg)`} />
          {art.shapes.map((shape, index) => (
            <Shape key={index} shape={shape} />
          ))}
          <rect width="1600" height="900" fill={`url(#${uid}-vig)`} />
          <rect width="1600" height="900" filter={`url(#${uid}-grain)`} opacity="0.45" />
        </svg>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      {kicker ? (
        <p className="absolute left-3 top-3 max-w-[60%] font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">{kicker}</p>
      ) : null}
      {badge ? (
        <p className="absolute right-3 top-3 border border-white/40 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
          {badge}
        </p>
      ) : null}
      <p className="absolute bottom-3 left-3 right-12 line-clamp-2 font-display text-[clamp(1rem,2.2vw,1.7rem)] uppercase leading-[0.9] text-white">
        {title}
      </p>
    </div>
  );
}
