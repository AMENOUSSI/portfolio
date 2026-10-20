import type { TimelineEntry } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { SectionHead } from "@/lib/site/sections";
import { AccentHeading } from "./accent-heading";

type Props = {
  locale: Locale;
  head: SectionHead;
  labels: { experience: string; education: string };
  experience: TimelineEntry[];
  education: TimelineEntry[];
};

function Timeline({ locale, entries }: { locale: Locale; entries: TimelineEntry[] }) {
  return (
    <ol className="tl">
      {entries.map((e) => (
        <li className={e.current ? "is-current" : undefined} key={e.id}>
          <span className="period">{e.period[locale]}</span>
          <h4>{e.title[locale]}</h4>
          <p>{e.organization[locale]}</p>
        </li>
      ))}
    </ol>
  );
}

export function Journey({ locale, head, labels, experience, education }: Props) {
  return (
    <section className="section is-tight" id="parcours" aria-labelledby="parcours-title">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow">{head.eyebrow}</p>
            <AccentHeading heading={head.heading} id="parcours-title" />
          </div>
        </div>
        <div className="timeline-grid">
          <div>
            <h3 className="tl-title">{labels.experience}</h3>
            <Timeline locale={locale} entries={experience} />
          </div>
          <div>
            <h3 className="tl-title">{labels.education}</h3>
            <Timeline locale={locale} entries={education} />
          </div>
        </div>
      </div>
    </section>
  );
}
