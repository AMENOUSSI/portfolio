import type { Metadata } from "next";
import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { getCvContent } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, localizedPath, locales, type Locale } from "@/lib/i18n";
import { PrintButton } from "./print-button";
import "./cv.css";

async function currentLocale(): Promise<Locale> {
  const value = await rootLocale();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getDictionary(locale);
  return {
    title: `${t.cv.title} — Ablam Jules Amenoussi`,
    description: t.meta.description,
    alternates: {
      canonical: localizedPath(locale, "/cv"),
      languages: Object.fromEntries(locales.map((l) => [l, localizedPath(l, "/cv")])),
    },
  };
}

/** "https://github.com/AMENOUSSI" → "github.com/AMENOUSSI", for printing. */
function bare(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export default async function CvPage() {
  const locale = await currentLocale();
  const [dictionary, { profile, projects, experience, education, skills }] = await Promise.all([
    getDictionary(locale),
    getCvContent(),
  ]);
  const t = dictionary.cv;

  return (
    <div className="cv-page">
      <div className="cv-toolbar">
        <Link className="cv-back" href={localizedPath(locale)}>
          ← {t.back}
        </Link>
        <p className="cv-hint">{t.hint}</p>
        <PrintButton label={t.download} />
      </div>

      <article className="cv-sheet">
        <header className="cv-head">
          <div>
            <h1>
              {profile.firstName} <span>{profile.lastName}</span>
            </h1>
            <p className="cv-role">{profile.role[locale]}</p>
          </div>
          <ul className="cv-contact">
            <li>{profile.location}</li>
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.website}>{bare(profile.website)}</a>
            </li>
            <li>
              <a href={profile.github}>{bare(profile.github)}</a>
            </li>
            <li>
              <a href={profile.linkedin}>{bare(profile.linkedin)}</a>
            </li>
          </ul>
        </header>

        <div className="cv-body">
          <div className="cv-main">
            <section>
              <h2>{t.profile}</h2>
              <p>{profile.bio[locale]}</p>
            </section>

            <section>
              <h2>{t.experience}</h2>
              <ol className="cv-entries">
                {experience.map((e) => (
                  <li key={e.id}>
                    <div className="cv-entry-head">
                      <h3>{e.title[locale]}</h3>
                      <span className="cv-period">{e.period[locale]}</span>
                    </div>
                    <p className="cv-org">{e.organization[locale]}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2>{t.projects}</h2>
              <ol className="cv-entries">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <div className="cv-entry-head">
                      <h3>{p.title[locale]}</h3>
                    </div>
                    <p className="cv-org">{p.kicker[locale]}</p>
                    <p>{p.summary[locale]}</p>
                    <p className="cv-stack">
                      {p.stack.join(" · ")}
                      {(p.repoUrl ?? p.liveUrl) && (
                        <>
                          {" — "}
                          <a href={p.repoUrl ?? p.liveUrl}>{bare((p.repoUrl ?? p.liveUrl)!)}</a>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="cv-side">
            <section>
              <h2>{t.skills}</h2>
              <dl className="cv-skills">
                {skills.map((group) => (
                  <div key={group.category}>
                    <dt>{t.categories[group.category]}</dt>
                    <dd>{group.names.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2>{t.education}</h2>
              <ol className="cv-entries">
                {education.map((e) => (
                  <li key={e.id}>
                    <h3>{e.title[locale]}</h3>
                    <p className="cv-org">{e.organization[locale]}</p>
                    <span className="cv-period">{e.period[locale]}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2>{t.languages}</h2>
              <ul className="cv-langs">
                {profile.languages[locale].split(" · ").map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </article>
    </div>
  );
}
