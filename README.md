# Documentation du Projet Memori

## 1. Introduction et Objectif

Memori est une application web interactive dédiée à l'apprentissage du japonais et du français. Elle s'appuie sur une approche personnalisée et structurée pour faciliter la mémorisation du vocabulaire.

L'objectif principal est de permettre aux utilisateurs d'apprendre et de pratiquer du vocabulaire dans ces langues de manière efficace et interactive.

## 2. Stack Technique

L'application est construite avec les technologies suivantes :

- **Frontend** : Next.js avec TypeScript
- **Styles** : Tailwind CSS
- **Backend/Base de données** : Supabase (PostgreSQL)
- **Traitement IA** : Claude
- **ORM** : Prisma

## 3. Architecture de l'Application

### Structure des Répertoires

- `/app` : Contient les pages de l'application (structure Next.js)
  - `/mes-mots` : Page affichant la liste personnelle de mots
  - Autres pages comme la page quiz (page d'accueil)
- `/components` : Composants réutilisables
  - `/ui` : Composants d'interface utilisateur génériques
- `/public` : Ressources statiques
  - `/data` : Données statiques incluant les mots et phrases d'exemple
- `/prisma` : Configuration et schéma de la base de données

### Pages Principales

1. **Quiz** (page d'accueil) : Interface permettant aux utilisateurs de tester leurs connaissances
2. **Mes mots** : Page affichant la liste personnelle de vocabulaire

### Composants Clés

- **Header** : Barre de navigation avec des liens vers les différentes sections
- **Table** : Affiche les mots de vocabulaire dans la section "Mes mots"
- **ResetButton** : Permet de réinitialiser certaines données
- **FilterPopover** : Permet de filtrer les mots par langue, type et thème

## 4. Structure de la Base de Données

### Modèles de Données

La base de données est structurée autour de 4 modèles principaux :

#### Heure
```prisma
model Heure {
  id     Int    @id @default(autoincrement())
  heure  String
  romaji String
}
```

#### Minute
```prisma
model Minute {
  id     Int    @id @default(autoincrement())
  minute String
  romaji String
}
```

#### Word
```prisma
model Word {
  id                Int             @id @default(autoincrement())
  francais          String
  hiragana          String
  romaji            String
  kanji             String?
  categorie1        String          // Par exemple, Verbe, Nom, etc.
  categorie2        String          // Par exemple, Action, Nature, etc.
  phrasesExemples   PhraseExemple[] // Relation avec les phrases d'exemple
}
```

#### PhraseExemple
```prisma
model PhraseExemple {
  id       Int    @id @default(autoincrement())
  kanji    String?
  hiragana String
  romaji   String
  francais String
  wordId   Int    // Clé étrangère vers le modèle Word
  word     Word   @relation(fields: [wordId], references: [id], onUpdate: Cascade, onDelete: Cascade)
}
```

### Données Statiques

L'application utilise également un jeu de données statiques prédéfini (`/public/data/data.ts`) contenant des mots et phrases d'exemple. Ces données incluent :

- Vocabulaire japonais et français
- Traductions
- Transcriptions en hiragana, romaji et kanji
- Phrases d'exemple
- Catégorisation (Nom, Verbe, etc.)
- Sous-catégorisation (Nature, Action, Jours, Vêtement, etc.)

## 5. Fonctionnalités Principales

### Quiz Interactif
- Affichage aléatoire de mots basé sur les filtres appliqués
- Interface pour tester les connaissances de l'utilisateur
- Système de notation des réponses (correctes/incorrectes)

### Gestion du Vocabulaire Personnel
- Affichage de la liste complète des mots
- Possibilité de réinitialiser les données

### Système de Filtrage
- Filtrage par langue (japonais/français)
- Filtrage par type de mot (nom, verbe, etc.)
- Filtrage par thème (nature, action, jours, vêtements, etc.)

### Navigation
- Interface simple avec une barre de navigation permettant d'accéder aux différentes sections
- Structure claire et intuitive

## 6. Guide pour les Développeurs

### Principes de Développement
1. **Adhérence Stricte aux Spécifications** : Suivre la structure définie sans modifications majeures
2. **Implémentation Cohérente de l'API** : Assurer que les interactions backend s'alignent avec le flux de données attendu
3. **Cohérence de l'Expérience Utilisateur** : Garantir une navigation fluide, des filtres fonctionnels et une interface intuitive

### Recommandations pour Contribuer
- Comprendre le flux de données entre le frontend et la base de données
- Se familiariser avec la structure des données (mots, phrases d'exemple)
- Respecter la structure existante des composants et des modèles de données
- Tester rigoureusement les modifications pour assurer la cohérence de l'expérience utilisateur

## 7. Installation et Configuration

Pour mettre en place l'environnement de développement :

1. Cloner le dépôt
2. Installer les dépendances avec `npm install` ou `yarn install`
3. Configurer les variables d'environnement, notamment `DATABASE_URL` pour la connexion à Supabase
4. Exécuter `npx prisma generate` pour générer le client Prisma
5. Lancer l'application en mode développement avec `npm run dev` ou `yarn dev`

## Conclusion

Memori est une application d'apprentissage des langues bien structurée qui combine la gestion de vocabulaire et des quiz interactifs. Les développeurs qui rejoignent le projet doivent respecter les spécifications existantes pour maintenir la cohérence et la fonctionnalité de l'application.

Pour toute question ou clarification supplémentaire concernant l'architecture ou les fonctionnalités de l'application, n'hésitez pas à contacter l'équipe de développement.