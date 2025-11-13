-- CreateTable
CREATE TABLE "MissionRecord" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "mission" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionRecord_pkey" PRIMARY KEY ("id")
);
