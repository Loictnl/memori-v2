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
		? formatDistanceToNow(new Date(activeWord.nextReviewDate), { addSuffix: true, locale: fr })
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
						randomPhrase && (
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
