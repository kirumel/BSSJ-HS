-- AlterTable
ALTER TABLE "compareAT" ADD COLUMN     "grade" TEXT;

-- CreateTable
CREATE TABLE "attendanceObjectDB2" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "link" TEXT,
    "createdAt" TEXT,
    "type" TEXT,

    CONSTRAINT "attendanceObjectDB2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendanceObjectDB3" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "link" TEXT,
    "createdAt" TEXT,
    "type" TEXT,

    CONSTRAINT "attendanceObjectDB3_pkey" PRIMARY KEY ("id")
);
