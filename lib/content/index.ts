import { domains, focusAreas, milestones, profile, projects, timeline, tools } from "./data";

export type * from "./types";

/**
 * Read access to site content. Every getter is async so callers do not change
 * when the data moves from `data.ts` to the database (with `'use cache'` + tags).
 */
export async function getHomeContent() {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  return {
    profile,
    milestones,
    focusAreas,
    domains,
    featuredProject: sorted.find((p) => p.featured),
    otherProjects: sorted.filter((p) => !p.featured),
    experience: timeline.filter((e) => e.kind === "experience"),
    education: timeline.filter((e) => e.kind === "education"),
    tools,
  };
}

export type HomeContent = Awaited<ReturnType<typeof getHomeContent>>;
