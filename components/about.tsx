import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import type { HomeContent } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";
import type { SectionHead } from "@/lib/site/sections";
import { AccentHeading } from "./accent-heading";
import { Icon } from "./icon";

type Props = { locale: Locale; t: Dictionary["about"]; head: SectionHead; profile: HomeContent["profile"] };

export function About({ locale, t, head, profile }: Props) {
  return (
    <section className="section about on-dark" id="a-propos" aria-labelledby="a-propos-title">
      <div className="wrap about-grid">
        <div className="orbit">
          <div className="ring" />
          <div className="disc">
            <Image
              src={profile.aboutPhoto.src}
              alt={profile.aboutPhoto.alt[locale]}
              fill
              sizes="(max-width: 1000px) 90vw, 420px"
            />
          </div>
          {profile.aboutTags[locale].map((tag) => (
            <span className="chip-float" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div>
          <p className="eyebrow">{head.eyebrow}</p>
          <AccentHeading heading={head.heading} marked={false} id="a-propos-title" />
          <p className="about-text">{profile.bio[locale]}</p>
          <dl className="stats">
            {profile.stats.map((s) => (
              <div className="stat" key={s.label.en}>
                <dt>{s.value}</dt>
                <dd>{s.label[locale]}</dd>
              </div>
            ))}
          </dl>
          <div className="row">
            <Link className="btn btn-amber" href={localizedPath(locale, "/cv")}>
              {t.downloadCv}
              <span className="knob">
                <Icon name="arrow" />
              </span>
            </Link>
            <a className="btn btn-line-light" href={profile.linkedin}>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
