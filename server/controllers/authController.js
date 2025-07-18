const pool = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
	try {
		const { name, phone, password } = req.body;
		const userExists = await pool.query(
			"SELECT * FROM users WHERE phone = $1",
			[phone]
		);
		if (userExists.rows.length > 0) {
			return res
				.status(409)
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
		console.error(`[ERRO] em authController.register: ${err.message}`);
		res.status(500).json({ message: "Erro no servidor ao tentar registar." });
	}
};

exports.login = async (req, res) => {
	try {
		const { phone, password } = req.body;
		const userResult = await pool.query(
			"SELECT * FROM users WHERE phone = $1",
			[phone]
		);
		if (userResult.rows.length === 0) {
			return res
				.status(401)
				.json({ message: "Telefone ou palavra-passe inválidos." });
		}
		const user = userResult.rows[0];
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res
				.status(401)
				.json({ message: "Telefone ou palavra-passe inválidos." });
		}
		const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
			expiresIn: "24h",
		});
		const userData = { id: user.id, name: user.name, phone: user.phone };
		res.json({ token, user: userData });
	} catch (err) {
		console.error(`[ERRO] em authController.login: ${err.message}`);
		res
			.status(500)
			.json({ message: "Erro no servidor ao tentar fazer login." });
	}
};
