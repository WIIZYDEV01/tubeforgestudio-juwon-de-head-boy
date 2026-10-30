"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Section, SectionHeading, Skeleton } from "@/components/ui/misc";

const references = [
  {
    id: "U0YLUnga_2g",
    title: "How a documentary is planned",
    note: "A public filmmaker explaining research, structure, and narration. Not a TubeForgeStudio film.",
  },
  {
    id: "dhLQS_XCG0g",
    title: "Editing a video on a phone",
    note: "YouTube’s own tour of the Create app. Not our upload.",
  },
  {
    id: "y9RlEg5Z30s",
    title: "A short documentary, start to finish",
    note: "A public diary of making one short film. Not our client work.",
  },
];

export function ReferenceReels() {
  const [active, setActive] = useState(references[0].id);
  const [playing, setPlaying] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const current = references.find((item) => item.id === active) ?? references[0];

  const choose = (id: string) => {
    setActive(id);
    setPlaying(id);
    setLoaded(false);
  };

  return (
    <Section film="harbor">
      <SectionHeading
        eyebrow="Format references"
        title="Public films, beside the catalog."
        body="These play from YouTube so you can see the kinds of films a channel system is built around. They are not TubeForgeStudio projects, and they are not client results. A film loads only after you press play."
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.6fr)]">
        <div className="relative aspect-video border border-line bg-card">
          {playing ? (
            <>
              {loaded ? null : <Skeleton className="absolute inset-0 z-10" />}
              <iframe
                key={playing}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${playing}?rel=0`}
                title={current.title}
                onLoad={() => setLoaded(true)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </>
          ) : (
            <button type="button" className="absolute inset-0 grid place-items-center gap-3" onClick={() => choose(active)}>
              <span className="grid size-16 place-items-center rounded-full bg-accent text-accent-ink">
                <Play size={22} />
              </span>
              <span className="font-display text-2xl uppercase">Play {current.title}</span>
            </button>
          )}
        </div>
        <ul className="flex flex-col gap-2">
          {references.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={active === item.id}
                className="w-full border border-line bg-card px-4 py-3 text-left"
                onClick={() => {
                  setActive(item.id);
                  if (playing) {
                    setPlaying(item.id);
                    setLoaded(false);
                  }
                }}
              >
                <span className="block font-display text-xl uppercase leading-none">{item.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">{item.note}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
