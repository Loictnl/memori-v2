-- CreateTable
CREATE TABLE "Heure" (
    "id" SERIAL NOT NULL,
    "heure" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,

    CONSTRAINT "Heure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Minute" (
    "id" SERIAL NOT NULL,
    "minute" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,

    CONSTRAINT "Minute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "francais" TEXT NOT NULL,
    "hiragana" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "kanji" TEXT,
    "categorie1" TEXT NOT NULL,
    "categorie2" TEXT NOT NULL,
    

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhraseExemple" (
    "id" SERIAL NOT NULL,
    "kanji" TEXT,
    "hiragana" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "francais" TEXT NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "PhraseExemple_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhraseExemple" ADD CONSTRAINT "PhraseExemple_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
