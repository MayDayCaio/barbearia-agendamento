import React from "react";

// CORREÇÃO: O componente agora apenas recebe a lista de barbeiros (props)
// e não precisa mais de buscar dados por si só.
const BarberSelector = ({ barbers, onSelectBarber, onBack }) => {
	return (
		<div className="text-center text-white">
			<h2 className="text-2xl font-bold mb-6">Escolha o seu Barbeiro</h2>

			{/* Mostra uma mensagem se a lista de barbeiros estiver vazia */}
			{barbers.length === 0 && (
				<p className="text-gray-400">
					Não há barbeiros disponíveis no momento.
				</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Itera sobre a lista de barbeiros recebida via props */}
				{barbers.map((barber) => (
					<div
						key={barber.id}
						onClick={() => onSelectBarber(barber)}
						className="bg-gray-700 p-6 rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-300">
						<p className="text-xl font-semibold">{barber.name}</p>
					</div>
				))}
			</div>

			<div className="mt-8">
				<button
					onClick={onBack}
					className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
					Voltar
				</button>
			</div>
		</div>
	);
};

export default BarberSelector;
