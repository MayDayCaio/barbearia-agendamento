// A URL base para as rotas de administração da nossa API
const API_URL = "http://localhost:5000/api/admin";

// --- Funções da API para Agendamentos ---

/**
 * Busca todos os agendamentos para o painel de administração.
 * @returns {Promise<Array>} Uma promessa que resolve para uma lista de agendamentos.
 */
export const getAppointments = async () => {
	const response = await fetch(`${API_URL}/appointments`);
	if (!response.ok) {
		throw new Error("Falha ao buscar agendamentos");
	}
	return response.json();
};

/**
 * Confirma um agendamento.
 * @param {number} id - O ID do agendamento a ser confirmado.
 * @returns {Promise<object>} O agendamento atualizado.
 */
export const confirmAppointment = async (id) => {
	const response = await fetch(`${API_URL}/appointments/${id}/confirm`, {
		method: "POST",
	});
	if (!response.ok) {
		throw new Error("Falha ao confirmar agendamento");
	}
	return response.json();
};

/**
 * Recusa um agendamento.
 * @param {number} id - O ID do agendamento a ser recusado.
 * @returns {Promise<object>} O agendamento atualizado.
 */
export const denyAppointment = async (id) => {
	const response = await fetch(`${API_URL}/appointments/${id}/deny`, {
		method: "POST",
	});
	if (!response.ok) {
		throw new Error("Falha ao recusar agendamento");
	}
	return response.json();
};

// --- Funções da API para Serviços ---

export const getAllServices = async () => {
	const response = await fetch(`${API_URL}/services`);
	if (!response.ok) {
		throw new Error("Falha ao buscar serviços");
	}
	return response.json();
};
export const addService = async (service) => {
	const response = await fetch(`${API_URL}/services`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(service),
	});
	if (!response.ok) {
		throw new Error("Falha ao adicionar serviço");
	}
	return response.json();
};
export const updateService = async (id, service) => {
	const response = await fetch(`${API_URL}/services/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(service),
	});
	if (!response.ok) {
		throw new Error("Falha ao atualizar serviço");
	}
	return response.json();
};
export const toggleServiceStatus = async (id, isActive) => {
	const response = await fetch(`${API_URL}/services/${id}/status`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ is_active: isActive }),
	});
	if (!response.ok) {
		throw new Error("Falha ao alterar status do serviço");
	}
	return response.json();
};

// --- Funções da API para Barbeiros ---

export const getAllBarbers = async () => {
	const response = await fetch(`${API_URL}/barbers`);
	if (!response.ok) {
		throw new Error("Falha ao buscar barbeiros");
	}
	return response.json();
};
export const addBarber = async (barber) => {
	const response = await fetch(`${API_URL}/barbers`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(barber),
	});
	if (!response.ok) {
		throw new Error("Falha ao adicionar barbeiro");
	}
	return response.json();
};
export const updateBarber = async (id, barber) => {
	const response = await fetch(`${API_URL}/barbers/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(barber),
	});
	if (!response.ok) {
		throw new Error("Falha ao atualizar barbeiro");
	}
	return response.json();
};
export const toggleBarberStatus = async (id, isActive) => {
	const response = await fetch(`${API_URL}/barbers/${id}/status`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ is_active: isActive }),
	});
	if (!response.ok) {
		throw new Error("Falha ao alterar status do barbeiro");
	}
	return response.json();
};
