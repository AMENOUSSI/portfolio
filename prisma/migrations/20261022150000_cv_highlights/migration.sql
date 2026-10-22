-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "highlightsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "highlightsFr" TEXT[] DEFAULT ARRAY[]::TEXT[];
