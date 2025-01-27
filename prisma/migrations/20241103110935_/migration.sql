/*
  Warnings:

  - You are about to drop the column `subtags` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Post` table. All the data in the column will be lost.
  - The `type2` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "subtags",
DROP COLUMN "tags",
ADD COLUMN     "gradeTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "subSubjectTags" TEXT,
ADD COLUMN     "subjectTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "type2",
ADD COLUMN     "type2" TEXT[] DEFAULT ARRAY[]::TEXT[];
