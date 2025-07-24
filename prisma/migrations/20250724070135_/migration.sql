/*
  Warnings:

  - You are about to drop the column `friChecked` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `friTime` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `monChecked` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `monTime` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `outTimeST` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `outTimeT` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `thuChecked` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `thuTime` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `tueChecked` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `tueTime` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `wedChecked` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `wedTime` on the `vacATObject` table. All the data in the column will be lost.
  - You are about to drop the column `outTimeST` on the `vacATSupervisor` table. All the data in the column will be lost.
  - You are about to drop the column `outTimeT` on the `vacATSupervisor` table. All the data in the column will be lost.
  - You are about to drop the column `startTimeT` on the `vacATSupervisor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vacATObject" DROP COLUMN "friChecked",
DROP COLUMN "friTime",
DROP COLUMN "monChecked",
DROP COLUMN "monTime",
DROP COLUMN "outTimeST",
DROP COLUMN "outTimeT",
DROP COLUMN "thuChecked",
DROP COLUMN "thuTime",
DROP COLUMN "tueChecked",
DROP COLUMN "tueTime",
DROP COLUMN "wedChecked",
DROP COLUMN "wedTime";

-- AlterTable
ALTER TABLE "vacATSupervisor" DROP COLUMN "outTimeST",
DROP COLUMN "outTimeT",
DROP COLUMN "startTimeT";
