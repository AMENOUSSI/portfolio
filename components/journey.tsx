import type { Dictionary } from "@/lib/dictionary";
import type { TimelineEntry } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { AccentHeading } from "./accent-heading";

type Props = {
  locale: Locale;
  t: Dictionary["journey"];
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

export function Journey({ locale, t, experience, education }: Props) {
  return (
    <section className="section is-tight" id="parcours" aria-labelledby="parcours-title">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <AccentHeading heading={t.heading} id="parcours-title" />
          </div>
        </div>
        <div className="timeline-grid">
          <div>
            <h3 className="tl-title">{t.experience}</h3>
            <Timeline locale={locale} entries={experience} />
          </div>
          <div>
            <h3 className="tl-title">{t.education}</h3>
            <Timeline locale={locale} entries={education} />
          </div>
        </div>
      </div>
    </section>
  );
}
