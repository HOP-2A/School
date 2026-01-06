/*
  Warnings:

  - Added the required column `content` to the `Homework` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Day" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');

-- AlterTable
ALTER TABLE "Homework" ADD COLUMN     "content" TEXT NOT NULL;
