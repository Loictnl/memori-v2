import { useData } from "@/contexts/Data";
import { Skeleton } from "./ui/skeleton";
import { ExemplePhrase } from "./exemple-phrase";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function WordDisplay() {
	const { activeWord, activeLanguage, loading } = useData();
	const phrasesLength = activeWord?.phrasesExemples?.length;
	let randomPhrase;
	if(phrasesLength) randomPhrase = activeWord?.phrasesExemples?.[Math.floor(Math.random() * phrasesLength)];
	
	// Formatage de la date de prochaine révision
	const nextReviewText = activeWord?.nextReviewDate 
		? (() => {
			try {
				// S'assurer que la date est valide
				const dateValue = new Date(activeWord.nextReviewDate);
				if (isNaN(dateValue.getTime())) {
					return "Date invalide";
				}
				return formatDistanceToNow(dateValue, { addSuffix: true, locale: fr });
			} catch (error) {
				console.error("Erreur de formatage de date:", error);
				return "Date non disponible";
			}
		})()
		: "Pas encore évalué";
	
	return (
		<div className="flex flex-col gap-2 items-center justify-center flex-1">
			{loading ? (
				<>
					<Skeleton className="w-40 h-8" />
					<Skeleton className="w-20 h-4" />
				</>
			) : (
				<>
					<h1 className="text-4xl font-bold">
						{activeWord?.[activeLanguage]}
					</h1>
					{
						randomPhrase && randomPhrase[activeLanguage] && (
							<ExemplePhrase 
								originalPhrase={randomPhrase[activeLanguage]} 
								frenchTranslation={randomPhrase.francais}
							/>
						)
					}
					<div className="text-xs text-gray-500 mt-2">
						Prochaine révision: {nextReviewText}
					</div>
				</>
			)}
		</div>
	);
}
