-- AlterTable
ALTER TABLE "SJHSUser" ADD COLUMN     "class" INTEGER,
ADD COLUMN     "grade" INTEGER,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
