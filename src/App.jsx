import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer"; // 1. Importar o novo componente

function App() {
	return (
		<AuthProvider>
			<Router>
				{/* 2. Ajustar o layout para garantir que o rodapé fica em baixo */}
				<div className="flex flex-col min-h-screen bg-gray-900">
					<Header />
					<main className="flex-grow">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/admin" element={<AdminPage />} />
							<Route path="/auth" element={<AuthPage />} />
							<Route path="/profile" element={<ProfilePage />} />
						</Routes>
					</main>
					<Footer />
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
