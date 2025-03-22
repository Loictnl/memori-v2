import { useData } from "@/contexts/Data";
import { Button } from "./ui/button";

export function ActionButtons() {
	const { handleNextWord } = useData();
	return (
		<div className="flex gap-4 w-full">
			<Button
				className="flex-1"
				variant="default"
				onClick={handleNextWord}>
				Mot suivant
			</Button>
		</div>
	);
}
