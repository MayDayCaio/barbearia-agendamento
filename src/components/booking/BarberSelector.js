import React, { useState } from "react";
import { mockBarbers } from "../../data/mockData"; // Importa os dados dos barbeiros

const BarberSelector = ({ onSelectBarber }) => {
	const [selectedId, setSelectedId] = useState(null);

	const handleSelect = (barber) => {
		setSelectedId(barber.id);
		// Adiciona um pequeno atraso para o efeito visual antes de avançar
		setTimeout(() => onSelectBarber(barber), 300);
	};

	return (
		<div>
			<h4 className="text-xl font-semibold text-center mb-6 text-amber-500">
				Escolha seu barbeiro
			</h4>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
				{Object.values(mockBarbers).map((barber) => (
					<div
						key={barber.id}
						onClick={() => handleSelect(barber)}
						className={`p-2 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 text-center ${
							selectedId === barber.id
								? "outline outline-2 outline-amber-500"
								: ""
						}`}>
						<img
							src={barber.imageUrl}
							alt={barber.name}
							className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 border-gray-600"
						/>
						<h5 className="font-semibold text-white">{barber.name}</h5>
					</div>
				))}
			</div>
		</div>
	);
};

export default BarberSelector;
