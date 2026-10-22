import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { youTubeEmbedUrl } from "@/lib/youtube";
import type {
  Certificate as CertificateRow,
  Experience as ExperienceRow,
  Project as ProjectRow,
  ProjectCategory as CategoryRow,
} from "@/generated/prisma/client";
import { DEFAULTS, isSectionKey, sectionSchemas, withDefaults, type SiteContent } from "@/lib/site/sections";
import type { Certificate, Localized, Profile, Project, ProjectCategory, TimelineEntry, Tool } from "./types";

export type * from "./types";

/** Cache tags, invalidated by the admin Server Actions after each write. */
export const contentTags = {
  projects: "projects",
  skills: "skills",
  experiences: "experiences",
  site: "site",
  certificates: "certificates",
} as const;

/**
 * Editable site texts. A section never saved from /admin, or one whose stored
 * JSON no longer matches its schema, falls back to its default texts.
 */
export async function getSite(): Promise<SiteContent> {
  "use cache";
  cacheTag(contentTags.site);
  cacheLife("max");
  const rows = await db.siteSection.findMany();
  const site = structuredClone(DEFAULTS) as Record<string, unknown>;
  for (const row of rows) {
    if (!isSectionKey(row.key)) continue;
    const parsed = sectionSchemas[row.key].safeParse(withDefaults(DEFAULTS[row.key], row.data));
    if (parsed.success) site[row.key] = parsed.data;
  }
  return site as SiteContent;
}

/** The person behind the site, assembled from the identity and about sections. */
export function toProfile(site: SiteContent): Profile {
  const { identity, about } = site;
  return {
    firstName: identity.firstName,
    lastName: identity.lastName,
    role: identity.role,
    lead: identity.lead,
    bio: about.bio,
    location: identity.location,
    languages: identity.languages,
    email: identity.email,
    github: identity.github,
    linkedin: identity.linkedin,
    website: identity.website,
    portrait: identity.portrait,
    aboutPhoto: about.photo,
    aboutTags: about.tags,
    stats: about.stats,
  };
}

function pair(fr: string, en: string): Localized {
  return { fr, en };
}

function optionalPair(fr: string | null, en: string | null): Localized | undefined {
  return fr && en ? { fr, en } : undefined;
}

function toCategory(row: CategoryRow): ProjectCategory {
  return { slug: row.slug, name: pair(row.nameFr, row.nameEn), position: row.position };
}

function toProject(row: ProjectRow & { categories: CategoryRow[] }): Project {
  const problem = optionalPair(row.problemFr, row.problemEn);
  const approach = optionalPair(row.approachFr, row.approachEn);
  const outcome = optionalPair(row.outcomeFr, row.outcomeEn);
  return {
    slug: row.slug,
    title: pair(row.titleFr, row.titleEn),
    kicker: pair(row.kickerFr, row.kickerEn),
    summary: pair(row.summaryFr, row.summaryEn),
    caseStudy: problem && approach && outcome ? { problem, approach, outcome } : undefined,
    stack: row.stack,
    image: { src: row.imageUrl, alt: pair(row.imageAltFr, row.imageAltEn) },
    caption: optionalPair(row.captionFr, row.captionEn),
    repoUrl: row.repoUrl ?? undefined,
    liveUrl: row.liveUrl ?? undefined,
    videoEmbedUrl: (row.videoUrl && youTubeEmbedUrl(row.videoUrl)) || undefined,
    featured: row.featured,
    categories: [...row.categories].sort((x, y) => x.position - y.position).map(toCategory),
  };
}

function toTimelineEntry(row: ExperienceRow): TimelineEntry {
  return {
    id: row.id,
    period: pair(row.periodFr, row.periodEn),
    title: pair(row.titleFr, row.titleEn),
    organization: pair(row.organizationFr, row.organizationEn),
    current: row.current,
  };
}

async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(contentTags.projects);
  cacheLife("max");
  const rows = await db.project.findMany({
    where: { published: true },
    include: { categories: true },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toProject);
}

