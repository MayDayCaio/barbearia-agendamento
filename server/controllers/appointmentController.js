const pool = require("../db.js");

const getAppointmentDetails = async (appointmentId) => {
	const query = `
        SELECT a.id, a.customer_name, a.customer_phone, a.appointment_time, a.status,
               s.name as service_name, b.name as barber_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN barbers b ON a.barber_id = b.id
        WHERE a.id = $1`;
	const result = await pool.query(query, [appointmentId]);
	return result.rows[0];
};

exports.createAppointment = async (req, res) => {
	try {
		const { service_id, barber_id, appointment_time } = req.body;
		let userId = req.user ? req.user.id : null;
		let customerName, customerPhone;

		if (userId) {
			const userResult = await pool.query(
				"SELECT name, phone FROM users WHERE id = $1",
				[userId]
			);
			if (userResult.rows.length === 0) {
				return res
					.status(404)
					.json({ message: `Utilizador com ID ${userId} não encontrado.` });
			}
			customerName = userResult.rows[0].name;
			customerPhone = userResult.rows[0].phone;
		} else {
			customerName = req.body.customer_name;
			customerPhone = req.body.customer_phone;
		}

		const queryParams = [
			userId,
			service_id,
			barber_id,
			customerName,
			customerPhone,
			appointment_time,
		];
		const newAppointment = await pool.query(
			"INSERT INTO appointments (user_id, service_id, barber_id, customer_name, customer_phone, appointment_time, status) VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *",
			queryParams
		);

		const newAppointmentDetails = await getAppointmentDetails(
			newAppointment.rows[0].id
		);
		// notifyWebhook("NEW_PENDING_APPOINTMENT", newAppointmentDetails); // Descomentar se usar n8n

		res.status(201).json(newAppointmentDetails);
	} catch (err) {
		console.error(
			`[ERRO] em appointmentController.createAppointment: ${err.message}`
		);
		res.status(500).json({ message: "Erro no servidor ao criar agendamento." });
	}
};

exports.getMyAppointments = async (req, res) => {
	try {
		const userId = req.user.id;
		const query = `
            SELECT a.id, a.appointment_time, a.status, s.name as service_name, b.name as barber_name 
            FROM appointments a 
            JOIN services s ON a.service_id = s.id 
            JOIN barbers b ON a.barber_id = b.id 
            WHERE a.user_id = $1 
            ORDER BY a.appointment_time DESC
        `;
		const userAppointments = await pool.query(query, [userId]);
		res.json(userAppointments.rows);
	} catch (err) {
		console.error(
			`[ERRO] em appointmentController.getMyAppointments: ${err.message}`
		);
		res.status(500).json({ message: "Erro ao buscar os seus agendamentos." });
	}
};

exports.cancelMyAppointment = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;
		const appointmentResult = await pool.query(
			"SELECT * FROM appointments WHERE id = $1 AND user_id = $2",
			[id, userId]
		);
		if (appointmentResult.rows.length === 0) {
			return res
				.status(404)
				.json({
					message:
						"Agendamento não encontrado ou não pertence a este utilizador.",
				});
		}
		const updatedAppointment = await pool.query(
			"UPDATE appointments SET status = 'cancelled' WHERE id = $1 RETURNING *",
			[id]
		);
		res.json(updatedAppointment.rows[0]);
	} catch (err) {
		console.error(
			`[ERRO] em appointmentController.cancelMyAppointment: ${err.message}`
		);
		res
			.status(500)
			.json({ message: "Erro no servidor ao cancelar agendamento." });
	}
};
