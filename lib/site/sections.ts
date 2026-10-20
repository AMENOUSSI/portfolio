import { z } from "zod";

/*
 * Editable texts of the public site. Each section is stored as one JSON row
 * (SiteSection) validated by its schema below; DEFAULTS hold the original
 * texts and are used until a section has been saved from /admin.
 *
 * Titles use *asterisks* around the word set in the italic accent face:
 * "Ce que je *construis*".
 *
 * Shared by the server (reading, validation) and the admin form (field specs),
 * so nothing here may import server-only code.
 */

const text = z.string().trim().min(1, "Champ requis");
const optionalText = z.string().trim();
const localized = z.object({ fr: text, en: text });
const localizedOptional = z.object({ fr: optionalText, en: optionalText });
const list = z.array(z.string().trim().min(1)).min(1, "Au moins un élément");
const image = z.object({
  src: text.refine((v) => v.startsWith("/") || /^https:\/\/\S+$/.test(v), "Chemin commençant par / ou adresse https"),
  alt: localized,
});
const url = text.refine((v) => /^https?:\/\/\S+$/.test(v), "Adresse http(s) attendue");
const heading = z.object({ eyebrow: localized, heading: localized });

export const sectionSchemas = {
  identity: z.object({
    firstName: text,
    lastName: text,
    role: localized,
    lead: localized,
    location: text,
    languages: localized,
    email: z.string().trim().email("Adresse e-mail invalide"),
    github: url,
    linkedin: url,
    website: url,
    portrait: image,
  }),
  career: z.object({
    milestones: z.array(z.object({ title: localized, detail: localized })).length(3),
  }),
  focus: z.object({
    items: z.object({ fr: list, en: list }),
  }),
  domains: heading.extend({
    cards: z
      .array(
        z.object({
          icon: z.enum(["code", "database", "board"]),
          title: localized,
          description: localized,
          stack: z.array(z.string().trim().min(1)),
          target: z.enum(["projets", "parcours"]),
        }),
      )
      .length(3),
  }),
  about: heading.extend({
    bio: localized,
    photo: image,
    tags: z.object({
      fr: z.array(z.string().trim().min(1)).max(4, "4 étiquettes maximum"),
      en: z.array(z.string().trim().min(1)).max(4, "4 étiquettes maximum"),
    }),
    stats: z.array(z.object({ value: text, label: localized })).length(3),
  }),
  sections: z.object({
    projects: heading,
    journey: heading.extend({ experience: localized, education: localized }),
    tools: heading,
    contact: heading.extend({ body: localizedOptional }),
  }),
};

export type SectionKey = keyof typeof sectionSchemas;
export type SectionData<K extends SectionKey> = z.infer<(typeof sectionSchemas)[K]>;
export type SiteContent = { [K in SectionKey]: SectionData<K> };

export const sectionKeys = Object.keys(sectionSchemas) as SectionKey[];

export function isSectionKey(value: string): value is SectionKey {
  return value in sectionSchemas;
}

const nbsp = " ";

