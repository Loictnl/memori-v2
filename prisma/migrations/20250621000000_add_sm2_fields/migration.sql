-- AlterTable
ALTER TABLE "Word" ADD COLUMN "easeFactor" FLOAT NOT NULL DEFAULT 2.5;
ALTER TABLE "Word" ADD COLUMN "interval" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Word" ADD COLUMN "repetitions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Word" ADD COLUMN "nextReviewDate" TIMESTAMP(3);
ALTER TABLE "Word" ADD COLUMN "lastReviewDate" TIMESTAMP(3); 