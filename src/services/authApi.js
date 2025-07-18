const AUTH_API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = async (credentials) => {
	const response = await fetch(`${AUTH_API_URL}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Falha no login");
	}
	return response.json();
};

export const register = async (userData) => {
	const response = await fetch(`${AUTH_API_URL}/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Falha no registo");
	}
	return response.json();
};
