import type { Domain, Localized, Milestone, Profile } from "./types";

/*
 * Static profile content. Projects, skills and experiences live in the
 * database and are edited from /admin. Keep every claim factual.
 */

export const profile: Profile = {
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
  bio: {
    fr: "Ingénieur logiciel formé en génie logiciel et en mathématiques, je me spécialise aujourd'hui en data engineering. J'aime les systèmes qui tiennent dans la durée : des données propres, des API claires, une documentation que l'équipe lit vraiment.",
    en: "A software engineer trained in software engineering and mathematics, I now specialise in data engineering. I like systems that last: clean data, clear APIs, and documentation the team actually reads.",
  },
  location: "Lomé, Togo",
  languages: { fr: "Français · Anglais C1 · Ewe", en: "French · English C1 · Ewe" },
  email: "julesamenoussi4@gmail.com",
  github: "https://github.com/AMENOUSSI",
  linkedin: "https://www.linkedin.com/in/ablam-jules-amenoussi/",
  website: "https://portfolio-julesamenoussi.vercel.app",
  portrait: {
    src: "/images/portrait-studio.png",
    width: 1254,
    height: 1254,
    alt: {
      fr: "Portrait d'Ablam Jules Amenoussi en costume bleu nuit",
      en: "Portrait of Ablam Jules Amenoussi in a navy suit",
    },
  },
  aboutPhoto: {
    src: "/images/portrait-office.png",
    width: 1254,
    height: 1254,
    alt: {
      fr: "Ablam Jules Amenoussi souriant, à son bureau",
      en: "Ablam Jules Amenoussi smiling at his desk",
    },
  },
  aboutTags: {
    fr: ["Pipelines ETL", "API REST", "Mathématiques", "PostgreSQL"],
    en: ["ETL pipelines", "REST APIs", "Mathematics", "PostgreSQL"],
  },
  stats: [
    { value: "6", label: { fr: "expériences professionnelles", en: "professional roles" } },
    { value: "7", label: { fr: "projets documentés", en: "documented projects" } },
    { value: "C1", label: { fr: "anglais certifié (CEFR, 2026)", en: "certified English (CEFR, 2026)" } },
  ],
};

export const milestones: Milestone[] = [
  { title: { fr: "Mathématiques", en: "Mathematics" }, detail: { fr: "Université de Lomé", en: "University of Lomé" } },
  { title: { fr: "Génie logiciel", en: "Software engineering" }, detail: { fr: "IAI-Togo · 2024", en: "IAI-Togo · 2024" } },
  { title: { fr: "Data engineering", en: "Data engineering" }, detail: { fr: "UN-CHK · 2026", en: "UN-CHK · 2026" } },
];

export const focusAreas: Localized<string[]> = {
  fr: ["Génie logiciel", "Data engineering", "Pipelines ETL", "API REST", "Mathématiques appliquées", "Bases de données"],
  en: ["Software engineering", "Data engineering", "ETL pipelines", "REST APIs", "Applied mathematics", "Databases"],
};

export const domains: Domain[] = [
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
];
