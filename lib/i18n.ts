export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

/** French is served without a prefix (`/`), English under `/en`. */
export const defaultLocale: Locale = "fr";

export function hasLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

/** Public URL of a path for a locale, e.g. `localizedPath("en", "/")` → `/en`. */
export function localizedPath(locale: Locale, path = "/"): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
