import type { Dictionary } from "@/lib/dictionary";
import type { HomeContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { CareerPlot } from "./career-plot";
import { Icon } from "./icon";

type Props = {
  locale: Locale;
  t: Dictionary["hero"];
  profile: HomeContent["profile"];
  milestones: HomeContent["milestones"];
};

export function Hero({ locale, t, profile, milestones }: Props) {
  const cvUrl = profile.cvUrl[locale];
  const githubHandle = profile.github.replace("https://", "");

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <div className="prompt" aria-hidden="true">
            <b>$</b> whoami <span className="caret" />
          </div>
          <h1>
            {profile.firstName} <span className="it it-mark">{profile.lastName}</span>
            <span className="role">{profile.role[locale]}</span>
          </h1>
          <p className="hero-lead">{profile.lead[locale]}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projets">
              {t.seeProjects}
              <span className="knob">
                <Icon name="arrow" />
              </span>
            </a>
            {cvUrl && (
              <a className="btn btn-ghost" href={cvUrl} download>
                {t.downloadCv}
              </a>
            )}
          </div>
          <ul className="facts">
            <li>
              <Icon name="pin" />
              {profile.location}
            </li>
            <li>
              <Icon name="globe" />
              {profile.languages[locale]}
            </li>
            <li>
              <Icon name="github" />
              <a href={profile.github}>{githubHandle}</a>
            </li>
          </ul>
        </div>

        <CareerPlot locale={locale} t={t} milestones={milestones} portrait={profile.portrait} />
      </div>
    </section>
  );
}
