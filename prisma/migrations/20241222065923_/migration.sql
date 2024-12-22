-- CreateTable
CREATE TABLE "eventQR" (
    "id" TEXT NOT NULL,
    "nameid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qrcode" TEXT NOT NULL,

    CONSTRAINT "eventQR_pkey" PRIMARY KEY ("id")
);
