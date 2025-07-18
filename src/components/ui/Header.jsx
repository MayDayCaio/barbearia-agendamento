import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/"); // Redireciona para a home após logout
	};

	return (
		<header className="bg-gray-800 text-white shadow-md">
			<nav className="container mx-auto px-6 py-4 flex justify-between items-center">
				<Link to="/" className="text-xl font-bold hover:text-blue-400">
					Barbearia App
				</Link>
				<div className="flex items-center space-x-4">
					{user ? (
						<>
							<Link to="/profile" className="hover:text-blue-400">
								Olá, {user.name}
							</Link>
							<button
								onClick={handleLogout}
								className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
								Sair
							</button>
						</>
					) : (
						<Link
							to="/auth"
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
							Login / Registar
						</Link>
					)}
					<Link to="/admin" className="hover:text-blue-400">
						Admin
					</Link>
				</div>
			</nav>
		</header>
	);
};

export default Header;
