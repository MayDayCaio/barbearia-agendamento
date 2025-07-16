import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage"; // Importar a nova página
import Header from "./components/ui/Header";

function App() {
	return (
		<Router>
			<div className="App bg-gray-900">
				<Header />
				<main>
					<Routes>
						<Route path="/" element={<HomePage />} />
						{/* Adicionar a nova rota para o painel de administração */}
						<Route path="/admin" element={<AdminPage />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
