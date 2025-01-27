/*
  Warnings:

  - Made the column `createdAt` on table `compareAT` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "compareAT" ALTER COLUMN "createdAt" SET NOT NULL;
