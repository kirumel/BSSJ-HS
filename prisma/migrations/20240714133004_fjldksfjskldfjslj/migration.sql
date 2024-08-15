-- AlterTable
ALTER TABLE "UnverifiedUser" ADD COLUMN     "class" INTEGER,
ADD COLUMN     "grade" INTEGER,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
