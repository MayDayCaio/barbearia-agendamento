// A URL base para as rotas da nossa API pública
const API_BASE_URL = "http://31.97.171.200:5000/api";

/**
 * Busca todos os serviços ativos.
 * @returns {Promise<Array>} Uma lista de serviços.
 */
export const getServices = async () => {
	const response = await fetch(`${API_BASE_URL}/services`);
	if (!response.ok) {
		throw new Error("Falha ao buscar serviços");
	}
	return response.json();
};

/**
 * Busca todos os barbeiros ativos.
 * @returns {Promise<Array>} Uma lista de barbeiros.
 */
export const getBarbers = async () => {
	const response = await fetch(`${API_BASE_URL}/barbers`);
	if (!response.ok) {
		throw new Error("Falha ao buscar barbeiros");
	}
	return response.json();
};

/**
 * Busca os horários disponíveis para um barbeiro numa data específica.
 * @param {number} barberId - O ID do barbeiro.
 * @param {string} date - A data no formato 'YYYY-MM-DD'.
 * @returns {Promise<Array>} Uma lista de horários disponíveis.
 */
export const getAvailableSlots = async (barberId, date) => {
	const response = await fetch(
		`${API_BASE_URL}/appointments/${barberId}/${date}`
	);
	if (!response.ok) {
		throw new Error("Falha ao buscar horários");
	}
	return response.json();
};

/**
 * Cria um novo agendamento.
 * @param {object} appointmentData - Os dados do agendamento.
 * @param {string|null} token - O token JWT do utilizador, se estiver autenticado.
 * @returns {Promise<object>} O novo agendamento criado.
 */
export const createAppointment = async (appointmentData, token) => {
	const headers = { "Content-Type": "application/json" };
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}
	const response = await fetch(`${API_BASE_URL}/appointments`, {
		method: "POST",
		headers,
		body: JSON.stringify(appointmentData),
	});
	if (!response.ok) {
		throw new Error("Falha ao criar agendamento");
	}
	return response.json();
};

/**
 * Busca os agendamentos do utilizador autenticado.
 * @param {string} token - O token JWT do utilizador.
 * @returns {Promise<Array>} Uma lista dos agendamentos do utilizador.
 */
export const getMyAppointments = async (token) => {
	const response = await fetch(`${API_BASE_URL}/my-appointments`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!response.ok) {
		throw new Error("Falha ao buscar os seus agendamentos");
	}
	return response.json();
};
