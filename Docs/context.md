# Documentation du Projet Memori

## Sommaire
1. [Introduction](#1-introduction)
2. [Architecture Technique](#2-architecture-technique)
3. [Structure du Projet](#3-structure-du-projet)
4. [Base de Données](#4-base-de-données)
5. [Fonctionnalités Principales](#5-fonctionnalités-principales)
6. [Workflows et Cas d'Utilisation](#6-workflows-et-cas-dutilisation)
7. [Configuration et Déploiement](#7-configuration-et-déploiement)
8. [Guide du Contributeur](#8-guide-du-contributeur)

## 1. Introduction

Memori est une application web interactive dédiée à l'apprentissage du japonais et du français. Le projet vise à offrir une solution personnalisée et structurée pour faciliter la mémorisation du vocabulaire entre ces deux langues.

### Objectifs clés
- Fournir une plateforme d'apprentissage intuitive et efficace
- Permettre aux utilisateurs de constituer leur propre base de vocabulaire
- Proposer des quiz interactifs pour renforcer la mémorisation
- Fournir des phrases d'exemple pour contextualiser le vocabulaire
- Adapter l'apprentissage selon les préférences et le niveau de l'utilisateur

L'application s'adresse principalement aux apprenants de différents niveaux souhaitant enrichir leur vocabulaire dans un environnement d'apprentissage structuré.

## 2. Architecture Technique

### Stack Technique Complète
- **Frontend** : 
  - Next.js 14+ avec TypeScript
  - Système de routing et de pages basé sur les dossiers (App Router)
  - Composants React modernes avec hooks et context API
  
- **Styles** : 
  - Tailwind CSS pour le design responsive et l'interface utilisateur
  - Système de composants UI modulaires et réutilisables
  
- **Backend** : 
  - Supabase comme BaaS (Backend as a Service)
  - API RESTful pour les interactions client-serveur
  
- **Base de données** : 
  - PostgreSQL géré par Supabase
  - Prisma comme ORM pour les interactions avec la base de données
  
- **IA et Traitement** : 
  - Intégration avec Claude pour des fonctionnalités d'assistance
  
- **Déploiement** :
  - Vercel pour l'hébergement et le déploiement continu

### Schéma d'Architecture
```
                 ┌─────────────┐
                 │   Client    │
                 │   Browser   │
                 └──────┬──────┘
                        │
                        ▼
┌───────────────────────────────────────┐
│            Next.js Frontend           │
│  ┌─────────┐  ┌─────────┐ ┌────────┐  │
│  │  Pages  │  │   API   │ │   UI   │  │
│  └─────────┘  └─────────┘ └────────┘  │
└───────────────────┬───────────────────┘
                    │
     ┌──────────────┴──────────────┐
     │                             │
     ▼                             ▼
┌─────────┐                  ┌──────────┐
│ Supabase│◄─────────────────┤  Prisma  │
└─────────┘                  └──────────┘
     │
     ▼
┌─────────────┐
│ PostgreSQL  │
└─────────────┘
```

## 3. Structure du Projet

### Organisation des Dossiers
```
memori/
├── app/                  # Pages et routes Next.js
│   ├── api/              # API Routes
│   ├── mes-mots/         # Page de liste de vocabulaire
│   ├── quiz/             # Page principale des quiz
│   └── layout.tsx        # Layout principal
├── components/           # Composants React réutilisables
│   ├── ui/               # Composants d'interface utilisateur génériques
│   ├── Header.tsx        # Barre de navigation
│   ├── Table.tsx         # Tableau de mots
│   ├── ResetButton.tsx   # Bouton de réinitialisation
│   └── FilterPopover.tsx # Filtre pour les mots
├── public/               # Ressources statiques
│   └── data/             # Données statiques (mots et phrases)
├── prisma/               # Configuration Prisma
│   └── schema.prisma     # Schéma de la base de données
├── styles/               # Styles globaux
├── lib/                  # Utilitaires et fonctions
├── Docs/                 # Documentation
├── package.json          # Dépendances
└── tsconfig.json         # Configuration TypeScript
```

### Pages Principales
1. **Quiz (Page d'accueil)**
   - Interface principale pour les tests de connaissances
   - Options de configuration des quiz
   - Système de score et de progression

2. **Mes Mots**
   - Liste personnalisée de vocabulaire
   - Fonctionnalités de tri et filtrage
   - Actions CRUD sur les mots

### Composants Clés
1. **Header**
   - Navigation principale
   - Liens vers les différentes sections
   - Menu responsive pour mobile

2. **Table**
   - Affichage des mots dans un format tabulaire
   - Pagination et tri
   - Actions rapides sur les entrées

3. **FilterPopover**
   - Filtrage par langue (français/japonais)
   - Filtrage par catégorie (Nom, Verbe, etc.)
   - Filtrage par thème (Nature, Jours, etc.)

4. **ResetButton**
   - Réinitialisation des filtres ou des résultats de quiz

## 4. Base de Données

### Modèles et Relations
Le schéma de la base de données est défini dans `prisma/schema.prisma` et comprend les modèles suivants:

#### Word
Représente un mot de vocabulaire avec:
```prisma
model Word {
  id                Int             @id @default(autoincrement())
  francais          String
  hiragana          String
  romaji            String
  kanji             String?
  categorie1        String          // Type (Verbe, Nom, etc.)
  categorie2        String          // Thème (Action, Nature, etc.)
  phrasesExemples   PhraseExemple[] // Relation avec les phrases d'exemple
}
```

#### PhraseExemple
Stocke les phrases d'exemple liées à un mot:
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

#### Heure et Minute
Modèles spécifiques pour les expressions de temps:
```prisma
model Heure {
  id     Int    @id @default(autoincrement())
  heure  String
  romaji String
}

model Minute {
  id     Int    @id @default(autoincrement())
  minute String
  romaji String
}
```

### Diagramme des Relations
```
┌─────────────┐       ┌─────────────────┐
│    Word     │       │  PhraseExemple  │
├─────────────┤       ├─────────────────┤
│ id          │       │ id              │
│ francais    │       │ kanji           │
│ hiragana    │       │ hiragana        │
│ romaji      │ 1───n │ romaji          │
│ kanji       │       │ francais        │
│ categorie1  │       │ wordId          │
│ categorie2  │       │                 │
└─────────────┘       └─────────────────┘

┌─────────────┐       ┌─────────────────┐
│    Heure    │       │     Minute      │
├─────────────┤       ├─────────────────┤
│ id          │       │ id              │
│ heure       │       │ minute          │
│ romaji      │       │ romaji          │
└─────────────┘       └─────────────────┘
```

### Gestion des Données
- Les données initiales sont stockées dans `/public/data/data.ts`
- Prisma est utilisé pour toutes les opérations CRUD
- Les requêtes sont optimisées pour minimiser les appels à la base de données

## 5. Fonctionnalités Principales

### Apprentissage du Vocabulaire
- **Exploration**: Parcourir les mots par catégorie et thème
- **Détail**: Voir les informations complètes sur chaque mot
- **Contexte**: Phrases d'exemple pour comprendre l'usage

### Quiz et Tests
- **Quiz personnalisés**: Configuration selon la catégorie, le thème et la difficulté
- **Quiz aléatoires**: Sélection aléatoire basée sur les préférences
- **Suivi de progression**: Statistiques sur les performances

### Gestion Personnelle
- **Liste personnalisée**: Ajout/suppression de mots à sa liste
- **Notes personnelles**: Possibilité d'ajouter des annotations
- **Marquage**: Identification des mots difficiles pour révision

### Aspects Linguistiques
- **Support multilingue**: Français et japonais
- **Transcription**: Hiragana, romaji et kanji
- **Prononciation**: Aide à la prononciation correcte

## 6. Workflows et Cas d'Utilisation

### Parcours Utilisateur Typique
1. L'utilisateur arrive sur la page d'accueil (Quiz)
2. Il consulte les mots disponibles dans "Mes Mots"
3. Il peut filtrer les mots selon ses besoins
4. Il commence un quiz personnalisé
5. Il révise les résultats et identifie les points à améliorer

### Ajout de Nouveaux Mots
1. Accéder à l'interface d'ajout dans "Mes Mots"
2. Remplir les champs requis (français, hiragana, romaji, etc.)
3. Ajouter des phrases d'exemple (facultatif)
4. Enregistrer le nouveau mot

### Réalisation d'un Quiz
1. Configurer les paramètres du quiz (catégorie, difficulté)
2. Répondre aux questions présentées
3. Voir le score final et les corrections
4. Réviser les mots problématiques

## 7. Configuration et Déploiement

### Prérequis
- Node.js 18+ et npm/yarn
- Compte Supabase
- Compte Vercel (optionnel pour le déploiement)

### Installation Locale
1. Cloner le dépôt:
   ```bash
   git clone [url-du-depot]
   cd memori
   ```

2. Installer les dépendances:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configurer les variables d'environnement:
   - Créer un fichier `.env.local` à la racine
   - Ajouter les variables nécessaires:
     ```
     DATABASE_URL="postgresql://..."
     NEXT_PUBLIC_SUPABASE_URL="https://..."
     NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
     ```

4. Initialiser la base de données:
   ```bash
   npx prisma migrate dev
   ```

5. Lancer le serveur de développement:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

### Déploiement
1. Configurer un projet sur Vercel
2. Connecter le dépôt GitHub
3. Configurer les variables d'environnement
4. Déployer le projet

## 8. Guide du Contributeur

### Bonnes Pratiques
- Suivre les standards de code TypeScript/React
- Utiliser des composants fonctionnels avec hooks
- Maintenir une architecture modulaire
- Documenter les nouvelles fonctionnalités

### Domaines d'Amélioration Potentiels
- Enrichissement de la base de données de vocabulaire
- Amélioration de l'interface utilisateur
- Ajout de nouvelles fonctionnalités d'apprentissage
- Optimisation des performances

### Processus de Contribution
1. Créer une branche pour chaque nouvelle fonctionnalité
2. Développer et tester localement
3. Soumettre une pull request avec description détaillée
4. Participer à la revue de code

---

## 📝 Notes Techniques Additionnelles

### État Actuel du Projet
- Version: 1.0.0 (Beta)
- Dernière mise à jour: [Date]
- Nombre de mots dans la base: ~100 entrées

### Roadmap
- Intégration de l'audio pour la prononciation
- Ajout du support pour d'autres langues
- Système de compte utilisateur avancé
- Application mobile (PWA)

### Contact et Support
Pour toute question ou suggestion concernant le développement, contactez [Contact].

---

*Document créé le [Date] - Projet Memori © [Année]*