export const DEFAULTS: SiteContent = {
  identity: {
    firstName: "Ablam Jules",
    lastName: "Amenoussi",
    role: {
      fr: "Ingénieur logiciel & data engineer, à l'intersection des mathématiques et de la donnée.",
      en: "Software engineer & data engineer, at the intersection of mathematics and data.",
    },
    lead: {
      fr: "Je conçois des applications web, des API et des pipelines de données qui transforment des données brutes en informations exploitables.",
      en: "I build web applications, APIs and data pipelines that turn raw data into information people can act on.",
    },
    location: "Lomé, Togo",
    languages: { fr: "Français · Anglais C1 · Ewe", en: "French · English C1 · Ewe" },
    email: "julesamenoussi4@gmail.com",
    github: "https://github.com/AMENOUSSI",
    linkedin: "https://www.linkedin.com/in/ablam-jules-amenoussi/",
    website: "https://portfolio-julesamenoussi.vercel.app",
    portrait: {
      src: "/images/portrait-studio.png",
      alt: {
        fr: "Portrait d'Ablam Jules Amenoussi en costume bleu nuit",
        en: "Portrait of Ablam Jules Amenoussi in a navy suit",
      },
    },
  },
  career: {
    milestones: [
      { title: { fr: "Mathématiques", en: "Mathematics" }, detail: { fr: "Université de Lomé", en: "University of Lomé" } },
      { title: { fr: "Génie logiciel", en: "Software engineering" }, detail: { fr: "IAI-Togo · 2024", en: "IAI-Togo · 2024" } },
      { title: { fr: "Data engineering", en: "Data engineering" }, detail: { fr: "UN-CHK · 2026", en: "UN-CHK · 2026" } },
    ],
  },
  focus: {
    items: {
      fr: ["Génie logiciel", "Data engineering", "Pipelines ETL", "API REST", "Mathématiques appliquées", "Bases de données"],
      en: ["Software engineering", "Data engineering", "ETL pipelines", "REST APIs", "Applied mathematics", "Databases"],
    },
  },
  domains: {
    eyebrow: { fr: "Domaines", en: "Focus areas" },
    heading: { fr: "Ce que je *construis*", en: "What I *build*" },
    cards: [
      {
        icon: "code",
        title: { fr: "Développement logiciel", en: "Software development" },
        description: {
          fr: "Applications web et API REST robustes, de la modélisation des données jusqu'au déploiement.",
          en: "Robust web applications and REST APIs, from data modelling to deployment.",
        },
        stack: ["Laravel", "Spring Boot", "Next.js", "React"],
        target: "projets",
      },
      {
        icon: "database",
        title: { fr: "Data engineering", en: "Data engineering" },
        description: {
          fr: "Pipelines ETL en Python : collecte, nettoyage, historisation en base et visualisation automatisée.",
          en: "Python ETL pipelines: collection, cleaning, historisation in a database and automated charts.",
        },
        stack: ["Python", "pandas", "SQLAlchemy", "PostgreSQL"],
        target: "projets",
      },
      {
        icon: "board",
        title: { fr: "Coordination de projet", en: "Project coordination" },
        description: {
          fr: "Analyse des besoins, cahiers des charges, documentation technique et pilotage agile d'équipes.",
          en: "Requirements analysis, specifications, technical documentation and agile team coordination.",
        },
        stack: ["Scrum", "UML", "Jira", "Git"],
        target: "parcours",
      },
    ],
  },
  about: {
    eyebrow: { fr: "À propos", en: "About" },
    heading: { fr: `Qui est *Jules*${nbsp}?`, en: "Who is *Jules*?" },
    bio: {
      fr: "Ingénieur logiciel formé en génie logiciel et en mathématiques, je me spécialise aujourd'hui en data engineering. J'aime les systèmes qui tiennent dans la durée : des données propres, des API claires, une documentation que l'équipe lit vraiment.",
      en: "A software engineer trained in software engineering and mathematics, I now specialise in data engineering. I like systems that last: clean data, clear APIs, and documentation the team actually reads.",
    },
    photo: {
      src: "/images/portrait-office.png",
      alt: { fr: "Ablam Jules Amenoussi souriant, à son bureau", en: "Ablam Jules Amenoussi smiling at his desk" },
    },
    tags: {
      fr: ["Pipelines ETL", "API REST", "Mathématiques", "PostgreSQL"],
      en: ["ETL pipelines", "REST APIs", "Mathematics", "PostgreSQL"],
    },
    stats: [
      { value: "6", label: { fr: "expériences professionnelles", en: "professional roles" } },
      { value: "7", label: { fr: "projets documentés", en: "documented projects" } },
      { value: "C1", label: { fr: "anglais certifié (CEFR, 2026)", en: "certified English (CEFR, 2026)" } },
    ],
  },
  sections: {
    projects: {
      eyebrow: { fr: "Projets sélectionnés", en: "Selected projects" },
      heading: { fr: "Des projets, *des preuves*", en: "Projects as *evidence*" },
    },
    journey: {
      eyebrow: { fr: "Parcours", en: "Journey" },
      heading: { fr: "D'où je *viens*", en: "Where I *come from*" },
      experience: { fr: "Expérience", en: "Experience" },
      education: { fr: "Formation & certifications", en: "Education & certifications" },
    },
    tools: {
      eyebrow: { fr: "Outils", en: "Tools" },
      heading: { fr: "Ma *boîte à outils*", en: "My *toolbox*" },
    },
    contact: {
      eyebrow: { fr: "Contact", en: "Contact" },
      heading: { fr: "Parlons de votre *projet*.", en: "Let's talk about your *project*." },
      body: {
        fr: `Stage, collaboration, programme de master ou mission data${nbsp}: écrivez-moi, en français ou en anglais.`,
        en: "Internship, collaboration, master's programme or data assignment: write to me in English or French.",
      },
    },
  },
};

/** "Ce que je *construis*" → { before: "Ce que je ", accent: "construis", after: "" } */
export function splitHeading(value: string): { before: string; accent: string; after: string } {
  const match = value.match(/^([\s\S]*?)\*([^*]+)\*([\s\S]*)$/);
  return match ? { before: match[1], accent: match[2], after: match[3] } : { before: value, accent: "", after: "" };
}

/* ---------- Path helpers (forms use dotted names like "cards.0.title.fr") ---------- */

export function getAt(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined;
    return (value as Record<string, unknown>)[key];
  }, source);
}

export function setAt(target: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let node: Record<string, unknown> | unknown[] = target;
  keys.forEach((key, index) => {
    const last = index === keys.length - 1;
    const container = node as Record<string, unknown>;
    if (last) {
      container[key] = value;
      return;
    }
    if (container[key] === undefined) container[key] = /^\d+$/.test(keys[index + 1]) ? [] : {};
    node = container[key] as Record<string, unknown>;
  });
}

/** A section's eyebrow + title in one language, ready for <AccentHeading>. */
export type SectionHead = { eyebrow: string; heading: ReturnType<typeof splitHeading> };

export function sectionHead(
  head: { eyebrow: Record<"fr" | "en", string>; heading: Record<"fr" | "en", string> },
  locale: "fr" | "en",
): SectionHead {
  return { eyebrow: head.eyebrow[locale], heading: splitHeading(head.heading[locale]) };
}
