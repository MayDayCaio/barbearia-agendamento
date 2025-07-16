import React from "react";

const StepsIndicator = ({ currentStep }) => {
	const steps = ["Serviço", "Barbeiro", "Data e Hora", "Confirmação"];
	return (
		<div className="flex justify-between items-start max-w-4xl mx-auto mb-8 text-sm md:text-base">
			{steps.map((label, index) => (
				<React.Fragment key={index}>
					<div
						className={`text-center transition-colors duration-300 ${
							currentStep >= index + 1 ? "text-amber-500" : "text-gray-500"
						}`}>
						<div
							className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 ${
								currentStep >= index + 1
									? "border-amber-500 bg-amber-500/10"
									: "border-gray-600"
							}`}>
							{currentStep > index + 1 ? "✔" : index + 1}
						</div>
						<p className="mt-2 font-semibold">{label}</p>
					</div>
					{index < steps.length - 1 && (
						<div
							className={`flex-1 h-1 bg-gray-700 mt-5 md:mt-6 mx-2 relative`}>
							<div
								className={`absolute top-0 left-0 h-full bg-amber-500 transition-all duration-300 ${
									currentStep > index + 1 ? "w-full" : "w-0"
								}`}></div>
						</div>
					)}
				</React.Fragment>
			))}
		</div>
	);
};

export default StepsIndicator;