async function getTimeline() {
  "use cache";
  cacheTag(contentTags.experiences);
  cacheLife("max");
  const rows = await db.experience.findMany({
    where: { published: true },
    orderBy: [{ current: "desc" }, { startDate: "desc" }],
  });
  return {
    experience: rows.filter((r) => r.kind === "EXPERIENCE").map(toTimelineEntry),
    education: rows.filter((r) => r.kind === "EDUCATION").map(toTimelineEntry),
  };
}

async function getToolbox(): Promise<Tool[]> {
  "use cache";
  cacheTag(contentTags.skills);
  cacheLife("max");
  const rows = await db.skill.findMany({
    where: { showInToolbox: true, icon: { not: null } },
    orderBy: [{ position: "asc" }, { name: "asc" }],
  });
  return rows.map((r) => ({ name: r.name, icon: r.icon! }));
}

export async function getHomeContent() {
  const [site, projects, timeline, tools, certificates] = await Promise.all([
    getSite(),
    getPublishedProjects(),
    getTimeline(),
    getToolbox(),
    getCertificates(),
  ]);
  // Only the first featured project gets the large card; any others join the grid.
  const featuredProject = projects.find((p) => p.featured);
  return {
    site,
    profile: toProfile(site),
    milestones: site.career.milestones,
    focusAreas: site.focus.items,
    domains: site.domains.cards,
    featuredProject,
    otherProjects: projects.filter((p) => p !== featuredProject),
    projectCategories: usedCategories(projects),
    certificates,
    experience: timeline.experience,
    education: timeline.education,
    tools,
  };
}

export type HomeContent = Awaited<ReturnType<typeof getHomeContent>>;

/** Every skill, grouped by category in a fixed order; empty categories are dropped. */
async function getSkillsByCategory() {
  "use cache";
  cacheTag(contentTags.skills);
  cacheLife("max");
  const rows = await db.skill.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }] });
  const order = ["LANGUAGE", "WEB", "DATA", "DATABASE", "TOOLING", "METHOD"] as const;
  return order
    .map((category) => ({ category, names: rows.filter((r) => r.category === category).map((r) => r.name) }))
    .filter((group) => group.names.length > 0);
}

export async function getCvContent() {
  const [site, projects, timeline, skills] = await Promise.all([
    getSite(),
    getPublishedProjects(),
    getTimeline(),
    getSkillsByCategory(),
  ]);
  return { profile: toProfile(site), projects, experience: timeline.experience, education: timeline.education, skills };
}

export type CvContent = Awaited<ReturnType<typeof getCvContent>>;

/** Slugs of published projects, for prerendering their case-study pages. */
export async function getProjectSlugs(): Promise<string[]> {
  return (await getPublishedProjects()).map((p) => p.slug);
}

/** A published project with its neighbours in display order, or null. */
export async function getProjectPage(slug: string) {
  const projects = await getPublishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    project: projects[index],
    previous: index > 0 ? projects[index - 1] : undefined,
    next: index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}

/** Categories used by at least one published project, in button order. */
export function usedCategories(projects: Project[]): ProjectCategory[] {
  const seen = new Map<string, ProjectCategory>();
  for (const project of projects) for (const category of project.categories) seen.set(category.slug, category);
  return [...seen.values()].sort((x, y) => x.position - y.position);
}

function toCertificate(row: CertificateRow): Certificate {
  return {
    id: row.id,
    title: pair(row.titleFr, row.titleEn),
    issuer: row.issuer,
    issuedAt: row.issuedAt.toISOString(),
    fileUrl: row.fileUrl ?? undefined,
    fileIsPdf: Boolean(row.fileUrl?.toLowerCase().endsWith(".pdf")),
    credentialUrl: row.credentialUrl ?? undefined,
  };
}

export async function getCertificates(): Promise<Certificate[]> {
  "use cache";
  cacheTag(contentTags.certificates);
  cacheLife("max");
  const rows = await db.certificate.findMany({
    where: { published: true },
    orderBy: [{ position: "asc" }, { issuedAt: "desc" }],
  });
  return rows.map(toCertificate);
}
