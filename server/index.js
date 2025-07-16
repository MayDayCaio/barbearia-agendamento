// Importação dos módulos necessários
const express = require("express");
const cors = require("cors");
const db = require("./db"); // O nosso ficheiro de ligação à base de dados

// Inicialização da aplicação Express
const app = express();
const port = process.env.PORT || 3004; // Define a porta do servidor

// Configuração dos Middlewares
// CORS para permitir pedidos de outras origens (o nosso frontend React)
const corsOptions = {
	origin: "*", // Em produção, deve restringir ao seu domínio
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json()); // Permite ao servidor interpretar corpos de pedido em formato JSON

// --- ROTAS PÚBLICAS (PARA O SITE DO CLIENTE) ---

// GET /api/services - Retorna apenas os serviços que estão ativos
app.get("/api/services", async (req, res) => {
	try {
		const { rows } = await db.query(
			"SELECT * FROM services WHERE is_active = true ORDER BY price"
		);
		res.json(rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/barbers - Retorna apenas os barbeiros que estão ativos
app.get("/api/barbers", async (req, res) => {
	try {
		const { rows } = await db.query(
			"SELECT * FROM barbers WHERE is_active = true ORDER BY name"
		);
		res.json(rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/appointments/:barberId/:date - Verifica horários disponíveis (apenas os confirmados)
app.get("/api/appointments/:barberId/:date", async (req, res) => {
	try {
		const { barberId, date } = req.params;
		const query = `
		    SELECT appointment_time, s.duration 
		    FROM appointments a
			JOIN services s ON a.service_id = s.id
			WHERE a.barber_id = $1 AND a.appointment_time::date = $2 AND a.status = 'confirmed'
			`;
		const { rows } = await db.query(query, [barberId, date]);
		res.json(rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// POST /api/appointments - Cria um novo agendamento (com status 'pending' por defeito)
app.post("/api/appointments", async (req, res) => {
	try {
		const {
			serviceId,
			barberId,
			appointmentTime,
			customerName,
			customerPhone,
		} = req.body;
		const query = `
			INSERT INTO appointments (service_id, barber_id, appointment_time, customer_name, customer_phone)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id
			`;
		const values = [
			serviceId,
			barberId,
			appointmentTime,
			customerName,
			customerPhone,
		];
		const { rows } = await db.query(query, values);
		res.status(201).json({ id: rows[0].id });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// --- ROTAS DE ADMINISTRAÇÃO (PARA O PAINEL DE GESTÃO) ---

// --- Gestão de Serviços ---
app.get("/api/admin/services", async (req, res) => {
	try {
		const { rows } = await db.query("SELECT * FROM services ORDER BY name");
		res.json(rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

app.post("/api/admin/services", async (req, res) => {
	try {
		const { id, name, price, duration } = req.body;
		const { rows } = await db.query(
			"INSERT INTO services (id, name, price, duration) VALUES ($1, $2, $3, $4) RETURNING *",
			[id, name, price, duration]
		);
		res.status(201).json(rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

app.put("/api/admin/services/:id", async (req, res) => {
	try {
		const { name, price, duration, is_active } = req.body;
		const { rows } = await db.query(
			"UPDATE services SET name = $1, price = $2, duration = $3, is_active = $4 WHERE id = $5 RETURNING *",
			[name, price, duration, is_active, req.params.id]
		);
		res.json(rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

app.delete("/api/admin/services/:id", async (req, res) => {
	try {
		await db.query("DELETE FROM services WHERE id = $1", [req.params.id]);
		res.status(204).send();
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// --- Gestão de Barbeiros ---
app.get("/api/admin/barbers", async (req, res) => {
	try {
		const { rows } = await db.query("SELECT * FROM barbers ORDER BY name");
		res.json(rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

app.post("/api/admin/barbers", async (req, res) => {
	try {
		const { id, name, image_url } = req.body;
		const { rows } = await db.query(
			"INSERT INTO barbers (id, name, image_url) VALUES ($1, $2, $3) RETURNING *",
			[id, name, image_url]
		);
		res.status(201).json(rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

app.put("/api/admin/barbers/:id", async (req, res) => {
	try {
		const { name, image_url, is_active } = req.body;
		const { rows } = await db.query(
			"UPDATE barbers SET name = $1, image_url = $2, is_active = $3 WHERE id = $4 RETURNING *",
			[name, image_url, is_active, req.params.id]
		);
		res.json(rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

app.delete("/api/admin/barbers/:id", async (req, res) => {
	try {
		await db.query("DELETE FROM barbers WHERE id = $1", [req.params.id]);
		res.status(204).send();
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// --- Gestão de Agendamentos ---
app.get("/api/admin/appointments", async (req, res) => {
	try {
		const query = `
            SELECT 
                a.id, a.appointment_time, a.status, a.customer_name,
                s.name as service_name, b.name as barber_name
            FROM appointments a
            JOIN services s ON a.service_id = s.id
            JOIN barbers b ON a.barber_id = b.id
            ORDER BY a.appointment_time DESC
        `;
		const { rows } = await db.query(query);
		res.json(rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

app.post("/api/admin/appointments/:id/confirm", async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await db.query(
			"UPDATE appointments SET status = 'confirmed' WHERE id = $1 RETURNING *",
			[id]
		);
		res.json(rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

app.post("/api/admin/appointments/:id/deny", async (req, res) => {
	try {
		const { id } = req.params;
		const { rows } = await db.query(
			"UPDATE appointments SET status = 'denied' WHERE id = $1 RETURNING *",
			[id]
		);
		res.json(rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Inicia o servidor e testa a ligação à base de dados
app.listen(port, async () => {
	console.log(`Backend server is running on port ${port}`);
	try {
		const client = await db.pool.connect();
		console.log("Ligação ao PostgreSQL estabelecida com sucesso!");
		client.release();
	} catch (err) {
		console.error(
			"Erro: Não foi possível ligar à base de dados PostgreSQL.",
			err.stack
		);
	}
});
