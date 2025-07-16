// Importação dos módulos necessários
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Módulo de conexão com a base de dados

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permite requisições de diferentes origens
app.use(express.json()); // Permite ao servidor entender JSON

// --- ROTAS PÚBLICAS (Para os Clientes) ---

// Rota para obter todos os serviços ATIVOS
app.get("/api/services", async (req, res) => {
	try {
		const services = await pool.query(
			"SELECT * FROM services WHERE is_active = true ORDER BY name ASC"
		);
		res.json(services.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// Rota para obter todos os barbeiros ATIVOS
app.get("/api/barbers", async (req, res) => {
	try {
		const barbers = await pool.query(
			"SELECT * FROM barbers WHERE is_active = true ORDER BY name ASC"
		);
		res.json(barbers.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// Rota para verificar horários disponíveis (considera apenas agendamentos 'confirmed')
app.get("/api/appointments/:barberId/:date", async (req, res) => {
	try {
		const { barberId, date } = req.params;
		const appointments = await pool.query(
			"SELECT TO_CHAR(appointment_time, 'HH24:MI') as time FROM appointments WHERE barber_id = $1 AND appointment_time::date = $2 AND status = 'confirmed'",
			[barberId, date]
		);
		res.json(appointments.rows.map((a) => a.time));
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// Rota para criar um novo agendamento (cria com status 'pending')
app.post("/api/appointments", async (req, res) => {
	try {
		const {
			service_id,
			barber_id,
			customer_name,
			customer_phone,
			appointment_time,
		} = req.body;
		const newAppointment = await pool.query(
			"INSERT INTO appointments (service_id, barber_id, customer_name, customer_phone, appointment_time, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *",
			[service_id, barber_id, customer_name, customer_phone, appointment_time]
		);
		res.json(newAppointment.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// --- ROTAS DE ADMINISTRAÇÃO (Para o Painel do Dono) ---

// --- Gestão de Agendamentos ---

// Obter TODOS os agendamentos com detalhes (JOIN)
app.get("/api/admin/appointments", async (req, res) => {
	try {
		const query = `
            SELECT 
                a.id,
                a.customer_name,
                a.customer_phone,
                a.appointment_time,
                a.status,
                s.name as service_name,
                b.name as barber_name
            FROM appointments a
            JOIN services s ON a.service_id = s.id
            JOIN barbers b ON a.barber_id = b.id
            ORDER BY a.appointment_time DESC
        `;
		const appointments = await pool.query(query);
		res.json(appointments.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// Confirmar um agendamento
app.post("/api/admin/appointments/:id/confirm", async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAppointment = await pool.query(
			"UPDATE appointments SET status = 'confirmed' WHERE id = $1 RETURNING *",
			[id]
		);
		res.json(updatedAppointment.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// Recusar um agendamento
app.post("/api/admin/appointments/:id/deny", async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAppointment = await pool.query(
			"UPDATE appointments SET status = 'denied' WHERE id = $1 RETURNING *",
			[id]
		);
		res.json(updatedAppointment.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// --- Gestão de Serviços ---
app.get("/api/admin/services", async (req, res) => {
	try {
		const services = await pool.query("SELECT * FROM services ORDER BY id ASC");
		res.json(services.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.post("/api/admin/services", async (req, res) => {
	try {
		const { name, price, duration } = req.body;
		const newService = await pool.query(
			"INSERT INTO services (name, price, duration) VALUES ($1, $2, $3) RETURNING *",
			[name, price, duration]
		);
		res.json(newService.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.put("/api/admin/services/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, price, duration } = req.body;
		const updatedService = await pool.query(
			"UPDATE services SET name = $1, price = $2, duration = $3 WHERE id = $4 RETURNING *",
			[name, price, duration, id]
		);
		res.json(updatedService.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.patch("/api/admin/services/:id/status", async (req, res) => {
	try {
		const { id } = req.params;
		const { is_active } = req.body;
		const updatedService = await pool.query(
			"UPDATE services SET is_active = $1 WHERE id = $2 RETURNING *",
			[is_active, id]
		);
		res.json(updatedService.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// --- Gestão de Barbeiros ---
app.get("/api/admin/barbers", async (req, res) => {
	try {
		const barbers = await pool.query("SELECT * FROM barbers ORDER BY id ASC");
		res.json(barbers.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.post("/api/admin/barbers", async (req, res) => {
	try {
		const { name } = req.body;
		const newBarber = await pool.query(
			"INSERT INTO barbers (name) VALUES ($1) RETURNING *",
			[name]
		);
		res.json(newBarber.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.put("/api/admin/barbers/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;
		const updatedBarber = await pool.query(
			"UPDATE barbers SET name = $1 WHERE id = $2 RETURNING *",
			[name, id]
		);
		res.json(updatedBarber.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.patch("/api/admin/barbers/:id/status", async (req, res) => {
	try {
		const { id } = req.params;
		const { is_active } = req.body;
		const updatedBarber = await pool.query(
			"UPDATE barbers SET is_active = $1 WHERE id = $2 RETURNING *",
			[is_active, id]
		);
		res.json(updatedBarber.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor a correr na porta ${PORT}`);
});
