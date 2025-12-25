/*
  Warnings:

  - Made the column `classId` on table `TeacherSchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TeacherSchedule" DROP CONSTRAINT "TeacherSchedule_classId_fkey";

-- AlterTable
ALTER TABLE "TeacherSchedule" ALTER COLUMN "classId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TeacherSchedule" ADD CONSTRAINT "TeacherSchedule_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
