import { useData } from "@/contexts/Data";
import { Button } from "./ui/button";
import { useCallback } from "react";

export function ActionButtons() {
	const { handleNextWord, activeWord, evaluateWord } = useData();
	
	// Fonction pour évaluer un mot et passer au suivant
	const handleEvaluation = useCallback((quality: number) => {
		if (activeWord) {
			evaluateWord(activeWord.id, quality);
		}
		handleNextWord();
	}, [activeWord, evaluateWord, handleNextWord]);

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="flex gap-2 w-full">
				<Button
					className="flex-1 bg-red-500 hover:bg-red-600"
					onClick={() => handleEvaluation(1)}>
					Très difficile
				</Button>
				<Button
					className="flex-1 bg-orange-500 hover:bg-orange-600"
					onClick={() => handleEvaluation(2)}>
					Difficile
				</Button>
			</div>
			<div className="flex gap-2 w-full">
				<Button
					className="flex-1 bg-green-500 hover:bg-green-600"
					onClick={() => handleEvaluation(3)}>
					Facile
				</Button>
				<Button
					className="flex-1 bg-emerald-500 hover:bg-emerald-600"
					onClick={() => handleEvaluation(4)}>
					Très facile
				</Button>
			</div>
			<Button
				className="w-full mt-2"
				variant="outline"
				onClick={handleNextWord}>
				Passer
			</Button>
		</div>
	);
}
