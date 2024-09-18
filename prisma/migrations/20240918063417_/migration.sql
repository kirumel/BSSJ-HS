/*
  Warnings:

  - Made the column `grade` on table `compareAT` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "compareAT" ALTER COLUMN "grade" SET NOT NULL;
