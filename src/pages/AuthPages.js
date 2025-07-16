import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login, register } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			if (isLogin) {
				await login({ phone: formData.phone, password: formData.password });
			} else {
				await register(formData);
			}
			navigate("/profile"); // Redireciona para o perfil após sucesso
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
			<div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-3xl font-bold mb-6 text-center text-white">
					{isLogin ? "Login" : "Criar Conta"}
				</h1>
				<form onSubmit={handleSubmit}>
					{!isLogin && (
						<div className="mb-4">
							<label className="block text-gray-400 mb-2">Nome</label>
							<input
								type="text"
								name="name"
								onChange={handleChange}
								required
								className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					)}
					<div className="mb-4">
						<label className="block text-gray-400 mb-2">Telefone</label>
						<input
							type="tel"
							name="phone"
							onChange={handleChange}
							required
							className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="mb-6">
						<label className="block text-gray-400 mb-2">Palavra-passe</label>
						<input
							type="password"
							name="password"
							onChange={handleChange}
							required
							className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					{error && <p className="text-red-500 text-center mb-4">{error}</p>}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500">
						{loading ? "A processar..." : isLogin ? "Entrar" : "Registar"}
					</button>
				</form>
				<p className="mt-6 text-center">
					{isLogin ? "Não tem conta?" : "Já tem conta?"}
					<button
						onClick={() => setIsLogin(!isLogin)}
						className="text-blue-400 hover:underline ml-2">
						{isLogin ? "Registe-se aqui" : "Faça login"}
					</button>
				</p>
			</div>
		</div>
	);
};

export default AuthPage;
