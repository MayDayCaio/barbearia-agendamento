const API_BASE_URL = "http://31.97.171.200:5000/api";

export const getServices = async () => {
	const response = await fetch(`${API_BASE_URL}/services`);
	if (!response.ok) throw new Error("Falha ao buscar serviços");
	return response.json();
};

export const getBarbers = async () => {
	const response = await fetch(`${API_BASE_URL}/barbers`);
	if (!response.ok) throw new Error("Falha ao buscar barbeiros");
	return response.json();
};

export const getAvailableSlots = async (barberId, date) => {
	const response = await fetch(
		`${API_BASE_URL}/appointments/${barberId}/${date}`
	);
	if (!response.ok) throw new Error("Falha ao buscar horários");
	return response.json();
};

export const createAppointment = async (appointmentData, token) => {
	const headers = { "Content-Type": "application/json" };
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	console.log("FRONTEND: A enviar pedido de agendamento...", appointmentData);

	const response = await fetch(`${API_BASE_URL}/appointments`, {
		method: "POST",
		headers,
		body: JSON.stringify(appointmentData),
	});

	console.log(
		`FRONTEND: Resposta recebida do servidor com status: ${response.status}`
	);

	if (!response.ok) {
		const errorText = await response.text();
		console.error("FRONTEND: Resposta de erro do servidor:", errorText);
		throw new Error(`Erro do servidor: ${response.statusText}`);
	}

	// Tenta ler a resposta como texto primeiro para evitar erros de JSON
	const responseText = await response.text();
	console.log("FRONTEND: Corpo da resposta recebido (texto):", responseText);

	try {
		// Se o texto não estiver vazio, tenta convertê-lo para JSON
		return responseText ? JSON.parse(responseText) : {};
	} catch (e) {
		console.error("FRONTEND: Erro ao tentar analisar a resposta JSON.", e);
		throw new Error("A resposta do servidor não é um JSON válido.");
	}
};