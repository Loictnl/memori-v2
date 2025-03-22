"use client";
import { LANGUAGES } from "@/lib/types";
import { languages } from "@/lib/values";
import { PhraseExemple, Word } from "@prisma/client";
import axios from "axios";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export const DataContext = createContext<ReturnType<typeof useDataState>>(
    null!
);

export const useDataState = () => {
    const [loading, setLoading] = useState(true);
    const [words, setWords] = useState<Word[]>([]);
    const [activeWord, setActiveWord] = useState<Word & { phrasesExemples?: PhraseExemple[] } | null>(null);
    const [activeLanguage, setActiveLanguage] = useState<LANGUAGES>("francais");
    const [filters, setFilters] = useState<
        Record<"lang" | "type" | "theme", string[]>
    >({ lang: [], type: [], theme: [] });

    // Fonction pour évaluer un mot selon l'algorithme SM-2
    async function evaluateWord(wordId: number, quality: number) {
        try {
            const response = await axios.post('/api/evaluateWord', { wordId, quality });
            
            if (response.status === 200) {
                // Mettre à jour les mots en local
                setWords(prevWords => 
                    prevWords.map(word => {
                        if (word.id === wordId) {
                            // Calcul simplifié du nouvel état SM-2
                            let newEaseFactor = word.easeFactor || 2.5;
                            let newInterval = word.interval || 1;
                            let newRepetitions = word.repetitions || 0;
                            
                            // Ajuster le facteur de facilité
                            newEaseFactor = Math.max(1.3, newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
                            
                            // Ajuster l'intervalle et les répétitions
                            if (quality < 2) {
                                // Réinitialiser pour les réponses "très difficile"
                                newRepetitions = 0;
                                newInterval = 1;
                            } else {
                                newRepetitions += 1;
                                
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
                            
                            return {
                                ...word,
                                easeFactor: newEaseFactor,
                                interval: newInterval,
                                repetitions: newRepetitions,
                                lastReviewDate: now,
                                nextReviewDate: nextReviewDate
                            };
                        }
                        return word;
                    })
                );
            }
        } catch (error) {
            console.error('Erreur lors de l\'évaluation du mot:', error);
        }
    }

    // Vérifier si un mot doit être dégradé (non vu depuis 30+ jours)
    function checkWordDegradation(word: Word): Word {
        if (!word.lastReviewDate) return word;
        
        const lastReview = new Date(word.lastReviewDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24));
        
        // Si le mot n'a pas été vu depuis 30 jours
        if (daysDiff >= 30) {
            return {
                ...word,
                // Réduire le facteur de facilité de 0.2
                easeFactor: Math.max(1.3, word.easeFactor - 0.2),
                // Diviser l'intervalle par 2, minimum 1
                interval: Math.max(1, Math.floor(word.interval / 2)),
                // Garder le même nombre de répétitions pour conserver l'historique
            };
        }
        
        return word;
    }

    function generateRandomWord() {
        if (words.length === 0) return null;
        
        // Filtrer les mots selon les filtres sélectionnés
        let filteredWords = words.filter((word) => {
            if (
                filters.type.length > 0 &&
                !filters.type.includes(word.categorie1)
            )
                return false;
            if (
                filters.theme.length > 0 &&
                !filters.theme.includes(word.categorie2)
            )
                return false;
            return true;
        });

        if (filteredWords.length === 0) return null;

        // Vérifier et appliquer la dégradation aux mots non vus depuis 30+ jours
        filteredWords = filteredWords.map(checkWordDegradation);
        
        // Prioriser les mots à réviser (dont la date de prochaine révision est passée)
        const now = new Date();
        const wordsToReview = filteredWords.filter(word => 
            word.nextReviewDate && new Date(word.nextReviewDate) <= now
        );
        
        let randomWord;
        
        // S'il y a des mots à réviser, les prioriser
        if (wordsToReview.length > 0) {
            const randomIndex = Math.floor(Math.random() * wordsToReview.length);
            randomWord = wordsToReview[randomIndex];
        } else {
            // Sinon, sélectionner un mot aléatoire parmi tous les mots filtrés
            const randomIndex = Math.floor(Math.random() * filteredWords.length);
            randomWord = filteredWords[randomIndex];
        }
        
        setActiveWord(randomWord);
        
        // Sélectionner une langue aléatoire (filtré si nécessaire)
        const filteredLanguages = languages.filter((lang) => {
            if (filters.lang.length > 0 && !filters.lang.includes(lang))
                return false;
            return true;
        });
        
        setActiveLanguage(
            filteredLanguages[
                Math.floor(Math.random() * filteredLanguages.length)
            ]
        );
    }

    function handleNextWord() {
        generateRandomWord();
    }

    useEffect(() => {
        generateRandomWord();
    }, [words]);

    useEffect(() => {
        if (filters.lang.length > 0 && !filters.lang.includes(activeLanguage)) {
            generateRandomWord();
        }
        if (
            !activeWord?.categorie1 ||
            (filters.type.length > 0 &&
                !filters.type.includes(activeWord?.categorie1))
        ) {
            generateRandomWord();
        }
        if (
            !activeWord?.categorie2 ||
            (filters.theme.length > 0 &&
                !filters.theme.includes(activeWord?.categorie2))
        ) {
            generateRandomWord();
        }
    }, [filters]);

    return {
        words,
        setWords,
        activeWord,
        setActiveWord,
        generateRandomWord,
        activeLanguage,
        handleNextWord,
        evaluateWord,
        filters,
        setFilters,
        loading,
        setLoading,
    };
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const value = useDataState();
    return (
        <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
