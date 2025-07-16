import React, { useState } from "react";

const Confirmation = ({ booking, onConfirm }) => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");

	// Retorna nulo se algum dado essencial do agendamento estiver em falta
	if (!booking.service || !booking.barber || !booking.date || !booking.time) {
		return (
			<p className="text-center text-red-400">
				Ocorreu um erro. Por favor, tente novamente.
			</p>
		);
	}

	// Formata a data para uma melhor apresentação
	const dateOptions = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const formattedDate = new Date(booking.date).toLocaleDateString(
		"pt-PT",
		dateOptions
	);

	const handleSubmit = () => {
		if (name && phone) {
			onConfirm({ name, phone });
		} else {
			alert("Por favor, preencha o seu nome e telefone.");
		}
	};

	return (
		<div>
			<h4 className="text-xl font-semibold text-center mb-6 text-amber-500">
				Confirme os seus dados
			</h4>
			<div className="max-w-md mx-auto bg-gray-700 p-6 rounded-lg">
				<div className="mb-6 space-y-2 text-gray-300">
					<p>
						<strong className="text-amber-500">Serviço:</strong>{" "}
						{booking.service.name}
					</p>
					<p>
						<strong className="text-amber-500">Barbeiro:</strong>{" "}
						{booking.barber.name}
					</p>
					<p>
						<strong className="text-amber-500">Data:</strong> {formattedDate}
					</p>
					<p>
						<strong className="text-amber-500">Horário:</strong> {booking.time}
					</p>
					<p className="text-lg font-bold">
						<strong className="text-amber-500">Total:</strong> R${" "}
						{booking.service.price.toFixed(2)}
					</p>
				</div>
				<div className="space-y-4">
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="O seu Nome Completo"
						className="w-full bg-gray-800 border-gray-600 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500"
					/>
					<input
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="O seu Telefone (WhatsApp)"
						className="w-full bg-gray-800 border-gray-600 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500"
					/>
					<button
						onClick={handleSubmit}
						className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors">
						Confirmar Agendamento
					</button>
				</div>
			</div>
		</div>
	);
};

export default Confirmation;
