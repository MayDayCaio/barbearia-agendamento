import React, { useState } from "react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext"; // Importar para usar os dados do cliente logado

// CORREÇÃO: Alterado de ({ booking, ... }) para ({ service, barber, dateTime, ... }) para aceitar props separadas
const Confirmation = ({ service, barber, dateTime, onConfirm, onBack }) => {
	const { user, token } = useAuth(); // Usar o contexto de autenticação

	// Preenche os dados se o utilizador estiver logado, senão começa vazio
	const [customerName, setCustomerName] = useState(user ? user.name : "");
	const [customerPhone, setCustomerPhone] = useState(""); // O telefone é pedido separadamente para garantir

	// Adiciona uma verificação de segurança para evitar erros se os dados não chegarem
	if (!service || !barber || !dateTime) {
		return (
			<div className="text-center text-white">
				<h2 className="text-2xl font-bold mb-4 text-red-500">
					Erro de Agendamento
				</h2>
				<p className="text-gray-400">
					Faltam informações para confirmar o agendamento. Por favor, volte e
					tente novamente.
				</p>
				<div className="mt-8">
					<button
						onClick={onBack}
						className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
						Voltar
					</button>
				</div>
			</div>
		);
	}

	const handleConfirm = () => {
		// Validação básica para convidados
		if (!user && (!customerName || !customerPhone)) {
			alert("Por favor, preencha o seu nome e telefone.");
			return;
		}

		const appointmentData = {
			service_id: service.id,
			barber_id: barber.id,
			appointment_time: new Date(dateTime).toISOString(),
			// Só envia nome e telefone se o utilizador não estiver logado
			...(!user && {
				customer_name: customerName,
				customer_phone: customerPhone,
			}),
		};
		// Passa os dados e o token (se existir) para a HomePage
		onConfirm(appointmentData, token);
	};

	return (
		<div className="text-center text-white">
			<h2 className="text-2xl font-bold mb-4">Confirme o seu Agendamento</h2>
			<div className="bg-gray-700 p-6 rounded-lg max-w-lg mx-auto text-left space-y-3">
				<p>
					<span className="font-semibold text-gray-400">Serviço:</span>{" "}
					{service.name}
				</p>
				<p>
					<span className="font-semibold text-gray-400">Barbeiro:</span>{" "}
					{barber.name}
				</p>
				<p>
					<span className="font-semibold text-gray-400">Data:</span>{" "}
					{moment(dateTime).format("dddd, D [de] MMMM [de] YYYY")}
				</p>
				<p>
					<span className="font-semibold text-gray-400">Hora:</span>{" "}
					{moment(dateTime).format("HH:mm")}
				</p>
				<p>
					<span className="font-semibold text-gray-400">Preço:</span> €
					{service.price}
				</p>
			</div>

			{/* Formulário de dados do cliente só aparece se não estiver logado */}
			{!user && (
				<div className="text-left max-w-lg mx-auto mt-6">
					<p className="text-lg font-semibold mb-4 text-center">
						Os seus dados para o agendamento
					</p>
					<div className="mb-4">
						<label className="block text-gray-400 mb-2">Nome Completo</label>
						<input
							type="text"
							value={customerName}
							onChange={(e) => setCustomerName(e.target.value)}
							className="w-full px-3 py-2 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="O seu nome"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-400 mb-2">Telefone</label>
						<input
							type="tel"
							value={customerPhone}
							onChange={(e) => setCustomerPhone(e.target.value)}
							className="w-full px-3 py-2 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="O seu número de telefone"
						/>
					</div>
				</div>
			)}

			<div className="mt-8 flex justify-center gap-4">
				<button
					onClick={onBack}
					className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
					Voltar
				</button>
				<button
					onClick={handleConfirm}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
					Confirmar Agendamento
				</button>
			</div>
		</div>
	);
};

export default Confirmation;
