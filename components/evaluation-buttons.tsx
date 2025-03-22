import { useData } from "@/contexts/Data";
import { ActionButtons } from "./action-buttons";
import { useCallback } from "react";

// Configuration des boutons d'evaluation
const EVALUATION_CONFIG = [
  { quality: 1, label: "Difficile", colorClass: "bg-red-500 hover:bg-red-600" },
  { quality: 3, label: "Correct", colorClass: "bg-orange-500 hover:bg-orange-600" },
  { quality: 5, label: "Facile", colorClass: "bg-green-500 hover:bg-green-600" },
];

export function EvaluationButtons() {
	const { handleNextWord, activeWord, evaluateWord } = useData();
	
	// Fonction pour evaluer un mot et passer au suivant
	const handleEvaluation = useCallback((quality: number) => {
		if (activeWord) {
			evaluateWord(activeWord.id, quality);
		}
		handleNextWord();
	}, [activeWord, evaluateWord, handleNextWord]);

	// Preparer les configurations de boutons pour ActionButtons
	const primaryButtons = EVALUATION_CONFIG.slice(0, 1).map(config => ({
		label: config.label,
		colorClass: config.colorClass,
		onClick: () => handleEvaluation(config.quality)
	}));

	const secondaryButtons = EVALUATION_CONFIG.slice(1, 3).map(config => ({
		label: config.label,
		colorClass: config.colorClass,
		onClick: () => handleEvaluation(config.quality)
	}));

	const skipButton = {
		label: "Passer",
		onClick: handleNextWord
	};

	return (
		<ActionButtons
			primaryButtons={primaryButtons}
			secondaryButtons={secondaryButtons}
			extraButton={skipButton}
		/>
	);
} 