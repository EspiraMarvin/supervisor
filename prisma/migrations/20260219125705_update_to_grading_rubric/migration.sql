/*
  Warnings:

  - You are about to drop the column `conceptJustification` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `conceptScore` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `conceptTaught` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `engagementJustification` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `engagementScore` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `techniqueJustification` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `techniqueScore` on the `analyses` table. All the data in the column will be lost.
  - Added the required column `contentCoverageJustification` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentCoverageScore` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilitationQualityJustification` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilitationQualityScore` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallSummary` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protocolSafetyJustification` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protocolSafetyScore` to the `analyses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "conceptJustification",
DROP COLUMN "conceptScore",
DROP COLUMN "conceptTaught",
DROP COLUMN "engagementJustification",
DROP COLUMN "engagementScore",
DROP COLUMN "summary",
DROP COLUMN "techniqueJustification",
DROP COLUMN "techniqueScore",
ADD COLUMN     "contentCoverageJustification" TEXT NOT NULL,
ADD COLUMN     "contentCoverageQuotes" TEXT,
ADD COLUMN     "contentCoverageScore" INTEGER NOT NULL,
ADD COLUMN     "facilitationQualityJustification" TEXT NOT NULL,
ADD COLUMN     "facilitationQualityQuotes" TEXT,
ADD COLUMN     "facilitationQualityScore" INTEGER NOT NULL,
ADD COLUMN     "overallSummary" TEXT NOT NULL,
ADD COLUMN     "protocolSafetyJustification" TEXT NOT NULL,
ADD COLUMN     "protocolSafetyQuotes" TEXT,
ADD COLUMN     "protocolSafetyScore" INTEGER NOT NULL,
ADD COLUMN     "safetyFlag" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "analyses_safetyFlag_idx" ON "analyses"("safetyFlag");
