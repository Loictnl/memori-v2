import { Button } from "./ui/button";
import { ReactNode } from "react";

type ActionButtonProps = {
	label: string;
	colorClass?: string;
	onClick: () => void;
	variant?: "default" | "outline"; 
};

type ActionButtonsProps = {
	primaryButtons: ActionButtonProps[];
	secondaryButtons: ActionButtonProps[];
	extraButton?: ActionButtonProps;
};

export function ActionButtons({ primaryButtons, secondaryButtons, extraButton }: ActionButtonsProps) {
	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="flex gap-2 w-full">
				{primaryButtons.map((button, index) => (
					<Button
						key={index}
						className={`flex-1 ${button.colorClass || ""}`}
						variant={button.variant || "default"}
						onClick={button.onClick}>
						{button.label}
					</Button>
				))}
			</div>
			<div className="flex gap-2 w-full">
				{secondaryButtons.map((button, index) => (
					<Button
						key={index}
						className={`flex-1 ${button.colorClass || ""}`}
						variant={button.variant || "default"}
						onClick={button.onClick}>
						{button.label}
					</Button>
				))}
			</div>
			{extraButton && (
				<Button
					className="w-full mt-2"
					variant={extraButton.variant || "outline"}
					onClick={extraButton.onClick}>
					{extraButton.label}
				</Button>
			)}
		</div>
	);
}
