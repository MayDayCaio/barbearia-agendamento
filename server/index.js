// Importação dos módulos necessários
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const fetch = require("node-fetch");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Configurações e Segredos ---
const JWT_SECRET =
	process.env.JWT_SECRET ||
	"3d4019f67d93c964d070c1cd45f35e8e2f6888ebff6c8f5e928825946c4a7838";
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

// --- Middlewares ---
const corsOptions = {
	origin: "http://31.97.171.200:3003",
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// =================================================================
// CORREÇÃO: Funções auxiliares movidas para o topo do ficheiro
// =================================================================

// --- Funções de Autenticação (Middleware) ---
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

const nonAuthAuthenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return next();
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (!err) {
			req.user = user;
		}
		next();
	});
};

// --- Funções de Notificação e Detalhes ---
const notifyWebhook = async (eventType, appointmentData) => {
	if (!N8N_WEBHOOK_URL) {
		console.log(`Webhook não configurado. Evento '${eventType}' não enviado.`);
		return;
	}
	const payload = { eventType, appointment: appointmentData };
	try {
		console.log(`Enviando evento '${eventType}' para o webhook...`);
		await fetch(N8N_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
	} catch (error) {
		console.error(`Falha ao enviar notificação para o n8n: ${error.message}`);
	}
};

const getAppointmentDetails = async (appointmentId) => {
	const query = `
        SELECT 
            a.id, a.customer_name, a.customer_phone, a.appointment_time, a.status,
            s.name as service_name, b.name as barber_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN barbers b ON a.barber_id = b.id
        WHERE a.id = $1
    `;
	const result = await pool.query(query, [appointmentId]);
	return result.rows[0];
};

// =================================================================
// --- ROTAS DA API ---
// =================================================================

// --- Rota para criar um novo agendamento (COM DIAGNÓSTICO) ---
app.post("/api/appointments", nonAuthAuthenticateToken, async (req, res) => {
	console.log(
		`[${new Date().toISOString()}] Rota POST /api/appointments acedida.`
	);
	console.log("Corpo do Pedido (req.body):", JSON.stringify(req.body, null, 2));

	try {
		const { service_id, barber_id, appointment_time } = req.body;
		let userId = null;
		let customerName, customerPhone;

		if (req.user) {
			userId = req.user.id;
			console.log(`Utilizador autenticado encontrado. ID: ${userId}`);
			const userResult = await pool.query(
				"SELECT name, phone FROM users WHERE id = $1",
				[userId]
			);
			if (userResult.rows.length === 0)
				throw new Error(`Utilizador com ID ${userId} não encontrado.`);
			customerName = userResult.rows[0].name;
			customerPhone = userResult.rows[0].phone;
		} else {
			console.log("Nenhum utilizador autenticado. A processar como convidado.");
			customerName = req.body.customer_name;
			customerPhone = req.body.customer_phone;
			if (!customerName || !customerPhone) {
				console.log(
					"[ERRO DE VALIDAÇÃO] Nome ou telefone do convidado em falta."
				);
				return res.status(400).json({
					message:
						"Nome e telefone do cliente são obrigatórios para agendamentos sem login.",
				});
			}
		}

		const queryParams = [
			userId,
			service_id,
			barber_id,
			customerName,
			customerPhone,
			appointment_time,
		];
		console.log(
			"A executar INSERT na tabela 'appointments' com os seguintes parâmetros:",
			queryParams
		);

		const newAppointment = await pool.query(
			"INSERT INTO appointments (user_id, service_id, barber_id, customer_name, customer_phone, appointment_time, status) VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *",
			queryParams
		);

		console.log(
			"Agendamento inserido com sucesso. ID do novo agendamento:",
			newAppointment.rows[0].id
		);

		const newAppointmentDetails = await getAppointmentDetails(
			newAppointment.rows[0].id
		);
		notifyWebhook("NEW_PENDING_APPOINTMENT", newAppointmentDetails);

		console.log("A enviar resposta de sucesso (201) para o cliente.");
		res.status(201).json(newAppointmentDetails);
	} catch (err) {
		console.error(
			`[ERRO GRAVE] Falha na rota POST /api/appointments: ${err.message}`
		);
		console.error("Stack do Erro:", err.stack);

		if (!res.headersSent) {
			res.status(500).send("Erro no Servidor ao criar agendamento.");
		}
	}
});

// --- Outras Rotas ---
app.post("/api/auth/register", async (req, res) => {
	try {
		const { name, phone, password } = req.body;
		const userExists = await pool.query(
			"SELECT * FROM users WHERE phone = $1",
			[phone]
		);
		if (userExists.rows.length > 0) {
			return res
				.status(400)
				.json({ message: "Já existe uma conta com este número de telefone." });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = await pool.query(
			"INSERT INTO users (name, phone, password) VALUES ($1, $2, $3) RETURNING id, name, phone",
			[name, phone, hashedPassword]
		);
		await pool.query(
			"INSERT INTO loyalty_points (user_id, points) VALUES ($1, 0)",
			[newUser.rows[0].id]
		);
		const token = jwt.sign(
			{ id: newUser.rows[0].id, name: newUser.rows[0].name },
			JWT_SECRET,
			{ expiresIn: "24h" }
		);
		res.status(201).json({ token, user: newUser.rows[0] });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.post("/api/auth/login", async (req, res) => {
	try {
		const { phone, password } = req.body;
		const user = await pool.query("SELECT * FROM users WHERE phone = $1", [
			phone,
		]);
		if (user.rows.length === 0) {
			return res.status(400).json({ message: "Credenciais inválidas." });
		}
		const validPassword = await bcrypt.compare(password, user.rows[0].password);
		if (!validPassword) {
			return res.status(400).json({ message: "Credenciais inválidas." });
		}
		const token = jwt.sign(
			{ id: user.rows[0].id, name: user.rows[0].name },
			JWT_SECRET,
			{ expiresIn: "24h" }
		);
		const userData = {
			id: user.rows[0].id,
			name: user.rows[0].name,
			phone: user.rows[0].phone,
		};
		res.json({ token, user: userData });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.get("/api/my-appointments", authenticateToken, async (req, res) => {
	try {
		const userId = req.user.id;
		const query = ` SELECT a.id, a.appointment_time, a.status, s.name as service_name, b.name as barber_name FROM appointments a JOIN services s ON a.service_id = s.id JOIN barbers b ON a.barber_id = b.id WHERE a.user_id = $1 ORDER BY a.appointment_time DESC `;
		const userAppointments = await pool.query(query, [userId]);
		res.json(userAppointments.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
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
app.get("/api/appointments/:barberId/:date", async (req, res) => {
	try {
		const { barberId, date } = req.params;
		const query = ` SELECT TO_CHAR(a.appointment_time, 'HH24:MI') as time, s.duration FROM appointments a JOIN services s ON a.service_id = s.id WHERE a.barber_id = $1 AND a.appointment_time::date = $2 AND a.status = 'confirmed' `;
		const appointments = await pool.query(query, [barberId, date]);
		res.json(appointments.rows);
	} catch (err) {
		console.error(
			`[ERRO] na rota /api/appointments/:barberId/:date: ${err.message}`
		);
		res.status(500).send("Erro no Servidor");
	}
});
app.get("/api/admin/appointments", async (req, res) => {
	try {
		const query = ` SELECT a.id, a.customer_name, a.customer_phone, a.appointment_time, a.status, s.name as service_name, b.name as barber_name FROM appointments a LEFT JOIN services s ON a.service_id = s.id LEFT JOIN barbers b ON a.barber_id = b.id ORDER BY a.appointment_time DESC`;
		const appointments = await pool.query(query);
		res.json(appointments.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.post("/api/admin/appointments/:id/confirm", async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAppointment = await pool.query(
			"UPDATE appointments SET status = 'confirmed' WHERE id = $1 RETURNING *",
			[id]
		);
		const appointmentDetails = await getAppointmentDetails(
			updatedAppointment.rows[0].id
		);
		notifyWebhook("APPOINTMENT_CONFIRMED", appointmentDetails);
		res.json(appointmentDetails);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.post("/api/admin/appointments/:id/deny", async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAppointment = await pool.query(
			"UPDATE appointments SET status = 'denied' WHERE id = $1 RETURNING *",
			[id]
		);
		const appointmentDetails = await getAppointmentDetails(
			updatedAppointment.rows[0].id
		);
		notifyWebhook("APPOINTMENT_DENIED", appointmentDetails);
		res.json(appointmentDetails);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Erro no Servidor");
	}
});
app.get("/api/admin/services", async (req, res) => {
	try {
		const r = await pool.query("SELECT * FROM services ORDER BY id ASC");
		res.json(r.rows);
	} catch (e) {
		res.status(500).send("Erro");
	}
});
app.post("/api/admin/services", async (req, res) => {
	try {
		const { name, price, duration } = req.body;
		const r = await pool.query(
			"INSERT INTO services (name, price, duration) VALUES ($1, $2, $3) RETURNING *",
			[name, price, duration]
		);
		res.json(r.rows[0]);
	} catch (e) {
		res.status(500).send("Erro");
	}
});
app.put("/api/admin/services/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, price, duration } = req.body;
		const r = await pool.query(
			"UPDATE services SET name = $1, price = $2, duration = $3 WHERE id = $4 RETURNING *",
			[name, price, duration, id]
		);
		res.json(r.rows[0]);
	} catch (e) {
		res.status(500).send("Erro");
	}
});
app.patch("/api/admin/services/:id/status", async (req, res) => {
	try {
		const { id } = req.params;
		const { is_active } = req.body;
		const r = await pool.query(
			"UPDATE services SET is_active = $1 WHERE id = $2 RETURNING *",
			[is_active, id]
		);
		res.json(r.rows[0]);
	} catch (e) {
		res.status(500).send("Erro");
	}
});
app.get("/api/admin/barbers", async (req, res) => {
	try {
		const r = await pool.query("SELECT * FROM barbers ORDER BY id ASC");
		res.json(r.rows);
	} catch (e) {
		res.status(500).send("Erro");
	}
});
app.post("/api/admin/barbers", async (req, res) => {
	try {
		const { name } = req.body;
		const r = await pool.query(
			"INSERT INTO barbers (name) VALUES ($1) RETURNING *",
			[name]
		);
		res.json(r.rows[0]);
	} catch (e) {
		res.status(500).send("Erro");
	}
});
app.put("/api/admin/barbers/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;
		const r = await pool.query(
			"UPDATE barbers SET name = $1 WHERE id = $2 RETURNING *",
			[name, id]
		);
		res.json(r.rows[0]);
	} catch (e) {
		res.status(500).send("Erro");
	}
});
app.patch("/api/admin/barbers/:id/status", async (req, res) => {
	try {
		const { id } = req.params;
		const { is_active } = req.body;
		const r = await pool.query(
			"UPDATE barbers SET is_active = $1 WHERE id = $2 RETURNING *",
			[is_active, id]
		);
		res.json(r.rows[0]);
	} catch (e) {
		res.status(500).send("Erro");
	}
});

// Inicia o servidor
app.listen(PORT, "0.0.0.0", () => {
	console.log(
		`Servidor a correr na porta ${PORT} e a aceitar conexões externas.`
	);
});
