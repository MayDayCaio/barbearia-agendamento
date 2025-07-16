import React from "react";
import { Check } from "lucide-react";

const ConfirmationModal = ({ booking, show, onClose }) => {
	if (!show) return null;

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

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-50">
			<div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in-up">
				<div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
					<Check className="w-10 h-10 text-white" />
				</div>
				<h2 className="text-2xl font-bold text-white mb-3">
					Agendamento Confirmado!
				</h2>
				<p className="text-gray-300 mb-6">
					O seu horário foi reservado com sucesso. Será enviado um lembrete
					próximo da data.
				</p>
				<div className="text-left bg-gray-700 p-4 rounded-lg mb-6 space-y-2">
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
				</div>
				<button
					onClick={onClose}
					className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-lg">
					Fechar
				</button>
			</div>
		</div>
	);
};

export default ConfirmationModal;
