import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Fonction d'implémentation de l'algorithme SM-2
function calculateSM2(
  quality: number,
  easeFactor: number,
  interval: number,
  repetitions: number
) {
  console.log('SM-2 calculation started with:', { quality, easeFactor, interval, repetitions });
  
  // Adapter la qualité aux valeurs 1, 3, 5
  quality = Math.max(1, Math.min(5, quality));
  
  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;

  // Mise à jour du facteur de facilité (EF)
  if (quality === 5) {
    // Pour "Facile", on augmente progressivement le facteur
    newEaseFactor = Math.min(2.5, easeFactor + 0.15);
  } else {
    // Pour les autres réponses, on utilise la formule adaptée
    newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }

  if (quality < 3) {
    // Si la réponse est "difficile", on recommence
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Sinon, on augmente le nombre de répétitions
    newRepetitions += 1;
    
    // Calcul du nouvel intervalle
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(newInterval * newEaseFactor);
    }
  }

  const now = new Date();
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(now.getDate() + newInterval);

  const result = {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
    lastReviewDate: now
  };
  
  console.log('SM-2 calculation result:', result);
  
  // Retourner les nouvelles valeurs
  return result;
}

// Nouvelle API pour gérer l'évaluation des mots avec App Router
export async function POST(request: Request) {
  console.log('API evaluateWord POST route called');
  
  try {
    const { wordId, quality } = await request.json();
    console.log('Request data:', { wordId, quality });
    
    // Récupérer le mot actuel
    console.log('Trying to find word with ID:', wordId);
    const word = await prisma.word.findUnique({
      where: { id: wordId }
    });
    
    if (!word) {
      console.error('Word not found:', wordId);
      return NextResponse.json({ message: 'Mot non trouvé' }, { status: 404 });
    }
    
    console.log('Found word:', word);
    
    // Calculer les nouvelles valeurs SM-2
    const sm2Values = calculateSM2(
      quality,
      word.easeFactor,
      word.interval,
      word.repetitions
    );
    
    console.log('Updating word in database with values:', sm2Values);
    
    // Mettre à jour le mot dans la base de données
    const updatedWord = await prisma.word.update({
      where: { id: wordId },
      data: sm2Values
    });
    
    console.log('Word updated successfully:', updatedWord);
    
    return NextResponse.json({ 
      message: 'Évaluation réussie',
      word: updatedWord
    });
  } catch (error) {
    console.error('Erreur lors de l\'évaluation:', error);
    return NextResponse.json({ message: 'Erreur lors de l\'évaluation du mot' }, { status: 500 });
  }
} 