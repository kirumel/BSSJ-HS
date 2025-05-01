/*
  Warnings:

  - You are about to drop the column `outTimeAT` on the `nightAttendanceObject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendanceObject" ADD COLUMN     "friChecked" TEXT,
ADD COLUMN     "friTime" TEXT,
ADD COLUMN     "monChecked" TEXT,
ADD COLUMN     "monTime" TEXT,
ADD COLUMN     "outTimeST" TEXT,
ADD COLUMN     "outTimeT" TEXT,
ADD COLUMN     "secondNumber" TEXT,
ADD COLUMN     "thuChecked" TEXT,
ADD COLUMN     "thuTime" TEXT,
ADD COLUMN     "tueChecked" TEXT,
ADD COLUMN     "tueTime" TEXT,
ADD COLUMN     "wedChecked" TEXT,
ADD COLUMN     "wedTime" TEXT;

-- AlterTable
ALTER TABLE "nightAttendanceObject" DROP COLUMN "outTimeAT";
