-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_fkey";

-- DropIndex
DROP INDEX "SJHSUser_id_email_class_grade_image_role_name_nickname_key";

-- DropIndex
DROP INDEX "SJHSUser_id_name_nickname_key";

-- AddForeignKey
ALTER TABLE "SJHSUser" ADD CONSTRAINT "SJHSUser_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
