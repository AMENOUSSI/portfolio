import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import { getDictionary } from "@/lib/dictionary";
import { defaultLocale, hasLocale, localizedPath } from "@/lib/i18n";

export default async function NotFound() {
  const value = await rootLocale();
  const locale = hasLocale(value) ? value : defaultLocale;
  const t = (await getDictionary(locale)).notFound;

  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1 className="h2">{t.title}</h1>
      <p>{t.body}</p>
      <Link className="btn btn-primary" href={localizedPath(locale)}>
        {t.home}
      </Link>
    </main>
  );
}
