import React from "react";

// CORREÇÃO: O componente agora apenas recebe a lista de serviços (props)
// e não precisa mais de buscar dados ou usar mockData.
const ServiceSelector = ({ services, onSelectService }) => {
	return (
		<div className="text-center text-white">
			<h2 className="text-2xl font-bold mb-6">Escolha o Serviço</h2>

			{/* Mostra uma mensagem se a lista de serviços estiver vazia */}
			{services.length === 0 && (
				<p className="text-gray-400">Não há serviços disponíveis no momento.</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Itera sobre a lista de serviços recebida via props */}
				{services.map((service) => (
					<div
						key={service.id}
						onClick={() => onSelectService(service)}
						className="bg-gray-700 p-6 rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between">
						<h3 className="text-xl font-semibold mb-2">{service.name}</h3>
						<div className="text-left text-gray-300">
							<p>Duração: {service.duration} min</p>
							<p>Preço: R${service.price}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ServiceSelector;
