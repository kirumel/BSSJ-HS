-- CreateTable
CREATE TABLE "nightAttendanceObject" (
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

    CONSTRAINT "nightAttendanceObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nightAtSupervisor" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "check" TEXT,
    "comment" TEXT,
    "author" TEXT,
    "class" INTEGER,
    "grade" INTEGER,
    "studentnumber" INTEGER,
    "outTime" TEXT,
    "updatedAt" TEXT,

    CONSTRAINT "nightAtSupervisor_pkey" PRIMARY KEY ("id")
);
