import React, { useState } from "react";
import { mockServices } from "../../data/mockData"; // Importa os dados

const ServiceSelector = ({ onSelectService }) => {
	const [selectedId, setSelectedId] = useState(null);

	const handleSelect = (service) => {
		setSelectedId(service.id);
		// Adiciona um pequeno atraso para o efeito visual antes de avançar
		setTimeout(() => onSelectService(service), 300);
	};

	return (
		<div>
			<h4 className="text-xl font-semibold text-center mb-6 text-amber-500">
				Escolha o serviço desejado
			</h4>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
				{Object.values(mockServices).map((service) => (
					<div
						key={service.id}
						onClick={() => handleSelect(service)}
						className={`p-4 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
							selectedId === service.id
								? "outline outline-2 outline-amber-500"
								: ""
						}`}>
						<h5 className="font-bold text-white">{service.name}</h5>
						<div className="text-sm text-gray-400 mt-2">
							<p>R$ {service.price.toFixed(2)}</p>
							<p>{service.duration} min</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ServiceSelector;
