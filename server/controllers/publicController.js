const pool = require("../db.js");

exports.getActiveServices = async (req, res) => {
	try {
		const services = await pool.query(
			"SELECT * FROM services WHERE is_active = true ORDER BY name ASC"
		);
		res.json(services.rows);
	} catch (err) {
		console.error(
			`[ERRO] em publicController.getActiveServices: ${err.message}`
		);
		res.status(500).json({ message: "Erro ao buscar serviços." });
	}
};

exports.getActiveBarbers = async (req, res) => {
	try {
		const barbers = await pool.query(
			"SELECT * FROM barbers WHERE is_active = true ORDER BY name ASC"
		);
		res.json(barbers.rows);
	} catch (err) {
		console.error(
			`[ERRO] em publicController.getActiveBarbers: ${err.message}`
		);
		res.status(500).json({ message: "Erro ao buscar barbeiros." });
	}
};

exports.getAvailableSlots = async (req, res) => {
	try {
		const { barberId, date } = req.params;
		const query = `
            SELECT TO_CHAR(a.appointment_time, 'HH24:MI') as time, s.duration 
            FROM appointments a 
            JOIN services s ON a.service_id = s.id 
            WHERE a.barber_id = $1 AND a.appointment_time::date = $2 AND a.status = 'confirmed'
        `;
		const appointments = await pool.query(query, [barberId, date]);
		res.json(appointments.rows);
	} catch (err) {
		console.error(
			`[ERRO] em publicController.getAvailableSlots: ${err.message}`
		);
		res.status(500).json({ message: "Erro ao buscar horários disponíveis." });
	}
};
