import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

function App() {
	const [page, setPage] = useState("home"); // 'home' ou 'admin'
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const handleLogin = () => {
		const password = prompt("Por favor, introduza a senha de administrador:");
		if (password === "admin123") {
			// Senha de exemplo, deve ser alterada!
			setIsAuthenticated(true);
			setPage("admin");
		} else {
			alert("Senha incorreta!");
		}
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		setPage("home");
	};

	return (
		<div
			className="bg-gray-900 text-gray-200 min-h-screen"
			style={{ fontFamily: "'Poppins', sans-serif" }}>
			{/* Adiciona um link para o admin no topo */}
			<div className="bg-gray-800 text-right p-2">
				<button
					onClick={() => (isAuthenticated ? setPage("admin") : handleLogin())}
					className="text-sm text-gray-400 hover:text-white">
					{isAuthenticated ? "Aceder ao Painel" : "Login de Admin"}
				</button>
			</div>

			{page === "home" && <HomePage />}
			{page === "admin" && isAuthenticated && (
				<AdminPage onLogout={handleLogout} />
			)}
		</div>
	);
}

export default App;
