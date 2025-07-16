const { Pool } = require("pg");
require("dotenv").config(); // Carrega as variáveis de ambiente do ficheiro .env

// Configuração da conexão com a base de dados usando as variáveis de ambiente
const pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
});

// --- NOVO: Teste de Conexão ---
// Esta função tenta conectar-se à base de dados assim que o servidor é iniciado.
const testConnection = async () => {
	try {
		// Tenta pegar um cliente do pool e fazer uma consulta simples
		const client = await pool.connect();
		console.log("A tentar conectar à base de dados...");
		await client.query("SELECT NOW()"); // Consulta simples para verificar a conexão
		client.release(); // Liberta o cliente de volta para o pool
		console.log(
			"✅ Conexão com a base de dados PostgreSQL estabelecida com sucesso!"
		);
	} catch (err) {
		// Se houver um erro, mostra uma mensagem clara na consola
		console.error("❌ Erro ao conectar à base de dados:", err.message);
		console.error("---");
		console.error(
			"Por favor, verifique as suas credenciais no ficheiro .env e se o serviço PostgreSQL está a correr."
		);
		console.error("---");
	}
};

// Executa o teste de conexão
testConnection();
// --- FIM DO TESTE ---

module.exports = pool;
