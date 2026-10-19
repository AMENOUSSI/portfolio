import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { localizedPath, locales, type Locale } from "@/lib/i18n";
import { Icon } from "./icon";

type Props = { locale: Locale; t: Dictionary["nav"] };

export function SiteNav({ locale, t }: Props) {
  const links = [
    { href: "#domaines", label: t.domains },
    { href: "#a-propos", label: t.about },
    { href: "#projets", label: t.projects },
    { href: "#parcours", label: t.journey },
  ];

  return (
    <div className="nav-shell">
      <header className="nav">
        <Link className="brand" href={localizedPath(locale)}>
          <span className="monogram" aria-hidden="true">
            AJ
          </span>
          <span className="name">
            Jules Amenoussi<span className="dot">.</span>
          </span>
        </Link>

        <nav className="nav-primary" aria-label={t.label}>
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <details className="menu">
          <summary aria-label={t.menu}>
            <Icon name="menu" />
          </summary>
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href="#contact">{t.contact}</a>
            </li>
          </ul>
        </details>

        <div className="lang" role="group" aria-label={t.language}>
          {locales.map((l) => (
            <Link
              key={l}
              href={localizedPath(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>

        <a className="nav-cta" href="#contact">
          {t.contact}
        </a>
      </header>
    </div>
  );
}
