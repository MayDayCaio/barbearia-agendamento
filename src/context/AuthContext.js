import React, { createContext, useState, useContext, useEffect } from "react";
import * as authApi from "../services/authApi";
import { jwtDecode } from "jwt-decode"; // Usar uma biblioteca para descodificar o token

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token"));

	useEffect(() => {
		if (token) {
			try {
				const decodedUser = jwtDecode(token);
				// Verifica se o token expirou
				if (decodedUser.exp * 1000 > Date.now()) {
					setUser({ name: decodedUser.name, id: decodedUser.id });
					localStorage.setItem("token", token);
				} else {
					// Token expirado
					logout();
				}
			} catch (error) {
				console.error("Token inválido", error);
				logout();
			}
		}
	}, [token]);

	const login = async (credentials) => {
		const data = await authApi.login(credentials);
		setToken(data.token);
		setUser(data.user);
		return data;
	};

	const register = async (userData) => {
		const data = await authApi.register(userData);
		setToken(data.token);
		setUser(data.user);
		return data;
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
	};

	const authContextValue = {
		user,
		token,
		login,
		register,
		logout,
		isAuthenticated: !!user,
	};

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
