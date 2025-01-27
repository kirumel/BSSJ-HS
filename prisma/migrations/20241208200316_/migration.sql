-- CreateTable
CREATE TABLE "nightCompareAT" (
    "id" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "data" TEXT,
    "grade" TEXT NOT NULL,

    CONSTRAINT "nightCompareAT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etcData" (
    "id" TEXT NOT NULL,
    "inTime" TEXT,

    CONSTRAINT "etcData_pkey" PRIMARY KEY ("id")
);
