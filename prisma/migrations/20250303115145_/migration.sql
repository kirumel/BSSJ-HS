/*
  Warnings:

  - You are about to drop the column `outTimeTT` on the `nightAttendanceObject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nightAttendanceObject" DROP COLUMN "outTimeTT",
ADD COLUMN     "outTimeAT" TEXT;
