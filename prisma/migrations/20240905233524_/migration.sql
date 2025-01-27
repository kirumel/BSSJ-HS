-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_sjhsUserId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_sjhsUserId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "SJHSUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
