-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NONSUBMITTED', 'SUBMITTED');

-- AlterTable
ALTER TABLE "HomeworkSubmission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'NONSUBMITTED';
