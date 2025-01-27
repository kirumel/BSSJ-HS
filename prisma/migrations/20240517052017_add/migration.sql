/*
  Warnings:

  - Added the required column `class` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "class" INTEGER NOT NULL,
ADD COLUMN     "grade" INTEGER NOT NULL;
