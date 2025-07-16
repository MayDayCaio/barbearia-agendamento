import React from "react";

// Componente para o status do agendamento
const StatusBadge = ({ status }) => {
	const statusStyles = {
		pending: "bg-yellow-500 text-white",
		confirmed: "bg-green-500 text-white",
		denied: "bg-red-500 text-white",
		completed: "bg-blue-500 text-white",
	};
	const statusText = {
		pending: "Pendente",
		confirmed: "Confirmado",
		denied: "Recusado",
		completed: "Concluído",
	};
	return (
		<span
			className={`px-2 py-1 rounded-full text-xs font-semibold ${
				statusStyles[status] || "bg-gray-500"
			}`}>
			{statusText[status] || status}
		</span>
	);
};

export default StatusBadge;
