-- Drop legacy supervisor name column (replaced by superVisorId -> supervisors)
ALTER TABLE "feedback" DROP COLUMN IF EXISTS "supervisorName";

