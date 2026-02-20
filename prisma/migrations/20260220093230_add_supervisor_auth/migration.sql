-- AlterTable
ALTER TABLE "feedback" ADD COLUMN     "superVisorId" TEXT,
ALTER COLUMN "supervisorName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "fellows" ADD COLUMN     "supervisorId" TEXT;

-- CreateTable
CREATE TABLE "supervisors" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supervisors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "supervisors_email_key" ON "supervisors"("email");

-- CreateIndex
CREATE INDEX "feedback_superVisorId_idx" ON "feedback"("superVisorId");

-- CreateIndex
CREATE INDEX "fellows_supervisorId_idx" ON "fellows"("supervisorId");

-- AddForeignKey
ALTER TABLE "fellows" ADD CONSTRAINT "fellows_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "supervisors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_superVisorId_fkey" FOREIGN KEY ("superVisorId") REFERENCES "supervisors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
