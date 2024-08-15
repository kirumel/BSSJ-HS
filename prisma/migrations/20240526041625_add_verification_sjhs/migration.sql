/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `SJHSUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SJHSUser" DROP COLUMN "emailVerified",
ADD COLUMN     "verificationToken" TEXT;
