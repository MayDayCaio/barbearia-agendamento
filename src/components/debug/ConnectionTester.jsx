import React, { useState, useEffect } from "react";

const ConnectionTester = () => {
	const [status, setStatus] = useState("A testar conexão com o backend...");
	const [style, setStyle] = useState({
		backgroundColor: "#eb8b04ff",
		color: "white",
	}); // Laranja (A testar)

	useEffect(() => {
		const testApiConnection = async () => {
			try {
				// Tenta fazer um pedido para a nossa nova rota de teste
				const response = await fetch("http://localhost:5000/api/test");

				if (!response.ok) {
					// Erro na resposta do servidor (ex: 404, 500)
					throw new Error(`Erro do Servidor: ${response.statusText}`);
				}

				const data = await response.json();
				setStatus(`✅ SUCESSO: ${data.message}`);
				setStyle({ backgroundColor: "#5cb85c", color: "white" }); // Verde (Sucesso)
			} catch (error) {
				// Erro na rede (servidor desligado, CORS, etc.)
				console.error("ERRO DE CONEXÃO:", error);
				setStatus(
					`❌ FALHA: Não foi possível conectar ao backend. Verifique a consola do navegador e do servidor.`
				);
				setStyle({ backgroundColor: "#d9534f", color: "white" }); // Vermelho (Falha)
			}
		};

		testApiConnection();
	}, []);

	return (
		<div
			style={{
				...style,
				padding: "15px",
				textAlign: "center",
				fontWeight: "bold",
				position: "fixed",
				bottom: 0,
				left: 0,
				width: "100%",
				zIndex: 9999,
			}}>
			{status}
		</div>
	);
};

export default ConnectionTester;
