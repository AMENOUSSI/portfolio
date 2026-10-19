import type { Dictionary } from "@/lib/dictionary";
import type { Domain } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { AccentHeading } from "./accent-heading";
import { Icon } from "./icon";

type Props = { locale: Locale; t: Dictionary["domains"]; domains: Domain[] };

export function Domains({ locale, t, domains }: Props) {
  return (
    <section className="section after-band" id="domaines" aria-labelledby="domaines-title">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <AccentHeading heading={t.heading} id="domaines-title" />
          </div>
          <a className="btn btn-primary" href="#projets">
            {t.allProjects}
            <span className="knob">
              <Icon name="arrow" />
            </span>
          </a>
        </div>
        <div className="cards">
          {domains.map((d) => (
            <article className="card" key={d.title.en}>
              <div className="ico">
                <Icon name={d.icon} />
              </div>
              <h3>{d.title[locale]}</h3>
              <p>{d.description[locale]}</p>
              <ul className="chips">
                {d.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <a className="more" href={`#${d.target}`}>
                {d.target === "projets" ? t.relatedProjects : t.relatedExperience}
                <Icon name="arrow" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
