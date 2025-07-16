const API_URL = "http://31.97.171.200:3004/api"; // URL do seu backend

export const fetchServices = async () => {
	const response = await fetch(`${API_URL}/services`);
	if (!response.ok) throw new Error("Failed to fetch services");
	return response.json();
};

export const fetchBarbers = async () => {
	const response = await fetch(`${API_URL}/barbers`);
	if (!response.ok) throw new Error("Failed to fetch barbers");
	return response.json();
};

export const fetchAppointments = async (barberId, date) => {
	// Formata a data para YYYY-MM-DD
	const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
		.toISOString()
		.split("T")[0];
	const response = await fetch(
		`${API_URL}/appointments/${barberId}/${dateString}`
	);
	if (!response.ok) throw new Error("Failed to fetch appointments");
	return response.json();
};

export const createAppointment = async (bookingData) => {
	const response = await fetch(`${API_URL}/appointments`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(bookingData),
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.msg || "Failed to create appointment");
	}
	return response.json();
};
