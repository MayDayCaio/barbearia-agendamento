import React, { createContext, useState, useContext, useEffect } from "react";
import * as authApi from "../services/authApi";
// CORREÇÃO AQUI: A importação mudou de { jwtDecode } para jwtDecode
import jwtDecode from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem("token"));

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			try {
				const decodedUser = jwtDecode(storedToken);
				if (decodedUser.exp * 1000 > Date.now()) {
					setUser({ name: decodedUser.name, id: decodedUser.id });
					setToken(storedToken);
				} else {
					logout();
				}
			} catch (error) {
				console.error("Token inválido", error);
				logout();
			}
		}
	}, []);

	const login = async (credentials) => {
		const data = await authApi.login(credentials);
		localStorage.setItem("token", data.token);
		setToken(data.token);
		setUser(data.user);
		return data;
	};

	const register = async (userData) => {
		const data = await authApi.register(userData);
		localStorage.setItem("token", data.token);
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
