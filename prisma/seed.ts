const { PrismaClient } = require('@prisma/client');
const { words, heures, minutes } = require('../public/data/data'); // Assurez-vous que le chemin est correct

// Types explicites pour les données
interface Heure {
  heure: string;
  romaji: string;
}

interface Minute {
  minute: string;
  romaji: string;
}

interface PhraseExemple {
  kanji: string;
  hiragana: string;
  romaji: string;
  francais: string;
}

interface Word {
  francais: string;
  hiragana: string;
  romaji: string;
  kanji: string;
  categorie1: string;
  categorie2: string;
  phrases_exemples: PhraseExemple[];
}

const prisma = new PrismaClient();

async function main() {
  try {
    // Insérer les heures
    await prisma.heure.createMany({
      data: (heures as Heure[]).map((heure: Heure) => ({
        heure: heure.heure,
        romaji: heure.romaji,
      })),
    });

    // Insérer les minutes
    await prisma.minute.createMany({
      data: (minutes as Minute[]).map((minute: Minute) => ({
        minute: minute.minute,
        romaji: minute.romaji,
      })),
    });

    // Insérer les mots et leurs phrases d'exemple
    for (const word of words as Word[]) {
      await prisma.word.create({
        data: {
          francais: word.francais,
          hiragana: word.hiragana,
          romaji: word.romaji,
          kanji: word.kanji !== '-' ? word.kanji : null, // Gérer les valeurs manquantes
          categorie1: word.categorie1,
          categorie2: word.categorie2,
          phrasesExemples: {
            create: word.phrases_exemples.map((phrase: PhraseExemple) => ({
              kanji: phrase.kanji !== '-' ? phrase.kanji : null, // Gérer les valeurs manquantes
              hiragana: phrase.hiragana,
              romaji: phrase.romaji,
              francais: phrase.francais,
            })),
          },
        },
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
