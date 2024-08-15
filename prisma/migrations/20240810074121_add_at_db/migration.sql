-- CreateTable
CREATE TABLE "attendanceObjectDB" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "link" TEXT,
    "createdAt" TEXT,
    "type" TEXT,

    CONSTRAINT "attendanceObjectDB_pkey" PRIMARY KEY ("id")
);
