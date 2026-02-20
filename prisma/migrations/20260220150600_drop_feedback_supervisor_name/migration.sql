-- Drop legacy supervisorName column (replaced by superVisorId -> supervisors)
ALTER TABLE "feedback" DROP COLUMN IF EXISTS "supervisorName";

