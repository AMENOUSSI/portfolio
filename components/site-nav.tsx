import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { localizedPath, locales, type Locale } from "@/lib/i18n";
import { Icon } from "./icon";

type Props = {
  locale: Locale;
  t: Dictionary["nav"];
  /** Current page without locale prefix, so the language switch stays on it. */
  path?: string;
};

export function SiteNav({ locale, t, path = "/" }: Props) {
  // Absolute to the home page so the links also work from other pages.
  const home = localizedPath(locale);
  const links = [
    { href: `${home}#domaines`, label: t.domains },
    { href: `${home}#a-propos`, label: t.about },
    { href: `${home}#projets`, label: t.projects },
    { href: `${home}#parcours`, label: t.journey },
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
              <a href={`${home}#contact`}>{t.contact}</a>
            </li>
          </ul>
        </details>

        <div className="lang" role="group" aria-label={t.language}>
          {locales.map((l) => (
            <Link
              key={l}
              href={localizedPath(l, path)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>

        <a className="nav-cta" href={`${home}#contact`}>
          {t.contact}
        </a>
      </header>
    </div>
  );
}
