import type { Locale } from "@/lib/i18n";

/**
 * Content is stored with one value per locale, the same shape the future
 * database rows will have (e.g. `title_fr` / `title_en` → `{ fr, en }`).
 */
export type Localized<T = string> = Record<Locale, T>;

export type ImageRef = { src: string; width: number; height: number; alt: Localized };

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
  /** Path to the CV PDF in `public/`, or null while none is published. */
  cvUrl: Localized<string | null>;
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

export type Project = {
  slug: string;
  title: Localized;
  kicker: Localized;
  summary: Localized;
  problem?: Localized;
  approach?: Localized;
  outcome?: Localized;
  stack: string[];
  image: ImageRef;
  caption?: Localized;
  repoUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
};

export type TimelineEntry = {
  kind: "experience" | "education";
  period: Localized;
  title: Localized;
  organization: Localized;
  current?: boolean;
};

export type ToolIcon = "python" | "pandas" | "postgresql" | "laravel" | "nextjs" | "git";

export type Tool = { name: string; icon: ToolIcon };
