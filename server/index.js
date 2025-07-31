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
app.use( ( err, req, res, next ) => {
	console.error( err.stack );
	res.status( 500 ).send( "Ocorreu um erro inesperado no servidor!" );

	// --- Funções Auxiliares ---
	const authenticateToken = ( req, res, next ) => {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split( " " )[1];
		if ( token == null ) return res.sendStatus( 401 );
		jwt.verify( token, JWT_SECRET, ( err, user ) => {
			if ( err ) return res.sendStatus( 403 );
			req.user = user;
			next();
		} );
	};

	const nonAuthAuthenticateToken = ( req, res, next ) => {
		const authHeader = req.headers["authorization"];
		const token = authHeader && authHeader.split( " " )[1];
		if ( token == null ) return next();
		jwt.verify( token, JWT_SECRET, ( err, user ) => {
			if ( !err ) {
				req.user = user;
			}
			next();
		} );
	};

	const notifyWebhook = async ( eventType, appointmentData ) => {
		/* ... */
	};
	const getAppointmentDetails = async ( appointmentId ) => {
		const query = `
        SELECT a.id, a.customer_name, a.customer_phone, a.appointment_time, a.status,
               s.name as service_name, b.name as barber_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN barbers b ON a.barber_id = b.id
        WHERE a.id = $1`;
		const result = await pool.query( query, [appointmentId] );
		return result.rows[0];
	};

	// --- ROTAS DA API ---

	// Rota para um CLIENTE cancelar o seu próprio agendamento
	app.post(
		"/api/appointments/:id/cancel",
		authenticateToken,
		async ( req, res ) => {
			try {
				const { id } = req.params;
				const userId = req.user.id;
				const appointmentResult = await pool.query(
					"SELECT * FROM appointments WHERE id = $1 AND user_id = $2",
					[id, userId]
				);
				if ( appointmentResult.rows.length === 0 ) {
					return res
						.status( 404 )
						.json( {
							message:
								"Agendamento não encontrado ou não pertence a este utilizador.",
						} );
				}
				const updatedAppointment = await pool.query(
					"UPDATE appointments SET status = 'cancelled' WHERE id = $1 RETURNING *",
					[id]
				);
				res.json( updatedAppointment.rows[0] );
			} catch ( err ) {
				console.error(
					`[ERRO] na rota /api/appointments/:id/cancel: ${ err.message }`
				);
				res.status( 500 ).send( "Erro no Servidor" );
			}
		}
	);

	// Rota para um ADMINISTRADOR cancelar qualquer agendamento
	app.post( "/api/admin/appointments/:id/cancel", async ( req, res ) => {
		try {
			const { id } = req.params;
			const updatedAppointment = await pool.query(
				"UPDATE appointments SET status = 'cancelled' WHERE id = $1 RETURNING *",
				[id]
			);
			if ( updatedAppointment.rows.length === 0 ) {
				return res.status( 404 ).json( { message: "Agendamento não encontrado." } );
			}
			res.json( updatedAppointment.rows[0] );
		} catch ( err ) {
			console.error(
				`[ERRO] na rota /api/admin/appointments/:id/cancel: ${ err.message }`
			);
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );

	// ... (Restante das rotas)
	app.post( "/api/appointments", nonAuthAuthenticateToken, async ( req, res ) => {
		try {
			const { service_id, barber_id, appointment_time } = req.body;
			let userId = null;
			let customerName, customerPhone;
			if ( req.user ) {
				userId = req.user.id;
				const userResult = await pool.query(
					"SELECT name, phone FROM users WHERE id = $1",
					[userId]
				);
				if ( userResult.rows.length === 0 )
					throw new Error( `Utilizador com ID ${ userId } não encontrado.` );
				customerName = userResult.rows[0].name;
				customerPhone = userResult.rows[0].phone;
			} else {
				customerName = req.body.customer_name;
				customerPhone = req.body.customer_phone;
				if ( !customerName || !customerPhone ) {
					return res
						.status( 400 )
						.json( {
							message:
								"Nome e telefone do cliente são obrigatórios para agendamentos sem login.",
						} );
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
			const newAppointment = await pool.query(
				"INSERT INTO appointments (user_id, service_id, barber_id, customer_name, customer_phone, appointment_time, status) VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *",
				queryParams
			);
			const newAppointmentDetails = await getAppointmentDetails(
				newAppointment.rows[0].id
			);
			notifyWebhook( "NEW_PENDING_APPOINTMENT", newAppointmentDetails );
			res.status( 201 ).json( newAppointmentDetails );
		} catch ( err ) {
			console.error(
				`[ERRO GRAVE] Falha na rota POST /api/appointments: ${ err.message }`
			);
			if ( !res.headersSent ) {
				res.status( 500 ).send( "Erro no Servidor ao criar agendamento." );
			}
		}
	} );
	app.post( "/api/auth/register", async ( req, res ) => {
		try {
			const { name, phone, password } = req.body;
			const userExists = await pool.query(
				"SELECT * FROM users WHERE phone = $1",
				[phone]
			);
			if ( userExists.rows.length > 0 ) {
				return res
					.status( 400 )
					.json( { message: "Já existe uma conta com este número de telefone." } );
			}
			const salt = await bcrypt.genSalt( 10 );
			const hashedPassword = await bcrypt.hash( password, salt );
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
			res.status( 201 ).json( { token, user: newUser.rows[0] } );
		} catch ( err ) {
			console.error( err.message );
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.post( "/api/auth/login", async ( req, res ) => {
		try {
			const { phone, password } = req.body;
			const user = await pool.query( "SELECT * FROM users WHERE phone = $1", [
				phone,
			] );
			if ( user.rows.length === 0 ) {
				return res.status( 400 ).json( { message: "Credenciais inválidas." } );
			}
			const validPassword = await bcrypt.compare( password, user.rows[0].password );
			if ( !validPassword ) {
				return res.status( 400 ).json( { message: "Credenciais inválidas." } );
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
			res.json( { token, user: userData } );
		} catch ( err ) {
			console.error( err.message );
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.get( "/api/my-appointments", authenticateToken, async ( req, res ) => {
		try {
			const userId = req.user.id;
			const query = ` SELECT a.id, a.appointment_time, a.status, s.name as service_name, b.name as barber_name FROM appointments a JOIN services s ON a.service_id = s.id JOIN barbers b ON a.barber_id = b.id WHERE a.user_id = $1 ORDER BY a.appointment_time DESC `;
			const userAppointments = await pool.query( query, [userId] );
			res.json( userAppointments.rows );
		} catch ( err ) {
			console.error( err.message );
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.get( "/api/services", async ( req, res ) => {
		try {
			const services = await pool.query(
				"SELECT * FROM services WHERE is_active = true ORDER BY name ASC"
			);
			res.json( services.rows );
		} catch ( err ) {
			console.error( err.message );
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.get( "/api/barbers", async ( req, res ) => {
		try {
			const barbers = await pool.query(
				"SELECT * FROM barbers WHERE is_active = true ORDER BY name ASC"
			);
			res.json( barbers.rows );
		} catch ( err ) {
			console.error( err.message );
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.get( "/api/appointments/:barberId/:date", async ( req, res ) => {
		try {
			const { barberId, date } = req.params;
			const query = ` SELECT TO_CHAR(a.appointment_time, 'HH24:MI') as time, s.duration FROM appointments a JOIN services s ON a.service_id = s.id WHERE a.barber_id = $1 AND a.appointment_time::date = $2 AND a.status = 'confirmed' `;
			const appointments = await pool.query( query, [barberId, date] );
			res.json( appointments.rows );
		} catch ( err ) {
			console.error(
				`[ERRO] na rota /api/appointments/:barberId/:date: ${ err.message }`
			);
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.get( "/api/admin/appointments", async ( req, res ) => {
		try {
			const query = ` SELECT a.id, a.customer_name, a.customer_phone, a.appointment_time, a.status, s.name as service_name, b.name as barber_name FROM appointments a LEFT JOIN services s ON a.service_id = s.id LEFT JOIN barbers b ON a.barber_id = b.id ORDER BY a.appointment_time DESC`;
			const appointments = await pool.query( query );
			res.json( appointments.rows );
		} catch ( err ) {
			console.error( err.message );
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.post( "/api/admin/appointments/:id/confirm", async ( req, res ) => {
		try {
			const { id } = req.params;
			const updatedAppointment = await pool.query(
				"UPDATE appointments SET status = 'confirmed' WHERE id = $1 RETURNING *",
				[id]
			);
			const appointmentDetails = await getAppointmentDetails(
				updatedAppointment.rows[0].id
			);
			notifyWebhook( "APPOINTMENT_CONFIRMED", appointmentDetails );
			res.json( appointmentDetails );
		} catch ( err ) {
			console.error( err.message );
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.post( "/api/admin/appointments/:id/deny", async ( req, res ) => {
		try {
			const { id } = req.params;
			const updatedAppointment = await pool.query(
				"UPDATE appointments SET status = 'denied' WHERE id = $1 RETURNING *",
				[id]
			);
			const appointmentDetails = await getAppointmentDetails(
				updatedAppointment.rows[0].id
			);
			notifyWebhook( "APPOINTMENT_DENIED", appointmentDetails );
			res.json( appointmentDetails );
		} catch ( err ) {
			console.error( err.message );
			res.status( 500 ).send( "Erro no Servidor" );
		}
	} );
	app.get( "/api/admin/services", async ( req, res ) => {
		try {
			const r = await pool.query( "SELECT * FROM services ORDER BY id ASC" );
			res.json( r.rows );
		} catch ( e ) {
			res.status( 500 ).send( "Erro" );
		}
	} );
	app.post( "/api/admin/services", async ( req, res ) => {
		try {
			const { name, price, duration } = req.body;
			const r = await pool.query(
				"INSERT INTO services (name, price, duration) VALUES ($1, $2, $3) RETURNING *",
				[name, price, duration]
			);
			res.json( r.rows[0] );
		} catch ( e ) {
			res.status( 500 ).send( "Erro" );
		}
	} );
	app.put( "/api/admin/services/:id", async ( req, res ) => {
		try {
			const { id } = req.params;
			const { name, price, duration } = req.body;
			const r = await pool.query(
				"UPDATE services SET name = $1, price = $2, duration = $3 WHERE id = $4 RETURNING *",
				[name, price, duration, id]
			);
			res.json( r.rows[0] );
		} catch ( e ) {
			res.status( 500 ).send( "Erro" );
		}
	} );
	app.patch( "/api/admin/services/:id/status", async ( req, res ) => {
		try {
			const { id } = req.params;
			const { is_active } = req.body;
			const r = await pool.query(
				"UPDATE services SET is_active = $1 WHERE id = $2 RETURNING *",
				[is_active, id]
			);
			res.json( r.rows[0] );
		} catch ( e ) {
			res.status( 500 ).send( "Erro" );
		}
	} );
	app.get( "/api/admin/barbers", async ( req, res ) => {
		try {
			const r = await pool.query( "SELECT * FROM barbers ORDER BY id ASC" );
			res.json( r.rows );
		} catch ( e ) {
			res.status( 500 ).send( "Erro" );
		}
	} );
	app.post( "/api/admin/barbers", async ( req, res ) => {
		try {
			const { name } = req.body;
			const r = await pool.query(
				"INSERT INTO barbers (name) VALUES ($1) RETURNING *",
				[name]
			);
			res.json( r.rows[0] );
		} catch ( e ) {
			res.status( 500 ).send( "Erro" );
		}
	} );
	app.put( "/api/admin/barbers/:id", async ( req, res ) => {
		try {
			const { id } = req.params;
			const { name } = req.body;
			const r = await pool.query(
				"UPDATE barbers SET name = $1 WHERE id = $2 RETURNING *",
				[name, id]
			);
			res.json( r.rows[0] );
		} catch ( e ) {
			res.status( 500 ).send( "Erro" );
		}
	} );
	app.patch( "/api/admin/barbers/:id/status", async ( req, res ) => {
		try {
			const { id } = req.params;
			const { is_active } = req.body;
			const r = await pool.query(
				"UPDATE barbers SET is_active = $1 WHERE id = $2 RETURNING *",
				[is_active, id]
			);
			res.json( r.rows[0] );
		} catch ( e ) {
			res.status( 500 ).send( "Erro" );
		}

	} );

	// Inicia o servidor
	app.listen( PORT, "0.0.0.0", async () => {
		try {
			await pool.query( "SELECT NOW()" );
			console.log(
				"✅ Conexão com a base de dados PostgreSQL estabelecida com sucesso!"
			);
			console.log( `🚀 Servidor a correr na porta ${ PORT }` );
		} catch ( err ) {
			console.error( "❌ Erro ao conectar à base de dados:", err.message );
		}
	} );
} );
