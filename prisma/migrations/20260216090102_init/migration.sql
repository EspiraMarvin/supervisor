-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PROCESSED', 'FLAGGED_FOR_REVIEW', 'SAFE', 'NEEDS_FOLLOWUP');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('SAFE', 'RISK');

-- CreateTable
CREATE TABLE "fellows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fellows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transcript" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "concept" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PROCESSED',
    "fellowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "conceptTaught" BOOLEAN NOT NULL,
    "conceptScore" INTEGER NOT NULL,
    "conceptJustification" TEXT NOT NULL,
    "engagementScore" INTEGER NOT NULL,
    "engagementJustification" TEXT NOT NULL,
    "techniqueScore" INTEGER NOT NULL,
    "techniqueJustification" TEXT NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'SAFE',
    "riskQuote" TEXT,
    "riskReason" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelUsed" TEXT NOT NULL,
    "processingTime" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL,
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "overrideStatus" "SessionStatus",
    "overrideRisk" "RiskLevel",
    "notes" TEXT,
    "supervisorName" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fellows_email_key" ON "fellows"("email");

-- CreateIndex
CREATE INDEX "sessions_fellowId_idx" ON "sessions"("fellowId");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "sessions_date_idx" ON "sessions"("date");

-- CreateIndex
CREATE UNIQUE INDEX "analyses_sessionId_key" ON "analyses"("sessionId");

-- CreateIndex
CREATE INDEX "analyses_riskLevel_idx" ON "analyses"("riskLevel");

-- CreateIndex
CREATE INDEX "feedback_sessionId_idx" ON "feedback"("sessionId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fellowId_fkey" FOREIGN KEY ("fellowId") REFERENCES "fellows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
