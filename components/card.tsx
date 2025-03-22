import { EvaluationButtons } from "./evaluation-buttons";
import { FilterAndHelper } from "./filter-and-helper";
import { WordDisplay } from "./word-display";

export function Card() {
	return (
		<div className="bg-surface-primary rounded-2xl w-4/5 sm:w-1/3 h-80 p-4 flex flex-col items-center justify-between">
			<FilterAndHelper />
			<WordDisplay />
			<EvaluationButtons />
		</div>
	);
}
