-- AlterTable
ALTER TABLE "UnverifiedUser" ADD COLUMN     "handle" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "handle" TEXT;

-- CreateTable
CREATE TABLE "attendanceObject" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "check" BOOLEAN,
    "comment" TEXT,
    "author" TEXT NOT NULL,

    CONSTRAINT "attendanceObject_pkey" PRIMARY KEY ("id")
);
