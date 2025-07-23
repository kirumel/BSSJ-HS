-- CreateTable
CREATE TABLE "vacATObjectDB" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "grade" TEXT,
    "link" TEXT,
    "createdAt" TEXT,
    "type" TEXT,

    CONSTRAINT "vacATObjectDB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacATSupervisor" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TEXT,
    "check" TEXT,
    "comment" TEXT,
    "author" TEXT,
    "class" INTEGER,
    "grade" INTEGER,
    "studentnumber" INTEGER,
    "startTime" TEXT,
    "outTime" TEXT,
    "outTimeT" TEXT,
    "outTimeST" TEXT,
    "updatedAt" TEXT,
    "code" TEXT,

    CONSTRAINT "vacATSupervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacATObject" (
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
    "outTimeT" TEXT,
    "outTimeST" TEXT,
    "secondNumber" TEXT,
    "monTime" TEXT,
    "monChecked" TEXT,
    "tueTime" TEXT,
    "tueChecked" TEXT,
    "wedTime" TEXT,
    "wedChecked" TEXT,
    "thuTime" TEXT,
    "thuChecked" TEXT,
    "friTime" TEXT,
    "friChecked" TEXT,

    CONSTRAINT "vacATObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacCompareAT" (
    "id" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "data" TEXT,
    "grade" TEXT NOT NULL,

    CONSTRAINT "vacCompareAT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacCompareAT2" (
    "id" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "data" TEXT,
    "grade" TEXT NOT NULL,

    CONSTRAINT "vacCompareAT2_pkey" PRIMARY KEY ("id")
);
