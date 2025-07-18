const pool = require("../db.js");

const getAdminAppointmentDetails = async (appointmentId) => {
	const query = `
        SELECT a.id, a.customer_name, a.customer_phone, a.appointment_time, a.status,
               s.name as service_name, b.name as barber_name
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        LEFT JOIN barbers b ON a.barber_id = b.id
        WHERE a.id = $1`;
	const result = await pool.query(query, [appointmentId]);
	return result.rows[0];
};

// const notifyWebhook = ... // Se precisar desta função, ela deve ser importada ou definida aqui

exports.loginAdmin = (req, res) => {
	const { password } = req.body;
	if (!password) {
		return res.status(400).json({ message: "A senha é obrigatória." });
	}
	if (password === process.env.ADMIN_PASSWORD) {
		return res
			.status(200)
			.json({ success: true, message: "Login bem-sucedido." });
	} else {
		return res.status(401).json({ message: "Senha incorreta." });
	}
};

// --- Gestão de Agendamentos ---
exports.getAllAppointments = async (req, res) => {
	try {
		const query = `
            SELECT a.id, a.customer_name, a.customer_phone, a.appointment_time, a.status, 
                   s.name as service_name, b.name as barber_name 
            FROM appointments a 
            LEFT JOIN services s ON a.service_id = s.id 
            LEFT JOIN barbers b ON a.barber_id = b.id 
            ORDER BY a.appointment_time DESC
        `;
		const appointments = await pool.query(query);
		res.json(appointments.rows);
	} catch (err) {
		console.error(
			`[ERRO] em adminController.getAllAppointments: ${err.message}`
		);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.confirmAppointment = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAppointment = await pool.query(
			"UPDATE appointments SET status = 'confirmed' WHERE id = $1 RETURNING *",
			[id]
		);
		const appointmentDetails = await getAdminAppointmentDetails(
			updatedAppointment.rows[0].id
		);
		// notifyWebhook("APPOINTMENT_CONFIRMED", appointmentDetails);
		res.json(appointmentDetails);
	} catch (err) {
		console.error(
			`[ERRO] em adminController.confirmAppointment: ${err.message}`
		);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.denyAppointment = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAppointment = await pool.query(
			"UPDATE appointments SET status = 'denied' WHERE id = $1 RETURNING *",
			[id]
		);
		const appointmentDetails = await getAdminAppointmentDetails(
			updatedAppointment.rows[0].id
		);
		// notifyWebhook("APPOINTMENT_DENIED", appointmentDetails);
		res.json(appointmentDetails);
	} catch (err) {
		console.error(`[ERRO] em adminController.denyAppointment: ${err.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.cancelAppointmentByAdmin = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAppointment = await pool.query(
			"UPDATE appointments SET status = 'cancelled' WHERE id = $1 RETURNING *",
			[id]
		);
		if (updatedAppointment.rows.length === 0) {
			return res.status(404).json({ message: "Agendamento não encontrado." });
		}
		res.json(updatedAppointment.rows[0]);
	} catch (err) {
		console.error(
			`[ERRO] em adminController.cancelAppointmentByAdmin: ${err.message}`
		);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

// --- Gestão de Serviços ---
exports.getAllServices = async (req, res) => {
	try {
		const r = await pool.query("SELECT * FROM services ORDER BY id ASC");
		res.json(r.rows);
	} catch (e) {
		console.error(`[ERRO] em adminController.getAllServices: ${e.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.addService = async (req, res) => {
	try {
		const { name, price, duration } = req.body;
		const r = await pool.query(
			"INSERT INTO services (name, price, duration) VALUES ($1, $2, $3) RETURNING *",
			[name, price, duration]
		);
		res.status(201).json(r.rows[0]);
	} catch (e) {
		console.error(`[ERRO] em adminController.addService: ${e.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.updateService = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, price, duration } = req.body;
		const r = await pool.query(
			"UPDATE services SET name = $1, price = $2, duration = $3 WHERE id = $4 RETURNING *",
			[name, price, duration, id]
		);
		if (r.rows.length === 0) {
			return res.status(404).json({ message: "Serviço não encontrado." });
		}
		res.json(r.rows[0]);
	} catch (e) {
		console.error(`[ERRO] em adminController.updateService: ${e.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.toggleServiceStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { is_active } = req.body;
		const r = await pool.query(
			"UPDATE services SET is_active = $1 WHERE id = $2 RETURNING *",
			[is_active, id]
		);
		if (r.rows.length === 0) {
			return res.status(404).json({ message: "Serviço não encontrado." });
		}
		res.json(r.rows[0]);
	} catch (e) {
		console.error(
			`[ERRO] em adminController.toggleServiceStatus: ${e.message}`
		);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.deleteService = async (req, res) => {
	try {
		const { id } = req.params;
		const appointmentCheck = await pool.query(
			"SELECT id FROM appointments WHERE service_id = $1 LIMIT 1",
			[id]
		);
		if (appointmentCheck.rows.length > 0) {
			return res.status(400).json({
				message:
					"Não é possível excluir o serviço, pois ele está associado a agendamentos existentes.",
			});
		}
		const deleteOp = await pool.query("DELETE FROM services WHERE id = $1", [
			id,
		]);
		if (deleteOp.rowCount === 0) {
			return res.status(404).json({ message: "Serviço não encontrado." });
		}
		res.status(200).json({ message: "Serviço excluído com sucesso." });
	} catch (err) {
		console.error(`[ERRO] em adminController.deleteService: ${err.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

// --- Gestão de Barbeiros ---
exports.getAllBarbers = async (req, res) => {
	try {
		const r = await pool.query("SELECT * FROM barbers ORDER BY id ASC");
		res.json(r.rows);
	} catch (e) {
		console.error(`[ERRO] em adminController.getAllBarbers: ${e.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.addBarber = async (req, res) => {
	try {
		const { name } = req.body;
		const r = await pool.query(
			"INSERT INTO barbers (name) VALUES ($1) RETURNING *",
			[name]
		);
		res.status(201).json(r.rows[0]);
	} catch (e) {
		console.error(`[ERRO] em adminController.addBarber: ${e.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.updateBarber = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;
		const r = await pool.query(
			"UPDATE barbers SET name = $1 WHERE id = $2 RETURNING *",
			[name, id]
		);
		if (r.rows.length === 0) {
			return res.status(404).json({ message: "Barbeiro não encontrado." });
		}
		res.json(r.rows[0]);
	} catch (e) {
		console.error(`[ERRO] em adminController.updateBarber: ${e.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.toggleBarberStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { is_active } = req.body;
		const r = await pool.query(
			"UPDATE barbers SET is_active = $1 WHERE id = $2 RETURNING *",
			[is_active, id]
		);
		if (r.rows.length === 0) {
			return res.status(404).json({ message: "Barbeiro não encontrado." });
		}
		res.json(r.rows[0]);
	} catch (e) {
		console.error(`[ERRO] em adminController.toggleBarberStatus: ${e.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};

exports.deleteBarber = async (req, res) => {
	try {
		const { id } = req.params;
		const appointmentCheck = await pool.query(
			"SELECT id FROM appointments WHERE barber_id = $1 LIMIT 1",
			[id]
		);
		if (appointmentCheck.rows.length > 0) {
			return res.status(400).json({
				message:
					"Não é possível excluir o barbeiro, pois ele está associado a agendamentos existentes.",
			});
		}
		const deleteOp = await pool.query("DELETE FROM barbers WHERE id = $1", [
			id,
		]);
		if (deleteOp.rowCount === 0) {
			return res.status(404).json({ message: "Barbeiro não encontrado." });
		}
		res.status(200).json({ message: "Barbeiro excluído com sucesso." });
	} catch (err) {
		console.error(`[ERRO] em adminController.deleteBarber: ${err.message}`);
		res.status(500).json({ message: "Erro no Servidor" });
	}
};
