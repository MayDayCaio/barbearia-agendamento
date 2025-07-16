const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL, // Ex: "postgresql://user:password@host:port/database"
});

module.exports = {
	query: (text, params) => pool.query(text, params),
	pool, // Exporta a pool para testes de ligação
};
