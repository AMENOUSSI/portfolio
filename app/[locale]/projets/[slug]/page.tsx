import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { Contact } from "@/components/contact";
import { Icon } from "@/components/icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getProjectPage, getProjectSlugs } from "@/lib/content";
import { profile } from "@/lib/content/data";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, localizedPath, locales, type Locale } from "@/lib/i18n";
import "./project.css";

// Cache Components needs at least one sample param; an unknown slug just 404s.
const PLACEHOLDER = "__none__";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return (slugs.length ? slugs : [PLACEHOLDER]).map((slug) => ({ slug }));
}

async function currentLocale(): Promise<Locale> {
  const value = await rootLocale();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projets/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, currentLocale()]);
  const page = await getProjectPage(slug);
  if (!page) return {};
  const { project } = page;
  return {
    title: `${project.title[locale]} — Ablam Jules Amenoussi`,
    description: project.summary[locale],
    alternates: {
      canonical: localizedPath(locale, `/projets/${slug}`),
      languages: Object.fromEntries(locales.map((l) => [l, localizedPath(l, `/projets/${slug}`)])),
    },
    openGraph: {
      title: project.title[locale],
      description: project.summary[locale],
      images: [{ url: project.image.src, alt: project.image.alt[locale] }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projets/[slug]">) {
  const [{ slug }, locale] = await Promise.all([params, currentLocale()]);
  const [dictionary, page] = await Promise.all([getDictionary(locale), getProjectPage(slug)]);
  if (!page) notFound();

  const { project, previous, next } = page;
  const t = dictionary.projectPage;
  const tp = dictionary.projects;
  const home = localizedPath(locale);

  return (
    <>
      <SiteNav locale={locale} t={dictionary.nav} path={`/projets/${slug}`} />
      <main className="case">
        <div className="wrap">
          <Link className="case-back" href={`${home}#projets`}>
            ← {t.back}
          </Link>

          <header className="case-head">
            <p className="kicker">{project.kicker[locale]}</p>
            <h1>{project.title[locale]}</h1>
            <p className="case-lead">{project.summary[locale]}</p>
          </header>

          <figure className="case-media">
            <div className="case-frame">
              <Image
                src={project.image.src}
                alt={project.image.alt[locale]}
                fill
                sizes="(max-width: 1180px) 92vw, 1100px"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            {project.caption && <figcaption className="caption">{project.caption[locale]}</figcaption>}
          </figure>

          <div className="case-grid">
            {project.caseStudy ? (
              <dl className="case-steps">
                <div>
                  <dt>{tp.problem}</dt>
                  <dd>{project.caseStudy.problem[locale]}</dd>
                </div>
                <div>
                  <dt>{tp.approach}</dt>
                  <dd>{project.caseStudy.approach[locale]}</dd>
                </div>
                <div>
                  <dt>{tp.outcome}</dt>
                  <dd>{project.caseStudy.outcome[locale]}</dd>
                </div>
              </dl>
            ) : (
              <div />
            )}

            <aside className="case-side">
              <h2>{t.stack}</h2>
              <ul className="chips">
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              {(project.repoUrl || project.liveUrl) && (
                <>
                  <h2>{t.links}</h2>
                  <div className="links case-links">
                    {project.repoUrl && (
                      <a href={project.repoUrl}>
                        <Icon name="source" />
                        {tp.source}
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl}>
                        <Icon name="external" />
                        {tp.live}
                      </a>
                    )}
                  </div>
                </>
              )}
            </aside>
          </div>

          {(previous || next) && (
            <nav className="case-pager" aria-label={tp.eyebrow}>
              {previous ? (
                <Link href={localizedPath(locale, `/projets/${previous.slug}`)} className="case-pager-link">
                  <span>← {t.previous}</span>
                  <strong>{previous.title[locale]}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={localizedPath(locale, `/projets/${next.slug}`)} className="case-pager-link is-next">
                  <span>{t.next} →</span>
                  <strong>{next.title[locale]}</strong>
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>
      <Contact t={dictionary.contact} email={profile.email} />
      <SiteFooter t={dictionary.footer} profile={profile} />
    </>
  );
}
