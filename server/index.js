// Carrega as variáveis de ambiente do ficheiro .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db"); // A sua configuração de base de dados

// Importação das rotas
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
const corsOptions = {
	// Substitua pelo URL do seu frontend em produção
	origin: process.env.CORS_ORIGIN || "http://31.97.171.200:3003",
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Validação de Variáveis de Ambiente Essenciais ---
if (!process.env.JWT_SECRET || !process.env.ADMIN_PASSWORD) {
	console.error(
		"ERRO CRÍTICO: As variáveis de ambiente JWT_SECRET e ADMIN_PASSWORD devem ser definidas no ficheiro .env"
	);
	process.exit(1);
}

// --- Rotas da API ---
app.get("/api/test", (req, res) =>
	res.json({ message: "Conexão com o backend bem-sucedida!" })
);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", appointmentRoutes); // Rotas públicas e de utilizador

// Middleware para tratamento de erros (genérico)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Ocorreu um erro inesperado no servidor!");
});

// Inicia o servidor
app.listen(PORT, "0.0.0.0", async () => {
	try {
		await pool.query("SELECT NOW()");
		console.log(
			"✅ Conexão com a base de dados PostgreSQL estabelecida com sucesso!"
		);
		console.log(`🚀 Servidor a correr na porta ${PORT}`);
	} catch (err) {
		console.error("❌ Erro ao conectar à base de dados:", err.message);
	}
});
