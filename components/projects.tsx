import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import type { Project } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";
import { AccentHeading } from "./accent-heading";
import { Icon } from "./icon";

type Props = {
  locale: Locale;
  t: Dictionary["projects"];
  featured?: Project;
  others: Project[];
};

function ProjectLinks({ project, t, locale }: { project: Project; t: Dictionary["projects"]; locale: Locale }) {
  return (
    <div className="links">
      <Link href={localizedPath(locale, `/projets/${project.slug}`)}>
        <Icon name="arrow" />
        {t.caseStudy}
      </Link>
      {project.repoUrl && (
        <a href={project.repoUrl}>
          <Icon name="source" />
          {t.source}
        </a>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl}>
          <Icon name="external" />
          {t.live}
        </a>
      )}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="chips">
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export function Projects({ locale, t, featured, others }: Props) {
  return (
    <section className="section" id="projets" aria-labelledby="projets-title">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <AccentHeading heading={t.heading} id="projets-title" />
          </div>
        </div>

        {featured && (
          <article className="feature">
            <figure className="feature-media">
              <div className="feature-frame">
                <Image
                  src={featured.image.src}
                  alt={featured.image.alt[locale]}
                  fill
                  sizes="(max-width: 1000px) 92vw, 560px"
                />
              </div>
              {featured.caption && <figcaption className="caption">{featured.caption[locale]}</figcaption>}
            </figure>
            <div className="feature-body">
              <p className="kicker">{featured.kicker[locale]}</p>
              <h3>{featured.title[locale]}</h3>
              {featured.caseStudy ? (
                <dl className="pal">
                  <dt>{t.problem}</dt>
                  <dd>{featured.caseStudy.problem[locale]}</dd>
                  <dt>{t.approach}</dt>
                  <dd>{featured.caseStudy.approach[locale]}</dd>
                  <dt>{t.outcome}</dt>
                  <dd>{featured.caseStudy.outcome[locale]}</dd>
                </dl>
              ) : (
                <p className="feature-summary">{featured.summary[locale]}</p>
              )}
              <Chips items={featured.stack} />
              <ProjectLinks project={featured} t={t} locale={locale} />
            </div>
          </article>
        )}

        <div className="pair">
          {others.map((p) => (
            <article className="shot" key={p.slug}>
              <div className="shot-img">
                <Image src={p.image.src} alt={p.image.alt[locale]} fill sizes="(max-width: 680px) 92vw, 560px" />
              </div>
              <div className="shot-body">
                <p className="kicker">{p.kicker[locale]}</p>
                <h3>{p.title[locale]}</h3>
                <p>{p.summary[locale]}</p>
                <Chips items={p.stack} />
                <ProjectLinks project={p} t={t} locale={locale} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
