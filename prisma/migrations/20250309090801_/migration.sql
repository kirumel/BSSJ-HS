/*
  Warnings:

  - You are about to drop the column `type` on the `Post` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardName` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "type",
ADD COLUMN     "boardId" TEXT NOT NULL,
ADD COLUMN     "boardName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_id_name_key" ON "Board"("id", "name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_boardId_boardName_fkey" FOREIGN KEY ("boardId", "boardName") REFERENCES "Board"("id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
