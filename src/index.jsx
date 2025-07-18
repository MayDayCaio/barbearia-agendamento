import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./calendar.css"; // Importar os estilos do calendário
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
