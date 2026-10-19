import type { Domain, Localized, Milestone, Profile, Project, TimelineEntry, Tool } from "./types";

/*
 * Seed content for the site. This file is the single source of truth until
 * the admin + database step replaces it; keep every claim factual.
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
  cvUrl: { fr: null, en: null },
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

export const projects: Project[] = [
  {
    slug: "xof-exchange-pipeline",
    title: {
      fr: "Pipeline ETL de suivi des taux de change du franc CFA",
      en: "ETL pipeline tracking CFA franc exchange rates",
    },
    kicker: {
      fr: "Data engineering · Projet personnel · 2026",
      en: "Data engineering · Personal project · 2026",
    },
    summary: {
      fr: "Pipeline automatisé qui collecte, historise et visualise les taux du franc CFA face aux principales devises.",
      en: "Automated pipeline that collects, stores and charts CFA franc rates against major currencies.",
    },
    problem: {
      fr: "Les taux du XOF face aux devises clés ne sont pas historisés ni comparables dans le temps.",
      en: "XOF rates against key currencies are neither historised nor comparable over time.",
    },
    approach: {
      fr: "Pipeline Python Extract–Transform–Load, agrégations pandas, stockage relationnel.",
      en: "Python Extract–Transform–Load pipeline, pandas aggregations, relational storage.",
    },
    outcome: {
      fr: "Historique alimenté automatiquement et graphiques régénérés à chaque exécution.",
      en: "History fed automatically and charts regenerated on every run.",
    },
    stack: ["Python", "pandas", "PostgreSQL", "matplotlib"],
    image: {
      src: "/images/projects/xof-pipeline.png",
      width: 1500,
      height: 900,
      alt: {
        fr: "Graphique en barres de la valeur du franc CFA face à l'euro, la livre, le yuan, le naira et le cédi",
        en: "Bar chart of the CFA franc against the euro, pound, yuan, naira and cedi",
      },
    },
    caption: { fr: "Sortie générée par le pipeline · 26/07/2026", en: "Output generated by the pipeline · 2026-07-26" },
    repoUrl: "https://github.com/AMENOUSSI/xof-exchange-pipeline",
    featured: true,
    order: 1,
  },
  {
    slug: "lomedigital",
    title: {
      fr: "Lomédigital — site et plateforme de formation",
      en: "Lomédigital — website and training platform",
    },
    kicker: { fr: "Full-stack · Client · 2026", en: "Full-stack · Client · 2026" },
    summary: {
      fr: "Site multi-sections dynamique avec blog, réalisations et inscription aux formations en ligne.",
      en: "Dynamic multi-section site with a blog, case studies and online course enrolment.",
    },
    stack: ["Next.js", "Prisma", "PostgreSQL"],
    image: {
      src: "/images/projects/lomedigital.png",
      width: 1309,
      height: 705,
      alt: { fr: "Page d'accueil du site Lomédigital", en: "Lomédigital home page" },
    },
    liveUrl: "https://lomedigital.vercel.app/",
    featured: false,
    order: 2,
  },
  {
    slug: "mawuto-shop-dashboard",
    title: {
      fr: "Mawuto's Shop — tableau de bord comptable",
      en: "Mawuto's Shop — accounting dashboard",
    },
    kicker: { fr: "Dashboard · Projet personnel · 2025", en: "Dashboard · Personal project · 2025" },
    summary: {
      fr: "Suivi des ventes, dépenses, achats et du chiffre d'affaires, avec visualisation des données financières.",
      en: "Tracks sales, expenses, purchases and revenue, with financial data visualisation.",
    },
    stack: ["React", "Chart.js", "MySQL"],
    image: {
      src: "/images/projects/mawuto-dashboard.png",
      width: 1920,
      height: 1008,
      alt: { fr: "Tableau de bord comptable de Mawuto's Shop", en: "Mawuto's Shop accounting dashboard" },
    },
    featured: false,
    order: 3,
  },
];

export const timeline: TimelineEntry[] = [
  {
    kind: "experience",
    current: true,
    period: { fr: "Depuis mars 2025", en: "Since March 2025" },
    title: { fr: "Développeur web & coordinateur de projets", en: "Web developer & project coordinator" },
    organization: { fr: "Confiance & Percée · Lomé", en: "Confiance & Percée · Lomé" },
  },
  {
    kind: "experience",
    period: { fr: "Janv. – avr. 2026", en: "Jan – Apr 2026" },
    title: { fr: "Support IT, automatisation & développement", en: "IT support, automation & development" },
    organization: { fr: "SMART2D Services · secteur bancaire", en: "SMART2D Services · banking sector" },
  },
  {
    kind: "experience",
    period: { fr: "Mars 2025 – janv. 2026", en: "Mar 2025 – Jan 2026" },
    title: { fr: "Technicien de traitement des données biométriques", en: "Biometric data processing technician" },
    organization: { fr: "Agence Nationale d'Identification", en: "National Identification Agency (Togo)" },
  },
  {
    kind: "experience",
    period: { fr: "Sept. – déc. 2024", en: "Sep – Dec 2024" },
    title: { fr: "Stage en développement logiciel", en: "Software development intern" },
    organization: { fr: "Société de Prestations Informatiques", en: "Société de Prestations Informatiques" },
  },
  {
    kind: "education",
    current: true,
    period: { fr: "Juin – sept. 2026", en: "Jun – Sep 2026" },
    title: { fr: "Formation certifiante en Data Engineering", en: "Data Engineering certificate programme" },
    organization: { fr: "UN-CHK, Sénégal · à distance", en: "UN-CHK, Senegal · remote" },
  },
  {
    kind: "education",
    period: { fr: "Mars 2026", en: "March 2026" },
    title: { fr: "Certificat d'anglais CEFR C1", en: "CEFR C1 English certificate" },
    organization: { fr: "International English Certificate Test", en: "International English Certificate Test" },
  },
  {
    kind: "education",
    period: { fr: "2021 – 2024", en: "2021 – 2024" },
    title: { fr: "Licence en Génie Logiciel et Réseaux", en: "Bachelor's in Software Engineering and Networks" },
    organization: { fr: "Institut Africain d'Informatique (IAI-Togo)", en: "African Institute of Computer Science (IAI-Togo)" },
  },
  {
    kind: "education",
    period: { fr: "Depuis 2021", en: "Since 2021" },
    title: { fr: "Licence en Mathématiques", en: "Bachelor's in Mathematics" },
    organization: { fr: "Université de Lomé", en: "University of Lomé" },
  },
];

export const tools: Tool[] = [
  { name: "Python", icon: "python" },
  { name: "pandas", icon: "pandas" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "Laravel", icon: "laravel" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Git", icon: "git" },
];
