// A URL base para as rotas de administração da nossa API
const API_URL = "http://31.97.171.200:5000/api/admin";

export const getAppointments = async () => {
	const response = await fetch(`${API_URL}/appointments`);
	if (!response.ok) throw new Error("Falha ao buscar agendamentos");
	return response.json();
};

export const confirmAppointment = async (id) => {
	const response = await fetch(`${API_URL}/appointments/${id}/confirm`, {
		method: "POST",
	});
	if (!response.ok) throw new Error("Falha ao confirmar agendamento");
	return response.json();
};

export const denyAppointment = async (id) => {
	const response = await fetch(`${API_URL}/appointments/${id}/deny`, {
		method: "POST",
	});
	if (!response.ok) throw new Error("Falha ao recusar agendamento");
	return response.json();
};

export const cancelAppointmentByAdmin = async (appointmentId) => {
	const response = await fetch(
		`${API_URL}/appointments/${appointmentId}/cancel`,
		{
			method: "POST",
		}
	);
	if (!response.ok) {
		throw new Error("Falha ao cancelar o agendamento.");
	}
	return response.json();
};

export const getAllServices = async () => {
	const response = await fetch(`${API_URL}/services`);
	if (!response.ok) throw new Error("Falha ao buscar serviços");
	return response.json();
};

export const addService = async (service) => {
	const response = await fetch(`${API_URL}/services`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(service),
	});
	if (!response.ok) throw new Error("Falha ao adicionar serviço");
	return response.json();
};

export const updateService = async (id, service) => {
	const response = await fetch(`${API_URL}/services/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(service),
	});
	if (!response.ok) throw new Error("Falha ao atualizar serviço");
	return response.json();
};

export const toggleServiceStatus = async (id, isActive) => {
	const response = await fetch(`${API_URL}/services/${id}/status`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ is_active: isActive }),
	});
	if (!response.ok) throw new Error("Falha ao alterar status do serviço");
	return response.json();
};

export const getAllBarbers = async () => {
	const response = await fetch(`${API_URL}/barbers`);
	if (!response.ok) throw new Error("Falha ao buscar barbeiros");
	return response.json();
};

export const addBarber = async (barber) => {
	const response = await fetch(`${API_URL}/barbers`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(barber),
	});
	if (!response.ok) throw new Error("Falha ao adicionar barbeiro");
	return response.json();
};

export const updateBarber = async (id, barber) => {
	const response = await fetch(`${API_URL}/barbers/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(barber),
	});
	if (!response.ok) throw new Error("Falha ao atualizar barbeiro");
	return response.json();
};

export const toggleBarberStatus = async (id, isActive) => {
	const response = await fetch(`${API_URL}/barbers/${id}/status`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ is_active: isActive }),
	});
	if (!response.ok) throw new Error("Falha ao alterar status do barbeiro");
	return response.json();
};
