import { workflow } from "@/data/workflow";
import { Reveal } from "@/components/animations/reveal";
import { Section, SectionHeading } from "@/components/ui/misc";

export function Workflow() {
  return (
    <Section id="process" tone="raised" film="salt">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading eyebrow="Workflow" title="Six steps. Then it ships." body="A production timeline for a channel system. The order tightens when a script or a cut already exists." />
        </div>
        <ol className="space-y-4">
          {workflow.map((item, index) => (
            <li key={item.step}>
              <Reveal delay={index * 0.05}>
                <article className="grid gap-4 border border-line bg-card p-5 sm:grid-cols-[5rem_1fr]">
                  <p className="font-display text-3xl text-accent">{item.step}</p>
                  <div>
                    <h3 className="font-display text-2xl uppercase leading-none">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
