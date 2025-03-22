import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// Chemin vers le fichier data.json
const dataPath = path.join(process.cwd(), 'public/data/data.json');

// Interface de votre mot
interface Word {
  id: number;
  francais: string;
}

// API pour gérer la mise à jour des mots
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { wordId, updates } = req.body;
    console.log('Received update request:', wordId, updates); // Log des données reçues

    // Lire les données actuelles depuis le fichier JSON
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Trouver l'index du mot à mettre à jour
    const wordIndex = data.findIndex((word: Word) => word.id === wordId);

    if (wordIndex === -1) {
      console.error('Mot non trouvé:', wordId); // Log si le mot n'est pas trouvé
      return res.status(404).json({ message: 'Mot non trouvé' });
    }

    // Mettre à jour les champs du mot
    data[wordIndex] = {
      ...data[wordIndex],
      ...updates,
    };

    // Sauvegarder les modifications dans le fichier JSON
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('Mise à jour réussie pour le mot:', wordId); // Log de la mise à jour réussie

    return res.status(200).json({ message: 'Mise à jour réussie' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
