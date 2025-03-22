/*
  Warnings:

  - You are about to drop the column `affichages` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `bonnesReponses` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `mauvaisesReponses` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `niveauLeitner` on the `Word` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PhraseExemple" DROP CONSTRAINT "PhraseExemple_wordId_fkey";

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "affichages",
DROP COLUMN "bonnesReponses",
DROP COLUMN "mauvaisesReponses",
DROP COLUMN "niveauLeitner";

-- AddForeignKey
ALTER TABLE "PhraseExemple" ADD CONSTRAINT "PhraseExemple_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
