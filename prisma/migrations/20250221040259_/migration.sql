-- CreateTable
CREATE TABLE "mainAttendanceObject" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "check" TEXT,
    "comment" TEXT,
    "author" TEXT,
    "class" INTEGER,
    "grade" INTEGER,
    "studentnumber" INTEGER,
    "updatedAt" TEXT,

    CONSTRAINT "mainAttendanceObject_pkey" PRIMARY KEY ("id")
);
