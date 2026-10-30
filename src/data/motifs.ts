export type MotifShape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill: string; stroke?: string; width?: number; opacity?: number }
  | {
      kind: "circle";
      cx: number;
      cy: number;
      r: number;
      fill?: string;
      stroke?: string;
      width?: number;
      opacity?: number;
    }
  | {
      kind: "ellipse";
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      fill?: string;
      stroke?: string;
      width?: number;
      opacity?: number;
    }
  | { kind: "path"; d: string; fill?: string; stroke?: string; width?: number; opacity?: number }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; width?: number; opacity?: number };

export type Motif = {
  id: string;
  label: string;
  from: string;
  to: string;
  ink: string;
  shapes: MotifShape[];
};

const line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  width = 2,
  opacity = 1,
): MotifShape => ({ kind: "line", x1, y1, x2, y2, stroke, width, opacity });

export const motifs: Motif[] = [
  {
    id: "copper",
    label: "Copper",
    from: "#1a0d0a",
    to: "#3d1c12",
    ink: "#ffe1d2",
    shapes: [
      { kind: "path", d: "M0 0 L760 0 L0 560 Z", fill: "#ff6b24", opacity: 0.28 },
      { kind: "circle", cx: 1140, cy: 440, r: 270, fill: "#7a341c" },
      { kind: "circle", cx: 1140, cy: 440, r: 188, fill: "none", stroke: "#f0c2a4", width: 3 },
      { kind: "circle", cx: 1140, cy: 440, r: 78, fill: "#f3d2bf" },
      { kind: "rect", x: 96, y: 150, w: 300, h: 16, fill: "#f6efe9" },
      { kind: "rect", x: 96, y: 186, w: 180, h: 8, fill: "#f6efe9", opacity: 0.45 },
    ],
  },
  {
    id: "atlas",
    label: "Atlas",
    from: "#10160f",
    to: "#24321c",
    ink: "#e7f2d8",
    shapes: [
      { kind: "circle", cx: 1040, cy: 450, r: 310, fill: "none", stroke: "#d5e2b8", width: 2 },
      { kind: "circle", cx: 1040, cy: 450, r: 200, fill: "none", stroke: "#d5e2b8", width: 1.5, opacity: 0.7 },
      { kind: "circle", cx: 1040, cy: 450, r: 64, fill: "#d5e2b8" },
      line(1040, 140, 1040, 760, "#d5e2b8", 1.5, 0.8),
      line(720, 450, 1360, 450, "#d5e2b8", 1.5, 0.8),
      {
        kind: "path",
        d: "M760 450 Q1040 230 1320 450 Q1040 670 760 450 Z",
        fill: "none",
        stroke: "#d5e2b8",
        width: 1.5,
        opacity: 0.75,
      },
      { kind: "circle", cx: 860, cy: 380, r: 8, fill: "#ff6b24" },
      { kind: "circle", cx: 1180, cy: 520, r: 8, fill: "#ff6b24" },
      { kind: "rect", x: 90, y: 150, w: 220, h: 12, fill: "#e7f2d8" },
    ],
  },
  {
    id: "salt",
    label: "Salt",
    from: "#141210",
    to: "#3a342c",
    ink: "#f4efe6",
    shapes: [
      { kind: "rect", x: 0, y: 0, w: 1600, h: 150, fill: "#2a241c" },
      { kind: "rect", x: 0, y: 170, w: 1600, h: 130, fill: "#d9d0c2", opacity: 0.85 },
      { kind: "rect", x: 0, y: 320, w: 1600, h: 90, fill: "#8a8174" },
      { kind: "rect", x: 0, y: 430, w: 1600, h: 150, fill: "#efe8dc" },
      { kind: "rect", x: 0, y: 600, w: 1600, h: 70, fill: "#5c5348" },
      { kind: "rect", x: 0, y: 690, w: 1600, h: 210, fill: "#1b1814" },
      { kind: "rect", x: 250, y: 0, w: 18, h: 900, fill: "#ff6b24" },
    ],
  },
  {
    id: "night",
    label: "Night",
    from: "#07070f",
    to: "#1a1730",
    ink: "#f6efe4",
    shapes: [
      { kind: "circle", cx: 1220, cy: 250, r: 150, fill: "#f4e2c4" },
      { kind: "circle", cx: 1140, cy: 220, r: 128, fill: "#07070f" },
      { kind: "rect", x: 0, y: 700, w: 1600, h: 200, fill: "#05050c" },
      { kind: "rect", x: 120, y: 180, w: 36, h: 48, fill: "#f4e2c4", opacity: 0.85 },
      { kind: "rect", x: 180, y: 180, w: 36, h: 48, fill: "#ff6b24" },
      { kind: "rect", x: 240, y: 180, w: 36, h: 48, fill: "#f4e2c4", opacity: 0.35 },
      { kind: "rect", x: 120, y: 260, w: 36, h: 48, fill: "#f4e2c4", opacity: 0.4 },
      { kind: "rect", x: 180, y: 260, w: 36, h: 48, fill: "#f4e2c4", opacity: 0.8 },
      { kind: "rect", x: 240, y: 260, w: 36, h: 48, fill: "#ffb25a" },
      { kind: "rect", x: 120, y: 340, w: 36, h: 48, fill: "#ff6b24", opacity: 0.8 },
      { kind: "rect", x: 180, y: 340, w: 36, h: 48, fill: "#f4e2c4", opacity: 0.25 },
      { kind: "rect", x: 240, y: 340, w: 36, h: 48, fill: "#f4e2c4", opacity: 0.7 },
      { kind: "rect", x: 360, y: 220, w: 70, h: 420, fill: "#10101a" },
    ],
  },
  {
    id: "circuit",
    label: "Circuit",
    from: "#07110d",
    to: "#123028",
    ink: "#d9ffe9",
    shapes: [
      line(80, 220, 520, 220, "#9dffc8", 3),
      line(520, 220, 520, 520, "#9dffc8", 3),
      line(520, 520, 980, 520, "#9dffc8", 3),
      line(980, 180, 980, 700, "#9dffc8", 3),
      line(980, 360, 1400, 360, "#ff6b24", 3),
      line(240, 220, 240, 640, "#9dffc8", 2, 0.7),
      line(240, 640, 760, 640, "#9dffc8", 2, 0.7),
      { kind: "circle", cx: 520, cy: 220, r: 14, fill: "#d9ffe9" },
      { kind: "circle", cx: 520, cy: 520, r: 14, fill: "#d9ffe9" },
      { kind: "circle", cx: 980, cy: 360, r: 18, fill: "#ff6b24" },
      { kind: "circle", cx: 1400, cy: 360, r: 14, fill: "#d9ffe9" },
      { kind: "rect", x: 80, y: 120, w: 180, h: 10, fill: "#d9ffe9" },
    ],
  },
  {
    id: "harbor",
    label: "Harbor",
    from: "#0b1520",
    to: "#16344a",
    ink: "#e5f3fb",
    shapes: [
      { kind: "rect", x: 0, y: 500, w: 1600, h: 400, fill: "#0c2433" },
      line(0, 500, 1600, 500, "#ffb088", 3),
      { kind: "circle", cx: 1180, cy: 430, r: 70, fill: "#ffb088" },
      { kind: "path", d: "M280 500 L360 250 L440 500 Z", fill: "#e5f3fb" },
      { kind: "path", d: "M430 500 L520 310 L610 500 Z", fill: "#9ec4d6" },
      { kind: "rect", x: 250, y: 500, w: 380, h: 16, fill: "#071018" },
      { kind: "path", d: "M280 560 L1600 620 L1600 900 L0 900 L0 640 Z", fill: "#08202c", opacity: 0.9 },
    ],
  },
  {
    id: "glass",
    label: "Glass",
    from: "#101014",
    to: "#2a2c34",
    ink: "#f5f5f5",
    shapes: [
      { kind: "path", d: "M180 80 L760 80 L620 820 L40 820 Z", fill: "#3a3d48", opacity: 0.9 },
      { kind: "path", d: "M700 40 L1280 160 L1160 860 L560 720 Z", fill: "#f5f5f5", opacity: 0.14 },
      { kind: "path", d: "M1040 60 L1520 60 L1520 820 L1180 820 Z", fill: "#ff6b24", opacity: 0.8 },
      line(180, 80, 40, 820, "#f5f5f5", 2, 0.7),
      line(760, 80, 620, 820, "#f5f5f5", 2, 0.45),
    ],
  },
  {
    id: "ledger",
    label: "Ledger",
    from: "#12140f",
    to: "#24281e",
    ink: "#f3f0e6",
    shapes: [
      { kind: "rect", x: 0, y: 0, w: 200, h: 900, fill: "#1a140f" },
      { kind: "rect", x: 188, y: 0, w: 10, h: 900, fill: "#ff6b24" },
      line(280, 160, 1460, 160, "#d9d3c4", 2, 0.35),
      line(280, 250, 1460, 250, "#d9d3c4", 2, 0.35),
      line(280, 340, 1460, 340, "#d9d3c4", 2, 0.35),
      line(280, 430, 1460, 430, "#d9d3c4", 2, 0.35),
      line(280, 520, 1460, 520, "#d9d3c4", 2, 0.35),
      line(280, 610, 1460, 610, "#d9d3c4", 2, 0.35),
      line(280, 700, 1460, 700, "#d9d3c4", 2, 0.35),
      { kind: "rect", x: 280, y: 200, w: 420, h: 28, fill: "#f3f0e6" },
      { kind: "rect", x: 280, y: 470, w: 260, h: 18, fill: "#ff6b24" },
    ],
  },
  {
    id: "forge",
    label: "Forge",
    from: "#140c0a",
    to: "#3a160f",
    ink: "#ffe8dc",
    shapes: [
      { kind: "path", d: "M0 900 L620 40 L860 40 L220 900 Z", fill: "#2a120e" },
      { kind: "path", d: "M760 900 L1180 120 L1600 120 L1600 900 Z", fill: "#ff6b24" },
      { kind: "circle", cx: 1280, cy: 360, r: 86, fill: "#fff1ea" },
      { kind: "rect", x: 80, y: 140, w: 240, h: 14, fill: "#fff1ea" },
    ],
  },
  {
    id: "signal",
    label: "Signal",
    from: "#0c1016",
    to: "#1c2838",
    ink: "#f2f4f8",
    shapes: [
      line(0, 470, 1600, 470, "#f2f4f8", 1, 0.25),
      {
        kind: "path",
        d: "M0 470 H200 L280 470 L340 300 L410 680 L490 470 H820 L900 470 L970 180 L1050 760 L1130 470 H1600",
        fill: "none",
        stroke: "#ff6b24",
        width: 8,
      },
      { kind: "circle", cx: 970, cy: 180, r: 16, fill: "#f5f5f5" },
      { kind: "rect", x: 80, y: 120, w: 160, h: 12, fill: "#f2f4f8" },
    ],
  },
  {
    id: "classroom",
    label: "Classroom",
    from: "#14110e",
    to: "#32281c",
    ink: "#f8f1e4",
    shapes: [
      { kind: "rect", x: 160, y: 140, w: 1080, h: 560, fill: "#1b2420" },
      { kind: "rect", x: 190, y: 170, w: 1020, h: 500, fill: "#24312b" },
      line(260, 300, 700, 300, "#f0c36a", 6),
      line(260, 380, 860, 380, "#f8f1e4", 4, 0.8),
      line(260, 460, 640, 460, "#f8f1e4", 4, 0.45),
      { kind: "circle", cx: 1380, cy: 180, r: 70, fill: "#f0c36a" },
    ],
  },
  {
    id: "archive",
    label: "Archive",
    from: "#14110e",
    to: "#2c241c",
    ink: "#f3e6d4",
    shapes: [
      { kind: "rect", x: 360, y: 80, w: 880, h: 740, fill: "none", stroke: "#f3e6d4", width: 2 },
      { kind: "rect", x: 430, y: 150, w: 740, h: 600, fill: "none", stroke: "#f3e6d4", width: 1.5, opacity: 0.7 },
      { kind: "rect", x: 500, y: 230, w: 600, h: 440, fill: "#3a2e24" },
      { kind: "rect", x: 540, y: 280, w: 280, h: 18, fill: "#f3e6d4" },
      { kind: "rect", x: 540, y: 320, w: 180, h: 10, fill: "#ff6b24" },
      { kind: "rect", x: 80, y: 80, w: 16, h: 740, fill: "#ff6b24" },
    ],
  },
  {
    id: "market",
    label: "Night market",
    from: "#140e0c",
    to: "#4a241c",
    ink: "#ffe7c7",
    shapes: [
      { kind: "rect", x: 80, y: 180, w: 90, h: 220, fill: "#ff6b24" },
      { kind: "rect", x: 170, y: 180, w: 90, h: 220, fill: "#1a100e" },
      { kind: "rect", x: 260, y: 180, w: 90, h: 220, fill: "#ffcf8a" },
      { kind: "rect", x: 350, y: 180, w: 90, h: 220, fill: "#1a100e" },
      { kind: "rect", x: 440, y: 180, w: 90, h: 220, fill: "#ff6b24" },
      { kind: "rect", x: 80, y: 400, w: 450, h: 280, fill: "#1a100e" },
      { kind: "circle", cx: 1040, cy: 280, r: 18, fill: "#ffcf8a" },
      { kind: "circle", cx: 1120, cy: 250, r: 18, fill: "#ff6b24" },
      { kind: "circle", cx: 1200, cy: 300, r: 18, fill: "#ffe7c7" },
      { kind: "circle", cx: 1280, cy: 240, r: 18, fill: "#ffcf8a" },
      { kind: "rect", x: 980, y: 420, w: 420, h: 260, fill: "#2a1612" },
    ],
  },
  {
    id: "dunes",
    label: "Dunes",
    from: "#1a120c",
    to: "#4a2a18",
    ink: "#fff1e4",
    shapes: [
      { kind: "circle", cx: 1180, cy: 240, r: 90, fill: "#ffb088" },
      {
        kind: "path",
        d: "M0 560 C 280 460, 460 680, 820 590 C 1140 510, 1320 470, 1600 560 L 1600 900 L 0 900 Z",
        fill: "#c4622d",
      },
      {
        kind: "path",
        d: "M0 700 C 320 620, 560 820, 960 730 C 1260 660, 1420 680, 1600 740 L 1600 900 L 0 900 Z",
        fill: "#2a160f",
      },
    ],
  },
  {
    id: "orbit",
    label: "Orbit",
    from: "#090d16",
    to: "#1a2744",
    ink: "#e5ecff",
    shapes: [
      { kind: "ellipse", cx: 1000, cy: 460, rx: 460, ry: 160, fill: "none", stroke: "#9eb6ff", width: 2 },
      { kind: "ellipse", cx: 1000, cy: 460, rx: 300, ry: 100, fill: "none", stroke: "#9eb6ff", width: 1.5, opacity: 0.7 },
      { kind: "circle", cx: 1000, cy: 460, r: 70, fill: "#d5def8" },
      { kind: "circle", cx: 1420, cy: 360, r: 22, fill: "#ff6b24" },
      { kind: "circle", cx: 620, cy: 540, r: 12, fill: "#e5ecff" },
    ],
  },
];

export const motifMap = Object.fromEntries(motifs.map((motif) => [motif.id, motif])) as Record<string, Motif>;

export function getMotif(id: string) {
  return motifMap[id] ?? motifMap.forge;
}
