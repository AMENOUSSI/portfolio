import type { Locale } from "@/lib/i18n";
import type fr from "@/dictionaries/fr.json";

export type Dictionary = typeof fr;
export type Heading = Dictionary["domains"]["heading"];

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
