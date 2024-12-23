-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_email_class_grade_image_role_name_nickname_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "SJHSUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
