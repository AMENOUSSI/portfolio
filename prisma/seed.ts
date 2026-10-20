import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { categories, experiences, projectCategories, projects, skills } from "./seed-data";

/**
 * Idempotent: projects, skills and categories are matched on their unique key
 * and left untouched if they already exist; experiences are only inserted into
 * an empty table, and a project only gets its initial categories while it has
 * none. Safe to re-run against a database edited from /admin.
 */
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  for (const p of projects) {
    await db.project.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }
  for (const s of skills) {
    await db.skill.upsert({ where: { name: s.name }, update: {}, create: s });
  }
  for (const c of categories) {
    await db.projectCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  for (const [slug, categorySlugs] of Object.entries(projectCategories)) {
    const project = await db.project.findUnique({ where: { slug }, include: { categories: true } });
    if (!project || project.categories.length > 0) continue;
    await db.project.update({
      where: { slug },
      data: { categories: { connect: categorySlugs.map((s) => ({ slug: s })) } },
    });
  }
  if ((await db.experience.count()) === 0) {
    await db.experience.createMany({ data: experiences });
  }
  console.log(
    `Seeded: ${await db.project.count()} projects, ${await db.skill.count()} skills, ${await db.experience.count()} experiences, ${await db.projectCategory.count()} categories`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
