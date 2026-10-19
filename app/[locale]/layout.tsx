import type { Metadata } from "next";
import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { fontVariables } from "@/lib/fonts";
import { hasLocale, localizedPath, locales, type Locale } from "@/lib/i18n";
import "../globals.css";

async function currentLocale(): Promise<Locale> {
  const value = await rootLocale();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getDictionary(locale);
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: localizedPath(locale),
      languages: Object.fromEntries(locales.map((l) => [l, localizedPath(l)])),
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await currentLocale();
  return (
    <html lang={locale} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
