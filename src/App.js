import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Importar
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage"; // Importar
import ProfilePage from "./pages/ProfilePage"; // Importar
import Header from "./components/ui/Header";

function App() {
	return (
		<AuthProvider>
			{" "}
			{/* Envolver com o Provider */}
			<Router>
				<div className="App bg-gray-900">
					<Header />
					<main>
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/admin" element={<AdminPage />} />
							<Route path="/auth" element={<AuthPage />} /> {/* Nova rota */}
							<Route path="/profile" element={<ProfilePage />} />{" "}
							{/* Nova rota */}
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
