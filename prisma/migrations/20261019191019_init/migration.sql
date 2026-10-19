-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('LANGUAGE', 'DATA', 'WEB', 'DATABASE', 'TOOLING', 'METHOD');

-- CreateEnum
CREATE TYPE "TimelineKind" AS ENUM ('EXPERIENCE', 'EDUCATION');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "kickerFr" TEXT NOT NULL,
    "kickerEn" TEXT NOT NULL,
    "summaryFr" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "problemFr" TEXT,
    "problemEn" TEXT,
    "approachFr" TEXT,
    "approachEn" TEXT,
    "outcomeFr" TEXT,
    "outcomeEn" TEXT,
    "stack" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "imageAltFr" TEXT NOT NULL,
    "imageAltEn" TEXT NOT NULL,
    "captionFr" TEXT,
    "captionEn" TEXT,
    "repoUrl" TEXT,
    "liveUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "icon" TEXT,
    "showInToolbox" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "kind" "TimelineKind" NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "organizationFr" TEXT NOT NULL,
    "organizationEn" TEXT NOT NULL,
    "periodFr" TEXT NOT NULL,
    "periodEn" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_published_position_idx" ON "Project"("published", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "Experience_kind_published_idx" ON "Experience"("kind", "published");
