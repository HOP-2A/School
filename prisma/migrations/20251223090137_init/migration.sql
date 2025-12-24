/*
  Warnings:

  - The values [MON,TUE,WED,THU,FRI,SAT,SUN] on the enum `Weekday` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Weekday_new" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
ALTER TABLE "TeacherSchedule" ALTER COLUMN "day" TYPE "Weekday_new" USING ("day"::text::"Weekday_new");
ALTER TYPE "Weekday" RENAME TO "Weekday_old";
ALTER TYPE "Weekday_new" RENAME TO "Weekday";
DROP TYPE "public"."Weekday_old";
COMMIT;

-- AlterTable
ALTER TABLE "HomeworkSubmission" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;
