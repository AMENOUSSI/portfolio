import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import type { Project as ProjectRow, Experience as ExperienceRow } from "@/generated/prisma/client";
import { domains, focusAreas, milestones, profile } from "./data";
import type { Localized, Project, TimelineEntry, Tool } from "./types";

export type * from "./types";

/** Cache tags, invalidated by the admin Server Actions after each write. */
export const contentTags = {
  projects: "projects",
  skills: "skills",
  experiences: "experiences",
} as const;

function pair(fr: string, en: string): Localized {
  return { fr, en };
}

function optionalPair(fr: string | null, en: string | null): Localized | undefined {
  return fr && en ? { fr, en } : undefined;
}

function toProject(row: ProjectRow): Project {
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
    featured: row.featured,
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
  const [projects, timeline, tools] = await Promise.all([getPublishedProjects(), getTimeline(), getToolbox()]);
  // Only the first featured project gets the large card; any others join the grid.
  const featuredProject = projects.find((p) => p.featured);
  return {
    profile,
    milestones,
    focusAreas,
    domains,
    featuredProject,
    otherProjects: projects.filter((p) => p !== featuredProject),
    experience: timeline.experience,
    education: timeline.education,
    tools,
  };
}

export type HomeContent = Awaited<ReturnType<typeof getHomeContent>>;
