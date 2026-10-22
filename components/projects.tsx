import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import type { Project, ProjectCategory } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";
import type { SectionHead } from "@/lib/site/sections";
import { AccentHeading } from "./accent-heading";
import { Icon } from "./icon";
import { ProjectFilter } from "./project-filter";

type Props = {
  locale: Locale;
  t: Dictionary["projects"];
  head: SectionHead;
  featured?: Project;
  others: Project[];
  /** Categories that have at least one published project (filter buttons). */
  categories: ProjectCategory[];
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
      {project.videoEmbedUrl && (
        <Link href={localizedPath(locale, `/projets/${project.slug}#demo`)}>
          <Icon name="play" />
          {t.demo}
        </Link>
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

/** Value of data-categories, read by ProjectFilter. */
function categorySlugs(project: Project) {
  return project.categories.map((c) => c.slug).join(" ");
}

export function Projects({ locale, t, head, featured, others, categories }: Props) {
  const all = featured ? [featured, ...others] : others;
  const options = categories.map((c) => ({
    slug: c.slug,
    label: c.name[locale],
    count: all.filter((p) => p.categories.some((pc) => pc.slug === c.slug)).length,
  }));

  return (
    <section className="section" id="projets" aria-labelledby="projets-title">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow">{head.eyebrow}</p>
            <AccentHeading heading={head.heading} id="projets-title" />
          </div>
        </div>

        <ProjectFilter
          options={options}
          allLabel={t.filterAll}
          groupLabel={t.filterLabel}
          resultLabel={t.filterResult}
          total={all.length}
        >
          {featured && (
            <article className="feature" data-categories={categorySlugs(featured)}>
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
              <article className="shot" key={p.slug} data-categories={categorySlugs(p)}>
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
        </ProjectFilter>
      </div>
    </section>
  );
}
