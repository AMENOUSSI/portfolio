import type { Locale } from "@/lib/i18n";

/**
 * Content is stored with one value per locale, the same shape the future
 * database rows will have (e.g. `title_fr` / `title_en` → `{ fr, en }`).
 */
export type Localized<T = string> = Record<Locale, T>;

export type ImageRef = { src: string; alt: Localized };

export type Profile = {
  firstName: string;
  lastName: string;
  role: Localized;
  lead: Localized;
  bio: Localized;
  location: string;
  languages: Localized;
  email: string;
  github: string;
  linkedin: string;
  /** Public address of this portfolio, printed on the CV. */
  website: string;
  portrait: ImageRef;
  aboutPhoto: ImageRef;
  aboutTags: Localized<string[]>;
  stats: { value: string; label: Localized }[];
};

/** A point on the hero career curve, in chronological order. */
export type Milestone = { title: Localized; detail: Localized };

export type DomainIcon = "code" | "database" | "board";

export type Domain = {
  icon: DomainIcon;
  title: Localized;
  description: Localized;
  stack: string[];
  /** Section the card links to. */
  target: "projets" | "parcours";
};

/* View models below are built from database rows in `lib/content/index.ts`. */

export type ProjectCategory = { slug: string; name: Localized; position: number };

export type Project = {
  slug: string;
  title: Localized;
  kicker: Localized;
  summary: Localized;
  /** Case-study lines, present only when all three are filled in. */
  caseStudy?: { problem: Localized; approach: Localized; outcome: Localized };
  stack: string[];
  image: { src: string; alt: Localized };
  caption?: Localized;
  repoUrl?: string;
  liveUrl?: string;
  /** YouTube player address for the demo video, if any. */
  videoEmbedUrl?: string;
  featured: boolean;
  categories: ProjectCategory[];
};

export type TimelineEntry = {
  id: string;
  period: Localized;
  title: Localized;
  organization: Localized;
  current: boolean;
};

/** A toolbox entry; `icon` is a simple-icons slug. */
export type Tool = { name: string; icon: string };

export type Certificate = {
  id: string;
  title: Localized;
  issuer: string;
  /** ISO date; only the month and year are shown. */
  issuedAt: string;
  fileUrl?: string;
  fileIsPdf: boolean;
  credentialUrl?: string;
};
