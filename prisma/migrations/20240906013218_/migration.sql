/*
  Warnings:

  - A unique constraint covering the columns `[id,name,nickname]` on the table `SJHSUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,email,class,grade,image,role,name,nickname]` on the table `SJHSUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "authorID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SJHSUser_id_name_nickname_key" ON "SJHSUser"("id", "name", "nickname");

-- CreateIndex
CREATE UNIQUE INDEX "SJHSUser_id_email_class_grade_image_role_name_nickname_key" ON "SJHSUser"("id", "email", "class", "grade", "image", "role", "name", "nickname");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_email_class_grade_image_role_name_nickname_fkey" FOREIGN KEY ("id", "email", "class", "grade", "image", "role", "name", "nickname") REFERENCES "SJHSUser"("id", "email", "class", "grade", "image", "role", "name", "nickname") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
