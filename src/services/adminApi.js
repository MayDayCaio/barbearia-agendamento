const API_URL = "http://31.97.171.200:3004/api/admin";

const request = (endpoint, options) => {
	const defaultOptions = { headers: { "Content-Type": "application/json" } };
	return fetch(`${API_URL}${endpoint}`, { ...defaultOptions, ...options }).then(
		(res) => (res.status !== 204 ? res.json() : res)
	);
};

// Serviços
export const fetchAdminServices = () => request("/services");
export const createService = (service) =>
	request("/services", { method: "POST", body: JSON.stringify(service) });
export const updateService = (id, service) =>
	request(`/services/${id}`, { method: "PUT", body: JSON.stringify(service) });
export const deleteService = (id) =>
	request(`/services/${id}`, { method: "DELETE" });

// Barbeiros
export const fetchAdminBarbers = () => request("/barbers");
export const createBarber = (barber) =>
	request("/barbers", { method: "POST", body: JSON.stringify(barber) });
export const updateBarber = (id, barber) =>
	request(`/barbers/${id}`, { method: "PUT", body: JSON.stringify(barber) });
export const deleteBarber = (id) =>
	request(`/barbers/${id}`, { method: "DELETE" });

// --- NOVAS FUNÇÕES PARA GESTÃO DE AGENDAMENTOS ---
export const fetchAdminAppointments = () => request("/appointments");
export const confirmAppointment = (id) =>
	request(`/appointments/${id}/confirm`, { method: "POST" });
export const denyAppointment = (id) =>
	request(`/appointments/${id}/deny`, { method: "POST" });
