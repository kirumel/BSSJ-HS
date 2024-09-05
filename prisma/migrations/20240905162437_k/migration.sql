/*
  Warnings:

  - You are about to drop the `_UserComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserComments" DROP CONSTRAINT "_UserComments_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserComments" DROP CONSTRAINT "_UserComments_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikes" DROP CONSTRAINT "_UserLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikes" DROP CONSTRAINT "_UserLikes_B_fkey";

-- DropTable
DROP TABLE "_UserComments";

-- DropTable
DROP TABLE "_UserLikes";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_sjhsUserId_fkey" FOREIGN KEY ("userId") REFERENCES "SJHSUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_sjhsUserId_fkey" FOREIGN KEY ("userId") REFERENCES "SJHSUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
