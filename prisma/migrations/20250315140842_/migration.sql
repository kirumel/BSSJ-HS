/*
  Warnings:

  - You are about to drop the `SJHSUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_sjhsUser_fkey";

-- DropForeignKey
ALTER TABLE "SJHSUser" DROP CONSTRAINT "SJHSUser_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "verificationToken" TEXT;

-- DropTable
DROP TABLE "SJHSUser";
